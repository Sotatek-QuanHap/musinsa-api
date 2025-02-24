/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { KafkaTopics } from './constants';
import { BaseKafkaHandler } from 'src/utils/base.handler';
import { ConfigService } from '@nestjs/config';
import { SandyLogger } from 'src/utils/sandy.logger';
import { DataSource, Repository } from 'typeorm';
import { ProductHistory } from 'src/sql/entities/product_history.entity';

@Injectable()
export class SqlProductHistorySyncHandler extends BaseKafkaHandler {
  private productHistoryRepository: Repository<ProductHistory>;

  constructor(
    configService: ConfigService,
    databaseService: DatabaseService,
    private dataSource: DataSource,
  ) {
    super(configService, databaseService, 'ProductHistorySyncHandler');
    this.params = arguments;
    this.productHistoryRepository =
      this.dataSource.getRepository(ProductHistory);
  }

  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    try {
      const productHistoriesBatch = data;
      await this.productHistoryRepository
        .createQueryBuilder()
        .insert()
        .values(productHistoriesBatch)
        .orIgnore()
        .execute();
    } catch (error) {
      logger.error(
        'Error inserting product histories batch into PostgreSQL:',
        error,
      );
    }
  }

  getTopicNames(): string {
    return KafkaTopics.PRODUCT_HISTORY_SYNC;
  }

  getCount(): number {
    return 1;
  }
}
