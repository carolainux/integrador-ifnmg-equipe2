import { Request, Response, NextFunction } from 'express';
import { LeituraService } from '../services/leitura.service';
import { parseId } from '../utils/parse-id';

export const LeituraController = {
  async criar(req: Request, res: Response, _next: NextFunction) {
    const leitura = await LeituraService.criar(req.body);

    return res.status(201).json({
      mensagem: 'Dados dos sensores processados com sucesso.',
      dados: leitura,
    });
  },

  async buscarTodos(req: Request, res: Response, _next: NextFunction) {
    const pagina = Number(req.query.pagina) || undefined;
    const limite = Number(req.query.limite) || undefined;
    const leituras = await LeituraService.buscarTodos(pagina, limite);
    return res.status(200).json(leituras);
  },

  async obterDadosDashboard(req: Request, res: Response, _next: NextFunction) {
    const plantacao_id = parseId(req, 'plantacao_id');
    const dashboardDados = await LeituraService.obterDadosDashboard(plantacao_id);
    return res.status(200).json(dashboardDados);
  },

  async obterHistorico(req: Request, res: Response, _next: NextFunction) {
    const plantacao_id = parseId(req, 'plantacao_id');
    const periodo = typeof req.query.periodo === 'string' ? req.query.periodo : '24h';
    const limite = Math.min(Math.max(Number(req.query.limite) || 20, 1), 200);
    const historico = await LeituraService.obterHistorico(plantacao_id, periodo, limite);
    return res.status(200).json(historico);
  },

  async buscarPorId(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const leitura = await LeituraService.buscarPorId(id);
    return res.status(200).json(leitura);
  },

  async atualizar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const leituraAtualizada = await LeituraService.atualizar(id, req.body);
    return res.status(200).json({
      mensagem: 'Leitura atualizada com sucesso.',
      dados: leituraAtualizada,
    });
  },

  async deletar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const resultado = await LeituraService.deletar(id);
    return res.status(200).json(resultado);
  },
};
