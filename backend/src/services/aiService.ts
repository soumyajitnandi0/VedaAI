import { GoogleGenAI } from "@google/genai";
import { IAssignment } from "../models/Assignment";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateQuestionPaper = async (assignment: IAssignment) => {
  const prompt = `
You are an expert educator. Your task is to generate a structured question paper based on the following parameters:

Title: ${assignment.title}
${assignment.subject ? `Subject: ${assignment.subject}` : ''}
${assignment.topic ? `Topic: ${assignment.topic}` : ''}
${assignment.timeDuration ? `Time Duration: ${assignment.timeDuration}` : ''}
${assignment.instituteName ? `Institute: ${assignment.instituteName}` : ''}
${assignment.tutorName ? `Prepared By: ${assignment.tutorName}` : ''}
Instructions: ${assignment.additionalInstructions}

${assignment.referenceText ? `Source Material/Context (Base your questions on this text if relevant):\n${assignment.referenceText}\n` : ''}

Question Types and Allocation:
${assignment.questionTypes.map(q => `- ${q.type}: ${q.numberOfQuestions} questions, ${q.marksPerQuestion} marks each`).join('\n')}

Important Instructions for Specific Question Types:
- For "Multiple Choice Questions", you MUST include exactly 4 options in the "options" array and provide the correct answer in the "answer" field.
- For "Numerical Problems", ensure the question contains clear numerical data, and the "answer" field contains the final numerical value along with a brief solution.
- For "Diagram/Graph-Based Questions", clearly describe the diagram or graph in text within the question itself (e.g., "Consider a graph where the X-axis represents Time and Y-axis represents Velocity...").
- For "Short Questions", provide clear and concise expected answers.
- CRITICAL: Do NOT include the Institute Name, Tutor Name, Time Duration, or Subject in the "instruction" field of the sections. The "instruction" field should ONLY contain brief directions for the student (e.g., "Attempt all questions", "Choose the correct option").

Output your response strictly as a JSON object with the following structure. DO NOT wrap the JSON in markdown code blocks or add any other text. Return ONLY valid JSON.
The "difficulty" field MUST be exactly one of: "Easy", "Moderate", or "Hard".

{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions.",
      "questions": [
        {
          "text": "What is ...?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "Option B",
          "difficulty": "Easy",
          "marks": 5
        }
      ]
    }
  ]
}

Ensure the total number of questions and marks exactly matches the parameters provided. Group questions into logical sections based on the question type.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text || "{}";
    
    // Strip markdown code blocks if the AI returns them
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const data = JSON.parse(jsonStr);

    // Safety fallback for difficulty
    if (data.sections) {
      data.sections.forEach((sec: any) => {
        if (sec.questions) {
          sec.questions.forEach((q: any) => {
            if (q.difficulty === 'Medium' || q.difficulty === 'medium') {
              q.difficulty = 'Moderate';
            }
            if (q.difficulty === 'easy') q.difficulty = 'Easy';
            if (q.difficulty === 'hard') q.difficulty = 'Hard';
          });
        }
      });
    }

    return data;
  } catch (error) {
    console.error("Error generating question paper with AI:", error);
    throw new Error("Failed to generate question paper");
  }
};
