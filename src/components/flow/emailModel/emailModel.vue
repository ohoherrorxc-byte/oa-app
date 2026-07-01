<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisibleEmail"
    width="70%"
    :before-close="handleClose"
    :append-to-body="true"
  >
    <div class="content">
      <p>邮件标题：{{ title() }}</p>
      <p>发送人：上汽海外出行科技有限公司</p>
      <p>收件人：{{ formData.planUserNames }}</p>
      <p>抄送人：{{ formData.sendEmailNames }}</p>
      <p class="pt10 pb5">邮件内容</p>
      <!-- <p>订单号：发送邮件时自动生成</p> -->
      <p>{{ formData.emailRemark }}</p>
      <el-table :data="formData.deliverDtos" class="pt20">
        <el-table-column property="partsName" label="零件名称">
          <template slot-scope="scope">
            <div>
              <div
                :class="{
                  deleted: !isSame(scope.row.oldPartsName, scope.row.partsName),
                }"
              >
                {{ getOldPartName(scope.row) }}
              </div>
              <div v-if="!isSame(scope.row.oldPartsName, scope.row.partsName)">
                {{ getPartName(scope.row) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="externalPartNo" label="零件号">
          <template slot-scope="scope">
            <div>
              <div
                :class="{
                  deleted: !isSame(
                    scope.row.oldExternalPartNo,
                    scope.row.externalPartNo
                  ),
                }"
              >
                {{ scope.row.oldExternalPartNo }}
              </div>
              <div
                v-if="
                  !isSame(scope.row.oldExternalPartNo, scope.row.externalPartNo)
                "
              >
                {{ scope.row.externalPartNo }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="needDate" label="要求到货日期">
          <template slot-scope="scope">
            <div>
              <div
                :class="{
                  deleted: !isSame(scope.row.oldNeedDate, scope.row.needDate),
                }"
              >
                {{ scope.row.oldNeedDate }}
              </div>
              <div v-if="!isSame(scope.row.oldNeedDate, scope.row.needDate)">
                {{ scope.row.needDate }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="needNumber" label="需求数量">
          <template slot-scope="scope">
            <div>
              <div
                :class="{
                  deleted: !isSame(
                    scope.row.oldNeedNumber,
                    scope.row.needNumber
                  ),
                }"
              >
                {{ scope.row.oldNeedNumber }}
              </div>
              <div v-if="!isSame(scope.row.oldNeedNumber, scope.row.needNumber)">
                {{ scope.row.needNumber }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="storageName" label="收货仓名称">
          <template slot-scope="scope">
            <div>
              <div
                :class="{
                  deleted: !isSame(
                    scope.row.oldStorageName,
                    scope.row.storageName
                  ),
                }"
              >
                {{ scope.row.oldStorageName }}
              </div>
            </div>
            <div
              v-if="!isSame(scope.row.oldStorageName, scope.row.storageName)"
            >
              {{ scope.row.storageName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="orderPartNo" label="订单号" algin="center">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.orderPartNo
                  ? scope.row.orderPartNo
                  : "发送邮件时自动生成"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="remark" label="备注">
          <template slot-scope="scope">
            <div>
              <div
                :class="{
                  deleted: !isSame(scope.row.oldRemark, scope.row.remark),
                }"
              >
                {{ scope.row.oldRemark }}
              </div>
              <div v-if="!isSame(scope.row.oldRemark, scope.row.remark)">
                {{ scope.row.remark }}
              </div>
            </div>
          </template>
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
    <!-- <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleEmail = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisibleEmail = false">确 定</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import { getFormatDate } from "@/util/util";
export default {
  data() {
    return {
      dialogVisibleEmail: false,
      formData: {},
    };
  },
  // props: {
  //   formData: {
  //     type: Object,
  //     default: {},
  //   },
  // },
  methods: {
    title() {
      return `${this.formData.supplierName}${getFormatDate()}订单更改`;
    },
    isSame(row, oldRow) {
      return row === oldRow;
    },
    showDialog(data) {
      this.formData = data;
      this.dialogVisibleEmail = true;
    },
    handleClose(done) {
      this.dialogVisibleEmail = false;
    },
    getOldPartName(row) {
      return `${row.oldChineseName}-${row.oldChildrenFunctionName}`;
    },
    getPartName(row) {
      return `${row.chineseName}-${row.childrenFunctionName}`;
    },
    formatter(row, column, cellValue, index) {
      return `${row.chineseName}-${row.childrenFunctionName}`;
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
</style>
