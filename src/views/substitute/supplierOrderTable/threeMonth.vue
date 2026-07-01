<template>
  <basic-container>
    <el-row class="text-center">
      <el-col :span="24">供应商订单状态一览表</el-col>
    </el-row>
    <el-row class="mt20" v-if="!isFlow">
      <SearchForm
        :searchForm="searchForm"
        @handleSubmit="getList"
        @refresh="getList"
      >
      </SearchForm>
      <!-- <search-form></search-form> -->
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
      <!-- <el-table-column
        v-if="!isFlow"
        prop="projectName"
        label="项目"
        width="250"
        align="center"
      >
      </el-table-column> -->
      <el-table-column
        prop="partsName"
        label="项目名称"
        width="200px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center">
      </el-table-column>
      <el-table-column prop="partsNumber" label="零件号" align="center">
      </el-table-column>
      <el-table-column :label="monthList[0]" align="center">
        <el-table-column prop="arrears" label="历史欠缴" align="center">
        </el-table-column>
        <el-table-column
          prop="needNumber"
          :label="monthList[0] + '应交'"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.needNumberManual || scope.row.needNumber }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="stockInNumber"
          label="已交"
          width="120"
          align="center"
        >
        </el-table-column> -->
        <el-table-column prop="predictNumber" label="实际库存" align="center">
          <template slot-scope="scope">
            <div>
              <!-- <div class="flex" v-if="scope.row.isEdit">
                <el-input v-model="scope.row.predictNumber"></el-input>
                <el-button
                  class="mr10 blue"
                  type="text"
                  @click="saveProdictStock(scope.row)"
                  >保 存</el-button
                >
              </div> -->
              <div>
                {{ scope.row.predictNumber || scope.row.stockNumberManual }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="monthList[1]" align="center" width="500">
        <el-table-column
          prop="nextNeedNumber"
          :label="monthList[1] + '应交'"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="nextPredictNumber"
          label="预测库存"
          align="center"
        >
          <!-- <template slot-scope="scope">
            <div class="flex" v-if="scope.row.isEdit">
             <el-input v-model="scope.row.nextPredictNumber"></el-input>
                <el-button
                  class="mr10 blue"
                  type="text"
                  @click="saveProdictStock(scope.row)"
                  >保 存</el-button
                >
              </div> -->
          <!-- <div>{{ scope.row.nextPredictNumber }}</div>
            </div>
          </template> -->
        </el-table-column>
      </el-table-column>
      <el-table-column :label="monthList[2]" align="center">
        <el-table-column
          prop="lastNeedNumber"
          :label="monthList[2] + '应交'"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lastPredictNumber"
          label="预测库存"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <!-- <div class="flex" v-if="scope.row.isEdit">
                <el-input v-model="scope.row.lastPredictNumber"></el-input>
                <el-button
                  class="mr10 blue"
                  type="text"
                  @click="saveProdictStock(scope.row)"
                  >保 存</el-button
                >
              </div> -->
              <div>{{ scope.row.lastPredictNumber }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="predictRemark"
        label="备注"
        align="center"
      ></el-table-column>
      <el-table-column v-if="!isFlow" fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="updateStock(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
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
            <!-- <div>{{ editForm.arrears }}</div> -->
          </el-form-item>
          <el-form-item :label="monthList[0] + ' 实际库存'">
            <el-input v-model="editForm.stockNumberManual"></el-input>
          </el-form-item>
          <!-- <el-form-item :label="monthList[0] + '应交'">
            <el-input v-model="editForm.needNumberManual"></el-input>
          </el-form-item> -->
          <!-- <el-form-item :label="monthList[1] + '应交'">
            <el-input v-model="editForm.nextNeedNumberManual"></el-input>
          </el-form-item> -->
          <el-form-item :label="monthList[1] + ' 预测库存'">
            <el-input v-model="editForm.nextPredictNumber"></el-input>
          </el-form-item>
          <!-- <el-form-item :label="monthList[2] + '应交'">
            <el-input v-model="editForm.lastNeedNumberManual"></el-input>
          </el-form-item> -->
          <el-form-item :label="monthList[2] + ' 预测库存'">
            <el-input v-model="editForm.lastPredictNumber"></el-input>
          </el-form-item>

          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="editForm.predictRemark"
            ></el-input>
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
import { yearMonth, getNextThreeMonths } from "@/util/util";
export default {
  data() {
    return {
      currentMonth: yearMonth(),
      monthList: ["10月"],
      spanArr: [],
      dialogVisible: false,
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
            prop: "partsNo",
            type: "input",
          },
          {
            label: "项目名称",
            prop: "partsName",
            type: "input",
            filterable: true,
            // props: {
            //   label: "projectName",
            //   value: "projectNo",
            // },
            // dicUrl: "/api/oa-portal/contractProject/selectList",
          },
        ],
      },
      form: {
        yearMonth: null,
      },
      editForm: {
        stockInNumber: null,
        stockInNumberManual: null,
        nextNeedNumberManual:null,
        lastNeedNumberManual:null,
        needNumberManual:null
      },
    };
  },
  mounted() {
    this.form.yearMonth = yearMonth();
    this.getList();
  },
  props: {
    isFlow: false,
    formData: {
      type: Object,
      default: {},
    },
  },
  methods: {
    async getList(val) {
      if (val) {
        this.form = val;
        this.form.yearMonth = this.form.yearMonth
          ? this.form.yearMonth
          : yearMonth();
      }
      let data = { ...this.form, ...this.formData };
      this.monthList = getNextThreeMonths(this.form.yearMonth);
      let res = await substituteOrderManageApi.supplierOrderList(data);
      if (res.data.code === 200 || res.data.code === 0) {
        this.supplierOrderList = res.data.data;
        this.supplierOrderList.map((ele) => {
          this.$set(ele, "isEdit", false);
        });
      }
      this.dealSpan();
    },
    async confirm() {
      this.editForm.monthList = this.monthList;
      if (
        Number(this.editForm.stockNumberManual) ===
        Number(this.editForm.predictNumber)
      ) {
        delete this.editForm.stockNumberManual;
      }
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
    updateStock(row) {
      row.isEdit = true;
      this.dialogVisible = true;
      this.editForm = JSON.parse(JSON.stringify(row));
      this.$set(this.editForm, "stockNumberManual", null);
      this.editForm.stockNumberManual = this.editForm.predictNumber;
      this.editForm.nextNeedNumberManual = this.editForm.nextNeedNumberManual||this.editForm.nextNeedNumber
      this.editForm.needNumberManual = this.editForm.needNumberManual||this.editForm.needNumber
      this.editForm.lastNeedNumberManual = this.editForm.lastNeedNumberManual||this.editForm.lastNeedNumber
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
      // 例如：根据 status 字段设置背景色
      if (column.property === "percentagePaid") {
        if (row.stockInNumber === 0) return;
        if (
          Number(row.percentagePaid) > 50 &&
          Number(row.percentagePaid) < 100
        ) {
          return {
            backgroundColor: "#EEAD0E",
            color: "white",
          };
        } else if (Number(row.percentagePaid) >= 100) {
          return {
            backgroundColor: "#67C23A",
            color: "white",
          };
        } else if (Number(row.percentagePaid) <= 50) {
          return {
            backgroundColor: "#EE3B3B",
            color: "white",
          };
        }
      }
      // if (column.property === "predictNumber") {
      //   if (!row.predictNumber) return;
      //   if (Number(row.predictNumber) > Number(row.needNumber) * 0.5) {
      //     return {
      //       backgroundColor: "#EE3B3B",
      //       color: "white",
      //     };
      //   } else if (
      //     Number(row.predictNumber) < Number(row.needNumber) * 0.5 ||
      //     Number(row.predictNumber) === Number(row.needNumber) * 0.5
      //   ) {
      //     return {
      //       backgroundColor: "#67C23A",
      //       color: "white",
      //     };
      //   }
      // }
      if (column.property === "lastPredictNumber") {
        if (!row.lastPredictNumber) return;
        if (Number(row.lastPredictNumber) > Number(row.lastNeedNumber) * 0.5) {
          return {
            backgroundColor: "#EE3B3B",
            color: "white",
          };
        } else if (
          Number(row.lastPredictNumber) < Number(row.lastNeedNumber) * 0.5 ||
          Number(row.lastPredictNumber) === Number(row.lastNeedNumber) * 0.5
        ) {
          return {
            backgroundColor: "#67C23A",
            color: "white",
          };
        }
      }
      if (column.property === "nextPredictNumber") {
        if (!row.nextPredictNumber) return;
        if (Number(row.nextPredictNumber) > Number(row.nextNeedNumber) * 0.5) {
          return {
            backgroundColor: "#EE3B3B",
            color: "white",
          };
        } else if (
          Number(row.nextPredictNumber) < Number(row.nextNeedNumber) * 0.5 ||
          Number(row.nextPredictNumber) === Number(row.nextNeedNumber) * 0.5
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