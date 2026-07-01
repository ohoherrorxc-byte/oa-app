<script>
// P0: echarts 改异步按需加载，节省首屏 ~900KB
import request from '@/router/axios';

export default {
  name: 'WorkWeekReport',
  data() {
    return {
      reportData: null,
      startDate: '',
      endDate: '',
      charts: {},
      navItems: [
        { id: 'project-info', label: '项目信息', icon: 'fas fa-project-diagram', active: true },
        { id: 'quality-info', label: '质量管理', icon: 'fas fa-shield-alt', active: false },
        { id: 'procurement-info', label: '采购/支付', icon: 'fas fa-shopping-cart', active: false },
        { id: 'business-info', label: '商务/财务', icon: 'fas fa-file-invoice-dollar', active: false },
        { id: 'logistics-info', label: '物料物流', icon: 'fas fa-truck', active: false },
        { id: 'hr-info', label: '人力资源', icon: 'fas fa-users', active: false },
        { id: 'sim-info', label: 'SIM卡管理', icon: 'fas fa-sim-card', active: false },
      ],
      bugSortStates: {},
      bugShowAllStates: {},
      headcountSortStates: {},
      attendanceSortStates: {},
      attendanceShowAllStates: {}
    };
  },
  mounted() {
    console.log('WorkWeekReport mounted');
    this.initDateRange();
    this.fetchReportData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    Object.values(this.charts).forEach(chart => chart.dispose());
  },
  methods: {
    // 初始化日期范围（本周一到周日）
    initDateRange() {
      const today = new Date();
      const day = today.getDay();
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);

      const monday = new Date(new Date().setDate(diffToMonday));
      const sunday = new Date(new Date().setDate(diffToMonday + 6));

      const formatDate = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      this.startDate = formatDate(monday);
      this.endDate = formatDate(sunday);
    },

    getSampleData() {
      console.log('getSampleData 被调用');
      return {
        projectInfo: {
          newProjectCount: 5,
          closedProjectCount: 3,
          projectRygStat: { "GREEN": 24, "YELLOW": 8, "RED": 3 },
          regionOperationStats: [
            { regionName: "华东大区", status: "正常" },
            { regionName: "华南大区", status: "正常" },
            { regionName: "华北大区", status: "警告" },
            { regionName: "西南大区", status: "正常" }
          ]
        },
        quality: {
          fixedBugStat: {
            groupStats: [{ dimensionName: "平台研发组", count: 42 }, { dimensionName: "终端研发组", count: 38 }],
            domainStats: [{ dimensionName: "内核领域", count: 12 }, { dimensionName: "应用领域", count: 68 }],
            personStats: [{ dimensionName: "张三", count: 15 }, { dimensionName: "李四", count: 12 }]
          },
          newBugStat: {
            groupStats: [{ dimensionName: "平台研发组", count: 12 }, { dimensionName: "终端研发组", count: 18 }],
            domainStats: [{ dimensionName: "内核领域", count: 5 }, { dimensionName: "应用领域", count: 25 }],
            personStats: [{ dimensionName: "王五", count: 8 }]
          },
          remainingBugStat: {
            groupStats: [{ dimensionName: "平台研发组", count: 5 }, { dimensionName: "终端研发组", count: 8 }],
            domainStats: [{ dimensionName: "内核领域", count: 2 }, { dimensionName: "应用领域", count: 11 }],
            personStats: [{ dimensionName: "赵六", count: 3 }]
          }
        },
        procurementPayment: {
          newSupplierCount: 2,
          monthlyPaymentAmount: 1258400,
          contractStat: { newCount: 4, expiredCount: 1 },
          prPoStats: [{ type: "硬件采购", amount: 850000 }, { type: "云服务", amount: 120000 }, { type: "人力外包", amount: 288400 }]
        },
        businessFinance: {
          newCustomerCount: 3,
          nreStat: { newContractCount: 2, invoiceAmount: 450000, receivedAmount: 300000, unsignedContractCount: 1, unsettledAmount: 150000 },
          licenseStat: { newContractCount: 5, invoiceAmount: 880000, receivedAmount: 880000, unsignedContractCount: 0, unsettledAmount: 0 },
          hwStat: { newContractCount: 1, invoiceAmount: 1200000, receivedAmount: 600000, unsignedContractCount: 2, unsettledAmount: 600000 }
        },
        hwMaterialLogistics: {
          productionSalesRygStat: { "正常项目": 15, "预警项目": 2, "延期项目": 1 },
          customerOrderStats: [{ dimensionName: "本周新订单", count: 45 }, { dimensionName: "待发货订单", count: 12 }],
          supplierOrderStats: [{ dimensionName: "已下单", count: 28 }, { dimensionName: "在途物料", count: 15 }],
          forecastStats: [{ dimensionName: "准确率", count: "92%" }, { dimensionName: "波动率", count: "5%" }],
          customerDeliveryPlanStats: [{ dimensionName: "按时交付率", count: "98%" }],
          supplierDeliveryPlanStats: [{ dimensionName: "到货准时率", count: "95%" }],
          inventoryStats: [{ dimensionName: "呆滞库存", count: 5 }, { dimensionName: "周转天数", count: 12 }],
          sparePartStats: [{ dimensionName: "满足率", count: "99%" }]
        },
        simCard: { monthlyBill: "¥12,450", weeklyStatus: "正常" },
        hr: {
          companyHeadcount: {
            regularStaffCount: [{ dimensionName: "正式员工", count: 450 }],
            supplierStaffCount: [{ dimensionName: "供应商员工", count: 120 }],
            newHireCount: 8,
            resignationCount: 2
          },
          attendanceStat: {
            absenceStats: [{ dimensionName: "请假人数", count: 5 }],
            attendanceDurationStats: [{ dimensionName: "平均工时", count: "9.2h" }],
            abnormalAttendanceStats: [
              { dimensionName: "漏签", count: 4 },
              { dimensionName: "缺勤", count: 2 }
            ],
            overtimeStats: [
              { dimensionName: "加班人数", count: 18 },
              { dimensionName: "加班时长(h)", count: 86 }
            ]
          },
          workloadStat: { crStats: [{ dimensionName: "CR", count: 45 }], bugFlowStats: [{ dimensionName: "Bug处理", count: 120 }] }
        }
      };
    },

    async fetchReportData() {
      console.log('fetchReportData 被调用, startDate:', this.startDate, 'endDate:', this.endDate);
      if (!this.startDate || !this.endDate) {
        console.warn('日期范围不完整，跳过加载');
        return;
      }
      try {
        const res = await request({
          url: '/api/oa-portal/workReport/allInfo',
          method: 'post',
          data: { startDate: this.startDate, endDate: this.endDate }
        });
        const data = (res && res.data && (res.data.data || res.data)) || null;
        console.log('接口返回数据:', data);
        this.reportData = data || this.getSampleData();
        console.log('reportData 已更新:', this.reportData);
        this.$nextTick(() => {
          this.initCharts();
          this.handleScroll();
        });
      } catch (error) {
        console.error("获取数据失败:", error);
        this.reportData = this.getSampleData();
        this.$nextTick(() => {
          this.initCharts();
          this.handleScroll();
        });
      }
    },

    async initCharts() {
      if (!this.reportData) return;
      const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts');

      // 项目健康度图表
      const projectInfo = this.reportData.projectInfo;
      if (projectInfo && projectInfo.projectRygStat) {
        const chartDom = document.getElementById('projectRygChart');
        if (chartDom) {
          if (this.charts.projectRyg) this.charts.projectRyg.dispose();
          const myChart = echarts.init(chartDom);
          this.charts.projectRyg = myChart;

          const data = Object.entries(projectInfo.projectRygStat).map(([name, value]) => ({
            name: name === 'GREEN' || name === '绿色' ? '正常' : (name === 'YELLOW' || name === '黄色' ? '警告' : '异常'),
            value: value,
            itemStyle: {
              color: name === 'GREEN' || name === '绿色' ? '#10b981' : (name === 'YELLOW' || name === '黄色' ? '#f59e0b' : '#ef4444')
            }
          }));

          myChart.setOption({
            tooltip: { trigger: 'item' },
            legend: { bottom: '0', left: 'center', textStyle: { fontSize: 11 } },
            series: [{
              name: '项目状态',
              type: 'pie',
              radius: ['45%', '75%'],
              avoidLabelOverlap: false,
              itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
              label: { show: false },
              data: data
            }]
          });

          // 确保图表适应容器大小
          myChart.resize();
        }
      }
    },

    getStatusClass(status) {
      if (!status) return '';
      const s = status.toLowerCase();
      if (s.includes('green') || s.includes('正常') || s.includes('完成') || s.includes('绿色')) return 'status-green';
      if (s.includes('yellow') || s.includes('警告') || s.includes('进行中') || s.includes('黄色')) return 'status-yellow';
      if (s.includes('red') || s.includes('异常') || s.includes('延期') || s.includes('红色')) return 'status-red';
      return '';
    },

    toggleSort(key, stats) {
      const currentState = this.bugSortStates[key] || 'desc';
      const newState = currentState === 'desc' ? 'asc' : 'desc';
      this.$set(this.bugSortStates, key, newState);

      stats.sort((a, b) => newState === 'asc' ? a.count - b.count : b.count - a.count);
    },

    getBugDisplayStats(typeKey, statKey, stats) {
      if (!Array.isArray(stats)) return [];
      const key = `${typeKey}${statKey}`;
      if (this.bugShowAllStates[key] || stats.length <= 10) {
        return stats;
      }
      return stats.slice(0, 10);
    },

    toggleBugShowAll(typeKey, statKey) {
      const key = `${typeKey}${statKey}`;
      const current = !!this.bugShowAllStates[key];
      this.$set(this.bugShowAllStates, key, !current);
    },

    getSelectedRangeText() {
      if (!this.startDate || !this.endDate) return '';
      const formatDate = (dateText) => dateText.replace(/-/g, '/');
      return `${formatDate(this.startDate)}~${formatDate(this.endDate)}`;
    },

    getSelectedMonth() {
      if (!this.startDate || this.startDate.length < 7) return '';
      return this.startDate.slice(0, 7);
    },

    getHeadcountList(fieldName) {
      const companyHeadcount = (this.reportData && this.reportData.hr && this.reportData.hr.companyHeadcount) || {};
      const value = companyHeadcount[fieldName];
      if (!Array.isArray(value)) return [];
      const list = value.filter(item => item && item.dimensionName !== undefined && item.count !== undefined);
      const sortState = this.headcountSortStates[fieldName] || 'desc';
      return [...list].sort((a, b) => sortState === 'asc' ? a.count - b.count : b.count - a.count);
    },

    getAttendanceList(fieldName) {
      const attendanceStat = (this.reportData && this.reportData.hr && this.reportData.hr.attendanceStat) || {};
      const value = attendanceStat[fieldName];
      const sortState = this.attendanceSortStates[fieldName] || 'desc';
      if (!Array.isArray(value) || value.length === 0) {
        let defaultList = [];
        if (fieldName === 'abnormalAttendanceStats') {
          defaultList = [
            { dimensionName: '漏签', count: 0 },
            { dimensionName: '缺勤', count: 0 }
          ];
        }
        if (fieldName === 'overtimeStats') {
          defaultList = [
            { dimensionName: '加班人数', count: 0 },
            { dimensionName: '加班时长(h)', count: 0 }
          ];
        }
        return [...defaultList].sort((a, b) => sortState === 'asc'
          ? this.parseSortCount(a.count) - this.parseSortCount(b.count)
          : this.parseSortCount(b.count) - this.parseSortCount(a.count));
      }
      return value
        .filter(item => item && item.dimensionName !== undefined)
        .map(item => ({ ...item, count: item.count === undefined || item.count === null ? '-' : item.count }))
        .sort((a, b) => sortState === 'asc'
          ? this.parseSortCount(a.count) - this.parseSortCount(b.count)
          : this.parseSortCount(b.count) - this.parseSortCount(a.count));
    },

    getAttendanceDisplayList(fieldName) {
      const list = this.getAttendanceList(fieldName);
      if (this.attendanceShowAllStates[fieldName] || list.length <= 10) {
        return list;
      }
      return list.slice(0, 10);
    },

    parseSortCount(count) {
      const number = Number(count);
      return Number.isFinite(number) ? number : 0;
    },

    getAttendanceOverviewList() {
      const attendanceStat = (this.reportData && this.reportData.hr && this.reportData.hr.attendanceStat) || {};
      const list = [...(attendanceStat.absenceStats || []), ...(attendanceStat.attendanceDurationStats || [])]
        .filter(item => item && item.dimensionName !== undefined)
        .map(item => ({ ...item, count: item.count === undefined || item.count === null ? '-' : item.count }));
      if (list.length > 0) return list;
      return [{ dimensionName: '暂无数据', count: '-' }];
    },

    getWorkloadOverviewList() {
      const workloadStat = (this.reportData && this.reportData.hr && this.reportData.hr.workloadStat) || {};
      const list = [...(workloadStat.crStats || []), ...(workloadStat.bugFlowStats || [])]
        .filter(item => item && item.dimensionName !== undefined)
        .map(item => ({ ...item, count: item.count === undefined || item.count === null ? '-' : item.count }));
      if (list.length > 0) return list;
      return [{ dimensionName: '暂无数据', count: '-' }];
    },

    getWorkloadList(fieldName) {
      const workloadStat = (this.reportData && this.reportData.hr && this.reportData.hr.workloadStat) || {};
      const value = workloadStat[fieldName];
      const sortState = this.attendanceSortStates[fieldName] || 'desc';
      if (!Array.isArray(value) || value.length === 0) {
        let defaultList = [];
        if (fieldName === 'crStats') {
          defaultList = [{ dimensionName: 'CR总数', count: 0 }];
        }
        if (fieldName === 'bugFlowStats') {
          defaultList = [{ dimensionName: 'Bug处理数', count: 0 }];
        }
        return [...defaultList].sort((a, b) => sortState === 'asc'
          ? this.parseSortCount(a.count) - this.parseSortCount(b.count)
          : this.parseSortCount(b.count) - this.parseSortCount(a.count));
      }
      return value
        .filter(item => item && item.dimensionName !== undefined)
        .map(item => ({ ...item, count: item.count === undefined || item.count === null ? '-' : item.count }))
        .sort((a, b) => sortState === 'asc'
          ? this.parseSortCount(a.count) - this.parseSortCount(b.count)
          : this.parseSortCount(b.count) - this.parseSortCount(a.count));
    },

    getWorkloadDisplayList(fieldName) {
      const list = this.getWorkloadList(fieldName);
      if (this.attendanceShowAllStates[fieldName] || list.length <= 10) {
        return list;
      }
      return list.slice(0, 10);
    },

    displayDashForZero(value) {
      return value === 0 || value === '0' ? '-' : value;
    },

    displayCurrencyDash(value) {
      if (value === 0 || value === '0') return '-';
      const numberValue = Number(value);
      if (Number.isFinite(numberValue)) return `¥${numberValue.toLocaleString()}`;
      return `¥${value}`;
    },

    toggleHeadcountSort(fieldName) {
      const currentState = this.headcountSortStates[fieldName] || 'desc';
      const newState = currentState === 'desc' ? 'asc' : 'desc';
      this.$set(this.headcountSortStates, fieldName, newState);
    },

    toggleAttendanceSort(fieldName) {
      const currentState = this.attendanceSortStates[fieldName] || 'desc';
      const newState = currentState === 'desc' ? 'asc' : 'desc';
      this.$set(this.attendanceSortStates, fieldName, newState);
    },

    toggleAttendanceShowAll(fieldName) {
      const current = !!this.attendanceShowAllStates[fieldName];
      this.$set(this.attendanceShowAllStates, fieldName, !current);
    },

    jumpToCheckingInDetail(stat) {
      if (!stat || !stat.userId) return;
      const month = this.getSelectedMonth();
      const userName = stat.dimensionName || '';
      const url = `https://oa.soimt.cn/oa/#/oa/checkingIn/myCheckingIn/index?userId=${encodeURIComponent(stat.userId)}&month=${encodeURIComponent(month)}&userName=${encodeURIComponent(userName)}`;
      window.open(url, '_blank');
    },

    handleScroll() {
      const sections = this.$el ? this.$el.querySelectorAll('.section') : [];
      const mainContent = this.$refs.mainContent;
      if (!mainContent) return;
      const containerTop = mainContent.getBoundingClientRect().top;
      const scrollTop = mainContent.scrollTop;
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top - containerTop + scrollTop;
        if (scrollTop >= (sectionTop - 100)) {
          current = section.getAttribute('id');
        }
      });

      this.navItems.forEach(item => {
        item.active = item.id === current;
      });
    },

    handleResize() {
      Object.values(this.charts).forEach(chart => chart.resize());
    },

    handleDateRangeContainerClick(event) {
      const container = event.currentTarget;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickLeftHalf = clickX <= rect.width / 2;
      const targetInput = clickLeftHalf ? this.$refs.startDateInput : this.$refs.endDateInput;
      if (!targetInput) return;
      targetInput.focus();
      if (typeof targetInput.showPicker === 'function') {
        targetInput.showPicker();
      }
    }
  }
};
</script>

