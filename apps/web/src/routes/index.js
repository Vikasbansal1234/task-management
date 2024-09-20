import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout';
import { TaskList } from '../pages/tasks';
import { JobList } from '../pages/jobs';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="tasks" element={<TaskList />} />
      
        <Route path="jobs" element={<JobList />} />
   
      </Route>
    </Routes>
  );
};

export default AppRoutes;