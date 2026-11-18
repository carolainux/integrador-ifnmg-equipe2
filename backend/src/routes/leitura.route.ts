import { Router } from 'express';
import { LeituraController } from '../controllers/leitura.controller';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { criarLeituraSchema, atualizarLeituraSchema } from '../schemas/index';

const router = Router();

router.post('/', validate(criarLeituraSchema), LeituraController.criar);

router.use(auth);

router.get('/', LeituraController.buscarTodos);
router.get('/exportar', LeituraController.exportarCsv);
router.get('/dashboard/:plantacao_id', LeituraController.obterDadosDashboard);
router.get('/plantacao/:plantacao_id', LeituraController.obterHistorico);
router.get('/:id', LeituraController.buscarPorId);
router.put('/:id', validate(atualizarLeituraSchema), LeituraController.atualizar);
router.delete('/:id', LeituraController.deletar);

export default router;
