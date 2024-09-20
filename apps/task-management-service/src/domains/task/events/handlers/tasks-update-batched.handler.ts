// ../apps/task-management-service/src/domains/task/events/handlers/tasks-update-batched.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TasksUpdateBatchedEvent } from '../impl/tasks-update-batched.event';
import { KafkaService } from '@app/kafka/kafka.service';
import { JobService } from '@app/domains/job/services/job.service'; // Import JobService
import { Logger } from '@app/core/common/logger/logger.service';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';

@EventsHandler(TasksUpdateBatchedEvent)
export class TasksUpdateBatchedEventHandler implements IEventHandler<TasksUpdateBatchedEvent> {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jobService: JobService, // Inject JobService
    private readonly logger: Logger
  ) {}

  async handle(event: TasksUpdateBatchedEvent): Promise<void> {
    const { tasks, batchNumber } = event;
    this.logger.log(`Processing batch ${batchNumber} for task updates...`);

    // Step 1: Create Job entity for updates
    const createJobDto: CreateJobDto = {
        jobId: `job-${Date.now()}`,
        totalTasks: tasks.length,
        totalBatches: 1,
        completedTasks: 0,
        failedTasks: 0,
        completedBatches: 0,
        failedBatches: 0,
        status: 'IN_PROGRESS',
        createdAt: new Date(),
        batchErrors: []
    };

    const job = await this.jobService.createJob(createJobDto); // Create the Job entity
    this.logger.log(`Job created with ID: ${job.jobId}`);

    try {
      // Step 2: Publish the update batch to Kafka and handle response
      const response = await this.kafkaService.publish('batch.task.create', tasks);
      this.logger.log(`Successfully published update batch ${batchNumber} to Kafka, response: ${response}`);

      // Step 3: Update Job entity on success
      await this.jobService.updateJob(job.jobId, {
        completedTasks: tasks.length,
        completedBatches: 1,
        status: 'COMPLETED',
        completedAt: new Date(),
      });
      this.logger.log(`Job updated with success for update batch ${batchNumber}`);
    } catch (error) {
      // Step 4: Handle failure and update Job entity
      this.logger.error(`Failed to publish update batch ${batchNumber}: ${error.message}`);
      await this.jobService.updateJob(job.jobId, {
        failedTasks: tasks.length,
        failedBatches: 1,
        status: 'FAILED',
        batchErrors: [{ batchNumber, error: error.message, timestamp: new Date() }],
      });
    }
  }
}
