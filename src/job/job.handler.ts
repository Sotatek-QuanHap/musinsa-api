/* eslint-disable prefer-rest-params */
import { ConfigService } from '@nestjs/config';
import { BaseKafkaHandler } from '../utils/base.handler';
import { JobConfigs } from './constants';
import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { KafkaUtil } from '../utils/kafka.utils';
import { JobService } from './job.service';
import { plainToInstance } from 'class-transformer';
import { UpdateJobDto } from './dto/update-job.dto';
import { KafkaTopics } from '../config/constants';

@Injectable()
export class JobHandler extends BaseKafkaHandler {
  constructor(
    configService: ConfigService,
    databaseService: DatabaseService,
    private readonly jobService: JobService,
  ) {
    super(configService, databaseService, JobConfigs.name);
    this.params = arguments;
  }

  async process(): Promise<any> {
    const kafka = KafkaUtil.loadClient(this.configService);
    const comsumer = kafka.consumer({
      groupId: JobConfigs.groupId,
    });
    await comsumer.subscribe({ topic: KafkaTopics.updateJobSummary });
    await comsumer.subscribe({ topic: KafkaTopics.updateJob });

    await comsumer.run({
      eachMessage: async ({ topic, message }): Promise<void> => {
        console.log('JobHandler process topic: ', topic);
        const data = JSON.parse(
          message?.value ? message.value.toString() : '{}',
        );
        const { jobId, payload } = data;
        switch (topic) {
          case KafkaTopics.updateJobSummary: {
            const dataUpdate = plainToInstance(UpdateJobDto, payload, {
              enableImplicitConversion: true,
            });
            await this.jobService.updateSummary(jobId, dataUpdate);
            break;
          }
          case KafkaTopics.updateJob: {
            const dataUpdate = plainToInstance(UpdateJobDto, payload, {
              enableImplicitConversion: true,
            });
            await this.jobService.update(jobId, dataUpdate);
            break;
          }
          default:
            console.warn(`No handler found for topic: ${topic}`);
        }
        return Promise.resolve();
      },
    });
  }

  async setup(): Promise<void> {}

  public validator(): Promise<void> {
    return Promise.resolve();
  }

  getCount(): number {
    return 1;
  }
  getGroupId(): string {
    return JobConfigs.groupId;
  }
  getTopicNames(): string {
    return 'job';
  }
}
