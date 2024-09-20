import { createSlice } from '@reduxjs/toolkit';
import { fetchTasks, createTask, updateTask, deleteTask } from './taskThunks';

// ../apps/web/src/features/tasks/taskSlice.js

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    totalCount: 0,  // Tracks the total count of tasks
    loading: false,
    error: null,
  },
  reducers: {
    taskCreated: (state, action) => {
      state.items.push(action.payload);  // Add the new task to the state
      state.totalCount += 1;
    },
    taskUpdated: (state, action) => {
      const index = state.items.findIndex((task) => task._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;  // Update the task in the state
      }
    },
    taskDeleted: (state, action) => {
      state.items = state.items.filter((task) => task._id !== action.payload);
      state.totalCount -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.totalCount = action.payload.totalCount;  // Set total count from API
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);  // Add the new task
        state.totalCount += 1;  // Increment the total count by 1
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task._id !== action.payload);  // Remove the deleted task using `_id`
        state.totalCount -= 1;  // Decrement the total count by 1
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task._id === action.payload._id);  // Use `_id`
        if (index !== -1) {
          state.items[index] = action.payload;  // Update the task
        }
      });
  },
});

export const { taskCreated, taskUpdated, taskDeleted } = taskSlice.actions;
export default taskSlice.reducer;

