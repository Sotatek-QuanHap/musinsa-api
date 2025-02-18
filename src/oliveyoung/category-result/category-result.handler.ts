/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import {
  CategoryResultConfigs,
  KafkaTopics,
  OLIVE_YOUNG_PLATFORM,
} from '../constants';
import { CategoryService } from '../../category/category.service';

@Injectable()
export class CategoryResultHandler extends BaseKafkaHandler {
  constructor(
    configService: ConfigService,
    databaseService: DatabaseService,
    private readonly categoryService: CategoryService,
  ) {
    super(configService, databaseService, CategoryResultConfigs.name);
    this.params = arguments;
  }
  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    await this.categoryService.saveCategories({
      categories: data.parsedCategory,
      platform: OLIVE_YOUNG_PLATFORM,
    });
    logger.log('Successfully processed parser request.');
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
