<template>
  <div class="category">
    <nav-bar class="nav-bar">
      <div slot="center">分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"></tab-menu>
      <scroll class="tab-content" :data="[categoryData]">
        <tab-content-category :subcategories='showSubcategory' />
        <tab-control :titles="['综合', '新品', '销量']" @tabClick="tabClick" />
        <tab-content-detail :category-detail="showCategoryDetail" />
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'

import TabMenu from './childComps/TabMenu'
import TabContentCategory from './childComps/TabContentCategory'
import TabContentDetail from './childComps/TabContentDetail'

import { getCategory, getSubcategory, getCategoryDetail } from 'network/category'
import { POP, SELL, NEW } from 'common/const'
import { tabControlMixin } from 'common/mixin'
export default {
  name: 'Category',
  data() {
    return {
      categories: [], // 分类数据
      categoryData: {}, // 每个分类的子数据
      currentIndex: -1
    }
  },
  mixins: [tabControlMixin],
  created() {
    // 请求分类数据
    this._getCategory()
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {}
      return this.categoryData[this.currentIndex].subcategories
      console.log(this.categoryData[this.currentIndex].subcategories)
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return []
      // console.log(this.categoryData[this.currentIndex].categoryDetail[this.currentType])
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  methods: {
    /* 
    网络请求方法
    */
    // 请求分类数据
    _getCategory() {
      getCategory().then(res => {
        // console.log(res);
        // 1.获取分类数据
        this.categories = res.data.category.list
        // 2.初始化每个类别的子数据 先保存起来，否则变量会被释放掉的
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }
        // 3.请求第一个分类的数据
        this._getSubcategories(0)
      })
    },
    _getSubcategories(index) {
      this.currentIndex = index
      const maitKey = this.categories[index].maitKey
      getSubcategory(maitKey).then(res => {
        // console.log(res)
        this.categoryData[index].subcategories = res.data
        this.categoryData = { ...this.categoryData }
        this._getCategoryDetail(POP)
        this._getCategoryDetail(SELL)
        this._getCategoryDetail(NEW)
      })
    },
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey
      // 2.发送请求，传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res
        this.categoryData = { ...this.categoryData }
      })
    },
    /* 
    事件响应相关的方法
    */
    selectItem(index) {
      this._getSubcategories(index)
    }
  },
  components: {
    NavBar,
    Scroll,
    TabControl,
    TabMenu,
    TabContentCategory,
    TabContentDetail
  }
}
</script>

<style scoped>
.category {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}
.content {
  display: flex;
  overflow: hidden;
  position: absolute;
  font-size: 15px;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-content {
  height: 100%;
  flex: 1;
}
</style>