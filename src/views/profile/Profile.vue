<template>
  <div id="profile">
    <nav-bar class="nav-bar">
      <div slot="center">个人中心</div>
    </nav-bar>
    <!--1.单独封装一个组件: 利用slot知识点-->
    <user-info />
    <!--2.没有单独封装: 不同的地方太多, 需要传过多的参数-->
    <section class="account">
      <div class="account-item">
        <div class="number">
          <span class="balance">0.00</span>元
        </div>
        <div class="account-info">我的余额</div>
      </div>
      <div class="account-item">
        <div class="number">
          <span class="balance">0</span>个
        </div>
        <div class="account-info">我的优惠</div>
      </div>
      <div class="account-item">
        <div class="number">
          <span class="balance">0</span>分
        </div>
        <div class="account-info">我的积分</div>
      </div>
    </section>
    <!--3.封装成一个整体-->
    <list-view :list-data="orderList" class="order-list"></list-view>
    <list-view :list-data="serviceList" class="service-list"></list-view>
    <list-view :list-data="moreList" class="more-list"></list-view>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

import UserInfo from './childCopms/UserInfo'
import ListView from './childCopms/ListView'
export default {
  name: 'Profile',
  data() {
    return {
      orderList: [
        { icon: '#order', iconColor: '#ff8198', info: '我的消息' },
        { icon: '#point', iconColor: '#fc7b53', info: '积分商城' },
        { icon: '#vip', iconColor: '#ffc636', info: '会员卡' }
      ],
      serviceList: [
        { icon: '#service', iconColor: '#ff8198', info: '我的购物车' },
        { icon: '#download', iconColor: '#ff8198', info: '下载购物APP' }
      ],
      moreList:[
        {icon: '#expired', iconColor: '#ff8198', info: '设置'},
        {icon: '#vip', iconColor: '#ff8198', info: '更多'},
      ]
    }
  },
  components: {
    NavBar,
    ListView,
    UserInfo
  }
}
</script>

<style scoped>
#profile {
  height: 100vh;
  background-color: #f2f2f2;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
.account {
  display: flex;
}
.account-item {
  flex: 1;
  background-color: #fff;
  margin-right: 1px;
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 18px;
}
.account-item:last-of-type {
  margin-right: 0;
}
.balance {
  font-size: 24px;
  font-weight: 700;
  color: #ff5f3e;
}
.account-info {
  margin-top: 6px;
}
.order-list, .service-list,.more-list {
    margin-top: 12px;
  }
</style>