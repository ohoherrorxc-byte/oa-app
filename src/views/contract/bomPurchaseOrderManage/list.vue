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
          :url="bomPurchaseOrderDetailExportUrl"
          @handleRequest="handlePurchaseDetail"
          :size="size"
          :btnName="$t('purchaseApply.importDetail')"
          class="ml10 i-block"
        ></Upload>
      </template>
      <template #operation="{ row }">
        <el-row>
          <el-button
            @click="handleOpenDialog(row, 'detail')"
            type="text"
            icon="el-icon-view"
          >
            {{ $t("commonContent.view") }}</el-button
          >
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
      bomPurchaseOrderDetailExportUrl:
        "/api/oa-portal/bomPurchaseOrder/importBomPurchaseOrderDetail",
      formData: {},
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/bomPurchaseOrder/importBomPurchaseOrder",
        downloadBtn: {
          url: "/api/oa-portal/bomPurchaseOrder/exportBomPurchaseOrder",
          params: {},
        },
        column: [
          {
            label: this.$t("bom.project.name"),
            prop: "titleName",
          },
          {
            label: "申请编号",
            prop: "applyNo",
          },
          {
            label: "报关单",
            prop: "customsDeclarationNo",
          },
          {
            label: this.$t("purchaseContract.supplierName"),
            prop: "supplierName",
            type: "select",
            filterable: true,
            dicUrl: "/api/oa-portal/contractSupplier/list",
            props: {
              label: "supplierName",
              value: "supplierName",
            },
          },
          {
            label: "申请人",
            prop: "applyDeptName",
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/bomPurchaseOrder/selectPage",
        column: [
          {
            label: this.$t("acceptApply.title"),
            prop: "titleName",
            width: 130,
          },
          {
            label: this.$t("acceptApply.applicant"),
            prop: "applyPersonName",
          },
          {
            label: this.$t("acceptApply.applyDept"),
            prop: "applyDeptName",
          },
          {
            label: this.$t("acceptApply.applyDate"),
            prop: "applyDate",
          },
          {
            label: this.$t("acceptApply.applyNo"),
            prop: "applyNo",
          },
          {
            label: this.$t("bom.applyReason"),
            prop: "applyDesc",
            width: 150,
          },
          {
            label: "报关单",
            prop: "customsDeclarationNo",
            width: 150,
          },
          {
            label: "供应商名称",
            prop: "supplierName",
            width: 150,
          },
          {
            label: this.$t("contract.currency"),
            prop: "currency",
            width: 150,
          },
          {
            label: this.$t("purchase.exchangeRate"),
            prop: "exchangeRate",
          },
          {
            label: this.$t("bom.originalAmount"),
            prop: "totalAmountOriginal",
            width: 150,
          },
          {
            label: this.$t("purchase.totalAmountRmb"),
            prop: "totalAmountRmb",
            width: 150,
          },
          {
            label: this.$t("bom.relatedContract"),
            prop: "bomPurchaseContractName",
            width: 150,
          },
          {
            label: this.$t("bom.contractNo"),
            prop: "bomPurchaseContractNo",
            width: 150,
          },
          {
            label: this.$t("bom.contractType"),
            prop: "contractTypeName",
            width: 150,
          },
          {
            label: this.$t("commonContent.dataSource"),
            prop: "dateSourceTypeName",
          },
          {
            label: this.$t("commonContent.auditStatus"),
            prop: "statusName",
          },
          {
            label: this.$t("commonContent.operation"),
            slotName: "operation",
            fixed: "right",
          },
        ],
      },
    };
  },
  created() {},
  components: {
    Upload,
  },
  methods: {
    handleOpenDialog(row) {
      this.$router.push({
        path: "/bomPurchaseOrderApplication",
        query: {
          businessId: row.id,
          // isEdit: false,
          type: "haveDone",
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
