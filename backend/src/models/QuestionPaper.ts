import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  text: string;
  options?: string[];
  answer?: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IQuestionPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  sections: ISection[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true }
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema]
});

const QuestionPaperSchema: Schema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, unique: true },
  sections: [SectionSchema]
}, { timestamps: true });

export default mongoose.model<IQuestionPaper>('QuestionPaper', QuestionPaperSchema);
