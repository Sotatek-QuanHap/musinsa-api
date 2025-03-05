import { createCrawler } from './crawlers/CrawlerFactory';
import { createParser } from './parsers/ParserFactory';

export const crawl = async function (data: any) {
  const crawler = createCrawler(data.platform);
  const response = await crawler.crawl(data.payload);
  return response;
};

export const parse = async function (data: any) {
  const parser = createParser(data.platform);
  const response = await parser.parse(data.payload);
  return response;
};
