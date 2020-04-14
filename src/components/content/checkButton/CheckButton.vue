<template>
  <div class="check-button" :class="{checked :isChecked}">
    <img src="~assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
export default {
  name: 'CheckButton',
  props: {
    // 选中与不选中，是在对象模型中保存的，在checked 来记录是否选中状态，不要改界面。isChecked不是修改这个属性
    isChecked: {
      type: Boolean,
      default: false
    },
  }
  // data(){
  //   return {
  //     checked: this.isChecked
  //   }
  // }
}
</script>

<style scoped>
  .check-button{
    width: 20px;
    height: 20px;
    text-align: center;
    border-radius: 50%;
    border: 2px solid #ccc;
  }
  .checked{
    border-color: var(--color-high-text);
    background-color: var(--color-high-text);
  }
  .check-button img{
    width: 80%;
    margin-top: 1px;
  }
</style>