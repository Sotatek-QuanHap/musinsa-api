import { Module, OnModuleInit } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import KafkaProducerService from '../kafka/kafka.producer';
import { KafkaModule } from '../kafka/kafka.module';
import { JobHandler } from './job.handler';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../database/schema/job.schema';

@Module({
  imports: [
    KafkaModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
  ],
  controllers: [JobController],
  providers: [JobService, JobHandler, KafkaProducerService, KafkaModule],
  exports: [JobService, KafkaProducerService],
})
export class JobModule implements OnModuleInit {
  constructor(private readonly jobHandler: JobHandler) {}

  onModuleInit() {
    void this.jobHandler.process();
  }
}
