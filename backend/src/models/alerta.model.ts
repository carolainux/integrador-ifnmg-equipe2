import { prisma } from '../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const AlertaModel = {
  async criar(data: Prisma.AlertaCreateInput) {
    return await prisma.alerta.create({
      data,
    });
  },

  async criarMultiplos(data: Prisma.AlertaCreateManyInput[]) {
    return await prisma.alerta.createMany({
      data,
    });
  },

  async buscarPorId(id: string) {
    return await prisma.alerta.findUnique({
      where: { id },
    });
  },

  async buscarPorPlantacao(plantacao_id: string, limite?: number) {
    return await prisma.alerta.findMany({
      where: { leitura: { plantacao_id } },
      orderBy: { gerado_em: 'desc' },
      take: limite,
    });
  },

  async buscarPorUsuario(usuario_id: string) {
    return await prisma.alerta.findMany({
      where: { usuario_id },
      orderBy: { gerado_em: 'desc' },
      include: {
        leitura: {
          select: {
            id: true,
            data_hora: true,
            plantacao: { select: { id: true, nome: true, tipo: true } },
          },
        },
      },
    });
  },

  async buscarTodos(pagina: number = 1, limite: number = 50, usuario_id?: string) {
    const where: Prisma.AlertaWhereInput = usuario_id ? { usuario_id } : {};
    const [dados, total] = await Promise.all([
      prisma.alerta.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { gerado_em: 'desc' },
      }),
      prisma.alerta.count({ where }),
    ]);
    return { dados, total, pagina, totalPaginas: Math.ceil(total / limite) };
  },

  async buscarResumo(plantacao_id: string) {
    const where = { leitura: { plantacao_id } };
    const [total, abertos, resolvidos, atencao, critico, ultimos7Dias, ultimo] = await Promise.all([
      prisma.alerta.count({ where }),
      prisma.alerta.count({ where: { ...where, resolvido_em: null } }),
      prisma.alerta.count({ where: { ...where, resolvido_em: { not: null } } }),
      prisma.alerta.count({ where: { ...where, tipo: 'Atencao', resolvido_em: null } }),
      prisma.alerta.count({ where: { ...where, tipo: 'Critico', resolvido_em: null } }),
      prisma.alerta.count({
        where: {
          ...where,
          resolvido_em: null,
          gerado_em: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.alerta.findFirst({
        where: { ...where, resolvido_em: null },
        orderBy: { gerado_em: 'desc' },
        select: { tipo: true, mensagem: true, gerado_em: true },
      }),
    ]);

    return { total, abertos, resolvidos, atencao, critico, ultimos_7_dias: ultimos7Dias, ultimo_alerta: ultimo };
  },

  async resolver(id: string) {
    return await prisma.alerta.update({
      where: { id },
      data: { resolvido_em: new Date() },
    });
  },

  async deletar(id: string) {
    return await prisma.alerta.delete({
      where: { id },
    });
  },
};
