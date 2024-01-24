const Apify = require('apify');
const {
  utils: { sleep },
} = Apify;

const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');
const { getDataFromMongoDB, getRegionId } = require('../functions/handleRegions');
// const getOpenHours = require('/bots/common/getOpenHours');
const getOpenHours = require('../common/getOpenHours');
const getDescription = require('../common/getDescription');
const getFacilities = require('../common/getFacilities');
const { v4: uuidv4 } = require('uuid');
module.exports = async ({ $, request, page }) => {
  const restaurantDataset = await Apify.openDataset(NAME);
  let region;

  const title = await page.title();
  logger.info(`DETAIL_PAGE: ${request.url}: ${title}`);

  await sleep(3000);

  // mo popup gio mo cua
  const showOpenTime = await page.evaluate(() => $('.mMkhr').length);
  if (showOpenTime) {
    logger.info('CLICK_SHOW_OPEN_TIME');

    await page.click('.mMkhr');
  }

  const hours = await getOpenHours($, page);

  // mo popup mo ta chi tiet
  const description = await page.$x("//a[contains(text(), 'Xem tất cả chi tiết')]");
  if (description.length > 0) {
    logger.info('CLICK_DESCRIPTION');
    await description[0].click();
  }

  const shortDescription = await page.evaluate(() => $('.jmnaM').text());

  const facilities_name = await page.evaluate(() => $(".tbUiL.b:contains('ĐẶC TRƯNG')").next('div').text().split(', '));
  const facilities = await getFacilities(facilities_name);
  // console.log(facilities);
  const descriptionNew = await getDescription($, page);

  // dong popup mo ta chi tiet
  logger.info('CLICK_CLOSE_DESCRIPTION');
  await page.click('.zPIck._Q.Z1.t._U.c._S.zXWgK');

  await sleep(1000);

  // mo popup album anh
  const albums = await page.$x("//span[@class='see_all_count']//span[contains(text(),'Xem tất cả')]");
  if (albums.length > 1) {
    logger.info('CLICK_SHOW_ALBUM');
    await albums[1].click();
  } else {
    logger.info('CLICK_SHOW_ALBUM');
    await albums[0].click();
  }

  await sleep(3000);

  const counter = await page.evaluate(() => $('.photoGridBox .photoGridImg').length);
  logger.info('SCROLL_TO_LOAD_ALBUM');
  while (counter < 25) {
    logger.info('SCROLL_LOOP:', { counter });

    // eslint-disable-next-line no-await-in-loop
    await Apify.utils.puppeteer.infiniteScroll(page, {
      timeoutSecs: 4,
      waitForSecs: 60,
    });

    if (counter === 25) {
      logger.info('SCROLL_FINISH: BREAK', { counter });
      break;
    }
  }

  const data = await page.evaluate(() => {
    const locationUri = $('div.kDZhm span a').attr('href');
    const location = locationUri.split('@').pop().split(',');
    const galleries = [];
    $('.photoGridBox .photoGridImg .fillSquare img').each(function () {
      galleries.push($(this).attr('src'));
    });
    return {
      loc: {
        type: 'Point',
        coordinates: [parseFloat(location[1]).toFixed(8), parseFloat(location[0]).toFixed(8)],
      },
      name: $('.HjBfq').text(),
      address: $('div.vQlTa span.DsyBj span a[href="#MAPVIEW"]').text().split(' ').slice(0, -3)
        .join(' '),
      region_name: $('.breadcrumb:eq(2) a').text(),
      logo_url: $('.large_photo_wrapper img.basicImg').attr('src'),
      banner_url: galleries.length >= 2 ? galleries[1] : '',
      thumbnail_urls: galleries,
      tel: $('span.AYHFM:first a').text().replace(/ /g, ''),
      website: $("a:contains('Trang web')").attr('href'),
      email: $('.IdiaP.sNsFa:eq(1) a').attr('href').replace('mailto:', '').split('?')[0],
    };
  });
  // const regionData = await getDataFromMongoDB();
  // Lấy id của region
  const dataRegion = await getDataFromMongoDB();
  region = getRegionId(data.region_name, dataRegion);
  await restaurantDataset.pushData({
    ...data,
    region: region,
    hours,
    short_description: shortDescription,
    facility_names: facilities_name,
    facilities,
    description: descriptionNew,
    ...request.userData,
    source_url: request.url,
    content_type: 'restaurants',
    type: 'Restaurant',
    uuid: md5(request.url),
    country_code: 'VN',
    lang_code: 'vi',
    weight: 999,
    status: 2,
  });
};
