/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import {
  ABLY_PLATFORM,
  PdpResultConfigs,
  KafkaTopics as AblyKafkaTopics,
} from '../constants';
import { isSameProduct } from 'src/utils/database.util';
import KafkaProducerService from '../../kafka/kafka.producer';
import { JobStatus } from '../../database/schema/job.schema';

@Injectable()
export class PDPResultHandler extends BaseKafkaHandler {
  constructor(
    configService: ConfigService,
    databaseService: DatabaseService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {
    super(configService, databaseService, PdpResultConfigs.name);
    this.params = arguments;
  }
  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(
    data: {
      parsedData: any;
      jobId: string;
    },
    logger: SandyLogger,
  ): Promise<any> {
    const { parsedData, jobId } = data;

    await this.updateJobSummary(jobId);
    await this.handleProductChanges(parsedData, logger);
    await this.updateJob(jobId);
    logger.log('Successfully saved parsed product.');
  }

  async handleProductChanges(data: any, logger: SandyLogger): Promise<any> {
    // get old product to compare with new product
    const oldProduct = await this.databaseService.product.findOne({
      platform: ABLY_PLATFORM,
      productId: data.productId,
    });

    // only care about some fields in the dbconfig document
    const syncConfig = await this.databaseService.dbSyncConfig.findOne({
      compareFields: true,
    });

    if (
      syncConfig &&
      isSameProduct(oldProduct, data, syncConfig.compareFields)
    ) {
      logger.log('Product is same as old product, skipping.');
      return;
    }

    // save new product
    await this.saveParsedProduct(data);

    // once a day, insert the product history
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    await this.databaseService.productHistory.updateOne(
      { platform: ABLY_PLATFORM, productId: data.productId, recordedAt: today },
      {
        $set: {
          ...data,
          platform: ABLY_PLATFORM,
          recordedAt: today,
        },
      },
      { new: true, upsert: true },
    );
  }

  async saveParsedProduct(parsedData: any) {
    await this.databaseService.product.findOneAndUpdate(
      { platform: ABLY_PLATFORM, productId: parsedData.productId },
      { platform: ABLY_PLATFORM, ...parsedData },
      { new: true, upsert: true },
    );
  }

  async updateJobSummary(jobId: string) {
    await this.databaseService.job.updateOne(
      {
        _id: jobId,
      },
      {
        $inc: {
          'summary.completed': 1,
          'summary.processing': -1,
        },
      },
    );
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
    return AblyKafkaTopics.pdpResult;
  }

  getCount(): number {
    return this.configService.get('app.ably.numberOfPdpResult', 0, {
      infer: true,
    });
  }
}
