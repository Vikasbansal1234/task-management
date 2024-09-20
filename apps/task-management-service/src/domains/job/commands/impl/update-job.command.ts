import { ICommand } from '@nestjs/cqrs';
import { UpdateJobDto } from '@app/domains/job/dto/update-job.dto';

export class UpdateJobCommand implements ICommand {
  constructor(public readonly jobId: string, public readonly updateJobDto: UpdateJobDto) {}
}