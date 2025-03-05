import axios from 'axios';
import { BaseCrawler } from './BaseCrawler';
import { getHtmlByAxios } from './utils';

export class OliveyoungCrawler extends BaseCrawler {
  // category and plp are same

  crawlPDP(data: any) {
    return this.fetchInfos(data.url);
  }

  async fetchInfos(url: string) {
    const [productHtml, extraInfoHtml, optionsInfoHtml] = await Promise.all([
      this.fetchProduct(url),
      this.fetchProductExtraInfo(url),
      this.fetchProductOptions(url),
    ]);

    return {
      url,
      productHtml,
      extraInfoHtml,
      optionsInfoHtml,
    };
  }

  async fetchProduct(url: string) {
    return getHtmlByAxios(url);
  }

  async fetchProductExtraInfo(_url: string) {
    try {
      const url = new URL(_url);
      const productId = url.searchParams.get('goodsNo');
      const extraInfoURL = `${url.origin}/store/goods/getGoodsArtcAjax.do?goodsNo=${productId}`;
      const { data: html } = await axios.post(extraInfoURL);
      return html;
    } catch (error) {
      console.error(`Error fetching extra infor ${_url}: ${error}`);
    }
  }

  async fetchProductOptions(_url: string) {
    try {
      const url = new URL(_url);
      const productId = url.searchParams.get('goodsNo');
      const optionsInfoURL = `${url.origin}/store/goods/getOptInfoListAjax.do?goodsNo=${productId}`;
      const { data: html } = await axios.post(optionsInfoURL);
      return html;
    } catch (error) {
      console.error(`Error fetching extra infor ${_url}: ${error}`);
    }
  }
}
