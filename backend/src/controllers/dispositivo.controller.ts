import { Request, Response, NextFunction } from 'express';
import { DispositivoModel } from '../models/dispositivo.model';
import { verificarDono, usuarioId } from '../utils/authz';
import { findOrThrow } from '../utils/find-or-throw';
import { parseId } from '../utils/parse-id';

const LIMITE_ONLINE_MS = 10 * 60 * 1000;

type DispositivoComVinculo = {
  plantacao: {
    usuario_id: string;
    leituras: { data_hora: Date }[];
  } | null;
};

function dispositivoDoUsuario(dispositivo: DispositivoComVinculo, usuario_id: string): boolean {
  return !dispositivo.plantacao || dispositivo.plantacao.usuario_id === usuario_id;
}

function comStatusConexao<T extends DispositivoComVinculo>(dispositivo: T) {
  const ultima_comunicacao = dispositivo.plantacao?.leituras[0]?.data_hora ?? null;
  const online = dispositivo.plantacao
    ? ultima_comunicacao !== null && Date.now() - new Date(ultima_comunicacao).getTime() <= LIMITE_ONLINE_MS
    : null;

  return { ...dispositivo, online, ultima_comunicacao };
}

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
    if (!dispositivoDoUsuario(dispositivo, usuarioId(req))) {
      verificarDono(dispositivo.plantacao!.usuario_id, usuarioId(req));
    }
    return res.status(200).json(comStatusConexao(dispositivo));
  },

  async buscarTodos(req: Request, res: Response, _next: NextFunction) {
    const usuario_id = usuarioId(req);
    const dispositivos = (await DispositivoModel.buscarTodos())
      .filter(d => dispositivoDoUsuario(d, usuario_id))
      .map(comStatusConexao);
    return res.status(200).json(dispositivos);
  },

  async atualizar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const dispositivo = await findOrThrow(DispositivoModel, id, 'dispositivo');
    if (!dispositivoDoUsuario(dispositivo, usuarioId(req))) {
      verificarDono(dispositivo.plantacao!.usuario_id, usuarioId(req));
    }
    const dispositivoAtualizado = await DispositivoModel.atualizar(id, req.body);
    return res.status(200).json({
      mensagem: 'Dispositivo atualizado com sucesso.',
      dados: dispositivoAtualizado,
    });
  },

  async deletar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const dispositivo = await findOrThrow(DispositivoModel, id, 'dispositivo');
    if (!dispositivoDoUsuario(dispositivo, usuarioId(req))) {
      verificarDono(dispositivo.plantacao!.usuario_id, usuarioId(req));
    }
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
