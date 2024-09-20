import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { CreateTaskHandler } from '@app/domains/task/commands/handlers/create-task.handler';
import { CreateTaskCommand } from '@app/domains/task/commands/impl/create-task.command';
import { Task } from '@app/domains/task/entities/task.entity';
import { Logger } from '@app/core/common/logger/logger.service';

describe('CreateTaskHandler', () => {
  let handler: CreateTaskHandler;
  let taskRepository: TaskRepository;
  let logger: Logger;

  const mockTask: Task = {
    _id: 'task-id',
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'Medium',
    status: 'To Do',
    deadline: new Date(),
  } as Task;

  const mockCreateTaskDto = {
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'Medium',
    status: 'To Do',
    deadline: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskHandler,
        {
          provide: TaskRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateTaskHandler>(CreateTaskHandler);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    logger = module.get<Logger>(Logger);
  });

  it('should create a task successfully', async () => {
    const command = new CreateTaskCommand(mockCreateTaskDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockTask);
    expect(taskRepository.create).toHaveBeenCalledWith(mockCreateTaskDto);
    expect(logger.log).toHaveBeenCalledWith(`Creating a new task with data: ${JSON.stringify(mockCreateTaskDto)}`);
    expect(logger.log).toHaveBeenCalledWith(`Task created successfully with ID: ${mockTask._id}`);
  });

  it('should handle errors during task creation', async () => {
    jest.spyOn(taskRepository, 'create').mockRejectedValue(new Error('Creation failed'));
    const command = new CreateTaskCommand(mockCreateTaskDto);
    await expect(handler.execute(command)).rejects.toThrow('Creation failed');
  });  
});