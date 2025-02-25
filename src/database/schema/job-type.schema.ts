import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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
  key: string;
}

export const JobTypeSchema = SchemaFactory.createForClass(JobType);
