import { TasksBatchedEventHandler } from "./handlers/tasks-batched.handler";
import { TasksUpdateBatchedEventHandler } from "./handlers/tasks-update-batched.handler";

export const TaskEventHandlers = [
    TasksUpdateBatchedEventHandler,
    TasksBatchedEventHandler
  ];