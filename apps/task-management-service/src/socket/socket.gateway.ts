import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chat' })
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  // private intervalId: NodeJS.Timeout;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // this.startEmittingEvents();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Clear interval on module destroy to prevent memory leaks
  onModuleDestroy() {
    // if (this.intervalId) {
    //   clearInterval(this.intervalId);
    // }
  }

  // Start emitting random events for tasks and jobs
  // startEmittingEvents() {
  //   this.intervalId = setInterval(() => {
  //     const eventType = this.getRandomEventType();

  //     switch (eventType) {
  //       case 'task_created':
  //         this.emitTaskCreated();
  //         break;
  //       case 'task_updated':
  //         this.emitTaskUpdated();
  //         break;
  //       case 'task_deleted':
  //         this.emitTaskDeleted();
  //         break;
  //       case 'job_created':
  //         this.emitJobCreated();
  //         break;
  //       case 'job_updated':
  //         this.emitJobUpdated();
  //         break;
  //       case 'job_deleted':
  //         this.emitJobDeleted();
  //         break;
  //     }
  //   }, 5000); // Emit every 5 seconds for demo purposes
  // }

  // Get a random event type for tasks or jobs
  // getRandomEventType(): string {
  //   const eventTypes = [
  //     'task_created',
  //     'task_updated',
  //     'task_deleted',
  //     'job_created',
  //     'job_updated',
  //     'job_deleted',
  //   ];
  //   const randomIndex = Math.floor(Math.random() * eventTypes.length);
  //   return eventTypes[randomIndex];
  // }

  // Emit task_created event
  emitTaskCreated() {
    const task = {
      _id: 'task_' + Math.floor(Math.random() * 1000),
      title: 'New Task',
      description: 'This is a new task description',
      priority: 'Medium',
      status: 'To Do',
      deadline: '2024-12-01T00:00:00Z',
    };

    this.server.emit('task_created', { task });
    console.log('Emitted task_created:', task);
  }

  // Emit task_updated event
  emitTaskUpdated() {
    const task = {
      _id: 'task_' + Math.floor(Math.random() * 1000),
      title: 'Updated Task',
      description: 'This is an updated task description',
      priority: 'High',
      status: 'In Progress',
      deadline: '2024-12-10T00:00:00Z',
    };

    this.server.emit('task_updated', { task });
    console.log('Emitted task_updated:', task);
  }

  // Emit task_deleted event
  emitTaskDeleted() {
    const taskId = 'task_' + Math.floor(Math.random() * 1000);

    this.server.emit('task_deleted', { taskId });
    console.log('Emitted task_deleted:', taskId);
  }

  // Emit job_created event
  emitJobCreated(createdJob) {
    const job = {
      ...createdJob
    };

    this.server.emit('job_created', { job });
    console.log('Emitted job_created:', job);
  }

  // Emit job_updated event
  emitJobUpdated(updatedJob) {
    this.server.emit('job_updated', { job: updatedJob });
    console.log('Emitted job_updated:', updatedJob);
  }

  // Emit job_deleted event
  emitJobDeleted() {
    const jobId = 'job_' + Math.floor(Math.random() * 1000);

    this.server.emit('job_deleted', { jobId });
    console.log('Emitted job_deleted:', jobId);
  }
}
