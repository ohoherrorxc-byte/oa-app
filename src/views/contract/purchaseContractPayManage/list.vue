<template>
  <basic-container>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      :selection-show="true"
      :btnName="$t('purchaseApply.importMain')"
       @selectionChange="onSelectionChange"
    >
      <template #menuForm>
        <Upload
          :url="purchaseContractPayDetailExportUrl"
          @handleRequest="handlePurchaseDetail"
          :size="size"
          :btnName="$t('purchaseApply.importDetail')"
          class="ml10 i-block"
        ></Upload>
        <el-button
                  size="mini"
                  type="warning"
                  con="el-icon-refresh"
                  :disabled="!selectedRows.length"
                  @click="confirmUpdatePayStatusForSelection"
        >更新实际付款状态</el-button>
      </template>
      <template #operation="{row}" >
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">{{ $t('commonContent.view') }}</el-button>
        </el-row>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import PurchaseContractPayApplyApi from "@/api/purchaseContractPayApply/index";
import Upload from "@/components/upload";
export default {
  data() {
    return {
      purchaseContractPayDetailExportUrl:'/api/oa-portal/purchaseContractPay/importPurchaseContractPayDetail',
      formData: {},
      tableData: [],
      selectedRows: [],
      searchForm: {
        downloadBtn: {
          url: "/api/oa-portal/purchaseContractPay/exportPurchaseContractPay",
          params: {},
        },
        uploadBtn: "/api/oa-portal/purchaseContractPay/importPurchaseContractPay",
        column: [
          {
            label: this.$t('bom.project.name'),
            prop: "titleName",
          },
          {
            label: "申请编号",
            prop: "applyNo",
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
      tableColumn: {
        dicUrl: "/api/oa-portal/purchaseContractPay/selectPage",
        column: [
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
          {
            label:this.$t('acceptApply.title'),
            prop: "titleName",
            width: 130
          },
          {
            label: this.$t('acceptApply.applicant'),
            prop: "applyPersonName",
          },
          {
            label: this.$t('acceptApply.applyDept'),
            prop: "applyDeptName",
          },
          {
            label: this.$t('acceptApply.applyDate'),
            prop: "applyDate",
          },
          {
            label:  this.$t('acceptApply.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('bom.applyReason'),
            prop: "applyDesc",
            width: 150
          },
          {
            label: this.$t('bom.apply.amount'),
            prop: "totalAmountOriginal",
            width: 150
          },
          {
            label:  this.$t('bom.apply.amountRmb'),
            prop: "totalAmountRmb",
            width: 150
          },
          {
            label: this.$t('contractProject.projectName'),
            prop: "projectName",
            width: 150
          },
          {
            label:  this.$t('contractProject.projectNo'),
            prop: "projectNo",
            width: 150
          },
          {
            label:  this.$t('invoice.relatedContract'),
            prop: "purchaseContractName",
            width: 150
          },
          {
            label:  this.$t('invoice.contractNo'),
            prop: "purchaseContractNo",
            width: 150
          },
          {
            label:  this.$t('invoice.currency'),
            prop: "currency",
            width: 150
          },
          {
            label: this.$t('saleContract.exchangeRate'),
            prop: "exchangeRate",
            width: 150
          },
          {
            label: this.$t('contract.relatedAcceptance'),
            prop: "acceptApplyName",
            width: 150
          },
          {
            label: this.$t('bom.pay.AcceptanceNumber'),
            prop: "acceptApplyNo",
            width: 150
          },
          {
            label: this.$t('bom.pay.supplierName'),
            prop: "supplierName",
            width: 150
          },
          {
            label: this.$t('contract.isFinalPayment'),
            prop: "isBalancePayName",
            width: 150
          },
          {
            label: this.$t('commonContent.dataSource'),
            prop: "dateSourceTypeName",
          },
          {
            label: this.$t('commonContent.auditStatus'),
            prop: "statusName",
          },
          {
            label: this.$t('commonContent.operation'),
            slotName: "operation",
            fixed:'right'
          },
        ],
      },
    };
  },
  created() {
  },
  components: {
    Upload,
  },
  methods: {
    handleOpenDialog(row) {
      this.$router.push({
        path: "/purchaseContractPayApplication",
        query: {
          businessId: row.id,
          // isEdit: false
        },
      });
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
                      await Promise.all(ids.map(id => PurchaseContractPayApplyApi.updatePurchaseActualPayStatus({ id })));

                      this.$message.success('更新成功');
                      this.refreshChange && this.refreshChange();
                    } catch (err) {
                      if (err !== 'cancel' && err !== 'close') {
                        this.$message.error('更新失败');
                      }
                    } finally {
                      this.loading = false;
                    }
        },
  },
};
</script>

<style scoped lang="scss">
</style>
