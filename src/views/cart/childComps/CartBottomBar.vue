<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate">
      去结算：( {{checkLength}} )
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

import { mapGetters } from 'vuex';

export default {
  name: 'CartBottomBar',
  computed: {
    ...mapGetters(['cartList']),
    totalPrice(){
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength(){
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll(){
      if (this.cartList.length === 0) return false
      // 1.使用filter 每个都要遍历，影响性能
      // return !(this.cartList.filter(item => !item.checked).length)
      // 2.使用find
      return !this.cartList.find(item => !item.checked)
      // // 3.普通遍历 for of 直接遍历元素值
      // for (let item of this.cartList){
      //   if (!item.checked) return false
      // }
      // return true
    }
  },
  methods: {
    checkClick(){
      // if (this.isSelectAll) { // 全部选中
      //   this.cartList.forEach(item => item.checked = false)
      // } else { // 部分或全部不选中
      //   this.cartList.forEach(item => item.checked = true)
      // }
      // 网友的方法
      const isAll = this.isSelectAll;
      this.cartList.forEach(item => item.checked = !isAll)
    }
  },
  components: {
    CheckButton
  }
}
</script>

<style scoped>
  .bottom-bar{
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #eee;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price{
    flex: 3;
    margin-left: 20px;
  }
  .calculate{
    width: 100px;
    background-color: var(--color-high-text);
    color: #fff;
    text-align: center;
  }
</style>