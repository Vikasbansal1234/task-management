import { GetAllTasksHandler } from './handlers/get-all-tasks.handler';
import { GetTaskByIdHandler } from './handlers/get-task-by-id.handler';

export const TaskQueryHandlers = [
  GetAllTasksHandler,
  GetTaskByIdHandler,
];