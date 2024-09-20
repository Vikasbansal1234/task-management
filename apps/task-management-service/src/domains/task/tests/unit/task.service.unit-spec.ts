import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@app/core/common/logger/logger.service';
import { CreateTaskCommand } from '../../commands/impl/create-task.command';
import { DeleteTaskCommand } from '../../commands/impl/delete-task.command';
import { UpdateTaskCommand } from '../../commands/impl/update-task.command';
import { GetAllTasksQuery } from '../../queries/impl/get-all-tasks.query';
import { GetTaskByIdQuery } from '../../queries/impl/get-task-by-id.query';
import { TaskService } from '../../services/task.service';

describe('TaskService', () => {
  let service: TaskService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockTask = { _id: 'task-id', title: 'Test Task', description: 'This is a test task' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should create a task', async () => {
    const createTaskDto = { title: 'Test Task', description: 'This is a test task', priority: 'Medium', status: 'To Do', deadline: new Date() };
    jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(mockTask);
    const result = await service.createTask(createTaskDto);

    expect(result).toEqual(mockTask);
    expect(commandBus.execute).toHaveBeenCalledWith(new CreateTaskCommand(createTaskDto));
  });

  it('should update a task', async () => {
    const updateTaskDto = { title: 'Updated Task' };
    jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(mockTask);
    const result = await service.updateTask('task-id', updateTaskDto);

    expect(result).toEqual(mockTask);
    expect(commandBus.execute).toHaveBeenCalledWith(new UpdateTaskCommand('task-id', updateTaskDto));
  });

  it('should delete a task', async () => {
    jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(mockTask);
    const result = await service.deleteTask('task-id');

    expect(result).toEqual(mockTask);
    expect(commandBus.execute).toHaveBeenCalledWith(new DeleteTaskCommand('task-id'));
  });

  it('should get a task by id', async () => {
    jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(mockTask);
    const result = await service.getTaskById('task-id');

    expect(result).toEqual(mockTask);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetTaskByIdQuery('task-id'));
  });

  it('should get all tasks', async () => {
    const tasks = [mockTask];
    jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(tasks);
    const result = await service.getAllTasks(10, 1);

    expect(result).toEqual(tasks);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetAllTasksQuery(10, 1));
  });
});