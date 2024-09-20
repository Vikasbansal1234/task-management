
import { ProcessTasksUplaodedFileHandler } from './handlers/process-task-uploaded-file.handler';
import { BulkUpdateTasksHandler } from './handlers/bulk-update-task.handler';
import { CreateTaskHandler } from './handlers/create-task.handler';
import { DeleteTaskHandler } from './handlers/delete-task.handler';
import { UpdateTaskHandler } from './handlers/update-task.handler';
import { BulkCreateTasksHandler } from './handlers/bulk-create-task.handler';

export const TaskCommandHandlers = [
  CreateTaskHandler,
  DeleteTaskHandler,
  UpdateTaskHandler,
  ProcessTasksUplaodedFileHandler,
  BulkCreateTasksHandler,
  BulkUpdateTasksHandler
];