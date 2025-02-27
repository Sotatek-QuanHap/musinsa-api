import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../utils/document-entity-helper';

export type PlatformSchemaDocument = HydratedDocument<Platform>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class Platform extends EntityDocumentHelper {
  @Prop({ type: String, unique: true })
  key: string;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  categoryUrl: string;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
