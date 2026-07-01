<template>
  <basic-container>
    <div style="color: red; font-weight: bold; margin-bottom: 10px">
      此列表数据由“验收申请”一键生成“BOM框架订单付款申请/一般通用采购付款申请”，以草稿形式存在“我的流程”，提交前请核对数据正确性。
    </div>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      :selection-show="true"
      :canShowList="canShowList"
      :btnName="$t('purchaseApply.importMain')"
      @selection-change="onSelectionChange"
    >
      <template #menuForm>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-download"
          @click="handleExport"
        >
          {{ $t("commonContent.export") }}
        </el-button>
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
          <el-button
            v-if="row.payStatusName === '未提交付款单'"
            @click="onClickPay(row, 'detail')"
            type="text"
            icon="el-icon-position"
            >{{ $t("commonContent.OneClickPayment") }}</el-button
          >
        </el-row>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import Upload from "@/components/upload";
import { downBlobFile } from "@/util/util";
import procurementRelatedApi from "@/api/procurementRelated/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      acceptApplyDetailExportUrl:
        "/api/oa-portal/acceptApply/importAcceptApplyDetail",
      formData: {},
      tableData: [],
      searchForm: {
        column: [
          {
            label: "验收-标题",
            prop: "titleName",
          },
          {
            // label: this.$t("bom.payStatus"),
            label: "付款提交状态",
            prop: "payStatus",
            type: "select",
            dicData: [
              {
                label: "未提交",
                value: 0,
              },
              {
                label: "已提交",
                value: 1,
              },
            ],
          },
          {
            label: "验收申请单号",
            prop: "applyNo",
          },

          {
            label: "一般采购合同编号",
            prop: "purchaseContractNo",
          },
          {
            label: "一般采购申请编号",
            prop: "purchaseApplyNo",
          },
          {
            label: "BOM订单编号",
            prop: "bomPurchaseOrderNo",
          },
          {
            label: "BOM合同编号",
            prop: "bomPurchaseContractNo",
          },
            {
            label: "BOM合同名称",
            prop: "bomPurchaseContractName",
          },
          {
            label: "BOM付款单编号",
            prop: "bomPurchasePayNo",
          },
          {
            label: this.$t("bom.pay.supplierName"),
            prop: "supplierNo",
            type: "select",
            filterable: true,
            dicUrl: "/api/oa-portal/contractSupplier/list",
            props: {
              label: "supplierName",
              value: "supplierNo",
            },
          },
          {
            label: "申请人",
            prop: "applyPersonName",
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/acceptApply/selectPageWithPayStatus",
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
            // label: this.$t("acceptApply.applyNo"),
            label: "验收申请单号",
            prop: "applyNo",
          },
          {
            label: "BOM订单",
            prop: "bomPurchaseOrderNo",
            width: 150,
          },
          {
            label: "BOM付款编号",
            prop: "bomPurchasePayNo",
            width: 150,
            click:this.viewPayDetail
          },
          {
            label: "提交状态",
            prop: "payStatusName",
          },
          {
            label: "付款状态",
            prop: "payStatusActName",
          },
          {
            label: this.$t("bom.applyReason"),
            prop: "applyDesc",
            width: 150,
          },
          {
            label: this.$t("acceptApply.acceptType"),
            prop: "acceptTypeName",
            width: 150,
          },
          {
            label: this.$t("bom.pay.supplierName"),
            prop: "supplierName",
            width: 150,
            formatter: (val) => {
              return val.acceptCategory === 1
                ? val.supplierName
                : val.bomSupplierName;
            },
          },
          {
            label: this.$t("acceptApply.acceptCategory"),
            prop: "acceptCategoryName",
            width: 150,
          },
          {
            label: this.$t("acceptApply.relatedProject"),
            prop: "projectName",
            width: 150,
          },
          {
            label: this.$t("acceptApply.projectNo"),
            prop: "projectNo",
            width: 150,
          },
          {
            label: this.$t("acceptApply.acceptPerson"),
            prop: "acceptPersonName",
            width: 150,
          },
          {
            label: this.$t("acceptApply.purchaseApplyNo"),
            prop: "purchaseApplyName",
            width: 150,
          },
          {
            label: this.$t("acceptApply.purchaseRequisitionNo"),
            prop: "purchaseApplyNo",
            width: 150,
          },
          {
            label: this.$t("acceptApply.purchaseContractNo"),
            prop: "purchaseContractName",
            width: 150,
          },
          {
            label: this.$t("acceptApply.bomPurchaseContractNo"),
            prop: "bomPurchaseContractName",
            width: 150,
            click:this.viewContractNoDetail
          },
           {
            label: this.$t("acceptApply.bomPurchaseContractNo"),
            prop: "bomPurchaseContractNo",
            width: 150,
            click:this.viewContractNoDetail
          },
          {
            label: this.$t("acceptApply.bomPurchaseOrderNo"),
            prop: "bomPurchaseOrderName",
            width: 150,
          },
          {
            label: this.$t("acceptApply.currency"),
            prop: "currency",
            width: 150,
          },
          {
            label: this.$t("acceptApply.exchangeRate"),
            prop: "exchangeRate",
            width: 150,
          },
          {
            label: this.$t("acceptApply.contractNo"),
            prop: "purchaseContractNo",
            width: 150,
          },
          {
            label: this.$t("acceptApply.contractTotalAmountOriginal"),
            prop: "contractTotalAmountOriginal",
            width: 150,
          },
          {
            label: this.$t("acceptApply.contractTotalAmountRmb"),
            prop: "contractTotalAmountRmb",
            width: 150,
          },
          {
            label: this.$t("acceptApply.totalAmountOriginal"),
            prop: "totalAmountOriginal",
            width: 150,
          },
          {
            label: this.$t("acceptApply.totalAmountRmb"),
            prop: "totalAmountRmb",
            width: 150,
          },
          {
            label: this.$t("acceptApply.acceptAmountOriginal"),
            prop: "acceptAmountOriginal",
            width: 150,
          },
          {
            label: this.$t("acceptApply.acceptAmountRmb"),
            prop: "acceptAmountRmb",
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
            width: 200,
          },
        ],
      },
    };
  },
  created() {},
  computed: {
    ...mapGetters(["userInfo", "isMobile", "tagList"]),
    canShowList: function () {
      if (
        this.userInfo.role_id === "1674026161917251586" &&
        this.userInfo.account !== "liyazhao"
      ) {
        return false;
      }
      return true;
    },
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
        },
      });
    },
    viewPayDetail(row){
      this.$router.push(`/bomPurchaseContractPayApplication?businessId=${row.bomPayId}`)
    },
      viewContractNoDetail(row){
       this.$router.push(`/bomPurchaseContractApplication?applyNo=${row.bomPurchaseContractNo}`)
    },
    async onClickPay(row) {
      let res = await procurementRelatedApi.savePayByAcceptApply({
        id: row.id,
      });
      if (res.data.code === 200) {
        this.$message.success("付款单已生成，请在我的流程查看");
      }
    },
    async handleExport() {
      let res = await procurementRelatedApi.exportAcceptApplyWithPayStatus();
      downBlobFile(res.data, "验收申请数据");
    },
  },
};
</script>

<style scoped lang="scss"></style>
