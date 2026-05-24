import { Router } from 'express';
import { generateLessonPlan, generateFeedback } from '../controllers/toolkitController';

const router = Router();

router.post('/lesson-plan', generateLessonPlan);
router.post('/feedback', generateFeedback);

export default router;
