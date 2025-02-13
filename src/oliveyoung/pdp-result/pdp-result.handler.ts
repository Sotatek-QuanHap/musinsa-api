/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from '../../utils/base.handler';
import { SandyLogger } from '../../utils/sandy.logger';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { CategoryResultConfigs, KafkaTopics } from '../constant';

@Injectable()
export class PDPResultHandler extends BaseKafkaHandler {
  constructor(configService: ConfigService, databaseService: DatabaseService) {
    super(configService, databaseService, CategoryResultConfigs.name);
    this.params = arguments;
  }
  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    await this.saveParsedProduct(data);
    logger.log('Successfully processed parser request.');
  }

  async saveParsedProduct(parsedData: any) {
    await this.databaseService.product.create(parsedData);
  }

  getTopicNames(): string {
    return KafkaTopics.pdpResult;
  }

  getCount(): number {
    return this.configService.get('app.oliveYoung.numberOfPdpResult', 0, {
      infer: true,
    });
  }
}
