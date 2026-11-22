import z from 'zod';

const envSchema = z.object({
  SERIAL_PORT: z.string().default('/dev/ACM0'),
  BACKEND_URL: z.url().default('http://localhost:3000/api/leituras'),
  SERIAL_BAUD: z.string().default('115200').transform(Number),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Erro crítico: Variáveis de ambiente inválidas!');
  console.error(_env.error.issues);
  throw new Error('Configuração de ambiente inválida.');
}

export const env = _env.data;
