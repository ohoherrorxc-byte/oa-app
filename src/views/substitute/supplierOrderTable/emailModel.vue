<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisibleEmail"
    width="70%"
    :before-close="handleClose"
    :append-to-body="true"
  >
    <el-form label-width="120px" :model="form" :rules="rules">
      <el-row>
        <el-col span="12">
          <el-form-item label="发送人" prop="sendPersons">
            <autoAddress
              placeholder=""
              ref="autoAddress"
              class="w-100"
              :initList="initList"
              @getPerson="getSendEmail"
              :initData="formData.sendPersons"
              :multiple="true"
            ></autoAddress>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item label="抄送人员邮箱" prop="sendPersonsCC">
            <autoAddress
              placeholder=""
              ref="autoAddress"
              class="w-100"
              :initList="initListCC"
              @getPerson="getSendEmailCC"
              :initData="formData.sendPersonsCC"
              :multiple="true"
            ></autoAddress>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item label="供应商发送人邮箱" prop="planUserIds">
            <el-select
              multiple
              v-model="formData.planUserIds"
              @change="changePlanUser"
            >
              <el-option
                v-for="self in planList"
                :key="self.id"
                :label="self.planName"
                :value="self.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="24">
          <el-form-item label="邮箱正文">
            <el-input
              type="textarea"
              v-model="formData.emailRemark"
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <div class="divider">邮件预览内容</div>
    <div class="content">
      <p>邮件标题：{{ title() }}</p>
      <p>发送人：上汽海外出行科技有限公司</p>
      <p>收件人：{{ getSendPerson() }}</p>
      <p>抄送人：{{ formData.sendPersonsCCNames }}</p>
      <p class="pt10 pb5">邮件内容</p>
      <p>{{ formData.emailRemark }}</p>
      <el-table
        row-key="id"
        :data="formData.supplierOrderList"
        style="width: 100%"
        class="mt20"
        :span-method="objectSpanMethod"
        :cell-style="getCellClass"
      >
        <el-table-column type="index" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="partsName"
          label="项目"
          width="250"
          align="center"
        >
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
              {{ getRowPercentagePaid(scope.row,itemM)+(getRowPercentagePaid(scope.row,itemM)==="/"?"":"%") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center">
        </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="my60 pt5 bgbtred">
      <p class="pb5 red font20">上汽海外出行科技有限公司</p>
      <p class="red">
        SAlC MOTOR Overseas intelligent Mobility Technology Co.,Ltd
      </p>
      <p>地址:上海智能网联新能源汽车创新孵化中心</p>
    </div>
    <div class="text-center">
      <el-button type="primary" @click="sendEmail"> 发送邮箱 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import autoAddress from "@/components/autoAddress/index";
import substituteOrderManageApi from "@/api/substitute/orderManage";
import {getDetail} from "@/api/contract/contractSupplier"
export default {
  data() {
    return {
      dialogVisibleEmail: false,
      monthList: null,
      planList: [],
      spanArr: [],
      formData: {
        planUserIds: [],
        sendPersons: null,
        sendPersonsNames: [],
        sendPersonsCC: null,
        sendPersonsCCNames: null,
        planEmailNames:[],
        sendPersonsList: [],
        sendPersonsCCList: [],
        supplierOrderList: [],
        planList:null
      },
    };
  },
  components: { autoAddress },
  methods: {
    title() {
      return `供应商订单状态一览表`;
    },
    isSame(row, oldRow) {
      return row === oldRow;
    },
    changePlanUser() {
      this.formData.planList = this.planList.filter(ele=>{
        return this.formData.planUserIds.includes(ele.id)
      })
      this.formData.planEmailNames = this.formData.planList.map(ele=>ele.planName)
    },
    getSendPerson(){
      return [...this.formData.planEmailNames,...this.formData.sendPersonsNames]
    },
    async sendEmail() {
      let data = this.formData;
      if (!data.sendPersons&&!data.planUserIds) {
        this.$message.error("请选择发送人");
        return;
      }
      data.planUserIds = data.planUserIds.toString()
      data.sendPersons = data.sendPersons ? data.sendPersons.toString() : null;
      data.sendPersonsCC = data.sendPersonsCC
        ? data.sendPersonsCC.toString()
        : null;
      let res = await substituteOrderManageApi.sendEmail(data);
      if (res.data.code === 200 || res.data.code === 0) {
        this.$message.success("邮件已发送");
        this.dialogVisibleEmail = false;
      }
    },
    getSendEmailCC(data, list) {
      this.formData.sendPersonsCC = list.map((ele) => ele.id);
      this.formData.sendPersonsCCNames = list.map((ele) => ele.realName);
      this.formData.sendPersonsCCList = list;
      this.formData.sendPersonsCCList.map((ele) => {
        ele.planEmail = ele.email;
        ele.userId = ele.id;
        ele.userName = ele.realName;
      });
    },
    getRowPercentagePaid(row, item) {
      let bottomValue =
        Number(row[item].arrears) +
       (Number(row[item].stockInNumberManual) || Number(row[item].stockInNumber));
      let data = "/";
      if (bottomValue) {
        data = (
          (Number(row[item].stockInNumberManual) || Number(row[item].stockInNumber)) /
          Number(bottomValue)*100
        ).toFixed(2);
      }
      return data;
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
          Number(this.getRowPercentagePaid(row,obj[columnIndex])) > 50 &&
          Number(this.getRowPercentagePaid(row,obj[columnIndex])) < 100
        ) {
          return {
            backgroundColor: "#EEAD0E",
            color: "white",
          };
        } else if (Number(this.getRowPercentagePaid(row,obj[columnIndex])) >= 100) {
          return {
            backgroundColor: "#67C23A",
            color: "white",
          };
        } else if (Number(this.getRowPercentagePaid(row,obj[columnIndex])) <= 50) {
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
    dealSpan() {
      this.spanArr = [];
      let pos = 0;
      this.formData.supplierOrderList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          pos = 0;
        } else {
          if (
            this.formData.supplierOrderList[index].orderId ===
            this.formData.supplierOrderList[index - 1].orderId
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
    isZero(row) {
      return Number(row.arrears) + Number(row.needNumber);
    },
    getSendEmail(data, list) {
      this.formData.sendPersons = list.map((ele) => ele.id);
      this.formData.sendPersonsNames = list.map((ele) => ele.realName);
      this.formData.sendPersonsList = list;
      this.formData.sendPersonsList.map((ele) => {
        ele.planEmail = ele.email;
        ele.userId = ele.id;
        ele.userName = ele.realName;
      });
    },
    handleClose(done) {
      this.dialogVisibleEmail = false;
    },
    async getSupplerDetail(supplierNo) {
      let res = await getDetail({ supplierNo: supplierNo });
      console.log(res);
      if(res.data.code===200||res.data.code===0){
        this.planList = res.data.data.planUserList
        this.formData.planUserIds =  this.planList.map(ele=>ele.id)
        this.formData.planEmailNames = this.planList.map(ele=>ele.planName)
        this.formData.planList = this.planList
      }
    },
    doOpen(data, monthList) {
      this.formData.supplierOrderList = data;
      this.dealSpan();
      if (
        this.formData.supplierOrderList.length > 0 &&
        this.formData.supplierOrderList[0].supplierNo
      ) {
        this.getSupplerDetail(this.formData.supplierOrderList[0].supplierNo);
      }
      this.monthList = monthList;
    },
  },
};
</script>

<style scoped>
.content {
  line-height: 2;
}
.bgbtred {
  border-top: 1px solid #cc0000;
  width: 600px;
}
.font20 {
  font-size: 20px;
  font-weight: 600;
}
.red {
  color: #cc0000;
}
.deleted {
  text-decoration: line-through red 2px;
  color: #999;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px; /* 横线粗细 */
  background-color: #ccc; /* 横线颜色 */
}

.divider::before {
  margin-right: 16px;
}

.divider::after {
  margin-left: 16px;
}
</style>
