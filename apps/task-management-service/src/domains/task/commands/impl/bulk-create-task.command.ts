// ../apps/task-management-service/src/domains/task/commands/impl/bulk-update-task.command.ts
import { ICommand } from '@nestjs/cqrs';

export class BulkCreateTasksCommand implements ICommand {
  constructor(public readonly tasks: any, public readonly jobId: string, public readonly batchNumber: number) {}
}
