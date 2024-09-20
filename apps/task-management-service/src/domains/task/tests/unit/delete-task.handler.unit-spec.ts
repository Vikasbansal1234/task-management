import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { Logger } from '@app/core/common/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { DeleteTaskHandler } from '../../commands/handlers/delete-task.handler';
import { DeleteTaskCommand } from '../../commands/impl/delete-task.command';
import { Task } from '@app/domains/task/entities/task.entity';

describe('DeleteTaskHandler', () => {
  let handler: DeleteTaskHandler;
  let taskRepository: TaskRepository;
  let logger: Logger;

  const mockTask = {
    _id: 'task-id',
    title: 'Test Task',
    description: 'This is a test task',
  } as Task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskHandler,
        {
          provide: TaskRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockTask),
            delete: jest.fn().mockResolvedValue(mockTask),
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

    handler = module.get<DeleteTaskHandler>(DeleteTaskHandler);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    logger = module.get<Logger>(Logger);
  });

  it('should delete a task successfully', async () => {
    const command = new DeleteTaskCommand('task-id');
    const result = await handler.execute(command);

    expect(result).toEqual(mockTask);
    expect(taskRepository.findById).toHaveBeenCalledWith('task-id');
    expect(taskRepository.delete).toHaveBeenCalledWith('task-id');
    expect(logger.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException if task not found', async () => {
    jest.spyOn(taskRepository, 'findById').mockResolvedValueOnce(null);
    const command = new DeleteTaskCommand('task-id');
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});