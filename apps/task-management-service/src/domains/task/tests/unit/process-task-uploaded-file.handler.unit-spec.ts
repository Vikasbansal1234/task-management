import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { JobService } from '@app/domains/job/services/job.service';
import { SocketGateway } from '@app/socket/socket.gateway';
import { Logger } from '@app/core/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { parseCsvToJson, parseXlsxToJson } from '@app/domains/shared/utils/excel.util';
import { ProcessTasksUplaodedFileHandler } from '../../commands/handlers/process-task-uploaded-file.handler';
import { ProcessTasksUplaodedFileCommand } from '../../commands/impl/process-task-uploaded-file.command';

jest.mock('@app/domains/shared/utils/excel.util');

describe('ProcessTasksUplaodedFileHandler', () => {
  let handler: ProcessTasksUplaodedFileHandler;
  let eventBus: EventBus;
  let jobService: JobService;
  let socketGateway: SocketGateway;
  let logger: Logger;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessTasksUplaodedFileHandler,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: JobService,
          useValue: {
            createJob: jest.fn().mockResolvedValue({ jobId: 'job-123' }), // Mock job creation
          },
        },
        {
          provide: SocketGateway,
          useValue: {
            emitJobCreated: jest.fn(),
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
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(100), // Mock batch size as 100
          },
        },
      ],
    }).compile();

    handler = module.get<ProcessTasksUplaodedFileHandler>(ProcessTasksUplaodedFileHandler);
    eventBus = module.get<EventBus>(EventBus);
    jobService = module.get<JobService>(JobService);
    socketGateway = module.get<SocketGateway>(SocketGateway);
    logger = module.get<Logger>(Logger);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should process CSV file and create job', async () => {
    const mockFileBuffer = Buffer.from('mock-csv-data');
    (parseCsvToJson as jest.Mock).mockReturnValue([{ title: 'Task 1' }, { title: 'Task 2' }]);
    const command = new ProcessTasksUplaodedFileCommand(mockFileBuffer, 'text/csv');

    await handler.execute(command);

    expect(parseCsvToJson).toHaveBeenCalled();
    expect(jobService.createJob).toHaveBeenCalled();
    expect(socketGateway.emitJobCreated).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should throw error for unsupported file type', async () => {
    const mockFileBuffer = Buffer.from('mock-data');
    const command = new ProcessTasksUplaodedFileCommand(mockFileBuffer, 'unsupported/type');

    await expect(handler.execute(command)).rejects.toThrow('Unsupported file type');
  });
});
