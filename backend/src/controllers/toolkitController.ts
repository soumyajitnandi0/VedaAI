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
