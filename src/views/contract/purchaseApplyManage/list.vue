<template>
  <basic-container>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      :selection-show="true"
      :btnName="$t('purchaseApply.importMain')"
    >
      <template #menuForm>
        <Upload
          :url="purchaseDetailExportUrl"
          @handleRequest="handlePurchaseDetail"
          :size="size"
          :btnName="$t('purchaseApply.importDetail')"
          class="ml10 i-block"
        ></Upload>
        <Upload
          :url="purchaseSupplierExportUrl"
          :btnName="$t('purchaseApply.importSupplier')"
          @handleRequest="handleSubmit"
          :size="size"
          class="ml10 i-block"
        ></Upload>
        <Upload
          :url="purchaseTechEvalExportUrl"
          :btnName="$t('purchaseApply.importTechEval')"
          @handleRequest="handleSubmit"
          :size="size"
          class="ml10 i-block"
        ></Upload>
      </template>
      <template #operation="{row}">
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">
            {{ $t('commonContent.view') }}
          </el-button>
        </el-row>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import Upload from "@/components/upload";
export default {
  data() {
    return {
      purchaseDetailExportUrl:'/api/oa-portal/purchaseApply/importPurchaseDetail',
      purchaseSupplierExportUrl:'/api/oa-portal/purchaseApply/importPurchaseSupplier',
      purchaseTechEvalExportUrl:'/api/oa-portal/purchaseApply/importPurchaseTechEval',
      formData: {},
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/purchaseApply/importPurchaseApply",
        downloadBtn: {
          url: "/api/oa-portal/purchaseApply/exportPurchaseApply",
          params: {},
        },
        column: [
          {
            label: this.$t('bom.project.name'),
            prop: "titleName",
          },
          {
            label: "申请编号",
            prop: "applyNo",
          }
        ],

      },
      tableColumn: {
        dicUrl: "/api/oa-portal/purchaseApply/selectPage",
        column: [
          {
            label: this.$t('acceptApply.title'),
            prop: "titleName",
            width: 130
          },
          {
            label:this.$t('acceptApply.applicant'),
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
            label:this.$t('acceptApply.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('contract.currency'),
            prop: "applyDesc",
            width: 150
          },
          {
            label: this.$t('purchase.exchangeRate'),
            prop: "totalAmountOriginal",
            width: 150
          },
          {
            label: this.$t('purchase.totalAmountRmb'),
            prop: "totalAmountRmb",
            width: 150
          },
          {
            label: this.$t('purchase.singleSupplierReason'),
            prop: "singleSupplierReason",
            width: 150
          },
          {
            label: this.$t('purchaseCommissionDecision.purchaseType'),
            prop: "purchaseTypeName",
            width: 150
          },
          {
            label: this.$t('purchase.useDept'),
            prop: "useDeptName",
            width: 150
          },
          {
            label: this.$t('purchase.expectedPurchaseDate'),
            prop: "expectedPurchaseDate",
            width: 150
          },
          {
            label: this.$t('purchase.isEmergencyPurchase'),
            prop: "isEmergencyPurchaseName",
            width: 150
          },
          {
            label: this.$t('commonContent.dataSource'),//"数据来源"
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
        path: "/purchaseApplication",
        query: {
          businessId: row.id,
          // isEdit: false
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
