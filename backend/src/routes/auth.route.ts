import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, esqueciSenhaSchema, redefinirSenhaSchema, validarTokenRecuperacaoSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/esqueci-senha', validate(esqueciSenhaSchema), AuthController.esqueciSenha);
router.post('/redefinir-senha/validar', validate(validarTokenRecuperacaoSchema), AuthController.validarTokenRecuperacao);
router.post('/redefinir-senha', validate(redefinirSenhaSchema), AuthController.redefinirSenha);
router.get('/me', auth, AuthController.perfil);

export default router;
