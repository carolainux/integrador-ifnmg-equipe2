import { PlantacaoModel } from '../models/plantacao.model';
import { DispositivoModel } from '../models/dispositivo.model';
import { findOrThrow } from '../utils/find-or-throw';

interface CriarPlantacaoDados {
  usuario_id: string;
  dispositivo_id: string;
  nome: string;
  tipo: string;
  data_inicio: Date;
  data_colheita?: Date;
  data_proximo_plantio?: Date;
  descricao?: string;
}

interface AtualizarPlantacaoDados {
  nome?: string;
  tipo?: string;
  data_inicio?: Date;
  data_colheita?: Date;
  data_proximo_plantio?: Date;
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
      descricao: dados.descricao,
    };

    const resultado = await PlantacaoModel.criar(plantacaoDados);

    await DispositivoModel.atualizar(dados.dispositivo_id, { status: true });

    return resultado;
  },

  async buscarPorId(id: string) {
    return await findOrThrow(PlantacaoModel, id, 'plantação', true);
  },

  async buscarTodos() {
    return await PlantacaoModel.buscarTodos();
  },

  async buscarPorUsuario(usuario_id: string) {
    return await PlantacaoModel.buscarPorUsuario(usuario_id);
  },

  async atualizar(id: string, dados: AtualizarPlantacaoDados) {
    await PlantacaoService.buscarPorId(id);
    return await PlantacaoModel.atualizar(id, dados);
  },

  async deletar(id: string) {
    const plantacao = await PlantacaoService.buscarPorId(id);
    await PlantacaoModel.deletar(id);
    await DispositivoModel.atualizar(plantacao.dispositivo_id, { status: false });
    return { mensagem: 'Plantação removida com sucesso.' };
  },
};
