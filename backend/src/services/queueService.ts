import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import Assignment from '../models/Assignment';
import QuestionPaper from '../models/QuestionPaper';
import { generateQuestionPaper } from './aiService';
import { getIO } from '../utils/socket';

const redisConnection = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null }) 
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      maxRetriesPerRequest: null
    });

export const assignmentQueue = new Queue('assignmentQueue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 1,        // Never auto-retry — prevents quota burn on failures
    removeOnComplete: true,
    removeOnFail: true, // Remove failed jobs so they don't re-queue on restart
  }
});

// Clean up any stuck failed jobs from previous runs on startup
assignmentQueue.obliterate({ force: true }).then(() => {
  console.log('Queue flushed — stale jobs cleared.');
}).catch(() => {
  // Queue may already be empty; ignore errors
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
}, { 
  connection: redisConnection,
  concurrency: 1,
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with error ${err.message}`);
});
