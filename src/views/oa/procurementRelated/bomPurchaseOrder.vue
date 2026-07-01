<template>
  <basic-container>
    <div style="color: red; font-weight: bold; margin-bottom: 10px">
      此列表数据由“BOM框架订单”一键生成“验收申请”，以草稿形式存在“我的流程”，提交前请核对数据正确性。
    </div>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      :selection-show="true"
      :btnName="$t('purchaseApply.importMain')"
      :canShowList="canShowList"
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
          <el-button
            v-if="row.acceptStatusName === '未提交验收'"
            @click="clickAccept(row, 'detail')"
            type="text"
            icon="el-icon-view"
          >
            {{ $t("commonContent.OneClickAcceptance") }}
          </el-button>
        </el-row>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import Upload from "@/components/upload";
import procurementRelatedApi from "@/api/procurementRelated/index";
import { mapGetters } from "vuex";
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
            label: "标题名称",
            prop: "titleName",
          },
          {
            label: "申请事由",
            prop: "applyDesc",
          },
          {
            label: this.$t("bom.acceptStatusSubmit"),
            prop: "acceptStatus",
            type: "select",
            dicData: [
              {
                label: "未提交验收",
                value: 0,
              },
              {
                label: "已提交验收",
                value: 1,
              },
            ],
          },
          // {
          //   type: "select",
          //   dicData: [
          //     {
          //       label: "未验收",
          //       value: 0,
          //     },
          //     {
          //       label: "已验收",
          //       value: 1,
          //     },
          //   ],
          // },
          {
            label: "BOM合同编号",
            prop: "bomPurchaseContractNo",
          },
          {
            label: "BOM合同名称",
            prop: "bomPurchaseContractName",
          },
          {
            label: "BOM订单编号",
            prop: "bomPurchaseOrderNo",
          },
          {
            label: "验收编号",
            prop: "acceptNo",
          },
          {
            label: "报关单",
            prop: "customsDeclarationNo",
          },
          {
            label: "申请人",
            prop: "applyPersonName",
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
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/bomPurchaseOrder/selectPageWithStatus",
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
          // {
          //   label: this.$t("acceptApply.applyNo"),
          //   prop: "applyNo",
          // },
          {
            label: "BOM订单编号",
            prop: "applyNo",
          },
          {
            label: "验收编号",
            prop: "acceptNo",
            click: this.viewAcceptDetail,
          },
          {
            label: this.$t("bom.acceptStatus"),
            prop: "acceptStatusName",
            width: 150,
          },
          {
            label: "验收完成状态",
            prop: "acceptCompletedStatusName",
            width: 100,
          },
          {
            label: "报关单",
            prop: "customsDeclarationNo",
          },
          {
            label: this.$t("bom.applyReason"),
            prop: "applyDesc",
            width: 150,
          },
          {
            label: this.$t("bom.pay.supplierName"),
            prop: "contractSupplierName",
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
            click: this.viewContractNoDetail,
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
            width: 150,
          },
        ],
      },
    };
  },
  created() {},
  components: {
    Upload,
  },
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
    viewAcceptDetail(row) {
      this.$router.push(`/acceptApply?businessId=${row.acceptId}`);
    },
    viewContractNoDetail(row) {
      this.$router.push(
        `/bomPurchaseContractApplication?applyNo=${row.bomPurchaseContractNo}`
      );
    },
    async clickAccept(row) {
      let res = await procurementRelatedApi.saveByBomOrder({ id: row.id });
      if (res.data.code === 200) {
        this.$message.success("验收单已生成，请在我的流程查看");
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
