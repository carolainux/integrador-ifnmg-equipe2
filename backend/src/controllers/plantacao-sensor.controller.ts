import { Request, Response, NextFunction } from 'express';
import { PlantacaoSensorService } from '../services/plantacao-sensor.service';
import { usuarioId } from '../utils/authz';
import { parseId } from '../utils/parse-id';

export const PlantacaoSensorController = {
  async criar(req: Request, res: Response, _next: NextFunction) {
    const novaAssociacao = await PlantacaoSensorService.criar(req.body, usuarioId(req));
    return res.status(201).json({
      mensagem: 'Sensor associado à plantação com sucesso.',
      dados: novaAssociacao,
    });
  },

  async buscarPorId(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const plantacaoSensor = await PlantacaoSensorService.buscarPorId(id, usuarioId(req));
    return res.status(200).json(plantacaoSensor);
  },

  async buscarPorPlantacao(req: Request, res: Response, _next: NextFunction) {
    const plantacao_id = parseId(req, 'plantacao_id');
    const sensores = await PlantacaoSensorService.buscarPorPlantacao(plantacao_id, usuarioId(req));
    return res.status(200).json(sensores);
  },

  async buscarPorSensor(req: Request, res: Response, _next: NextFunction) {
    const sensor_id = parseId(req, 'sensor_id');
    const plantacaoSensor = await PlantacaoSensorService.buscarPorSensor(sensor_id, usuarioId(req));
    return res.status(200).json(plantacaoSensor);
  },

  async atualizar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const plantacaoSensorAtualizado = await PlantacaoSensorService.atualizar(id, req.body, usuarioId(req));
    return res.status(200).json({
      mensagem: 'Associação plantação-sensor atualizada com sucesso.',
      dados: plantacaoSensorAtualizado,
    });
  },

  async deletar(req: Request, res: Response, _next: NextFunction) {
    const id = parseId(req);
    const resultado = await PlantacaoSensorService.deletar(id, usuarioId(req));
    return res.status(200).json(resultado);
  },

  async deletarPorPlantacao(req: Request, res: Response, _next: NextFunction) {
    const plantacao_id = parseId(req, 'plantacao_id');
    const resultado = await PlantacaoSensorService.deletarPorPlantacao(plantacao_id, usuarioId(req));
    return res.status(200).json(resultado);
  },
};
