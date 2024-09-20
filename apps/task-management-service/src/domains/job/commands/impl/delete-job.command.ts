import { ICommand } from '@nestjs/cqrs';

export class DeleteJobCommand implements ICommand {
  constructor(public readonly jobId: string) {}
}