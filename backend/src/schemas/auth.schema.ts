import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const esqueciSenhaSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
});

export const redefinirSenhaSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  nova_senha: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Za-z]/, 'A senha deve conter letras')
    .regex(/\d/, 'A senha deve conter números'),
});
