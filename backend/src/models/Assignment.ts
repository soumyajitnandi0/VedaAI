import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  subject?: string;
  topic?: string;
  dueDate: Date;
  timeDuration?: string;
  tutorName?: string;
  instituteName?: string;
  targetExam?: string;
  questionTypes: {
    type: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
  }[];
  additionalInstructions: string;
  referenceText?: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: false },
  topic: { type: String, required: false },
  dueDate: { type: Date, required: true },
  timeDuration: { type: String },
  tutorName: { type: String },
  instituteName: { type: String },
  targetExam: { type: String },
  questionTypes: [{
    type: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true },
  }],
  additionalInstructions: { type: String, default: '' },
  referenceText: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'GENERATING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  }
}, { timestamps: true });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
