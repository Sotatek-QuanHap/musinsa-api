import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveCategories({
    categories,
    parentCategory = null,
    level = 1,
    platform,
  }: {
    categories: any[];
    parentCategory?: string | null;
    level?: number;
    platform: string;
  }) {
    for (const category of categories) {
      const id = category.id ?? category.name;
      const savedCategory =
        await this.databaseService.category.findOneAndUpdate(
          { id, platform },
          {
            name: category.name,
            id: category.id,
            url: category.url,
            platform,
            level,
            parentCategory,
          },
          { new: true, upsert: true },
        );

      if (category.children && category.children.length > 0) {
        await this.saveCategories({
          categories: category.children,
          parentCategory: savedCategory._id,
          level: level + 1,
          platform,
        });
      }
    }
  }
}
