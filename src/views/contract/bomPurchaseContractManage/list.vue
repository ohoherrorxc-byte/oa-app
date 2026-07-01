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
          :url="bomPurchaseContractDetailExportUrl"
          @handleRequest="handlePurchaseDetail"
          :size="size"
          :btnName="$t('purchaseApply.importDetail')"
          class="ml10 i-block"
        ></Upload>
      </template>
      <template #operation="{row}">
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">{{ $t('commonContent.view') }}</el-button>
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
      bomPurchaseContractDetailExportUrl:'/api/oa-portal/bomPurchaseContract/importBomPurchaseContractDetail',
      formData: {},
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/bomPurchaseContract/importBomPurchaseContract",
        downloadBtn: {
          url: "/api/oa-portal/bomPurchaseContract/bomContractExport",
          params: {},
        },
        column: [
          {
            label:  this.$t('bom.project.name'),
            prop: "titleName",
          },
          {
            label: this.$t('purchaseContract.supplierName'),
            prop: "supplierName",
            type: 'select',
            filterable:true,
            dicUrl: "/api/oa-portal/contractSupplier/list",
            props: {
              label: "supplierName",
              value: "supplierName",
            }
          },
          {
             label: "申请编号",
             prop: "applyNo",
          },
          {
             label: "金额有限制",
             prop: "contractHaveAmountLimit",
             width: 50,
             type: "select",
             search: true,
             display: true,
             dicData: [
                     {label:"是",
                      value:"是"
                     },
                     {label:"否",
                      value:"否"}
                      ],
          },
        ],

      },
      tableColumn: {
        dicUrl: "/api/oa-portal/bomPurchaseContract/selectPage",

        column: [
          {
            label:  this.$t('acceptApply.title'),
            prop: "titleName",
            width: 130
          },
          {
            label: this.$t('acceptApply.applicant'),
            prop: "applyPersonName",
          },
          {
            label:  this.$t('acceptApply.applyDept'),
            prop: "applyDeptName",
          },
          {
            label:this.$t('acceptApply.applyDate'),
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
            label: this.$t('invoice.currency'),
            prop: "currency",
            width: 150
          },
          {
            label: this.$t('saleContract.startDate'),
            prop: "beginTime"
          },
          {
            label:this.$t('saleContract.endDate'),
            prop: "endTime"
          },
          {
            label: this.$t('invoice.contractType'),
            prop: "contractTypeName"
          },
          {
            label:  this.$t('saleContract.contractCategory'),
            prop: "purchaseContractCategoryName",
            width: 150
          },
          {
            label:  "合同金额有上限",
            prop: "contractHaveAmountLimit",
            width: 150
          },
          {
            label:  "合同上限金额",
            prop: "contractLimitAmount",
            width: 150
          },
          {
            label:  "合同订单总金额",
            prop: "contractOrderTotalAmount",
            width: 150
          },
          {
            label:  this.$t('purchaseContract.supplierName'),
            prop: "supplierName",
            width: 150
          },
          {
            label:this.$t('purchaseContract.paymentMethod'),
            prop: "payMethodName"
          },
          {
            label: this.$t('purchaseContract.performancePlace'),
            prop: "contractPerformancePlace"
          },
          {
            label:this.$t('purchaseContract.purchaseCommitteeResolution'),
            prop: "purchaseCommissionDecisionName",
            width: 150
          },
          {
            label: this.$t('commonContent.remarks'),
            prop: "remark",
            width: 150
          },
          {
            label:this.$t('commonContent.dataSource'),
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
        path: "/bomPurchaseContractApplication",
        query: {
          businessId: row.id,
          type:'haveDone'
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
