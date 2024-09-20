import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { ElasticsearchTransport, ElasticsearchTransportOptions } from 'winston-elasticsearch';

@Injectable()
export class WinstonConfigService {
  constructor(private configService: ConfigService) {}

  createWinstonOptions(): winston.LoggerOptions {
    const logLevel = this.configService.get<string>('LOG_LEVEL', 'info');
    const loggingDestination = this.configService.get<string>('LOGGING_DESTINATION', 'console');
    const logFilePath = this.configService.get<string>('LOG_FILE_PATH', 'logs/app.log');
    const esNode = this.configService.get<string>('ELASTICSEARCH_NODE');
    const esApiKey = this.configService.get<string>('ELASTICSEARCH_API_KEY');
    const esIndexPrefix = this.configService.get<string>('ELASTICSEARCH_INDEX_PREFIX', 'nestjs-logs');

    const transports: winston.transport[] = [];

    if (loggingDestination === 'file') {
      transports.push(
        new winston.transports.File({
          filename: logFilePath,
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        })
      );
    } else {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
          level: logLevel,
        })
      );
    }

    if (esNode && esApiKey) {
      const esTransportOpts: ElasticsearchTransportOptions = {
        level: logLevel,
        clientOpts: {
          node: esNode,
          auth: {
            apiKey: esApiKey,
          },
        },
        indexPrefix: esIndexPrefix,
      };
      transports.push(new ElasticsearchTransport(esTransportOpts));
    }

    return {
      level: logLevel,
      format: winston.format.json(),
      transports,
    };
  }
}
