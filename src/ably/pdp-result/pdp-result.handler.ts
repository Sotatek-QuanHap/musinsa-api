/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { ABLY_PLATFORM, KafkaTopics, PdpResultConfigs } from '../constants';
import { isSameProduct } from 'src/utils/database.util';

@Injectable()
export class PDPResultHandler extends BaseKafkaHandler {
  constructor(configService: ConfigService, databaseService: DatabaseService) {
    super(configService, databaseService, PdpResultConfigs.name);
    this.params = arguments;
  }
  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    await this.handleProductChanges(data, logger);
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

  getTopicNames(): string {
    return KafkaTopics.pdpResult;
  }

  getCount(): number {
    return this.configService.get('app.ably.numberOfPdpResult', 0, {
      infer: true,
    });
  }
}
