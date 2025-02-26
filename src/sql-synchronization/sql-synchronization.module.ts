import { Module, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from 'src/kafka/kafka.consumer';
import { KafkaModule } from 'src/kafka/kafka.module';
import { SqlModule } from 'src/sql/sql.module';
import { SqlProductSyncListener as SqlProductSyncHandler } from './sql-product-sync.handler';
import { MongoProductAckHandler } from './mongo-product-ack.handler';
import { SqlSynchronizationService } from './sql-synchronization.service';
import { SqlCategorySyncHandler } from './sql-category-sync.handler';
import { SqlProductHistorySyncHandler } from './sql-product-history-sync.handler';

@Module({
  imports: [SqlModule, KafkaModule],
  providers: [
    SqlSynchronizationService,
    SqlProductSyncHandler,
    MongoProductAckHandler,
    SqlCategorySyncHandler,
    SqlProductHistorySyncHandler,
  ],
})
export class SqlSynchronizationModule implements OnModuleInit {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly sqlProductSyncHandler: SqlProductSyncHandler,
    private readonly mongoProductAckHandler: MongoProductAckHandler,
    private readonly sqlCategorySyncHandler: SqlCategorySyncHandler,
    private readonly sqlProductHistoryHandler: SqlProductHistorySyncHandler,
  ) {}

  onModuleInit() {
    void this.kafkaConsumerService.listen(this.sqlProductSyncHandler);
    void this.kafkaConsumerService.listen(this.mongoProductAckHandler);
    void this.kafkaConsumerService.listen(this.sqlCategorySyncHandler);
    void this.kafkaConsumerService.listen(this.sqlProductHistoryHandler);
  }
}
