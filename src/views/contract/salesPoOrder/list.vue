<template>
  <basic-container>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      @handleSubmit="handleSubmit"
      @searchForm="searchFormFn">
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
        uploadBtn: "/api/oa-portal/salesPoOrderNew/importSalesPoOrder",
        column: [
          {
            label: this.$t('commonContent.applicant'),
            prop: "applyPerson",
          },
          {
            label: this.$t('commonContent.applyDate'),
            prop: "applyDate",
            propRange: ["applyStartDate", "applyEndDate"],
            type: "monthrange",
            format: "yyyy-MM",
            valueFormat: "yyyy-MM",
          },
          {
            label: this.$t('commonContent.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('salesPoOrder.salesType'),
            prop: "salesType",
            type: "select",
            dicData: [
              {
                label: "License",
                value: "License",
              },
              {
                label: "NRE",
                value: "NRE",
              },
              {
                label: "硬件",
                value: "硬件",
              },
              {
                label: "孵化",
                value: "孵化",
              },
            ],
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/salesPoOrderNew/selectPage",

        column: [
          {
            label: this.$t('commonContent.applicant'),
            prop: "applyPerson",
          },
          {
            label: this.$t('commonContent.applyDept'),
            prop: "applyDept",
          },
          {
            label: this.$t('commonContent.applyDate'),
            prop: "applyDate",
          },
          {
            label: this.$t('commonContent.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('salesPoOrder.orderDesc'),
            prop: "applyDesc",
          },
          {
            label: this.$t('salesPoOrder.salesType'),
            prop: "salesType",
          },
          {
            label: this.$t('salesPoOrder.salesContractName'),
            prop: "salesContractName",
          },
          {
            label: this.$t('salesPoOrder.salesContractNo'),
            prop: "salesContractNo",
          },
          {
            label: this.$t('salesPoOrder.currency'),
            prop: "salesContractAmount",
          },
          {
            label: this.$t('salesPoOrder.taxRate'),
            prop: "taxRate",
          },
          {
            label: this.$t('salesPoOrder.salesPoOrderAmount'),
            prop: "salesPoOrderAmount",
          },
          {
            label: this.$t('salesPoOrder.custName'),
            prop: "custName",
          },
          {
            label: this.$t('salesPoOrder.projectName'),
            prop: "projectName",
          },
          {
            label: this.$t('salesPoOrder.flowName'),
            prop: "flowName",
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
      getTotal().then((res) => {
        this.formData = res.data.data;
      });
    },

  },
};
</script>

<style scoped lang="scss">
</style>
