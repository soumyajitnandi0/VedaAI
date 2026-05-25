import { create } from 'zustand';
import axios from 'axios';

export interface QuestionTypeConfig {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface AssignmentData {
  _id?: string;
  title: string;
  subject: string;
  topic: string;
  dueDate: string;
  timeDuration: string;
  tutorName: string;
  instituteName: string;
  targetExam?: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions: string;
  file?: File | null;
  status?: string;
}

interface AssignmentStore {
  assignments: AssignmentData[];
  currentAssignment: AssignmentData | null;
  currentPaper: any | null;
  fetchAssignments: () => Promise<void>;
  fetchAssignmentDetails: (id: string) => Promise<void>;
  createAssignment: (data: AssignmentData) => Promise<string>;
  regenerateAssignment: (id: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  updateAssignmentStatus: (id: string, status: string) => void;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments`;

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  currentAssignment: null,
  currentPaper: null,

  fetchAssignments: async () => {
    try {
      const res = await axios.get(API_URL);
      set({ assignments: res.data });
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  },

  fetchAssignmentDetails: async (id: string) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      set({ 
        currentAssignment: res.data.assignment,
        currentPaper: res.data.questionPaper 
      });
    } catch (error) {
      console.error("Failed to fetch assignment details:", error);
    }
  },

  createAssignment: async (data: AssignmentData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      formData.append('topic', data.topic);
      formData.append('dueDate', data.dueDate);
      formData.append('timeDuration', data.timeDuration);
      formData.append('tutorName', data.tutorName);
      formData.append('instituteName', data.instituteName);
      if (data.targetExam) {
        formData.append('targetExam', data.targetExam);
      }
      formData.append('additionalInstructions', data.additionalInstructions);
      formData.append('questionTypes', JSON.stringify(data.questionTypes));
      
      if (data.file) {
        formData.append('file', data.file);
      }

      const res = await axios.post(API_URL, formData);
      set(state => ({ assignments: [res.data, ...state.assignments] }));
      return res.data._id;
    } catch (error) {
      console.error("Failed to create assignment:", error);
      throw error;
    }
  },

  regenerateAssignment: async (id: string) => {
    try {
      await axios.post(`${API_URL}/${id}/regenerate`);
      set({ currentPaper: null });
      // status update will happen via socket
    } catch (error) {
      console.error("Failed to regenerate assignment:", error);
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set(state => ({
        assignments: state.assignments.filter(a => a._id !== id)
      }));
    } catch (error) {
      console.error("Failed to delete assignment:", error);
      throw error;
    }
  },

  updateAssignmentStatus: (id: string, status: string) => {
    set(state => ({
      assignments: state.assignments.map(a => a._id === id ? { ...a, status } : a),
      currentAssignment: state.currentAssignment?._id === id 
        ? { ...state.currentAssignment, status } 
        : state.currentAssignment
    }));
  }
}));
