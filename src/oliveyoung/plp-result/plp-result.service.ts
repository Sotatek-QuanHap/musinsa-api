import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PLPResult,
  PlpResultDocument,
} from '../../database/schema/plp-result.schema';
import { Model } from 'mongoose';

@Injectable()
export class PLPResultService {
  private readonly logger = new Logger(PLPResultService.name);

  constructor(
    @InjectModel(PLPResult.name)
    private plpResultModel: Model<PlpResultDocument>,
  ) {}

  async create(data) {
    try {
      return this.plpResultModel.create(data);
    } catch (error) {
      this.logger.error(`Error fetching ${error.message}`);
    }
  }
}
