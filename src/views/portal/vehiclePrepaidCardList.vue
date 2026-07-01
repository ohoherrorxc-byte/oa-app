<template>
  <basic-container>
    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="Card No：">
          <el-input
            v-model="query.chargingCardNo"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            placeholder="Card No"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="VIN：">
          <el-input
            v-model="query.vin"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            placeholder="VIN"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Balance：">
          <el-input
            v-model.number="query.amountFrom"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="From"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>-</el-form-item>
        <el-form-item>
          <el-input
            v-model.number="query.amountTo"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="To"
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="searchChange"
            size="mini"
            icon="el-icon-search"
            >Search</el-button
          >
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
            <el-button
              type="primary"
              style="float: left; margin-top: 20px"
              @click="batchQuotaFormVisible = true"
              >{{
                userInfo.role_name.includes("admin")
                  ? "Allocation"
                  : "Bulk Allocation"
              }}
            </el-button>
            <el-button
              type="primary"
              style="float: left; margin-left: 40px; margin-top: 20px"
              @click="bindVehicleFormVisible = true"
              >Bind a vehicle/Bulk binding vehicles
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          border
          v-loading="loading"
          :data="data"
          @selection-change="selectChange"
          style="width: 100%"
        >
          <el-table-column label="ID" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column prop="chargingCardNo" label="Card No" align="center">
            <template slot-scope="scope">
              <span style="color: #1e9fff" @click="handleRoute(scope.row)">{{
                scope.row.chargingCardNo
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingCardType"
            align="center"
            label="Card Type"
          >
          </el-table-column>
          <el-table-column
            prop="fleetCustomerCode"
            align="center"
            label="Fleet Customer Code"
          >
          </el-table-column>
          <el-table-column prop="vin" align="center" label="VIN">
          </el-table-column>
          <el-table-column prop="balance" label="Balance" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.balance }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            align="center"
            label="State"
            :formatter="cardStateFormatter"
          >
          </el-table-column>
          <el-table-column
            label="Operate"
            align="center"
            fixed="right"
            :width="userInfo.role_name.includes('admin') ? 350 : 350"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.state !== 1"
                size="mini"
                type="primary"
                @click="beforeQuota(scope.$index, scope.row)"
                >Amount
              </el-button>
              <el-button
                :disabled="scope.row.state !== 1"
                size="mini"
                type="info"
                @click="handleLoss(scope.$index, scope.row)"
              >
                Report lost cards
              </el-button>
              <el-button
                :disabled="scope.row.vin === ''"
                size="mini"
                type="info"
                @click="handleUnbindVin(scope.index, scope.row)"
                >Unbind
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Plug & Charge" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.plugChargeFlag"
                :disabled="scope.row.plugChargeDisabled"
                @change="
                  handlePlugChargeChange(
                    scope.row.vin,
                    scope.row.plugChargeFlag
                  )
                "
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="page.total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!--    配额-->
    <el-dialog
      title="Allocation"
      :visible.sync="quotaFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      label-position="right"
      width="500px"
      @close="resetForm('vehiclePrepaidCardForm')"
      center
    >
      <el-form
        :model="vehiclePrepaidCard"
        :rules="rules"
        ref="vehiclePrepaidCardForm"
        label-position="right"
        label-width="145px"
      >
        <el-form-item label="Card No :" prop="chargingCardNo">
          <el-input
            v-model="vehiclePrepaidCard.chargingCardNo"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            style="width: 300px"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="Vin :" prop="vin">
          <el-input
            v-model="vehiclePrepaidCard.vin"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            style="width: 300px"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="Allocation Amount :" prop="balance">
          <el-input
            v-model.number="vehiclePrepaidCard.balance"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-card
          style="margin-top: 50px; margin-left: 20px; width: 90%"
          shadow="always"
        >
          <label style="color: red; margin-left: 30%"
            >Account Balance: ฿{{ userBalance }}</label
          >
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quotaFormVisible = false" type="info"
          >Cancel</el-button
        >
        <el-button @click="handleQuota('vehiclePrepaidCardForm')" type="primary"
          >Save</el-button
        >
      </div>
    </el-dialog>

    <!--    配额/批量配额-->
    <el-dialog
      :title="
        userInfo.role_name.includes('admin')
          ? 'Allocation'
          : 'Allocation / Batch Allocation'
      "
      :visible.sync="batchQuotaFormVisible"
      @open="initBatchQuotaDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="resetForm('batchQuotaForm')"
    >
      <el-card>
        <div slot="header" class="clearfix">
          <h3>Allocation</h3>
        </div>
        <el-form
          :model="vehiclePrepaidCard"
          :rules="rules"
          ref="batchQuotaForm"
          label-position="right"
          label-width="150px"
        >
          <el-form-item label="Card No :" prop="chargingCardNo">
            <el-select
              v-model="vehiclePrepaidCard.chargingCardNo"
              @change="cardNoSelectChange"
              filterable
              placeholder="Please choose Card No"
              style="width: 300px"
            >
              <el-option
                v-for="item in userPrepaidCardList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Allocation Amount :" prop="balance">
            <el-input
              v-model.number="vehiclePrepaidCard.balance"
              style="width: 300px"
            ></el-input>
            <label style="color: red"
              >&nbsp;&nbsp;&nbsp;&nbsp;Account Balance: ฿{{
                userBalance
              }}</label
            >
          </el-form-item>
          <el-button @click="handleQuota('batchQuotaForm')" type="primary">
            Allocation
          </el-button>
        </el-form>
      </el-card>
      <el-card
        body-style="background-color: LightGrey"
        :hidden="userInfo.role_name.includes('admin')"
      >
        <div slot="header" class="clearfix">
          <h3>
            Batch Allocation
            <label style="color: red"
              >&nbsp;&nbsp;&nbsp;&nbsp;Account Balance: ฿{{
                userBalance
              }}</label
            >
          </h3>
        </div>
        <label style="color: #1e9fff" @click="handleBatchQuotaTemplateExport"
          >Click to download the excel template</label
        >
        <el-upload
          action=""
          style="margin-top: 3%"
          accept=".xls,.xlsx"
          drag
          :limit="1"
          :http-request="importBatchQuota"
        >
          <i class="el-icon-upload" style="margin-top: 8%"></i>
          <div class="el-upload__text">
            Drag files here,or <em>Click upload</em>
          </div>
        </el-upload>

        <el-row style="margin-top: 5%">
          <el-table
            border
            stripe
            :data="vehiclePrepaidCards"
            show-summary
            sum-text="Total Allocation Amount"
            style="width: 60%"
          >
            <el-table-column
              align="center"
              prop="chargingCardNo"
              label="Card No"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="balance"
              label="Allocation Amount"
            >
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top: 1%">
          <el-button @click="handleBatchQuota" type="primary">
            Allocation
          </el-button>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchQuotaFormVisible = false"
          >Close</el-button
        >
      </div>
    </el-dialog>

    <!--    绑车/批量绑车-->
    <el-dialog
      title="Bind / Batch Bind Vehicle"
      :visible.sync="bindVehicleFormVisible"
      @open="initBindVehicleDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="resetForm('bindVehicleForm')"
    >
      <el-card>
        <div slot="header" class="clearfix">
          <h3>Bind a vehicle</h3>
        </div>
        <el-form
          :model="vehiclePrepaidCard"
          :rules="rules"
          ref="bindVehicleForm"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="Card No :" prop="chargingCardNo">
            <el-select
              v-model="vehiclePrepaidCard.chargingCardNo"
              filterable
              placeholder="Please choose Card No"
              style="width: 300px"
            >
              <el-option
                v-for="item in userPrepaidCardList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="Vin :"
            prop="vin"
            :rules="[
              {
                required: true,
                message: 'VIN number cannot be empty.',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="vehiclePrepaidCard.vin"
              oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-button
            @click="handleBindVehicle('bindVehicleForm')"
            type="primary"
          >
            Check
          </el-button>
        </el-form>
      </el-card>
      <el-card body-style="background-color: LightGrey">
        <div slot="header" class="clearfix">
          <h3>Batch Bind Vehicle</h3>
        </div>
        <label
          style="color: #1e9fff"
          @click="handleBatchBindVehicleTemplateExport"
          >Click to download the excel template</label
        >
        <el-upload
          action=""
          style="margin-top: 3%"
          accept=".xls,.xlsx"
          drag
          :limit="1"
          :http-request="importBatchBindVehicle"
        >
          <i class="el-icon-upload" style="margin-top: 8%"></i>
          <div class="el-upload__text">
            Drag files here,or <em>Click upload</em>
          </div>
        </el-upload>

        <el-row style="margin-top: 5%">
          <el-table
            border
            stripe
            :data="vehiclePrepaidCards"
            style="width: 95%"
          >
            <el-table-column
              align="center"
              prop="chargingCardNo"
              label="Card No"
            >
            </el-table-column>
            <el-table-column align="center" prop="vin" label="VIN">
            </el-table-column>
            <el-table-column
              width="300"
              align="center"
              prop="checkResult"
              label="CheckResult"
            >
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top: 1%">
          <el-button @click="handleBatchBindVehicle" type="primary">
            Check
          </el-button>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindVehicleFormVisible = false"
          >Close</el-button
        >
      </div>
    </el-dialog>

    <!--    验证密码-->
    <el-dialog
      title="Verify Account"
      :visible.sync="verifyAccountVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="500px"
      @close="resetForm('verifyAccountForm')"
      center
    >
      <el-form
        :model="verifyAccount"
        :rules="rules"
        ref="verifyAccountForm"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="Account :" prop="account">
          <el-input
            v-model="verifyAccount.account"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-form-item label="Password :" prop="password">
          <el-input
            v-model.number="verifyAccount.password"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="verifyAccountVisible = false">Cancel</el-button>
        <el-button
          @click="handleVerifyAccount('verifyAccountForm')"
          type="primary"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
import {
  list,
  getFleetUserBalanceById,
  batchQuota,
  reportLoss,
  unbindVin,
  exportBatchQuotaTemplateExcel,
  readBatchQuotaData,
  getUserPrepaidCardNoList,
  getUserCardByNo,
  batchBindVehicle,
  exportBatchBindVinTemplateExcel,
  readBatchBindVinData,
  verifyAccountPassword,
  updatePlugChargeStatus,
} from "@/api/portal/vehiclePrepaidCard";
import { mapGetters } from "vuex";
import { download } from "@/util/excel";

export default {
  data() {
    var checkQuota = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Allocation cannot be empty!"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("Please enter a numeric value !"));
        }
        if (value > this.userBalance) {
          callback(
            new Error(
              "The allocated amount exceeds the balance amount " +
                this.userBalance +
                ", please reset."
            )
          );
        }
        callback();
      }, 1000);
    };
    return {
      // 列表数据
      query: {
        chargingCardNo: "",
        vin: "",
      },
      loading: true,
      data: [],
      multiSelection: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },

      //账户余额
      userBalance: 0,
      //批量配额
      vehiclePrepaidCards: [],
      //单配额
      vehiclePrepaidCard: {
        chargingCardNo: "",
        vin: "",
        balance: "",
        checkResult: "",
      },
      //配额
      quotaFormVisible: false,
      // 校验规则
      rules: {
        chargingCardNo: [
          {
            required: true,
            message: "Card number cannot be empty",
            trigger: "blur",
          },
        ],
        balance: [
          {
            required: true,
            message: "Allocation cannot be empty",
            trigger: "blur",
          },
          { validator: checkQuota, trigger: "blur" },
        ],
        account: [
          {
            required: true,
            message: "Please enter your account. ",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please enter your password. ",
            trigger: "blur",
          },
        ],
      },

      //批量配额
      batchQuotaFormVisible: false,

      userPrepaidCardList: [],

      //绑车
      bindVehicleFormVisible: false,

      verifyAccountVisible: false,

      verifyAccount: {
        account: "",
        password: "",
      },
    };
  },
  created() {
    this.onLoad(this.page, this.query);
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
  },
  methods: {
    onLoad(page, params = {}) {
      this.loading = true;
      list(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;
        this.loading = false;
      });
    },
    searchChange() {
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
    },
    selectChange(val) {
      this.multiSelection = val;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },
    cardStateFormatter(row) {
      switch (row.state) {
        case 1:
          return "Available";
        case 0:
          return "Disabled";
        default:
          return "Unknown";
      }
    },
    initBatchQuotaDialog() {
      if (this.userInfo.role_name === "fleet") {
        //查询用户余额
        this.getFleetUserBalance(this.userInfo.user_id);
      }

      this.getUserPrepaidCardNoList(false);
    },
    initBindVehicleDialog() {
      this.getUserPrepaidCardNoList(true);
    },
    //初始化用户预付卡列表
    getUserPrepaidCardNoList(excludeBindVinFlag) {
      getUserPrepaidCardNoList(excludeBindVinFlag).then((res) => {
        if (res.data.success) {
          this.userPrepaidCardList = res.data.data;
        } else {
          this.$message({ type: "error", message: res.data.msg });
        }
      });
    },
    cardNoSelectChange(val) {
      // if(!this.userInfo.role_name.includes('fleet')){
      getUserCardByNo(val).then((res) => {
        if (res.data.success) {
          let fleetUserId = res.data.data.userId;
          this.getFleetUserBalance(fleetUserId);
        } else {
          this.$message({ type: "error", message: res.data.msg });
        }
      });
      // }
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.vehiclePrepaidCards = [];
      this.userBalance = 0;
      this.vehiclePrepaidCard = {
        chargingCardNo: "",
        vin: "",
        balance: "",
        checkResult: "",
      };
      this.verifyAccount = {
        account: "",
        password: "",
      };
    },
    beforeQuota(index, row) {
      if (!row.userId) {
        this.$message({
          type: "error",
          message: "Please bind the card before Allocation operation!",
        });
        return;
      }
      this.getFleetUserBalance(row.userId);
      Object.assign(this.vehiclePrepaidCard, row);
      this.vehiclePrepaidCard.balance = "";
      this.quotaFormVisible = true;
    },
    getFleetUserBalance(userId) {
      getFleetUserBalanceById(userId).then((res) => {
        if (res.data.success) {
          this.userBalance = res.data.data;
        } else {
          this.$message({ type: "error", message: res.data.msg });
        }
      });
    },
    handleLoss(index, row) {
      let message =
        "After reporting the lost card, the card No. " +
        row.chargingCardNo +
        " will become invalid and the card balance will be returned to the fleet customer account.";
      this.$confirm(message, {
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.verifyAccountVisible = true;
        this.vehiclePrepaidCard = Object.assign({}, row);
      });
    },
    handleUnbindVin(index, row) {
      let message =
        "After unbinding the card, the card balance will be returned to the  fleet customer account. Please confirm to unbind the card No. " +
        row.chargingCardNo +
        " with Vin No. " +
        row.vin +
        " or not.";
      this.$confirm(message, {
        cancelButtonClass: "btn-custom-cancel",
        cancelButtonText: "Cancel",
        confirmButtonText: "Confirm",
        type: "warning",
      }).then(() => {
        unbindVin(row).then((res) => {
          if (res.data.success) {
            this.onLoad(this.page, this.query);
            this.$message({ type: "success", message: "Unbind Successfully" });
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        });
      });
    },
    handleBindVehicle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let vehiclePrepaidCardArr = [];
          vehiclePrepaidCardArr.push(this.vehiclePrepaidCard);
          this.batchBindVehicle(vehiclePrepaidCardArr);
        }
      });
    },
    handleBatchBindVehicle() {
      if (this.vehiclePrepaidCards.length === 0) {
        this.$message({
          type: "error",
          message: "Batch bind vehicle data can not empty !",
        });
        return;
      }

      for (let i = 0; i < this.vehiclePrepaidCards.length; i++) {
        if (this.vehiclePrepaidCards[i].checkResult !== "check success") {
          this.$message({
            type: "error",
            message: "The verification result fails, please check data !",
          });
          return;
        }
      }
      this.batchBindVehicle(this.vehiclePrepaidCards);
    },
    batchBindVehicle(vehiclePrepaidCards) {
      batchBindVehicle(vehiclePrepaidCards).then((res) => {
        if (res.data.success) {
          this.$message({
            type: "success",
            message: "Bind vehicle successful!",
          });
          this.bindVehicleFormVisible = false;
          this.onLoad(this.page, this.query);
        } else {
          this.$message({ type: "error", message: res.data.msg });
        }
      });
    },
    handleQuota(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.vehiclePrepaidCard.balance <= 0) {
            this.$message({
              type: "error",
              message: "Allocation amount must Greater than 0",
            });
            return;
          }
          this.vehiclePrepaidCards.push(this.vehiclePrepaidCard);
          this.batchQuota();
          this.vehiclePrepaidCard = {
            chargingCardNo: "",
            vin: "",
            balance: "",
          };
          this.resetForm(formName);
        }
      });
    },
    batchQuota() {
      // for(let i =this.vehiclePrepaidCards.length -1 ; i>=0 ; i--){
      //   if(this.vehiclePrepaidCards[i].chargingCardNo === 'Total Allocation Amount'){
      //     this.vehiclePrepaidCards.splice(i,1);
      //     break
      //   }
      // }
      batchQuota(this.vehiclePrepaidCards).then((res) => {
        if (res.data.success) {
          this.$message({ type: "success", message: "Saved successfully" });
          this.quotaFormVisible = false;
          this.batchQuotaFormVisible = false;
          this.onLoad(this.page, this.query);
        } else {
          this.$message({ type: "error", message: res.data.msg });
        }
      });
    },
    handleBatchQuota() {
      //分配总额是否<=账户总额
      let quotaTotalAmount = 0;

      this.vehiclePrepaidCards.forEach((prepaidCard) => {
        quotaTotalAmount = quotaTotalAmount + (prepaidCard.balance - 0);
      });

      if (this.userBalance < quotaTotalAmount) {
        let message =
          "The allocated amount exceeds the balance amount " +
          this.userBalance +
          ", please reset.";
        this.$message.error(message);
        return;
      }
      this.batchQuota();
    },
    handleBatchQuotaTemplateExport() {
      this.$confirm(
        "Do you want to export the batch allocation template ?",
        "Tip",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          return exportBatchQuotaTemplateExcel();
        })
        .then((res) => {
          download(res);
        });
    },
    handleBatchBindVehicleTemplateExport() {
      this.$confirm(
        "Do you want to export the batch bind vehicle template ?",
        "Tip",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          return exportBatchBindVinTemplateExcel();
        })
        .then((res) => {
          download(res);
        });
    },
    importBatchQuota(params) {
      const file = params.file;
      readBatchQuotaData(file).then((res) => {
        if (res.data.success) {
          this.vehiclePrepaidCards = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    importBatchBindVehicle(params) {
      const file = params.file;
      readBatchBindVinData(file).then((res) => {
        if (res.data.success) {
          this.vehiclePrepaidCards = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleRoute(row) {
      this.$router.push({
        path: "/portal/vehiclePrepaidCardFlow",
        query: {
          chargingCardNo: row.chargingCardNo,
        },
      });
    },
    handleVerifyAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          verifyAccountPassword(this.verifyAccount).then((res) => {
            if (res.data.success) {
              reportLoss(this.vehiclePrepaidCard).then((res) => {
                if (res.data.success) {
                  this.verifyAccountVisible = false;
                  this.verifyAccount = { account: "", password: "" };
                  this.onLoad(this.page, this.query);
                  this.resetForm(formName);
                  this.$message({
                    type: "success",
                    message: "The Report Loss succeeded！",
                  });
                } else {
                  this.$message({ type: "error", message: res.data.msg });
                }
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    handlePlugChargeChange(vin, status) {
      let message =
        status === true
          ? "After the Plug & Charge button is turned on, the charge fee and other fee (if any) will be automatically deducted after charging. Are you sure to turn on the button?"
          : "After the button is turned off , Plug and Charge will be unavailable.Are you sure to turn off the button?";
      let confirmButtonText = status === true ? "Turn on" : "Turn off";
      this.$confirm(message, {
        cancelButtonText: "cancel",
        confirmButtonText: confirmButtonText,
        type: "warning",
      })
        .then(() => {
          updatePlugChargeStatus(vin, status).then((res) => {
            if (res.data.success) {
              this.$message.error(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
            this.onLoad(this.page, this.query);
          });
        })
        .catch(() => {
          this.onLoad(this.page, this.query);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-pagination {
  position: relative;
  text-align: right;
  padding: 25px 0 20px 20px;
}
</style>
<style>
.btn-custom-cancel {
  float: right;
  margin-left: 100px;
}
.el-upload-dragger {
  height: 150px;
  width: 300px;
}
.el-card__header {
  height: 50px;
}
.btn-custom-cancel {
  float: right;
  margin-left: 20px;
}
</style>
