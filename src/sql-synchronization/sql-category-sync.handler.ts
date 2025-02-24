/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { KafkaTopics } from './constants';
import { BaseKafkaHandler } from 'src/utils/base.handler';
import { ConfigService } from '@nestjs/config';
import { SandyLogger } from 'src/utils/sandy.logger';
import { DataSource, Repository } from 'typeorm';
import { Category } from 'src/sql/entities/category.entity';

@Injectable()
export class SqlCategorySyncHandler extends BaseKafkaHandler {
  private categoryRepository: Repository<Category>;

  constructor(
    configService: ConfigService,
    databaseService: DatabaseService,
    private dataSource: DataSource,
  ) {
    super(configService, databaseService, 'CategorySyncListener');
    this.params = arguments;
    this.categoryRepository = this.dataSource.getRepository(Category);
  }

  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(categories: any, logger: SandyLogger): Promise<any> {
    const transformedCategories = categories.map((cat: Category) => ({
      id: cat.id,
      platform: cat.platform,
      name: cat.name,
      url: cat.url || null,
      level: cat.level || null,
      parentCategoryId: cat.parentCategory ? cat.parentCategory.id : null,
      parentPlatform: cat.platform,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    // Sort categories to insert parents first
    transformedCategories.sort(
      (a: Category, b: Category) => (a.level || 0) - (b.level || 0),
    );

    try {
      await this.categoryRepository
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(transformedCategories)
        .orIgnore()
        .execute();
    } catch (error) {
      logger.error('Error inserting categories into PostgreSQL:', error);
    }
  }

  getTopicNames(): string {
    return KafkaTopics.CATEGORY_SYNC;
  }

  getCount(): number {
    return 1;
  }
}
