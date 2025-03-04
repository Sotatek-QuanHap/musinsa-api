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
import { JobStatus } from '../../database/schema/job.schema';

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

  async process(
    data: {
      parsedCategory: any;
      jobId: string;
    },
    logger: SandyLogger,
  ): Promise<any> {
    const { jobId, parsedCategory } = data;
    await this.categoryService.saveCategories({
      categories: parsedCategory,
      platform: OLIVE_YOUNG_PLATFORM,
      jobId,
    });
    await this.updateJob(jobId);
    logger.log('Successfully processed parser request.');
  }

  async updateJob(jobId: string) {
    await this.databaseService.job.updateOne(
      {
        _id: jobId,
      },
      {
        $set: {
          status: JobStatus.COMPLETED,
          endDate: new Date(),
        },
      },
    );
    await this.databaseService.job.updateOne(
      {
        _id: jobId,
        'summary.processing': { $lt: 0 },
      },
      {
        $set: {
          'summary.processing': 0,
        },
      },
    );
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
