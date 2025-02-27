import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import KafkaProducerService from 'src/kafka/kafka.producer';
import { KafkaTopics } from './constants';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SqlSynchronizationService {
  constructor(
    private kafkaProducer: KafkaProducerService,
    private databaseService: DatabaseService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncCategories() {
    const categories = await this.databaseService.category
      .find({})
      .populate('parentCategory');
    await this.kafkaProducer.send({
      topic: KafkaTopics.CATEGORY_SYNC,
      message: JSON.stringify(categories),
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async syncProducts() {
    const batchSize = 1000;
    let batch: any[] = [];
    const unsyncedCursor = this.databaseService.product
      .find({ _fullSynced: false, categoryId: { $ne: null } })
      .cursor();

    for await (const product of unsyncedCursor) {
      batch.push(product);
      if (batch.length >= batchSize) {
        await this.kafkaProducer.send({
          topic: KafkaTopics.PRODUCT_SYNC,
          message: JSON.stringify(batch),
        });
        batch = [];
      }
    }

    // Send any remaining products
    if (batch.length) {
      await this.kafkaProducer.send({
        topic: KafkaTopics.PRODUCT_SYNC,
        message: JSON.stringify(batch),
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async syncProductHistories() {
    const batchSize = 1000;
    let batch: any[] = [];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);

    const unsyncedCursor = this.databaseService.productHistory
      .find({
        recordedAt: yesterday,
      })
      .cursor();

    for await (const product of unsyncedCursor) {
      batch.push(product);
      if (batch.length >= batchSize) {
        await this.kafkaProducer.send({
          topic: KafkaTopics.PRODUCT_HISTORY_SYNC,
          message: JSON.stringify(batch),
        });
        batch = [];
      }
    }

    // Send any remaining products
    if (batch.length) {
      await this.kafkaProducer.send({
        topic: KafkaTopics.PRODUCT_HISTORY_SYNC,
        message: JSON.stringify(batch),
      });
    }
  }
}
