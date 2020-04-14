<template>
  <div class="tab-content">
    <grid-view :cols="3" :lineSpace="15" :v-margin="20" v-if="subcategories.list">
      <div class="content-item" v-for="(item, index) in subcategories.list" :key="index">
        <img :src="item.image" alt="" />
        <div>{{item.title}}</div>
      </div>
    </grid-view>
  </div>
</template>

<script>
import GridView from 'components/common/gridView/GridView'

export default {
  name: 'TabContentCategory',
  props: {
    subcategories: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    GridView
  }
}
</script>

<style scoped>
.content-item {
  text-align: center;
}
.content-item img {
  width: 80%;
}
.content-item span {
  display: inline-block;
  margin-top: 5px;
}
</style>