/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { PdpResultConfigs } from 'src/oliveyoung/constants';
import { BaseKafkaHandler } from 'src/utils/base.handler';
import { SandyLogger } from 'src/utils/sandy.logger';
import { KafkaTopics } from './constants';

@Injectable()
export class MongoProductAckHandler extends BaseKafkaHandler {
  constructor(configService: ConfigService, databaseService: DatabaseService) {
    super(configService, databaseService, PdpResultConfigs.name);
    this.params = arguments;
  }
  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    const productIds = data;
    const bulkOps = productIds.map((id: string) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { _fullSynced: true } },
      },
    }));

    try {
      await this.databaseService.product.bulkWrite(bulkOps);
    } catch (error) {
      logger.error('Error updating _fullSync flag in MongoDB:', error);
    }
  }

  getTopicNames(): string {
    return KafkaTopics.PRODUCT_SYNC_ACK;
  }

  getCount(): number {
    return 1;
  }
}
