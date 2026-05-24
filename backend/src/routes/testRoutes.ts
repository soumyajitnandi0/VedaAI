import { Router } from 'express';
import { getTestPaper, submitTest } from '../controllers/testController';

const router = Router();

router.get('/:id', getTestPaper);
router.post('/:id/submit', submitTest);

export default router;
