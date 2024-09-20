import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './domains/task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from '@app/config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketModule } from '@app/socket/socket.module';
import { KafkaModule } from '@app/kafka/kafka.module';
import { RedisModule } from '@app/redis/redis.module';
import { JobModule } from './domains/job/job.module';

@Module({
  imports: [TaskModule.forRoot(),
    JobModule, 
    KafkaModule,
    SocketModule,
    RedisModule,
    ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => 
       ({
      uri: configService.get<string>('database.url')
    })
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
