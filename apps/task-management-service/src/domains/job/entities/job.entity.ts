// ../apps/task-management-service/src/domains/job/entities/job.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job {
  @Prop({ required: true })
  jobId: string;

  @Prop({ required: true })
  totalTasks: number; // Total number of tasks to process

  @Prop({ required: true })
  totalBatches: number; // Total number of batches

  @Prop({ required: true })
  completedTasks: number; // Total number of successfully completed tasks

  @Prop({ required: true })
  failedTasks: number; // Total number of failed tasks

  @Prop({ required: true })
  completedBatches: number; // Number of batches successfully processed

  @Prop({ required: true })
  failedBatches: number; // Number of batches that failed

  @Prop({ required: true })
  status: string; // IN_PROGRESS, COMPLETED, FAILED

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  completedAt: Date; // The time when the job was completed

  @Prop({ type: [{ batchNumber: Number, error: String, timestamp: Date }], default: [] })
  batchErrors: { batchNumber: number; error: string; timestamp: Date }[]; // To store batch-specific errors
}

export const JobSchema = SchemaFactory.createForClass(Job);
