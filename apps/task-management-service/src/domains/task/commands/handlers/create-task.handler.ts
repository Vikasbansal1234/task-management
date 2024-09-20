import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { Task } from '@app/domains/task/entities/task.entity';
import { CreateTaskCommand } from '@app/domains/task/commands/impl/create-task.command';
import { Injectable } from '@nestjs/common';
import { Logger } from '@app/core/common/logger/logger.service';

@CommandHandler(CreateTaskCommand)
@Injectable()
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly logger: Logger,
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const { createTaskDto } = command;
    this.logger.log(`Creating a new task with data: ${JSON.stringify(createTaskDto)}`);

    // Create the task in the repository (database)
    const createdTask = await this.taskRepository.create(createTaskDto);

    this.logger.log(`Task created successfully with ID: ${createdTask._id}`);

    return createdTask;
  }
}