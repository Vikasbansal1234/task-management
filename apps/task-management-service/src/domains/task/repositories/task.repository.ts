import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Task, TaskDocument } from '@app/domains/task/entities/task.entity';
import { CreateTaskDto } from '@app/domains/task/dto/create-task.dto';
import { UpdateTaskDto } from '@app/domains/task/dto/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel(createTaskDto);
    return newTask.save();
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  async findAll(limit: number, skip: number): Promise<Task[]> {
    return this.taskModel.find().skip(skip).limit(limit).exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    return this.taskModel.findOneAndUpdate({ _id: id }, updateTaskDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Task | null> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }

  async countAll(): Promise<number> {
    return await this.taskModel.countDocuments();
  }

  async insertMany(createTaskDtos: CreateTaskDto[], options: { session: ClientSession }): Promise<Task[]> {
    try {
      // Pass the session into the insertMany method
      return await this.taskModel.insertMany(createTaskDtos, options);
    } catch (error) {
      throw new Error('Failed to insert tasks in bulk: ' + error.message);
    }
  }

  async bulkWrite(operations: any[]): Promise<any> {
    try {
      return await this.taskModel.bulkWrite(operations);
    } catch (error) {
      throw new Error('Failed to perform bulkWrite operation: ' + error.message);
    }
  }
}