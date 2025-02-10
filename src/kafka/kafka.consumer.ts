// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Message, Consumer, RequestTimeoutEvent } from 'kafkajs';
// import { KafkaUtil } from '../utils/kafka.utils';
// import { TimeUtils } from '../utils/time.utils';

// @Injectable()
// export default class KafkaConsumerService {
//   private consumer: Consumer;
//   private static self: KafkaConsumerService;
//   private connected: boolean;
//   consumer: any;
//   constructor(private configService: ConfigService) {
//     KafkaConsumerService.self = this;
//     this.connected = false;
//   }

//   public async start(): Promise<void> {
//     const kafka = KafkaUtil.loadClient(this.configService);
//     this.consumer = kafka.consumer({
//       retry: {
//         retries: 5,
//       },
//       groupId: this.configService.get<string>(
//         'app.kafka.groupId',
//         'musinsa-client',
//         {
//           infer: true,
//         },
//       ),
//     });
//     this.consumer.on('consumer.connect', () => {
//       this.connected = true;
//       console.log('====== consumer is connect ======');
//     });
//     this.consumer.on(
//       'consumer.network.request_timeout',
//       (e: RequestTimeoutEvent) => {
//         console.log('timeout', e);
//       },
//     );

//     try {
//       await this.consumer.connect();
//       console.log('this.connected', this.connected);
//       return;
//     } catch (error) {
//       this.connected = false;
//       console.log('[consumer-NO-CONNECT]', error);
//       await TimeUtils.sleep(5000);
//       await this.start();
//     }
//   }
// }
