import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategorySchemaDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { PLPResult, PlpResultDocument } from './schema/plp-result.schema';
import {
  ParserConfig,
  ParserConfigSchemaDocument,
} from './schema/parser-config.schema';
import { Product, ProductSchemaDocument } from './schema/product.schema';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Category.name) public category: Model<CategorySchemaDocument>,
    @InjectModel(PLPResult.name) public plpResult: Model<PlpResultDocument>,
    @InjectModel(ParserConfig.name)
    public parserConfig: Model<ParserConfigSchemaDocument>,
    @InjectModel(Product.name) public product: Model<ProductSchemaDocument>,
  ) {}
}
