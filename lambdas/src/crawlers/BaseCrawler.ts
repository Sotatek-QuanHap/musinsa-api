import { CrawlerRequest, CrawlerType } from './types';
import { getHtmlByAxios } from './utils';

export class BaseCrawler {
  crawl(data: any) {
    console.log(data)
    switch (data.type) {
      case CrawlerType.CATEGORY:
        return this.crawlCategory(data.payload);
      case CrawlerType.PLP:
        return this.crawlPLP(data.payload);
      case CrawlerType.PDP:
        return this.crawlPDP(data.payload);
      default:
        console.warn('Not found crawler type, fallback to crawl by axios');
        return this.fallbackCrawl(data.payload);
    }
  }

  crawlCategory(data: any) {
    return this.fallbackCrawl(data);
  }

  crawlPLP(data: any) {
    return this.fallbackCrawl(data);
  }

  crawlPDP(data: any) {
    return this.fallbackCrawl(data);
  }

  fallbackCrawl(payload: any) {
    return getHtmlByAxios(payload.url);
  }
}
