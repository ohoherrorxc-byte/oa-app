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
      <p>{{formData.emailRemark}}</p>
      <el-table :data="formData.deliverDtos" class="pt20">
        <el-table-column property="partsName" :formatter="formatter" label="零件名称">
        </el-table-column>
        <el-table-column property="externalPartNo" label="零件号">
        </el-table-column>
        <el-table-column property="needDate" label="要求到货日期">
        </el-table-column>
        <el-table-column property="needNumber" label="需求数量">
        </el-table-column>
        <el-table-column property="storageName" label="收货仓名称">
        </el-table-column>
        <el-table-column property="orderPartNo" label="订单号" algin="center">
          <template slot-scope="scope">
            <div>{{scope.row.orderPartNo?scope.row.orderPartNo:"发送邮件时自动生成"}}</div>
          </template>
        </el-table-column>
        <el-table-column property="remark" label="备注"> </el-table-column>
      </el-table>
    </div>
    <div class="my60 pt5 bgbtred">
      <p class="pb5 red font20">上汽海外出行科技有限公司</p>
      <p class="red">SAlC MOTOR Overseas intelligent Mobility Technology Co.,Ltd</p>
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
    };
  },
  props: {
    formData: {
      type: Object,
      default: {},
    },
  },
  methods: {
    title() {
      console.log(this.formData);
      return `${this.formData.supplierName}${getFormatDate()}订单`;
    },
    handleClose(done) {
      this.dialogVisibleEmail = false;
    },
    formatter(row, column, cellValue, index){
      return `${row.chineseName}-${row.childrenFunctionName||row.childrenFunction}`
    }
  },
};
</script>

<style scoped>
.content {
  line-height: 2;
}
.bgbtred{
  border-top:1px solid #CC0000;
  width: 600px;
}
.font20{
  font-size: 20px;
  font-weight: 600;
}
.red{
  color: #CC0000;
}
</style>
