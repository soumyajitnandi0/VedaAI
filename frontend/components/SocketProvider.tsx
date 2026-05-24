"use client";
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAssignmentStore } from '../store/useAssignmentStore';

export default function SocketProvider() {
  const updateAssignmentStatus = useAssignmentStore(state => state.updateAssignmentStatus);
  const fetchAssignmentDetails = useAssignmentStore(state => state.fetchAssignmentDetails);
  const currentAssignment = useAssignmentStore(state => state.currentAssignment);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('job_status', (data) => {
      console.log('Received job status update:', data);
      updateAssignmentStatus(data.assignmentId, data.status);
      
      // If we are currently viewing this assignment, we should re-fetch if it just completed
      if (data.status === 'COMPLETED' && currentAssignment?._id === data.assignmentId) {
        fetchAssignmentDetails(data.assignmentId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [updateAssignmentStatus, fetchAssignmentDetails, currentAssignment]);

  return null;
}
