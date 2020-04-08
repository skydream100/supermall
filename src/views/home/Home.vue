<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners" v-if="banners.length"></home-swiper>
    <recommend-view :recommends="recommends" />
    <feature-view />
    <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick" />
    <good-list :goods="showGoods" />
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl' 
import GoodList from 'components/content/goods/GoodsList' 

import {getHomeMultidata, getHomeGoods} from 'network/home'
export default {
  name: 'Home',
  data(){
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      // curGoodsType: 'pop'
    }
  },
  computed: {
    showGoods(){
      return this.goods[this.currentType].list;
    }
  },
  created () {
    // 1.请求多个数据
    this.getHomeMultidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods: {
    /* 
    事件监听相关的方法
    */
   tabClick(index){
    // console.log(index);
    // 老师的方法
    // switch (index) {
    //   case 0:
    //     this.currentType = 'pop'
    //     break
    //   case 1:
    //     this.currentType = 'new'
    //     break
    //   case 2:
    //     this.currentType = 'sell'
    //     break
    //  }
    // 网友的方法
    this.currentType = Object.keys(this.goods)[index]
   },
    /* 
    网络请求相关的方法
    */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        // console.log(res);
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        console.log(res);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
      })
    }
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList
  }
}
</script>

<style scoped>
  #home{
    padding-top: 44px;
    padding-bottom: 60px;
    background-color: #fff;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }
  .tab-control{
    position: sticky;
    top: 40px;
    z-index: 9;
  }
</style>