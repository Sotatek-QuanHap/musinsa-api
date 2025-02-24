import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../utils/document-entity-helper';

export type JobTypeSchemaDocument = HydratedDocument<JobType>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class JobType extends EntityDocumentHelper {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const JobTypeSchema = SchemaFactory.createForClass(JobType);
