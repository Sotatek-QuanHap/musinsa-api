import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySqlService } from './category-sql.service';
import { SqlSynchronizationService } from '../sql-synchronization/sql-synchronization.service';
import { SqlModule } from '../sql/sql.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [SqlModule, KafkaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategorySqlService, SqlSynchronizationService],
})
export class CategoryModule {}
