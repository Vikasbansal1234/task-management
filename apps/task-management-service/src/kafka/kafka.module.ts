// apps/chat-server/src/kafka/kafka.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaService } from '@app/kafka/kafka.service';
import { SocketModule } from '@app/socket/socket.module'; // Import SocketModule

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.get<string>('kafka.brokerUrl')],
            },
            consumer: {
              groupId: 'nestjs-consumer-group',
            },
          },
        }),
      },
    ]),
    forwardRef(() => SocketModule), // Add SocketModule here
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
