/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import {
  CategoryResultConfigs,
  KafkaTopics as AblyKafkaTopics,
  ABLY_PLATFORM,
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
      platform: ABLY_PLATFORM,
      jobId,
    });

    await this.updateJob(jobId);
    logger.log('Successfully processed parser request.');
  }

  async updateJob(jobId: string) {
    await this.databaseService.job.updateOne(
      {
        _id: jobId,
        $and: [
          { $expr: { $eq: ['$summary.completed', '$summary.total'] } },
          { 'summary.total': { $gt: 0 } },
        ],
      },
      {
        $set: {
          status: JobStatus.COMPLETED,
          endDate: new Date(),
        },
      },
    );
  }

  getTopicNames(): string {
    return AblyKafkaTopics.categoryResult;
  }

  getCount(): number {
    return this.configService.get('app.ably.numberOfCategoryResult', 0, {
      infer: true,
    });
  }
}
