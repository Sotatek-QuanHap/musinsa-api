import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategorySchemaDocument } from './schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Category.name) public category: Model<CategorySchemaDocument>,
  ) {}
}
