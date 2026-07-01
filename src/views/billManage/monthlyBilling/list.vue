<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-07-01 10:42:04
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-11-24 11:13:03
 * @FilePath: \icarx-ui\src\views\contract\monthlyBilling\list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <basic-container>
    <SearchForm :searchForm="searchForm" @handleSubmit="getList" @refresh="getList">
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
    </SearchForm>

    <SendSettings v-if="sendSettings" @close="sendSettings = false" emailType="1"></SendSettings>
    <avue-data-panel class="mb20 panel-data" :option="panelOption"></avue-data-panel>
    <el-table :data="tableData" border style="width: 100%" ref="tableObj" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-row type="flex" justify="space-between">
            <el-col>NRE</el-col>
            <!-- <el-col :span="6">订单号：202308-HW-THE</el-col> -->
            <el-col class="text-r">
              <!-- <el-button size="mini" type="primary" @click="remarkBill(row, 'NRE')">账单确认</el-button> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="mt10">
              <el-table :data="row.hardwareMonthBillVOL2ist" border size="mini">
                <el-table-column prop="bomName" label="费用名称"></el-table-column>
                <el-table-column prop="bomName" label="相关车型"></el-table-column>
                <el-table-column prop="unitPrice" label="合同总金额"></el-table-column>
                <el-table-column prop="licenseNum" label="收款批次"></el-table-column>
                <el-table-column prop="totalPrice" label="收款比例"></el-table-column>
                <el-table-column prop="totalPrice" label="本月应收金额"></el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-divider></el-divider>
          <el-row type="flex" justify="space-between">
            <el-col>硬件</el-col>
            <!-- <el-col :span="6">订单号：202308-HW-THE</el-col> -->
<!--            <el-col class="text-r">-->
<!--              <el-button size="mini" type="primary" @click="remarkHardwareBill">账单确认</el-button>-->
<!--            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="24" class="mt10">
              <el-table
                :data="row.hardwareMonthBillVOList"
                border
                size="mini"
                :summary-method="getSummaries"
                show-summary
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="partsName" label="零件名称"></el-table-column>
                <el-table-column prop="partsNo" label="零件号"></el-table-column>
                <el-table-column prop="bomName" label="BOM"></el-table-column>
                <el-table-column prop="bomType" label="BOM类型"></el-table-column>
                <el-table-column prop="seriesName" label="车系"></el-table-column>
                <el-table-column prop="batchNo" label="批次"></el-table-column>
                <el-table-column prop="unitPrice" label="单价">
                  <template slot-scope="{ row }">CNY {{ Number(row.unitPrice).toLocaleString() }}</template>
                </el-table-column>
                <el-table-column prop="licenseNum" label="出货量">
                  <template slot-scope="{ row }">{{ Number(row.licenseNum).toLocaleString() }}</template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="小计">
                  <template slot-scope="{ row }">CNY {{ Number(row.totalPrice).toLocaleString() }}</template>
                </el-table-column>


                <el-table-column fixed="right" label="操作" width="170" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.confirmStatus === 1" type="text" class="green-button">
                      <i class="el-icon-circle-check el-icon--left"></i>账单已确认
                    </el-button>
                    <el-button v-else type="text" class="grey-button">
                      <i class="el-icon-circle-check el-icon--left"></i>账单未确认
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="space-between">
            <el-col>License</el-col>
            <!-- <el-col :span="6">订单号：202308-HW-THE</el-col> -->
            <el-col class="text-r">
              <el-button
                v-if="row.licenseMonthBillVOList && row.licenseMonthBillVOList.length !== 0 && row.licenseMonthBillVOList[0] &&  row.licenseMonthBillVOList[0].confirmStatus === 1"
                type="text"
                class="green-button"
              >
                <i class="el-icon-circle-check el-icon--left"></i>账单已确认
              </el-button>
              <el-button v-else size="mini" type="primary" @click="remarkBill(row, 'license')">账单确认</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="mt10">
              <el-table
                :data="row.licenseMonthBillVOList"
                border
                size="mini"
                :summary-method="getSummaries"
                show-summary
              >
                <el-table-column prop="seriesName" label="车系名称"></el-table-column>
                <el-table-column prop="bomName" label="BOM"></el-table-column>
                <el-table-column prop="unitPrice" label="单价">
                  <template slot-scope="{ row }">CNY {{ row.unitPrice }}</template>
                </el-table-column>
                <el-table-column prop="licenseNum" label="激活数">
                  <template slot-scope="{ row }">{{ Number(row.licenseNum).toLocaleString() }}</template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="小计">
                  <template slot-scope="{ row }">CNY {{ Number(row.totalPrice).toLocaleString() }}</template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="月份" prop="currentMonthDate"></el-table-column>
      <el-table-column label="国家/区域" prop="countryReginName"></el-table-column>
      <el-table-column label="客户" prop="custName"></el-table-column>
      <el-table-column label="出货量" prop="shipment"></el-table-column>
      <el-table-column label="激活数" prop="license"></el-table-column>
      <el-table-column label="总计" prop="totalFee">
        <template slot-scope="{ row }">CNY {{ Number(row.totalFee).toLocaleString() }}</template>
      </el-table-column>
    </el-table>
  </basic-container>
