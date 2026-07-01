
<template>
  <el-dialog title="每月结算汇率" append-to-body :visible="true" width="50%" @close="$emit('closeFn')">
    <TableForm :tableColumn="tableColumn" :selectionShow="false" :paginationShow="false"></TableForm>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeFn')">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import constData from "@/config/constData";
export default {
  props: ["supplierId"],
  data() {
    return {
      tableColumn: {
        dicUrl: `/api/oa-portal/contractSupplier/getSupplierExchangeRateHis?supplierId=${this.supplierId}`,
        column: [
          {
            label: "月份",
            prop: "exchangeRateMonth",
          },
          {
            label: "结算汇率",
            prop: "settlementExchangeRate",
          },
          {
            label: "汇率计算方式",
            prop: "exchangeRateMethod",
            formatter(val) {
              return constData.exchangeRateList.find(
                (item) => item.id === val.exchangeRateMethod
              ).name;
            },
          },
        ],
      },
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
