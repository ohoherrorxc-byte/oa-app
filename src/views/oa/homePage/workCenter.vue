<template>
    <div class="mb25 work-center">
    <el-row type="flex" justify="space-between" class="title-top">
      <el-col @click="toFlow">{{ $t('workCenter.title') }}</el-col>
      <el-col class="text-r">
        <i @click="toFlow" class="el-icon-arrow-right"></i>
      </el-col>
    </el-row>
    <el-tabs stretch class="plr40 prr40 " v-model="activeName" @tab-click="getList">
      <el-tab-pane class="" v-for="tabItem in labelTabList" :label="$t(`workCenter.${tabItem.key}`)" :name="tabItem.key">
        <div class="text-center w-100" v-if="showLoading">
          <img class="w40" src="@/assets/loading.jpg" alt="">
        </div>
        <router-link v-else tag="a" target="_blank" v-for="item in list" :key="item" :to="toRoute(item)">
          <el-row type="flex" justify="space-between" class align="middle">
            <el-col class="list" :span="24">
              <p class="list-title"> {{ item.createUserName }}{{$t('workCenter.initiatedBy')}}“{{ item.processDefinitionName }}”</p>
              <p class="list-time mtr5">{{ $t('workCenter.createTime') }} {{ item.createTime }}</p>
            </el-col>
            <el-col class="text-r" :md="7" :lg="5" :xl="3">
              <p v-if="item.readStatus == 0">
                {{ $t('workCenter.unread') }}
                <i class="el-icon-arrow-right"></i>
              </p>
              <el-button v-if="waitDone(item)" type="success" plain>{{ $t('workCenter.pending') }}</el-button>
              <el-button v-if="isRefuse(item)" type="danger" plain>{{ $t('workCenter.rejected') }}</el-button>
              <el-button v-if="isApprovaling(item)" type="text" plain>{{ $t('workCenter.inProgress') }}</el-button>
              <el-button v-if="approvalRefluse(item)" class="red" type="text" plain>{{ $t('workCenter.approvalRejected') }}</el-button>
              <el-button v-if="approvalDone(item)" class="green" type="text">{{ $t('workCenter.approvalCompleted') }}</el-button>
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </router-link>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getList } from '@/api/myFlow/index'
export default {
  data() {
    return {
      activeName: "waitDone",
      todoTabList: [0, 1, 2],
      doneTabList: [0, 1],
      mineTabList: [0, 1],
      showLoading: true,
      list: [],
      labelTabList: [{
        key: 'waitDone',
        label: '待办事宜'
      },
      {
        key: 'haveDone',
        label: '已办事宜'
      },
      {
        key: 'myRequest',
        label: '已发起'
      },
      ],
      keyValue: {
        'waitDone': 'todoTabList',
        'haveDone': 'doneTabList',
        'myRequest': 'mineTabList'
      }
    };

  },
  mounted() {
    let self = this
    this.getList()
    window.addEventListener("storage", function (e) {
      if (e.key === "reloadPage") {
        self.getList();
      }
    });
  },
  methods: {
    async getList() {
      this.showLoading = true
      let obj = {
        'waitDone': this.todoTabList,
        'haveDone': this.doneTabList,
        'myRequest': this.mineTabList
      }
      let postData = {
        [this.keyValue[this.activeName]]: obj[this.activeName]
      }
      let res = await getList(postData)
      if (res.data.code === 0 || res.data.code === 200) {
        this.showLoading = false
        let arr = res.data.data.records || []
        if (arr.length > 3) {
          arr = arr.slice(0, 3)
        }
        this.list = arr
      }
    },
    waitDone(item) {
      return this.activeName === 'waitDone' && item.readStatus !== 0 && item.processIsFinished !== 'back'
    },
    isRefuse(item) {
      return this.activeName === 'waitDone' && item.readStatus !== 0 && item.processIsFinished === 'back'
    },
    toRoute(item) {
      // console.log(item)
      // let isEdit = item.status === 'waitSubmit' ? true : ''
      let newhref = `${item.path}?businessId=${item.businessId}&taskId=${item.taskId}&type=${this.activeName}&processIsFinished=${item.processIsFinished}&status=${item.status}&isHome=true`
      // window.open(newhref, "_blank");
      // this.$router.push()
      return newhref
    },
    //审批中
    isApprovaling(item) {
      return this.activeName === 'myRequest' && item.processIsFinished === 'unfinished'
    },
    //审批完成
    approvalDone(item) {
      return this.activeName === 'myRequest' && item.processIsFinished === 'finished'
    },
    approvalRefluse(item) {
      return this.activeName === 'myRequest' && item.processIsFinished === 'back'
    },
    toFlow() {
      this.$router.push('/oa/myFlow/index')
    }
  }
};
</script>
<style scoped lang="scss">
.w-100 {
  width: 100%;
}

.work-center {
  background: #fff;
  height: 4.28rem;
  box-sizing: border-box;
  border-radius: 0.04rem;

  ::v-deep ep .el-divider--horizontal {
    margin: 0.14rem 0 !important;
  }

  ::v-deep ep .el-tabs__header {
    margin: 0 0 0.26rem;
  }

  .title-top {
    padding: 0.2rem 0.38rem;
    color: #222b45;
    font-size: 0.26rem;
    font-weight: 600;
  }

  .text-center {
    text-align: center;
  }

  ::v-deep ep .el-tabs__nav-wrap:after {
    content: none;
  }

  .list {
    font-weight: 400;

    .list-title {
      color: #222b45;
      font-size: 0.21rem;
    }

    .list-time {
      color: #9d9d9d;
      font-size: 0.18rem;
    }
  }

}



.red {
  color: red;
}

.green {
  color: #67C23A;
}</style>