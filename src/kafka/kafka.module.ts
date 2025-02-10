import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { KafkaConsumer } from './kafka.consumer';
import KafkaProducer from './kafka.producer';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, KafkaProducer],
  exports: [KafkaProducer],
})
export class KafkaModule {
  constructor(private kafkaProducer: KafkaProducer) {
    void this.kafkaProducer.start();
  }
}
