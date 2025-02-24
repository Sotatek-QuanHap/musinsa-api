import { Injectable } from '@nestjs/common';
import { Category } from '../sql/entities/category.entity';
import { QueryCategoryDto } from './dto/query-category';
import { ConvertUtil } from '../utils/convert.util';

@Injectable()
export class CategorySqlService {
  constructor() {}

  async findAll(query: QueryCategoryDto) {
    const categories = await Category.find({
      where: query,
      select: {
        id: true,
        platform: true,
        name: true,
        url: true,
        level: true,
        parentCategoryId: true,
      },
    });
    const categoryMap: Map<string, any> = new Map();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });
    return ConvertUtil.buildCategoryTree(categoryMap);
  }
}
