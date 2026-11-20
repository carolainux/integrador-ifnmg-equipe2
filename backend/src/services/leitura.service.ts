import { Prisma, tipoSensor } from '../../generated/prisma/client';
import { AlertaService } from './alerta.service';
import { LeituraModel } from '../models/leitura.model';
import { PlantacaoSensorModel } from '../models/plantacao-sensor.model';
import { exigirPlantacao, verificarDono } from '../utils/authz';
import { findOrThrow } from '../utils/find-or-throw';

type CamposLeitura = Pick<Prisma.LeituraCreateInput, 'temperatura' | 'umidade_ar' | 'umidade_solo' | 'luminosidade'>;

interface CriarLeituraDados extends CamposLeitura {
  plantacao_id: string;
}

const tipoParaCampo: Record<tipoSensor, keyof CamposLeitura> = {
  [tipoSensor.temperatura]: 'temperatura',
  [tipoSensor.umidade_ar]: 'umidade_ar',
  [tipoSensor.umidade_solo]: 'umidade_solo',
  [tipoSensor.luminosidade]: 'luminosidade',
};

const periodos = {
  '24h': { horas: 24, bucketSegundos: 10 * 60 },
  '7d': { horas: 7 * 24, bucketSegundos: 60 * 60 },
  '30d': { horas: 30 * 24, bucketSegundos: 6 * 60 * 60 },
  '90d': { horas: 90 * 24, bucketSegundos: 24 * 60 * 60 },
  '180d': { horas: 180 * 24, bucketSegundos: 2 * 24 * 60 * 60 },
  '365d': { horas: 365 * 24, bucketSegundos: 7 * 24 * 60 * 60 },
} as const;

type Periodo = keyof typeof periodos;

function csvValor(valor: string | number | null | undefined): string {
  const texto = valor == null ? '' : String(valor);
  return /[",\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export const LeituraService = {
  async criar(payload: CriarLeituraDados) {
    const vinculos = await PlantacaoSensorModel.buscarPorPlantacao(payload.plantacao_id);

    const dadosFiltrados: Record<string, number | undefined | null> = {
      temperatura: undefined,
      umidade_ar: undefined,
      umidade_solo: undefined,
      luminosidade: undefined,
    };

    for (const vinculo of vinculos) {
      const campoFonte = tipoParaCampo[vinculo.sensor.tipo as tipoSensor];
      if (campoFonte && payload[campoFonte] !== undefined) {
        dadosFiltrados[campoFonte] = payload[campoFonte];
      }
    }

    const resultado = await LeituraModel.criar({
      plantacao_id: payload.plantacao_id,
      ...dadosFiltrados,
    });

    await AlertaService.gerarAlertasParaLeitura(resultado.id, payload.plantacao_id);

    return resultado;
  },

  async buscarTodos(pagina?: number, limite?: number, usuario_id?: string) {
    return await LeituraModel.buscarTodos(pagina, limite, usuario_id);
  },

  async exportarCsv(usuario_id: string) {
    const leituras = await LeituraModel.buscarParaExportacao(usuario_id);
    const cabecalho = ['plantacao', 'data_hora', 'umidade_solo', 'umidade_ar', 'temperatura', 'luminosidade'];
    const linhas = leituras.map(leitura => [
      leitura.plantacao.nome,
      leitura.data_hora.toISOString(),
      leitura.umidade_solo,
      leitura.umidade_ar,
      leitura.temperatura,
      leitura.luminosidade,
    ]);

    return [cabecalho, ...linhas]
      .map(linha => linha.map(csvValor).join(','))
      .join('\r\n');
  },

  async buscarPorId(id: string, usuario_id?: string) {
    const leitura = await findOrThrow(LeituraModel, id, 'leitura', true);
    if (usuario_id) verificarDono(leitura.plantacao.usuario_id, usuario_id);
    return leitura;
  },

  async obterDadosDashboard(plantacao_id: string, usuario_id?: string) {
    if (usuario_id) await exigirPlantacao(plantacao_id, usuario_id);
    return await LeituraModel.buscarDadosDashboard(plantacao_id);
  },

  async obterHistorico(plantacao_id: string, periodo: string, limite: number, usuario_id?: string) {
    if (usuario_id) await exigirPlantacao(plantacao_id, usuario_id);
    const config = periodos[periodo as Periodo];
    if (!config) {
      throw Object.assign(new Error('Período inválido. Use 24h, 7d, 30d, 90d, 180d ou 365d.'), { status: 400 });
    }

    const desde = new Date(Date.now() - config.horas * 60 * 60 * 1000);
    const [{ leituras, total }, grafico, maxTemperatura] = await Promise.all([
      LeituraModel.buscarHistorico(plantacao_id, limite),
      LeituraModel.buscarSerieGrafico(plantacao_id, desde, config.bucketSegundos),
      LeituraModel.buscarMaxTemperatura(plantacao_id, desde),
    ]);

    return { periodo, leituras, grafico, total_leituras: total, max_temperatura: maxTemperatura };
  },

  async atualizar(id: string, dados: Prisma.LeituraUpdateInput, usuario_id?: string) {
    await LeituraService.buscarPorId(id, usuario_id);
    return await LeituraModel.atualizar(id, dados);
  },

  async deletar(id: string, usuario_id?: string) {
    await LeituraService.buscarPorId(id, usuario_id);
    await LeituraModel.deletar(id);
    return { mensagem: 'Leitura removida com sucesso.' };
  },
};
