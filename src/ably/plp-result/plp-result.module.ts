import { Module } from '@nestjs/common';
import { KafkaConsumerService } from '../../kafka/kafka.consumer';
import { PLPResultHandler } from './plp-result.handler';
import { KafkaModule } from '../../kafka/kafka.module';

@Module({
  controllers: [],
  providers: [PLPResultHandler, KafkaConsumerService], // Add the service to providers
  imports: [KafkaModule],
})
export class PLPResultModule {
  constructor(
    private kafkaConsumerService: KafkaConsumerService,
    private plpResultHandler: PLPResultHandler,
  ) {}
  onModuleInit() {
    void this.kafkaConsumerService.listen(this.plpResultHandler);
  }
}
