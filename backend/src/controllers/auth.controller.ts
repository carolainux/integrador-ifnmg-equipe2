import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const AuthController = {
  async login(req: Request, res: Response, _next: NextFunction) {
    const { email, senha } = req.body;
    const resultado = await AuthService.login(email, senha);
    return res.status(200).json(resultado);
  },

  async esqueciSenha(req: Request, res: Response, _next: NextFunction) {
    await AuthService.esqueciSenha(req.body.email);
    return res.status(200).json({
      mensagem: 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.',
    });
  },

  async redefinirSenha(req: Request, res: Response, _next: NextFunction) {
    const { token, nova_senha } = req.body;
    const resultado = await AuthService.redefinirSenha(token, nova_senha);
    return res.status(200).json(resultado);
  },

  async perfil(req: Request, res: Response, _next: NextFunction) {
    const { UsuarioService } = await import('../services/usuario.service.js');
    const usuario = await UsuarioService.buscarPorId(req.usuario!.id);
    return res.status(200).json(usuario);
  },
};
