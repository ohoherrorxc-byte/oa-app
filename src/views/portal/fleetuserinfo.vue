<template>
  <div class="card-body" v-loading="loading">
    <el-card style="margin-bottom: 10px;">
      <div slot="header">
        <span class="card-title" style="font-size: 16px">Personal Infomation</span>
      </div>
      <el-row>
        <el-col><strong>Username:</strong> {{fleetUserInfo.account}}</el-col>
      </el-row>
      <el-row>
        <el-col><strong>Mobile Phone:</strong> {{fleetUserInfo.phone}}</el-col>
      </el-row>
      <el-row>
        <el-col><strong>Email:</strong> {{fleetUserInfo.email}}</el-col>
      </el-row>
      <el-row>
        <el-col><strong>Company Name:</strong> {{fleetUserInfo.companyName}}</el-col>
      </el-row>
      <el-row>
        <el-col><strong>Type:</strong> Prepaid</el-col>
      </el-row>
      <el-row>
        <el-col>
          <strong style="margin-right: 5px">Monthly Consumption Limit:</strong>
          <div v-if="!showLimitEdit" style="display: inline; ">
            <span v-if="fleetUserInfo.monthlyLimit==0">--</span>
            <span v-if="fleetUserInfo.monthlyLimit!=0">฿{{ fleetUserInfo.monthlyLimit }}</span>
            <i class="el-icon-edit limit-edit" @click="showLimitEdit=true"></i>
          </div>
          <div v-if="showLimitEdit" style="display: inline; ">
            <el-input style="width: 80px; " size="mini" align="right" v-model="fleetUserInfo.monthlyLimit"></el-input>
            &nbsp;<a ref=";" class="limit-edit" @click="editLimit">OK</a>&nbsp;<a ref=";" class="limit-edit" @click="showLimitEdit=false;fleetUserInfo.monthlyLimit=monthlyLimitOriginal">Cancel</a>
            <div style="display: inline; margin-left: 20px; font-size: 12px; ">Current month's consumption: ฿{{ fleetUserInfo.currentMonthConsumption }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="font-size:12px; color:#ccc">
        <div v-if="showLimitEdit">Please set an amount greater than 1,000 baht spent in the current month</div>
        This setting will carry over to next month.<br>
        * When the total consumption amount in a month ≥ the monthly consumption limit, all pre-paid cards under this account will be suspended till the next month or the monthly consumption limit increased.
      </el-row>
    </el-card>

    <el-card style="margin-bottom: 10px;">
      <div slot="header">
        <span class="card-title" style="font-size: 16px">Top-up</span>
      </div>
      <el-row>
        <el-col><strong>Account Balance:</strong> ฿{{ (parseFloat(fleetUserInfo.balance) + parseFloat(fleetUserInfo.cardsBalance)).toFixed(2) }}</el-col>
      </el-row>
      <el-row>
        <el-col><strong>Card Balance:</strong> ฿{{fleetUserInfo.cardsBalance}}</el-col>
      </el-row>
      <el-row>
        <el-col><strong>To be allocated:</strong> ฿{{fleetUserInfo.balance}}</el-col>
      </el-row>
      <el-row>
        <el-col>
          <strong>Top-up Amount:</strong>
          <el-input style="width: 100px; margin-left: 10px; " v-model="payment.amount" size="mini"></el-input>
          <span ref="amountError" style="color:red; margin-left: 10px; font-size: 12px;"></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <strong>Payment Method:</strong>
          <el-radio style="margin-left: 10px">Thai QR</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-checkbox v-model="hasRead" style="margin-right: 8px"></el-checkbox>
          [<a @click="termsShow=true" style="cursor: pointer">Terms of User and Agreement</a>]
          <el-checkbox v-model="needInvoice" style="margin-left: 30px">Need invoice</el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button type="primary" @click="pay" :disabled="!hasRead">Pay</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog title="Thai QR"
               append-to-body
               :visible.sync="box"
               width="300px">
      <div v-loading="loading">
        <div ref="qrcode" align="center"></div>
      </div>
    </el-dialog>
    <el-dialog title="Terms of User and Agreement"
               append-to-body
               :visible.sync="termsShow"
               width="650px">
      <terms></terms>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {editLimit, getDetail, getQR} from "@/api/portal/fleetuserblade";
