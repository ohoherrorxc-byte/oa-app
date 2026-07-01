<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('myFlow.MyFavorites')" name="myCollect">
        <el-card class="box-card">
          <div
            v-for="(item, index) in collectList"
            @click="toPath(item)"
            :key="index"
            class="text item"
          >
            <div>{{language==='en'?item.alias:item.name }}</div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane
        v-for="item in tabList"
        :key="item.id"
        :label="language==='en'?item.alias:item.dictValue"
        :name="'flow_' + item.dictKey"
      >
        <el-card class="box-card">
          <div
            v-for="(item, index) in childrenFlowList"
            @click="toPath(item)"
            :key="index"
            class="text item"
          >
            <div :style="{color:item.disabled?'#999':''}">{{language==='en'?item.alias:item.name }}</div>
            <div @click.stop="changeCollect(item)" class="collect">
              <svg
                t="1695015485595"
                class="icon ml10"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5502"
                width="20"
                height="20"
              >
                <path
                  d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z"
                  :fill="item.fillCollect"
                  p-id="5503"
                />
              </svg>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import list from "./components/list.vue";
import { mapGetters } from "vuex";
import MyFlowApi, {
  startList,
  collectTask,
  myCollect,
} from "@/api/myFlow/index";
export default {
  components: {
    list,
  },
  data() {
    return {
      activeName: "myCollect",
      tabList: [],
      collectList: [],
      childrenFlowList: [],
      form: {
        mode: 1,
        current: 1,
        size: 100,
        category: null,
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo","language"]),
  },
  mounted() {
    this.getAllProcess();
    this.getMyCollect();
  },
  methods: {
    async getMyCollect() {
      let res = await myCollect();
      if (res.data.code === 200 || res.data.code === 0) {
        this.collectList = res.data.data;
      }
    },
    async getAllProcess() {
      let res = await MyFlowApi.flowType();
      if (res.data.code === 200 || res.data.code === 0) {
        this.tabList = res.data.data;
      }
    },
    toPath(item) {
      if(item.disabled)return
      this.$router.push(`${item.path}?processInstanceId=${item.id}`);
    },
    handleClick() {
      if (this.activeName === "myCollect") {
        this.getMyCollect();
      } else {
        this.getFlowType();
      }
    },
    async getFlowType() {
      this.form.category = this.activeName;
      let res = await startList(this.form);
      this.childrenFlowList = res.data.data.records;
      if(this.form.category==='flow_8'){
        this.childrenFlowList = this.childrenFlowList.filter(ele=>{return ele.name!=='开票申请'})
      }
      // if(this.form.category==='flow_23'){
      //   this.childrenFlowList.map(ele=>{
      //     if(ele.name==='零件报废申请'){
			// 				ele.name = '零件报废申请(流程更新中....)'
			// 				ele.disabled = true
			// 			}
			// 			if(ele.alias==='Scrap Part Request'){
			// 				ele.alias = 'Scrap Part Request(Process Updating...)'
			// 				ele.disabled = true
			// 			}
      //   }) 
      //   this.childrenFlowList.filter(ele=>{return ele.name!=='零件报废申请'})
      // }
      this.childrenFlowList.map((ele) => {
        let tempCollect = ele.collectStatus ? "#FFC076" : "#E9E9E9";
        this.$set(ele, "fillCollect", tempCollect);
      });
    },
    async changeCollect(item) {
      let obj = {
        collectId: item.id,
        collectStatus: item.collectStatus ? 0 : 1,
        userId: this.userInfo.user_id,
      };
      let res = await collectTask(obj);
      if (res.data.code === 200) {
        this.getFlowType();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 50%;
}

.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  cursor: pointer;
}

.collect {
  display: none;
}

.item:hover {
  background: #f2f8fe;
  .collect {
    display: block;
  }
}
</style>