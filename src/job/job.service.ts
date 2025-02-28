import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DatabaseService } from '../database/database.service';
import KafkaProducerService from '../kafka/kafka.producer';
import { ToppingMapping } from './constants';
import { QueryJobDto } from './dto/query-job.dto';
import { OrderMap } from '../utils/dto/base-query.dto';
import { buildMetaData } from '../utils/infinity-pagination';
import { JobType } from '../config/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from '../database/schema/job.schema';
import { Model } from 'mongoose';
import { ConvertUtil } from '../utils/convert.util';
import { CategorySchemaDocument } from '../database/schema/category.schema';

@Injectable()
export class JobService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly kafkaProducer: KafkaProducerService,
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
  ) {}
  async create(createJobDto: CreateJobDto) {
    const createJob = new this.jobModel(createJobDto);

    const jobData = await createJob.save();

    switch (createJobDto.type) {
      case JobType.GET_PRODUCT: {
        const { categories } = createJobDto;
        const categoryDatas = await this.databaseService.category.find(
          {
            id: { $in: categories },
          },
          { id: 1 },
        );
        const categoriesId = categoryDatas.map((item) => item._id);
        const categoriesLeaf = await this.databaseService.category.find({
          $or: [
            { parentCategories: { $in: categoriesId } },
            { _id: { $in: categoriesId }, isLeaf: true },
          ],
        });
        for (const category of categoriesLeaf) {
          await this.kafkaProducer.send({
            topic: ToppingMapping[createJobDto.platform].getProduct,
            message: JSON.stringify({
              jobId: jobData.id,
              url: category.url,
              categoryId: category.id,
            }),
            key: Date.now().toString(),
          });
        }
        break;
      }
      case JobType.GET_CATEGORY: {
        const { platform } = createJobDto;
        const platformData = await this.databaseService.platform
          .findOne({
            key: platform,
          })
          .lean();

        if (!platformData?.categoryUrl) break;

        await this.kafkaProducer.send({
          topic: ToppingMapping[createJobDto.platform].getCategory,
          message: JSON.stringify({
            jobId: jobData.id,
            url: platformData.categoryUrl,
          }),
          key: Date.now().toString(),
        });
        break;
      }
      default:
        break;
    }
    return jobData.toJSON();
  }

  async findAll(query: QueryJobDto) {
    const { page, limit, sortBy, orderBy, ...queryParam } = query;
    const sort =
      sortBy && orderBy
        ? { [sortBy]: OrderMap[orderBy] }
        : { endDate: -1, createdAt: -1 };
    const jobs: any[] = await this.databaseService.job
      .find(
        queryParam,
        {
          platform: 1,
          type: 1,
          status: 1,
          createdAt: 1,
          endDate: 1,
        },
        { limit, skip: (page - 1) * limit, sort },
      )
      .lean();
    const meta = await buildMetaData({
      size: limit,
      page,
      query: queryParam,
      databaseService: this.databaseService,
      entity: 'job',
    });
    return { items: jobs, meta };
  }

  async findOne(id: string) {
    const job = await this.jobModel.findOne({ _id: id }).lean().exec();
    if (!job) {
      throw new BadRequestException('NOT_FOUND');
    }
    if (job.categories?.length) {
      const categories: CategorySchemaDocument[] =
        await this.databaseService.category
          .find(
            { platform: job.platform, id: { $in: job.categories } },
            { id: 1, name: 1, level: 1, parentCategory: 1 },
          )
          .populate({
            path: 'parentCategories',
            select: { id: 1, name: 1, level: 1, parentCategory: 1 },
          })
          .lean();
      const categoryMap: Map<string, any> = new Map();
      for (const cat of categories) {
        const _id = cat._id.toString();
        for (const parentCat of cat.parentCategories || []) {
          const _parentCatId = parentCat._id.toString();
          if (!categoryMap.has(_parentCatId)) {
            categoryMap.set(_parentCatId, { ...parentCat, subcategories: [] });
          }
        }
        delete cat.parentCategories;
        if (!categoryMap.has(_id)) {
          categoryMap.set(_id, { ...cat, subcategories: [] });
        }
      }
      job.categories = ConvertUtil.buildCategoryTree(categoryMap);
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
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

  getPlatform() {
    return this.databaseService.platform.find().lean();
  }

  getJobType() {
    return this.databaseService.jobType.find().lean();
  }
}
