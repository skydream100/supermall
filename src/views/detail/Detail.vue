<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav-bar" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <!-- 属性：topImages 传入值：top-images html标签不区别大小写的 -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @detailImgLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backTop"  v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

import {getDetail, Goods, Shop, getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'
import { mapActions } from 'vuex'
// import {BACK_POSITION} from "common/const";
export default {
  name: 'Detail',
  data(){
    return {
      iid: null,
      // 顶部轮播图数组
      topImages: [],
      // 详情轮播图下面的数据 --整合来的
      goods: {},
      // 店铺信息
      shop: {},
      // 商品详情文字描述
      detailInfo: {},
      // 商品参数
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      // itemImgListener: null
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
      // isShowBackTop: false
    }
  },
  mixins: [itemListenerMixin, backTopMixin],
  created () {
    // 1.保存传入的iid 此时的iid使用的全局iid变量 如果const iid = this.$route.params.iid下面就可以用这个iid
    this.iid = this.$route.params.iid
    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取数据
      // console.log(res);
      const data = res.result;
      // 2.取出顶部的图片轮播图数据
      this.topImages = data.itemInfo.topImages;

      // 3.创建商品对象 创建 Goods构造函数的实例对象 goods
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      // 也可以直接取出
      // this.shop = data.shopInfo

      // 5.取出详情的信息
      this.detailInfo = data.detailInfo

      // 6.取出商品参数信息
      this.paramInfo = data.itemParams;
      // 7.获取评论信息
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0];
      }
    })
    // 3.获取推荐商品
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
    })
    /*
    第一次获取，值不对，原因 this.$refs.params.$el压根就没有渲染
    this.themeTopYs = [];
    this.themeTopYs.push(0);
    this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    this.themeTopYs.push(this.$refs.recomend.$el.offsetTop);
    console.log(this.themeTopYs);

    this.$nextTick(() => {
      // 第二次值不对，原因：图片没有计算在内
      // 根据最新的数据，对应的DOM是已经被渲染出来
      // 但是图片依然是没有加载完(目前获取到offsetTop不包含图片)
      // offsetTop值不对的时候，都是因为图片还没有完全加载完。
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recomend.$el.offsetTop);
    })
    console.log(this.themeTopYs);
    */
    // 4.给getThemeTopY 赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE) // 数字类型中最大值
      // this.themeTopYs.push(Number.MAX_SAFE_INTEGER);
      // console.log(this.themeTopYs);
    }, 200)
  },
  // mounted () {
  //   let refresh = debounce(this.$refs.scroll.refresh, 200);
  //   // 2.对监听的事件进行保存
  //   this.itemImgListener =  () => {
  //     // 调用refresh之后就等于调用了debounce这个函数，传入一个函数作为参数
  //     refresh();
  //   }
  //   this.$bus.$on('itemImgLoad', this.itemImgListener)
  // },
  destroyed () { // 因为详情页没有keep-alive缓存，所以不会调用activated和deactivated这两个钩子函数
    // 没有缓存则会回调destroyed
    // 1.详情页取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    // 加入到购物车
    addToCart(){
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // console.log(product);
      // 2.将商品添加到购物车里
      // 虽然可以这样添加，但是建议不要这样操作，修改任何实例里面的东西都要通过 mutations
      // this.$store.cartList.push(product);

      // 通过vuex来管理购物车里的相关的商品
      // mutation 提交
      // this.$store.commit('addCart', product);
      // action 提交 dispatch 分发出去
      // this.$store.dispatch('addCart', product);
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
      // 使用mapActions映射关系 辅助函数 会自动去actions中查找addCart方法
      // 返回一个Promise对象
      this.addCart(product).then(res => {
        // console.log(res);
        this.$toast.show(res, 3000)
      }).catch(err=>{})
    },
    contentScroll(position){
      // 1.获取y的值
      const positionY = -position.y;
      // 2.将positionY的值和主题中的值进行对比
      let length = this.themeTopYs.length;
      //  hack做法 遍历时 i < length - 1 就是最后一个不要遍历。
      for(let i = 0; i< length -1; i++){
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      /*  // 普通做法
      for(let i = 0; i < length; i++){
        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >=  this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }
      }
    普通做法解析 遍历时 i < length 最后遍历。
    (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >=  this.themeTopYs[i])))
    条件成立：this.currentIndex = i
    条件一：防止赋值的过程过于频繁
    条件二：((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >=  this.themeTopYs[i]))
    条件1：(i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
    * 判断区间：在0和某个数字之间(i < length -1) 0-3之间进行判断
    条件2：(i === length - 1 && positionY >=  this.themeTopYs[i]) 这个是最后一个数字的判断
    * 判断大于等于：i === length -1

    //  hack做法 遍历时 i < length - 1 就是最后一个不要遍历。
    2.positionY和主题中进行对比：[0, 7938, 9129, 9452, 非常大的值] 比普通做法多一个对比数字(数字类型的最大值Math中)，这样就不用单独考虑最后一个数值。
    */
        // 3.是否显示回到顶部 放在混入中了
        // this.isShowBackTop = - position.y > BACK_POSITION
        this.listenShowBackTop(position);
      }
    },
    imageLoad(){
      // 1.调用了mixin中的newRefresh方法
      this.newRefresh();
      // this.$refs.scroll.refresh()
      this.getThemeTopY();
    },
    // backTop(){
    //   // console.log('click');
    //   this.$refs.scroll.scrollTo(0, 0, 500)
    // },
    titleClick(index){
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop
  }
}
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 7;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav-bar{
    position: relative;
    z-index: 9;
    background-color: #fff;;
  }
  .content{
    height: calc(100% - 44px - 49px);
    /* offsetTop获取的距离是有定位的父元素的顶部高度，在scroll添加position:relative就可以了 */
    position: relative;
    /* 加上这个之后按住加入购物车后不会往上走 */
    overflow: hidden;
  }
</style>