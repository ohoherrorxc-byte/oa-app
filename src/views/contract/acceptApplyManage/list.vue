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
          :url="acceptApplyDetailExportUrl"
          @handleRequest="handlePurchaseDetail"
          :size="size"
          :btnName="$t('purchaseApply.importDetail')"
          class="ml10 i-block"
        ></Upload>
      </template>
      <template #operation="{row}" >
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view"> {{ $t('commonContent.view') }}</el-button>
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
      acceptApplyDetailExportUrl:'/api/oa-portal/acceptApply/importAcceptApplyDetail',
      formData: {},
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/acceptApply/importAcceptApply",
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
        dicUrl: "/api/oa-portal/acceptApply/selectPage",
        column: [
          {
            label: this.$t('bom.project.name'),
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
            label:  this.$t('acceptApply.applyDate'),
            prop: "applyDate",
          },
          {
            label:this.$t('acceptApply.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('bom.applyReason'),
            prop: "applyDesc",
            width: 150
          },
          {
            label: this.$t('acceptApply.acceptType'),
            prop: "acceptTypeName",
            width: 150
          },
          {
            label:  this.$t('acceptApply.acceptCategory'),
            prop: "acceptCategoryName",
            width: 150
          },
          {
            label: this.$t('acceptApply.relatedProject'),
            prop: "projectName",
            width: 150
          },
          {
            label: this.$t('acceptApply.projectNo'),
            prop: "projectNo",
            width: 150
          },
          {
            label: this.$t('acceptApply.acceptPerson'),
            prop: "acceptPersonName",
            width: 150
          },
          {
            label: this.$t('acceptApply.purchaseApplyNo'),
            prop: "purchaseApplyName",
            width: 150
          },
          {
            label: this.$t('acceptApply.purchaseRequisitionNo'),
            prop: "purchaseApplyNo",
            width: 150
          },
          {
            label:this.$t('acceptApply.purchaseContractNo'),
            prop: "purchaseContractName",
            width: 150
          },
          {
            label: this.$t('acceptApply.bomPurchaseContractNo'),
            prop: "bomPurchaseContractName",
            width: 150
          },
          {
            label:  this.$t('acceptApply.bomPurchaseOrderNo'),
            prop: "bomPurchaseOrderName",
            width: 150
          },
          {
            label:  this.$t('acceptApply.currency'),
            prop: "currency",
            width: 150
          },
          {
            label:this.$t('acceptApply.exchangeRate'),
            prop: "exchangeRate",
            width: 150
          },
          {
            label: this.$t('acceptApply.contractNo'),
            prop: "purchaseContractNo",
            width: 150
          },
          {
            label: this.$t('acceptApply.contractTotalAmountOriginal'),
            prop: "contractTotalAmountOriginal",
            width: 150
          },
          {
            label: this.$t('acceptApply.contractTotalAmountRmb'),
            prop: "contractTotalAmountRmb",
            width: 150
          },
          {
            label: this.$t('acceptApply.totalAmountOriginal'),
            prop: "totalAmountOriginal",
            width: 150
          },
          {
            label: this.$t('acceptApply.totalAmountRmb'),
            prop: "totalAmountRmb",
            width: 150
          },
          {
            label:  this.$t('acceptApply.acceptAmountOriginal'),
            prop: "acceptAmountOriginal",
            width: 150
          },
          {
            label:  this.$t('acceptApply.acceptAmountRmb'),
            prop: "acceptAmountRmb",
            width: 150
          },
          {
            label:  this.$t('commonContent.dataSource'),
            prop: "dateSourceTypeName",
          },
          {
            label:this.$t('commonContent.auditStatus'),
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
        path: "/acceptApply",
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
