/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { ABLY_PLATFORM, KafkaTopics, PdpResultConfigs } from '../constants';

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
    await this.saveParsedProduct(data);
    logger.log('Successfully saved parsed product.');
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
