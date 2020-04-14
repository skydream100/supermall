import { request } from './request';
export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}
// es6 类 constructor 构造器
export class Goods {
  constructor(itemInfo, columns, services) {
    // 从itemInfo中取出title并赋值给这个对象的title属性
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.discount = itemInfo.discountDesc;
    this.discountBgColor = itemInfo.discountBgColor;
    this.columns = columns;
    this.services = services;
    this.realPrice = itemInfo.lowNowPrice;
  }
}
// 商铺展示
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}
// // 商品参数
// export class GoodsParams {
//   constructor(info, rule){
//     // 注：images可能没有值(某些商品有值，某些没有值)
//     this.image = info.images ? info.images[0] : '';
//     this.infos = info.set;
//     this.sizes = rule.tables;
//   }
// }
// 商品推荐
export function getRecommend(){
  return request({
    url: '/recommend'
  })
}