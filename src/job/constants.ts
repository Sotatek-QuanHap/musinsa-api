import { KafkaTopics as AblyTopics } from '../ably/constants';
import { Platform } from '../database/schema/job.schema';
import { KafkaTopics as OliveYoungTopics } from '../oliveyoung/constants';

export const JobConfigs = {
  groupId: 'job-config-group',
  name: 'job-name',
};

export const ToppingMapping = {
  [Platform.OLIVE_YOUNG]: {
    getProduct: OliveYoungTopics.plpCrawlerRequest,
    getCategory: OliveYoungTopics.categoryCrawlerRequest,
  },
  [Platform.ABLY]: {
    getProduct: AblyTopics.plpCrawlerRequest,
    getCategory: AblyTopics.categoryCrawlerRequest,
  },
};
