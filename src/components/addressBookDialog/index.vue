<template>
  <el-dialog title="通讯录" :visible.sync="dialogVisibleAddress" width="80%" :before-close="handleClose"
    :append-to-body="true" :lock-scroll="false">
    <div class="pr">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="最近" name="first">
          <list :isCheckedList="isCheckedList" :multiple="multiple" @getPerson="getPerson" ref="listRef" :isRecent="true" directSuperiorId departmentId>
          </list>
        </el-tab-pane>
        <el-tab-pane label="同部门" name="second">
          <list :isCheckedList="isCheckedList" :multiple="multiple" @getPerson="getPerson" ref="listRef1" directSuperiorId
            :departmentId="userInfo.dept_id"></list>
        </el-tab-pane>
        <el-tab-pane label="我的下属" name="third">
          <list :isCheckedList="isCheckedList"  :multiple="multiple" :directSuperiorId="userInfo.user_id" ref="listRef2" departmentId
            @getPerson="getPerson"></list>
        </el-tab-pane>
        <el-tab-pane label="组织结构" name="fourth">
          <addressTree :isCheckedList="isCheckedList" :multiple="multiple" :deepPerson="true" @getPerson="getPerson" ref="addressTree" :showInput="false"
            :serachValue="serachValue"></addressTree>
        </el-tab-pane>
      </el-tabs>
      <div class="search">
        <el-input placeholder="高级搜索" v-model="serachValue" class="input-with-select">
          <el-button @click="searchClick" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleAddress = false">取 消</el-button>
      <el-button type="primary" @click="remark">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import addressTree from "../addressTree/index.vue";
import list from "./list.vue";
export default {
  components: {
    addressTree,
    list,
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    checkedList:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      dialogVisibleAddress: false,
      activeName: "first",
      serachValue: "",
      isCheckedList:[]
    };
  },
  watch:{
    checkedList(val){
      console.log(val)
      console.log('-----val')
      this.isCheckedList = this.checkedList
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted(){
  },
  methods: {
    handleClick(reset) {
      if (this.activeName === "first") {
        this.$refs.listRef.getList(this.serachValue, "recent", reset);
      } else if (this.activeName === "second") {
        this.$refs.listRef1.getList(this.serachValue, "", reset);
      } else if (this.activeName === "third") {
        this.$refs.listRef2.getList(this.serachValue, "", reset);
      } else if (this.activeName === "fourth") {
        if (this.serachValue) {
          this.$refs.addressTree.getlists();
        } else {
          this.$refs.addressTree.getData("deep");
        }
      }
    },
    dealCheck(){
      this.$nextTick(()=>{
        this.$refs.listRef.dealCheck()
      })    
    },
    getPerson(data, tree) {
      console.log(data)
      console.log('tree')
      if (!this.multiple) {
        this.$emit("getPerson", data, tree);
        this.dialogVisibleAddress = false;
      } else {
        this.isCheckedList = data
      }

    },
    remark() {
      if(this.activeName === 'fourth'){
        console.log( this.isCheckedList)
        console.log('isCheckedList')
        this.$emit('getPerson', this.isCheckedList)
        this.dialogVisibleAddress = false
        return
      }
      let obj = {
        "first": "listRef",
        "second": 'listRef1',
        "third": 'listRef2'
      }

      this.isCheckedList = this.$refs[obj[this.activeName]].list.filter(ele => {
        return ele.checked
      })
      this.$emit('getPerson', this.isCheckedList)
  
      this.dialogVisibleAddress = false
    },
    searchClick() {

      if (this.activeName === "fourth") {
        this.$refs.addressTree.getlists();
      } else {
        this.handleClick("reset");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: absolute;
  top: -32px;
  right: 0;
}

@media (min-width: 768px) {
  .search {
    position: absolute;
    top: 0;
    right: 0;
  }
}</style>