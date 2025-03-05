import { BaseParser } from './BaseParser';
import { ParserRequest } from './types';
import {
  extractFieldValue,
  ParsingConfigurations,
  SelectorConfig,
} from './utils';
import * as cheerio from 'cheerio';

export class OliveyoungParser extends BaseParser {
  protected configuration: ParsingConfigurations;

  constructor(configuration: any) {
    super(configuration);
    this.configuration = configuration as ParsingConfigurations;
  }

  // ╭─────────────────────────────────────────────────────────╮
  // │                 Category Parsing Logics                 │
  // ╰─────────────────────────────────────────────────────────╯
  parseCategory(payload: any) {
    const configurations = this.configuration['CategoryParser'];
    try {
      const $ = cheerio.load(payload);
      const parsedCategory = this.parseLevel($, $.root(), configurations);
      return parsedCategory;
    } catch (error) {
      console.error(`Error parsing: ${error}`);
      throw error;
    }
  }

  extractFields($elem: cheerio.Cheerio<any>, config: any): string {
    const $target = config.selector ? $elem.find(config.selector) : $elem;
    switch (config.type) {
      case 'css_selector':
        if (config.attribute)
          return ($target.attr(config.attribute) || '').trim();
        return $target.text().trim();
      default:
        console.warn(`Unsupported config type: ${config.type}`);
        return '';
    }
  }

  parseLevel(
    $: cheerio.CheerioAPI,
    $context: cheerio.Cheerio<any>,
    config: any,
  ): any[] {
    const nodes: any[] = [];
    const elements = $context.find(config.parent).toArray();

    for (const elem of elements) {
      const $elem = $(elem);
      const node: any = {};
      for (const [fieldName, configSelector] of Object.entries(config.field)) {
        node[fieldName] = this.extractFields($elem, configSelector);
      }
      if (node.id) {
        node.url = config.templateUrl + `&dispCatNo=${node.id}`;
      }
      if (config.children) {
        const $childrenContainer = config.childrenContainerSelector
          ? $elem.next(config.childrenContainerSelector)
          : $elem;
        node.children = this.parseLevel($, $childrenContainer, config.children);
      }
      nodes.push(node);
    }

    return nodes;
  }

  // ╭─────────────────────────────────────────────────────────╮
  // │                   PLP Parsing Logics                    │
  // ╰─────────────────────────────────────────────────────────╯
  parsePLP(payload: any) {
    const configurations = this.configuration['PLPParser'];

    try {
      const $ = cheerio.load(payload);
      const productData: Array<{
        productId?: string;
        productUrl?: string;
      }> = [];

      // Loop through each configuration entry and extract its corresponding value.
      $('.cate_prd_list.gtm_cate_list li').each((index, element) => {
        const $ = cheerio.load(element);
        const extractedData: Record<string, any> = {};
        for (const [fieldName, config] of Object.entries(configurations)) {
          extractedData[fieldName] = extractFieldValue(
            $,
            config as unknown as SelectorConfig,
          );
        }
        productData.push(extractedData);
      });

      return productData;
    } catch (error) {
      console.error(`Error parsing: ${error}`);
      throw error;
    }
  }

  // ╭─────────────────────────────────────────────────────────╮
  // │                   PDP Parsing Logics                    │
  // ╰─────────────────────────────────────────────────────────╯
  parsePDP(payload: any) {
    console.log(Object.keys(payload));
    const configurations = this.configuration['PDPParser'];

    const parsedProduct = this.parseProduct(
      payload.productHtml,
      configurations,
    );
    const parsedExtraInfo = this.parseExtraInfo(
      payload.extraInfoHtml,
      configurations,
    );
    const parsedOptions = this.parseOptions(
      payload.optionsInfoHtml,
      configurations,
    );
    const parsedImages = this.parseImages(payload.productHtml, configurations);
    const hiddenFields = this.parseHiddenFields(
      payload.productHtml,
      configurations,
    );
    const parsedExtraCategory = this.parseCategoryInfo(
      payload.productHtml,
      configurations,
    );

    return {
      ...parsedProduct,
      extraImages: parsedImages,
      url: payload.url,
      extraInfo: parsedExtraInfo,
      options: parsedOptions,
      extraCategory: parsedExtraCategory,
      hiddenFields,
    };
  }

