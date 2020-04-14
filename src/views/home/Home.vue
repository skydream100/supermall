<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control 
    :titles="['流行','新款','精选']" 
    @tabClick="tabClick" 
    ref="tabControl1"
    class="tab-control" v-show="isTabFixed" />
    <scroll class="content" 
      ref="scroll" 
      :probe-type="3" 
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
      >
      <home-swiper 
      :banners="banners" 
      v-if="banners.length"
      @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control 
      :titles="['流行','新款','精选']" 
      @tabClick="tabClick" />
      <good-list :goods="showGoods"
      ref="tabControl2" />
    </scroll>
    <!-- 组件是不能直接监听点击，如果需要使用@click.native(native修饰符监听组件根元素的原生事件) -->
    <back-top @click.native="backTop" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl' 
import GoodList from 'components/content/goods/GoodsList' 
import Scroll from 'components/common/scroll/Scroll' 
import BackTop from 'components/content/backTop/BackTop' 

import {getHomeMultidata, getHomeGoods} from 'network/home'
// import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin, tabControlMixin} from 'common/mixin'
// import {BACK_POSITION} from "common/const";
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
      // isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0, // 保存滚动的位置
      // itemImgListener: null // 监听事件 mixin中复用了这个属性
    }
  },
  mixins: [itemListenerMixin, backTopMixin, tabControlMixin],
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
  mounted () {
    // 这个地方img标签确实被挂载，但是其中的图片还没有占据高度
    // 1.图片加载完成的事件监听
    // 监听item中图片的加载完成 防抖(只要不是最后一次请求，就不执行异步请求)
    // refresh方法后面不能加()，加了表示调用函数
    // this.$refs.scroll.refresh对这个函数进行防抖操作
    // let refresh = debounce(this.$refs.scroll.refresh, 200);

    // 2.对监听的事件进行保存
    // this.itemImgListener =  () => {
    //   // 调用refresh之后就等于调用了debounce这个函数，传入一个函数作为参数
    //   refresh();
    // }
    // this.$bus.$on('itemImgLoad', this.itemImgListener)
    // 2.获取tabControl的offsetTop
    // 所有的组件都有一个属性$el: 用于获取组件中的元素
    // 在mounted中获取到元素的offsetTop的值是不对的。因为有些异步请求的图片数据还没有回来。
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    // console.log(this.$refs.tabControl.$el.offsetTop);
    // this.itemImgListener 因为这个监听事件在详情页也用到了，所以引出mixin混入新知识点。
  },
  // 钩子函数 进入组件 设置位置
  activated () {
    // scrollTo(x, y, time)
    // bug 网友说来回切换时，会滚动到顶部，说要先刷新，再滚动。
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    // this.$refs.scroll.refresh(); // 老师之前的代码，原因是better-scroll版本问题。^1.13.2最新版本源码估计改过
    // 安装better-scroll版本 npm install better-scroll@1.13.2 --save
  },
  // 钩子函数 离开组件 记录位置
  deactivated () {
    // 1.保存y的位置
    this.saveY = this.$refs.scroll.getScrollY()

    // 2.离开组件时，取消全局事件的监听 
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    /* 
    事件监听相关的方法
    */
   swiperImageLoad(){
     // console.log(this.$refs.tabControl.$el.offsetTop);
     this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
   },
   loadMore(){
     // console.log('上拉加载更多');
     // 加载现在哪个,currentType正记录着哪个
     this.getHomeGoods(this.currentType)
   },
   contentScroll(position){
      // 3.是否显示回到顶部 这里多处用到此组件，后来放到mixin中 混入
      // this.isShowBackTop = -position.y > BACK_POSITION
      this.listenShowBackTop(position);
      // console.log(position);
      // this.isShowBackTop = -(position.y) > 1000 // 老师的方法
      // 1.判断BackTop是否显示
      // this.isShowBackTop = Math.abs(position.y) > 1000
      // 2.决定tabControl是否吸顶(position: fixed) // 此方法有bug 解决：后来通过拷贝一份tabControl组件
      this.isTabFixed = Math.abs(position.y) > this.tabOffsetTop
   },
  //  backTop(){
  //    // console.log('click');
  //    this.$refs.scroll.scrollTo(0, 0, 500)
  //  },
   // tabClick(index){
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
    //  this.showGoods = this.goods[this.currentType].list
    // 网友的方法
    // 加入到混入mixin中
    // this.currentType = Object.keys(this.goods)[index];
    // if (this.$refs.tabControl1 !== undefined) {
    //   // 让这两个tabControl的currentIndex保持一致
    //   this.$refs.tabControl1.currentIndex = index;
    //   this.$refs.tabControl2.currentIndex = index;
    // }
   // },
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
        // console.log(res);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        // 数据加载完之后，再主动调用scroll中的finishPullUp这个方法
        this.$refs.scroll.finishPullUp()
      })
    }
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  }
}
</script>

<style scoped>
  #home{
    position: relative;
    height: 100vh;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    /* 在使用浏览器原生滚动时, 为了让导航不跟随一起滚动 */
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9; */
  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
  .tab-control{
    position: relative;
    z-index: 9;
  }
</style>