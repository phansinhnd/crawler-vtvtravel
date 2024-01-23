let sources = [];
const arrUrl = ['https://www.tripadvisor.com.vn/Restaurants-g293924-Hanoi.html',
'https://www.tripadvisor.com/Restaurants-g293925-Ho_Chi_Minh_City.html'];

for(let url of arrUrl){
 sources.push({
    url,
    userData: {
      category_lv1_name: 'Nhà hàng',
      page: 'LIST',
    },
  })

}
module.exports = sources;
