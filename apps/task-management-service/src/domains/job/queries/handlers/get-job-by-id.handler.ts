import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JobRepository } from '@app/domains/job/repositories/job.repository';
import { GetJobByIdQuery } from '@app/domains/job/queries/impl/get-job-by-id.query';
import { Job } from '@app/domains/job/entities/job.entity';

@QueryHandler(GetJobByIdQuery)
export class GetJobByIdHandler implements IQueryHandler<GetJobByIdQuery> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(query: GetJobByIdQuery): Promise<Job | null> {
    return this.jobRepository.findById(query.jobId);
  }
}