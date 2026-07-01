<template>
  <basic-container>
    <SearchForm :searchForm="searchForm" @handleSubmit="handleSubmit">
    </SearchForm>
    <p style="color: red; padding-bottom: 20px">
      注：泰国数据计算起始节点为2026年1月1日；印度数据计算起始节点为2026年3月20日
    </p>
    <el-table height='800'
      :data="tableData"
      border
      :header-cell-style="headerCellStyle"
      style="width: 100%"
    >
      <!-- 字符串字段 -->
      <el-table-column
        prop="partsNumber"
        align="center"
        fixed="left"
        label="零件号"
        min-width="120"
      />
      <el-table-column
        prop="projectName"
        align="center"
        label="项目名称"
        min-width="120"
      />
      <el-table-column
        prop="supplierName"
        align="center"
        label="供应商名称"
        min-width="120"
      />
      <el-table-column
        prop="customName"
        align="center"
        label="客户名称"
        min-width="120"
      />
      <el-table-column
        prop="totalOrderUnpaidNumber"
        label="历史客户订单累计欠缴数量"
        min-width="120"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.totalOrderUnpaidNumber">
            {{ scope.row.totalOrderUnpaidNumber }}
            <!-- (截至日期：{{scope.row.orderEndDay}}) -->
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalOrderNeedNumber"
        label="历史客户订单需求数量"
        min-width="120"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.totalOrderNeedNumber">
            {{
              scope.row.totalOrderNeedNumber
                ? scope.row.totalOrderNeedNumber
                : "/"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalForecastOrderNeedNumber"
        label="历史客户预测需求数量"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="hadInvoicesNumber"
        label="历史开票数量"
        min-width="140"
        align="center"
      />
      <el-table-column
        prop="totalStock"
        label="SOIMT当前库存"
        min-width="140"
        align="center"
      />
      <el-table-column
        v-if="isOpen"
        prop="supplierPayingNumber"
        label="供应商交付在途"
        min-width="120"
        align="center"
      />
      <el-table-column
        v-if="isOpen"
        prop="seaWaitSendNumber"
        label="海运待发"
        align="center"
        min-width="120"
      />
      <el-table-column
        v-if="isOpen"
        prop="flyWaitSendNumber"
        label="订舱待空运"
        align="center"
        min-width="120"
      />
      <el-table-column
        v-if="isOpen"
        prop="flySendNumber"
        label="空运已发"
        min-width="120"
      />
      <!-- <el-table-column prop="" label="欠缴明细" min-width="420">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.unPaidList"
            style="width: 100%"
            :show-header="false"
          >
            <el-table-column
              prop="arrivalSomitWarehouseDate"
              label=""
              width="180"
            >
              <template slot-scope="scope1">
                日期：
                {{
                  scope1.row.arrivalSomitWarehouseDate
                    ? scope1.row.arrivalSomitWarehouseDate.substring(0, 11)
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="" width="180">
              <template slot-scope="scope1">
                欠缴数量：
                {{ scope1.row.uncoveredQty || scope1.row.customNeedNumber }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column> -->
      <el-table-column
        v-for="item in weekList"
        :key="item"
        prop="issueType"
        :label="item.titleStr"
        min-width="200"
      >
        <el-table-column label="需求" align="center">
          <template slot-scope="scope">
            <div>{{ getOrderMonth(scope.row, item) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="欠缴数量" align="center">
          <template slot-scope="scope">
            <div>{{ getUnPaidMonth(scope.row, item) }}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- <el-table-column prop="nextMonthNeed" label="4月需求" min-width="120" />
      <el-table-column prop="lastMonthNeed" label="5月需求" min-width="120" />  -->
      <!-- 整数字段（右对齐） -->
      <el-table-column
        prop="totalUnpaidOrder"
        label="欠交后续还需交付订单数"
        width="100"
        align="center"
      />
      <el-table-column
        prop="totalRealLoss"
        label="扣除最新发运（已发未开票）还欠数量"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{ getLoss(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalForecastOrderNeedNumber"
        label="欠交后续预测需求"
        width="140"
        align="center"
      />
      <el-table-column
        prop="totalOrderNeed"
        label="总欠交需求数"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{ getUnPadAll(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="month in monthColumns"
        :key="month.key"
        :label="month.label"
        min-width="300"
        align="center"
      >
        <el-table-column label="订单数" align="center" min-width="100">
          <template slot-scope="scope">
            <div>{{ getMonthData(scope.row, month.key, 'order') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库数" align="center" min-width="100">
          <template slot-scope="scope">
            <div>{{ getMonthData(scope.row, month.key, 'stockIn') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Open PO" align="center" min-width="100">
          <template slot-scope="scope">
            <div>{{ getMonthData(scope.row, month.key, 'openPo') }}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="累计Open PO"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{ getFinalOpenPo(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="gapTime"
        label="缺口时间"
        width="130"
        align="center"
      />
      <el-table-column
        prop="isRisk"
        label="是否有风险"
        width="180"
        align="center"
      >
      </el-table-column>

      <el-table-column prop="issueType" label="问题类型" min-width="200" />
      <!-- 长文本字段 -->
     <el-table-column
        prop="deliveryAndMeasures"
        label="交付状态和措施"
        min-width="200"
      >
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.deliveryAndMeasures || ''" placement="top" :disabled="!scope.row.deliveryAndMeasures">
            <div class="two-line-text">{{ scope.row.deliveryAndMeasures }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="editRow(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="更新客户订单信息"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="零件号">
          <el-input v-model="editForm.partsNumber"></el-input>
        </el-form-item>
        <el-form-item label="供应商交付在途">
          <el-input v-model="editForm.supplierPayingNumber"></el-input>
        </el-form-item>
        <el-form-item label="海运待发">
          <el-input v-model="editForm.seaWaitSendNumber"></el-input>
        </el-form-item>
        <el-form-item label="订舱待空运">
          <el-input v-model="editForm.flyWaitSendNumber"></el-input>
        </el-form-item>
        <el-form-item label="空运已发">
          <el-input v-model="editForm.flySendNumber"></el-input>
        </el-form-item>
        <el-form-item label="缺口时间">
          <el-input type="textarea" v-model="editForm.gapTime"></el-input>
        </el-form-item>
        <el-form-item label="是否有风险">
          <el-radio-group v-model="editForm.isRisk">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-input v-model="editForm.issueType"></el-input>
        </el-form-item>
        <el-form-item label="交付状态和措施">
          <el-input
            type="textarea"
            v-model="editForm.deliveryAndMeasures"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" :label-width="formLabelWidth">
          <upload
            :fileList="form.fileList"
            btnName="上传"
            @handleRequest="handleRequest"
            :multiple="true"
            :showFileList="true"
          ></upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="[10, 20, 50, 100]"
        :current-page="form.current"
        :page-size="form.size"
        :total="form.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </basic-container>
</template>

<script>
// import { partsName } from "@/util/formSelectList";
// import { selectPage, exportPage } from "@/api/substitute/stock";
import {
  downBlobFile,
  getYearMonthNum,
  getYear,
  getMonth,
  generateWeeksFrom,
} from "@/util/util";
import upload from "@/components/upload/index";
import CustomerOrderApi from "@/api/customerOrder/index";
export default {
  components: { upload },
  data() {
    return {
      stockStatus: null,
      type: null,
      dialogVisible: false,
      partsNos: null,
      outStock: false,
      monthColumns: [], // 动态月份列配置
      partsNos: null,
      outStock: false,
      editForm: {
        partsNumber: null,
        gapTime: null,
        isRisk: null,
        issueType: null,
        yearMonthOrder: null,
        deliveryAndMeasures: null,
        fileList: [],
      },
      weekList: [],
      form: {
        current: 1,
        size: 10,
        total: 0,
        year: 2026,
        month: 3,
        yearMonth: null,
      },
      isOpen: false,
      searchForm: {
        column: [
          {
            label: this.$t("stock.partsNo"),
            prop: "partsNumber",
          },
        ],
        btnList: [
          {
            name: "展开",
            icon: "el-icon-setting",
            onClick: () => {
              this.setOpenOrClose();
            },
          },
          {
            name: this.$t("orderManage.export"),
            icon: "el-icon-setting",
            onClick: () => {
              this.exportPageData();
            },
          },
        ],
      },
      tableData: [],
    };
  },

  activated() {
    this.init();
  },
  mounted() {
    this.form.yearMonth = getYearMonthNum();
    this.form.year = getYear();
    this.form.month = getMonth();
    this.init();
  },
  methods: {
    async getWeekList() {
      let res = await CustomerOrderApi.getWeekList(generateWeeksFrom());
      if (res.data.code === 200 || res.data.code === 0) {
        this.weekList = res.data.data;
        console.log(this.weekList);
      }
    },
    setOpenOrClose() {
      this.isOpen = !this.isOpen;
      this.searchForm.btnList[0].name = this.isOpen ? "折叠" : "展开";
    },
    handleRequest(row, arr) {
      this.editForm.fileList = arr;
    },
    getUnPaidMonth(row, item) {
      if (row.unPaidList && row.unPaidList.length > 0) {
        let arr = row.unPaidList.filter((ele) => {
          return this.isBetween(
            ele.arrivalSomitWarehouseDate,
            item.start,
            item.end
          );
        });
        const sum = arr.reduce((acc, obj) => acc + obj.uncoveredQty, 0);
        return sum || null;
      }
    },
    getLoss(row) {
      return (
        Number(row.totalUnpaidOrder || 0) -
        Number(row.totalStock || 0) -
        Number(row.supplierPayingNumber || 0) -
        Number(row.seaWaitSendNumber || 0) -
        Number(row.flyWaitSendNumber || 0) -
        Number(row.flySendNumber || 0)
      );
    },
    getOrderMonth(row, item) {
      if (row.unPaidList && row.unPaidList.length > 0) {
        let arr = row.unPaidList.filter((ele) => {
          return this.isBetween(
            ele.arrivalSomitWarehouseDate,
            item.start,
            item.end
          );
        });
        const sum = arr.reduce((acc, obj) => acc + obj.customNeedNumber, 0);
        return sum || null;
      }
    },
    headerCellStyle({ column, columnIndex }) {
      if (
        column.label === "欠交后续还需交付订单数" ||
        column.label === "欠交后续预测需求"
      ) {
        return {
          background: "#E6F7FF",
          color: "#2C3E50",
        };
      } else if (column.label === "总欠交需求数") {
        return {
          background: "#FFD966",
          color: "#2C3E50",
        };
      } else if (column.label === "扣除最新发运（已发未开票）还欠数量") {
        return {
          background: "#FFF3E0",
          color: "#2C3E50",
        };
      }
    },
    isBetween(target, start, end, inclusive = true) {
      const targetDate = new Date(target);
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (inclusive) {
        return targetDate >= startDate && targetDate <= endDate;
      } else {
        return targetDate > startDate && targetDate < endDate;
      }
    },
    handleSubmit(form) {
      this.form  = {...this.form,...form}
      this.getList(form);
    },
    async exportPageData() {
      let obj= JSON.parse(JSON.stringify(this.form))
      obj.weekList = this.weekList
      let res = await CustomerOrderApi.exportCustomerOrderSummary(obj);
      if (res.status === 200) {
        downBlobFile(res.data, "客户订单表.xlsx");
      }
    },
    async editRow(row) {
      if (row.orderDescId) {
        let res = await CustomerOrderApi.detailDesc(row.orderDescId);
        if (res.data.code === 0 || res.data.code === 200) {
          this.editForm = res.data.data;
        }
      } else {
        this.editForm = JSON.parse(JSON.stringify(row));
      }
      this.dialogVisible = true;
    },
    async onSubmit() {
      this.editForm.yearMonthOrder = this.form.yearMonth;
      let res = await CustomerOrderApi.submitMonthDesc(this.editForm);
      if (res.data.code === 200 || res.data.code === 0) {
        this.dialogVisible = false;
        this.getList(this.searchForm);
        console.log(this.form)
        console.log(this.searchForm)
        console.log('dddddddddddd')
      }
    },
    handleSizeChange(val) {
      this.form.current = 1;
      this.form.size = val;
      this.getList();
    },
    getUnPadAll(row) {
      return (
        Number(row.totalForecastOrderNeedNumber || 0) +
        Number(row.totalUnpaidOrder || 0)
      );
    },
    getMonthData(row, monthKey, type) {
      if (!row.monthData) return '/';
      const data = row.monthData[monthKey];
      if (!data) return '/';
      if (type === 'order') return data.orderQty || 0;
      if (type === 'stockIn') return data.stockInQty || 0;
      if (type === 'openPo') return data.openPo || 0;
      return '/';
    },
    getFinalOpenPo(row) {
      if (!row.monthData) return '/';
      // 使用row.maxMonth获取最后一个月的Open PO
      const year = this.form.year || new Date().getFullYear();
      const maxMonth = row.maxMonth || 12;
      const lastKey = `${year}${String(maxMonth).padStart(2, '0')}`;
      const lastData = row.monthData[lastKey];
      if (!lastData) return '/';
      return lastData.openPo || 0;
    },
    buildMonthColumns() {
      // 根据后端返回的maxMonth动态展示月份列（所有零件使用同一个maxMonth）
      const year = this.form.year || new Date().getFullYear();
      // 找到数据中最大的月份（使用第一条数据的maxMonth，因为所有零件共享同一个maxMonth）
      let maxMonth = 12; // 默认12月
      if (this.tableData && this.tableData.length > 0 && this.tableData[0].maxMonth) {
        maxMonth = Math.min(this.tableData[0].maxMonth, 12);
      }
      const cols = [];
      for (let m = 1; m <= maxMonth; m++) {
        const key = `${year}${String(m).padStart(2, '0')}`;
        cols.push({ key, label: key });
      }
      this.monthColumns = cols;
    },
    handleCurrentChange(val) {
      this.form.current = val;
      this.getList();
    },
    initialization(table) {
      this.tableData = table;
      this.buildMonthColumns();
    },
    async init() {
      this.buildMonthColumns();
      if (this.weekList.length === 0) {
        this.getWeekList();
      }
      this.getList(this.weekList);
    },
    getList(form) {
      let obj = { ...this.form, ...form };
      CustomerOrderApi.getSummaryTable(obj).then((res) => {
        this.initialization(res.data.data.records);
        this.form.total = res.data.data.total;
      });
    },
    handleSelectionChange(val) {
      this.partsNos = val.map((item) => item.partsNo).join(",");
    },
    close(val) {
      this.outStock = false;
      if (val) {
        this.getList();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.two-line-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  max-height: 3em;
  cursor: pointer;
}
</style>
