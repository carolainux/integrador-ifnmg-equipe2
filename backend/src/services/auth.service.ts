import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../models/usuario.model';
import { EmailService } from './email.service';
import { env } from '../env/index';

const TOKEN_EXPIRA_MS = 30 * 60 * 1000;
const INTERVALO_REENVIO_MS = 30 * 1000;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const AuthService = {
  async login(email: string, senha: string) {
    const usuario = await UsuarioModel.buscarPorEmailComSenha(email);
    if (!usuario) {
      throw Object.assign(new Error('E-mail ou senha inválidos.'), { status: 401 });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw Object.assign(new Error('E-mail ou senha inválidos.'), { status: 401 });
    }

    const token = jwt.sign({ id: usuario.id }, env.JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  },

  async esqueciSenha(email: string) {
    const usuario = await UsuarioModel.buscarPorEmailParaRecuperacao(email);
    if (!usuario) return;

    const agora = Date.now();
    if (usuario.reset_token_expira_em && usuario.reset_token_expira_em.getTime() > agora + TOKEN_EXPIRA_MS - INTERVALO_REENVIO_MS) {
      return;
    }

    const token = randomBytes(32).toString('hex');
    const expiraEm = new Date(agora + TOKEN_EXPIRA_MS);
    await UsuarioModel.salvarTokenRecuperacao(usuario.id, hashToken(token), expiraEm);

    const link = new URL('/user/redefinir-senha.html', env.FRONTEND_URL);
    link.searchParams.set('token', token);

    try {
      await EmailService.enviarRecuperacaoSenha({
        destinatario: usuario.email,
        nome: usuario.nome,
        link: link.toString(),
      });
    } catch (erro) {
      console.error('Falha ao enviar e-mail de recuperação de senha:', erro);
    }
  },

  async redefinirSenha(token: string, nova_senha: string) {
    const tokenHash = hashToken(token);
    const usuario = await UsuarioModel.buscarPorResetTokenHash(tokenHash);

    if (!usuario || !usuario.reset_token_expira_em || usuario.reset_token_expira_em.getTime() <= Date.now()) {
      throw Object.assign(new Error('Link de recuperação inválido ou expirado.'), { status: 400 });
    }

    const senha = await bcrypt.hash(nova_senha, 10);
    const resultado = await UsuarioModel.redefinirSenhaComToken(usuario.id, tokenHash, senha);

    if (resultado.count !== 1) {
      throw Object.assign(new Error('Link de recuperação inválido ou expirado.'), { status: 400 });
    }

    return { mensagem: 'Senha redefinida com sucesso.' };
  },
};
