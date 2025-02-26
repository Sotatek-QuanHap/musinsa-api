import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DbsyncConfigSchemaDocument = HydratedDocument<DbsyncConfig>;

@Schema({
  timestamps: true,
})
export class DbsyncConfig {
  @Prop()
  compareFields: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DbsyncConfigSchema = SchemaFactory.createForClass(DbsyncConfig);
