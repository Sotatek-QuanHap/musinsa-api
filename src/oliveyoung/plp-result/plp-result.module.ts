import { Module } from '@nestjs/common';
import { KafkaConsumerService } from '../../kafka/kafka.consumer';
import { PLPResultHandler } from './plp-result.handler';
import { KafkaModule } from '../../kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { PLPResultService } from './plp-result.service'; // Import the service
import { MongooseModule } from '@nestjs/mongoose';
import { PLPResult, PLPResultSchema } from './schema/plp-result.schema';

@Module({
  controllers: [],
  providers: [PLPResultHandler, PLPResultService], // Add the service to providers
  imports: [
    KafkaModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: PLPResult.name, schema: PLPResultSchema },
    ]), // Import the schema
  ],
})
export class PLPResultModule {
  constructor(
    private kafkaConsumerService: KafkaConsumerService,
    plpResultHandler: PLPResultHandler,
  ) {
    void this.kafkaConsumerService.listen(plpResultHandler);
  }
}
