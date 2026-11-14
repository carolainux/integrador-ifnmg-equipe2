import { prisma } from '../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const UsuarioModel = {
  async criar(data: Prisma.UsuarioCreateInput) {
    return await prisma.usuario.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        criado_em: true,
        notif_temperatura: true,
        notif_umidade_solo: true,
        notif_umidade_ar: true,
        notif_luminosidade: true,
        notif_sensor_offline: true,
      },
    });
  },

  async buscarPorId(id: string) {
    return await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        criado_em: true,
        notif_temperatura: true,
        notif_umidade_solo: true,
        notif_umidade_ar: true,
        notif_luminosidade: true,
        notif_sensor_offline: true,
      },
    });
  },

  async buscarPreferenciasNotificacao(id: string) {
    return await prisma.usuario.findUnique({
      where: { id },
      select: {
        notif_temperatura: true,
        notif_umidade_solo: true,
        notif_umidade_ar: true,
        notif_luminosidade: true,
        notif_sensor_offline: true,
      },
    });
  },

  async buscarPorEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        criado_em: true,
      },
    });
  },

  async buscarPorEmailComSenha(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  },

  async buscarPorEmailParaRecuperacao(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        reset_token_expira_em: true,
      },
    });
  },

  async salvarTokenRecuperacao(id: string, token_hash: string, reset_token_expira_em: Date) {
    return await prisma.usuario.update({
      where: { id },
      data: { reset_token_hash: token_hash, reset_token_expira_em },
      select: { id: true },
    });
  },

  async buscarPorResetTokenHash(token_hash: string) {
    return await prisma.usuario.findFirst({
      where: { reset_token_hash: token_hash },
      select: {
        id: true,
        reset_token_expira_em: true,
      },
    });
  },

  async redefinirSenhaComToken(id: string, token_hash: string, senha: string) {
    return await prisma.usuario.updateMany({
      where: { id, reset_token_hash: token_hash },
      data: {
        senha,
        reset_token_hash: null,
        reset_token_expira_em: null,
      },
    });
  },

  async buscarTodos() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        criado_em: true,
      },
    });
  },

  async atualizar(id: string, data: Prisma.UsuarioUpdateInput) {
    return await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        criado_em: true,
        notif_temperatura: true,
        notif_umidade_solo: true,
        notif_umidade_ar: true,
        notif_luminosidade: true,
        notif_sensor_offline: true,
      },
    });
  },

  async deletar(id: string) {
    return await prisma.usuario.delete({
      where: { id },
    });
  },
};
