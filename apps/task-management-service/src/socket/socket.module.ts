// apps/chat-server/src/socket/socket.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from '@app/socket/socket.gateway';
import { KafkaModule } from '@app/kafka/kafka.module';

@Module({
  imports: [forwardRef(() => KafkaModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
