const sources = [
  {
    url: 'https://www.tripadvisor.com.vn/Restaurants-g293924-Hanoi.html',
    // url: 'https://www.tripadvisor.com.vn/Tourism-g293925-Ho_Chi_Minh_City-Vacations.html',
    // url: 'https://www.tripadvisor.com.vn/Restaurants-g311304-Sapa_Lao_Cai_Province.html',
    userData: {
      category_lv1_name: 'Nhà hàng',
      page: 'LIST',
    },
  },
];
// eslint-disable-next-line no-unused-vars,no-restricted-syntax
// for (const i of [2]) {
//   const items = 30 * (i - 1);
//   const itemPages = `oa${items}`;
//   const url = `https://www.tripadvisor.com.vn/Restaurants-g293925-${itemPages}-Ho_Chi_Minh_City.html`;
//   sources.push({
//     url,
//     userData: {
//       category_lv1_name: 'Nhà hàng',
//       page: 'LIST',
//     },
//   });
// }

module.exports = sources;
