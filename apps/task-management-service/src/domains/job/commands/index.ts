import { CreateJobHandler } from './handlers/create-job.handler';
import { UpdateJobHandler } from './handlers/update-job.handler';
import { DeleteJobHandler } from './handlers/delete-job.handler';

export const JobCommandHandlers = [
  CreateJobHandler,
  UpdateJobHandler,
  DeleteJobHandler,
];