import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EntityDocumentHelper } from '../../utils/document-entity-helper';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { IsEnum } from 'class-validator';
import { Product } from './product.schema';

export enum JobStatus {
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum Platform {
  OLIVE_YOUNG = 'olive-young',
  ABLY = 'ably',
}

export enum JobType {
  GET_PRODUCT = 'GET_PRODUCT',
  GET_CATEGORY = 'GET_CATEGORY',
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
    type: Object,
    default: {},
  })
  payload: Record<string, any>;

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
    required: true,
    enum: Platform,
  })
  @IsEnum(Platform)
  platform: Platform;

  @Prop({ type: String, required: true, enum: JobType })
  @IsEnum(JobType)
  type: JobType;

  @Prop({
    type: Array,
  })
  categories: Array<string>;

  @Prop({
    type: String,
  })
  failedReason: string;

  @Prop({ type: { type: Types.ObjectId, ref: Product.name, require: true } })
  product: Types.ObjectId;

  @Prop({
    type: Object,
    default: {
      total: 0,
      pending: 0,
      processing: 0,
      failed: 0,
      completed: 0,
    },
  })
  summary: {
    total: number;
    pending: number;
    processing: number;
    failed: number;
    completed: number;
  };

  @Prop({ type: Date })
  endDate: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
