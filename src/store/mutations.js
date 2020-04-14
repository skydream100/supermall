import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // mutations唯一的目的就是修改state中的状态
  // mutations中的每一个方法尽量完成的事件比较单一 复杂的方法和异步操作应该放在actions中
  // addCart(state, payload)
  // 不直接修改state,就是要让mutations作跟踪，当项目比较大的时候，可以通过这个去调试。
  // addToCart(state, payload){  addToCart -> [ADD_COUNTER]
  [ADD_COUNTER](state, payload){
    payload.count ++
  },
  [ADD_TO_CART](state, payload){
    payload.checked = true
    state.cartList.push(payload)
  }
}