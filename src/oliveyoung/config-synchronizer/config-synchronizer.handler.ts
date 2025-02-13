/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { BaseKafkaHandler } from 'src/utils/base.handler';
import { ConfigService } from '@nestjs/config';
import { SandyLogger } from 'src/utils/sandy.logger';
import KafkaProducerService from 'src/kafka/kafka.producer';
import {
  ConfigSynchronizerConfigs,
  ConfigSynchronizerUpdatePayload,
  KafkaTopics,
} from './constants';
import { DatabaseService } from 'src/database/database.service';
import { ParserConfigSchemaDocument } from 'src/database/schema/parser-config.schema';

@Injectable()
export class ConfigSynchronizerHandler extends BaseKafkaHandler {
  constructor(
    configService: ConfigService,
    databaseService: DatabaseService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {
    super(configService, databaseService, ConfigSynchronizerConfigs.name);
    this.params = arguments;
  }

  public validator(): Promise<void> {
    return Promise.resolve();
  }

  getParserConfigs(): Promise<ParserConfigSchemaDocument[]> {
    return this.databaseService.parserConfig.find();
  }

  public async process(
    data: ConfigSynchronizerUpdatePayload,
    logger: SandyLogger,
  ): Promise<void> {
    logger.log('ConfigSynchronizer: Receive a request.');
    const parserConfigs = await this.getParserConfigs();

    const allConfigs = parserConfigs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {});

    await this.kafkaProducer.send({
      topic: KafkaTopics.configUpdate,
      message: JSON.stringify({
        type: 'update_config',
        value: allConfigs,
      }),
    });
  }

  getTopicNames(): string {
    return KafkaTopics.configRequest;
  }

  getGroupId(): string {
    return ConfigSynchronizerConfigs.groupId;
  }

  getCount(): number {
    return 1;
  }
}
