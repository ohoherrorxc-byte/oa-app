<template>
  <div>
    <el-row>
      <el-col :span="14">
        <el-row>
          <el-col>
            <basic-container>
              <div class="board-title">
                <div class="board-title-left">
                  <ul>
                    <li
                      :class="isType == '1' ? 'active' : ''"
                      @click="changeType('1')"
                    >
                      按年
                    </li>
                    <li
                      :class="isType == '2' ? 'active' : ''"
                      @click="changeType('2')"
                    >
                      按月
                    </li>
                  </ul>
                </div>
                <span style="float: right">
                  <el-button
                    size="mini"
                    type="primary"
                    style="margin-left: 10px"
                    @click="handleOpenDialog()"
                    >设定目标</el-button
                  >
                </span>
              </div>
              <el-dialog
                :visible.sync="supplierDialogFormVisible"
                append-to-body
                @close="editDialogClose"
              >
                <template slot="title">
                  <div style="font-size: 15px">新增目标</div>
                </template>
                <el-form
                  :model="editForm"
                  :rules="editFormRules"
                  ref="editFormRef"
                  class="demo-ruleForm"
                >
                  <el-row>
                    <el-form-item prop="targetType">
                      <label slot="label">目标类型:</label><br />
                      <el-select
                        v-model="editForm.targetType"
                        style="width: 90%"
                        clearable
                      >
                        <el-option
                          v-for="item in paymentStatuss"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item prop="targetAmount">
                      <label slot="label">目标数额:</label><br />
                      <el-input
                        v-model="editForm.targetAmount"
                        autocomplete="off"
                        :placeholder="请输入目标数额"
                        style="width: 90%"
                      ></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item prop="targetDimension">
                      <label slot="label">目标维度:</label><br />
                      <el-radio-group v-model="editForm.targetDimension">
                        <el-radio :label="1">年</el-radio>
                        <el-radio :label="2">月</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item prop="endTime">
                      <label slot="label">目标时间段:</label><br />
                      <el-date-picker
                        style="width: 90%"
                        v-if="editForm.targetDimension == 1"
                        v-model="editForm.endTime"
                        format="yyyy-MM-dd hh:mm:ss"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        type="year"
                        placeholder="请选择目标时间段"
                      >
                      </el-date-picker>
                      <el-date-picker
                        style="width: 90%"
                        v-if="editForm.targetDimension == 2"
                        v-model="editForm.endTime"
                        format="yyyy-MM-dd hh:mm:ss"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        type="month"
                        placeholder="请选择目标时间段"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-row>
                </el-form>
                <template #footer v-if="!isShowDetail">
                  <span class="dialog-footer">
                    <el-button
                      @click="supplierDialogFormVisible = false"
                      size="mini"
                      icon="el-icon-circle-close"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      @click="addSupplier"
                      size="mini"
                      icon="el-icon-circle-check"
                      >保存</el-button
                    >
                  </span>
                </template>
              </el-dialog>
            </basic-container>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <basic-container>
              <div class="lineEchart" ref="financialProfitEcharts"></div>
            </basic-container>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <basic-container>
              <div class="lineEchart" ref="afinancialProfitEcharts"></div>
            </basic-container>
          </el-col>
          <el-col :span="11">
            <basic-container>
              <div class="lineEchart">
                <div class="linetitle">
                  <span class="linetitle-left">利润</span>
                  <span class="linetitle-right"
                    >￥{{ profitList.totalProfit }}</span
                  >
                </div>
                <div
                  class="linebox"
                  v-for="item in profitList.profitUnitVOList"
                  :key="item"
                >
                  <div class="linebox-title">
                    <span class="linebox-left" v-if="item.season == 1"
                      >第一季度</span
                    >
                    <span class="linebox-left" v-if="item.season == 2"
                      >第二季度</span
                    >
                    <span class="linebox-left" v-if="item.season == 3"
                      >第三季度</span
                    >
                    <span class="linebox-left" v-if="item.season == 4"
                      >第四季度</span
                    >
                    <span class="linebox-right">{{ item.targetAchieve }}%</span>
                  </div>
                  <div class="linebox-line">
                    <el-progress
                      :stroke-width="10"
                      :percentage="item.targetAchieve"
                      :show-text="false"
                    ></el-progress>
                  </div>
                </div>
              </div>
            </basic-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-row>
          <basic-container>
            <el-calendar v-model="nowDate"></el-calendar>
          </basic-container>
        </el-row>
        <el-row>
          <basic-container>
            <div class="lineEchartOne">
              <div class="linetitle">
                <span class="linetitle-left">今日日程提醒</span>
                <span class="linetitle-right"></span>
              </div>
              <div
                class="lineMand"
                v-for="itm in TDContractRemindList"
                :key="itm"
              >
                <span class="lineMand-img">
                  <img class="lineMand-imge" src="../../img/message.png" />
                </span>
                <span class="lineMand-world">
                  <p class="world-title">{{ itm.id }}</p>
                  <p class="world-main">{{ itm.remindContent }}</p>
                </span>
              </div>
            </div>
          </basic-container>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import * as echarts from "echarts";
import {
  contractStatisticsAdd,
  contractStatistics,
} from "@/api/contract/contractSellAdd";

