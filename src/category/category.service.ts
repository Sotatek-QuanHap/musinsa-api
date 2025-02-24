import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import KafkaProducerService from '../kafka/kafka.producer';
import { KafkaTopics } from '../config/constants';

@Injectable()
export class CategoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async saveCategories({
    categories,
    parentCategory = null,
    level = 1,
    platform,
    jobId,
  }: {
    categories: any[];
    parentCategory?: string | null;
    level?: number;
    platform: string;
    jobId: string;
  }) {
    for (const category of categories) {
      const id = category.id ?? category.name;
      await this.updateJobSummary(jobId, {
        $inc: {
          'summary.processing': 1,
          'summary.pending': -1,
        },
      });
      const savedCategory =
        await this.databaseService.category.findOneAndUpdate(
          { id, platform },
          {
            name: category.name,
            id: category.id,
            url: category.url,
            platform,
            level,
            parentCategory,
          },
          { new: true, upsert: true },
        );

      await this.updateJobSummary(jobId, {
        $inc: {
          'summary.completed': 1,
          'summary.processing': -1,
        },
      });
      if (category.children && category.children.length > 0) {
        await this.saveCategories({
          categories: category.children,
          parentCategory: savedCategory._id,
          level: level + 1,
          platform,
          jobId,
        });
      }
    }
  }

  async updateJobSummary(jobId: string, payload: any) {
    await this.kafkaProducer.send({
      topic: KafkaTopics.updateJobSummary,
      message: JSON.stringify({
        jobId,
        payload,
      }),
    });
  }
}
