import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from '@app/domains/task/commands/impl/create-task.command';
import { DeleteTaskCommand } from '@app/domains/task/commands/impl/delete-task.command';
import { UpdateTaskCommand } from '@app/domains/task/commands/impl/update-task.command';
import { CreateTaskDto } from '@app/domains/task/dto/create-task.dto';
import { UpdateTaskDto } from '@app/domains/task/dto/update-task.dto';
import { GetAllTasksQuery } from '@app/domains/task/queries/impl/get-all-tasks.query';
import { GetTaskByIdQuery } from '@app/domains/task/queries/impl/get-task-by-id.query';
import { Logger } from '@app/core/common/logger/logger.service';
import { ProcessTasksUplaodedFileCommand } from '../commands/impl/process-task-uploaded-file.command';
import { BulkUpdateTasksCommand } from '../commands/impl/bulk-update-task.command';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BulkCreateTasksCommand } from '../commands/impl/bulk-create-task.command';

@Injectable()
export class TaskService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    try {
      this.logger.log(`Creating task with data: ${JSON.stringify(createTaskDto)}`);
      const task = await this.commandBus.execute(new CreateTaskCommand(createTaskDto));
      this.logger.log(`Task created with ID: ${task._id}`);
      return task;
    } catch (error) {
      this.logger.error('Failed to create task', error.stack);
      throw new InternalServerErrorException('Failed to create task', error);
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      this.logger.log(`Updating task with ID: ${id} and data: ${JSON.stringify(updateTaskDto)}`);
      const task = await this.commandBus.execute(new UpdateTaskCommand(id, updateTaskDto));
      if (!task) {
        this.logger.warn(`Task not found with ID: ${id}`);
        throw new NotFoundException('Task not found');
      }
      this.logger.log(`Task updated successfully with ID: ${id}`);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to update task: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to update task', error.stack);
      throw new InternalServerErrorException('Failed to update task', error);
    }
  }

  async deleteTask(id: string) {
    try {
      this.logger.log(`Deleting task with ID: ${id}`);
      const task = await this.commandBus.execute(new DeleteTaskCommand(id));
      if (!task) {
        this.logger.warn(`Task not found with ID: ${id}`);
        throw new NotFoundException('Task not found');
      }
      this.logger.log(`Task deleted successfully with ID: ${id}`);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to delete task: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to delete task', error.stack);
      throw new InternalServerErrorException('Failed to delete task', error);
    }
  }

  async getTaskById(id: string) {
    try {
      this.logger.log(`Retrieving task with ID: ${id}`);
      const task = await this.queryBus.execute(new GetTaskByIdQuery(id));
      if (!task) {
        this.logger.warn(`Task not found with ID: ${id}`);
        throw new NotFoundException('Task not found');
      }
      this.logger.log(`Task retrieved with ID: ${id}`);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to retrieve task: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to retrieve task', error.stack);
      throw new InternalServerErrorException('Failed to retrieve task', error);
    }
  }

  async getAllTasks(limit = 10, page = 1) {
    try {
      this.logger.log(`Retrieving all tasks with limit: ${limit}, page: ${page}`);

      const tasks = await this.queryBus.execute(new GetAllTasksQuery(limit, page));

      this.logger.log(`Retrieved ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      this.logger.error('Failed to retrieve tasks', error.stack);
      throw new InternalServerErrorException('Failed to retrieve tasks', error);
    }
  }

  async processUploadedFile(filePath: string, mimetype: string): Promise<any> {
    const fileBuffer = fs.readFileSync(filePath);
    // Pass the file buffer and mimetype to the command
    return this.commandBus.execute(new ProcessTasksUplaodedFileCommand(fileBuffer, mimetype));
  }

  async bulkUpdateTasks(filePath: string, mimetype: string): Promise<any> {
    const fileBuffer = fs.readFileSync(filePath);
    // Pass the file buffer and mimetype to the command
    return this.commandBus.execute(new BulkUpdateTasksCommand(fileBuffer, mimetype));
  }

  async bulkCreateTasks(message: any) {
    const {batchTasks, jobId, batchNumber} = message;
    const taskDtos  = [];
    for (let i=0; i<batchTasks.length; i++) {
      const createTaskDTO = await this.createTaskDTO(batchTasks[i]);
      taskDtos.push(createTaskDTO);
    }
    return await this.commandBus.execute(new BulkCreateTasksCommand(taskDtos, jobId, batchNumber));
  }

  async createTaskDTO(taskData: any): Promise<CreateTaskDto> {
    const taskDto = plainToInstance(CreateTaskDto, taskData);
    try {
      await validateOrReject(taskDto);
      return taskDto;
    } catch (errors) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }
  }
}