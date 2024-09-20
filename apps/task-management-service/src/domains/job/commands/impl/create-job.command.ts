import { ICommand } from '@nestjs/cqrs';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';

export class CreateJobCommand implements ICommand {
  constructor(public readonly createJobDto: CreateJobDto) {}
}