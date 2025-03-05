import { BaseParser } from './BaseParser';
import { OliveyoungParser } from './OliveyoungParser';

// TODO: get configs from API
const configs = {
  PDPParser: {
    productName: {
      type: 'input',
      selector: '#goodsNm',
    },
    productId: {
      type: 'input',
      selector: '#goodsNo',
    },
    category: {
      type: 'css_selector',
      selector: '#dtlCatNm',
    },
    brandName: {
      type: 'css_selector',
      selector: '#moveBrandShop',
    },
    sellerName: {
      type: 'css_selector',
      selector: '올리브영',
    },
    normalPrice: {
      type: 'meta',
      selector: 'eg:originalPrice',
    },
    salePrice: {
      type: 'meta',
      selector: 'eg:salePrice',
    },
    finalPrice: {
      type: 'input',
      selector: '#finalPrc',
    },
    reviewCount: {
      type: 'input',
      selector: '#premiumGdasCnt',
    },
    stock: {
      type: 'input',
      selector: '#avalInvQty',
    },
    saleInfo: {
      type: 'css_selector',
      selector: '#saleLayer .price_child .label',
    },
    extraInfo: {
      type: 'css_selector',
      selector: '#artcAjaxInfo > .detail_info_list',
    },
    options: {
      type: 'css_selector',
      selector: 'li.type1',
    },
    soldOut: {
      type: 'input',
      selector: '#soldOutYn',
    },
    image: {
      type: 'attr',
      selector: '#mainImg',
      attr: 'src',
    },
    extraImages: {
      type: 'css_selector',
      selector: '#prd_thumb_list li a',
    },
    sku: {
      type: 'input',
      selector: '#lgcGoodsNo',
    },
    hiddenFields: {
      goodsNo: {
        type: 'input',
        selector: '#goodsNo',
      },
      itemNo: {
        type: 'input',
        selector: '#itemNo',
      },
      lgcGoodsNo: {
        type: 'input',
        selector: '#lgcGoodsNo',
      },
      onlBrndNm: {
        type: 'input',
        selector: '#onlBrndNm',
      },
      goodsNm: {
        type: 'input',
        selector: '#goodsNm',
      },
      gdasTpCd: {
        type: 'input',
        selector: '#gdasTpCd',
      },
      onlBrndCd: {
        type: 'input',
        selector: '#onlBrndCd',
      },
      avalInvQty: {
        type: 'input',
        selector: '#avalInvQty',
      },
      qtyAddUnit: {
        type: 'input',
        selector: '#qtyAddUnit',
      },
      adulAuthYn: {
        type: 'input',
        selector: '#adulAuthYn',
      },
      artcGoodsNo: {
        type: 'input',
        selector: '#artcGoodsNo',
      },
      artcItemNo: {
        type: 'input',
        selector: '#artcItemNo',
      },
      epCpnYn: {
        type: 'input',
        selector: '#epCpnYn',
      },
      soldOutYn: {
        type: 'input',
        selector: '#soldOutYn',
      },
      quickAvalInvQty: {
        type: 'input',
        selector: '#quickAvalInvQty',
      },
      usrLat_default: {
        type: 'input',
        selector: '#usrLat_default',
      },
      usrLng_default: {
        type: 'input',
        selector: '#usrLng_default',
      },
      usrLat: {
        type: 'input',
        selector: '#usrLat',
      },
      usrLng: {
        type: 'input',
        selector: '#usrLng',
      },
      o2oBlockInfo: {
        type: 'input',
        selector: '#o2oBlockInfo',
      },
      ordPsbMinQty: {
        type: 'input',
        selector: '#ordPsbMinQty',
      },
      ordPsbMaxQty: {
        type: 'input',
        selector: '#ordPsbMaxQty',
      },
      stdCatNm: {
        type: 'input',
        selector: '#stdCatNm',
      },
      finalPrc: {
        type: 'input',
        selector: '#finalPrc',
      },
      dispCatNo: {
        type: 'input',
        selector: '#dispCatNo',
      },
      assocDispCatNo: {
        type: 'input',
        selector: '#assocDispCatNo',
      },
      dupItemYn: {
        type: 'input',
        selector: '#dupItemYn',
      },
      rsvSaleYn: {
        type: 'input',
        selector: '#rsvSaleYn',
      },
      rsvLmtSctCd: {
        type: 'input',
        selector: '#rsvLmtSctCd',
      },
      prsntYn: {
        type: 'input',
        selector: '#prsntYn',
      },
      quickPrsntYn: {
        type: 'input',
        selector: '#quickPrsntYn',
      },
      pkgGoodsYn: {
        type: 'input',
        selector: '#pkgGoodsYn',
      },
      premiumGdasCnt: {
        type: 'input',
        selector: '#premiumGdasCnt',
      },
      simpleGdasCnt: {
        type: 'input',
        selector: '#simpleGdasCnt',
      },
      realQnaCnt: {
        type: 'input',
        selector: '#realQnaCnt',
      },
      gdasPrhbCatCnt: {
        type: 'input',
        selector: '#gdasPrhbCatCnt',
      },
      gdasMedapCnt: {
        type: 'input',
        selector: '#gdasMedapCnt',
      },
      previewInfo: {
        type: 'input',
        selector: '#previewInfo',
      },
      chlNo: {
        type: 'input',
        selector: '#chlNo',
      },
      quickYn: {
        type: 'input',
        selector: '#quickYn',
      },
      quickOrdMaxQty: {
        type: 'input',
        selector: '#quickOrdMaxQty',
      },
      quickOrdMaxQtyTemp: {
        type: 'input',
        selector: '#quickOrdMaxQtyTemp',
      },
      quickOrdTimeFrom: {
        type: 'input',
        selector: '#quickOrdTimeFrom',
      },
      quickOrdTimeTo: {
        type: 'input',
        selector: '#quickOrdTimeTo',
      },
      orderStrNo: {
        type: 'input',
        selector: '#orderStrNo',
      },
      recoBellSmlCatNo: {
        type: 'input',
        selector: '#recoBellSmlCatNo',
      },
      recoBellDispCatNo: {
        type: 'input',
        selector: '#recoBellDispCatNo',
      },
      eigeneSmlDispName: {
        type: 'input',
        selector: '#eigeneSmlDispName',
      },
      qDeliveCheck: {
        type: 'input',
        selector: '#qDeliveCheck',
      },
      colrSoldoutCnt: {
        type: 'input',
        selector: '#colrSoldoutCnt',
      },
      quickInfoYn: {
        type: 'input',
        selector: '#quickInfoYn',
      },
      infnSelImpsYn: {
        type: 'input',
        selector: '#infnSelImpsYn',
      },
    },
    categoryInfo: {
      type: 'css_selector',
      selector: '.loc_history',
    },
  },
  CategoryParser: {
    parent: '.all_menu_wrap > li',
    field: {
      name: {
        type: 'css_selector',
        selector: '> h2',
      },
    },
    children: {
      parent: '.sub_menu_box p.sub_depth',
      templateUrl:
        'https://www.oliveyoung.co.kr/store/display/getCategoryShop.do?gateCd=Drawer&t_page=%EB%93%9C%EB%A1%9C%EC%9A%B0_%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC&t_click=%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC%ED%83%AD_%EB%8C%80%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC&t_1st_category_type=%EB%8C%80_%ED%97%A4%EC%96%B4%EC%BC%80%EC%96%B4',
      field: {
        name: {
          type: 'css_selector',
        },
        id: {
          type: 'css_selector',
          selector: 'a',
          attribute: 'data-ref-dispcatno',
        },
      },
      childrenContainerSelector: 'ul',
      children: {
        parent: 'li',
        templateUrl:
          'https://www.oliveyoung.co.kr/store/display/getMCategoryList.do?fltDispCatNo=&prdSort=01&searchTypeSort=btn_thumb&plusButtonFlag=N&isLoginCnt=1&aShowCnt=0&bShowCnt=0&cShowCnt=0&trackingCd=Cat100000100060001_Small&amplitudePageGubun=&t_page=&t_click=&checkBrnds=&lastChkBrnd=',
        field: {
          name: {
            type: 'css_selector',
          },
          id: {
            type: 'css_selector',
            selector: 'a',
            attribute: 'data-ref-dispcatno',
          },
        },
      },
    },
  },
  PLPParser: {
    productId: {
      type: 'attr',
      selector: 'li a',
      attr: 'data-ref-goodsno',
    },
    url: {
      type: 'attr',
      selector: 'li a',
      attr: 'href',
    },
  },
};

export function createParser(parserName: string): any {
  switch (parserName) {
    case 'oliveyoung':
      return new OliveyoungParser(configs);
    default:
      return new BaseParser(configs);
  }
}
