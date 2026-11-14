import { tipoAlerta, direcaoAlerta } from '../../generated/prisma/client';
import { AlertaModel } from '../models/alerta.model';
import { LeituraModel } from '../models/leitura.model';
import { PlantacaoModel } from '../models/plantacao.model';
import { PlantacaoSensorModel } from '../models/plantacao-sensor.model';
import { UsuarioModel } from '../models/usuario.model';
import { findOrThrow } from '../utils/find-or-throw';
import { enviarWhatsApp } from './whatsapp.service';

interface CriarAlertaDados {
  leitura_id: string;
  usuario_id: string;
  tipo: tipoAlerta;
  mensagem: string;
  notificacao?: boolean;
}

export const AlertaService = {
  async criar(dados: CriarAlertaDados) {
    const alertaDados = {
      tipo: dados.tipo,
      mensagem: dados.mensagem,
      notificacao: dados.notificacao ?? false,
      leitura: { connect: { id: dados.leitura_id } },
      usuario: { connect: { id: dados.usuario_id } },
    };
    return await AlertaModel.criar(alertaDados);
  },

  async buscarPorId(id: string) {
    return await findOrThrow(AlertaModel, id, 'alerta');
  },

  async buscarPorPlantacao(plantacao_id: string, limite?: number) {
    return await AlertaModel.buscarPorPlantacao(plantacao_id, limite);
  },

  async buscarPorUsuario(usuario_id: string) {
    return await AlertaModel.buscarPorUsuario(usuario_id);
  },

  async buscarTodos(pagina?: number, limite?: number) {
    return await AlertaModel.buscarTodos(pagina, limite);
  },

  async buscarResumo(plantacao_id: string) {
    return await AlertaModel.buscarResumo(plantacao_id);
  },

  async deletar(id: string) {
    await AlertaService.buscarPorId(id);
    await AlertaModel.deletar(id);
    return { mensagem: 'Alerta removido com sucesso.' };
  },

  async gerarAlertasParaLeitura(leitura_id: string, plantacao_id: string) {
    const [leitura, plantacao, vinculos] = await Promise.all([
      LeituraModel.buscarPorId(leitura_id),
      PlantacaoModel.buscarPorId(plantacao_id),
      PlantacaoSensorModel.buscarPorPlantacao(plantacao_id),
    ]);

    if (!leitura || !plantacao) return [];

    const preferencias = await UsuarioModel.buscarPreferenciasNotificacao(plantacao.usuario_id);
    const alertasParaCriar: { tipo: tipoAlerta; mensagem: string; sensor_tipo: string }[] = [];

    for (const vinculo of vinculos) {
      const valor = leitura[vinculo.sensor.tipo as keyof typeof leitura];

      if (typeof valor !== 'number') continue;

      const ehMenorQue = vinculo.sensor.direcao === direcaoAlerta.ABAIXO;

      const excedeuCritico = ehMenorQue
        ? valor <= vinculo.limite_critico
        : valor >= vinculo.limite_critico;

      const excedeuAtencao = ehMenorQue
        ? valor <= vinculo.limite_atencao
        : valor >= vinculo.limite_atencao;

      if (excedeuCritico) {
        alertasParaCriar.push({
          tipo: tipoAlerta.Critico,
          mensagem: `Alerta Crítico: ${vinculo.sensor.nome} atingiu ${valor}. Limite crítico: ${vinculo.limite_critico}.`,
          sensor_tipo: vinculo.sensor.tipo,
        });
      } else if (excedeuAtencao) {
        alertasParaCriar.push({
          tipo: tipoAlerta.Atencao,
          mensagem: `Alerta de Atenção: ${vinculo.sensor.nome} atingiu ${valor}. Limite de atenção: ${vinculo.limite_atencao}.`,
          sensor_tipo: vinculo.sensor.tipo,
        });
      }
    }

    if (alertasParaCriar.length === 0) return [];

    await AlertaModel.criarMultiplos(
      alertasParaCriar.map(alerta => ({
        leitura_id,
        usuario_id: plantacao.usuario_id,
        tipo: alerta.tipo,
        mensagem: alerta.mensagem,
      }))
    );

    const preferenciaPorTipo: Record<string, boolean | undefined> = {
      temperatura: preferencias?.notif_temperatura,
      umidade_solo: preferencias?.notif_umidade_solo,
      umidade_ar: preferencias?.notif_umidade_ar,
      luminosidade: preferencias?.notif_luminosidade,
    };

    alertasParaCriar.forEach(a => {
      if (preferenciaPorTipo[a.sensor_tipo] === false) return;
      enviarWhatsApp(a.mensagem).catch(erro => console.error('WhatsApp error:', erro));
    });

    return alertasParaCriar.map(alerta => ({ tipo: alerta.tipo, mensagem: alerta.mensagem }));
  },

  async notificarDispositivoOffline(plantacao_id: string, mensagem: string) {
    const plantacao = await PlantacaoModel.buscarPorId(plantacao_id);
    if (!plantacao) {
      throw Object.assign(new Error('Plantação não encontrada.'), { status: 404 });
    }

    const preferencias = await UsuarioModel.buscarPreferenciasNotificacao(plantacao.usuario_id);
    if (preferencias?.notif_sensor_offline === false) return false;

    await enviarWhatsApp(mensagem);
    return true;
  },
};
