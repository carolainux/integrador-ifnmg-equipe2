import { Prisma } from '../../generated/prisma/client';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ erro: 'Já existe um registro com este valor único.' });
    }
    if (err.code === 'P2003') {
      return res.status(409).json({ erro: 'Não foi possível concluir por um vínculo inválido com outro registro.' });
    }
    if (err.code === 'P2014') {
      return res.status(409).json({ erro: 'Este sensor já está vinculado a uma plantação.' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ erro: 'Registro não encontrado.' });
    }
  }

  const status = err.status || 400;
  return res.status(status).json({ erro: err.message });
}
