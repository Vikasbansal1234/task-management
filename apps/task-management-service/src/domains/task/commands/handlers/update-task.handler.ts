import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { UpdateTaskCommand } from '@app/domains/task/commands/impl/update-task.command';
import { Task } from '@app/domains/task/entities/task.entity';
import { NotFoundException, Injectable } from '@nestjs/common';
import { Logger } from '@app/core/common/logger/logger.service';

@CommandHandler(UpdateTaskCommand)
@Injectable()
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly logger: Logger,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<Task | null> {
    this.logger.log(`Updating task with ID: ${command.id}`);

    const existingTask = await this.taskRepository.findById(command.id);

    if (!existingTask) {
      this.logger.warn(`Task not found with ID: ${command.id}`);
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.taskRepository.update(existingTask._id, command.updateTaskDto);
    this.logger.log(`Task updated successfully with ID: ${existingTask._id}`);

    return updatedTask;
  }
}