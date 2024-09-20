import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from 'winston';
import { WinstonConfigService } from './winston-config.service';

@Injectable()
export class Logger implements LoggerService {
  private readonly logger: WinstonLogger;

  constructor(private readonly winstonConfigService: WinstonConfigService) {
    this.logger = createLogger(this.winstonConfigService.createWinstonOptions());
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
