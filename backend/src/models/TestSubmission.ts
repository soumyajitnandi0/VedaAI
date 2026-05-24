import mongoose, { Document, Schema } from 'mongoose';

export interface ITestSubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentName: string;
  studentRoll: string;
  answers: {
    sectionIndex: number;
    questionIndex: number;
    studentAnswer: string;
  }[];
  score?: number;
  feedback?: string;
  status: 'PENDING' | 'GRADED';
  createdAt: Date;
}

const TestSubmissionSchema = new Schema<ITestSubmission>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentName: { type: String, required: true },
  studentRoll: { type: String, required: true },
  answers: [{
    sectionIndex: { type: Number, required: true },
    questionIndex: { type: Number, required: true },
    studentAnswer: { type: String, required: true }
  }],
  score: { type: Number },
  feedback: { type: String },
  status: { type: String, enum: ['PENDING', 'GRADED'], default: 'PENDING' }
}, { timestamps: true });

export default mongoose.model<ITestSubmission>('TestSubmission', TestSubmissionSchema);
