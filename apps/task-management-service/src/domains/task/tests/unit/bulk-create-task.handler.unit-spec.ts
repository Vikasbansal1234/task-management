import { Test, TestingModule } from '@nestjs/testing';
import { BulkCreateTasksHandler } from '../../commands/handlers/bulk-create-task.handler';
import { BulkCreateTasksCommand } from '../../commands/impl/bulk-create-task.command';
import { TaskRepository } from '../../repositories/task.repository';
import { Logger } from '@app/core/common/logger/logger.service';
import { Connection, ClientSession } from 'mongoose';
import { JobService } from '@app/domains/job/services/job.service';
import { SocketGateway } from '@app/socket/socket.gateway';
import { RedisService } from '@app/redis/redis.service';
import { EventBus } from '@nestjs/cqrs';

describe('BulkCreateTasksHandler', () => {
  let handler: BulkCreateTasksHandler;
  let taskRepository: TaskRepository;
  let jobService: JobService;
  let socketGateway: SocketGateway;
  let redisService: RedisService;
  let logger: Logger;
  let connection: Connection;
  let session: ClientSession;
  let eventBus: EventBus;

  const mockTasks = [
    { _id: 'task-1', title: 'Task 1' },
    { _id: 'task-2', title: 'Task 2' },
  ];

  beforeEach(async () => {
    session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    } as unknown as ClientSession;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BulkCreateTasksHandler,
        {
          provide: TaskRepository,
          useValue: {
            bulkWrite: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: Connection,
          useValue: {
            startSession: jest.fn().mockResolvedValue(session),
          },
        },
        {
          provide: JobService,
          useValue: {
            getJobById: jest.fn().mockResolvedValue({
              _id: 'job-id',
              totalBatches: 3,
              completedTasks: 0,
              completedBatches: 0,
            }),
            updateJob: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: SocketGateway,
          useValue: {
            emitJobUpdated: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            bulkInsert: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<BulkCreateTasksHandler>(BulkCreateTasksHandler);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    jobService = module.get<JobService>(JobService);
    socketGateway = module.get<SocketGateway>(SocketGateway);
    redisService = module.get<RedisService>(RedisService);
    logger = module.get<Logger>(Logger);
    connection = module.get<Connection>(Connection);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should execute bulk create tasks and update job successfully', async () => {
    const command = new BulkCreateTasksCommand(mockTasks, 'job-id', 1);
    await handler.execute(command);
    expect(taskRepository.bulkWrite).toHaveBeenCalled();
    expect(jobService.updateJob).toHaveBeenCalled();
    expect(redisService.bulkInsert).toHaveBeenCalled();
    expect(socketGateway.emitJobUpdated).toHaveBeenCalled();
  });


  it('should retry bulkWrite on error up to the maxRetries limit', async () => {
    jest.spyOn(taskRepository, 'bulkWrite').mockRejectedValueOnce(new Error('Bulk operation failed'));
    const command = new BulkCreateTasksCommand(mockTasks, 'job-id', 1);
    await expect(handler.execute(command)).resolves.not.toThrow();
    expect(taskRepository.bulkWrite).toHaveBeenCalledTimes(2);
  });
});
