import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import Assignment from '../models/Assignment';
import QuestionPaper from '../models/QuestionPaper';
import { generateQuestionPaper } from './aiService';
import { getIO } from '../utils/socket';

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null
});

export const assignmentQueue = new Queue('assignmentQueue', {
  connection: redisConnection
});

const worker = new Worker('assignmentQueue', async job => {
  console.log(`Processing job ${job.id} for assignment ${job.data.assignmentId}`);
  const assignment = await Assignment.findById(job.data.assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  assignment.status = 'GENERATING';
  await assignment.save();
  
  const io = getIO();
  io.emit('job_status', { assignmentId: assignment._id, status: 'GENERATING' });

  try {
    const paperData = await generateQuestionPaper(assignment);

    const questionPaper = new QuestionPaper({
      assignmentId: assignment._id,
      sections: paperData.sections
    });
    await questionPaper.save();

    assignment.status = 'COMPLETED';
    await assignment.save();

    io.emit('job_status', { assignmentId: assignment._id, status: 'COMPLETED' });
    console.log(`Job ${job.id} completed successfully.`);
  } catch (err: any) {
    console.error(`Job ${job.id} failed:`, err);
    assignment.status = 'FAILED';
    await assignment.save();
    io.emit('job_status', { assignmentId: assignment._id, status: 'FAILED' });
    throw err;
  }
}, { connection: redisConnection });

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with error ${err.message}`);
});
