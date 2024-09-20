import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { JobController } from './controllers/job.controller';
import { JobService } from './services/job.service';
import { JobRepository } from './repositories/job.repository';
import { JobCommandHandlers } from './commands';
import { Job, JobSchema } from './entities/job.entity';
import { CoreModule } from '@app/core/core.module';
import { JobQueryHandlers } from './queries';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    CqrsModule,
    CoreModule,
  ],
  controllers: [JobController],
  providers: [
    JobService,
    JobRepository,
    ...JobCommandHandlers,
    ...JobQueryHandlers
  ],
  exports: [JobService, JobRepository],
})
export class JobModule {}