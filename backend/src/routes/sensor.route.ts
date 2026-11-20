import { Router } from 'express';
import { SensorController } from '../controllers/sensor.controller';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { criarSensorSchema, atualizarSensorSchema } from '../schemas/index';

const router = Router();

router.use(auth);

router.post('/', validate(criarSensorSchema), SensorController.criar);
router.get('/', SensorController.buscarTodos);
router.get('/:id', SensorController.buscarPorId);
router.get('/tipo/:tipo', SensorController.buscarPorTipo);
router.put('/:id', validate(atualizarSensorSchema), SensorController.atualizar);
router.delete('/:id', SensorController.deletar);

export default router;
