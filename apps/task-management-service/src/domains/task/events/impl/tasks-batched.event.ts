// ../apps/task-management-service/src/domains/task/events/impl/tasks-batched.event.ts
import { IEvent } from '@nestjs/cqrs';
import { CreateTaskDto } from '../../dto/create-task.dto';

export class TasksBatchedEvent implements IEvent {
  constructor(public readonly tasks: CreateTaskDto[], public readonly batchNumber: number, public readonly jobObjectId: string) {}
}