<template>
  <div class="report-wrapper">
    <nav class="sidebar">
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.id" class="nav-item" :class="{ active: item.active }">
          <a :href="'#' + item.id"><i :class="item.icon"></i>{{ item.label }}</a>
        </li>
      </ul>
    </nav>

    <div ref="mainContent" class="main-content" @scroll.passive="handleScroll">
      <div class="container">
        <header class="header">
          <h1>工作周报</h1>
          <div class="date-range-container" @click="handleDateRangeContainerClick">
            <input ref="startDateInput" type="date" v-model="startDate" class="date-picker" title="开始日期" @change="fetchReportData" />
            <span class="date-separator">至</span>
            <input ref="endDateInput" type="date" v-model="endDate" class="date-picker" title="结束日期" @change="fetchReportData" />
          </div>
        </header>

        <div v-if="reportData">
          <!-- 项目信息 -->
          <section id="project-info" class="section">
            <div class="section-title"><i class="fas fa-project-diagram"></i>项目信息</div>
            <div class="card-grid">
              <div class="card">
                <div class="card-title">新项目数量 <span class="title-date-range">{{ getSelectedRangeText() }}</span></div>
                <div class="card-value">{{ reportData.projectInfo.newProjectCount }}</div>
              </div>
              <div class="card">
                <div class="card-title">关闭项目数量 <span class="title-date-range">{{ getSelectedRangeText() }}</span></div>
                <div class="card-value">{{ reportData.projectInfo.closedProjectCount }}</div>
              </div>
            </div>

            <div class="grid-2">
              <div class="sub-section">
                <div class="sub-section-title">项目健康度 (RYG)</div>
                <div id="projectRygChart" class="chart-container"></div>
              </div>
              <div class="sub-section">
                <div class="sub-section-title">
                  区域运营状态
                  <a
                    class="view-page-button"
                    href="https://oa-flow.soimt.cn:30157/oa/allDataHtml/indexData.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看页面
                  </a>
                </div>
                <div class="table-container">
                  <table>
                    <thead>
                      <tr><th>区域</th><th>当前状态</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="region in reportData.projectInfo.regionOperationStats" :key="region.regionName">
                        <td style="font-weight: 500;">{{ region.regionName }}</td>
                        <td><span class="status-badge" :class="getStatusClass(region.status)">{{ region.status }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <!-- 质量管理 -->
          <section id="quality-info" class="section">
            <div class="section-title"><i class="fas fa-shield-alt"></i>质量管理</div>

            <div v-for="(bugType, typeKey) in { '修复BUG统计': 'fixedBugStat', '新增BUG统计': 'newBugStat', '遗留BUG统计': 'remainingBugStat' }" :key="typeKey" class="sub-section">
              <div class="sub-section-title">{{ typeKey }} <span v-if="typeKey === '修复BUG统计' || typeKey === '新增BUG统计'" class="title-date-range">{{ getSelectedRangeText() }}</span></div>
              <div class="grid-3">
                <div v-for="(statList, statKey) in { '组统计': 'groupStats', '领域统计': 'domainStats', '人员统计': 'personStats' }" :key="statKey" class="bug-stat-block">
                  <div class="bug-stat-title">
                    {{ typeKey === '新增BUG统计' && statKey === '组统计' ? '来源统计' : statKey }}
                    <div class="bug-stat-actions">
                      <button class="sort-button" @click="toggleSort(typeKey + statKey, reportData.quality[bugType][statList])">
                        <i :class="bugSortStates[typeKey + statKey] === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                        {{ bugSortStates[typeKey + statKey] === 'asc' ? '升序' : '降序' }}
                      </button>
                      <button
                        v-if="reportData.quality[bugType][statList] && reportData.quality[bugType][statList].length > 10"
                        class="sort-button"
                        @click="toggleBugShowAll(typeKey, statKey)"
                      >
                        {{ bugShowAllStates[typeKey + statKey] ? '收起' : '查看全部' }}
                      </button>
                    </div>
                  </div>
                  <div class="card-grid" style="grid-template-columns: 1fr; gap: 8px;">
                    <div v-for="stat in getBugDisplayStats(typeKey, statKey, reportData.quality[bugType][statList])" :key="stat.dimensionName" class="card" style="padding: 10px; flex-direction: row; justify-content: space-between; align-items: center;">
                      <span style="font-size: 13px; color: #64748b">{{ stat.dimensionName }}</span>
                      <span style="font-weight: 700; color: #4f46e5">{{ stat.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 采购/支付 -->
          <section id="procurement-info" class="section">
            <div class="section-title"><i class="fas fa-shopping-cart"></i>采购/支付 <span class="title-date-range">{{ getSelectedRangeText() }}</span></div>
            <div class="card-grid">
              <div class="card">
                <div class="card-title">新供应商数量</div>
                <div class="card-value">{{ reportData.procurementPayment.newSupplierCount }}</div>
              </div>
              <div class="card">
                <div class="card-title">月度付款金额</div>
                <div class="card-value">¥{{ reportData.procurementPayment.monthlyPaymentAmount.toLocaleString() }}</div>
              </div>
              <div class="card">
                <div class="card-title">新合同数量</div>
                <div class="card-value">{{ reportData.procurementPayment.contractStat.newCount }}</div>
              </div>
              <div class="card status-red">
                <div class="card-title">过期合同数量</div>
                <div class="card-value">{{ reportData.procurementPayment.contractStat.expiredCount }}</div>
              </div>
            </div>
            <div class="sub-section">
              <div class="sub-section-title">PR/PO 明细</div>
              <div class="table-container">
                <table>
                  <thead>
                    <tr><th>类型</th><th>金额 (CNY)</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="stat in reportData.procurementPayment.prPoStats" :key="stat.type">
                      <td>{{ stat.type }}</td>
                      <td style="font-weight: 600;">¥{{ stat.amount.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- 商务/财务 -->
          <section id="business-info" class="section">
            <div class="section-title">
              <i class="fas fa-file-invoice-dollar"></i>商务/财务
              <a
                class="view-page-button"
                href="https://oa-flow.soimt.cn:30157/oa/#/contract/contractBoard/SalesAmountWaterfullBoard"
                target="_blank"
                rel="noopener noreferrer"
              >
                查看页面
              </a>
            </div>
            <div v-for="(value, key) in { 'NRE 统计': 'nreStat', 'License 统计': 'licenseStat', '硬件统计': 'hwStat' }" :key="key" class="sub-section">
              <div class="sub-section-title">{{ key }} <span class="title-date-range">{{ getSelectedRangeText() }}</span></div>
              <div class="card-grid">
                <div class="card"><div class="card-title">新合同</div><div class="card-value">{{ displayDashForZero(reportData.businessFinance[value].newContractCount) }}</div></div>
                <div class="card"><div class="card-title">发票金额</div><div class="card-value">{{ displayCurrencyDash(reportData.businessFinance[value].invoiceAmount) }}</div></div>
                <div class="card status-green"><div class="card-title">已收金额</div><div class="card-value">{{ displayCurrencyDash(reportData.businessFinance[value].receivedAmount) }}</div></div>
                <div class="card status-yellow"><div class="card-title">未签合同</div><div class="card-value">{{ displayDashForZero(reportData.businessFinance[value].unsignedContractCount) }}</div></div>
              </div>
            </div>
            <div class="card-grid" style="margin-top: 24px;">
              <div class="card">
                <div class="card-title">新客户数量</div>
                <div class="card-value">{{ displayDashForZero(reportData.businessFinance.newCustomerCount) }}</div>
              </div>
            </div>
          </section>

          <!-- 物料物流 -->
          <section id="logistics-info" class="section">
            <div class="section-title"><i class="fas fa-truck"></i>硬件物料物流</div>
            <div class="sub-section">
              <div class="sub-section-title">产销健康度 (RYG)</div>
              <div class="card-grid">
                <div v-for="(val, key) in reportData.hwMaterialLogistics.productionSalesRygStat" :key="key" class="card" :class="getStatusClass(key)">
                  <div class="card-title">{{ key }}</div>
                  <div class="card-value">{{ displayDashForZero(val) }}</div>
                </div>
              </div>
            </div>
            <div class="grid-2">
              <div v-for="group in [{title: '订单统计', keys: ['customerOrderStats', 'supplierOrderStats']}, {title: '交付计划', keys: ['customerDeliveryPlanStats', 'supplierDeliveryPlanStats']}]" :key="group.title" class="sub-section">
                <div class="sub-section-title">{{ group.title }}</div>
                <div class="grid-2">
                  <div v-for="k in group.keys" :key="k" class="card-grid" style="grid-template-columns: 1fr; gap: 8px;">
                    <div v-for="stat in reportData.hwMaterialLogistics[k]" :key="stat.dimensionName" class="card" style="padding: 10px; flex-direction: row; justify-content: space-between; align-items: center;">
                      <span style="font-size: 12px; color: #64748b">{{ stat.dimensionName }}</span>
                      <span style="font-weight: 600;">{{ displayDashForZero(stat.count) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid-3">
              <div v-for="k in ['forecastStats', 'inventoryStats', 'sparePartStats']" :key="k" class="sub-section">
                <div class="sub-section-title">{{ k === 'forecastStats' ? '预测统计' : k === 'inventoryStats' ? '库存统计' : '备件统计' }}</div>
                <div class="card-grid" style="grid-template-columns: 1fr; gap: 8px;">
                  <div v-for="stat in reportData.hwMaterialLogistics[k]" :key="stat.dimensionName" class="card" style="padding: 10px; flex-direction: row; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; color: #64748b">{{ stat.dimensionName }}</span>
                    <span style="font-weight: 600;">{{ displayDashForZero(stat.count) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 人力资源 -->
          <section id="hr-info" class="section">
            <div class="section-title"><i class="fas fa-users"></i>人力资源</div>
            <div class="grid-2">
              <div class="sub-section" style="margin-top: 0;">
                <div class="sub-section-title">
                  正式员工
                  <button class="sort-button" @click="toggleHeadcountSort('regularStaffCount')">
                    <i :class="headcountSortStates.regularStaffCount === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ headcountSortStates.regularStaffCount === 'asc' ? '升序' : '降序' }}
                  </button>
                </div>
                <div class="card-grid">
                  <div
                    v-for="(stat, idx) in getHeadcountList('regularStaffCount')"
                    :key="'regular-' + idx + '-' + stat.dimensionName"
                    class="card headcount-card"
                  >
                    <div class="card-title">{{ stat.dimensionName }}</div>
                    <div class="card-value">{{ stat.count }}</div>
                  </div>
                </div>
              </div>
              <div class="sub-section" style="margin-top: 0;">
                <div class="sub-section-title">
                  供应商员工
                  <button class="sort-button" @click="toggleHeadcountSort('supplierStaffCount')">
                    <i :class="headcountSortStates.supplierStaffCount === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ headcountSortStates.supplierStaffCount === 'asc' ? '升序' : '降序' }}
                  </button>
                </div>
                <div class="card-grid">
                  <div
                    v-for="(stat, idx) in getHeadcountList('supplierStaffCount')"
                    :key="'supplier-' + idx + '-' + stat.dimensionName"
                    class="card headcount-card"
                  >
                    <div class="card-title">{{ stat.dimensionName }}</div>
                    <div class="card-value">{{ stat.count }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-grid">
              <div class="card status-green">
                <div class="card-title">期间入职</div>
                <div class="card-value">{{ reportData.hr.companyHeadcount.newHireCount }}</div>
              </div>
              <div class="card status-red">
                <div class="card-title">期间离职</div>
                <div class="card-value">{{ reportData.hr.companyHeadcount.resignationCount }}</div>
              </div>
            </div>

            <div class="grid-2">
              <div class="sub-section">
                <div class="sub-section-title">
                  考勤概览
                  <a
                    class="view-page-button"
                    href="https://oa-flow.soimt.cn:30157/oa/#/oa/checkingIn/summaryReport/index"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看页面
                  </a>
                </div>
                <div class="mini-module-title mini-module-title-row">
                  <span>当月异常考勤统计（漏签，缺勤/次数）</span>
                  <div class="bug-stat-actions">
                    <button class="sort-button" @click="toggleAttendanceSort('abnormalAttendanceStats')">
                      <i :class="attendanceSortStates.abnormalAttendanceStats === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ attendanceSortStates.abnormalAttendanceStats === 'asc' ? '升序' : '降序' }}
                    </button>
                    <button
                      v-if="getAttendanceList('abnormalAttendanceStats').length > 10"
                      class="sort-button"
                      @click="toggleAttendanceShowAll('abnormalAttendanceStats')"
                    >
                      {{ attendanceShowAllStates.abnormalAttendanceStats ? '收起' : '查看全部' }}
                    </button>
                  </div>
                </div>
                <div class="card-grid attendance-narrow-grid">
                  <div v-for="(stat, idx) in getAttendanceDisplayList('abnormalAttendanceStats')" :key="'attendance-abnormal-' + idx + '-' + stat.dimensionName" class="card attendance-stat-item">
                    <span
                      class="attendance-stat-name"
                      :class="{ 'attendance-stat-name-link': !!stat.userId }"
                      @click="jumpToCheckingInDetail(stat)"
                    >{{ stat.dimensionName }}</span><span class="attendance-stat-count">{{ stat.count }}</span>

                  </div>
                </div>
                <div class="mini-module-title mini-module-title-row">
                  <span>当月加班统计（小时）</span>
                  <div class="bug-stat-actions">
                    <button class="sort-button" @click="toggleAttendanceSort('overtimeStats')">
                      <i :class="attendanceSortStates.overtimeStats === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ attendanceSortStates.overtimeStats === 'asc' ? '升序' : '降序' }}
                    </button>
                    <button
                      v-if="getAttendanceList('overtimeStats').length > 10"
                      class="sort-button"
                      @click="toggleAttendanceShowAll('overtimeStats')"
                    >
                      {{ attendanceShowAllStates.overtimeStats ? '收起' : '查看全部' }}
                    </button>
                  </div>
                </div>
                <div class="card-grid attendance-narrow-grid">
                  <div v-for="(stat, idx) in getAttendanceDisplayList('overtimeStats')" :key="'attendance-overtime-' + idx + '-' + stat.dimensionName" class="card attendance-stat-item">
                    <span
                      class="attendance-stat-name"
                      :class="{ 'attendance-stat-name-link': !!stat.userId }"
                      @click="jumpToCheckingInDetail(stat)"
                    >{{ stat.dimensionName }}</span><span class="attendance-stat-count">{{ stat.count }}</span>
                  </div>
                </div>
              </div>
              <div class="sub-section">
                <div class="sub-section-title">工作量概览</div>
                <div class="mini-module-title mini-module-title-row">
                  <span>CR总数</span>
                  <div class="bug-stat-actions">
                    <button class="sort-button" @click="toggleAttendanceSort('crStats')">
                      <i :class="attendanceSortStates.crStats === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ attendanceSortStates.crStats === 'asc' ? '升序' : '降序' }}
                    </button>
                    <button
                      v-if="getWorkloadList('crStats').length > 10"
                      class="sort-button"
                      @click="toggleAttendanceShowAll('crStats')"
                    >
                      {{ attendanceShowAllStates.crStats ? '收起' : '查看全部' }}
                    </button>
                  </div>
                </div>
                <div class="card-grid attendance-narrow-grid">
                  <div v-for="(stat, idx) in getWorkloadDisplayList('crStats')" :key="'workload-cr-' + idx + '-' + stat.dimensionName" class="card attendance-stat-item">
                    <span class="attendance-stat-name">{{ stat.dimensionName }}</span><span class="attendance-stat-count">{{ stat.count }}</span>
                  </div>
                </div>
                <div class="mini-module-title mini-module-title-row">
                  <span>Bug处理数</span>
                  <div class="bug-stat-actions">
                    <button class="sort-button" @click="toggleAttendanceSort('bugFlowStats')">
                      <i :class="attendanceSortStates.bugFlowStats === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ attendanceSortStates.bugFlowStats === 'asc' ? '升序' : '降序' }}
                    </button>
                    <button
                      v-if="getWorkloadList('bugFlowStats').length > 10"
                      class="sort-button"
                      @click="toggleAttendanceShowAll('bugFlowStats')"
                    >
                      {{ attendanceShowAllStates.bugFlowStats ? '收起' : '查看全部' }}
                    </button>
                  </div>
                </div>
                <div class="card-grid attendance-narrow-grid">
                  <div v-for="(stat, idx) in getWorkloadDisplayList('bugFlowStats')" :key="'workload-bug-' + idx + '-' + stat.dimensionName" class="card attendance-stat-item">
                    <span class="attendance-stat-name">{{ stat.dimensionName }}</span><span class="attendance-stat-count">{{ stat.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SIM卡管理 -->
          <section id="sim-info" class="section">
            <div class="section-title"><i class="fas fa-sim-card"></i>SIM卡管理</div>
            <div class="card-grid">
              <div class="card">
                <div class="card-title">月度账单 (CNY)</div>
                <div class="card-value">{{ reportData.simCard.monthlyBill }}</div>
              </div>
              <div class="card">
                <div class="card-title">本周状态</div>
                <div class="card-value">{{ reportData.simCard.weeklyStatus }}</div>
              </div>
            </div>
          </section>
        </div>

        <!-- 加载中状态 -->
        <div v-else class="loading-state">
          正在加载报表数据...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f8fafc;
  overflow: hidden;
}

/* 侧边栏导航 */
.sidebar {
  width: 200px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  flex-shrink: 0;
  border-right: 1px solid #cbd5e1;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.8);
}

.nav-list {
  list-style: none;
  flex: 1;
  overflow-y: auto;
  padding: 0 10px;
}

.nav-item a {
  padding: 11px 12px;
  color: #475569;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 8px;
  margin-bottom: 6px;
}

.nav-item a:hover, .nav-item.active a {
  background: #ffffff;
  color: #1e293b;
  border-color: #cbd5e1;
}

.nav-item.active a {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #3730a3;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.12);
}

/* 主体内容 */
.main-content {
  flex: 1;
  padding: 24px;
  max-width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.header .date-range-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px 16px;
  border-radius: 24px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.header .date-range-container:hover, .header .date-range-container:focus-within {
  border-color: #4f46e5;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.header .date-picker {
  background: transparent;
  border: none;
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  padding: 4px 0;
}

.header .date-separator {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

/* 章节卡片样式 */
.section {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  scroll-margin-top: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-left: 4px solid #4f46e5;
  background: linear-gradient(90deg, #eef2ff 0%, #f8fafc 100%);
  border-radius: 10px;
}

.section-title i {
  color: #4f46e5;
  background: #e0e7ff;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.card-title {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 500;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

/* 状态卡片 */
.card.status-green { border-left: 4px solid #10b981; }
.card.status-yellow { border-left: 4px solid #f59e0b; }
.card.status-red { border-left: 4px solid #ef4444; }

.card.status-green .card-value { color: #10b981; }
.card.status-yellow .card-value { color: #f59e0b; }
.card.status-red .card-value { color: #ef4444; }

/* 人力资源头数卡片（紧凑 + 名称/数量并行） */
.headcount-card {
  padding: 10px 12px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.headcount-card .card-title {
  margin-bottom: 0;
  font-size: 12px;
}

.headcount-card .card-value {
  font-size: 18px;
  line-height: 1.2;
}

/* 子章节 */
.sub-section {
  margin-top: 24px;
}

.sub-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-module-title {
  margin: 14px 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.mini-module-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.parallel-two-fields {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.attendance-stat-item {
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.attendance-narrow-grid {
  grid-template-columns: minmax(0, 320px);
  gap: 8px;
}

.attendance-stat-name {
  font-size: 13px;
  color: #64748b;
}

.attendance-stat-name-link {
  color: #4338ca;
  cursor: pointer;
  text-decoration: underline;
}

.attendance-stat-count {
  font-weight: 700;
  color: #4f46e5;
}

/* 图表容器 */
.chart-container {
  height: 300px;
  width: 100%;
  margin-top: 10px;
}

/* 表格样式 */
.table-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
}

tr:hover td {
  background: #f1f5f9;
}

/* 徽章样式 */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.status-green { background: #dcfce7; color: #166534; }
.status-badge.status-yellow { background: #fef9c3; color: #854d0e; }
.status-badge.status-red { background: #fee2e2; color: #991b1b; }

/* 布局网格 */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

@media (max-width: 1024px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .sidebar { width: 0; transform: translateX(-100%); transition: transform 0.3s; }
  .main-content { max-width: 100%; }
}

.sort-button {
  background: #f1f5f9;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sort-button:hover {
  background: #e2e8f0;
  color: #4f46e5;
}

.view-page-button {
  margin-left: auto;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #93c5fd;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  line-height: 1.4;
  transition: all 0.2s;
}

.view-page-button:hover {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #60a5fa;
}

/* 缺陷面板优化 */
.bug-stat-block {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.bug-stat-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bug-stat-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.title-date-range {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  vertical-align: middle;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #64748b;
  font-size: 16px;
}
</style>
