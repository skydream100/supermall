<template>
  <div class="goods-item" @click="itemClick">
    <!-- <img :src="showImage" alt="" @load="imageLoad"> -->
    <img v-lazy="showImage" :key="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsListItem',
  props: {
    goodsItem: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  computed: {
    showImage(){
      return this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    imageLoad(){
      // 另一种方法
      this.$bus.$emit('itemImgLoad');
      // // 如果是在home组件中就要通知home监听事件。别的组件不用监听
      // if (this.$route.path.indexOf('/home')) {
      //   // 监听item中图片加载完成 中央事件总线bus -> 在main.js文件中Vue的原型中添加bus方法
      //   // emit发射 将itemImgLoad事件发射出去，然后在要使用这个事件的组件中监听事件。
      //   this.$bus.$emit('itemImgLoad')
      // } else if (this.$route.path.indexOf('/detail')) {
      //   this.$bus.$emit('detailImgLoad')
      // }
    },
    itemClick(){
      this.$router.push('/detail/' + this.goodsItem.iid)
      /* 另一种传参方式 此方法路由中不用定义
      this.$router.push({
        path: '/detail',
        query: {
          iid: this.goodsItem.iid
        }
      })
      console.log(this.goodsItem.iid);
      */
    }
  }
}
</script>

<style scoped>
.goods-item {
  margin: 0 auto 10px auto;
  padding-bottom: 40px;
  position: relative;
  width: 47%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: '';
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url('~assets/img/common/collect.svg') 0 0/14px 14px;
}
</style>
