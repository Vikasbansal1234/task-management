import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [LoggerModule], // Import the MinioModule if it's not globally available
  providers: [],
  exports: [LoggerModule], // Export the DocumentService so it can be used in other modules
})
export class CoreModule {}
