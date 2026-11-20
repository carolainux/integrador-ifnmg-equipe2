import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { verificarDono, usuarioId } from '../utils/authz';
import { parseId } from '../utils/parse-id';

export const UsuarioController = {
  async criar(req: Request, res: Response, _next: NextFunction) {
    const novoUsuario = await UsuarioService.criar(req.body);
    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      dados: novoUsuario,
    });
  },

  async buscarPorId(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    verificarDono(id, usuarioId(req));
    const usuario = await UsuarioService.buscarPorId(id);
    return res.status(200).json(usuario);
  },

  async buscarTodos(req: Request, res: Response, _next: NextFunction) {
    const usuarios = [await UsuarioService.buscarPorId(usuarioId(req))];
    return res.status(200).json(usuarios);
  },

  async atualizar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    if (req.usuario?.id !== id) {
      return res.status(403).json({ erro: 'Você não tem permissão para alterar este usuário.' });
    }
    const usuarioAtualizado = await UsuarioService.atualizar(id, req.body);
    return res.status(200).json({
      mensagem: 'Os dados do usuário foram atualizados com sucesso.',
      dados: usuarioAtualizado,
    });
  },

  async deletar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    if (req.usuario?.id !== id) {
      return res.status(403).json({ erro: 'Você não tem permissão para deletar este usuário.' });
    }
    const resultado = await UsuarioService.deletar(id);
    return res.status(200).json(resultado);
  },
};
