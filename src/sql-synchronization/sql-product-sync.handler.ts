/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { KafkaTopics } from './constants';
import { BaseKafkaHandler } from 'src/utils/base.handler';
import { ConfigService } from '@nestjs/config';
import { SandyLogger } from 'src/utils/sandy.logger';
import { Product } from 'src/sql/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import KafkaProducerService from 'src/kafka/kafka.producer';

@Injectable()
export class SqlProductSyncListener extends BaseKafkaHandler {
  private productRepository: Repository<Product>;

  constructor(
    configService: ConfigService,
    databaseService: DatabaseService,
    private dataSource: DataSource,
    private kafkaProducer: KafkaProducerService,
  ) {
    super(configService, databaseService, 'ProductSyncListener');
    this.params = arguments;
    this.productRepository = this.dataSource.getRepository(Product);
  }

  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    try {
      const productsBatch = data;
      await this.productRepository
        .createQueryBuilder()
        .insert()
        .values(productsBatch)
        .orIgnore()
        .execute();

      const productIds = productsBatch.map(
        (p: Product & { _id: string }) => p._id,
      );
      await this.kafkaProducer.send({
        topic: KafkaTopics.PRODUCT_SYNC_ACK,
        message: JSON.stringify(productIds),
      });
    } catch (error) {
      logger.error('Error inserting batch into PostgreSQL:', error);
    }
  }

  getTopicNames(): string {
    return KafkaTopics.PRODUCT_SYNC;
  }

  getCount(): number {
    return 1;
  }
}
