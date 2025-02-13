import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KafkaProducerService from './kafka.producer';
// import { KafkaConsumer } from './kafka.consumer';
import KafkaProducer from './kafka.producer';
import { KafkaConsumerService } from './kafka.consumer';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [ConfigService, KafkaProducer, KafkaConsumerService],
  exports: [KafkaProducer, KafkaConsumerService],
})
export class KafkaModule {
  constructor(private kafkaProducer: KafkaProducerService) {
    void this.kafkaProducer.start();
  }
}
