// apps/chat-server/src/kafka/kafka.service.ts
import { Injectable, Inject, OnModuleInit, forwardRef } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SocketGateway } from '@app/socket/socket.gateway';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @Inject(forwardRef(() => SocketGateway)) private readonly socketGateway: SocketGateway
  ) {}

  async onModuleInit() {
    
    this.kafkaClient.subscribeToResponseOf('batch.task.create');
    await this.kafkaClient.connect();
  }

  async publish(topic: string, message: any): Promise<any> {
    try {
      // Use `send` for request-response pattern
      return this.kafkaClient.send(topic, message).toPromise();
    } catch (error) {
      throw new Error(`Failed to publish message to Kafka topic "${topic}": ${error.message}`);
    }
  }
}
