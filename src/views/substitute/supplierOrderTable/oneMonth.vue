<template>
  <basic-container>
    <el-row class="text-center">
      <el-col :span="24">供应商订单状态一览表</el-col>
    </el-row>
    <el-row class="mt20">
      <SearchForm
        v-if="!isEmail"
        :searchForm="searchForm"
        @handleSubmit="getList"
        @refresh="getList"
      >
      </SearchForm>
    </el-row>
    <el-table
      row-key="id"
      :data="supplierOrderList"
      style="width: 100%"
      class="mt20"
      :span-method="objectSpanMethod"
      :cell-style="getCellClass"
    >
      <el-table-column type="index" width="50" align="center">
      </el-table-column>
      <el-table-column prop="partsName" label="项目" width="250" align="center">
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商"
        width="150"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="partsNumber"
        label="零件号"
        width="150"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-for="itemM in monthList"
        :key="itemM"
        :label="itemM"
        align="center"
        width="500"
      >
        <el-table-column
          prop="arrears"
          label="历史欠缴"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row[itemM].arrears }}
            <!-- {{ scope.row[itemM][arrears]}} -->
            <!-- <div>{{ scope.row[item][needNumberManual] || scope.row.needNumber }}</div> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="needNumber"
          label="当月订单"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row[itemM].needNumber }}
            <!-- <div>{{ scope.row[item][needNumberManual] || scope.row.needNumber }}</div> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="stockInNumber"
          label="已交"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row[itemM]["stockInNumber"] }}
              <!-- {{ scope.row[item][stockInNumberManual] || scope.row.stockInNumber }} -->
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="stockInNumber"
          label="总订单"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div>
                {{ scope.row[itemM]["orderTotal"]}}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="percentagePaid"
          label="已交百分比"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <!-- {{ scope.row[itemM].percentagePaid }} -->
              {{
                getRowPercentagePaid(scope.row, itemM) +
                (getRowPercentagePaid(scope.row, itemM) === "/" ? "" : "%")
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center">
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="updateStock(scope.row)"></i>
          </template>
        </el-table-column> -->
      </el-table-column>
    </el-table>
    <el-row v-if="!isEmail" class="my30 text-center">
      <el-col>
        <el-button type="primary" @click="previewEmail">邮件预览</el-button>
      </el-col>
    </el-row>
    <emailModelVue ref="emailMode"></emailModelVue>
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="70%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <div>
        <el-form label-width="150px">
          <el-form-item label="零件号">
            <div>{{ editForm.partsNumber }}</div>
          </el-form-item>
          <el-form-item label="历史欠缴">
            <el-input v-model="editForm.arrears"></el-input>
          </el-form-item>
          <el-form-item :label="'当月订单'">
            <el-input v-model="editForm.needNumberManual"></el-input>
          </el-form-item>
          <el-form-item :label="' 已交'">
            <el-input v-model="editForm.stockInNumberManual"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="editForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import substituteOrderManageApi from "@/api/substitute/orderManage";
import { yearMonth } from "@/util/util";
import emailModelVue from "./emailModel.vue";
import data from "./data";

export default {
  data() {
    return {
      monthList: ["10月"],
      spanArr: [],
      dialogVisible: false,
      editForm: {
        needNumberManual: null,
        stockInNumberManual: null,
        remark: null,
      },
      supplierOrderList: [],
      searchForm: {
        column: [
          // {
          //   label: "月份",
          //   prop: "yearMonth",
          //   type: "month",
          //   format: "yyyy-MM",
          //   valueFormat: "yyyy-MM",
          // },
          {
            label: "零件号",
            prop: "partsNumber",
            type: "input",
          },
          // {
          //   label: "项目名称",
          //   prop: "projectNo",
          //   type: "select",
          //   filterable: true,
          //   props: {
          //     label: "projectName",
          //     value: "projectNo",
          //   },
          //   dicUrl: "/api/oa-portal/contractProject/selectList",
          // },
        ],
      },
      form: {
        // yearMonth: null,
      },
    };
  },
  mounted() {
    // this.form.yearMonth = yearMonth();
    this.getList();
  },
  components: { emailModelVue },
  methods: {
    async getList(val) {
      if (val) {
        this.form = val;
        // this.form.yearMonth = this.form.yearMonth
        //   ? this.form.yearMonth
        //   : yearMonth();
      }
      this.monthList = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05"];
      this.form.monthList = this.monthList
      let res = await substituteOrderManageApi.supplierOrderList(this.form);
      if (res.data.code === 200 || res.data.code === 0) {
        this.supplierOrderList = res.data.data;
        this.supplierOrderList.map((ele) => {
          this.$set(ele, "isEdit", false);
        });
        this.dealSpan();
      }
      // console.log(11111111);
      // console.log(data);
    },

    getRowPercentagePaid(row, item) {
      let bottomValue =
        Number(row[item].arrears) +
        (Number(row[item].stockInNumberManual) ||
          Number(row[item].stockInNumber));
      let data = "/";
      if (bottomValue) {
        data = (
          ((Number(row[item].stockInNumberManual) ||
            Number(row[item].stockInNumber)) /
            Number(bottomValue)) *
          100
        ).toFixed(2);
      }
      return data;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // isZero(row) {
    //   return Number(row.arrears) + Number(row.needNumber);
    // },
    previewEmail() {
      this.$refs.emailMode.doOpen(this.supplierOrderList, this.monthList);
      this.$refs.emailMode.dialogVisibleEmail = true;
    },
    updateStock(row) {
      console.log(row);
      this.dialogVisible = true;
      this.editForm = row;
    },
    async confirm() {
      this.editForm.monthList = this.monthList;
      let res = await substituteOrderManageApi.addOrUpdatePredictStock(
        this.editForm
      );
      if (res.data.code === 200 || res.data.code === 0) {
        this.dialogVisible = false;
        this.getList();
      }
    },
    dealSpan() {
      this.spanArr = [];
      let pos = 0;
      this.supplierOrderList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          pos = 0;
        } else {
          if (
            this.supplierOrderList[index].orderId ===
            this.supplierOrderList[index - 1].orderId
          ) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = index;
          }
        }
      });
    },
    async saveProdictStock(row) {
      let obj = {
        partsNumber: row.partsNumber,
        projectNo: row.projectNo,
        predictYearMonth: this.form.yearMonth,
        predictNumber: row.predictNumber,
        supplierNo: row.supplierNo,
      };
      let res = await substituteOrderManageApi.addOrUpdatePredictStock(obj);
      if (res.data.code === 0 || res.data.code === 200) {
        this.$message.success("已更新");
        row.isEdit = false;
      }
    },
    getCellClass({ row, column, rowIndex, columnIndex }) {
      let obj = {
        7: "2026-01",
        12: "2026-02",
        17: "2026-03",
        22: "2026-04",
        27: "2026-05",
      };
      // 例如：根据 status 字段设置背景色
      if (column.property === "percentagePaid") {
        if (
          Number(this.getRowPercentagePaid(row, obj[columnIndex])) > 50 &&
          Number(this.getRowPercentagePaid(row, obj[columnIndex])) < 100
        ) {
          return {
            backgroundColor: "#EEAD0E",
            color: "white",
          };
        } else if (
          Number(this.getRowPercentagePaid(row, obj[columnIndex])) >= 100
        ) {
          return {
            backgroundColor: "#67C23A",
            color: "white",
          };
        } else if (
          Number(this.getRowPercentagePaid(row, obj[columnIndex])) <= 50
        ) {
          return {
            backgroundColor: "#EE3B3B",
            color: "white",
          };
        }
      }
      if (column.property === "predictNumber") {
        if (!row.predictNumber) return;
        if (Number(row.predictNumber) > Number(row.needNumber) * 0.5) {
          return {
            backgroundColor: "#EE3B3B",
            color: "white",
          };
        } else if (
          Number(row.predictNumber) < Number(row.needNumber) * 0.5 ||
          Number(row.predictNumber) === Number(row.needNumber) * 0.5
        ) {
          return {
            backgroundColor: "#67C23A",
            color: "white",
          };
        }
      }
      // 其他列或默认样式
      return {};
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        const span = this.spanArr[rowIndex];
        if (span && span > 0) {
          return { rowspan: span, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
      return { rowspan: 1, colspan: 1 };
    },
  },
};
</script>

<style scoped lang='scss'>
</style>