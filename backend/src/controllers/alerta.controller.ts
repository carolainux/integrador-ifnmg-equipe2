import { Request, Response, NextFunction } from 'express';
import { AlertaService } from '../services/alerta.service';
import { parseId } from '../utils/parse-id';

export const AlertaController = {
  async criar(req: Request, res: Response, _next: NextFunction) {
    const novoAlerta = await AlertaService.criar(req.body);
    return res.status(201).json({
      mensagem: 'Alerta criado com sucesso.',
      dados: novoAlerta,
    });
  },

  async buscarPorId(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const alerta = await AlertaService.buscarPorId(id);
    return res.status(200).json(alerta);
  },

  async buscarPorPlantacao(req: Request, res: Response, _next: NextFunction) {
    const plantacao_id = parseId(req, 'plantacao_id');
    const limite = Math.min(Math.max(Number(req.query.limite) || 0, 0), 200) || undefined;
    const alertas = await AlertaService.buscarPorPlantacao(plantacao_id, limite);
    return res.status(200).json(alertas);
  },

  async buscarPorUsuario(req: Request, res: Response, _next: NextFunction) {
    const usuario_id = parseId(req, 'usuario_id');
    const alertas = await AlertaService.buscarPorUsuario(usuario_id);
    return res.status(200).json(alertas);
  },

  async buscarTodos(req: Request, res: Response, _next: NextFunction) {
    const pagina = Number(req.query.pagina) || undefined;
    const limite = Number(req.query.limite) || undefined;
    const alertas = await AlertaService.buscarTodos(pagina, limite);
    return res.status(200).json(alertas);
  },

  async buscarResumo(req: Request, res: Response, _next: NextFunction) {
    const plantacao_id = parseId(req, 'plantacao_id');
    const resumo = await AlertaService.buscarResumo(plantacao_id);
    return res.status(200).json(resumo);
  },

  async deletar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const resultado = await AlertaService.deletar(id);
    return res.status(200).json(resultado);
  },

  async notificarOffline(req: Request, res: Response, _next: NextFunction) {
    const { plantacao_id, mensagem } = req.body;

    if (!plantacao_id || !mensagem) {
      return res.status(400).json({ erro: 'plantacao_id e mensagem são obrigatórios.' });
    }

    const enviada = await AlertaService.notificarDispositivoOffline(plantacao_id, mensagem);
    return res.status(200).json({
      mensagem: enviada ? 'Notificação offline enviada com sucesso.' : 'Notificação offline desativada para este usuário.',
    });
  },
};