import {getQueryString2} from "@/util/util";
import terms from "@/page/portal/terms";

export default {
  components: {
    terms,
  },
  name: "fleetuserinfo",
  data() {
    return {
      fleetUserInfo: {},
      loading: false,
      box: false,
      termsShow: false,
      showLimitEdit: false,
      payment: {
        amount: 100,
        channel: 2,
      },
      hasRead: false,
      needInvoice: false,
      monthlyLimitOriginal: 0,
    }
  },
  mounted() {
    this.loadUserInfo();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    loadUserInfo() {
      console.log(this.userInfo);
      this.loading = true;
      getDetail(this.userInfo.user_id).then(res => {
        this.loading = false;
        this.fleetUserInfo = res.data.data;
        this.monthlyLimitOriginal = this.fleetUserInfo.monthlyLimit;
      });
    },
    pay: function () {
      if (isNaN(this.payment.amount) || this.payment.amount <= 0 || this.payment.amount.toString().indexOf('.') >= 0) {
        //this.$message.error("Invalid amount!");
        this.$refs.amountError.innerText = "Invalid amount!";
        return;
      } else if (parseFloat(this.payment.amount) + parseFloat(this.fleetUserInfo.balance) + parseFloat(this.fleetUserInfo.cardsBalance) > 2000000) {
        this.$refs.amountError.innerText = "The balance will exceed 2 million Baht after this top-up, please set a lower top-up amount.";
        return;
      } else {
        this.$refs.amountError.innerText = "";
      }
      this.box = true;
      this.loading = true;
      getQR(this.payment.amount, this.payment.channel, this.fleetUserInfo.id, this.needInvoice ? 1 : 0).then(res => {
        let rest = JSON.parse(res.data.data);
        this.loading = false;

        //loading完成之后，这个dom才会存在
        const domQr = this.$refs.qrcode;
        domQr.innerHTML = "";

        if (!rest.success) {
          domQr.innerHTML = "Payment failed!";
          return;
        }

        let qrcodeStr = getQueryString2(rest.data.paymentUrl, "qrcode");

        this.makeQR(domQr, qrcodeStr);
      });
    },
    editLimit: function () {
      if ((this.fleetUserInfo.monthlyLimit.length > 1 && this.fleetUserInfo.monthlyLimit.substr(0,1)=='0') || isNaN(this.fleetUserInfo.monthlyLimit) || this.fleetUserInfo.monthlyLimit < 0 || this.fleetUserInfo.monthlyLimit >= 100000000) {
        this.$message.error("Please enter a valid amount");
        return;
      }
      if (this.fleetUserInfo.monthlyLimit < parseFloat(this.fleetUserInfo.currentMonthConsumption) + 1000) {
        this.$message.error(`Please set an amount greater than ${parseFloat(this.fleetUserInfo.currentMonthConsumption) + 1000} baht`);
        return;
      }
      editLimit(this.fleetUserInfo.id, this.fleetUserInfo.monthlyLimit).then(() => {
        this.showLimitEdit = false;
        this.monthlyLimitOriginal = this.fleetUserInfo.monthlyLimit;
        this.$message({
          type: "success",
          message: "Success!"
        });
      });
    },
    makeQR(dom, val) {
      // eslint-disable-next-line
      let qrcode = new QRCode(dom, {
        width: 200,
        height: 200
      });

      qrcode.makeCode(val);
    }
  }
}
</script>

<style scoped>
  .limit-edit {
    cursor: pointer;
    color: red;
  }
  a:hover {
    text-decoration: underline;
  }
  .card-body {
    font-size: 14px;
  }
</style>
