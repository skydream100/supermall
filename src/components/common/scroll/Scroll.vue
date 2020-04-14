<template>
  <!-- ref/children -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      scroll: null
    }
  },
  mounted () {
    /* 
      1.console.log(document.querySelector('.wrapper')); 
      2.使用querySelector不好，可能多处使用了content这个样式名，拿不到你想要的元素对象
      3.ref/children访问子组件。children:获取所有子组件，ref获取某个明确的子组件,组件和元素都可以通过ref拿到
    */
   // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    // 2.监听滚动的位置 提高性能 做个判断 probeType默认0， 0和1是不作任何监听
    if (this.probeType === 2 || this.probeType ===3 ) {
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        this.$emit('scroll', position) 
      })
    }
    // // 3.监听上拉事件 不一定每个地方都要有上拉事件，最好定义成一个属性 此方法存在Bug 使用中央事件总线bus
    // this.scroll.on('pullingUp', () => {
    //   // console.log('上拉加载更多');
    //   this.$emit('pullingUp');
    // })
    // 3.监听scroll滚动到底
    if (this.pullUpLoad){
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time=30) {
      // 逻辑与 只要前一个为false，后面就不执行了
      // this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    // 调用better-scroll中的finishPullUp方法
    finishPullUp(){
      this.scroll && this.scroll.finishPullUp();
    },
    refresh(){
      // 测试防抖是否执行一次
      // console.log('--------');
      this.scroll && this.scroll.refresh()
    },
    getScrollY(){
      // this.scroll 有值，返回this.scroll.y 否则返回 0
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>
<style>
</style>