import type { Request } from 'express';
import { LeituraModel } from '../models/leitura.model';
import { PlantacaoModel } from '../models/plantacao.model';

export function usuarioId(req: Request): string {
  return req.usuario!.id;
}

export function verificarDono(donoId: string | null | undefined, usuarioId: string): void {
  if (donoId !== usuarioId) {
    throw Object.assign(new Error('Você não tem permissão para acessar este registro.'), { status: 403 });
  }
}

export async function exigirPlantacao(plantacao_id: string, usuario_id: string) {
  const plantacao = await PlantacaoModel.buscarPorId(plantacao_id);
  if (!plantacao) {
    throw Object.assign(new Error('Plantação não encontrada.'), { status: 404 });
  }
  verificarDono(plantacao.usuario_id, usuario_id);
  return plantacao;
}

export async function exigirLeitura(leitura_id: string, usuario_id: string) {
  const leitura = await LeituraModel.buscarPorId(leitura_id);
  if (!leitura) {
    throw Object.assign(new Error('Leitura não encontrada.'), { status: 404 });
  }
  verificarDono(leitura.plantacao.usuario_id, usuario_id);
  return leitura;
}
