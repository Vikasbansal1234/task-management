import { configureStore } from '@reduxjs/toolkit';
import taskReducer from "../../../features/tasks/taskSlice"

const initialState = {
    tasks: {
        items: [
            {
                "_id": "66eb235162c61beaed77a9f8",
                "title": "Task 2",
                "description": "Description for task 2 - updated",
                "priority": "Medium",
                "status": "Done",
                "deadline": "1970-01-01T00:00:45.567Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77a9f9",
                "title": "Task 3",
                "description": "Description for task 3",
                "priority": "High",
                "status": "Done",
                "deadline": "1970-01-01T00:00:45.568Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77a9fa",
                "title": "Task 4",
                "description": "Description for task 4",
                "priority": "Low",
                "status": "To Do",
                "deadline": "1970-01-01T00:00:45.569Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77a9fb",
                "title": "Task 5",
                "description": "Description for task 5",
                "priority": "Medium",
                "status": "In Progress",
                "deadline": "1970-01-01T00:00:45.570Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77a9fc",
                "title": "Task 6",
                "description": "Description for task 6",
                "priority": "High",
                "status": "Done",
                "deadline": "1970-01-01T00:00:45.571Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77a9fd",
                "title": "Task 7",
                "description": "Description for task 7",
                "priority": "Low",
                "status": "To Do",
                "deadline": "1970-01-01T00:00:45.572Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77a9fe",
                "title": "Task 8",
                "description": "Description for task 8",
                "priority": "Medium",
                "status": "In Progress",
                "deadline": "1970-01-01T00:00:45.573Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77a9ff",
                "title": "Task 9",
                "description": "Description for task 9",
                "priority": "High",
                "status": "Done",
                "deadline": "1970-01-01T00:00:45.574Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77aa00",
                "title": "Task 10",
                "description": "Description for task 10",
                "priority": "Low",
                "status": "To Do",
                "deadline": "1970-01-01T00:00:45.575Z",
                "__v": 0
            },
            {
                "_id": "66eb235162c61beaed77aa01",
                "title": "Task 11",
                "description": "Description for task 11",
                "priority": "Low",
                "status": "To Do",
                "deadline": "1970-01-01T00:00:45.575Z",
                "__v": 0
            }
        ],
        totalCount: 20,
        loading: false,
        error: null
    },
};
const createTaskMockStore = () => {
    return configureStore({
        reducer: {
            tasks: taskReducer,
        },
        preloadedState: initialState
    });
};

export default createTaskMockStore;
