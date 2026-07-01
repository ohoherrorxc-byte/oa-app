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
      <threeMonthVue ref="threeMonthRef" :isFlow="true" :formData="form"></threeMonthVue>
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
import threeMonthVue from "@/views/substitute/supplierOrderTable/threeMonth.vue";
import { getFormatDate } from "@/util/util";
export default {
  data() {
    return {
      dialogVisibleEmail: false,
      formData: {},
    };
  },
  components:{threeMonthVue},
  // props: {
  //   formData: {
  //     type: Object,
  //     default: {},
  //   },
  // },
  methods: {
    title() {
      return `供应商订单状态`;
    },
    isSame(row, oldRow) {
      return row === oldRow;
    },
    showDialog(data) {
      this.formData = data;
      this.formData.planUserNames = this.formData.sendPersonsList.map(ele=>ele.realName).toString()
      this.formData.sendEmailNames = this.formData.sendPersonsCCList.map(ele=>ele.realName).toString()
      // console.log(this.formData)
      this.dialogVisibleEmail = true;
    },
    handleClose(done) {
      this.dialogVisibleEmail = false;
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
