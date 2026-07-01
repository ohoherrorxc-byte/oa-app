<template>
  <div class="inventory-report">
    <el-row class="trend-chart">
      <el-col :span="50" class="loading">
        <el-button v-if="loadingPriceData" type="info" disabled>Loading...</el-button>
      </el-col>
      <el-col :span="24">
        <div class="chart" ref="priceTrendChart"></div>
      </el-col>
    </el-row>
    <el-row class="filter-row">
      <el-col :span="3">
        <h3>选择零件大类</h3>
        <el-select v-model="filters.partsCategory" placeholder="选择零件大类" clearable @change="updateCharts">
          <el-option
            v-for="category in partCategories"
            :key="category"
            :label="category"
            :value="category"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <h3>选择适用项目</h3>
        <el-select v-model="filters.partsProject" placeholder="选择适用项目" clearable @change="updateCharts">
          <el-option
            v-for="project in partsProjects"
            :key="project"
            :label="project"
            :value="project"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="charts">
      <el-col :span="50" class="loading">
        <el-button v-if="loading" type="info" disabled>Loading...</el-button>
      </el-col>
    </el-row>
    <el-row class="charts">
      <el-col :span="11">
        <div class="chart" ref="inventoryStatusChart"></div>
      </el-col>
      <el-col :span="11">
        <div class="chart" ref="currentStateChart"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// P0: echarts 改异步按需加载
let echartsLib = null
const loadEcharts = () => {
  if (!echartsLib) echartsLib = import(/* webpackChunkName: "echarts" */ 'echarts')
  return echartsLib
}
import PartsManageApi from '@/api/partsManage/index';

const depreciationRatePerDay = 0.001; // 每日折损率 0.1%

