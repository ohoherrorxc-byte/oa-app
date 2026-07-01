<template>
  <basic-container>
    <TableForm ref="TableForm" :tableColumn="tableColumn" :searchForm="searchForm" :selection-show="true"
      :btnName="$t('purchaseApply.importMain')">
      <template #menuForm>
        <Upload :url="purchaseContractDetailExportUrl" @handleRequest="handlePurchaseDetail" :size="size"
          :btnName="$t('purchaseApply.importDetail')" class="ml10 i-block"></Upload>
      </template>
      <template #operation="{ row }">
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view"> {{ $t('commonContent.view')
          }}</el-button>
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
      purchaseContractDetailExportUrl: '/api/oa-portal/purchaseContract/importPurchaseContractDetail',
      formData: {},
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/purchaseContract/importPurchaseContract",
        downloadBtn: {
          url: "/api/oa-portal/purchaseContract/exportPurchaseContract",
          params: {},
        },
        column: [
          {
            label: this.$t('bom.project.name'),
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
          }
        ],

      },
      tableColumn: {
        dicUrl: "/api/oa-portal/purchaseContract/selectPage",
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
            label: this.$t('acceptApply.applyDate'),
            prop: "applyDate",
          },
          {
            label: this.$t('acceptApply.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('acceptApply.applyDesc'),
            prop: "applyDesc",
            width: 150
          },
          {
            label: this.$t('purchaseContract.currency'),
            prop: "currency",
            width: 150
          },
          {
            label: this.$t('purchaseContract.exchangeRate'),
            prop: "exchangeRate",
            width: 150
          },
          {
            label: this.$t('purchaseContract.amountOriginal'),
            prop: "totalAmountOriginal",
            width: 150
          },
          {
            label: this.$t('purchaseContract.amountRmb'),
            prop: "totalAmountRmb",
            width: 150
          },
          {
            label: this.$t('purchaseContract.applyNo'),
            prop: "purchaseApplyNo",
            width: 150
          },
          {
            label: this.$t('purchaseContract.applyForm'),
            prop: "purchaseApplyName",
            width: 150
          },
          {
            label: this.$t('purchaseContract.contractType'),
            prop: "contractTypeName",
            width: 150
          },
          {
            label: this.$t('purchaseContract.contractCategory'),
            prop: "purchaseContractCategoryName",
            width: 150
          },
          {
            label: this.$t('purchaseContract.supplierName'),
            prop: "supplierName",
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
            fixed: 'right'
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
        path: "/purchaseContractApplication",
        query: {
          businessId: row.id,
          // isEdit: false,
          type: 'haveDone'
        },
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
