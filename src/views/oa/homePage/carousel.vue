<template>
  <div class="pr carousel">
    <el-carousel :autoplay="true" height="5.5rem" @change="changeView">
      <el-carousel-item v-for="item in listNews" :key="item" class="flex-center-item">
        <img class="oa-carousel-img" :src="item.url" mode="scaleToFill" @click="toRouter(item)"/>
        <el-button round class="pa to-view" @click="toRouter(item)">前往查看</el-button>
      </el-carousel-item>
    </el-carousel>
    <div class="to-name ellipsis" @click="toRouter(currentRow)">标题：{{ currentRow.name }}</div>
  </div>
</template>

<script>
import newsApi from '@/api/newsBulletin/index'
export default {
  data() {
    return {
      height: "",
      newList: [],
      image2: [],
      image1: [],
      listNews:[],
      currentRow:{
        name:""
      }
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      let obj = {
        current: 1,
        size: 7,
        newsType: '公司新闻'
      }
      let res = await newsApi.List(obj);
      if (res.data.code === 200 || res.data.code === 0) {
        let list = res.data.data.records;
        let arr = list.filter(ele => ele.photoList.length > 0)
        arr.map(ele => {
          this.listNews.push({ url: ele.photoList[0].url, id: ele.id,name:ele.title })
        })
        this.currentRow = this.listNews[0]
      }
      // console.log(this.listNews)
      //超出17个字，后面的用省略号表示

    },
    changeView(v){
      this.currentRow = this.listNews[v]
    },
    toRouter(item){
      this.$router.push(`/newsBulletin/details?id=${item.id}`)
    }
  }
};
</script>
<style scoped lang="scss">
.el-carousel,
.carousel {
  //border-radius: 11px 11px 0  0;
  background:#fff;

  img {
    width: 100%;
  }
  .oa-carousel-img {
    margin-top: 5px !important;
  }

  .to-view {
    left: 31px;
    bottom: 29px;
    z-index: 999;
  }
  .to-name{
    height: 0.4rem;
    font-size: 14px;
    padding-top: 0.1rem;
    // padding-bottom: 10px;
    padding-left: 10px;
  }
  .flex-center-item{
    display: flex;
    align-items: center;
  }
}
</style>
