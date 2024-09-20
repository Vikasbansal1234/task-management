import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Logger } from '@app/core/common/logger/logger.service';
import { parseCsvToJson, parseXlsxToJson } from '@app/domains/shared/utils/excel.util';
import { ConfigService } from '@nestjs/config';
import { BulkUpdateTasksCommand } from '../impl/bulk-update-task.command';
import { TasksUpdateBatchedEvent } from '../../events/impl/tasks-update-batched.event';

@CommandHandler(BulkUpdateTasksCommand)
export class BulkUpdateTasksHandler implements ICommandHandler<BulkUpdateTasksCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {}

  async execute(command: BulkUpdateTasksCommand): Promise<void> {
    const { fileBuffer, mimetype } = command;

    // Convert the file to tasks JSON based on mimetype
    let tasks: any[];
    if (mimetype === 'text/csv') {
      tasks = parseCsvToJson(fileBuffer);
      this.logger.log('File parsed as CSV');
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      tasks = parseXlsxToJson(fileBuffer);
      this.logger.log('File parsed as XLSX');
    } else {
      this.logger.error('Unsupported file type');
      throw new Error('Unsupported file type');
    }

    // Process tasks in batches of 100
    const batchSize = this.configService.get('appconfig.batch');
    const batches = [];

    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Emit an event for each batch
    batches.forEach((batch, index) => {
      this.logger.log(`Emitting TasksUpdateBatchedEvent for batch ${index + 1}`);
      this.eventBus.publish(new TasksUpdateBatchedEvent(batch, index + 1));
    });

    this.logger.log(`Successfully processed ${tasks.length} tasks in ${batches.length} batches.`);
  }
}
