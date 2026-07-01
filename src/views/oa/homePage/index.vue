<template>
  <div class="ml15 mr15">
    <!-- 工作流统计弹窗 -->
    <!-- <workflowModel></workflowModel> -->

    <el-row type="flex" justify="space-between" :gutter="20">
      <el-col :span="12" style="box-sizing:border-box;">
        <!-- 轮播图 -->
        <carousel></carousel>
      </el-col>
      <!-- 日历 -->
      <el-col :span="12" class="" style="box-sizing:border-box;">
        <!-- <calendar></calendar> -->
        <otherWebEnter></otherWebEnter>
      </el-col>
    </el-row>
    <el-row :gutter="20" justify="space-between">
      <el-col :span="12" class=" " style="box-sizing:border-box;">
        <workCenter></workCenter>
      </el-col>
      <el-col :span="12" class="" v-for="(item) in  newsList" style="box-sizing:border-box;">
        <list :item="item"></list>
      </el-col>
    </el-row>
    <!-- 全部应用 -->
    <!-- <newsBulletin></newsBulletin> -->
    <!-- <allApply></allApply> -->
  </div>
</template>
<script>
import carousel from "./carousel.vue";
import workCenter from "./workCenter";
import calendar from "./calendar";
import allApply from "./allApply";
import { getToken } from "@/util/auth";
import watermark from "@/util/watermark";
import list from './newsBulletin/list'
import newsBulletin from './newsBulletin/index'
import newTypeList from "./newsBulletin/newTypeList";
import { mapGetters } from 'vuex'
import newsApi from '@/api/newsBulletin/index'
import otherWebEnter from './otherWebEnter.vue'
import workflowModel from './workflowModel.vue'
export default {
  components: {
    carousel,
    workCenter,
    calendar,
    allApply,
    list,
    newsBulletin,
    otherWebEnter,
    workflowModel
  },
  data() {
    return {
      newsList: []
    }
  },
  created() {
    watermark.set()
    if (getToken() && window.location.search.includes("session_state")) {
      // var searchParams = new URLSearchParams(location.search)
      // // 删除查询参数
      // searchParams.delete('session_state');
      // searchParams.delete('code');
      // 将新的查询字符串应用到URL中
      var newUrl = location.origin + location.pathname + "#/oa/homePage/index";
      location.href = newUrl;
    } else {
    }
    this.GetUser()
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
      console.log('22222')
      console.log(res)
      if (res.data.data&&(res.data.data.supplierCompanyId != null||res.data.data.isSupplier==='是')) {
        //非正式员工
        this.newsList = newTypeList.filter(item => item.label !== '公司制度' && item.label !== '通知公告');

      }else{
        this.newsList = newTypeList
      }

    },
  }
};
</script>
