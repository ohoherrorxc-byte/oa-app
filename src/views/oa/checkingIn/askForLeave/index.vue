<template>
  <basic-container>
    <avue-crud
      :option="option"
      :search.sync="search"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page.sync="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <div class="btn">
          <el-button size="small" type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </template>
      <!-- <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-edit" :size="size" :type="type" @click="editRow(row)">编辑</el-button>
                <el-button icon="el-icon-delete" :size="size" :type="type" @click="deleteRow(row)">删除</el-button>
      </template>-->
    </avue-crud>
  </basic-container>
</template>

<script>
import OriginalStatementApi from "@/api/checkingIn/askForLeave/index";
import { downBlobFile } from "@/util/util";
export default {
  data() {
    return {
      activeName: "all",
      search: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      data: [],
      form: {},
      option: {
        calcHeight: 80,
        tip: false,
        searchShow: true,
        searchMenuSpan: 100,
        border: true,
        index: true,
        selection: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menu: false,
        //dialogType: 'drawer',
        dialogClickModal: false,
        searchShowBtn: false,
        column: [
          {
            label: "姓名",
            prop: "realName",
            searchLabelWidth: 120,
            searchSpan: 8,
            search: false,
            display: false,
          },
          {
            label: "分部",
            prop: "company",
            slot: true,
            search: false,
            display: false,
          },
          {
            label: "部门",
            prop: "deptName",
            searchSpan: 8,
            searchLabelWidth: 80,
            search: false,
            display: false,
          },
          {
            label: "岗位",
            prop: "postName",
            display: false,
          },
          {
            label: "编号",
            prop: "purchasePartNumber",
            width: 100,
            search: false,
            display: false,
          },
          {
            label: "开始日期",
            prop: "startDate",
            search: false,
            display: false,
          },
          {
            label: "开始时间",
            prop: "startTime",
            search: false,
            display: false,
          },
          {
            label: "结束日期",
            prop: "endDate",
            search: false,
            display: false,
          },
          {
            label: "结束时间",
            prop: "endTime",
            search: false,
            display: false,
          },

          {
            label: "本次请假天数",
            prop: "leaveDaysNum",
            search: false,
            display: false,
          },
          {
            label: "本次请假小时数",
            prop: "leaveHoursNum",
            search: false,
            display: false,
          },

          {
            label: "请假事由",
            prop: "leaveReason",
            search: false,
            display: false,
          },

          {
            label: "请假类型",
            prop: "leaveType",
            search: false,
            display: false,
          },
          {
            label: "流程状态",
            prop: "flowStatus",
            search: false,
            display: false,
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    async onLoad(page, params = {}) {
      let obj = {
        size: page.pageSize,
        current: page.currentPage,
      };
      let postdata = { ...obj, ...params, ...this.query, ...this.form };
      this.loading = true;
      await OriginalStatementApi.list(postdata).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    },
    handleClick() {
      //0：进行中；1：闲置中；2：领用中；3：维修中；4：已报废;5:已归还
      let obj = {
        all: null,
        inReceipt: [2],
        scrapped: [4],
        inIdle: [1],
        isDoing: [0],
        isReturn: [5],
        isRepair: [3],
      };
      this.form.assetStatusList = obj[this.activeName];
      this.onLoad(this.page);
    },
    handleAdd() {
      this.$refs.createPart.dialogVisible = true;
      this.$refs.createPart.resetForm();
    },

    async handleExport() {
      let res = await OriginalStatementApi.originalStatementExport();
      console.log(res);
      downBlobFile(res.data, "原始记录报表");
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
  },
};
</script>