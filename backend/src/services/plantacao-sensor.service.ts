import { PlantacaoSensorModel } from '../models/plantacao-sensor.model';
import { SensorModel } from '../models/sensor.model';
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
  async criar(dados: CriarPlantacaoSensorDados) {
    const sensor = await SensorModel.buscarPorId(dados.sensor_id);
    if (!sensor) {
      throw new Error(`Sensor com ID ${dados.sensor_id} não encontrado.`);
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

  async buscarPorId(id: string) {
    return await findOrThrow(PlantacaoSensorModel, id, 'associação plantação-sensor', true);
  },

  async buscarPorPlantacao(plantacao_id: string) {
    return await PlantacaoSensorModel.buscarPorPlantacao(plantacao_id);
  },

  async buscarPorSensor(sensor_id: string) {
    const plantacaoSensor = await PlantacaoSensorModel.buscarPorSensor(sensor_id);
    if (!plantacaoSensor) {
      throw new Error(`Sensor ${sensor_id} não está vinculado a nenhuma plantação.`);
    }
    return plantacaoSensor;
  },

  async atualizar(id: string, dados: AtualizarPlantacaoSensorDados) {
    await PlantacaoSensorService.buscarPorId(id);
    return await PlantacaoSensorModel.atualizar(id, dados);
  },

  async deletar(id: string) {
    const vinculo = await PlantacaoSensorService.buscarPorId(id);
    await PlantacaoSensorModel.deletar(id);
    await SensorModel.atualizar(vinculo.sensor_id, { status: false });
    return { mensagem: 'Associação plantação-sensor removida com sucesso.' };
  },

  async deletarPorPlantacao(plantacao_id: string) {
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
