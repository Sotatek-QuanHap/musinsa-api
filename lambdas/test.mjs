import { crawl, parse } from './dist/index.js';

async function test(type, url) {
  const payload = {
    platform: 'oliveyoung',
    payload: {
      type,
      payload: {
        url,
      },
    },
  };
  const data = await crawl(payload);
  const parsedData = await parse({
    platform: 'oliveyoung',
    payload: {
      type,
      payload: data,
    },
  });
  console.log(parsedData);
}

const testPLP = () =>
  test(
    'plp',
    'https://www.oliveyoung.co.kr/store/display/getMCategoryList.do?dispCatNo=100000100010017&isLoginCnt=0&aShowCnt=0&bShowCnt=0&cShowCnt=0&gateCd=Drawer&trackingCd=&rowsPerPage=10000&t_page=%EB%93%9C%EB%A1%9C%EC%9A%B0_%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC&t_click=%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC%ED%83%AD_%EC%A4%91%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC&t_2nd_category_type=%EC%A4%91_%EC%8A%A4%ED%82%A8%EC%BC%80%EC%96%B4%EC%84%B8%ED%8A%B8',
  );

const testCategory = () =>
  test('category', 'https://www.oliveyoung.co.kr/store/main/main.do?oy=0');

const testPDP = () =>
  test(
    'pdp',
    'https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000207349&dispCatNo=90000010001&trackingCd=Home_Curation1_1&curation=like&egcode=a016_a016&rccode=pc_main_01_c&egrankcode=8&t_page=%ED%99%88&t_click=%ED%81%90%EB%A0%88%EC%9D%B4%EC%85%981_%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_number=1',
  );

async function main() {
  await Promise.all([testPLP(), testCategory(), testPDP()]);
}

await main();
