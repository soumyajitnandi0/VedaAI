import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { initSocket } from './utils/socket';
import assignmentRoutes from './routes/assignmentRoutes';
import toolkitRoutes from './routes/toolkitRoutes';
import testRoutes from './routes/testRoutes';
import lmsRoutes from './routes/lmsRoutes';
import './services/queueService'; // Initialize workers

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

initSocket(server);

app.use('/api/assignments', assignmentRoutes);
app.use('/api/toolkit', toolkitRoutes);
app.use('/api/test', testRoutes);
app.use('/api/lms', lmsRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/veda_ai';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
