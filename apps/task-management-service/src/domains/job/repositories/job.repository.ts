// ../apps/task-management-service/src/domains/job/repositories/job.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Job, JobDocument } from '@app/domains/job/entities/job.entity';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';
import { UpdateJobDto } from '@app/domains/job/dto/update-job.dto';

@Injectable()
export class JobRepository {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<JobDocument>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const newJob = new this.jobModel(createJobDto);
    return newJob.save();
  }

  async findById(id: string): Promise<Job | null> {
    return this.jobModel.findById(id).exec();
  }

  async findAll(limit: number, skip: number): Promise<Job[]> {
    return this.jobModel.find().skip(skip).limit(limit).exec();
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job | null> {
    return this.jobModel.findOneAndUpdate({ jobId: id }, updateJobDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Job | null> {
    return this.jobModel.findByIdAndDelete(id).exec();
  }

  async countAll(): Promise<number> {
    return this.jobModel.countDocuments();
  }

  async insertMany(createJobDtos: CreateJobDto[], options: { session: ClientSession }): Promise<Job[]> {
    try {
      return await this.jobModel.insertMany(createJobDtos, options);
    } catch (error) {
      throw new Error('Failed to insert jobs in bulk: ' + error.message);
    }
  }
}
