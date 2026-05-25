import Assignment from '../models/Assignment';
import QuestionPaper from '../models/QuestionPaper';
import { generateQuestionPaper } from './aiService';
import { getIO } from '../utils/socket';

// Direct async processor — no Redis/BullMQ dependency needed
export const processAssignmentJob = async (assignmentId: string) => {
  console.log(`Processing assignment ${assignmentId}`);

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    console.error(`Assignment ${assignmentId} not found`);
    return;
  }

  let io: any;
  try {
    io = getIO();
  } catch (e) {
    // Socket not ready yet — non-fatal, polling will pick up the status
  }

  assignment.status = 'GENERATING';
  await assignment.save();

  if (io) {
    io.emit('job_status', { assignmentId: assignment._id, status: 'GENERATING' });
  }

  try {
    const paperData = await generateQuestionPaper(assignment);

    const questionPaper = new QuestionPaper({
      assignmentId: assignment._id,
      sections: paperData.sections
    });
    await questionPaper.save();

    assignment.status = 'COMPLETED';
    await assignment.save();

    if (io) {
      io.emit('job_status', { assignmentId: assignment._id, status: 'COMPLETED' });
    }

    console.log(`Assignment ${assignmentId} completed successfully.`);
  } catch (err: any) {
    console.error(`Assignment ${assignmentId} failed:`, err.message);
    assignment.status = 'FAILED';
    await assignment.save();

    if (io) {
      io.emit('job_status', { assignmentId: assignment._id, status: 'FAILED' });
    }
  }
};