  parseCategoryInfo(extraInfoHtml: string, configurations: any) {
    const config = configurations['categoryInfo'];
    if (!config || !extraInfoHtml) return [];

    const $ = cheerio.load(extraInfoHtml);
    const extraCategory: {
      level: number;
      title: string;
      id?: string;
    }[] = [];

    $(config.selector).each((_, element) => {
      extraCategory.push({
        level: 1,
        title: $(element).find('.goods_category1.on').text().trim(),
        id: $(element)
          .find('#midCatNm + .history_cate_box li')
          .attr('data-ref-dispcatno'),
      });
      extraCategory.push({
        level: 2,
        title: $(element).find('.goods_category2.on').text().trim(),
        id: $(element)
          .find('#smlCatNm + .history_cate_box li')
          .attr('data-ref-dispcatno'),
      });
      extraCategory.push({
        level: 3,
        title: $(element).find('.goods_category3.on').text().trim(),
        id: $(element)
          .find('#dtlCatNm + .history_cate_box li')
          .attr('data-ref-dispcatno'),
      });
    });

    return extraCategory;
  }

  parseProduct(productHtml: string, configurations: any) {
    try {
      const $ = cheerio.load(productHtml);

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { hiddenFields, ...configs } = configurations;
      const product: Record<string, any> = {};

      // Loop through each configuration entry and extract its corresponding value.
      for (const [fieldName, config] of Object.entries(configs)) {
        product[fieldName] = extractFieldValue($, config as SelectorConfig);
      }

      // Data calculated from the extracted data.
      product.coupon = product.salePrice - product.finalPrice;

      return product;
    } catch (error) {
      console.error(`Error parsing: ${error}`);
      throw error;
    }
  }

  parseExtraInfo(extraInfoHtml: string, configurations: any) {
    const config = configurations['extraInfo'];
    if (!config || !extraInfoHtml) return [];

    const $ = cheerio.load(extraInfoHtml);
    const extraData: Record<string, string> = {};

    $(config.selector).each((_, element) => {
      const dt = $(element).find('dt').text().trim();
      const dd = $(element).find('dd').html()?.trim(); // Using .html() to keep line breaks
      if (dt && dd) {
        extraData[dt] = dd;
      }
    });

    return extraData;
  }

  parseImages(productHtml: string, configurations: any) {
    const config = configurations['extraImages'];
    if (!config) return;

    const $ = cheerio.load(productHtml);
    const images: string[] = [];

    $(config.selector).each((_, el) => {
      images.push($(el).data('img') as string);
    });

    return images;
  }

  parseOptions(optionsHtml: string, configurations: any) {
    const config = configurations['options'];
    if (!config || !optionsHtml) return [];

    const $ = cheerio.load(optionsHtml);
    const options: any[] = [];

    $(config.selector).each((_, el) => {
      const img = $(el).find('img').attr('src');
      // Find the .option_value element
      const optionValueEl = $(el).find('.option_value');

      const price = $(el).find('.option_price .tx_num').text().trim();

      // Remove the nested .option_price before extracting text
      optionValueEl.find('.option_price').remove();

      // Extract and clean the option name
      let option = optionValueEl
        .text()
        .replace(/\(품절\)/, '')
        .trim();
      option = option.replace(/[\t\n]/g, '');

      if (option) {
        options.push({ option, price, img });
      }
    });

    return options;
  }

  parseHiddenFields(productHtml: string, configurations: any) {
    const $ = cheerio.load(productHtml);
    const hiddenFieldsConfigs = configurations.hiddenFields;
    const extractedData: Record<string, any> = {};

    for (const [fieldName, config] of Object.entries(hiddenFieldsConfigs)) {
      extractedData[fieldName] = extractFieldValue($, config as SelectorConfig);
    }

    return extractedData;
  }
}
