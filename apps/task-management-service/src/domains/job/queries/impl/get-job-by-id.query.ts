import { IQuery } from '@nestjs/cqrs';

export class GetJobByIdQuery implements IQuery {
  constructor(public readonly jobId: string) {}
}