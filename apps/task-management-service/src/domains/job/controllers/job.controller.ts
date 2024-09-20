import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';
import { UpdateJobDto } from '@app/domains/job/dto/update-job.dto';
import { JobService } from '@app/domains/job/services/job.service';

@ApiTags('Job')
@Controller('api/jobs')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'The job has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job by ID' })
  @ApiResponse({ status: 200, description: 'Return the job.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  findOne(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a job by ID' })
  @ApiResponse({ status: 200, description: 'The job has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job by ID' })
  @ApiResponse({ status: 200, description: 'The job has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  remove(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs with pagination' })
  @ApiResponse({ status: 200, description: 'Return all jobs with pagination.' })
  findAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    return this.jobService.getAllJobs(limit, page);
  }
}