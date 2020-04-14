<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list />
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

// vuex提供了一种方法 mapGetters --> 使用时 ...mapGetters
import { mapGetters } from 'vuex'
export default {
  name: 'Cart',
  computed: {
    // 两种写法
    ...mapGetters(['cartLength'])
    // 第二种写法
    // ...mapGetters({
    //   length: 'cartLength',
    //   list: 'cartList'
    // })
  },
  components: {
    NavBar,
    CartList,
    CartBottomBar
  }
}
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>