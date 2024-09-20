// ../apps/task-management-service/src/domains/job/services/job.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateJobCommand } from '@app/domains/job/commands/impl/create-job.command';
import { DeleteJobCommand } from '@app/domains/job/commands/impl/delete-job.command';
import { UpdateJobCommand } from '@app/domains/job/commands/impl/update-job.command';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';
import { UpdateJobDto } from '@app/domains/job/dto/update-job.dto';

import { Logger } from '@app/core/common/logger/logger.service';
import { GetJobByIdQuery } from '../queries/impl/get-job-by-id.query';
import { GetAllJobsQuery } from '../queries/impl/get-all-jobs.query';

@Injectable()
export class JobService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  async createJob(createJobDto: CreateJobDto) {
    try {
      this.logger.log(`Creating job with data: ${JSON.stringify(createJobDto)}`);
      const job = await this.commandBus.execute(new CreateJobCommand(createJobDto));
      this.logger.log(`Job created with ID: ${job.jobId}`);
      return job;
    } catch (error) {
      this.logger.error('Failed to create job', error.stack);
      throw new InternalServerErrorException('Failed to create job', error);
    }
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto) {
    try {
      this.logger.log(`Updating job with ID: ${id} and data: ${JSON.stringify(updateJobDto)}`);
      const job = await this.commandBus.execute(new UpdateJobCommand(id, updateJobDto));
      if (!job) {
        this.logger.warn(`Job not found with ID: ${id}`);
        throw new NotFoundException('Job not found');
      }
      this.logger.log(`Job updated successfully with ID: ${id}`);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to update job: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to update job', error.stack);
      throw new InternalServerErrorException('Failed to update job', error);
    }
  }

  async deleteJob(id: string) {
    try {
      this.logger.log(`Deleting job with ID: ${id}`);
      const job = await this.commandBus.execute(new DeleteJobCommand(id));
      if (!job) {
        this.logger.warn(`Job not found with ID: ${id}`);
        throw new NotFoundException('Job not found');
      }
      this.logger.log(`Job deleted successfully with ID: ${id}`);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to delete job: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to delete job', error.stack);
      throw new InternalServerErrorException('Failed to delete job', error);
    }
  }
  async getAllJobs(limit = 10, page = 1) {
    try {
      this.logger.log(`Retrieving all jobs with limit: ${limit}, page: ${page}`);

      const { data, total } = await this.queryBus.execute(new GetAllJobsQuery(limit, page));

      this.logger.log(`Retrieved ${data.length} jobs with total count: ${total}`);

      return { data, total };
    } catch (error) {
      this.logger.error('Failed to retrieve jobs', error.stack);
      throw new InternalServerErrorException('Failed to retrieve jobs', error);
    }
  }

  async getJobById(id: string) {
    try {
      this.logger.log(`Retrieving job with ID: ${id}`);
      const job = await this.queryBus.execute(new GetJobByIdQuery(id));
      if (!job) {
        this.logger.warn(`Job not found with ID: ${id}`);
        throw new NotFoundException('Job not found');
      }
      this.logger.log(`Job retrieved with ID: ${id}`);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Failed to retrieve job: ${error.message}`);
        throw error;
      }
      this.logger.error('Failed to retrieve job', error.stack);
      throw new InternalServerErrorException('Failed to retrieve job', error);
    }
  }
}
