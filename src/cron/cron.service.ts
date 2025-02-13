import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import KafkaProducerService from '../kafka/kafka.producer';
import { KafkaTopics } from '../oliveyoung/constant';

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

  @Cron(CronExpression.EVERY_HOUR)
  async handleCronCategoryCrawlerRequest() {
    await this.kafkaProducer.send({
      topic: KafkaTopics.categoryCrawlerRequest,
      message: JSON.stringify({
        url: 'https://www.oliveyoung.co.kr/store/main/main.do?oy=0',
      }),
      key: Date.now().toString(),
    });
  }
}
