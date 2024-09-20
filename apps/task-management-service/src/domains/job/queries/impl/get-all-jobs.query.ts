import { IQuery } from '@nestjs/cqrs';

export class GetAllJobsQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}