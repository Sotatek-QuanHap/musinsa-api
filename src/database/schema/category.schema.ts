import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '../../utils/document-entity-helper';

export type CategorySchemaDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class Category extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  id: string;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  url: string;

  @Prop({
    type: Number,
  })
  level: number;

  @Prop({
    type: String,
  })
  platform: string;

  @Prop({
    type: Boolean,
  })
  isLeaf: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
  })
  parentCategory: CategorySchemaDocument;

  @Prop({
    type: [Types.ObjectId],
    ref: Category.name,
  })
  parentCategories?: CategorySchemaDocument[];

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ id: 1, platform: 1 }, { unique: true });
