<template>
  <div>
    <el-row>
      <el-col :span="8">
        <basic-container>
          <div class="boardEchart">
            <div class="boardMand">
              <span class="boardMand-img">
                <img
                  class="boardMand-imge"
                  src="../../../img/ic_agreement_b.png"
                />
              </span>
              <span class="boardMand-world">
                <p class="boardworld-title">¥ {{ costFee }}</p>
                <p class="boardworld-main">已发生费用</p>
              </span>
            </div>
          </div>
        </basic-container>
      </el-col>
      <el-col :span="8">
        <basic-container>
          <div class="boardEchart">
            <div class="boardMand">
              <span class="boardMand-img">
                <img
                  class="boardMand-imge"
                  src="../../../img/ic_agreement_g.png"
                />
              </span>
              <span class="boardMand-world">
                <p class="boardworld-title">¥ {{ payFee }}</p>
                <p class="boardworld-main">已支付费用</p>
              </span>
            </div>
          </div>
        </basic-container>
      </el-col>
      <el-col :span="8">
        <basic-container>
          <div class="boardEchart">
            <div class="boardMand">
              <span class="boardMand-img">
                <img
                  class="boardMand-imge"
                  src="../../../img/ic_agreement_y.png"
                />
              </span>
              <span class="boardMand-world">
                <p class="boardworld-title">{{ activedVehcielNum }}</p>
                <p class="boardworld-main">已激活车辆</p>
              </span>
            </div>
          </div>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <basic-container>
          <div class="boardOne-title">
            <div class="boardOne-title-left">
              <ul>
                <li
                  :class="isTypeOne == '1' ? 'active' : ''"
                  @click="changeTypeOne('1')"
                >
                  按年
                </li>
                <li
                  :class="isTypeOne == '2' ? 'active' : ''"
                  @click="changeTypeOne('2')"
                >
                  按月
                </li>
              </ul>
            </div>
          </div>
          <div class="Echartmain" ref="EchartsOne"></div>
        </basic-container>
      </el-col>
      <el-col :span="12">
        <basic-container>
          <div class="boardOne-title">
            <div class="boardOne-title-left">
              <ul>
                <li
                  :class="isTypeTwo == '1' ? 'active' : ''"
                  @click="changeTypeTwo('1')"
                >
                  按年
                </li>
                <li
                  :class="isTypeTwo == '2' ? 'active' : ''"
                  @click="changeTypeTwo('2')"
                >
                  按月
                </li>
              </ul>
            </div>
          </div>
          <div class="Echartmain" ref="EchartsTwo"></div>
        </basic-container>
      </el-col>
      <el-col :span="12">
        <basic-container>
          <div class="boardOne-title">
            <div class="boardOne-title-left">
              <ul>
                <li
                  :class="isTypeThree == '1' ? 'active' : ''"
                  @click="changeTypeThree('1')"
                >
                  按年
                </li>
                <li
                  :class="isTypeThree == '2' ? 'active' : ''"
                  @click="changeTypeThree('2')"
                >
                  按月
                </li>
              </ul>
            </div>
          </div>
          <div class="Echartmain" ref="EchartsThree"></div>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// P0: echarts 改异步按需加载
let echartsLib = null
const loadEcharts = () => {
  if (!echartsLib) echartsLib = import(/* webpackChunkName: "echarts" */ 'echarts')
  return echartsLib
}
import { contractBoard } from "@/api/contract/contractSellAdd";

