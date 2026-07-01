<template>
  <basic-container>
    <el-row type="flex" class="row-bg">
      <el-col>
        <el-button type="primary" @click="submit('sendStatisticDate')">发送大屏统计数据</el-button>
      </el-col>
      <el-col>
        <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExport">导出发起支付-发票信息</el-button>
      </el-col>
      <el-col>
              <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExport2">导出用印申请信息</el-button>
     </el-col>
      <el-col>
        <el-button type="primary" @click="submit('updatePayBillExchangeRateData')">刷新付款汇率</el-button>
      </el-col>
      <el-col>
        <el-upload class="i-block ml10" action="#" :before-upload="beforeUpload" :limit="1">
          <el-button icon="el-icon-plus" size="mini" type="primary">导入出货日期</el-button>
        </el-upload>
      </el-col>
      <el-col>
        <el-button type="primary" @click="refleshData('')">手动刷新</el-button>
      </el-col>
    </el-row>
  </basic-container>
</template>
<script>
import * as list from "@/api/system/additionalRecording";
import {
  clearRedis
} from "@/api/billManage/dataBoard";
import { debounce } from '@/util/util'
import { downBlobFile } from "@/util/util";
export default {
  methods: {
    submit(val) {
      list[val]().then((res) => {
        if (res.data.code === 0) {
          this.$message.success("发送成功");
        }
      });
    },
    async refleshData() {
      let res = await clearRedis()
      debounce(this.initTBox, this, 1000, 'reflesh')
    },
    beforeUpload(file) {
      list.importExcel(file).then((res) => {
        if (res.data.code == 0) {
          this.getContractProjectList({});
          this.$message.success("导入成功");
        } else {
          this.$message.error("导入失败");
        }
      });
    },
    async handleExport() {
          let res = await list.invoicePayExport();
          console.log(res);
          downBlobFile(res.data, "支付-发票信息");
    },
    async handleExport2() {
          let res = await list.yongYinExport();
          console.log(res);
         downBlobFile(res.data, "用印申请记录表");
    },
  },
};
</script>
