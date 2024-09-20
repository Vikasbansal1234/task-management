// src/services/socketService.js
import io from 'socket.io-client';
import { taskCreated, taskUpdated, taskDeleted } from '../features/tasks/taskSlice';
import { jobCreated, jobUpdated, jobDeleted } from '../features/jobs/jobSlice';

let socket;

export const initializeSocket = (store) => {
  // Connect to the backend socket server
  socket = io(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
    transports: ['websocket'], // Force WebSocket only
    withCredentials: true, // Include credentials if needed, such as cookies
  });

  // Listen for task-related events
  socket.on('task_created', (data) => {
    store.dispatch(taskCreated(data.task));
  });

  socket.on('task_updated', (data) => {
    store.dispatch(taskUpdated(data.task));
  });

  socket.on('task_deleted', (data) => {
    store.dispatch(taskDeleted(data.taskId));
  });

  // Listen for job-related events
  socket.on('job_created', (data) => {
    store.dispatch(jobCreated(data.job));
  });

  socket.on('job_updated', (data) => {
    store.dispatch(jobUpdated(data.job));
  });

  socket.on('job_deleted', (data) => {
    store.dispatch(jobDeleted(data.jobId));
  });
};
