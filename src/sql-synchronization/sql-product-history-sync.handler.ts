/* eslint-disable prefer-rest-params */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { KafkaTopics } from './constants';
import { BaseKafkaHandler } from 'src/utils/base.handler';
import { ConfigService } from '@nestjs/config';
import { SandyLogger } from 'src/utils/sandy.logger';
import { DataSource, getMetadataArgsStorage, Repository } from 'typeorm';
import { ProductHistory } from 'src/sql/entities/product_history.entity';
import { Product } from 'src/sql/entities/product.entity';

@Injectable()
export class SqlProductHistorySyncHandler extends BaseKafkaHandler {
  private productRepository: Repository<Product>;
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
    this.productRepository = this.dataSource.getRepository(Product);
  }

  public validator(): Promise<void> {
    return Promise.resolve();
  }

  async process(data: any, logger: SandyLogger): Promise<any> {
    try {
      const productHistories = data;
      const toSaveProductHistories = productHistories.map((history) => ({
        ...history,
        saleRate: Math.floor(
          (1 - history.finalPrice / history.normalPrice) * 100,
        ),
      }));

      await this.productHistoryRepository
        .createQueryBuilder()
        .insert()
        .values(toSaveProductHistories)
        .orIgnore()
        .execute();

      await this.updateLatestProduct(toSaveProductHistories);
    } catch (error) {
      logger.error(
        'Error inserting product histories batch into PostgreSQL:',
        error,
      );
    }
  }

  async updateLatestProduct(histories) {
    const updateFields = new Set<string>();
    histories.forEach((p) => {
      Object.keys(p).forEach((field) => {
        if (field !== 'productId' && field !== 'platform') {
          updateFields.add(field);
        }
      });
    });
    // Filter updateFields to include only valid columns
    const productCols = getMetadataArgsStorage()
      .columns.filter((column) => column.target === Product)
      .map((column) => column.propertyName);

    const filteredUpdateFields = [...updateFields].filter((field) =>
      productCols.includes(field),
    );

    await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(histories)
      .orUpdate([...filteredUpdateFields], ['productId', 'platform'])
      .execute();
  }

  getTopicNames(): string {
    return KafkaTopics.PRODUCT_HISTORY_SYNC;
  }

  getCount(): number {
    return 1;
  }
}
