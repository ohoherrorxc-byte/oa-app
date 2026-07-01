<template>
  <basic-container>
    <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
      @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
      <template slot="menuLeft">
        <div class="btn">
          <upload @handleRequest="handleRequest" :showTip="false" class="mx10" url="/api/oa-portal/flowTable/import"></upload>
          <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExport">{{$t('commonContent.export')}}</el-button>
        </div>
      </template>
      <template slot-scope="{type,size,row,index}" slot="menu">
        <el-button icon="el-icon-view" :size="size" :type="type" @click="view(row, index)">{{ $t('commonContent.viewDetails') }}</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import OriginalStatementApi from "@/api/flowTable/businessTrip/index";
import { downBlobFile } from "@/util/util";
import upload from '@/components/upload';
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
        menu: true,
        //dialogType: 'drawer',
        dialogClickModal: false,
        searchShowBtn: false,
        column: [
          {
            label: this.$t('commonContent.title'),
            prop: "titleName",
            searchLabelWidth: 120,
            searchSpan: 8,
            search: true,
            display: false,
          },
          {
            label:this.$t('commonContent.totalAmount'),
            prop: "approvalCode",
            width: 100,
            search: false,
            display: false,
          },
          {
            label: this.$t('commonContent.applicant'),
            prop: "createUserName",
            search: false,
            display: false,
          },
          {
            label: this.$t('commonContent.department'),
            prop: "createDeptName",
            search: false,
            display: false,
          },
          {
            label: this.$t('commonContent.dataSource'),
            prop: "source",
            search: false,
            display: false,
          },
        ],
      },
    };
  },
  components: {upload},
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
    view(row){
      this.$router.push(`/onBusinessTrip?businessId=${row.id}&taskId=${row.taskId}&type=haveDone&processIsFinished=${row.processIsFinished}&status=${row.status}`)
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