</template>
<script>
import SendSettings from "../components/sendSettings";
import {
  monthListBill,
  billConfirm,
  batchBillConfirm,
  hardwareBillConfirm
} from "@/api/contract/monthlyBilling";
import { getLastDate } from "@/util/extend";
export default {
  components: {
    SendSettings,
  },
  data() {
    return {
      loading: true,
      monthBillDate: [getLastDate("timestamp"), getLastDate("timestamp")],
      pickerOptions: {
        disabledDate(time) {
          const delayTime = 120 * 24 * 3600 * 1000;
          console.log("time-->" + time);
          console.log("timestamp-->" + getLastDate("timestamp"))
          return time.getTime() > getLastDate("timestamp") + delayTime;
        },
      },
      sendSettings: false,
      panelOption: {
        span: 8,
        data: [
          {
            title: "NRE",
            count: "CNY 0",
            icon: "el-icon-view",
            color: "#00a7d0",
            prop: "nreCnyTotalFee",
          },
          {
            title: "硬件",
            count: "CNY 0",
            icon: "el-icon-s-platform",
            color: "rgb(27, 201, 142)",
            prop: "hardwareCnyTotalFee",
          },
          {
            title: "License",
            count: "CNY 0",
            icon: "el-icon-s-goods",
            color: "rgb(230, 71, 88)",
            prop: "licenseCnyTotalFee",
          },
        ],
      },
      searchForm: {
        column: [
          {
            label: "月份",
            prop: "monthBillDate",
            formSlot: true,
          },
          "countryReginCode",
          "custId",
        ],
        btnList: [
          {
            name: "发送设置",
            icon: "el-icon-s-promotion",
            onClick: () => {
              this.sendSettings = true;
            },
          },
          {
            name: "批量确认",
            icon: "el-icon-s-promotion",
            onClick: () => {
              batchBillConfirm(this.params).then((res) => {
                if (res.data.code === 0) {
                  this.$message.success("批量确认成功");
                }
              });
            },
          },
        ],
      },
      tableData: [],
      selectionList: {},
      params: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.selectionList = val;
    },
    getList(val = {}) {
      this.loading = true;
      if (this.monthBillDate.length < 1) {
        this.$message.error("请选择月份");
        return false;
      }
      val.monthBillStartDate = this.monthBillDate[0];
      val.monthBillEndDate = this.monthBillDate[1];
      this.params = val;
      monthListBill(val).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.data;
          this.panelOption.data.forEach((item) => {
            item.count =
              "CNY" +
              "\xa0\xa0\xa0" +
              Number(data[item["prop"]]).toLocaleString();
          });
          this.tableData = data.monthBillUnitVOList;
          console.log("this.tableData-->" + this.tableData)
          console.log("data-->" + this.tableData.licenseMonthBillVOList)
          const monthBillUnitVOList = data.monthBillUnitVOList;
          monthBillUnitVOList.forEach((item) => {
            // 出货量
            item.shipment = item.hardwareMonthBillVOList
              .map((m) => m.licenseNum)
              .reduce((prev, curr) => {
                return prev + curr;
              }, 0)
              .toLocaleString();
            // 激活数
            item.license = item.licenseMonthBillVOList
              .map((m) => m.licenseNum)
              .reduce((prev, curr) => {
                return prev + curr;
              }, 0)
              .toLocaleString();
          });
        }
        this.loading = false;
      });
    },
    toogleExpand(row) {
      let table = this.$refs.tableObj;
      table.toggleRowExpansion(row);
    },
    remarkBill(row) {
      this.$confirm("账单已核对完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "再看看",
        type: "warning",
      })
        .then(() => {
          billConfirm({
            countryRegionCode: row.countryReginCode,
            billMonth: row.currentMonthDate,
            bomType: "license",
          }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("账单确认成功");
              row.licenseMonthBillVOList[0].confirmStatus = 1;
              // this.getList();
            }
          });
        })
        .catch(() => {});
    },
    remarkHardwareBill() {
      let list = Object.values(this.selectionList).flat(Infinity);
      if (!list || list.length < 1) {
        return this.$message.error("请至少选择一条数据");
      }
      let ids = list.map((item) => item.id).join(",");
      this.$confirm("账单已核对完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "再看看",
        type: "warning",
      })
        .then(() => {
          hardwareBillConfirm({
            ids: ids,
          }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("账单确认成功");
              row.hardwareMonthBillVOList[0].confirmStatus = 1;
            }
          });
        })
        .catch(() => {});
    },
    getSummaries(param) {
      const { columns, data } = param;

      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }

        const property = column.property;
        if (property === "licenseNum" || property === "totalPrice") {
          const values = data.map((item) => Number(item[column.property]));
          sums[index] = values.reduce((prev, curr) => {
            return prev + curr;
          }, 0);
          // 币种统计需单独处理
          if (property === "totalPrice") {
            sums[index] =
              "CNY" + "\xa0" + Number(sums[index].toFixed(2)).toLocaleString();
          } else {
            sums[index] = sums[index].toLocaleString();
          }
        }
      });
      return sums;
    },
  },
};
</script>

<style scoped lang="scss">
.btn-row {
  padding-left: 8px;
  display: flex;
  justify-content: right;

  button {
    // width: 100%;
  }
}

.green-button {
  color: #67c23a;
}
.grey-button {
  color: grey;
}

::v-deep ep .el-table__expanded-cell {
  padding: 20px 15px !important;
}

::v-deep ep .el-button--mini {
  padding: 5px 7px;
}
//  .panel-data{
//     margin-left: -80px;
//   }
// ::v-deep ep .panel-data .el-col-md-8 {
//   width: 31%;
//   margin-left: 10px;
// }
</style>
