/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import {
  KafkaTopics as OliveYoungTopics,
  OLIVE_YOUNG_PLATFORM,
  PdpResultConfigs,
} from '../constants';
import { JobStatus } from '../../database/schema/job.schema';
import KafkaProducerService from '../../kafka/kafka.producer';
import { KafkaTopics } from '../../config/constants';

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

    await this.updateSummary(jobId);
    await this.saveParsedProduct(parsedData);
    await this.updateJobStatus(jobId);
    logger.log('Successfully processed parser request.');
  }

  async updateSummary(jobId: string) {
    await this.kafkaProducer.send({
      topic: KafkaTopics.updateJobSummary,
      message: JSON.stringify({
        jobId,
        payload: {
          $inc: {
            'summary.completed': 1,
            'summary.processing': -1,
          },
        },
      }),
    });
  }

  async updateJobStatus(jobId: string) {
    await this.databaseService.job.updateOne(
      {
        _id: jobId,
        $expr: { $eq: ['$summary.completed', '$summary.total'] },
      },
      {
        $set: {
          status: JobStatus.COMPLETED,
        },
      },
    );
  }

  async saveParsedProduct(parsedData: any) {
    await this.databaseService.product.findOneAndUpdate(
      { platform: OLIVE_YOUNG_PLATFORM, productId: parsedData.productId },
      {
        ...parsedData,
        platform: OLIVE_YOUNG_PLATFORM,
      },
      { new: true, upsert: true },
    );
  }

  getTopicNames(): string {
    return OliveYoungTopics.pdpResult;
  }

  getCount(): number {
    return this.configService.get('app.oliveYoung.numberOfPdpResult', 0, {
      infer: true,
    });
  }
}
