import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DatabaseService } from '../database/database.service';
import { JobType } from '../database/schema/job.schema';
import KafkaProducerService from '../kafka/kafka.producer';
import { ToppingMapping } from './constants';

@Injectable()
export class JobService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}
  async create(createJobDto: CreateJobDto) {
    const jobData = await this.databaseService.job.create(createJobDto);
    switch (createJobDto.type) {
      case JobType.GET_PRODUCT:
        for (const category of createJobDto.categories) {
          await this.kafkaProducer.send({
            topic: ToppingMapping[createJobDto.platform]['topic'],
            message: JSON.stringify({
              [ToppingMapping[createJobDto.platform]['messageKey']]: category,
            }),
            key: Date.now().toString(),
          });
        }
        break;
      default:
        break;
    }
    return jobData.toJSON();
  }

  findAll() {
    return `This action returns all job`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
