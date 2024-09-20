import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../features/tasks/taskSlice';
import jobReducer from '../features/jobs/jobSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    jobs: jobReducer,
  },
});

export default store;