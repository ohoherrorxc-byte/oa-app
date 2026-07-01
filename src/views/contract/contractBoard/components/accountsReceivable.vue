<template>
  <div class="accounts-receivable">
    <!-- 导出按钮 -->
    <el-button type="primary" @click="exportData" class="fr mr60 mb20" icon="el-icon-top">{{ $t('commonContent.exportL') }}</el-button>
    <!-- 主表：应收账款汇总 -->
    <el-table :data="sortedTableData" v-loading="showLoading"
      class="receivable-table"
      :row-class-name="getMainTableRowClass"
      :header-cell-style="getMainHeaderStyle"
      style="width: 100%">
      <!-- 客户名称 -->
      <el-table-column
        prop="customerName"
        :label="$t('salesAmountWaterfullBoard.customer')"
        align="center"
        width="120"
        label-class-name="customer-name-header">
      </el-table-column>
      <!-- 未回款总额（支持升降序） -->
      <el-table-column prop="notReceiveTotalAmount" align="center" width="180">
        <template slot="header">
          <div class="amount-sort-header">
            <span class="header-title">{{ $t('salesAmountWaterfullBoard.notReceiveTotalAmount') }}</span>
            <span class="sort-actions">
              <span class="sort-action" :class="{ active: sortKey === 'notReceiveTotalAmount' && sortOrder === 'asc' }"
                @click="setAmountSort('notReceiveTotalAmount', 'asc')">↑</span>
              <span class="sort-action" :class="{ active: sortKey === 'notReceiveTotalAmount' && sortOrder === 'desc' }"
                @click="setAmountSort('notReceiveTotalAmount', 'desc')">↓</span>
            </span>
          </div>
        </template>
        <template slot-scope="scope">
          <span class="table-link" @click="openInvoiceDialog(scope.row, 'notReceive')">
            {{ formatterNumber(scope.row, null, scope.row.notReceiveTotalAmount) }}
          </span>
        </template>
      </el-table-column>
      <!-- 未到期金额（支持升降序） -->
      <el-table-column prop="notDateAmount" align="center" width="180">
        <template slot="header">
          <div class="amount-sort-header">
            <span class="header-title">{{ $t('salesAmountWaterfullBoard.notDateAmount') }}</span>
            <span class="sort-actions">
              <span class="sort-action" :class="{ active: sortKey === 'notDateAmount' && sortOrder === 'asc' }"
                @click="setAmountSort('notDateAmount', 'asc')">↑</span>
              <span class="sort-action" :class="{ active: sortKey === 'notDateAmount' && sortOrder === 'desc' }"
                @click="setAmountSort('notDateAmount', 'desc')">↓</span>
            </span>
          </div>
        </template>
        <template slot-scope="scope">
          <span class="table-link" @click="openInvoiceDialog(scope.row, 'notDate')">
            {{ formatterNumber(scope.row, null, scope.row.notDateAmount) }}
          </span>
        </template>
      </el-table-column>
      <!-- 逾期金额（支持升降序） -->
      <el-table-column prop="overdueAmount" align="center" width="180">
        <template slot="header">
          <div class="amount-sort-header">
            <span class="header-title">{{ $t('salesAmountWaterfullBoard.overdueAmount') }}</span>
            <span class="sort-actions">
              <span class="sort-action" :class="{ active: sortKey === 'overdueAmount' && sortOrder === 'asc' }"
                @click="setAmountSort('overdueAmount', 'asc')">↑</span>
              <span class="sort-action" :class="{ active: sortKey === 'overdueAmount' && sortOrder === 'desc' }"
                @click="setAmountSort('overdueAmount', 'desc')">↓</span>
            </span>
          </div>
        </template>
        <template slot-scope="scope">
          <span class="table-link" @click="openInvoiceDialog(scope.row, 'overdue')">
            {{ formatterNumber(scope.row, null, scope.row.overdueAmount) }}
          </span>
        </template>
      </el-table-column>
      <!-- 逾期占比进度条 -->
      <el-table-column prop="overdueProportion" :label="$t('salesAmountWaterfullBoard.overdueProportion')" align="center" width="120">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="22" :percentage="scope.row.overdueProportion"
            status="warning"></el-progress>
        </template>
      </el-table-column>
      <!-- 账龄分析分组列 -->
      <el-table-column :label="$t('salesAmountWaterfullBoard.accountAgeAnalysis')" align="center">
        <el-table-column prop="threeMonth" :formatter="formatterNumber" label="2个月（60天）" align="center" width="120">
        </el-table-column>
        <el-table-column prop="halfYear" :formatter="formatterNumber" label="半年（60~180天）" align="center" width="120">
        </el-table-column>
        <el-table-column prop="oneYear" label="一年（180~365天）" align="center" :formatter="formatterNumber" width="120">
        </el-table-column>
        <el-table-column prop="oneToTwoYear" label="1-2年（365~730天）" :formatter="formatterNumber" align="center" width="120">
        </el-table-column>
        <el-table-column prop="twoYear" label="2年以上（730天以上）"  align="center" :formatter="formatterNumber" width="120">
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 发票明细弹窗 -->
    <el-dialog :visible.sync="invoiceDialogVisible" :append-to-body="true" width="90%">
      <span slot="title" class="invoice-dialog-title-wrap">
        <span class="invoice-dialog-title">发票列表</span>
        <span class="invoice-dialog-total">总金额：{{ $formatAmt(invoiceTotalAmount) }}</span>
      </span>
      <el-table :data="invoiceList" v-loading="invoiceLoading" class="invoice-table" :header-cell-style="getDialogHeaderStyle" style="width: 100%; margin-top: 10px" stripe
        align="center" border height="420px">
        <el-table-column prop="titleName" label="发票名称" align="center" width="280" />
        <el-table-column prop="invoiceNo" label="发票号" align="center" width="150" />
        <el-table-column prop="applyDate" label="开票日期" align="center" width="150" />
        <el-table-column label="账期（天）" align="center" width="90">
          <template slot-scope="scope">
            {{ accountingPeriodDays(scope.row.applyDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="salesContractName" label="相关合同" align="center" width="220" />
        <el-table-column prop="currency" label="币种" align="center" width="80" />
        <el-table-column prop="invoicingAmount" label="发票金额" align="center" width="150" />
        <el-table-column prop="subscribeTotalAmount" label="已认款金额" align="center" width="150" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerInvoiceList, exportActivationDetails, getInvoiceListByInvoiceNoList } from '@/api/billManage/activationDetails'
import { downBlobFile } from "@/util/util";
export default {
  data() {
    return {
      // 主表数据
      tableData: [],
      // 主表加载状态
      showLoading:false,
      // 当前排序字段
      sortKey: '',
      // 当前排序方向（asc/desc）
      sortOrder: '',
      // 发票弹窗开关
      invoiceDialogVisible: false,
      // 发票弹窗表格加载状态
      invoiceLoading: false,
      // 发票明细列表
      invoiceList: [],
    }
  },
  computed: {
    // 根据当前排序状态返回排序后的表格数据
    sortedTableData() {
      const list = Array.isArray(this.tableData) ? [...this.tableData] : []
      if (!this.sortKey || !this.sortOrder) return list
      const order = this.sortOrder === 'asc' ? 1 : -1
      return list.sort((a, b) => (this.getSortValue(a[this.sortKey]) - this.getSortValue(b[this.sortKey])) * order)
    },
    // 发票明细总金额
    invoiceTotalAmount() {
      const list = Array.isArray(this.invoiceList) ? this.invoiceList : []
      const invoicingTotal = list.reduce((sum, item) => {
        const amount = this.getSortValue(item && item.invoicingAmount)
        const currency = item && item.currency
        const convertedAmount = currency === 'USD' ? amount * 7.18 : amount
        return sum + convertedAmount
      }, 0)
      const subscribeTotal = list.reduce((sum, item) => sum + this.getSortValue(item && item.subscribeTotalAmount), 0)
      return invoicingTotal - subscribeTotal
    }
  },
  mounted() {
    // 组件加载后拉取主表数据
    this.getList()
  },
  methods: {
    // 导出当前应收账款数据
    async exportData(){
      let res = await exportActivationDetails()
      console.log(res)
      downBlobFile(res.data, '发票认款信息表')

    },
    // 查询主表数据
    async getList() {
      this.showLoading = true
      let res = await getCustomerInvoiceList()
      // console.log(res)
      this.showLoading = false
      // console.log('getList')
      if (res.data.code === 200 || res.data.code === 0) {
        this.tableData = res.data.data
        this.showLoading = false
      }
    },
    formatterNumber(row, column, cellValue, index) {
      // 统一金额格式化入口
      return this.$formatAmt(cellValue)
    },
    // 设置排序字段与方向
    setAmountSort(key, order) {
      this.sortKey = key
      this.sortOrder = order
    },
    // 将金额值标准化为可比较的数字（兼容空值、字符串、千分位）
    getSortValue(value) {
      if (value === null || value === undefined || value === '') return 0
      if (typeof value === 'number') return value
      const normalized = String(value).replace(/,/g, '')
      const numberValue = Number(normalized)
      return Number.isNaN(numberValue) ? 0 : numberValue
    },
    getMainTableRowClass({ rowIndex }) {
      // 隔行背景样式
      return rowIndex % 2 === 1 ? 'receivable-row-alt' : ''
    },
    // 主表头样式
    getMainHeaderStyle() {
      return {
        background: '#f3f6fb',
        color: '#334155',
        'font-weight': '700',
        'font-size': '14px'
      }
    },
    getDialogHeaderStyle() {
      // 弹窗表头样式
      return {
        background: '#f7f9fc',
        color: '#334155',
        'border-bottom': '1px solid #e5ebf3',
        'font-weight': '700',
        'font-size': '14px'
      }
    },
    /** 账期：今天与开票日期的日历天数差（正数为开票日早于今天） */
    accountingPeriodDays(applyDate) {
      if (applyDate === null || applyDate === undefined || applyDate === '') return '-'
      const str = String(applyDate).trim()
      const datePart = str.length >= 10 ? str.slice(0, 10) : str
      const parts = datePart.split(/[-/]/)
      let inv
      if (parts.length >= 3) {
        const y = Number(parts[0])
        const mo = Number(parts[1]) - 1
        const da = Number(parts[2])
        if (!y || mo < 0 || mo > 11 || !da) return '-'
        inv = new Date(y, mo, da)
      } else {
        inv = new Date(str)
      }
      if (Number.isNaN(inv.getTime())) return '-'
      const now = new Date()
      const invDay = new Date(inv.getFullYear(), inv.getMonth(), inv.getDate()).getTime()
      const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      return Math.round((todayDay - invDay) / (24 * 60 * 60 * 1000))
    },
    normalizeInvoiceNoList(value) {
      // 将发票号统一转换为数组，兼容数组/逗号分隔字符串
      if (!value) return []
      if (Array.isArray(value)) {
        return value.filter(item => item !== null && item !== undefined && item !== '')
      }
      if (typeof value === 'string') {
        return value
          .split(',')
          .map(item => item.trim())
          .filter(item => item)
      }
      return []
    },
    async openInvoiceDialog(row, type) {
      // 根据点击的金额类型映射对应的发票号字段
      const listKeyMap = {
        notReceive: 'notReceiveInvoiceNoList',
        notDate: 'notDateInvoiceNoList',
        overdue: 'overdueInvoiceNoList',
      }
      const listKey = listKeyMap[type]
      if (!listKey) return
      const invoiceNoList = this.normalizeInvoiceNoList(row[listKey])
      if (invoiceNoList.length === 0) {
        // 无发票号时仅打开空弹窗
        this.invoiceList = []
        this.invoiceDialogVisible = true
        return
      }
      const params = { invoiceNoList }
      this.invoiceLoading = true
      this.invoiceDialogVisible = true
      try {
        // 查询发票明细
        const res = await getInvoiceListByInvoiceNoList(params)
        if (res.data.code === 200 || res.data.code === 0) {
          this.invoiceList = res.data.data || []
        } else {
          this.invoiceList = []
          this.$message.error(res.data.message || '查询发票列表失败')
        }
      } catch (error) {
        this.invoiceList = []
        this.$message.error('查询发票列表失败')
      } finally {
        this.invoiceLoading = false
      }
    },
    // 预留方法：当前未使用
    tableHeaderColor() {
      return 'background:#EBEDFO'
    }
  }
}
</script>

<style scoped>
/* 外层卡片容器 */
.accounts-receivable {
  background: #fff;
  border-radius: 12px;
  padding: 16px 16px 12px;
  box-shadow: 0 6px 18px rgba(26, 54, 93, 0.06);
}
.invoice-dialog-title-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  padding-right: 28px;
  box-sizing: border-box;
}
.invoice-dialog-title {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
}
.invoice-dialog-total {
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: #409eff;
  text-align: right;
  white-space: nowrap;
}
::v-deep ep .el-dialog__header .el-dialog__title {
  display: block;
}
/* 金额可点击文本 */
.table-link {
  color: #409eff;
  cursor: pointer;
  font-weight: 500;
}
.table-link:hover {
  color: #2f89e7;
  text-decoration: underline;
}
/* 金额表头（标题 + 排序按钮）容器 */
.amount-sort-header {
  display: inline-flex;
  align-items: center;
  gap: 0;
}
/* 排序列标题文本 */
.header-title {
  padding-right: 6px;
  font-weight: 700;
  color: #334155;
}
/* 排序按钮区域 */
.sort-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  border-left: 1px solid #dcdfe6;
  padding-left: 8px;
}
/* 单个排序按钮 */
.sort-action {
  color: #7f8ea3;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid #d7dee8;
  user-select: none;
  transition: all 0.18s ease;
  background: #f7f9fc;
}
.sort-action:hover {
  background: #eaf3ff;
  color: #2f80ed;
  border-color: #9bc4ff;
  transform: translateY(-1px);
}
.sort-action.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.35);
  transform: translateY(-1px);
}
::v-deep ep .receivable-table {
  /* 主表容器：圆角及内容裁剪 */
  border-radius: 10px;
  overflow: hidden;
}
::v-deep ep .receivable-table th.el-table__cell {
  /* 主表头基础样式：背景、字体、字重 */
  background: #f3f6fb !important;
  color: #334155 !important;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.2px;
}
::v-deep ep .receivable-table .el-table__header th.el-table__cell {
  /* 统一表头边框，避免分组交界出现异常线条 */
  background-clip: padding-box;
  border-right: 1px solid #e3eaf3;
  border-bottom: 1px solid #dfe6f0 !important;
}
::v-deep ep .receivable-table .el-table__header tr th.el-table__cell:last-child {
  /* 最后一列去掉右边框，避免右侧重复线 */
  border-right: none;
}
::v-deep ep .receivable-table .el-table__header-wrapper th.is-leaf {
  /* 叶子表头与分组表头底边保持一致 */
  border-bottom: 1px solid #dfe6f0 !important;
}
::v-deep ep .receivable-table.el-table thead.is-group tr:first-of-type th:first-of-type:before,
::v-deep ep .receivable-table.el-table thead.is-group tr:first-of-type th:first-of-type::before {
  /* 覆盖 saic 页面写入的全局分组表头斜线，仅在本页禁用 */
  content: none !important;
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  transform: none !important;
}
::v-deep ep .receivable-table td.el-table__cell {
  /* 主表内容区分割线颜色 */
  border-bottom-color: #eef2f7;
}
::v-deep ep .receivable-table .receivable-row-alt td {
  /* 隔行底色，增强可读性 */
  background: #fbfcff;
}
::v-deep ep .receivable-table .el-table__row:hover > td {
  /* 行悬浮高亮反馈 */
  background: #f2f7ff !important;
}
::v-deep ep .invoice-table {
  /* 弹窗表格容器 */
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
}
::v-deep ep .invoice-table th.el-table__cell {
  /* 弹窗表头样式 */
  background: #f7f9fc;
  color: #334155;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.2px;
}
::v-deep ep .invoice-table .el-table__body .cell {
  /* 弹窗内容单元格自动换行，展示完整文本 */
  white-space: normal !important;
  word-break: break-all;
  line-height: 20px;
}
::v-deep ep .invoice-table .el-table__header-wrapper table,
::v-deep ep .invoice-table .el-table__body-wrapper table {
  /* 避免列整体挤在中间，强制占满容器宽度 */
  width: 100% !important;
  margin: 0 !important;
}
::v-deep ep .receivable-table th.gutter {
  /* 隐藏表头自动 gutter（滚动条占位列） */
  display: none !important;
}
::v-deep ep .receivable-table colgroup col[name='gutter'] {
  /* 隐藏内容区对应 gutter 列，避免右侧留白 */
  display: none !important;
}
</style>
