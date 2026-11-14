import { env } from '../env/index';

interface EnviarRecuperacaoSenhaDados {
  destinatario: string;
  nome: string;
  link: string;
}

export const EmailService = {
  async enviarRecuperacaoSenha({ destinatario, nome, link }: EnviarRecuperacaoSenhaDados) {
    if (!env.BREVO_API_KEY || !env.EMAIL_FROM) {
      console.warn('Recuperação de senha indisponível: BREVO_API_KEY e EMAIL_FROM não configurados.');
      return false;
    }

    const resposta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: env.EMAIL_FROM_NAME, email: env.EMAIL_FROM },
        to: [{ email: destinatario, name: nome }],
        subject: 'Redefinição de senha - AgroSensor',
        textContent: [
          `Olá, ${nome}!`,
          '',
          'Recebemos um pedido para redefinir sua senha no AgroSensor.',
          `Acesse o link abaixo para criar uma nova senha:`,
          link,
          '',
          'O link expira em 30 minutos e só pode ser usado uma vez.',
          'Se você não fez este pedido, ignore esta mensagem.',
        ].join('\n'),
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      throw new Error(`Brevo respondeu ${resposta.status}: ${detalhe}`);
    }

    return true;
  },
};
