import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import QuestionPaper from '../models/QuestionPaper';
import { assignmentQueue } from '../services/queueService';
const pdfParse = require('pdf-parse');

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    let { title, subject, topic, targetExam, dueDate, timeDuration, tutorName, instituteName, questionTypes, additionalInstructions } = req.body;
    
    // Parse questionTypes if it comes as a string (FormData)
    if (typeof questionTypes === 'string') {
      questionTypes = JSON.parse(questionTypes);
    }

    let referenceText = '';
    
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        referenceText = pdfData.text;
      }
    }
    
    const assignment = new Assignment({
      title,
      subject,
      topic,
      dueDate,
      timeDuration,
      tutorName,
      instituteName,
      targetExam,
      questionTypes,
      additionalInstructions,
      referenceText,
      status: 'PENDING'
    });
    
    await assignment.save();
    
    await assignmentQueue.add('generate', { assignmentId: assignment._id });

    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }
    
    const questionPaper = await QuestionPaper.findOne({ assignmentId: assignment._id });
    
    res.status(200).json({ assignment, questionPaper });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const regenerateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Delete old paper
    await QuestionPaper.deleteOne({ assignmentId: assignment._id });
    
    assignment.status = 'PENDING';
    await assignment.save();
    
    await assignmentQueue.add('generate', { assignmentId: assignment._id });

    res.status(200).json({ message: 'Regeneration started', assignment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Delete associated paper
    await QuestionPaper.deleteOne({ assignmentId: assignment._id });
    
    // Delete assignment
    await Assignment.deleteOne({ _id: assignment._id });

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
