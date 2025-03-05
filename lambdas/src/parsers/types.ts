export interface ParserRequest {
  payload: any; // can be html or json
  dataType: 'html' | 'json';
  type: ParserType;
}

export enum ParserType {
  CATEGORY = 'category',
  PLP = 'plp',
  PDP = 'pdp',
}
