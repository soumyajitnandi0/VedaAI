import { Router } from 'express';
import { getAssignments, getSubmissions, gradeSubmissions } from '../controllers/lmsController';

const router = Router();

router.get('/assignments', getAssignments);
router.get('/:id/submissions', getSubmissions);
router.post('/:id/grade', gradeSubmissions);

export default router;
