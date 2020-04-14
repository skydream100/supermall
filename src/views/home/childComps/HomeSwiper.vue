<template>
  <swiper v-if="banners.length">
    <swiper-item v-for="(item,index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'components/common/swiper'
export default {
  name: 'HomeSwiper',
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data(){
    return {
      isLoad: false
    }
  },
  methods: {
    imageLoad(){
      // console.log('---------');
      // 获取图片加载完成之后再发射事件给首页的tabControl组件
      if (!this.isLoad){
        this.$emit('swiperImageLoad');
        // 图片加载完成之后将this.isLoad = true; 就不会再进入这个条件里
        this.isLoad = true;
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  }
}
</script>

<style>

</style>