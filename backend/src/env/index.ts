import z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'A string de conexão é obrigatória'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET precisa ter no mínimo 32 caracteres'),

  CALLMEBOT_PHONE: z.string().min(10, 'O telefone precisa ter no mínimo 10 caracteres (incluindo DDI e DDD)'),
  CALLMEBOT_APIKEY: z.string().min(7, 'A API KEY precisa conter no mínimo 7 caracteres'),

  BREVO_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.email().optional(),
  EMAIL_FROM_NAME: z.string().default('AgroSensor'),
  FRONTEND_URL: z.url().default('http://localhost:8080'),

  PORT: z.string().default('3000').transform((val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      throw new Error('A variável PORT precisa ser um número válido');
    }
    return port;
  }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Erro crítico: Variáveis de ambiente do Backend inválidas!');
  console.error(_env.error.issues);
  throw new Error('Configuração do ambiente do servidor inválida.');
}

export const env = _env.data;
