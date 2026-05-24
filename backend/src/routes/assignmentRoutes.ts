import { Router } from 'express';
import multer from 'multer';
import { createAssignment, getAssignments, getAssignmentById, regenerateAssignment, deleteAssignment } from '../controllers/assignmentController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.post('/:id/regenerate', regenerateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
