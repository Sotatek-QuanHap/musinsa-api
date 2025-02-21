import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EntityDocumentHelper } from '../../utils/document-entity-helper';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { IsEnum } from 'class-validator';

export enum JobStatus {
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
export enum JobType {
  GET_PRODUCT = 'GET_PRODUCT',
  GET_CATEGORY = 'GET_CATEGORY',
}
export enum Platform {
  OLIVE_YOUNG = 'olive-young',
  ABLY = 'ably',
}
export type JobDocument = HydratedDocument<Job>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class Job extends EntityDocumentHelper {
  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  state: MongooseSchema.Types.Mixed;

  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  payload: MongooseSchema.Types.Mixed;

  @Prop({
    type: Number,
    default: 0,
  })
  attempts: number;

  @Prop({
    type: Number,
  })
  maxAttempts: number;

  @Prop({
    type: String,
    enum: JobStatus,
    default: JobStatus.PROCESSING,
    required: true,
  })
  @IsEnum(JobStatus)
  status: JobStatus;

  @Prop({
    type: String,
    enum: JobType,
    required: true,
  })
  @IsEnum(JobType)
  type: JobType;

  @Prop({
    type: Array,
  })
  category: Array<string>;

  @Prop({
    type: String,
  })
  failedReason: string;

  @Prop({
    type: String,
    enum: Platform,
    required: true,
  })
  platform: Platform;

  @Prop({ type: Date })
  endDate: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
