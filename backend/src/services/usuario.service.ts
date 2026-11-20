import bcrypt from 'bcryptjs';
import { Prisma } from '../../generated/prisma/client';
import { UsuarioModel } from "../models/usuario.model";
import { findOrThrow } from '../utils/find-or-throw';

export const UsuarioService = {
  async criar(dados: Prisma.UsuarioCreateInput) {
    const usuarioExistente = await UsuarioModel.buscarPorEmail(dados.email);
    if (usuarioExistente) {
      throw new Error('O endereço de e-mail já está sendo usado por outro usuário.')
    }

    const dadosComHash = {
      ...dados,
      senha: await bcrypt.hash(dados.senha, 10)
    }

    return await UsuarioModel.criar(dadosComHash);
  },

  async buscarPorId(id: string) {
    return await findOrThrow(UsuarioModel, id, 'usuário');
  },

  async atualizar(id: string, dados: Prisma.UsuarioUpdateInput) {
    await UsuarioService.buscarPorId(id);

    if (dados.email && typeof dados.email === 'string') {
      const usuarioComMesmoEmail = await UsuarioModel.buscarPorEmail(dados.email);
      if (usuarioComMesmoEmail && usuarioComMesmoEmail.id !== id) {
        throw new Error('O e-mail informado já está em uso por outro usuário')
      }
    }

    if (dados.senha && typeof dados.senha === 'string') {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    return await UsuarioModel.atualizar(id, dados);
  },

  async deletar(id: string) {
    await UsuarioService.buscarPorId(id);

    await UsuarioModel.deletar(id);
    return { mensagem: 'Usuário removido do sistema com sucesso.' }
  },
};
