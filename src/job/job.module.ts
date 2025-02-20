import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import KafkaProducerService from '../kafka/kafka.producer';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [],
  controllers: [JobController],
  providers: [JobService, KafkaProducerService, KafkaModule],
  exports: [JobService, KafkaProducerService],
})
export class JobModule {}
