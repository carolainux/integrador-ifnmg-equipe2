import { prisma } from '../lib/prisma';
import { Prisma, tipoSensor } from '../../generated/prisma/client';

export const SensorModel = {
  async criar(data: Prisma.SensorCreateInput) {
    return await prisma.sensor.create({
      data,
    });
  },

  async buscarPorId(id: string) {
    return await prisma.sensor.findUnique({
      where: { id },
      include: {
        plantacoes: {
          select: {
            plantacao_id: true,
            sensor_id: true,
            limite_atencao: true,
            limite_critico: true,
            plantacao: {
              select: {
                usuario_id: true,
              },
            },
          },
        },
      },
    });
  },

  async buscarTodos() {
    return await prisma.sensor.findMany({
      include: {
        plantacoes: {
          select: {
            plantacao_id: true,
            sensor_id: true,
            plantacao: {
              select: {
                id: true,
                nome: true,
                usuario_id: true,
                leituras: {
                  orderBy: { data_hora: 'desc' },
                  take: 1,
                  select: {
                    data_hora: true,
                    temperatura: true,
                    umidade_solo: true,
                    umidade_ar: true,
                    luminosidade: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async buscarPorTipo(tipo: tipoSensor) {
    return await prisma.sensor.findMany({
      where: { tipo },
      include: {
        plantacoes: {
          select: {
            plantacao: {
              select: {
                usuario_id: true,
              },
            },
          },
        },
      },
    });
  },

  async atualizar(id: string, data: Prisma.SensorUpdateInput) {
    return await prisma.sensor.update({
      where: { id },
      data,
    });
  },

  async deletar(id: string) {
    return await prisma.sensor.delete({
      where: { id },
    });
  },
};
