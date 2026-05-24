import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import TestSubmission from '../models/TestSubmission';
import QuestionPaper from '../models/QuestionPaper';
import { ai } from '../services/aiService';

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    const result = await Promise.all(assignments.map(async (a) => {
      const submissionsCount = await TestSubmission.countDocuments({ assignmentId: a._id });
      return { ...a, submissionsCount };
    }));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

export const getSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const submissions = await TestSubmission.find({ assignmentId: id }).sort({ createdAt: -1 }).lean();
    res.status(200).json(submissions);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const gradeSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 1. Get Master Answer Key
    const paper = await QuestionPaper.findOne({ assignmentId: id });
    if (!paper) {
      res.status(404).json({ error: 'Question paper not found' });
      return;
    }

    let masterKey = '';
    paper.sections.forEach((sec, sIdx) => {
      masterKey += `Section ${sIdx + 1}: ${sec.title}\n`;
      sec.questions.forEach((q, qIdx) => {
        masterKey += `Q${qIdx + 1} (Marks: ${q.marks}): ${q.text}\n`;
        if (q.options && q.options.length > 0) {
          masterKey += `Options: ${q.options.map((opt, i) => `${String.fromCharCode(97+i)}. ${opt}`).join(', ')}\n`;
        }
        masterKey += `Answer: ${q.answer}\n\n`;
      });
    });

    // 2. Get Pending Submissions
    const pendingSubmissions = await TestSubmission.find({ assignmentId: id, status: 'PENDING' });
    if (pendingSubmissions.length === 0) {
      res.status(400).json({ error: 'No pending submissions to grade' });
      return;
    }

    // 3. Format Submissions for Gemini
    const formattedSubmissions = pendingSubmissions.map(sub => {
      let answersText = '';
      sub.answers.forEach(a => {
        answersText += `Section ${a.sectionIndex + 1}, Q${a.questionIndex + 1}: ${a.studentAnswer}\n`;
      });
      return { _id: sub._id.toString(), name: sub.studentName, roll: sub.studentRoll, answers: answersText };
    });

    // 4. Prompt Gemini
    const prompt = `
You are a highly strict and accurate automated grader.
Here is the Master Answer Key with Question Text, Marks, and correct Answers:
${masterKey}

Here are the student submissions:
${JSON.stringify(formattedSubmissions, null, 2)}

Evaluate each student's submission against the Master Answer Key.
Calculate the total marks they achieved out of the total available marks.
Output your response strictly as a JSON object containing an array called "results". DO NOT wrap the JSON in markdown code blocks or add any other text. Return ONLY valid JSON.
Each object in the "results" array MUST have the following structure:
- "_id": The submission _id exactly as provided.
- "score": The total marks achieved by the student (numeric integer).
- "feedback": A concise paragraph explaining what they got wrong and areas for improvement.

Example JSON structure:
{
  "results": [
    {
      "_id": "60d5ecb8b392d7001f3e4f3a",
      "score": 85,
      "feedback": "Good understanding of core concepts. Needs to improve on question 3 regarding thermodynamics."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text || "{}";
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(jsonStr);

    // 5. Update Database
    if (data.results && Array.isArray(data.results)) {
      for (const result of data.results) {
        await TestSubmission.findByIdAndUpdate(result._id, {
          score: result.score,
          feedback: result.feedback,
          status: 'GRADED'
        });
      }
    }

    res.status(200).json({ message: 'Submissions graded successfully' });
  } catch (err: any) {
    console.error("Failed to grade:", err);
    res.status(500).json({ error: 'Failed to grade submissions' });
  }
};
