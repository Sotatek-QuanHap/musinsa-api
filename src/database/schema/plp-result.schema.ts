import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

// Interface of PlpResult
export type PlpResultDocument = PLPResult & Document;

@Schema()
export class PLPResult {
  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true, unique: true, type: MongooseSchema.Types.Mixed })
  metadata: Array<Map<string, string>>;
}

// Create a schema from the PLPResult class
export const PLPResultSchema = SchemaFactory.createForClass(PLPResult);
