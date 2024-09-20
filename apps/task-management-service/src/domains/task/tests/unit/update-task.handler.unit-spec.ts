import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { Logger } from '@app/core/common/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskHandler } from '../../commands/handlers/update-task.handler';
import { UpdateTaskCommand } from '../../commands/impl/update-task.command';
import { Task } from '@app/domains/task/entities/task.entity';

describe('UpdateTaskHandler', () => {
  let handler: UpdateTaskHandler;
  let taskRepository: TaskRepository;
  let logger: Logger;

  const mockTask = {
    _id: 'task-id',
    title: 'Updated Task',
    description: 'This is an updated task',
    priority: 'Medium',
    status: 'In Progress',
    deadline: new Date(),
  } as Task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskHandler,
        {
          provide: TaskRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue(mockTask),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateTaskHandler>(UpdateTaskHandler);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    logger = module.get<Logger>(Logger);
  });

  it('should update a task successfully', async () => {
    const command = new UpdateTaskCommand('task-id', {
      title: 'Updated Task',
      description: 'This is an updated task',
      priority: 'Medium',
      status: 'In Progress',
      deadline: new Date(),
    });
    const result = await handler.execute(command);

    expect(result).toEqual(mockTask);
    expect(taskRepository.findById).toHaveBeenCalledWith('task-id');
    expect(taskRepository.update).toHaveBeenCalledWith('task-id', expect.anything());
    expect(logger.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException if task not found', async () => {
    jest.spyOn(taskRepository, 'findById').mockResolvedValueOnce(null);
    const command = new UpdateTaskCommand('task-id', { title: 'Updated Task' });
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});