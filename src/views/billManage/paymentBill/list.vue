<template>
  <basic-container>
    <TableForm
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      :selectionShow="true"
      :onLoad="getList"
      @selectionChange="selectionChange"
    >
      <template #monthBillDate>
        <el-date-picker
          v-model="monthBillDate"
          :picker-options="pickerOptions"
          type="monthrange"
          placeholder="选择月份"
          value-format="timestamp"
          :clearable="false"
        ></el-date-picker>
      </template>
      <template #other>
        <avue-data-operatext :option="option" class="mb20 panel-data"></avue-data-operatext>
      </template>
    </TableForm>
    <SendSettings v-if="sendSettings" @close="sendSettings = false" emailType="2"></SendSettings>
  </basic-container>
</template>

<script>
import { getLastDate } from "@/util/extend";
import { monthBillTotal, monthBill } from "@/api/billManage/paymentBill";
import SendSettings from "../components/sendSettings";
export default {
  components: {
    SendSettings,
  },
  data() {
    return {
      sendSettings: false,
      monthBillDate: [getLastDate("timestamp"), getLastDate("timestamp")],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > getLastDate("timestamp");
        },
      },
      option: {
        span: 12,
        data: [
          {
            title: this.$t("paymentBill.navigation"),
            subtitle: "Map+Navigation",
            props: "Map_Navigation",
            img:
              "https://img2.autotimes.com.cn/news/2021/08/0822_155816715240.jpg",
            color: "#00a7d0",
            list: [
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: 0,
              },
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: "CNY 40230.82",
              },
              {
                label: this.$t("paymentBill.activationNumber"),
                value: 0,
              },
            ],
          },
          {
            title: this.$t("paymentBill.weather"),
            subtitle: "Weather",
            props: "Weather",
            img:
              "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F13e6bb14-a5af-45cd-a719-b86b0eddcbb3%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1692430233&t=b359084792a20ab395509f70baad3302",
            color: "#f39c12",
            list: [
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: 0,
              },
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: 0,
              },
              {
                label: this.$t("paymentBill.activationNumber"),
                value: 0,
              },
            ],
          },
          {
            title: this.$t("paymentBill.voice"),
            subtitle: "VR+TTS",
            props: "VR_TTS",
            img:
              "https://img1.baidu.com/it/u=3231882851,1920272878&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
            color: "#009E96",
            list: [
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: 0,
              },
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: 0,
              },
              {
                label: this.$t("paymentBill.activationNumber"),
                value: 0,
              },
            ],
          },
          {
            title: this.$t("paymentBill.hardware"),
            subtitle: "Hardware",
            props: "Hardware",
            img: "img/1.png",
            color: "rgb(27 201 142)",
            list: [
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: 0,
              },
              {
                label: this.$t("paymentBill.pendingAmount"),
                value: 0,
              },
              {
                label: this.$t("paymentBill.shipmentQuantity"),
                value: 0,
              },
            ],
          },
        ],
      },
      searchForm: {
        downloadBtn: {
          url: "/api/oa-portal/payBill/monthBillExport",
          params: {},
        },
        column: [
          {
            label: this.$t("paymentBill.month"),
            prop: "monthBillDate",
            formSlot: true,
          },
          "countryReginCode",
          "partType",
          "supplierId",
          "modelId",
          "bomType",
        ],
        btnList: [
          {
            name: this.$t("paymentBill.sendSettings"),
            icon: "el-icon-s-promotion",
            onClick: () => {
              this.sendSettings = true;
            },
          },
        ],
      },
      tableColumn: {
        column: [
          {
            label: this.$t("paymentBill.month"),
            prop: "billMonth",
          },
          {
            label: this.$t("paymentBill.partsName"),
            prop: "partsName",
          },
          {
            label: this.$t("paymentBill.partsNo"),
            prop: "partsNo",
          },
          {
            label: this.$t("paymentBill.partsType"),
            prop: "functionName",
          },
          {
            label: this.$t("paymentBill.category"),
            prop: "categoryName",
          },
          {
            label: this.$t("paymentBill.supplier"),
            prop: "supplierName",
          },
          {
            label: this.$t("paymentBill.model"),
            prop: "modelName",
          },
          {
            label: this.$t("paymentBill.series"),
            prop: "seriesName",
          },
          {
            label: this.$t("paymentBill.countryRegin"),
            prop: "countryRegin",
          },
          {
            label: this.$t("paymentBill.bomType"),
            prop: "bomType",
          },
          {
            label: this.$t("paymentBill.bomName"),
            prop: "bomName",
          },
          {
            label: this.$t("paymentBill.shipmentQuantity"),
            prop: "shipmentTotal",
            width: 100,
          },
          {
            label: this.$t("paymentBill.pendingAmount"),
            prop: "shipmentAmountTotal",
            width: 100,
          },
          {
            label: this.$t("paymentBill.originalCurrencyUnitPrice"),
            prop: "unitPrice",
          },
          {
            label: this.$t("paymentBill.exchangeRate"),
            prop: "exchangeRate",
          },
          {
            label: this.$t("paymentBill.settlementUnitPrice"),
            prop: "unitPriceSettlement",
          },
          {
            label: this.$t("paymentBill.activationNumber"),
            prop: "licenseNum",
            width: 100,
          },
          {
            label: this.$t("paymentBill.pendingAmount"),
            prop: "licenseTotalPrice",
            width: 200,
          },
        ],
      },
    };
  },

  methods: {
    selectionChange(row) {
      console.log(row);
    },
    getList(val = {}) {
      if (this.monthBillDate.length < 1) {
        this.$message.error("请选择月份");
        return false;
      }
      this.searchForm.downloadBtn.params.monthBillStartDate = val.monthBillStartDate = this.monthBillDate[0];
      this.searchForm.downloadBtn.params.monthBillEndDate = val.monthBillEndDate = this.monthBillDate[1];
      this.getInit(val);
      return monthBill(val);
    },
    getInit(val = {}) {
      const loading = this.$loading({
        background: "hsla(0,0%,100%,.9)",
        target: document.querySelector(".avue-data-operatext"),
      });
      monthBillTotal(val).then((res) => {
        loading.close();
        const { data } = res.data;
        this.option.data.forEach((item) => {
          if (data[item.props]) {
            item.list[0].value =
              "CNY" +
              "\xa0\xa0" +
              Number(data[item.props].totalPriceCny).toLocaleString(); //CNY
            item.list[1].value =
              "USD" +
              "\xa0\xa0" +
              Number(data[item.props].totalPriceUsd).toLocaleString(); //USD
            item.list[2].value = data[item.props].licenseNum.toLocaleString();
            item.list.subtitle = data[item.props].functionName;
          }
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep ep .avue-data-operatext {
  .el-row {
    display: flex;
    justify-content: space-between;

    .item {
      margin: 0.05rem;
    }
  }

  .item {
    padding: 0;
    box-shadow: 0 0 10px 0.1rem rgba(0, 0, 0, 0.1);
    a {
      pointer-events: none;
      cursor: text;
    }
  }

  .item-title {
    font-size: 0.2rem;
  }

  .item-subtitle {
    font-size: 0.12rem;
  }

  .item-header {
    padding: 0.1rem;
  }

  .item-img {
    width: 0.5rem;
    height: 0.5rem;
    margin: -0.4rem auto 0px;
  }

  .item-content {
    padding: 0 0 0.1rem;
  }

  .item-label {
    font-size: 0.14rem;
    color: rgba(0, 0, 0, 0.45);
  }

  .item-value {
    color: #666;
    font-size: 0.12rem;
  }
}

.panel-data {
  ::v-deep ep .el-col-md-12 {
    width: 24% !important;
  }
}
</style>
