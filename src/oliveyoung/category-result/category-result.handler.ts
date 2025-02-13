/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { CategoryResultConfigs, KafkaTopics } from '../constant';

@Injectable()
export class CategoryResultHandler extends BaseKafkaHandler {
  constructor(configService: ConfigService, databaseService: DatabaseService) {
    super(configService, databaseService, CategoryResultConfigs.name);
    this.params = arguments;
  }
  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    logger.log('Start process');
    await this.saveCategories(data.parsedCategory);
  }

  async saveCategories(
    categories: any[],
    parentCategory: string | null = null,
    level = 1,
  ) {
    for (const category of categories) {
      const field = category.id ? 'id' : 'name';
      const savedCategory =
        await this.databaseService.category.findOneAndUpdate(
          { [field]: category[field] },
          {
            name: category.name,
            id: category.id,
            url: category.url,
            platform: 'olive-young',
            level,
            parentCategory,
          },
          { new: true, upsert: true },
        );

      if (category.children && category.children.length > 0) {
        await this.saveCategories(
          category.children,
          savedCategory._id,
          level + 1,
        );
      }
    }
  }

  getTopicNames(): string {
    return KafkaTopics.categoryResult;
  }

  getCount(): number {
    return this.configService.get('app.oliveYoung.numberOfCategoryResult', 0, {
      infer: true,
    });
  }
}
