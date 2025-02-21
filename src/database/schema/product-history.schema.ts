import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductHistorySchemaDocument = HydratedDocument<ProductHistory>;

@Schema({ timestamps: true })
export class ProductHistory {
  @Prop()
  productId: string;

  @Prop()
  platform: string;

  @Prop()
  normalPrice: number;

  @Prop()
  salePrice: number;

  @Prop()
  finalPrice: number;

  @Prop()
  coupon: number;

  @Prop()
  stock: number;

  @Prop()
  reviewCount: number;

  @Prop()
  soldOut: string;

  @Prop({ required: true })
  recordedAt: Date;
}

export const ProductHistorySchema =
  SchemaFactory.createForClass(ProductHistory);
ProductHistorySchema.index(
  { productId: 1, platform: 1, recordedAt: 1 },
  { unique: true },
);
