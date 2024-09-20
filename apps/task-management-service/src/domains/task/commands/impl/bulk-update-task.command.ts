// ../apps/task-management-service/src/domains/task/commands/impl/bulk-update-task.command.ts
import { ICommand } from '@nestjs/cqrs';

export class BulkUpdateTasksCommand implements ICommand {
  constructor(public readonly fileBuffer: Buffer, public readonly mimetype: string) {}
}