import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { criarAlertaSchema } from '../schemas/index';

const router = Router();

router.post('/dispositivo-offline', AlertaController.notificarOffline);

router.use(auth);

router.post('/', validate(criarAlertaSchema), AlertaController.criar);
router.patch('/:id/resolver', AlertaController.resolver);
router.get('/', AlertaController.buscarTodos);
router.get('/:id', AlertaController.buscarPorId);
router.get('/plantacao/:plantacao_id', AlertaController.buscarPorPlantacao);
router.get('/resumo/:plantacao_id', AlertaController.buscarResumo);
router.get('/usuario/:usuario_id', AlertaController.buscarPorUsuario);
router.delete('/:id', AlertaController.deletar);

export default router;
