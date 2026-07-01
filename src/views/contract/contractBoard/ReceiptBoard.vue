<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-05-24 17:29:58
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-08-23 13:50:13
 * @FilePath: \icarx-ui\src\views\contract\contractboard\ReceiptBoard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- <div class="Echartmain" id="chart"></div> -->
    <avue-data-icons :option="dataOptionRmb"></avue-data-icons>
    <avue-data-icons :option="dataOptionUsd"></avue-data-icons>
    <TableForm :tableColumn="crudOption" :searchForm="searchForm"></TableForm>
  </div>
</template>

<script>
import {
  getSalesAmount,
  getSalesAmountPic,
} from "@/api/contract/contractBoard";
// import * as echarts from "echarts";
export default {
  data() {
    return {
      sendSettings: false,
      picker: Date.now(),
      formSubmit: {},
      salesAmountData: {},
      dataOptionRmb: {
        span: 4,
        data: [
          {
            count: "0",
            title: "RMB合同总金额",
            prop: "totalAmountRmb",
            decimals: 2,
          },

          {
            count: "0",
            title: "RMB开票总金额",
            prop: "invoiceOpenedAmountRmb",
            decimals: 2,
          },
          {
            count: "0",
            title: "RMB应开未开总金额",
            prop: "invoiceNotOpenedAmountRmb",
            decimals: 2,
          },
          {
            count: "0",
            title: "RMB收款总金额",
            prop: "receivedTotalAmountRmb",
            decimals: 2,
          },
          {
            count: "0",
            title: "RMB应收未收总金额",
            prop: "nReceivedTotalAmountRmb",
            decimals: 2,
          },
        ],
      },
      dataOptionUsd: {
        span: 4,
        data: [
          {
            count: "0",
            title: "USD合同总金额",
            prop: "totalAmountUsd",
            decimals: 2,
          },
          {
            count: "0",
            title: "USD开票总金额",
            prop: "",
            decimals: 2,
          },
          {
            count: "0",
            title: "USD应开未开总金额",
            prop: "",
            decimals: 2,
          },
          {
            count: "0",
            title: "USD收款总金额",
            prop: "",
            decimals: 2,
          },
          {
            count: "0",
            title: "USD应收未收总金额",
            prop: "",
            decimals: 2,
          },
        ],
      },
      crudOption: {
        dicUrl: "/api/oa-portal/saleContract/selectPage",
        column: [
          {
            label: "合同名称",
            prop: "contractName",
            width: 200,
          },
          {
            label: "合同编号",
            prop: "contractNo",
            width: 150,
          },
          {
            label: "申请人",
            prop: "applyUser",
            width: 150,
          },
          {
            label: "客户名称",
            prop: "custContact",
            width: 150,
          },
          {
            label: "相关项目",
            prop: "relatedPro",
            width: 150,
          },
          {
            label: "销售类型",
            prop: "saleType",
            width: 150,
            formatter(row) {
              switch (row.saleType) {
                case 1:
                  return "NRE";
                case 2:
                  return "硬件";
                case 3:
                  return "孵化";
                case 4:
                  return "License";
                default:
                  return "无";
              }
            },
          },
          {
            label: "币种",
            prop: "currency",
            width: 150,
          },
          {
            label: "汇率",
            prop: "exchangeRate",
            width: 150,
          },
          {
            label: "金额合计（原币）",
            prop: "amountTotalOriginal",
            width: 150,
          },
          {
            label: "已开票金额",
            prop: "invoicedAmount",
            width: 150,
          },
          {
            label: "未开票金额",
            prop: "unInvoicedAmount",
            width: 150,
          },
          {
            label: "合同实施时间",
            prop: "implementationTime",
            width: 150,
          },
        ],
      },
      searchForm: {
        downloadBtn: {
          url: "/api/oa-portal/saleContract/export",
        },
        delBtn: "ww",
        btnList: [
          {
            name: "发送设置",
            icon: "el-icon-s-promotion",
            onClick: () => {
              this.sendSettings = true;
            },
          },
        ],
        column: [
          {
            type: "select",
            label: "开票状态",
            allowCreate: true,
            filterable: true,
            prop: "applyUser1",
            dicData: [
              {
                label: "已开票",
                value: 0,
              },
              {
                label: "应开未开",
                value: 1,
              },
            ],
          },
          {
            type: "select",
            label: "收款状态",
            allowCreate: true,
            filterable: true,
            prop: "applyUser2",
            dicData: [
              {
                label: "已收款",
                value: 0,
              },
              {
                label: "应收未收",
                value: 1,
              },
            ],
          },
          {
            label: "申请日期",
            prop: "month",
            type: "month",
            valueFormat: "yyyy-MM",
          },
          "countryReginCode",
          {
            type: "select",
            label: "销售类型",
            dicUrl: "/api/oa-system/dict/dictionary?code=SALE_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            allowCreate: true,
            filterable: true,
            prop: "saleType",
          },
          "applyPerson",
          {
            type: "select",
            label: "申请部门",
            allowCreate: true,
            filterable: true,
            prop: "applyDept",
            dicUrl: `/api/oa-system/dept/tree?tenantId=${
              JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
            }`,
            props: {
              label: "title",
              value: "id",
            },
          },
          {
            type: "select",
            label: "客户名称",
            prop: "custId",
            allowCreate: true,
            filterable: true,
            dicUrl: "/api/oa-portal/contractCustomer/selectList",
            props: {
              label: "custName",
              value: "id",
            },
          },
        ],
      },
    };
  },
  created() {
    this.salesAmount();
  },
  mounted() {
    // this.getSalesAmountPic();
  },
  methods: {
    salesAmount() {
      getSalesAmount({ picker: this.picker }).then((res) => {
        let data = res.data.data;
        this.dataOptionRmb.data.forEach((item) => {
          item["count"] = data[item["prop"]];
        });
        this.dataOptionUsd.data.forEach((item) => {
          item["count"] = data[item["prop"]];
        });
      });
    },
    getSalesAmountPic() {
      getSalesAmountPic().then((res) => {
        this.updateOption(res.data.data);
      });
    },
    updateOption(data) {
      let chartDom = document.getElementById("chart");
      let width = document.getElementsByClassName("el-tabs__content")[0];
      chartDom.style.width = width.clientWidth + "px";
      let myChart = echarts.init(chartDom);
      let emphasisStyle = {};
      let option = {
        legend: {
          data: [
            "RMB开票总金额",
            "RMB应开未开总金额",
            "RMB收款总金额",
            "RMB应收未收总金额",
          ],
          left: "10%",
        },

        tooltip: {},
        xAxis: {
          data: data.xarray,
        },
        yAxis: {},
        grid: {
          left: "5%",
          right: "5%",
        },
        series: [
          {
            name: "RMB开票总金额",
            type: "bar",
            stack: "one",
            emphasis: emphasisStyle,
            data: data.invoiceArray,
          },
          {
            name: "RMB应开未开总金额",
            type: "bar",
            stack: "one",
            emphasis: emphasisStyle,
            data: data.ninvoiceArray,
          },
          {
            name: "RMB收款总金额",
            type: "bar",
            stack: "one",
            emphasis: emphasisStyle,
            data: data.collectedArray,
          },
          {
            name: "RMB应收未收总金额",
            type: "bar",
            stack: "one",
            emphasis: emphasisStyle,
            data: data.ncollectedArray,
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.Echartmain {
  width: 100%;
  height: 352px;
}
</style>
