import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JobRepository } from '@app/domains/job/repositories/job.repository';
import { UpdateJobCommand } from '@app/domains/job/commands/impl/update-job.command';

import { NotFoundException, Injectable } from '@nestjs/common';
import { Logger } from '@app/core/common/logger/logger.service';
import { Job } from '../../entities/job.entity';

@CommandHandler(UpdateJobCommand)
@Injectable()
export class UpdateJobHandler implements ICommandHandler<UpdateJobCommand> {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly logger: Logger,
  ) {}

  async execute(command: UpdateJobCommand): Promise<Job | null> {
    this.logger.log(`Updating job with ID: ${command.jobId}`);

    const existingJob = await this.jobRepository.findById(command.jobId);

    if (!existingJob) {
      this.logger.warn(`Job not found with ID: ${command.jobId}`);
      throw new NotFoundException('Job not found');
    }

    const updatedJob = await this.jobRepository.update(existingJob.jobId, command.updateJobDto);
    this.logger.log(`Job updated successfully with ID: ${existingJob.jobId}`);

    return updatedJob;
  }
}