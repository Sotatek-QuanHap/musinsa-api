import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategorySchemaDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import {
  ParserConfig,
  ParserConfigSchemaDocument,
} from './schema/parser-config.schema';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Category.name) public category: Model<CategorySchemaDocument>,
    @InjectModel(ParserConfig.name)
    public parserConfig: Model<ParserConfigSchemaDocument>,
  ) {}
}
