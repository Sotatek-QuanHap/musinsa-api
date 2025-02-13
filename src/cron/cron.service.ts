import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import KafkaProducerService from '../kafka/kafka.producer';
import { KafkaTopics } from '../oliveyoung/constant';

@Injectable()
export class CronService {
  constructor(private kafkaProducer: KafkaProducerService) {}

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async handleCron() {
  //   await this.kafkaProducer.send({
  //     topic: 'olive-young.plp-crawler.request',
  //     message: JSON.stringify({
  //       url: 'https://www.oliveyoung.co.kr/store/display/getMCategoryList.do?dispCatNo=100000100020006&fltDispCatNo=&prdSort=01&searchTypeSort=btn_thumb&plusButtonFlag=N&isLoginCnt=0&aShowCnt=0&bShowCnt=0&cShowCnt=0&trackingCd=Cat100000100020006_Small&amplitudePageGubun=&t_page=&t_click=&midCategory=%EB%A6%BD%EB%A9%94%EC%9D%B4%ED%81%AC%EC%97%85&smallCategory=%EC%A0%84%EC%B2%B4&checkBrnds=&lastChkBrnd=',
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
