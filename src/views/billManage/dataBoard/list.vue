<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :label="item.dictValue"
        :name="item.dictKey"
        v-for="item in areaList"
        :key="item.dictKey"
      ></el-tab-pane>
    </el-tabs>
    <avue-data-display :option="option"></avue-data-display>
    <TableForm ref="tableForm" :tableColumn="tableColumn" @data="tableInfo">
      <template slot="payStatus" scope="{row:{ payStatus}}">
        <el-tag type="danger" v-if=" payStatus === 0">未收款</el-tag>
        <el-tag v-if=" payStatus === 1">已收款</el-tag>
        <el-tag v-if=" payStatus === 2" type="warning">待确认</el-tag>
      </template>
    </TableForm>
  </basic-container>
</template>
<script>
import { getOptions } from "@/api/base";
import { getSalesOrderStatisticTotalBoard } from "@/api/billManage/dataBoard";
export default {
  data() {
    return {
      areaList: [],
      activeName: "3G02",
      tableColumn: {
        dicUrl: "/api/oa-portal/contractStatistics/getSalesOrderStatisticBoard",
        params: {
          countryReginCode: "3G02",
        },
        column: [
          {
            label: "",
            slotName: "payStatus",
            width: "80px",
          },
          {
            label: "日期",
            prop: "billMonth",
          },
          {
            label: "车系",
            prop: "model",
          },
          {
            label: "数量",
            prop: "quantity",
            width: "80px",
          },
          {
            label: "应收",
            prop: "receivableAmount",
            width: "100px",
          },
          {
            label: "账单",
            prop: "billConfirmStatus",
            formatter({ billConfirmStatus }) {
              return billConfirmStatus === 1 ? "已确认" : "待确认";
            },
            width: "100px",
          },
          {
            label: "发票",
            prop: "invoiceStatus",
            formatter({ invoiceStatus }) {
              return invoiceStatus === 1 ? "已开票" : "未开票";
            },
            width: "60px",
          },
          {
            label: "收款",
            prop: "collectionStatus",
            formatter({ collectionStatus }) {
              return collectionStatus === 1 ? "已收" : "未收";
            },
            width: "60px",
          },
          {
            label: "备注",
            prop: "remark",
            width: "100px",
          },
        ],
      },
      option: {
        data: [
          {
            count: 0,
            title: "剩余待收款（辆）",
            key: "unPaidCount",
          },
          {
            count: 0,
            title: "已收款（辆）",
            key: "paidCount",
          },
          {
            count: 0,
            title: "待收款金额",
            key: "unPaidAmount",
            decimals: 2,
          },
          {
            count: 0,
            title: "已收款金额",
            key: "paidAmount",
            decimals: 2,
          },
        ],
      },
    };
  },
  created() {
    this.init();
    this.getTotalBoard(this.activeName);
  },
  methods: {
    init() {
      getOptions({ code: "COUNTRY_REGIN" }).then((res) => {
        this.areaList = res.data.data;
      });
    },
    getTotalBoard(countryReginCode) {
      getSalesOrderStatisticTotalBoard({
        countryReginCode,
      }).then((res) => {
        this.option.data.forEach((item) => {
          item.count = res.data.data[item.key];
        });
      });
    },
    handleClick({ name }) {
      this.$refs.tableForm.getList({
        countryReginCode: name,
        current: 1,
        size: 10,
      });
      this.getTotalBoard(name);
    },
  },
};
</script>