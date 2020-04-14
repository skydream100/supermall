/* 
哪些能抽取放到mixin中：生命周期里，可在这里写也可在组合内写，到时会合并，
但是methods中的函数内部的代码会被覆盖掉的，因此，函数内部重复的代码必须要调用一下，只会合并大的函数。
*/
import { debounce } from "./utils";
import BackTop from "components/content/backTop/BackTop";
import { BACK_POSITION } from "common/const";
import { POP, SELL, NEW } from "common/const";
// 监听图片加载完之后的防抖操作
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    };
  },
  mounted() {
    // this.$refs.scroll.refresh对这个函数进行防抖操作
    // 如果两个组件之间代码复用，可以通过混入来复用
    // debounce 防抖
    this.newRefresh = debounce(this.$refs.scroll.refresh, 200);
    // 2.对监听的事件进行保存
    this.itemImgListener = () => {
      // 调用refresh之后就等于调用了debounce这个函数，传入一个函数作为参数
      this.newRefresh();
    };
    // 将itemImgLoad发射给首页监听
    this.$bus.$on("itemImgLoad", this.itemImgListener);
    // console.log('我是混入中的内容');
  }
};
// 返回到顶部按钮
export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    };
  },
  components: {
    BackTop
  },
  methods: {
    // 点击返回按钮
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    // 监听是否显示回到顶部
    listenShowBackTop(position) {
      this.isShowBackTop = -position.y > BACK_POSITION;
    }
  }
};
// 流行 新款 精选选项卡切换
export const tabControlMixin = {
  data() {
    return {
      currentType: POP
    };
  },
  methods: {
    tabClick(index) {
      // this.currentType = Object.keys(this.goods)[index];
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
      if (this.$refs.tabControl1 !== undefined) {
        // 让这两个tabControl的currentIndex保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      }
      // console.log(this.currentType);
    }
  }
};
