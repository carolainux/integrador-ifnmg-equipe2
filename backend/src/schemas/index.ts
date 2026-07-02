import { z } from 'zod';
import { tipoDispositivo, tipoSensor, tipoAlerta, direcaoAlerta } from '../../generated/prisma/client';

export const criarUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.email({ error: 'Email inválido' }),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  telefone: z.string(),
});

export const atualizarUsuarioSchema = criarUsuarioSchema.partial();

export const criarDispositivoSchema = z.object({
  nome: z.string(),
  tipo: z.enum(tipoDispositivo),
  status: z.boolean().optional(),
});

export const atualizarDispositivoSchema = criarDispositivoSchema.partial();

export const criarPlantacaoSchema = z.object({
  usuario_id: z.uuid(),
  dispositivo_id: z.uuid(),
  nome: z.string(),
  tipo: z.string(),
  data_inicio: z.coerce.date(),
  data_colheita: z.coerce.date().optional(),
  data_proximo_plantio: z.coerce.date().optional(),
  descricao: z.string().optional(),
});

export const atualizarPlantacaoSchema = criarPlantacaoSchema.partial();

export const criarSensorSchema = z.object({
  nome: z.string(),
  tipo: z.enum(tipoSensor),
  unidade: z.string(),
  status: z.boolean().optional(),
  direcao: z.enum(direcaoAlerta).optional(),
});

export const atualizarSensorSchema = criarSensorSchema.partial();

export const criarPlantacaoSensorSchema = z.object({
  plantacao_id: z.uuid(),
  sensor_id: z.uuid(),
  limite_atencao: z.number().positive('Limite de atenção deve ser positivo'),
  limite_critico: z.number().positive('Limite crítico deve ser positivo'),
});

export const atualizarPlantacaoSensorSchema = criarPlantacaoSensorSchema.partial();

export const criarLeituraSchema = z.object({
  plantacao_id: z.uuid('ID da plantação deve ser um UUID válido'),
  umidade_solo: z.number().min(0).max(100).optional(),
  umidade_ar: z.number().min(0).max(100).optional(),
  temperatura: z.number().min(-40).max(80).optional(),
  luminosidade: z.number().min(0).max(100).optional(),
});

export const atualizarLeituraSchema = criarLeituraSchema.partial();

export const criarAlertaSchema = z.object({
  leitura_id: z.uuid(),
  usuario_id: z.uuid(),
  tipo: z.enum(tipoAlerta),
  mensagem: z.string(),
  notificacao: z.boolean().optional(),
});
