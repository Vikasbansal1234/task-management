import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto } from '@app/domains/task/dto/create-task.dto';
import { UpdateTaskDto } from '@app/domains/task/dto/update-task.dto';
import { TaskService } from '@app/domains/task/services/task.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '@app/config/multerConfig';
import { Express } from 'express'; 

@ApiTags('Task')
@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.taskService.getAllTasks(limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Post('bulk-create')
  @ApiOperation({ summary: 'Bulk create tasks via CSV or XLSX file' })
  @UseInterceptors(FileInterceptor('file', MulterConfig('bulk-create-tasks'))) // Use multer config
  async bulkCreate(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.taskService.processUploadedFile(file.path, file.mimetype);
  }

   //Kafka Request-Response: Create Bulk Tasks
   @MessagePattern('batch.task.create')
   async handleBulkCreateTasks(@Payload() message: any, @Ctx() context: KafkaContext): Promise<any> {
     console.log('Received Kafka Message for batch.task.create');
     await this.taskService.bulkCreateTasks(message);
   }
 
}