import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  
  _id?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['Low', 'Medium', 'High'], default: 'Medium' })
  priority: string;

  @Prop({ required: true, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' })
  status: string;

  @Prop({ required: true })
  deadline: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);