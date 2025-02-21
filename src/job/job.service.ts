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
        const { categories } = createJobDto;
        const categoryDatas = await this.databaseService.category.find({
          _id: { $in: categories },
        });
        for (const category of categoryDatas) {
          await this.kafkaProducer.send({
            topic: ToppingMapping[createJobDto.platform],
            message: JSON.stringify({
              jobId: jobData.id,
              url: category.url,
              categoryId: category.id,
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

  async update(id: string, updateJobDto: UpdateJobDto) {
    console.log('updateJobDto', updateJobDto);
    return await this.databaseService.job.updateOne(
      { _id: id },
      {
        $set: updateJobDto,
      },
    );
  }

  updateSummary(id: string, summaryPayload: any) {
    return this.databaseService.job.updateOne({ _id: id }, summaryPayload);
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
