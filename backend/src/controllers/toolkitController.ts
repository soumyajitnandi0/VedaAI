import { Request, Response } from 'express';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateLessonPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, duration, gradeLevel } = req.body;

    const prompt = `
You are an expert educator. Create a highly structured, minute-by-minute lesson plan for the following topic:
Topic: ${topic}
Duration: ${duration}
Grade Level: ${gradeLevel}

Format the output strictly in Markdown. Use headings, bullet points, and clear timestamps for each section (e.g., "0:00 - 0:10: Introduction"). Include class activities, learning objectives, and materials needed.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ content: response.text });
  } catch (error: any) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ error: error.message || 'Failed to generate lesson plan' });
  }
};

export const generateFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentName, strengths, improvements } = req.body;

    const prompt = `
You are a highly professional teacher writing a report card comment for a student.
Student Name: ${studentName}
Strengths: ${strengths}
Areas for Improvement: ${improvements}

Write a single, polished, and highly professional paragraph that combines these points into constructive feedback suitable for parents to read. The tone should be encouraging but clear. Do not include any placeholder text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ content: response.text });
  } catch (error: any) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ error: error.message || 'Failed to generate feedback' });
  }
};

export const gradeBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { masterKey, submissions } = req.body;

    const prompt = `
You are a strict and highly accurate automated grader for an exam.
Here is the Master Answer Key:
${masterKey}

Here are the student submissions. Each submission has a "name" and their "answers":
${JSON.stringify(submissions, null, 2)}

Your task is to evaluate each student's submission against the Master Answer Key.
Output your response strictly as a JSON object containing an array called "results". DO NOT wrap the JSON in markdown code blocks or add any other text. Return ONLY valid JSON.
Each object in the "results" array MUST have the following structure:
- "name": The student's name exactly as provided.
- "score": A numeric score out of 100 representing their grade.
- "feedback": A concise paragraph explaining what they got wrong and areas for improvement.

Example JSON structure:
{
  "results": [
    {
      "name": "John Doe",
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

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error grading batch:", error);
    res.status(500).json({ error: error.message || 'Failed to grade batch' });
  }
};
