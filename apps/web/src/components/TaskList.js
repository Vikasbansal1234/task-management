import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, createTask } from '../features/tasks/taskThunks';
import { selectAllTasks, selectTaskLoading } from '../features/tasks/taskSelectors';

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectTaskLoading);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = () => {
    const newTask = {
      title: 'New Task',
      description: 'Task Description',
      priority: 'Medium',
      status: 'To Do',
      deadline: new Date().toISOString(),
    };
    dispatch(createTask(newTask));
  };

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        tasks.map((task) => <div key={task.id}>{task.title}</div>)
      )}
      <button onClick={handleCreateTask}>Add Task</button>
    </div>
  );
};

export default TaskList;