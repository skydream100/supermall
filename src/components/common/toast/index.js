import Toast from './Toast';
const obj = {}
obj.install = function (Vue) {
  // console.log('执行了obj的install函数');
  // 1.创建组件构造器
  const toastConstrustor = Vue.extend(Toast);
  // 2.new的方式，根据组件构造器
  const toast = new toastConstrustor();
  // 3.将组件对象，手动挂载到某一个元素上
  toast.$mount(document.createElement('div'));
  // 4.toast.$el对应的就是div
  document.body.appendChild(toast.$el);
  // 5.将$toast方法添加到Vue原型中
  Vue.prototype.$toast = toast;
}
export default obj