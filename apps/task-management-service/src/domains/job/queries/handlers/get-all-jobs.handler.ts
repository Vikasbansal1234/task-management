import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JobRepository } from '@app/domains/job/repositories/job.repository';
import { Job } from '@app/domains/job/entities/job.entity';
import { GetAllJobsQuery } from '@app/domains/job/queries/impl/get-all-jobs.query';

@QueryHandler(GetAllJobsQuery)
export class GetAllJobsHandler implements IQueryHandler<GetAllJobsQuery> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(query: GetAllJobsQuery): Promise<{ data: Job[]; total: number }> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    const jobs = await this.jobRepository.findAll(limit, skip);
    const total = await this.jobRepository.countAll();
    return {
      data: jobs,
      total,
    };
  }
}