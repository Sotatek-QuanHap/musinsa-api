import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategorySchemaDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { PLPResult, PlpResultDocument } from './schema/plp-result.schema';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Category.name) public category: Model<CategorySchemaDocument>,
    @InjectModel(PLPResult.name) public plpResult: Model<PlpResultDocument>,
  ) {}
}
