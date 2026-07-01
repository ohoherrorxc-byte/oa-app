<template>
  <div class="content ">
    <div v-for="(item,index) in list" :key="index" class="w-48 mb10 ">
      <basic-container>
        <div class="home" @click="navigateToList(item.label)">
          Home
        </div>
        <el-tabs v-model="activeName" class="pb20">
          <el-tab-pane :label="$t(item.label)" name="first" style="height:200px">
            <div style="width:130px;float:left" v-if="item.label=='公司新闻'">
              <!-- 轮播图 -->
              <el-carousel height="120px">
                <el-carousel-item v-for="item in image1" :key="item">
                  <img style="width:120px;height:120px;" :src="item" />
                </el-carousel-item>
              </el-carousel>
            </div>

            <div style="width:130px;float:left" v-if="item.label=='通知公告'">
              <!-- 轮播图 -->
              <el-carousel height="120px">
                <el-carousel-item v-for="item in image2" :key="item">
                  <img style="width:120px;height:120px;" :src="item" />
                </el-carousel-item>
              </el-carousel>
            </div>

            <div v-for="(newItem,index) in newList" class="row" @click="navigateToInfo(newItem.id)"
              v-if="item.label==newItem.newsType" style="font-size:13px">
              <div v-if="newItem.title.length>=15">•
                <el-popover placement="top-start" width="200" trigger="hover" :content="newItem.titleTxt">
                  <span slot="reference">{{ newItem.title}}</span>
                </el-popover>
              </div>
              <div v-if="newItem.title.length<15">
                •{{ newItem.title}}
              </div>
              <div>
                <span>{{ newItem.updateTime }}</span>
                <span>&nbsp;&nbsp;{{ newItem.userName }}</span>
              </div>

            </div>
          </el-tab-pane>
        </el-tabs>

      </basic-container>
    </div>
  </div>
</template>

<script>
  import newsApi from '@/api/newsBulletin/index'
  import {
    mapGetters
  } from "vuex";
  import newTypeList from './newTypeList'
  export default {
    data() {
      return {
        list: [],
        image1: [],
        image2: [],
        newList: [],
        activeName: 'first',
      }
    },
    mounted() {
      this.list = newTypeList;
      this.getList(newTypeList);
      this.GetUser();
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    methods: {
      async GetUser() {
        let slef = this;
        let res = await newsApi.getUserDetail({
          id: this.userInfo.user_id
        });
        if (res.data.data&&(res.data.data.supplierCompanyId != null||res.data.data.isSupplier==='是')) {
          //非正式员工
          this.list = this.list.filter(item => item.label !== '公司制度' && item.label !== '通知公告');
        }
      },
      async getList(newTypeList) {
        for (let i = 0; i < newTypeList.length; i++) {
          let obj = {
            current: 1,
            size: 7,
            newsType: newTypeList[i].label
          }
          let res = await newsApi.List(obj);

          if (res.data.code === 200 || res.data.code === 0) {
            console.log(res.data);
            for (let j = 0; j < res.data.data.total; j++) {
              if (res.data.data.records[j] != undefined) {
                this.newList.push(res.data.data.records[j]);
              }
              let list = res.data.data.records[j];

              if (list != undefined && list.photoList.length > 0) {
                for (let k = 0; k < list.photoList.length; k++) {
                  if (list.newsType == "公司新闻" && this.image1.length < 5) {
                    this.image1.push(list.photoList[k].url);
                    console.log(list.photoList[k].url);
                  }
                }
              }

              if (list != undefined && list.photoList.length > 0) {
                for (let k = 0; k < list.photoList.length; k++) {
                  if (list.newsType == "通知公告" && this.image2.length < 5) {
                    this.image2.push(list.photoList[k].url);
                    console.log(list.photoList[k].url);
                  }
                }
              }
            }

          }
        }

        //超出17个字，后面的用省略号表示
        this.newList.forEach((item, index) => {
          this.$set(item, 'titleTxt', item.title);
          if (item.title.length > 20) {
            if (index < 4 && item.newsType == "公司新闻" || item.newsType == "通知公告") {
              return item.title = item.title.slice(0, 16) + "...";
            } else {
              return item.title = item.title.slice(0, 20) + "...";
            }
          }
        });

        this.newList.forEach(item => {
          item.useTime = this.getFormatDate(new Date(item.useTime));
          item.updateTime =  this.getFormatDate(new Date(item.updateTime||item.createTime));
        });

      },
      navigateToList(item) {
        this.$router.push({
          path: '/newsBulletin/list',
          query: {
            newsType: item
          }
        });
      },
      navigateToInfo(id) {
        this.$router.push({
          path: '/newsBulletin/details',
          query: {
            id: id
          }
        });
      },
      // 获取yyyy-MM-dd格式的日期
      getFormatDate(date) {
        var year = date.getFullYear();
        var month =
          date.getMonth() >= 9 ?
          date.getMonth() + 1 :
          "0" + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        return year + "-" + month + "-" + day;
      },
      async convertToBase64() {
        try {
          const response = await fetch("@/assets/png/homepage.png");
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onload = () => {
            this.base64Image = reader.result;
            console.log(reader.result);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error converting image to base64:', error);
        }
      }
    }
  }
</script>

<style>
  .el-carousel__indicators--horizontal {
    display: none;
  }
</style>
<style lang="scss" scoped>
  .content {
    display: flex;
    flex-wrap: wrap;

    .w-48 {
      width: 48%;
    }

    .row {
      display: flex;
      justify-content: space-between;
      line-height: 30px;
    }

    .home {
      width: 30px;
      height: 20px;
      float: right;
      position: relative;
      left: -45px;
      top: 12px;
      color: #aaa;
      z-index: 100;
    }


  }
</style>
