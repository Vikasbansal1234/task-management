// ../apps/task-management-service/src/domains/task/events/impl/tasks-update-batched.event.ts
import { IEvent } from '@nestjs/cqrs';
import { UpdateTaskDto } from '../../dto/update-task.dto';

export class TasksUpdateBatchedEvent implements IEvent {
  constructor(public readonly tasks: UpdateTaskDto[], public readonly batchNumber: number) {}
}
