<template>
  <div>
    <el-row>
      <el-col :span="24">
        <third-register></third-register>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>
            <span>合同提醒</span>
            <span style="float: right">
              <el-button
                icon="el-icon-plus"
                size="mini"
                type="primary"
                style="margin-left: 10px"
                @click="handleOpenDialog()"
                >新建提醒</el-button
              >
            </span>
          </p>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <div class="List-title">
            <div class="List-title-left">
              <ul>
                <li
                  :class="isType == '1' ? 'active' : ''"
                  @click="changeType('1')"
                >
                  本周
                </li>
                <li
                  :class="isType == '2' ? 'active' : ''"
                  @click="changeType('2')"
                >
                  本月
                </li>
                <li
                  :class="isType == '3' ? 'active' : ''"
                  @click="changeType('3')"
                >
                  本年
                </li>
              </ul>
            </div>
            <div class="List-title-right">
              <el-date-picker
                v-model="value1"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                placeholder="选择时间范围"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="List-body">
            <el-table
              :data="tableData"
              style="width: 100%; margin-top: 20px"
              stripe
              :show-header="false"
              align="center"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column prop="imgUrl" label="头像" align="center">
                <template slot-scope="scope">
                  <el-avatar :size="medium" :src="scope.row.imgUrl"></el-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="partsName" label="名字" align="center" />
              <el-table-column prop="contractName" label="内容" align="center">
                <template slot-scope="scope">
                  【<span class="colorOne">{{ scope.row.contractName }}</span
                  >】，请在<el-tag
                    type="info"
                    color="#F03CCD"
                    size="mini"
                    style="color: #ffffff"
                    >{{ scope.row.endDate }}</el-tag
                  >前完成【<span class="colorOne">{{
                    scope.row.remindContent
                  }}</span
                  >】
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pageNum"
              :page-sizes="[2, 5, 10, 20, 50]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="queryInfo.total"
            ></el-pagination>
          </div>
          <el-dialog
            :visible.sync="supplierDialogFormVisible"
            append-to-body
            @close="editDialogClose"
          >
            <template slot="title">
              <div style="font-size: 15px">新建提醒</div>
            </template>
            <el-form
              :model="editForm"
              :rules="editFormRules"
              ref="editFormRef"
              class="demo-ruleForm"
            >
              <el-row>
                <el-form-item prop="contractType">
                  <label slot="label">合同类型:</label><br />
                  <el-select
                    v-model="editForm.contractType"
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
                <el-form-item prop="contractName">
                  <label slot="label">合同名称:</label><br />
                  <el-select
                    v-model="editForm.contractName"
                    v-if="editForm.contractType == 1"
                    style="width: 90%"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="item in PList"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="editForm.contractName"
                    v-if="editForm.contractType == 2"
                    style="width: 90%"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="item in SList"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="endDate">
                  <label slot="label">提醒时间:</label><br />
                  <el-date-picker
                    style="width: 90%"
                    v-model="editForm.endDate"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择提醒时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="remindContent">
                  <label slot="label">提醒内容:</label><br />
                  <el-input
                    type="textarea"
                    :rows="2"
                    v-model="editForm.remindContent"
                    autocomplete="off"
                    :placeholder="请输入提醒内容"
                    style="width: 90%"
                  ></el-input>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { RemindgetList, RemindAdd } from "@/api/contract/contractSellAdd";
import { getListAllP } from "@/api/contract/purchaseContractManage";
import { getListAllS } from "@/api/contract/saleContractManage";

