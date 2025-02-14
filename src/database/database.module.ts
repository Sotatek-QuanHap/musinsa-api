import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import {
  ParserConfig,
  ParserConfigSchema,
} from './schema/parser-config.schema';
import { Product, ProductSchema } from './schema/product.schema';
import { PLPResult, PLPResultSchema } from './schema/plp-result.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PLPResult.name,
        useFactory: () => {
          const schema = PLPResultSchema;
          return schema;
        },
      },
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;
          return schema;
        },
      },
      {
        name: ParserConfig.name,
        useFactory: () => {
          const schema = ParserConfigSchema;
          return schema;
        },
      },
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          return schema;
        },
      },
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
