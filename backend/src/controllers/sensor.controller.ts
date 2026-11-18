import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { tipoSensor } from '../../generated/prisma/client';
import { SensorModel } from '../models/sensor.model';
import { verificarDono, usuarioId } from '../utils/authz';
import { findOrThrow } from '../utils/find-or-throw';
import { parseId } from '../utils/parse-id';

type SensorComVinculo = {
  plantacoes: { plantacao: { usuario_id: string } } | null;
};

function sensorDoUsuario(sensor: SensorComVinculo, usuario_id: string): boolean {
  return !sensor.plantacoes || sensor.plantacoes.plantacao.usuario_id === usuario_id;
}

export const SensorController = {
  async criar(req: Request, res: Response, _next: NextFunction) {
    const novoSensor = await SensorModel.criar(req.body);
    return res.status(201).json({
      mensagem: 'Sensor cadastrado com sucesso.',
      dados: novoSensor,
    });
  },

  async buscarPorId(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const sensor = await findOrThrow(SensorModel, id, 'sensor');
    if (!sensorDoUsuario(sensor, usuarioId(req))) {
      verificarDono(sensor.plantacoes!.plantacao.usuario_id, usuarioId(req));
    }
    return res.status(200).json(sensor);
  },

  async buscarTodos(req: Request, res: Response, _next: NextFunction) {
    const usuario_id = usuarioId(req);
    const sensores = (await SensorModel.buscarTodos()).filter(s => sensorDoUsuario(s, usuario_id));
    return res.status(200).json(sensores);
  },

  async buscarPorTipo(req: Request, res: Response, _next: NextFunction) {
    const tipo = z.enum(tipoSensor).parse(req.params.tipo);
    const usuario_id = usuarioId(req);
    const sensores = (await SensorModel.buscarPorTipo(tipo)).filter(s => sensorDoUsuario(s, usuario_id));
    return res.status(200).json(sensores);
  },

  async atualizar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const sensor = await findOrThrow(SensorModel, id, 'sensor');
    if (!sensorDoUsuario(sensor, usuarioId(req))) {
      verificarDono(sensor.plantacoes!.plantacao.usuario_id, usuarioId(req));
    }
    const sensorAtualizado = await SensorModel.atualizar(id, req.body);
    return res.status(200).json({
      mensagem: 'Sensor atualizado com sucesso.',
      dados: sensorAtualizado,
    });
  },

  async deletar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const sensor = await findOrThrow(SensorModel, id, 'sensor');
    if (!sensorDoUsuario(sensor, usuarioId(req))) {
      verificarDono(sensor.plantacoes!.plantacao.usuario_id, usuarioId(req));
    }
    await SensorModel.deletar(id);
    return res.status(200).json({ mensagem: 'Sensor removido com sucesso.' });
  },
};
