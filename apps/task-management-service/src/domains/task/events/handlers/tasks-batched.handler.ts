// ../apps/task-management-service/src/domains/task/events/handlers/tasks-batched.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TasksBatchedEvent } from '../impl/tasks-batched.event';
import { KafkaService } from '@app/kafka/kafka.service';
import { JobService } from '@app/domains/job/services/job.service'; // Import the JobService to create/update Job entity
import { Logger } from '@app/core/common/logger/logger.service';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';

@EventsHandler(TasksBatchedEvent)
export class TasksBatchedEventHandler implements IEventHandler<TasksBatchedEvent> {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jobService: JobService, // Inject JobService
    private readonly logger: Logger
  ) { }

  async handle(event: TasksBatchedEvent): Promise<void> {
    const { tasks, batchNumber, jobObjectId } = event;
    this.logger.log(`Processing batch ${batchNumber} for task creation... ${tasks.length}`);

    try {
      const response = await this.kafkaService.publish('batch.task.create', { batchTasks: tasks, jobId: jobObjectId, batchNumber });
      this.logger.log(`Successfully published batch ${batchNumber} to Kafka, response: ${response}`);

      this.logger.log(`Job updated with success for batch ${batchNumber}`);
    } catch (error) {
      // Step 4: Handle failure and update Job entity
      this.logger.error(`Failed to publish batch ${batchNumber}: ${error.message}`);
      await this.jobService.updateJob(jobObjectId, {
        failedTasks: tasks.length,
        failedBatches: 1,
        status: 'FAILED',
        batchErrors: [{ batchNumber, error: error.message, timestamp: new Date() }],
      });
    }
  }
}