export default {
  name: "wel",
  data() {
    return {
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      value1: [new Date(), new Date()],
      tableData: [],
      editForm: {
        endDate: "",
        remindContent: "",
        contractType: 1,
        contractName: "",
      },
      supplierDialogFormVisible: false,
      paymentStatuss: [
        {
          name: "销售合同",
          value: 1,
        },
        {
          name: "采购合同",
          value: 2,
        },
      ],
      isType: "1",
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      PList: [],
      SList: [],
      seachTime: {
        startTime: "",
        endTime: "",
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    getPurchaseContractList(params) {
      RemindgetList(
        this.queryInfo.pageNum,
        this.queryInfo.pageSize,
        params
      ).then((res) => {
        this.tableData = res.data.data.records;
        this.queryInfo.total = res.data.data.total;
      });
    },
    getPList(params) {
      getListAllP(this.queryInfo.pageNum, this.queryInfo.pageSize, params).then(
        (res) => {
          this.PList = res.data.data;
        }
      );
    },
    getSList(params) {
      getListAllS(this.queryInfo.pageNum, this.queryInfo.pageSize, params).then(
        (res) => {
          this.SList = res.data.data;
        }
      );
    },
    handleChange(val) {
      window.console.log(val);
    },
    handleOpenDialog() {
      this.supplierDialogFormVisible = true;
    },
    addSupplier() {
      console.log("add");
      RemindAdd(this.editForm)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.seachTime.startTime = this.value1[0].Format(
            "yyyy-MM-dd HH:mm:ss"
          );
          this.seachTime.endTime = this.value1[1].Format("yyyy-MM-dd HH:mm:ss");
          this.getPurchaseContractList(this.seachTime);
          this.supplierDialogFormVisible = false;
        })
        .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
        .finally(() => {
          this.seachTime.startTime = this.value1[0].Format(
            "yyyy-MM-dd HH:mm:ss"
          );
          this.seachTime.endTime = this.value1[1].Format("yyyy-MM-dd HH:mm:ss");
          this.getPurchaseContractList(this.seachTime);
          this.supplierDialogFormVisible = false;
        });
    },
    changeType(val) {
      this.isType = val;
      if (val == "1") {
        this.setWeek();
        this.seachTime.startTime = this.value1[0].Format("yyyy-MM-dd HH:mm:ss");
        this.seachTime.endTime = this.value1[1].Format("yyyy-MM-dd HH:mm:ss");
        this.getPurchaseContractList(this.seachTime);
      } else if (val == "2") {
        this.setMonth();
        this.seachTime.startTime = this.value1[0].Format("yyyy-MM-dd HH:mm:ss");
        this.seachTime.endTime = this.value1[1].Format("yyyy-MM-dd HH:mm:ss");
        this.getPurchaseContractList(this.seachTime);
      } else if (val == "3") {
        this.setYear();
        this.seachTime.startTime = this.value1[0].Format("yyyy-MM-dd HH:mm:ss");
        this.seachTime.endTime = this.value1[1].Format("yyyy-MM-dd HH:mm:ss");
        this.getPurchaseContractList(this.seachTime);
      }
    },
    setWeek() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const week = date.getDay();
      let WeekStartDate = new Date(year, month, day - week + 1);
      let WeekEndDate = new Date(year, month, day - week + 7);
      this.value1 = [WeekStartDate, WeekEndDate];
    },
    setMonth() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      let thisMonthStartDate = new Date(year, month, 1);
      let thisMonthEndDate = new Date(year, month + 1, 0);
      this.value1 = [thisMonthStartDate, thisMonthEndDate];
    },
    setYear() {
      const date = new Date();
      const year = date.getFullYear();
      let thisYearStartDate = new Date(year + "-01-01");
      let thisYearEndDate = new Date(year + "-12-31");
      this.value1 = [thisYearStartDate, thisYearEndDate];
    },
  },
  created() {
    console.log("hh", this.seachTime);
    this.setWeek();
    this.seachTime.startTime = this.value1[0].Format("yyyy-MM-dd HH:mm:ss");
    this.seachTime.endTime = this.value1[1].Format("yyyy-MM-dd HH:mm:ss");
    this.getPurchaseContractList(this.seachTime);
    this.getPList();
    this.getSList();
  },
};
</script>

<style>
.el-font-size {
  font-size: 14px;
}
p {
  margin: 0;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.List-title {
  height: 50px;
  width: 100%;
}
.List-title-left {
  float: left;
  width: 270px;
  padding: 1px;
}
.List-title-left ul {
  overflow: hidden;
  width: 100%;
  height: 100%;
  border: 1px solid #203b71;
  border-radius: 22px;
}
.List-title-left ul li {
  float: left;
  width: 90px;
  font-size: 14px;
  font-weight: 400;
  height: 35px;
  line-height: 35px;
  text-align: center;
}
.List-title-left .active {
  background-color: #203b71;
  color: #ffffff;
}
.List-title-right {
  float: right;
}
.colorOne {
  color: #146df1;
}
</style>
