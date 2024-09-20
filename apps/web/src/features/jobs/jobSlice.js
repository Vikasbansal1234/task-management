import { createSlice } from '@reduxjs/toolkit';
import { fetchJobs, deleteJob } from './jobThunks';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    totalCount: 0, // New state for total count
    loading: false,
    error: null,
  },
  reducers: {
    jobCreated: (state, action) => {
      state.items.push(action.payload);  // Add the new job
      state.totalCount += 1;
    },
    jobUpdated: (state, action) => {
      const index = state.items.findIndex((job) => { 
        return job._id === action.payload._id});
      if (index !== -1) {
        state.items[index] = action.payload;  // Update the job
      } else {
        state.items.push(action.payload); // insert the job
      }
    },
    jobDeleted: (state, action) => {
      state.items = state.items.filter((job) => job._id !== action.payload);
      state.totalCount -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.totalCount = action.payload.totalCount; // Store total count
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter(job => job._id !== action.payload);
      });
  },
});
export const { jobCreated, jobUpdated, jobDeleted } = jobSlice.actions;
export default jobSlice.reducer;