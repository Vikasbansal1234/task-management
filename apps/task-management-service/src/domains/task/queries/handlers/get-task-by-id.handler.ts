import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { GetTaskByIdQuery } from '@app/domains/task/queries/impl/get-task-by-id.query';
import { Task } from '@app/domains/task/entities/task.entity';

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: GetTaskByIdQuery): Promise<Task | null> {
    return this.taskRepository.findById(query.id);
  }
}