export default {
  name: 'InventoryReport',
  data() {
    return {
      filters: {
        partsCategory: '',
        partsProject: ''
      },
      loading: false,
      loadingPriceData: false,
      inventoryData: [],
      inventoryDataForReporting: [],
      currentStateChart: null,
      inventoryStatusChart: null,
      priceTrendChart: null,
      response: null,
      responseForReporting: null,
    };
  },
  computed: {
    partCategories() {
      return [...new Set(this.inventoryData.map(item => item.partsCategory))];
    },
    partsProjects() {
      return [...new Set(this.inventoryData.map(item => item.partsProject))];
    },
    filteredData() {
      return this.inventoryData.filter(item => {
        return (!this.filters.partsCategory || item.partsCategory === this.filters.partsCategory) &&
          (!this.filters.partsProject || item.partsProject === this.filters.partsProject);
      });
    }
  },
  async mounted() {
    await this.initCharts();
    this.fetchInventoryData();
    this.fetchInventoryPriceData()
  },
  methods: {
    async initCharts() {
      // P0: 异步加载 echarts
      const echarts = await loadEcharts();
      this.currentStateChart = echarts.init(this.$refs.currentStateChart);
      this.inventoryStatusChart = echarts.init(this.$refs.inventoryStatusChart);
      this.priceTrendChart = echarts.init(this.$refs.priceTrendChart);
    },
    async fetchInventoryData() {
      this.loading = true;
      try {
        if (this.response == null) {
          this.response = await PartsManageApi.exportInventorPartsTotal()
        }
        console.log('接口返回数据：', this.response.data);
        // this.response.data
        this.inventoryData = this.response.data.data.map(item => ({
          currentState: item.currentState || "未定义",
          partsCategory: item.partsCategory || "未定义",
          middlePart: item.middlePart,
          partsSubcategory: item.partsSubcategory,
          partsProject: item.partsProject || "未定义", // 适配后端的适用项目字段
          inventoryStatus: item.inventoryStatus || "未定义",
        }));
        await this.updateCharts();
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchInventoryPriceData() {
      this.loadingPriceData = true;
      try {
        if (this.responseForReporting == null) {
          this.responseForReporting = await PartsManageApi.exportTestPartInventoryInOutTimeTotal()
        }
        console.log('接口返回数据：', this.responseForReporting.data);
        // this.responseForReporting.data 是接口返回后端的 TestPartInventoryInOutTimeDto 列表
        this.inventoryDataForReporting = this.responseForReporting.data.data.map(item => ({
          id: item.id,
          partName: item.partName,
          partNumber: item.partNumber, // 新增后端的零件编号字段
          currentState: item.currentState || "未定义",
          partsCategory: item.partsCategory || "未定义",
          middlePart: item.middlePart,
          partsSubcategory: item.partsSubcategory,
          partsProject: item.partsProject || "未定义", // 适配后端的适用项目字段
          inventoryStatus: item.inventoryStatus || "未定义",
          unitPrice: item.unitPrice || 0,
          storageLocation: item.storageLocation,
          scrapedTime: item.scrapedTime ? new Date(item.scrapedTime) : null, // 转成 Date 对象
          warehousingTime: new Date(item.warehousingTime) // 转成 Date 对象
        }));
        await this.updatePriceCharts()
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        this.loadingPriceData = false;
      }
    },
    async updateCharts() {
      this.loading = true;
      try {
        // Current Status Donut Chart
        const currentStateCounts = this.filteredData.reduce((acc, item) => {
          acc[item.currentState] = (acc[item.currentState] || 0) + 1;
          return acc;
        }, {});
        this.currentStateChart.setOption({
          title: {text: '领用/在库状态(件)', left: 'center'},
          tooltip: {trigger: 'item'},
          series: [{
            type: 'pie',
            radius: ['40%', '65%'],
            color: ['#336dff', '#65d7fa', '#d2fa65','#65fafa','#CCCCCC'],
            data: Object.entries(currentStateCounts).map(([name, value]) => ({name, value})),
            label: {show: true, formatter: '{b}: {c} ({d}%)'},
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        });

        // Inventory Status Donut Chart
        // 定义状态与颜色的映射关系
        const inventoryStatusCounts = this.filteredData.reduce((acc, item) => {
          acc[item.inventoryStatus] = (acc[item.inventoryStatus] || 0) + 1;
          return acc;
        }, {});
        this.inventoryStatusChart.setOption({
          title: {text: '盘点状态(件)', left: 'center'},
          tooltip: {trigger: 'item'},
          series: [{
            type: 'pie',
            radius: ['40%', '65%'],
            color: ['#336dff','#fab765','#65d7fa', '#d2fa65','#CCCCCC'],
            data: Object.entries(inventoryStatusCounts).map(([name, value]) => ({name, value})),
            label: {show: true, formatter: '{b}: {c} ({d}%)'},
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        });
      } finally {
        this.loading = false;
      }
    },

    async updatePriceCharts() {
      this.loadingPriceData = true;
      try {
        const currentDate = new Date(); // 当前日期
        const yearsDate = new Date(currentDate);
        yearsDate.setFullYear(yearsDate.getFullYear() - 1.5); // 一年前

        // 生成月份列表
        const generateMonthList = (startDate, endDate) => {
          const months = [];
          let current = new Date(startDate);
          current.setDate(1); // 确保从每月第一天开始

          while (current <= endDate) {
            months.push(current.toISOString().slice(0, 7));
            current.setMonth(current.getMonth() + 1);
          }
          return months;
        };

        // // 调试辅助函数：带时间戳的日志输出
        // const debugLog = (message, data = null)  =>{
        //   const timestamp = new Date().toISOString().slice(11, 23);
        //   console.log(`[${timestamp}] ${message}`);
        //   if (data !== null) {
        //     console.dir(data);
        //   }
        // }

        const months = generateMonthList(yearsDate, currentDate);
        const monthlyTotals = {};

        // 预处理数据：和后端 DTO 字段对齐，准备计算折损
        const preprocessedData = this.inventoryDataForReporting.map(item => ({
          ...item,
          warehousingDate: item.warehousingTime, // 直接用转换后的 Date 对象
          scrapedDate: item.scrapedTime // 直接用转换后的 Date 对象
        }));

        // debugLog("预处理后数据（前5条样本）", preprocessedData.slice(0, 5));

        // 计算每个月的折损价格（含报废逻辑）
        const monthlyDepreciation = months.map(month => {
          const referenceDate = month === months[months.length - 1]
            ? currentDate
            : new Date(`${month}-01T00:00:00+08:00`);

          return preprocessedData.map(item => {
            // 若物品已报废（scrapedDate 存在且早于参考月份），折损为 0
            if (item.scrapedDate && item.scrapedDate < referenceDate) {
              return 0;
            }

            const timeDiffMs = referenceDate - item.warehousingDate;
            const daysDiff = Math.max(0, timeDiffMs / (1000 * 60 * 60 * 24));
            const depreciationFactor = 1 - (depreciationRatePerDay * daysDiff);
            // 折损后价格不低于 0，unitPrice 是 BigDecimal，前端转成数字计算（或按需保留精度）
            return (item.unitPrice ? Number(item.unitPrice) : 0) * Math.max(0, depreciationFactor);
          });
        });

        // debugLog("每月折损计算结果（前3个月样本）", monthlyDepreciation.slice(0, 3));

        // 计算每月总折损
        months.forEach((month, monthIndex) => {
          monthlyTotals[month] = preprocessedData.reduce((sum, item, itemIndex) => {
            return sum + monthlyDepreciation[monthIndex][itemIndex];
          }, 0);
        });

        // 格式化数据并更新图表（ECharts 示例）
        const formattedMonths = months;
        const totalPrices = months.map(month => monthlyTotals[month].toFixed(2));

        // 输出用于图表的最终数据
        // debugLog("图表数据 - X轴", formattedMonths);
        // debugLog("图表数据 - Y轴", totalPrices);


        //
        this.priceTrendChart.setOption({
          title: [
            {
              text: '测试零件总价统计',       // 主标题文本
              left: 'center',           // 水平居中
              top: 'top',               // 垂直居上
              textStyle: {
                fontSize: 20,           // 标题字体大小
                fontWeight: 'bold',     // 标题字体粗细
                //color: '#666'           // 标题字体颜色
              }
            },
            {
              text: '** 每日折损率：' + depreciationRatePerDay,       // 主标题文本
              left: 'center',           // 水平居中
              bottom: 'bottom',               // 垂直居上
              textStyle: {
                fontSize: 14,           // 标题字体大小
                fontWeight: 'bold',     // 标题字体粗细
                color: '#666'           // 标题字体颜色
              },
            }
          ],
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              const param = params[0];
              const month = param.name;
              const value = param.value;
              return `
                <div style="font-weight: bold;">${month}</div>
                <div>总价：${this.formatNumber(value)} CNY</div>
            `;
            }
          },
          xAxis: {
            type: 'category',
            data: formattedMonths,
            axisLabel: {
              rotate: 45,
              //interval: Math.floor(formattedMonths.length / 24)
            }
          },
          yAxis: {
            type: 'value',
            name: '总价（CNY）',
            min: 0
          },
          series: [
            {
              name: '总价',
              type: 'line',
              data: totalPrices,
              label: {
                show: true,
                position: 'top',
                // 重叠时自动隐藏（ECharts 内置优化）
                showOverlap: false,
                // 格式化标签文本
                //formatter: (params) => this.formatNumber(params.value)
              }
            }
          ]
        });
      } finally {
        this.loadingPriceData = false;
      }
    },

    formatNumber(num) {
       return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

  }
};
</script>

<style scoped>
.inventory-report {
  padding: 20px;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 60px;
}

.loading {
  margin-left: 2vw;
}

.trend-chart{
  margin-bottom: 60px;
}

/* 大屏（例如屏幕宽度大于 768px 时），charts 横向排列 */
@media (min-width: 768px) {
  .charts {
    display: flex;
    flex-wrap: wrap;
  }
}

/* 小屏（例如屏幕宽度小于等于 768px 时），charts 竖向排列 */
@media (max-width: 768px) {
  .charts {
    display: flex;
    flex-direction: column;
  }
}

.chart {
  width: 100%;
  height: 400px;
}

.trend-chart {
  margin-top: 20px;
}
</style>
