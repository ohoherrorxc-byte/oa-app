<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-05-24 17:28:58
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-06-28 11:19:21
 * @FilePath: \icarx-ui\src\views\contract\contractBoard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <el-tabs v-model="activeName">
            <el-tab-pane label="综合看板" name="dataBoard">
              <DataBoard v-if="activeName === 'dataBoard'"></DataBoard>
            </el-tab-pane>
            <el-tab-pane label="收款看板" name="receiptBoard">
              <ReceiptBoard v-if="activeName === 'receiptBoard'"></ReceiptBoard>
            </el-tab-pane>
            <el-tab-pane label="付款看板" name="paymentBoard">
              <PaymentBoard v-if="false"></PaymentBoard>
            </el-tab-pane>
          </el-tabs>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ReceiptBoard from "./contractBoard/ReceiptBoard.vue";
import DataBoard from "./contractBoard/DataBoard.vue";
export default {
  components: {
    ReceiptBoard,
    DataBoard,
  },
  data() {
    return {
      activeName: "dataBoard",
    };
  },
};
</script>
