import { configureStore } from '@reduxjs/toolkit';
import jobReducer from "../../../features/jobs/jobSlice";

const initialState = {
    jobs: {
        items: [
            {
                "_id": "66eb234f62c61beaed77a9f4",
                "jobId": "job-1726686031007",
                "totalTasks": 30,
                "totalBatches": 1,
                "completedTasks": 30,
                "failedTasks": 0,
                "completedBatches": 1,
                "failedBatches": 0,
                "status": "COMPLETED",
                "createdAt": "2024-09-18T19:00:31.007Z",
                "completedAt": "2024-09-18T19:00:33.449Z"
            },
            {
                "_id": "66eb234f62c61beaed77a9f5",
                "jobId": "job-1726686031008",
                "totalTasks": 30,
                "totalBatches": 1,
                "completedTasks": 30,
                "failedTasks": 0,
                "completedBatches": 1,
                "failedBatches": 0,
                "status": "COMPLETED",
                "createdAt": "2024-09-18T19:00:31.007Z",
                "completedAt": "2024-09-18T19:00:33.449Z"
            }
        ],
        totalCount: 1,
        loading: false,
        error: null
    },
};
const createJobsMockStore = () => {
    return configureStore({
        reducer: {
            jobs: jobReducer,
        },
        preloadedState: initialState
    });
};

export default createJobsMockStore;
