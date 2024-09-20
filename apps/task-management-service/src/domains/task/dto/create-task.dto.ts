import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsEnum, IsOptional } from 'class-validator';

export class CreateTaskDto {

  @ApiPropertyOptional({ description: 'ID of the task (auto-generated)' })
  @IsOptional()
  @IsString() 
  id?: string;

  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ description: 'Description of the task' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ description: 'Priority of the task', enum: ['Low', 'Medium', 'High'] })
  @IsEnum(['Low', 'Medium', 'High'])
  readonly priority: string;

  @ApiProperty({ description: 'Status of the task', enum: ['To Do', 'In Progress', 'Done'] })
  @IsEnum(['To Do', 'In Progress', 'Done'])
  readonly status: string;

  @ApiProperty({ description: 'Deadline of the task', type: Date, format:'date-time' })
  @Type(()=>Date)
  @IsDate()
  readonly deadline: Date;
}