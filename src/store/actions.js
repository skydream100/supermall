import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // addCart({state, commit}, payload) { // 对象的解构
  addCart(context, payload) { // context 上下文
    return new Promise((resolve, reject) => {
    // state.cartList.push(payload); // 每点击一次新增一个商品对象，而不是商品数量加1。
    // 查看新的API 控制台 -> Array.prototype 回车
    // 数组常用的方法有哪些？ push/pop/shift/unshift/sort/reverse/map/filter/reduct/join/splice/some/every
    // 1.查找之前数组中是否有该商品 有的话，就加1，没有则创建一个对象，并赋值为1
    //   let oldProduct = state.cartList.find(function(item){
    //     return item.iid === payload.iid
    //  })
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
    // 2.判断oldProduct
    if (oldProduct) { // 数量加1
      // oldProduct.count += 1
      // 通过 dispatch 将原来的两个任务做了分发成两个任务。vuex才能比较好的跟踪。
      context.commit(ADD_COUNTER, oldProduct)
      resolve('当前的商品数量加1')
    } else { // 添加新的商品
      payload.count = 1;
      // context.state.cartList.push(payload);
      context.commit(ADD_TO_CART, payload)
      resolve('添加商品成功')
    }
    })
  }
}