<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props:{
    path: String,
    activeColor: {
      type: String,
      default: "#ff5777"
    }
  },
  data(){
    return {
      // isActive: false
    }
  },
  computed: {
    isActive(){
      // /home -> item1(/home) = true
      // /home -> item1(/category) = false
      // /home -> item1(/cart) = true
      // /home -> item1(/profile) = true
      // 如果当前的路由和活跃的路由相同，就高亮。
      return this.$route.path.indexOf(this.path) !== -1
    },
    // 设置tabbar的颜色 :class="{active: isActive}" 这个就不能用了
    activeStyle(){
      return this.isActive ? { color: this.activeColor } : {}
    }
  },
  methods: {
    itemClick(){
      if(!this.isActive){
        this.$router.replace(this.path)
      }
    }
  }
}
</script>

<style>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    vertical-align: middle;
    margin-top: 2px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
  }
  .active{
    color: rgb(255, 87, 119);
  }
</style>