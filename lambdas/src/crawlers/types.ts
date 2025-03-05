export enum CrawlerType {
  CATEGORY = 'category',
  PLP = 'plp',
  PDP = 'pdp',
}

export interface CrawlerRequest {
  payload: {
    url: string;
    [key: string]: any;
  };
  type: CrawlerType;
}
