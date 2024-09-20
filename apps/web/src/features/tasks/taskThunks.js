// ../apps/web/src/features/tasks/taskThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async ({ page = 1, limit = 5 } = {}) => {
  const response = await axios.get(`${API_BASE_URL}/api/tasks?limit=${limit}&page=${page}`);
  return { data: response.data.data, totalCount: response.data.total };
});

export const createTask = createAsyncThunk('tasks/createTask', async (newTask) => {
  const response = await axios.post(`${API_BASE_URL}/api/tasks`, newTask);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updatedTask }) => {
  const response = await axios.put(`${API_BASE_URL}/api/tasks/${id}`, updatedTask);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
  return id;
});

export const uploadTasksFile = createAsyncThunk('tasks/uploadTasksFile', async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/api/tasks/bulk-create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});