import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  controllers: [],
  providers: [CronService],
  imports: [KafkaModule],
})
export class CronModule {}
