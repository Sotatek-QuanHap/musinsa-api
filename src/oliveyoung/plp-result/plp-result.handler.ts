/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { ConfigService } from '@nestjs/config';
import { KafkaTopics, PLPResultConfigs } from '../constants';
import KafkaProducerService from '../../kafka/kafka.producer';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class PLPResultHandler extends BaseKafkaHandler {
  constructor(
    configService: ConfigService,
    private readonly kafkaProducer: KafkaProducerService,
    databaseService: DatabaseService,
  ) {
    super(configService, databaseService, PLPResultConfigs.name);
    this.params = arguments;
  }

  public async process(data: any): Promise<any> {
    await this.databaseService.plpResult.updateOne(
      {
        categoryId: data.categoryId,
      },
      {
        categoryId: data.categoryId,
        metadata: data.productList,
      },
      { upsert: true },
    );
    for (const product of data.productList) {
      await this.kafkaProducer.send({
        topic: KafkaTopics.pdpCrawlerRequest,
        message: JSON.stringify(product),
      });
    }
  }

  async setup(): Promise<void> {}

  public validator(): Promise<void> {
    return Promise.resolve();
  }

  getCount(): number {
    return this.configService.get('app.oliveYoung.numberOfPlpResult', 0, {
      infer: true,
    });
  }
}
