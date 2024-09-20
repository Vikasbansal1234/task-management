import { IQuery } from '@nestjs/cqrs';

export class GetAllTasksQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}