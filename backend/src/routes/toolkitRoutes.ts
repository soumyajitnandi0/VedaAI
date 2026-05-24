import { Router } from 'express';
import { generateLessonPlan, generateFeedback, gradeBatch } from '../controllers/toolkitController';

const router = Router();

router.post('/lesson-plan', generateLessonPlan);
router.post('/feedback', generateFeedback);
router.post('/grade-batch', gradeBatch);

export default router;
