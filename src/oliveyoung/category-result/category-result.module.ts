import { Module, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from 'src/kafka/kafka.consumer';
import { KafkaModule } from 'src/kafka/kafka.module';
import { CategoryResultHandler } from './category-result.handler';

@Module({
  controllers: [],
  providers: [KafkaConsumerService, CategoryResultHandler],
  imports: [KafkaModule],
})
export class CategoryResultModule implements OnModuleInit {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly categoryResultHandler: CategoryResultHandler,
  ) {}

  onModuleInit() {
    void this.kafkaConsumerService.listen(this.categoryResultHandler);
  }
}
