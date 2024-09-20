import { Module, DynamicModule } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';
import { TaskCommandHandlers } from './commands';
import { TaskQueryHandlers } from './queries';
import { CoreModule } from '@app/core/core.module';
import { Task, TaskSchema } from './entities/task.entity';
import { Connection } from 'mongoose';
import { TaskEventHandlers } from './events';
import { Kafka } from 'kafkajs';
import { KafkaModule } from '@app/kafka/kafka.module';
import { JobModule } from '../job/job.module';
import { SocketModule } from '@app/socket/socket.module';
import { RedisModule } from '@app/redis/redis.module';

@Module({})
export class TaskModule {
  static forRoot(): DynamicModule {
    return {
      module: TaskModule,
      imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        CqrsModule,
        CoreModule,
        KafkaModule,
        SocketModule,
        RedisModule,
        JobModule,
      ],
      providers: [
        TaskService,
        TaskRepository,
        ...TaskCommandHandlers,
        ...TaskQueryHandlers,
        ...TaskEventHandlers,
        {
          provide: Connection,  // Provide the `Connection` object using `getConnectionToken`
          useFactory: (connection: Connection) => connection,
          inject: [getConnectionToken()],
        },
      ],
      controllers: [TaskController],
      exports: [
        TaskService,
        TaskRepository,
        ...TaskCommandHandlers,
        ...TaskQueryHandlers,
        ...TaskEventHandlers
      ],
    };
  }
}