import { prisma } from '../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const LeituraModel = {
  async criar(data: Prisma.LeituraUncheckedCreateInput) {
    return await prisma.leitura.create({
      data,
    });
  },

  async buscarTodos(pagina: number = 1, limite: number = 50, usuario_id?: string) {
    const where: Prisma.LeituraWhereInput = usuario_id ? { plantacao: { usuario_id } } : {};
    const [dados, total] = await Promise.all([
      prisma.leitura.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { data_hora: 'desc' },
        include: { plantacao: { select: { id: true, nome: true } } },
      }),
      prisma.leitura.count({ where }),
    ]);
    return { dados, total, pagina, totalPaginas: Math.ceil(total / limite) };
  },

  async buscarPorId(id: string) {
    return await prisma.leitura.findUnique({
      where: { id },
      include: { plantacao: { select: { id: true, nome: true, usuario_id: true } } },
    });
  },

  async buscarParaExportacao(usuario_id: string) {
    return await prisma.leitura.findMany({
      where: { plantacao: { usuario_id } },
      orderBy: { data_hora: 'desc' },
      include: { plantacao: { select: { nome: true } } },
    });
  },

  async buscarDadosDashboard(plantacao_id: string) {
    const [ultima, agregado, totalLeituras, totalAlertas] = await Promise.all([
      prisma.leitura.findFirst({
        where: { plantacao_id },
        orderBy: { data_hora: 'desc' },
      }),
      prisma.leitura.aggregate({
        where: { plantacao_id },
        _avg: { temperatura: true, umidade_solo: true, umidade_ar: true, luminosidade: true },
      }),
      prisma.leitura.count({ where: { plantacao_id } }),
      prisma.alerta.count({ where: { leitura: { plantacao_id } } }),
    ]);

    return { ultima, medias: agregado._avg, total_leituras: totalLeituras, total_alertas: totalAlertas };
  },

  async buscarHistorico(plantacao_id: string, limite: number) {
    const [leituras, total] = await Promise.all([
      prisma.leitura.findMany({
        where: { plantacao_id },
        orderBy: { data_hora: 'desc' },
        take: limite,
      }),
      prisma.leitura.count({ where: { plantacao_id } }),
    ]);

    return { leituras, total };
  },

  async buscarSerieGrafico(plantacao_id: string, desde: Date, bucketSegundos: number) {
    const desdeSegundos = Math.floor(desde.getTime() / 1000);

    return await prisma.$queryRaw<{
      data_hora: string;
      temperatura: number | null;
      umidade_solo: number | null;
      umidade_ar: number | null;
    }[]>`
      SELECT
        strftime('%Y-%m-%dT%H:%M:%SZ',
          (CAST(strftime('%s', data_hora) AS INTEGER) / CAST(${bucketSegundos} AS INTEGER)) * CAST(${bucketSegundos} AS INTEGER),
          'unixepoch') AS data_hora,
        AVG(temperatura) AS temperatura,
        AVG(umidade_solo) AS umidade_solo,
        AVG(umidade_ar) AS umidade_ar
      FROM leitura
      WHERE plantacao_id = ${plantacao_id}
        AND CAST(strftime('%s', data_hora) AS INTEGER) >= ${desdeSegundos}
      GROUP BY CAST(strftime('%s', data_hora) AS INTEGER) / CAST(${bucketSegundos} AS INTEGER)
      ORDER BY CAST(strftime('%s', data_hora) AS INTEGER) / CAST(${bucketSegundos} AS INTEGER) ASC
    `;
  },

  async buscarMaxTemperatura(plantacao_id: string, desde: Date) {
    const agregado = await prisma.leitura.aggregate({
      where: {
        plantacao_id,
        data_hora: { gte: desde },
      },
      _max: { temperatura: true },
    });
    return agregado._max.temperatura;
  },

  async atualizar(id: string, data: Prisma.LeituraUpdateInput) {
    return await prisma.leitura.update({
      where: { id },
      data,
    });
  },

  async deletar(id: string) {
    return await prisma.leitura.delete({ where: { id } });
  },
};
