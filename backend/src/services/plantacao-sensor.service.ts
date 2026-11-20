import { PlantacaoSensorModel } from '../models/plantacao-sensor.model';
import { SensorModel } from '../models/sensor.model';
import { exigirPlantacao, verificarDono } from '../utils/authz';
import { findOrThrow } from '../utils/find-or-throw';

interface CriarPlantacaoSensorDados {
  plantacao_id: string;
  sensor_id: string;
  limite_atencao: number;
  limite_critico: number;
}

interface AtualizarPlantacaoSensorDados {
  limite_atencao?: number;
  limite_critico?: number;
}

export const PlantacaoSensorService = {
  async criar(dados: CriarPlantacaoSensorDados, usuario_id: string) {
    await exigirPlantacao(dados.plantacao_id, usuario_id);

    const sensor = await SensorModel.buscarPorId(dados.sensor_id);
    if (!sensor) {
      throw new Error(`Sensor com ID ${dados.sensor_id} não encontrado.`);
    }
    if (sensor.plantacoes) {
      verificarDono(sensor.plantacoes.plantacao.usuario_id, usuario_id);
    }

    const plantacaoSensorDados = {
      plantacao: { connect: { id: dados.plantacao_id } },
      sensor: { connect: { id: dados.sensor_id } },
      limite_atencao: dados.limite_atencao,
      limite_critico: dados.limite_critico,
    };

    const resultado = await PlantacaoSensorModel.criar(plantacaoSensorDados);

    await SensorModel.atualizar(dados.sensor_id, { status: true });

    return resultado;
  },

  async buscarPorId(id: string, usuario_id?: string) {
    const plantacaoSensor = await findOrThrow(PlantacaoSensorModel, id, 'associação plantação-sensor', true);
    if (usuario_id) verificarDono(plantacaoSensor.plantacao.usuario_id, usuario_id);
    return plantacaoSensor;
  },

  async buscarPorPlantacao(plantacao_id: string, usuario_id?: string) {
    if (usuario_id) await exigirPlantacao(plantacao_id, usuario_id);
    return await PlantacaoSensorModel.buscarPorPlantacao(plantacao_id);
  },

  async buscarPorSensor(sensor_id: string, usuario_id?: string) {
    const plantacaoSensor = await PlantacaoSensorModel.buscarPorSensor(sensor_id);
    if (!plantacaoSensor) {
      throw new Error(`Sensor ${sensor_id} não está vinculado a nenhuma plantação.`);
    }
    if (usuario_id) verificarDono(plantacaoSensor.plantacao.usuario_id, usuario_id);
    return plantacaoSensor;
  },

  async atualizar(id: string, dados: AtualizarPlantacaoSensorDados, usuario_id?: string) {
    await PlantacaoSensorService.buscarPorId(id, usuario_id);
    return await PlantacaoSensorModel.atualizar(id, dados);
  },

  async deletar(id: string, usuario_id?: string) {
    const vinculo = await PlantacaoSensorService.buscarPorId(id, usuario_id);
    await PlantacaoSensorModel.deletar(id);
    await SensorModel.atualizar(vinculo.sensor_id, { status: false });
    return { mensagem: 'Associação plantação-sensor removida com sucesso.' };
  },

  async deletarPorPlantacao(plantacao_id: string, usuario_id?: string) {
    if (usuario_id) await exigirPlantacao(plantacao_id, usuario_id);
    const sensores = await PlantacaoSensorModel.buscarPorPlantacao(plantacao_id);
    if (sensores.length === 0) {
      throw new Error(`Nenhum sensor vinculado à plantação ${plantacao_id}.`);
    }

    for (const vinculo of sensores) {
      await SensorModel.atualizar(vinculo.sensor_id, { status: false });
    }

    await PlantacaoSensorModel.deletarPorPlantacao(plantacao_id);
    return { mensagem: `${sensores.length} sensor(es) desvinculado(s) da plantação.` };
  },
};
