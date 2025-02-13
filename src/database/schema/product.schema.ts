import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../utils/document-entity-helper';

export type ProductSchemaDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class Product extends EntityDocumentHelper {
  @Prop()
  productName: string;

  @Prop()
  productId: string;

  @Prop()
  url: string;

  @Prop()
  category: string;

  @Prop()
  brandName: string;

  @Prop()
  sellerName: string;

  @Prop()
  normalPrice: number;

  @Prop()
  salePrice: number;

  @Prop()
  finalPrice: number;

  @Prop()
  couponPrice: number;

  @Prop()
  reviewCount: string;

  @Prop()
  stock: number;

  @Prop()
  saleInfo: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  extraInfo: any;

  @Prop()
  platform: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
