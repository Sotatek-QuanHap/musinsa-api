import { ParserRequest, ParserType } from './types';

export class BaseParser {
  protected configuration: any;

  constructor(configuration: any) {
    this.configuration = configuration;
  }

  parse(data: ParserRequest) {
    switch (data.type) {
      case ParserType.CATEGORY:
        return this.parseCategory(data.payload);
      case ParserType.PLP:
        return this.parsePLP(data.payload);
      case ParserType.PDP:
        return this.parsePDP(data.payload);
      default:
        console.warn('Not found parser type, fallback to default parser');
        return this.fallbackParse(data.payload);
    }
  }

  parseCategory(data: any) {
    return this.fallbackParse(data);
  }

  parsePLP(data: any) {
    return this.fallbackParse(data);
  }

  parsePDP(data: any) {
    return this.fallbackParse(data);
  }

  fallbackParse(data: any) {
    return data;
  }
}
