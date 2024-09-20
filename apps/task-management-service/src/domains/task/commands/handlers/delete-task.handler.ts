import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { DeleteTaskCommand } from '@app/domains/task/commands/impl/delete-task.command';
import { Task } from '@app/domains/task/entities/task.entity';
import { NotFoundException, Injectable } from '@nestjs/common';
import { Logger } from '@app/core/common/logger/logger.service';

@CommandHandler(DeleteTaskCommand)
@Injectable()
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly logger: Logger,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<Task | null> {
    this.logger.log(`Deleting task with ID: ${command.id}`);

    const existingTask = await this.taskRepository.findById(command.id);

    if (!existingTask) {
      this.logger.warn(`Task not found with ID: ${command.id}`);
      throw new NotFoundException('Task not found');
    }

    const deletedTask = await this.taskRepository.delete(command.id);
    this.logger.log(`Task deleted successfully with ID: ${command.id}`);

    return deletedTask;
  }
}