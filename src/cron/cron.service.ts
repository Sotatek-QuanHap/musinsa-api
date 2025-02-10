import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import KafkaProducerService from '../kafka/kafka.producer';

@Injectable()
export class CronService {
  constructor(private kafkaProducer: KafkaProducerService) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async handleCron() {
  //   await this.kafkaProducer.send({
  //     topic: 'test-topic',
  //     message: JSON.stringify({
  //       msg: 'Hello Word',
  //     }),
  //     key: Date.now().toString(),
  //   });
  // }
}
