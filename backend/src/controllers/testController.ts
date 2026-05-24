import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import QuestionPaper from '../models/QuestionPaper';
import TestSubmission from '../models/TestSubmission';

export const getTestPaper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    const questionPaper = await QuestionPaper.findOne({ assignmentId: id }).lean();
    if (!questionPaper) {
      res.status(404).json({ error: 'Question paper not found' });
      return;
    }

    // Scrub answers so students can't cheat by inspecting network payloads
    const scrubbedSections = questionPaper.sections.map(sec => ({
      ...sec,
      questions: sec.questions.map(q => {
        const { answer, ...qWithoutAnswer } = q;
        return qWithoutAnswer;
      })
    }));

    res.status(200).json({ assignment, paper: { ...questionPaper, sections: scrubbedSections } });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const submitTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { studentName, studentRoll, answers } = req.body;

    const submission = new TestSubmission({
      assignmentId: id,
      studentName,
      studentRoll,
      answers
    });
    await submission.save();

    res.status(201).json({ message: 'Test submitted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit test' });
  }
};
