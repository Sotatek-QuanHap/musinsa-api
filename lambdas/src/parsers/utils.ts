import { CheerioAPI } from 'cheerio';

export type ParsingConfigurations = Record<string, SelectorConfig>;

export type SelectorConfig = {
  type: 'css_selector' | 'xpath' | 'meta' | 'input' | 'attr';
  selector: string;
  attr?: string;
};

export function extractFieldValue(
  $: CheerioAPI,
  config: SelectorConfig,
): string {
  switch (config.type) {
    case 'css_selector':
      return $(config.selector).text().trim();
    case 'meta':
      return (
        $(`meta[property="${config.selector}"]`).attr('content') || ''
      ).trim();
    case 'input':
      return ($(config.selector).val() || '').toString().trim();
    case 'attr':
      return $(config.selector).attr(config.attr || '') || '';
    default:
      console.warn(`Unsupported config type: ${config.type}`);
      return '';
  }
}