export default {
  name: "wel",
  data() {
    return {
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      dataPanelEcharts: null, // 图表
      pickTimeEcharts: null, // 图表
      nowDate: new Date(),
      minDate: new Date("2023-2-1"),
      maxDate: new Date("2023-2-28"),
      isType: "1",
      editForm: {
        endTime: "",
        targetType: "",
        targetAmount: "",
        targetDimension: 1,
        beginTime: "",
      },
      supplierDialogFormVisible: false,
      paymentStatuss: [
        {
          name: "销售额",
          value: 1,
        },
        {
          name: "销量",
          value: 2,
        },
        {
          name: "利润",
          value: 3,
        },
      ],
      profitList: {},
      TDContractRemindList: [],
      MonthContractRemindList: [],
    };
  },
  mounted() {
    this.handleChange();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    handleChange(val) {
      contractStatistics(val)
        .then((res) => {
          if (res.data.code == 0) {
            let data = res.data.data;
            let saleAmountName = [];
            let saleAmountData = [];
            let vehicleModelSaleName = [];
            let vehicleModelSaleData = [];
            if (data.saleAmountVOList && data.saleAmountVOList.length > 0) {
              saleAmountName = data.saleAmountVOList.map((i) => i.x);
              saleAmountData = data.saleAmountVOList.map((i) => i.saleAmount);
              this.left(saleAmountName, saleAmountData);
            }
            if (
              data.vehicleModelSaleVolumeVoList &&
              data.vehicleModelSaleVolumeVoList.length > 0
            ) {
              data.vehicleModelSaleVolumeVoList.forEach((ite, ind, str) => {
                let list = {
                  value: ite.saleVolume,
                  name: ite.vehicleModelName,
                };
                vehicleModelSaleData.push(list);
              });
              this.bottom(vehicleModelSaleData);
            }
            this.profitList = data.profitVO;
            this.TDContractRemindList = data.tbCurrentContractRemindList;
            this.MonthContractRemindList = data.tbMonthContractRemindList;
          } else {
            this.$message.error(res.data.msg);
          }
          this.supplierDialogFormVisible = false;
        })
        .catch((err) => this.$message.error(`获取失败,${err.data.msg}`))
        .finally(() => {
          this.supplierDialogFormVisible = false;
        });
    },
    async left(name, value) {
      const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
      this.dataPanelEcharts = echarts.init(this.$refs.financialProfitEcharts);
      let option = {
        title: {
          text: "销售额",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["01", "02", "03"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: ["总销售额", "目标销售额"],
          right: 10,
        },
        grid: {
          left: "10%",
          right: "8%",
          bottom: "2%",
          containLabel: true,
        },
        series: [
          {
            name: "总销售额",
            data: value,
            type: "line",
            areaStyle: {},
          },
          {
            name: "目标销售额",
            data: [],
            type: "line",
            areaStyle: {},
          },
        ],
      };
      this.dataPanelEcharts.setOption(option);
    },
   async bottom(val) {
       const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
      this.pickTimeEcharts = echarts.init(this.$refs.afinancialProfitEcharts);
      let option = {
        title: {
          text: "销量",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 100,
          bottom: 0,
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: false },
          },
        },
        series: [
          {
            name: "销售量",
            type: "pie",
            radius: [50, 125],
            center: ["32%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            data: val,
          },
        ],
      };
      this.pickTimeEcharts.setOption(option);
    },
    changeType(val) {
      this.isType = val;
    },
    handleOpenDialog() {
      this.supplierDialogFormVisible = true;
    },
    addSupplier() {
      console.log("add");
      contractStatisticsAdd(this.editForm)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.supplierDialogFormVisible = false;
        })
        .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
        .finally(() => {
          this.supplierDialogFormVisible = false;
        });
    },
  },
};
</script>

<style>
.el-font-size {
  font-size: 14px;
}
.lineEchart {
  width: 100%;
  height: 385px;
}
.lineEchartOne {
  width: 100%;
  height: 230px;
  overflow: scroll;
}
.linetitle {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  font-weight: 500;
  color: #313439;
  margin-bottom: 10px;
}
.linetitle-left {
  float: left;
  font-size: 18px;
  font-weight: bolder;
  color: #313439;
}
.linetitle-right {
  float: right;
}
.linebox {
  margin-top: 10px;
}
.linebox-title {
  margin-bottom: 5px;
  overflow: hidden;
}
.linebox-left {
  float: left;
}
.linebox-right {
  float: right;
}
.lineMand {
  width: 100%;
  overflow: hidden;
}
.lineMand-img {
  display: inline-block;
  vertical-align: top;
}
.lineMand-imge {
  width: 48px;
  height: 48px;
}
.lineMand-world {
  display: inline-block;
  padding-left: 21px;
}
.world-title {
  height: 20px;
  font-size: 14px;
  font-family: Medium;
  font-weight: 500;
  color: #000000;
  line-height: 20px;
  text-align: left;
}
.world-main {
  width: 200px;
  word-break: keep-all;
  white-space: normal;
  font-size: 14px;
  font-family: Regular;
  font-weight: 400;
  color: #8c8c8c;
  line-height: 20px;
  text-align: left;
}
.board-title {
  overflow: hidden;
}
.board-title-left {
  float: left;
  width: 276px;
  padding: 1px;
}
.board-title-left ul {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.board-title-left ul li {
  float: left;
  width: 42px;
  margin: 0 25px;
  font-size: 14px;
  font-weight: 400;
  height: 35px;
  line-height: 35px;
  text-align: center;
}
.board-title-left .active {
  border-bottom: 2px solid #203b71;
}
</style>
