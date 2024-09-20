import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { Task } from '@app/domains/task/entities/task.entity';
import { GetAllTasksQuery } from '@app/domains/task/queries/impl/get-all-tasks.query';

@QueryHandler(GetAllTasksQuery)
export class GetAllTasksHandler implements IQueryHandler<GetAllTasksQuery> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: GetAllTasksQuery): Promise<{data:Task[],total:number}> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    const tasks = await this.taskRepository.findAll(limit, skip);
    const total = await this.taskRepository.countAll();
    return {
      data: tasks,
      total,
    };
  }
}