export default {
  name: "wel",
  data() {
    return {
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      dataPanelEcharts: null, // 图表
      pickTimeEcharts: null, // 图表
      deaTimeEcharts: null, // 图表
      isTypeOne: "1",
      isTypeTwo: "1",
      isTypeThree: "1",
      costFee: "",
      payFee: "",
      activedVehcielNum: "",
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
      contractBoard(val)
        .then((res) => {
          if (res.data.code == 0) {
            let data = res.data.data;
            this.costFee = data.costFee;
            this.payFee = data.payFee;
            this.activedVehcielNum = data.activedVehcielNum;
            let saleAmountName = [];
            let saleAmountDataOne = [];
            let saleAmountDataTwo = [];
            let vehicleModelSaleName = [];
            let vehicleModelSaleDataOne = [];
            let vehicleModelSaleDataTwo = [];
            let licenseIncomeData = [];

            if (data.marketFeeVOList && data.marketFeeVOList.length > 0) {
              saleAmountName = data.marketFeeVOList.map((i) => i.x);
              saleAmountDataOne = data.marketFeeVOList.map((i) => i.costedFee);
              saleAmountDataTwo = data.marketFeeVOList.map((i) => i.payedFee);
              this.EchartsOne(
                saleAmountName,
                saleAmountDataTwo,
                saleAmountDataOne
              );
            }

            if (data.supplierFeeVOList && data.supplierFeeVOList.length > 0) {
              vehicleModelSaleName = data.supplierFeeVOList.map((i) => i.x);
              vehicleModelSaleDataOne = data.supplierFeeVOList.map(
                (i) => i.costedFee
              );
              vehicleModelSaleDataTwo = data.supplierFeeVOList.map(
                (i) => i.payedFee
              );
              this.EchartsTwo(
                vehicleModelSaleName,
                vehicleModelSaleDataTwo,
                vehicleModelSaleDataOne
              );
            }

            if (
              data.licenseIncomeVOList &&
              data.licenseIncomeVOList.length > 0
            ) {
              data.licenseIncomeVOList.forEach((ite, ind, str) => {
                let list = {
                  value: ite.income,
                  name: ite.x,
                };
                licenseIncomeData.push(list);
              });
              this.EchartsThree(licenseIncomeData);
            }
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
    async EchartsOne(name, valueOne, valueTwo) {
      const echartsO = await loadEcharts();
      this.dataPanelEcharts = echartsO.init(this.$refs.EchartsOne);
      let option = {
        title: {
          text: "市场费用统计",
        },
        xAxis: {
          type: "category",
          data: name,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: ["已支付的费用", "已发生的费用"],
          right: 10,
        },
        grid: {
          left: "1%",
          right: "8%",
          bottom: "2%",
          containLabel: true,
        },
        series: [
          {
            name: "已支付的费用",
            data: valueOne,
            type: "bar",
            areaStyle: {},
            itemStyle: {
              color: "rgba(37,135,248,1)",
              borderRadius: 5,
            },
          },
          {
            name: "已发生的费用",
            data: valueTwo,
            type: "bar",
            areaStyle: {},
            itemStyle: {
              color: "rgba(250,165,64,1)",
              borderRadius: "5px 5px 0px 0px",
            },
          },
        ],
      };
      this.dataPanelEcharts.setOption(option);
    },
    async EchartsTwo(name, valueOne, valueTwo) {
      const echartsO = await loadEcharts();
      this.pickTimeEcharts = echartsO.init(this.$refs.EchartsTwo);
      let option = {
        title: {
          text: "供应商费用统计",
        },
        xAxis: {
          type: "category",
          data: name,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: ["已支付的费用", "已发生的费用"],
          right: 10,
        },
        grid: {
          left: "1%",
          right: "8%",
          bottom: "2%",
          containLabel: true,
        },
        series: [
          {
            name: "已支付的费用",
            data: valueOne,
            type: "bar",
            areaStyle: {},
            itemStyle: {
              color: "rgba(37,135,248,1)",
              borderRadius: 5,
            },
          },
          {
            name: "已发生的费用",
            data: valueTwo,
            type: "bar",
            areaStyle: {},
            itemStyle: {
              color: "rgba(250,165,64,1)",
              borderRadius: "5px 5px 0px 0px",
            },
          },
        ],
      };
      this.pickTimeEcharts.setOption(option);
    },
    async EchartsThree(val) {
      const echartsO = await loadEcharts();
      this.deaTimeEcharts = echartsO.init(this.$refs.EchartsThree);
      let option = {
        title: {
          text: "License收入统计",
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
            name: "收入",
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
      this.deaTimeEcharts.setOption(option);
    },
    changeTypeOne(val) {
      this.isTypeOne = val;
    },
    changeTypeTwo(val) {
      this.isTypeTwo = val;
    },
    changeTypeThree(val) {
      this.isTypeThree = val;
    },
    handleOpenDialog() {
      this.supplierDialogFormVisible = true;
    },
    addSupplier() {
      this.supplierDialogFormVisible = false;
    },
  },
};
</script>

<style>
.el-font-size {
  font-size: 14px;
}
.Echartmain {
  width: 100%;
  height: 352px;
}
.boardEchart {
  width: 100%;
}
.boardMand {
  width: 100%;
  overflow: hidden;
}
.boardMand-img {
  display: inline-block;
  vertical-align: top;
}
.boardMand-imge {
  width: 44px;
  height: 44px;
}
.boardMand-world {
  display: inline-block;
  padding-left: 10px;
}
.boardworld-title {
  height: 25px;
  font-size: 18px;
  font-family: Medium;
  font-weight: bolder;
  color: #404040;
  font-family: Medium;
  line-height: 25px;
  text-align: left;
}
.boardworld-main {
  width: 200px;
  font-family: Regular;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: #b3b3b3;
  line-height: 17px;
  text-align: left;
}
.boardOne-title {
  overflow: hidden;
  margin-bottom: 10px;
}
.boardOne-title-left {
  float: left;
  width: 120px;
  height: 30px;
  line-height: 30px;
}
.boardOne-title-left ul {
  overflow: hidden;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #f6f6f7;
  border-radius: 15px;
  padding: 3px;
}
.boardOne-title-left ul li {
  float: left;
  width: 60px;
  font-size: 14px;
  font-weight: 400;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 15px;
}
.boardOne-title-left .active {
  background: #ffffff;
}
</style>
