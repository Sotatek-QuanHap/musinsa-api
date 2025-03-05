import { BaseCrawler } from './BaseCrawler';
import { OliveyoungCrawler } from './OliveyoungCrawler';

export function createCrawler(crawlerName: string): any {
  switch (crawlerName) {
    case 'oliveyoung':
      return new OliveyoungCrawler();
    default:
      return new BaseCrawler();
  }
}
