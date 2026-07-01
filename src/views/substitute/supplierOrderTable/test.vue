<template>
  <div class="data-table-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :span-method="objectSpanMethod"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <!-- 分组表头 -->
      <el-table-column prop="project" label="项目" width="120" align="center"></el-table-column>
      <el-table-column prop="supplier" label="供应商" width="140" align="center"></el-table-column>
      <el-table-column prop="partNo" label="零件号" width="150" align="center"></el-table-column>
      
      <!-- 带下拉选择的列 -->
      <el-table-column prop="orderType" label="订单类型" width="160" align="center">
        <template slot-scope="scope">
          <el-select 
            v-model="scope.row.orderType" 
            placeholder="请选择"
            size="small"
            @change="handleOrderTypeChange(scope.row)"
          >
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span>
                <i :class="item.icon" style="margin-right: 8px;"></i>
                {{ item.label }}
              </span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      
      <!-- 月份分组表头 -->
      <el-table-column label="月份统计" align="center">
        <el-table-column prop="month1" label="1月" width="80" align="right"></el-table-column>
        <el-table-column prop="month2" label="2月" width="80" align="right"></el-table-column>
        <el-table-column prop="month3" label="3月" width="80" align="right"></el-table-column>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  data() {
    return {
      // 订单类型下拉选项
      orderTypeOptions: [
        { value: 'delivered', label: '已交客户', icon: 'el-icon-check' },
        { value: 'owed', label: '欠缴客户订单', icon: 'el-icon-warning' },
        { value: 'supplier', label: '供应商订单', icon: 'el-icon-goods' },
        { value: 'customer', label: '客户订单', icon: 'el-icon-document' },
        { value: 'control', label: '(Ctrl)', icon: 'el-icon-folder' }
      ],
      // 表格数据
      tableData: [
        {
          id: 1,
          project: '项目A',
          supplier: '供应商1',
          partNo: 'PN-001',
          orderType: 'delivered',
          month1: 2.5,
          month2: 1.8,
          month3: 3.2,
          rowspan: 3 // 用于合并单元格
        },
        {
          id: 2,
          project: '项目A',
          supplier: '供应商1',
          partNo: 'PN-002',
          orderType: 'owed',
          month1: 1.2,
          month2: 2.1,
          month3: 1.5
        },
        {
          id: 3,
          project: '项目A',
          supplier: '供应商2',
          partNo: 'PN-003',
          orderType: 'supplier',
          month1: 2.0,
          month2: 1.5,
          month3: 2.8
        },
        {
          id: 4,
          project: '项目B',
          supplier: '供应商3',
          partNo: 'PN-004',
          orderType: 'customer',
          month1: 1.8,
          month2: 2.3,
          month3: 1.9,
          rowspan: 2
        },
        {
          id: 5,
          project: '项目B',
          supplier: '供应商3',
          partNo: 'PN-005',
          orderType: 'delivered',
          month1: 2.2,
          month2: 1.6,
          month3: 2.1
        }
      ],
      // 合并单元格配置
      spanArr: [], // 存储合并信息
      pos: 0
    }
  },
  created() {
    this.getSpanArr(this.tableData)
  },
  methods: {
    // 计算合并单元格信息
    getSpanArr(data) {
      this.spanArr = []
      this.pos = 0
      
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前项目是否与上一行相同
          if (data[i].project === data[i - 1].project) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    
    // 单元格合并方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 只对"项目"列进行合并（第0列）
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    
    // 表头样式
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return {
          backgroundColor: '#f5f7fa',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '14px'
        }
      }
      return {
        backgroundColor: '#fafafa',
        color: '#666'
      }
    },
    
    // 单元格样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // 数值列右对齐
      if (['month1', 'month2', 'month3'].includes(column.property)) {
        return {
          textAlign: 'right',
          paddingRight: '12px'
        }
      }
      return {
        textAlign: 'center'
      }
    },
    
    // 订单类型变更
    handleOrderTypeChange(row) {
      console.log('订单类型变更:', row)
      this.$message.success(`已更新订单类型`)
    },
    
    // 编辑行
    handleEdit(row) {
      console.log('编辑行:', row)
      this.$message.info(`正在编辑: ${row.partNo}`)
    }
  }
}
</script>

<style scoped>
.data-table-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

/* 下拉选择器样式 */
.el-select {
  width: 100%;
}

/* 表格行悬停效果 */
.el-table__row:hover > td {
  background-color: #ecf5ff !important;
}

/* 分组表头样式 */
.el-table .el-table__header-wrapper .el-table__header thead tr:first-child th {
  background-color: #f5f7fa;
}
</style>