import { prisma } from '../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const PlantacaoModel = {
  async criar(data: Prisma.PlantacaoUncheckedCreateInput) {
    return await prisma.plantacao.create({
      data,
      include: {
        dispositivo: true,
        sensores: {
          include: {
            sensor: true,
          },
        },
      },
    });
  },

  async buscarPorId(id: string) {
    return await prisma.plantacao.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        dispositivo: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            status: true,
          },
        },
        sensores: {
          include: {
            sensor: true,
          },
        },
      },
    });
  },

  async buscarPorUsuario(usuario_id: string) {
    return await prisma.plantacao.findMany({
      where: { usuario_id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
        dispositivo: {
          select: {
            id: true,
            nome: true,
          },
        },
        sensores: {
          include: {
            sensor: true,
          },
        },
      },
    });
  },

  async atualizar(id: string, data: Prisma.PlantacaoUpdateInput) {
    return await prisma.plantacao.update({
      where: { id },
      data,
      include: {
        sensores: {
          include: {
            sensor: true,
          },
        },
      },
    });
  },

  async deletar(id: string) {
    return await prisma.plantacao.delete({
      where: { id },
    });
  },
};
