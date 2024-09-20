import { GetJobByIdHandler } from './handlers/get-job-by-id.handler';
import { GetAllJobsHandler } from './handlers/get-all-jobs.handler';

export const JobQueryHandlers = [
  GetJobByIdHandler,
  GetAllJobsHandler,
];