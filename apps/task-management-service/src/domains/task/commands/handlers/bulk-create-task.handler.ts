import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { BulkCreateTasksCommand } from '../impl/bulk-create-task.command';
import { Logger } from '@app/core/common/logger/logger.service';
import { TaskRepository } from '../../repositories/task.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { JobService } from '@app/domains/job/services/job.service';
import { SocketGateway } from '@app/socket/socket.gateway';
import { RedisService } from '@app/redis/redis.service';

@CommandHandler(BulkCreateTasksCommand)
export class BulkCreateTasksHandler implements ICommandHandler<BulkCreateTasksCommand> {
  constructor(
    private readonly logger: Logger,
    private readonly taskRepository: TaskRepository,
    private readonly jobService: JobService,
    private readonly socketGateway: SocketGateway,
    private readonly redisService: RedisService
  ) { }

  async bulkInsertWithRetryAndLogging(tasks: CreateTaskDto[]): Promise<any> {
    let attempts = 0;
    const maxRetries = 3;

    const bulkOperations = tasks.map(task => {
      if (task.id) {
        return {
          updateOne: {
            filter: { _id: task.id },  
            update: { $set: task },   
            upsert: true,
          }
        };
      } else {
        // If there's no id, it's an insert
        return {
          insertOne: {
            document: task,
          }
        };
      }
    });

    try {
      while (attempts < maxRetries) {
        try {
          const result = await this.taskRepository.bulkWrite(bulkOperations);
          return result;
        } catch (error) {
          attempts++;
          this.logger.error(`Attempt ${attempts}: Bulk operation failed: ${error.message}`, error.stack);

          if (attempts >= maxRetries) {
            this.logger.log('Max retries reached, aborting transaction.');
            throw new InternalServerErrorException('Bulk operation failed after max retries.');
          }
        }
      }
    } catch (error) {
      this.logger.error('Error whle Bulk Operatiosn: ', error.stack);
      throw new InternalServerErrorException('Bulk operation failed.');
    } 
  }

  async bulkInsertInRedis(tasks: CreateTaskDto[], result: any): Promise<any> {
    const bulkKeys = tasks.map((task, index) => {
      const taskId = task.id || result.insertedIds?.[index]?._id;  // Use task.id or the insertedId from result
      return {
        key: taskId,
        value: JSON.stringify(task)
      };
    });

    // Insert in Redis
    await this.redisService.bulkInsert(bulkKeys);
  }


  async execute(command: BulkCreateTasksCommand): Promise<void> {
    const { tasks, jobId, batchNumber } = command;
    try {
      const clonedTasks = JSON.parse(JSON.stringify(tasks));
      const inserted = await this.bulkInsertWithRetryAndLogging(clonedTasks);
      await this.bulkInsertInRedis(clonedTasks, inserted);
      if (inserted) {
        const job = await this.jobService.getJobById(jobId);
        let updateStatus = {};
        if (batchNumber >= job.totalBatches) {
          updateStatus = {
            status: 'COMPLETED',
          }
        }

        // update job:
        await this.jobService.updateJob(job._id, {
          completedTasks: job.completedTasks + tasks.length,
          completedBatches: job.completedBatches + 1,
          completedAt: new Date(),
          ...updateStatus
        });


        this.socketGateway.emitJobUpdated(job);
      }
      return inserted;

    } catch (error) {
      this.logger.error(`Failed to publish batch ${batchNumber}: ${error.message}`);
      await this.jobService.updateJob(jobId, {
        failedTasks: tasks.length,
        failedBatches: 1,
        status: 'FAILED',
        batchErrors: [{ batchNumber, error: error.message, timestamp: new Date() }],
      });
    }

  }
}
