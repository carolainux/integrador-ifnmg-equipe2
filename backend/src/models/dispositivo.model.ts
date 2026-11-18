import { prisma } from '../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const DispositivoModel = {
  async criar(data: Prisma.DispositivoCreateInput) {
    return await prisma.dispositivo.create({
      data,
    });
  },

  async buscarPorId(id: string) {
    return await prisma.dispositivo.findUnique({
      where: { id },
      include: {
        plantacao: {
          select: {
            id: true,
            nome: true,
            usuario_id: true,
            leituras: {
              orderBy: { data_hora: 'desc' },
              take: 1,
              select: { data_hora: true },
            },
          },
        },
      },
    });
  },

  async buscarTodos() {
    return await prisma.dispositivo.findMany({
      include: {
        plantacao: {
          select: {
            id: true,
            nome: true,
            usuario_id: true,
            leituras: {
              orderBy: { data_hora: 'desc' },
              take: 1,
              select: { data_hora: true },
            },
          },
        },
      },
    });
  },

  async atualizar(id: string, data: Prisma.DispositivoUpdateInput) {
    return await prisma.dispositivo.update({
      where: { id },
      data,
    });
  },

  async deletar(id: string) {
    return await prisma.dispositivo.delete({
      where: { id },
    });
  },
};
