import { Request, Response, NextFunction } from 'express';
import { DispositivoModel } from '../models/dispositivo.model';
import { findOrThrow } from '../utils/find-or-throw';
import { parseId } from '../utils/parse-id';

export const DispositivoController = {
  async criar(req: Request, res: Response, _next: NextFunction) {
    const dados = {
      ...req.body,
      status: req.body.status ?? false,
    };
    const novoDispositivo = await DispositivoModel.criar(dados);
    return res.status(201).json({
      mensagem: 'Dispositivo cadastrado com sucesso.',
      dados: novoDispositivo,
    });
  },

  async buscarPorId(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const dispositivo = await findOrThrow(DispositivoModel, id, 'dispositivo');
    return res.status(200).json(dispositivo);
  },

  async buscarTodos(_req: Request, res: Response, _next: NextFunction) {
    const dispositivos = await DispositivoModel.buscarTodos();
    return res.status(200).json(dispositivos);
  },

  async atualizar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    await findOrThrow(DispositivoModel, id, 'dispositivo');
    const dispositivoAtualizado = await DispositivoModel.atualizar(id, req.body);
    return res.status(200).json({
      mensagem: 'Dispositivo atualizado com sucesso.',
      dados: dispositivoAtualizado,
    });
  },

  async deletar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const dispositivo = await findOrThrow(DispositivoModel, id, 'dispositivo');
    if (dispositivo.plantacao) {
      throw Object.assign(
        new Error(`Dispositivo vinculado à plantação "${dispositivo.plantacao.nome}". Desvincule-o antes de excluir.`),
        { status: 409 }
      );
    }
    await DispositivoModel.deletar(id);
    return res.status(200).json({ mensagem: 'Dispositivo removido com sucesso.' });
  },
};
