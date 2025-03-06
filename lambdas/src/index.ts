import { createCrawler } from './crawlers/CrawlerFactory';
import { createParser } from './parsers/ParserFactory';

export const crawl = async function (event: any) {
  const promises = event.Records.map((record: any) => {
    const data = JSON.parse(record.body);

    const crawler = createCrawler(data.platform);
    return crawler.crawl(data.payload);
  });

  const response = await Promise.all(promises);
  return response;
};

export const parse = async function (event: any) {
  const promises = event.Records.map((record: any) => {
    const data = JSON.parse(record.body);

    const parser = createParser(data.platform);
    return parser.parse(data.payload);
  });

  const response = await Promise.all(promises);
  return response;
};
