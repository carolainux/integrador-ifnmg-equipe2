import { env } from '../env/index';

interface EnviarRecuperacaoSenhaDados {
  destinatario: string;
  nome: string;
  link: string;
}

export const EmailService = {
  async enviarRecuperacaoSenha({ destinatario, nome, link }: EnviarRecuperacaoSenhaDados) {
    if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[dev] Link de recuperação de senha para ${destinatario}: ${link}`);
      } else {
        console.warn('Recuperação de senha indisponível: RESEND_API_KEY e EMAIL_FROM não configurados.');
      }
      return false;
    }

    const destinatarioFinal = process.env.NODE_ENV !== 'production' && env.EMAIL_DESTINO_TESTE
      ? env.EMAIL_DESTINO_TESTE
      : destinatario;

    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
        to: [destinatarioFinal],
        subject: 'Redefinição de senha - AgroSensor',
        text: [
          `Olá, ${nome}!`,
          ...(destinatarioFinal !== destinatario ? [`Destinatário original: ${destinatario}`, ''] : []),
          'Recebemos um pedido para redefinir sua senha no AgroSensor.',
          'Acesse o link abaixo para criar uma nova senha:',
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
      throw new Error(`Resend respondeu ${resposta.status}: ${detalhe}`);
    }

    return true;
  },
};
