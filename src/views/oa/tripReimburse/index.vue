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
      @selection-change="onSelectionChange"
    >
      <template slot="menuLeft">
        <div class="btn">
          <upload @handleRequest="handleRequest" :showTip="false" class="mx10" url="/api/oa-portal/flowTable/importTripReimburse"></upload>
          <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExport">{{$t('commonContent.export')}}</el-button>
          <el-button
                size="mini"
                type="warning"
                icon="el-icon-refresh"
                :disabled="!selectedRows.length"
                @click="confirmUpdatePayStatusForSelection"
              >更新实际付款状态</el-button>
        </div>
      </template>
      <template slot-scope="{type,size,row,index}" slot="menu">
        <el-button icon="el-icon-view" :size="size" :type="type" @click="view(row, index)">{{ $t('commonContent.viewDetails') }}</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import OriginalStatementApi from "@/api/flowTable/tripReimburse/index";
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
      selectedRows: [],
      data: [],
      form: {},
      params: {},
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
            label: this.$t('commonContent.totalAmount'),
            prop: "totalAmount",
            slot: true,
            search: false,
            display: false,
          },
          {
            label: this.$t('commonContent.approvalCode'),
            prop: "approvalCode",
            width: 100,
            search: true,
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
          {
            label: "实际支付状态",
            prop: "realPayStatus",
            width: 50,
            type: "select",
            search: true,
            display: true,
            dicData: [
            {label:"未提交",
             value:"未提交"
            },
            {label:"已提交（未付款）",
             value:"已提交（未付款）"
            },
            {label:"已付款",
             value:"已付款"
            }],
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
      this.$router.push(`/travelReimbursement?businessId=${row.id}&taskId=${row.taskId}&type=haveDone&processIsFinished=${row.processIsFinished}&status=${row.status}`)
    },
    async handleExport(params) {
      // 构建与 onLoad 一致的请求参数
            let obj = {
              size: this.page.pageSize,
              current: this.page.currentPage,
            };
            let postdata = {
              ...obj,
              ...this.params,
              ...this.query,
              ...this.form
            };
      let res = await OriginalStatementApi.originalStatementExport(postdata);
      console.log(res);
      downBlobFile(res.data, "差旅报销导出");
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
    onSelectionChange(list) {
        this.selectedRows = list || [];
      },

      async confirmUpdatePayStatusForSelection() {
        if (!this.selectedRows.length) {
          return this.$message.warning('请先选择要更新的记录');
        }
        try {
          await this.$confirm(`确认更新选中 ${this.selectedRows.length} 条记录的实际付款状态？`, '提示', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          });

          this.loading = true;
          const ids = this.selectedRows.map(row => row.id);

          // 若后端已有批量接口，改为：
          //await OriginalStatementApi.updateTripActualPayStatus({ ids });

          // 默认使用单条接口并发执行
          await Promise.all(ids.map(id => OriginalStatementApi.updateTripActualPayStatus({ id })));

          this.$message.success('更新成功');
          this.refreshChange && this.refreshChange();
        } catch (err) {
          if (err !== 'cancel' && err !== 'close') {
            this.$message.error('更新失败');
          }
        } finally {
          this.loading = false;
        }
      }
  },
};
</script>
