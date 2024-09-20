import { ICommand } from '@nestjs/cqrs';
import { UpdateTaskDto } from '@app/domains/task/dto/update-task.dto';

export class UpdateTaskCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateTaskDto: UpdateTaskDto) {}
}