import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { Logger } from '@app/core/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { BulkUpdateTasksHandler } from '../../commands/handlers/bulk-update-task.handler';
import { BulkUpdateTasksCommand } from '../../commands/impl/bulk-update-task.command';
import { parseCsvToJson, parseXlsxToJson } from '@app/domains/shared/utils/excel.util';

jest.mock('@app/domains/shared/utils/excel.util'); // Mock the whole excel.util module

describe('BulkUpdateTasksHandler', () => {
  let handler: BulkUpdateTasksHandler;
  let eventBus: EventBus;
  let logger: Logger;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BulkUpdateTasksHandler,
        {
          provide: EventBus,
          useValue: { publish: jest.fn() },
        },
        {
          provide: Logger,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(100),
          },
        },
      ],
    }).compile();

    handler = module.get<BulkUpdateTasksHandler>(BulkUpdateTasksHandler);
    eventBus = module.get<EventBus>(EventBus);
    logger = module.get<Logger>(Logger);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should parse CSV file and emit tasks batched event', async () => {
    const mockFileBuffer = Buffer.from('mock-csv-data');
    (parseCsvToJson as jest.Mock).mockReturnValue([{ title: 'Task 1' }, { title: 'Task 2' }]);  // Mock parseCsvToJson

    const command = new BulkUpdateTasksCommand(mockFileBuffer, 'text/csv');
    await handler.execute(command);

    expect(parseCsvToJson).toHaveBeenCalledWith(mockFileBuffer);
    expect(eventBus.publish).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalled();
  });

  it('should throw error for unsupported file type', async () => {
    const mockFileBuffer = Buffer.from('mock-data');
    const command = new BulkUpdateTasksCommand(mockFileBuffer, 'unsupported/type');

    await expect(handler.execute(command)).rejects.toThrow('Unsupported file type');
  });
});
