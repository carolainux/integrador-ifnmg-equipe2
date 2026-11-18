import type { tipoCultura } from '../../generated/prisma/client';
import { PlantacaoModel } from '../models/plantacao.model';
import { DispositivoModel } from '../models/dispositivo.model';
import { SensorModel } from '../models/sensor.model';
import { findOrThrow } from '../utils/find-or-throw';
import { verificarDono } from '../utils/authz';

interface CriarPlantacaoDados {
  usuario_id: string;
  dispositivo_id: string;
  nome: string;
  tipo: tipoCultura;
  data_inicio: Date;
  data_colheita?: Date;
  data_proximo_plantio?: Date;
  tamanho_area?: number;
  unidade_area?: string;
  espacamento_plantas?: number;
  descricao?: string;
}

interface AtualizarPlantacaoDados {
  dispositivo_id?: string;
  nome?: string;
  tipo?: tipoCultura;
  data_inicio?: Date;
  data_colheita?: Date;
  data_proximo_plantio?: Date;
  tamanho_area?: number;
  unidade_area?: string;
  espacamento_plantas?: number;
  descricao?: string;
}

export const PlantacaoService = {
  async criar(dados: CriarPlantacaoDados) {
    const plantacaoDados = {
      usuario_id: dados.usuario_id,
      dispositivo_id: dados.dispositivo_id,
      nome: dados.nome,
      tipo: dados.tipo,
      data_inicio: dados.data_inicio,
      data_colheita: dados.data_colheita,
      data_proximo_plantio: dados.data_proximo_plantio,
      tamanho_area: dados.tamanho_area,
      unidade_area: dados.unidade_area,
      espacamento_plantas: dados.espacamento_plantas,
      descricao: dados.descricao,
    };

    const resultado = await PlantacaoModel.criar(plantacaoDados);

    await DispositivoModel.atualizar(dados.dispositivo_id, { status: true });

    return resultado;
  },

  async buscarPorId(id: string, usuario_id?: string) {
    const plantacao = await findOrThrow(PlantacaoModel, id, 'plantação', true);
    if (usuario_id) verificarDono(plantacao.usuario_id, usuario_id);
    return plantacao;
  },

  async buscarTodos(usuario_id: string) {
    return await PlantacaoModel.buscarPorUsuario(usuario_id);
  },

  async buscarPorUsuario(usuario_id: string) {
    return await PlantacaoModel.buscarPorUsuario(usuario_id);
  },

  async atualizar(id: string, dados: AtualizarPlantacaoDados, usuario_id: string) {
    const plantacao = await PlantacaoService.buscarPorId(id, usuario_id);
    const atualizada = await PlantacaoModel.atualizar(id, dados);

    if (dados.dispositivo_id && dados.dispositivo_id !== plantacao.dispositivo_id) {
      await DispositivoModel.atualizar(plantacao.dispositivo_id, { status: false });
      await DispositivoModel.atualizar(dados.dispositivo_id, { status: true });
    }

    return atualizada;
  },

  async deletar(id: string, usuario_id: string) {
    const plantacao = await PlantacaoService.buscarPorId(id, usuario_id);
    const sensores = plantacao.sensores;
    await PlantacaoModel.deletar(id);
    for (const vinculo of sensores) {
      await SensorModel.atualizar(vinculo.sensor_id, { status: false });
    }
    await DispositivoModel.atualizar(plantacao.dispositivo_id, { status: false });
    return { mensagem: 'Plantação removida com sucesso.' };
  },
};
