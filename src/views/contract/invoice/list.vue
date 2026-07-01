<template>
  <basic-container>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      @handleSubmit="handleSubmit"
      @searchForm="searchFormFn"
      :height="400"
    >
      <template #other>
        <el-row class="mb20">
          <el-col
            :span="24"
          >{{ $t('invoice.total') }}：RMB ：{{$formatAmt(formData.totalAmount) }}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; USD ：{{$formatAmt(formData.totalAmountUsd) }}</el-col>
          <el-col
            :span="12"
          >license：RMB {{$formatAmt(formData.licenseTotalAmount) }}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; USD ：{{$formatAmt(formData.licenseTotalAmountUsd )}}</el-col>
          <el-col
            :span="12"
          >{{ $t('invoice.hardware') }}：RMB {{$formatAmt(formData.hardwareTotalAmount) }}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; USD ：{{$formatAmt(formData.hardwareTotalAmountUsd) }}</el-col>
          <el-col
            :span="12"
          >NRE：RMB {{$formatAmt(formData.nreTotalAmount )}}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; USD ：{{$formatAmt(formData.nreTotalAmountUsd )}}</el-col>
          <el-col
            :span="12"
          >{{ $t('invoice.incubation') }}：：RMB {{$formatAmt(formData.incubateTotalAmount) }}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; USD ：{{$formatAmt(formData.incubateTotalAmountUsd) }}</el-col>
        </el-row>
      </template>
      <template #operation="{row}">
        <el-row>
           <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">查看</el-button>
        </el-row>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import constData from "@/config/constData";
import { getTotal } from "@/api/contract/invoice";
export default {
  data() {
    return {
      formData: {},
      collectionStatus: constData.constData,

      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/invoice/importInvoice",
        downloadBtn: {
          url: "/api/oa-portal/invoice/exportInvoice",
          params: {},
        },
        column: [
          {
            label: this.$t("invoiceL.title"),
            prop: "invoiceName",
          },
          {
            label: this.$t("invoiceL.applyPerson"),
            type: "select",
            prop: "applyPerson",
            filterable:true,
            dicUrl: `/api/oa-user/user-list?tenantId=${
              JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
            }`,
            props: {
              label: "realName",
              value: "id",
            },
          },
          {
            label: this.$t("invoiceL.applyDept"),
            prop: "applyDept",
            type: "select",
            filterable:true,
            dicUrl: `/api/oa-system/dept/tree?tenantId=${
              JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
            }`,
            props: {
              label: "title",
              value: "id",
            },
          },
          {
            label: this.$t("invoiceL.applyDate"),
            prop: "applyDate",
            propRange: ["applyStartDate", "applyEndDate"],
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
          },
          {
            label: this.$t("invoiceL.applyNo"),
            prop: "invoiceNo",
          },
          {
            label: this.$t("invoiceL.invoiceStatus"),
            prop: "status",
            type: "select",
            dicData: [
              {
                label: "审核完成",
                value: 1,
              },
              {
                label: "待申请",
                value: 2,
              },
              {
                label: "审核中",
                value: 3,
              },
              {
                label: "审核拒绝",
                value: 4,
              },
            ],
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/invoice/selectPage",

        column: [
          {
            label: this.$t("invoiceL.title"),
            prop: "titleName",
          },
          {
            label: this.$t("invoiceL.applyPerson"),
            prop: "applyPersonName",
          },
          {
            label: this.$t("invoiceL.applyDept"),
            prop: "applyDeptName",
          },
          {
              label: this.$t("invoiceL.applyDate"),
            prop: "applyDate",
          },
          {
            label: this.$t("invoiceL.applyNo"),
            prop: "invoiceNo",
          },
          {
            label: this.$t("invoiceL.applyDesc"),
            prop: "applyDesc",
          },
          {
            label: this.$t("invoiceL.salesType"),
            prop: "salesType",
          },
          {
            label: this.$t("invoiceL.salesContract"),
            prop: "salesContractName",
          },
          {
            label: this.$t("invoiceL.salesContractNo"),
            prop: "salesContractNo",
          },
          {
            label: this.$t("invoiceL.salesOrder"),
            prop: "salesOrderName",
          },
          {
            label: this.$t("invoiceL.salesOrderNo"),
            prop: "salesOrderNo",
          },
          {
            label: this.$t("invoiceL.invoiceType"),
            prop: "invoiceTypeName",
          },
          {
            label: this.$t("invoiceL.contractType"),
            prop: "salesContractTypeName",
          },
          {
            label: this.$t("invoiceL.projectName"),
            prop: "projectName",
          },
          {
            label: this.$t("invoiceL.currency"),
            prop: "currency",
          },
          {
            label: this.$t("invoiceL.invoicingAmount"),
            prop: "invoicingAmount",
            width:140,
            formatter:(val)=>{
              return this.$formatAmt(val.invoicingAmount)
            }
          },
          {
            label: this.$t("invoiceL.subscribeTotalAmount"),
            prop: "subscribeTotalAmount",
            formatter:(val)=>{
              return this.$formatAmt(val.subscribeTotalAmount)
            }
          },
          {
            label: this.$t("invoiceL.isSubscribe"),
            prop: "isSubscribe",
          },
          {
            label: this.$t("invoiceL.invoiceStatus"),
            prop: "statusName",
          },
          {
            label: "操作",
            slotName: "operation",
            fixed:'right'
          },
        ],
      },
    };
  },
  created() {
    // this.getTotalAmount();
  },
  methods: {
    searchFormFn(form) {
      console.log(form);
      getTotal(form).then((res) => {
        this.formData = res.data.data;
      });
    },

    handleOpenDialog(row) {
      this.$router.push({
        path: "/invoiceApplication",
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
