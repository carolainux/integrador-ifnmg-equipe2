import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../schemas/index';

const router = Router();

router.post('/', validate(criarUsuarioSchema), UsuarioController.criar);

router.use(auth);

router.get('/', UsuarioController.buscarTodos);
router.get('/:id', UsuarioController.buscarPorId);
router.put('/:id', validate(atualizarUsuarioSchema), UsuarioController.atualizar);
router.delete('/:id', UsuarioController.deletar);

export default router;
