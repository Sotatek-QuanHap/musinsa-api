import { Module, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from 'src/kafka/kafka.consumer';
import { KafkaModule } from 'src/kafka/kafka.module';
import { PDPResultHandler } from './pdp-result.handler';

@Module({
  controllers: [],
  providers: [KafkaConsumerService, PDPResultHandler],
  imports: [KafkaModule],
})
export class PDPResultModule implements OnModuleInit {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly pdpResultHandler: PDPResultHandler,
  ) {}

  onModuleInit() {
    void this.kafkaConsumerService.listen(this.pdpResultHandler);
  }
}
