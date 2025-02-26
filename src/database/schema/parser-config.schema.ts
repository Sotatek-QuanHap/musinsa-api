import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../utils/document-entity-helper';

export type ParserConfigSchemaDocument = HydratedDocument<ParserConfig>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ParserConfig extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  key: 'PDPParser' | 'CategoryParser' | 'PLPParser';

  @Prop({
    type: Object,
  })
  value: object;

  @Prop()
  platform: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ParserConfigSchema = SchemaFactory.createForClass(ParserConfig);
ParserConfigSchema.index({ key: 1 }, { unique: true });
ParserConfigSchema.index({ platform: 1 }, { unique: true });
