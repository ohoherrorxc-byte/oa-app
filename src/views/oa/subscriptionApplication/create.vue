<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('acceptApply.basicInfo') }}
    </p>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item :label="$t('acceptApply.title')" prop="titleName" style="width: 96%">
        <el-input v-model="form.titleName" v-if="!disabled" clearable></el-input>
        <div v-else>{{ form.titleName }}</div>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applicant')" prop="applyPerson">
        <el-select v-model="form.applyPerson" disabled>
          <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDept')" prop="applyDept">
        <el-select v-model="form.applyDept" disabled>
          <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDate')" prop="applyDate">
        <el-input v-model="form.applyDate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyNo')" prop="applyNo">
        <el-input v-model="form.applyNo" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('subscription.ticketDescription')" style="width: 96%">
        <el-input type="textarea" autosize v-model="form.applyDesc" :disabled="disabled"></el-input>
      </el-form-item>
      <p class="table-title">
        <span></span>{{ $t('subscription.ticketInfo') }}
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="isAssigneePmo">
          <span class="add-icon" @click="addInvoiceRow">+</span>
          <span class="dec-icon" @click="deleteChooseRow">―</span>
        </div>
        <el-table ref="multipleTable" :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }" :data="form.ticketInfoList"
          @selection-change="invoiceSelectionChange" class="mb20 table-now">
          <el-table-column type="selection" v-if="!isPdfDown" width="42"></el-table-column>
          <el-table-column label="相关发票" :width="isPdfDown ? 120 : 270">
            <template slot="header">
              {{ $t('subscription.relatedInvoice') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'ticketInfoList.' + scope.$index + '.titleName'" style="width:100%"
                :rules="rules.titleName">
                <el-input v-if="isAssigneePmo" :disabled="!isAssigneePmo" v-model="scope.row.titleName">
                  <el-button :disabled="!isAssigneePmo" slot="append" icon="el-icon-search"
                    @click="openInvoicedailog(scope.row, scope.$index)"></el-button>
                </el-input>
                <div v-else>{{ scope.row.titleName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subscription.invoiceNumber')" :width="isPdfDown ? 70 : 110">
            <template slot-scope="scope">
              <el-form-item style="width:100%">
                {{ scope.row.invoiceNo }}
                <!-- <el-input disabled v-model="scope.row.invoiceNo"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subscription.contractInfo')" :width="isPdfDown ? 140 : 320">
            <template slot="header">
              {{ $t('subscription.contractInfo') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'ticketInfoList.' + scope.$index + '.salesContractName'" style="width:100%"
                :rules="rules.salesContractName">
                <div class="flex">
                  <el-input v-if="isAssigneePmo" :disabled="!isAssigneePmo" v-model="scope.row.salesContractName">
                    <el-button :disabled="!isAssigneePmo" slot="append" icon="el-icon-search"
                      @click="openSalesContractdailog(scope.row, scope.$index)"></el-button>
                  </el-input>
                  <div v-else>{{ scope.row.salesContractName }}</div>
                  <div class="text-hint" v-if="scope.row.salesContractName" @click="viewContract(scope.row)">查看合同</div>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subscription.poInfo')" :width="isPdfDown ? 100 : 270">
            <!-- <template slot="header">
              相关PO信息
              <span class="red">*</span>
              :prop="'ticketInfoList.' + scope.$index + '.salesOrderName'"
            </template> -->
            <template slot-scope="scope">
              <el-form-item style="width:100%" :rules="rules.salesOrderName">
                <el-input v-if="isAssigneePmo" :disabled="!isAssigneePmo" v-model="scope.row.salesOrderName"></el-input>
                <div v-else>{{ scope.row.salesOrderName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subscription.currency')" :width="isPdfDown ? 60 : 80">
            <template slot-scope="scope">
              <el-form-item style="width:100%">
                {{ scope.row.currency }}
                <!-- <el-input disabled v-model="scope.row.currency"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subscription.invoiceAmount')" :width="isPdfDown ? 70 : 130">
            <template slot-scope="scope">
              <el-form-item style="width:100%">
                {{ scope.row.invoicingAmount }}
                <!-- <el-input disabled v-model="scope.row.invoicingAmount"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subscription.receivedAmount')" :width="isPdfDown ? 80 : 130">
            <template slot="header">
              {{ $t('subscription.receivedAmount') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'ticketInfoList.' + scope.$index + '.receivedAmount'" style="width:100%"
                :rules="rules.receivedAmount">
                <el-input v-if="isAssigneePmo" :disabled="!isAssigneePmo" v-model="scope.row.receivedAmount"></el-input>
                <div v-else>{{ scope.row.receivedAmount }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subscription.downloadCustoms')" :width="isPdfDown ? 70 : 130">
            <template slot-scope="scope">
              <el-form-item style="width:100%">
                <div style="color: #409eff;font-size: 12px;" @click="dowmloadFile(scope.row)"> {{ scope.row.downFileName
                }}</div>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commonContent.remarks')" :width="isPdfDown ? 80 : 130">
            <template slot-scope="scope">
              <el-form-item style="width:100%">
                <el-input v-if="isAssigneePmo" v-model="scope.row.remark" type="textarea" autosize></el-input>
                <div v-else>{{ scope.row.remark }}</div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item :label="$t('subscription.receivedAmount')" prop="receivedTotalAmount">
        <el-input v-model="form.receivedTotalAmount" @blur="testAmount" clearable :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item :label="$t('subscription.invoiceTotalAmount')" prop="assetNumber">
        {{ getTotalAmount('invoicingAmount', 'invoiceTotalAmount') }}

      </el-form-item>
      <el-form-item :label="$t('subscription.deductionAmount')" prop="assetNumber">
        {{ getTotalAmount('receivedAmount', 'deductionAmount', -1) }}

      </el-form-item>
      <p class="table-title" style="width: 96%;">
        <span></span>{{ $t('subscription.otherInfo') }}
      </p>
      <el-form-item :label="$t('subscription.bankReceipt')" style="width: 90%" required :disabled="disabled">
        <upload :fileList="form.bankCollectionFileList" :btnName="$t('commonContent.upload')"
          @handleRequest="handleBankRequest" :multiple="true" :showFileList="true"></upload>
      </el-form-item>
      <el-form-item :label="$t('subscription.relatedAttachments')" style="width: 90%">
        <upload :isHistory="false" :fileList="form.attachmentFileList" :btnName="$t('commonContent.upload')"
          @handleRequest="handleAttachRequest" :multiple="true" :showFileList="true" :disabled="disabled"></upload>
      </el-form-item>
      <el-form-item :label="$t('commonContent.remarks')" style="width: 96%">
        <el-input type="textarea" autosize v-model="form.remark" :disabled="disabled"></el-input>
      </el-form-item>
    </el-form>
    <!--发票选择框-->
    <el-dialog :title="$t('subscription.selectInvoice')" :visible.sync="invoiceDialogVisible" :append-to-body="true" width="90%">
      <el-form :model="searchForm">
        <el-form-item :label="$t('subscription.invoiceName')" style="width: 200px;" prop="nameKey">
          <el-input v-model="searchForm.titleName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('subscription.invoiceNo')" style="width: 200px;margin-left: 20px" prop="nameKey">
          <el-input v-model="searchForm.invoiceNo" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('subscription.applicant')" style="width: 200px;margin-left: 10px" prop="type">
          <el-select v-model="searchForm.applyPerson" filterable clearable :placeholder="$t('commonContent.pleaseSelect')"
            @change="typeChange">
            <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('subscription.relatedContract')" style="width: 200px;margin-left: 10px" prop="type">
          <el-select v-model="searchForm.salesContractId" filterable clearable :placeholder="$t('commonContent.pleaseSelect')"
            @change="typeChange">
            <el-option v-for="item in salesContractList" :key="item.id" :value="item.id"
              :label="item.titleName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="invoiceSearch">{{ $t('commonContent.search') }}</el-button>
      <el-table :data="invoiceList" @cell-click="onCellClick" style="width: 100%; margin-top: 20px" stripe align="center"
        border height="350px">
        <el-table-column prop="titleName" :label="$t('subscription.invoiceName')" align="center" show-overflow-tooltip
          width="200" />
        <el-table-column prop="invoiceNo" :label="$t('subscription.invoiceNo')" align="center" width="150" />
        <el-table-column prop="applyPersonName" :label="$t('subscription.applicant')" align="center" width="100" />
        <el-table-column prop="applyDate" :label="$t('subscription.applyDate')" align="center" width="150" />
        <el-table-column prop="salesContractName" :label="$t('subscription.relatedContract')" show-overflow-tooltip
          align="center" />
        <el-table-column prop="salesOrderName" :label="$t('subscription.relatedPO')" show-overflow-tooltip
          align="center" />
        <el-table-column prop="currency" :label="$t('subscription.currency')" align="center" />
        <el-table-column prop="invoicingAmount" :label="$t('subscription.amount')" align="center" width="150" />
      </el-table>
    </el-dialog>

    <el-dialog :title="$t('subscription.selectContract')" :visible.sync="salesContractDialogVisible"
      :append-to-body="true">
      <el-form :model="searchContractForm">
        <el-form-item :label="$t('subscription.contractName')" style="width: 200px;" prop="nameKey">
          <el-input v-model="searchContractForm.titleName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('subscription.contractNo')" style="width: 200px;margin-left: 20px" prop="nameKey">
          <el-input v-model="searchContractForm.applyNo" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('subscription.applicant')" style="width: 200px;margin-left: 10px" prop="type">
          <el-select v-model="searchForm.type" :placeholder="$t('commonContent.pleaseSelect')" @change="typeChange">
            <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saleContractSearch">{{ $t('commonContent.search') }}</el-button>

      <el-table :data="salesContractList" @cell-click="onSalesContractCellClick" style="width: 100%; margin-top: 20px"
        stripe align="center" border height="350px">
        <el-table-column prop="titleName" :label="$t('subscription.contractName')" align="center" show-overflow-tooltip
          width="200" />
        <el-table-column prop="applyNo" :label="$t('subscription.contractNo')" align="center" width="150" />
        <el-table-column prop="salesType" :label="$t('subscription.salesType')" align="center" width="150" />
        <el-table-column prop="applyPersonName" :label="$t('subscription.applicant')" align="center" width="100" />
        <el-table-column prop="applyDate" :label="$t('subscription.applyDate')" align="center" width="150" />
      </el-table>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getFormatDate } from "@/util/util";
import SubscriptionApplyApi from "@/api/subscriptionApply/index";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList } from "@/api/organizationalStructure/department";
import { invoiceListForSubscribe, saveSubscribeInvoice } from "@/api/contract/subscriptionApplication";
import { invoiceDetail } from "@/api/billManage/poOrder";
import upload from "@/components/upload/index";
import { getSalesContractList } from "@/api/contract/salesContractNew";
import { mapGetters } from "vuex";
import { downloadFileBlob } from '@/util/util'
import Vue from "vue";
export default {
  components: {
    upload,
  },
  props: {
    isPdfDown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      titleName: null,
      isHistory: false,
      deptList: [],
      userList: [],
      invoiceList: [],
      contractList: [],
      salesContractList: [],
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      invoiceDialogVisible: false,
      salesContractDialogVisible: false,
      invoiceMultipleSelection: [],
      currentIndex: null,
      salesContractCurrentIndex: null,
      currentRow: {},
      searchForm: {
        titleName: '',
        invoiceNo: ''
      },
      searchContractForm: {
        titleName: '',
        applyNo: ''
      },
      form: {
        titleName: null,
        ticketInfoList: [
          {
            id: '',
            invoiceNo: '',
            invoiceName: '',
            titleName: '',
            salesContractName: '',
            salesOrderName: '',
            currency: '',
            invoicingAmount: 0.00,
            receivedAmount: null,
            deductionAmount: 0.00,
            remark: '',
          },
        ],
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        applyNo: null,
        applyDesc: null,
        bankCollectionFileList: []
      },
      rules: {
        // titleName: [{
        //   required: true, message: '请输入相关发票', trigger: 'blur'
        // }],
        receivedTotalAmount: [{
          required: true, message: '请输入本次收款金额', trigger: 'blur'
        }],
        salesContractName: [{
          required: true, message: '请选择相关合同信息', trigger: 'change'
        }],
        salesOrderName: [{
          required: true, message: '请输入相关PO信息', trigger: 'blur'
        }],
        receivedAmount: [{
          required: true, message: '请输入本次收款金额', trigger: 'blur'
        }],
        // bankCollectionFileList:[{
        //   required: true, message: '请输入银行收款凭证', trigger: 'change'
        // }],
      }
    };
  },
  mounted() {
    this.form.titleName = ('认款申请单' +
      " - " +
      (this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name) +
      " - " +
      getFormatDate())
    this.businessId = this.$route.query.businessId;
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.form.applyDept = this.userInfo.dept_id;
    this.isEdit = this.$route.query.isEdit;
    this.getDeptList();
    this.getUserList();
    if (this.businessId) {
      this.getDetail();
    } else {
      this.dealRequire()
    }
    this.getInvoiceList({});
    this.getSalesContractList({});
    this.getContractList()

  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
    isAssigneePmo() {
      return this.form.flow && this.form.flow.taskDefinitionKey && (this.form.flow.taskDefinitionKey === 'assigneePmo' || this.form.flow.assigneeName === '范达')
    }
  },
  methods: {
    dealRequire() {
      let isAssigneePmo = this.form.flow && this.form.flow.taskDefinitionKey && (this.form.flow.taskDefinitionKey === 'assigneePmo' || this.form.flow.assigneeName === '范达')
      this.rules.receivedAmount[0].required = isAssigneePmo ? true : false
      this.rules.salesContractName[0].required = isAssigneePmo ? true : false
      this.rules.salesOrderName[0].required = isAssigneePmo ? true : false
      console.log(this.rules)
    },
    // async getContractList(){
    //   getSalesContractList(params).then((res) => {
    //     this.salesContractList = res.data.data;
    //   });
    // },
    async getDetail() {
      let res = await SubscriptionApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.applyPerson = this.form.applyPerson ? this.form.applyPerson.toString() : ""
        this.$emit("getFormData", this.form);
        this.form.ticketInfoList.forEach((item) => {
          item.titleName = item.invoiceName;
        })
        this.isHistory = (this.form.opinion || this.form.source)
        this.dealRequire()
      }
    },
    dowmloadFile(row) {
      downloadFileBlob(row.downFileUrl, `${row.downFileName.includes(".pdf")}?${row.downFileName}:${row.downFileName}.pdf`)
    },
    testAmount(value) {
      console.log(value)
      if (!/^[\d.]+$/.test(Number(this.form.receivedTotalAmount))) {
        this.$message.error('请输入数字')
        this.form['receivedTotalAmount'] = null
      }
    },
    viewContract(row) {
      // console.log(row)
      let url = `/saleContractApplication?businessId=${row.salesContractId}`
      window.open(this.$router.resolve({ path: url }).href, '_blank')
    },
    getTotalAmount(money, totalKey, count = 1) {
      // console.log(this.form.ticketInfoList)
      let arr = this.form.ticketInfoList.map(ele => ele[money])
      console.log(arr)
      var sum = arr.reduce(function (prev, curr, idx, arr) {
        // return Number(prev || 0) + Number(curr || 0);
        const value = Number(curr);
        if (!isNaN(value)) {
          return Number(prev) + Number(curr);
        } else {
          return prev;
        }
      });
      console.log(sum + 'sum')
      this.form[totalKey] = Number(sum * count).toFixed(2)
      return this.form[totalKey]
    },
    onCellClick(row) {
      console.log(row)
      this.form.ticketInfoList[this.currentIndex].id = row.id;
      this.form.ticketInfoList[this.currentIndex].titleName = row.titleName;
      this.form.ticketInfoList[this.currentIndex].invoiceName = row.titleName;
      this.form.ticketInfoList[this.currentIndex].invoiceNo = row.invoiceNo;
      this.form.ticketInfoList[this.currentIndex].salesContractName = row.salesContractName;
      this.form.ticketInfoList[this.currentIndex].salesOrderName = row.salesOrderName;
      this.form.ticketInfoList[this.currentIndex].currency = row.currency;
      this.form.ticketInfoList[this.currentIndex].invoicingAmount = row.invoicingAmount;
      // this.form.ticketInfoList[this.currentIndex].receivedAmount = row.receivedAmount;
      this.form.ticketInfoList[this.currentIndex].deductionAmount = row.deductionAmount;
      this.form.ticketInfoList[this.currentIndex].remark = row.remark;
      this.form.ticketInfoList[this.currentIndex].invoiceId = row.id
      this.form.ticketInfoList[this.currentIndex].salesContractId = row.salesContractId
      this.invoiceDialogVisible = false;

      let invoiceTotalAmount = 0.00;
      let deductionAmount = 0.00;
      this.form.ticketInfoList.forEach((item) => {
        invoiceTotalAmount = invoiceTotalAmount + parseFloat(item.invoicingAmount);
        deductionAmount = 0.00 - this.form.receivedTotalAmount;

        this.$set(this.form, 'invoiceTotalAmount', invoiceTotalAmount.toFixed(2));
        this.$set(this.form, 'deductionAmount', deductionAmount.toFixed(2));
      })
      console.log(this.form.ticketInfoList)
      console.log('this.form.ticketInfoList')
    },
    onSalesContractCellClick(row) {
      console.log(JSON.stringify(row));
      this.form.ticketInfoList[this.salesContractCurrentIndex].salesContractName = row.titleName;
      this.form.ticketInfoList[this.salesContractCurrentIndex].salesContractId = row.id;
      this.salesContractDialogVisible = false;
    },
    invoiceSearch() {
      this.getInvoiceList(this.searchForm);
    },
    saleContractSearch() {
      this.getSalesContractList(this.searchContractForm);
    },
    testForm() {
      // return true;
      console.log(this.form.ticketInfoList)
      if (!this.form.titleName) {
        this.$message.error('请输入标题')
        return
      }
      this.form.ticketInfoList = this.form.ticketInfoList || []
      this.form.ticketInfoList.map(ele => {
        if (!ele.subscribeApplyId) {
          ele.subscribeApplyId = this.businessId
        }
      })
      let isAssigneePmo = this.form.flow && this.form.flow.taskDefinitionKey && (this.form.flow.taskDefinitionKey === 'assigneePmo' || this.form.flow.assigneeName === '范达')
      if (isAssigneePmo) {
        for (let row of this.form.ticketInfoList) {
          if (!row.titleName) {
            this.$message.error('请选择相关发票')
            return
          }
        }
      }
      this.form.bankCollectionFileList.map(ele => {
        if (ele.originalUrl) {
          ele.url = ele.originalUrl
        }
      })
      if (this.form.bankCollectionFileList.length === 0) {
        this.$message.error('请上传银行收款凭证')
        return false
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, msg) => {
          console.log(msg)
          resolve(valid);
          if (valid) {

          } else {
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
    getDeptList() {
      getLazyList("", this.tenantId).then((res) => {
        this.deptList = res.data.data;
      });
    },
    getUserList() {
      userList(this.tenantId).then((res) => {
        this.userList = res.data.data;
      });
    },
    invoiceSelectionChange(val) {
      this.invoiceMultipleSelection = val;
    },
    addInvoiceRow() {
      this.form.ticketInfoList.push({
        id: '',
        invoiceNo: '',
        salesContractName: '',
        salesOrderName: '',
        currency: '',
        invoicingAmount: null,
        receivedAmount: null,
        remark: '',
      });
    },
    deleteChooseRow() {
      if (this.invoiceMultipleSelection.length === 0) {
        this.$message.error("请先选择认票信息");
        return;
      }
      let keys = this.invoiceMultipleSelection.map((ele) => ele.key);
      let ids = this.invoiceMultipleSelection.map((ele) => ele.id);
      this.form.ticketInfoList = this.form.ticketInfoList.filter((ele) => {
        return !keys.includes(ele.key) || !ids.includes(ele.id);
      });
    },
    getInvoiceList(param) {
      invoiceListForSubscribe(param).then((res) => {
        this.invoiceList = res.data.data;
      });
    },
    getSalesContractList(param) {
      getSalesContractList(param).then((res) => {
        this.salesContractList = res.data.data;
      });
    },
    changeInvoice(event, row, index) {
      let businessId = event;
      invoiceDetail({ businessId }).then((res) => {
        let changeRow = res.data.data;
        row.id = changeRow.id;
        row.invoiceNo = changeRow.invoiceNo;
        row.salesContractName = changeRow.salesContractName;
        row.salesOrderName = changeRow.salesOrderName;
        row.currency = changeRow.currency;
        row.invoicingAmount = changeRow.invoicingAmount;
        row.remark = changeRow.remark;
        let invoiceTotalAmount = 0.00;
        let deductionAmount = 0.00;
        this.form.ticketInfoList.forEach((item) => {
          invoiceTotalAmount = invoiceTotalAmount + parseInt(item.invoicingAmount);
          deductionAmount = 0.00 - this.form.receivedTotalAmount;
          this.$set(this.form, 'invoiceTotalAmount', invoiceTotalAmount);
          this.$set(this.form, 'deductionAmount', deductionAmount);
        })
      });
    },
    saveSubscriptionApply() {
      saveSubscribeInvoice(this.form).then((res) => {
        if (res.data.code === 0) {
          this.$message.success(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleBankRequest(data, list) {
      this.form.bankCollectionFileList = list;
      this.$refs.form.clearValidate()
    },
    handleAttachRequest(data, list) {
      console.log(list)
      this.form.attachmentFileList = list;
    },
    openInvoicedailog(row, index) {
      this.$refs.form.clearValidate()
      this.currentIndex = index
      this.invoiceDialogVisible = true;
    },
    openSalesContractdailog(row, index) {
      this.salesContractCurrentIndex = index
      this.salesContractDialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
}

.text-hint {
  width: 100px;
  padding-left: 5px;
  color: #203b71;
}

::v-deep ep.el-input-group__append {
  text-align: center
}

@media (min-width: 768px) {
  .el-form-item {
    width: 48%;
  }
}

.fullscreenL {
  overflow: scroll;
}

.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.w-100 {
  width: 100%;
}

.dec-icon {
  color: #979797;
  background-color: #eaeaea;
  padding: 3px 6px;
  border-radius: 2px;
  margin-right: 20px;
}

.exitFull {
  position: absolute;
  padding: 20px;
  color: transparent;
  z-index: 1000;
}

.exitFull:hover {
  color: #fff;
  background-color: #000;
}

.botton-row {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.el-select-dropdown .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  width: 250px;
  height: auto;
  padding: 0;
}

.table-now {}</style>
