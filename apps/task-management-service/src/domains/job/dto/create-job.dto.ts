// ../apps/task-management-service/src/domains/job/dto/create-job.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @ApiProperty({ description: 'Unique job ID' })
  @IsString()
  jobId: string;

  @ApiProperty({ description: 'Total number of tasks to process' })
  @IsNumber()
  totalTasks: number;

  @ApiProperty({ description: 'Total number of batches' })
  @IsNumber()
  totalBatches: number;

  @ApiProperty({ description: 'Total number of successfully completed tasks' })
  @IsNumber()
  completedTasks: number;

  @ApiProperty({ description: 'Total number of failed tasks' })
  @IsNumber()
  failedTasks: number;

  @ApiProperty({ description: 'Number of batches successfully processed' })
  @IsNumber()
  completedBatches: number;

  @ApiProperty({ description: 'Number of batches that failed' })
  @IsNumber()
  failedBatches: number;

  @ApiProperty({ description: 'Job status (IN_PROGRESS, COMPLETED, FAILED)' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Date when the job was created', type: Date })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the job was completed', type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  completedAt?: Date;

  @ApiProperty({ description: 'Errors encountered during batch processing', type: Array, required: false })
  @IsArray()
  @IsOptional()
  batchErrors: { batchNumber: number; error: string; timestamp: Date }[];
}
