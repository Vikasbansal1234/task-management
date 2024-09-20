import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ProcessTasksUplaodedFileCommand } from '../impl/process-task-uploaded-file.command';
import { TasksBatchedEvent } from '../../events/impl/tasks-batched.event';
import { Logger } from '@app/core/common/logger/logger.service';
import { parseCsvToJson, parseXlsxToJson } from '@app/domains/shared/utils/excel.util';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';
import { JobService } from '@app/domains/job/services/job.service';
import { SocketGateway } from '@app/socket/socket.gateway';
import { ConfigService } from '@nestjs/config';

@CommandHandler(ProcessTasksUplaodedFileCommand)
export class ProcessTasksUplaodedFileHandler implements ICommandHandler<ProcessTasksUplaodedFileCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
    private readonly jobService: JobService,
    private readonly socketGateway: SocketGateway,
    private readonly configService: ConfigService
  ) { }

  async execute(command: ProcessTasksUplaodedFileCommand): Promise<void> {
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

    const batchSize = this.configService.get('appconfig.batch');
    const batches = [];

    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Create Job entity
    const createJobDto: CreateJobDto = {
      jobId: `job-${Date.now()}`,
      totalTasks: tasks.length,
      totalBatches: batches.length,
      completedTasks: 0,
      failedTasks: 0,
      completedBatches: 0,
      failedBatches: 0,
      status: 'NOT_STARTED',
      createdAt: new Date(),
      batchErrors: []
    };
    const job = await this.jobService.createJob(createJobDto); // Create the Job entity
    this.logger.log(`Job created with ID: ${job.jobId}`);

    // emit socket when Job Created
    this.socketGateway.emitJobCreated(job);

    // Emit an event for each batch
    batches.forEach((batch, index) => {
      this.logger.log(`Emitting TasksBatchedEvent for batch ${index + 1}`);
      this.eventBus.publish(new TasksBatchedEvent(batch, index + 1, job._id));
    });


    this.logger.log(`Successfully processed ${tasks.length} tasks in ${batches.length} batches.`);
  }
}
