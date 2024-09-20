import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { WinstonConfigService } from './winston-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ ConfigModule.forRoot({
    load: [],
    isGlobal: true,
  }),],
  providers: [Logger, WinstonConfigService],
  exports: [Logger],
})
export class LoggerModule {}
