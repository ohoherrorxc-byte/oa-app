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
                  <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExport">{{$t('commonContent.export')}}</el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-download"
                    class="ml10"
                    @click="openApprovalCodeDialog('export')"
                  >导出付款表（提交大乘格式）</el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-download"
                    class="ml10"
                    @click="openApprovalCodeDialog('export2')"
                  >导出付款表（无合计格式）</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    icon="el-icon-refresh"
                    class="ml10"
                    @click="openApprovalCodeDialog('batchUpdate')"
                  >批量更新付款状态</el-button>
                </div>
              </template>
    </avue-crud>
    <el-dialog
      :title="approvalCodeDialogTitle"
      :visible.sync="approvalCodeDialogVisible"
      width="640px"
      append-to-body
      :close-on-click-modal="false"
    >
      <p class="dacheng-export-tip">请输入单号，多个单号可用空格、换行或逗号分隔</p>
      <el-input
        v-model="approvalCodeInput"
        type="textarea"
        :rows="10"
        placeholder="例如：LXFYZF-2026042436 BOMKJFK-2025090486"
      />
      <span slot="footer">
        <el-button @click="approvalCodeDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="approvalCodeDialogLoading"
          @click="handleApprovalCodeDialogConfirm"
        >{{ approvalCodeDialogConfirmText }}</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import PettyPayApi from "@/api/flowTable/pettyPay/index";
import { downBlobFile } from "@/util/util";
import upload from '@/components/upload'
export default {
  data() {
    return {
      activeName: "all",
      search: {realPayStatus: "未提交"},
      page: {
        pageSize: 10000,
        currentPage: 1,
        total: 0,
      },
      selectedRows: [],
      approvalCodeDialogVisible: false,
      approvalCodeDialogLoading: false,
      approvalCodeDialogMode: "export",
      approvalCodeInput: "",
      params:{},
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
        dialogClickModal: false,
        searchShowBtn: false,
        column: [
          {
            label: "单号",
            prop: "approvalCode",
            searchLabelWidth: 120,
            searchSpan: 8,
            search: true,
            display: false,
          },
          {
            label: "币种",
            prop: "currency",
            slot: true,
            search: false,
            display: false,
          },
          {
            label:"待付金额(含税)",
            prop: "amount",
            width: 100,
            search: false,
            display: false,
          },
          {
            label:"收款方名称",
            prop: "supplierName",
            search: true,
            display: false,
          },
          {
            label:"收款方银行",
            prop: "bankName",
            search: false,
            display: false,
          },
          {
            label: "收款方账号",
            prop: "bankAccount",
            search: false,
            display: false,
          },
          {
            label: "采购类型",
            prop: "paymentType",
            search: false,
            display: false,
          },
          {
             label: "开票日期",
             prop: "supplierInvoiceTime",
             search: false,
             display: false,
          },
          {
             label: "费用说明",
             prop: "applyReason",
             search: false,
             display: false,
          },
          {
           label: "付款方式",
           prop: "payType",
           width: 50,
           type: "select",
           search: true,
           display: true,
           dicData: [
                      {label:"对公付款",
                       value:"对公付款"
                      },
                      {label:"对私付款",
                       value:"对私付款"
                      },
                      ],
           },
          {
            label: "付款状态",
            prop: "realPayStatus",
            width: 50,
            type: "select",
            search: true,
            display: true,
            searchValue: "未提交",
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
  components: {
    upload
  },
  computed: {
    approvalCodeDialogTitle() {
      if (this.approvalCodeDialogMode === "batchUpdate") {
        return "批量更新付款状态";
      }
      if (this.approvalCodeDialogMode === "export2") {
        return "导出付款表（无合计格式）";
      }
      return "导出付款表（提交大乘格式）";
    },
    approvalCodeDialogConfirmText() {
      return this.approvalCodeDialogMode === "batchUpdate" ? "确认更新" : "导出";
    },
  },
  methods: {
    async onLoad(page, params = {realPayStatus: "未提交"}) {
      let obj = {
        size: page.pageSize,
        current: page.currentPage,
      };
      let postdata = { ...obj, ...params, ...this.query, ...this.form };
      this.loading = true;
      await PettyPayApi.listPayInfo(postdata).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.page.pageSize = data.total;
        this.data = data.records;
        this.page.currentPage = 1;
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
      this.$router.push(`/miscellaneousCost?businessId=${row.id}&taskId=${row.taskId}&type=haveDone&processIsFinished=${row.processIsFinished}&status=${row.status}`)
    },
    async handleExport() {
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
      let res = await PettyPayApi.allPayInfoExport(postdata);
      downBlobFile(res.data, "供应商付款情况表单");
    },
    openApprovalCodeDialog(mode) {
      this.approvalCodeDialogMode = mode;
      this.approvalCodeInput = "";
      this.approvalCodeDialogVisible = true;
    },
    parseApprovalCodeList(input) {
      if (!input || !input.trim()) {
        return [];
      }
      return input
        .split(/[\s,，;；\n\r]+/)
        .map((code) => code.trim())
        .filter(Boolean);
    },
    async handleApprovalCodeDialogConfirm() {
      const approvalCodeList = this.parseApprovalCodeList(this.approvalCodeInput);
      if (!approvalCodeList.length) {
        return this.$message.warning("请输入至少一个单号");
      }
      if (this.approvalCodeDialogMode === "batchUpdate") {
        await this.handleBatchUpdatePayStatus(approvalCodeList);
      } else if (this.approvalCodeDialogMode === "export2") {
        await this.handleDacheng2Export(approvalCodeList);
      } else {
        await this.handleDachengExport(approvalCodeList);
      }
    },
    async handleDachengExport(approvalCodeList) {
      try {
        this.approvalCodeDialogLoading = true;
        const res = await PettyPayApi.allPayInfoDachengExport({ approvalCodeList });
        downBlobFile(res.data, "付款表（大乘格式）");
        this.approvalCodeDialogVisible = false;
      } catch (err) {
        this.$message.error("导出失败");
      } finally {
        this.approvalCodeDialogLoading = false;
      }
    },
    async handleDacheng2Export(approvalCodeList) {
      try {
        this.approvalCodeDialogLoading = true;
        const res = await PettyPayApi.allPayInfoDacheng2Export({ approvalCodeList });
        downBlobFile(res.data, "付款表（无合计格式）");
        this.approvalCodeDialogVisible = false;
      } catch (err) {
        this.$message.error("导出失败");
      } finally {
        this.approvalCodeDialogLoading = false;
      }
    },
    async handleBatchUpdatePayStatus(approvalCodeList) {
      try {
        await this.$confirm(
          `确认更新 ${approvalCodeList.length} 条记录的实际付款状态？`,
          "提示",
          {
            type: "warning",
            confirmButtonText: "确认更新",
            cancelButtonText: "取消",
          }
        );
        this.approvalCodeDialogLoading = true;
        const res = await PettyPayApi.batchUpdatePayStatus({ approvalCodeList });
        if (res.data.code === 200 || res.data.code === 0) {
          this.$message.success("更新成功");
          this.approvalCodeDialogVisible = false;
          this.refreshChange();
        } else {
          this.$message.error(res.data.msg || res.data.message || "更新失败");
        }
      } catch (err) {
        if (err !== "cancel" && err !== "close") {
          this.$message.error("更新失败");
        }
      } finally {
        this.approvalCodeDialogLoading = false;
      }
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
              await Promise.all(ids.map(id => PettyPayApi.updatePettyActualPayStatus({ id })));

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

<style scoped>
.dacheng-export-tip {
  margin: 0 0 12px;
  color: #606266;
  font-size: 14px;
}
</style>
