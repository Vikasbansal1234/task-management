// ../apps/task-management-service/src/domains/task/commands/impl/bulk-create-task.command.ts
import { ICommand } from '@nestjs/cqrs';

export class ProcessTasksUplaodedFileCommand implements ICommand {
  constructor(public readonly fileBuffer: Buffer, public readonly mimetype: string) {}
}

