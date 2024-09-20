import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JobRepository } from '@app/domains/job/repositories/job.repository';
import { DeleteJobCommand } from '@app/domains/job/commands/impl/delete-job.command';

import { NotFoundException, Injectable } from '@nestjs/common';
import { Logger } from '@app/core/common/logger/logger.service';
import { Job } from '../../entities/job.entity';

@CommandHandler(DeleteJobCommand)
@Injectable()
export class DeleteJobHandler implements ICommandHandler<DeleteJobCommand> {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly logger: Logger,
  ) {}

  async execute(command: DeleteJobCommand): Promise<Job | null> {
    this.logger.log(`Deleting job with ID: ${command.jobId}`);

    const existingJob = await this.jobRepository.findById(command.jobId);

    if (!existingJob) {
      this.logger.warn(`Job not found with ID: ${command.jobId}`);
      throw new NotFoundException('Job not found');
    }

    const deletedJob = await this.jobRepository.delete(command.jobId);
    this.logger.log(`Job deleted successfully with ID: ${command.jobId}`);

    return deletedJob;
  }
}