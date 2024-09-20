import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JobRepository } from '@app/domains/job/repositories/job.repository';

import { CreateJobCommand } from '@app/domains/job/commands/impl/create-job.command';
import { Injectable } from '@nestjs/common';
import { Logger } from '@app/core/common/logger/logger.service';
import { Job } from '../../entities/job.entity';

@CommandHandler(CreateJobCommand)
@Injectable()
export class CreateJobHandler implements ICommandHandler<CreateJobCommand> {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly logger: Logger,
  ) {}

  async execute(command: CreateJobCommand): Promise<Job> {
    const { createJobDto } = command;
    this.logger.log(`Creating a new job with data: ${JSON.stringify(createJobDto)}`);

    const createdJob = await this.jobRepository.create(createJobDto);

    this.logger.log(`Job created successfully with ID: ${createdJob.jobId}`);

    return createdJob;
  }
}