<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('flow.processForm')" name="first">
        <p class="table-title"><span></span>{{ $t('invoice.basicInfo') }}</p>
        <el-form :disabled="disabled" v-if="!isPreviewExcel && !isPreviewPdf" ref="form" :rules="rules" :model="form"
          :label-width="labelWidth">
          <el-form-item :label="$t('commonContent.title')" style="width: 96%">
            <el-input v-model="form.titleName" :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('commonContent.applicant')">
            <el-select v-model="form.applyPerson" disabled>
              <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('commonContent.department')">
            <el-select v-model="form.applyDept" clearable disabled>
              <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('commonContent.applyDate')">
            <el-input v-model="form.applyDate" clearable disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.invoiceNo')">
            <el-input v-model="form.invoiceNo" clearable disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.invoiceDesc')" style="width: 96%;">
            <el-input type="textarea" v-model="form.applyDesc" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <p class="table-title"><span></span>{{ $t('invoice.invoiceInfo') }}</p>
          <el-button @click="goToSalesOrderDetail">{{ $t('invoice.viewOrder') }}</el-button>
          <el-button @click="goToSalesContractDetail">{{ $t('invoice.viewContract') }}</el-button>
          <el-form-item :label="$t('invoice.salesType')" style="width: 96%;">
            <el-select v-model="form.salesType" :disabled="isDetail">
              <el-option v-for="item in saleTypeList" :key="item.dictKey" :label="item.dictValue"
                :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.relatedContract')">
            <el-select    v-model="form.salesContractNo" filterable :disabled="isDetail" @change="updateSaleContract">
              <el-option v-for="item in salesContractList" :key="item.id" :label="item.titleName"
                :value="item.applyNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.contractNo')">
            <el-input v-model="form.salesContractNo" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.relatedOrder')">
            <el-select v-model="form.salesOrderId" clearable :disabled="isDetail" @change="changeSalesOrder">
              <el-option v-for="item in salesOrderList" :key="item.id" :label="item.orderName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.orderNo')">
            <el-input v-model="form.salesOrderNo" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.invoiceType')">
            <el-select v-model="form.invoiceTypeDisplay">
              <el-option v-for="item in invoiceTypeList" :key="item.dictKey" :label="item.dictValue"
                :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.contractType')">
            <el-input v-model="form.salesContractTypeName" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.projectName')" prop="projectId">
            <el-select v-model="form.projectId" clearable :disabled="isDetail" @change="changeProject">
              <el-option v-for="item in projectList" :value="item.id" :key="item.id"
                :label="item.projectName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.orderNo')">
            <el-input v-model="form.projectNo" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.currency')">
            <el-select v-model="form.currency" clearable :disabled="isDetail">
              <el-option v-for="item in currencyList" :key="item.dictKey" :label="item.dictValue"
                :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.taxRate')">
            <el-input v-model="form.taxRate" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.invoiceAmount')">
            <el-input v-model="form.invoicingAmount" clearable></el-input>
          </el-form-item>
          <p class="table-title" style="width: 96%"><span></span>{{ $t('invoice.customerInfo') }}</p>
          <el-form-item :label="$t('invoice.customerName')">
            <el-select v-model="form.custId" clearable @change="contractCustChange" :disabled="isDetail">
              <el-option v-for="item in custList" :value="item.id" :key="item.id" :label="item.custName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.contact')">
            <el-select v-model="form.contactId" clearable :disabled="isDetail">
              <el-option v-for="item in custContactList" :value="item.id" :key="item.id"
                :label="item.contactName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('invoice.customerNo')">
            <el-input v-model="form.custNo" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.taxId')">
            <el-input v-model="form.taxpayerIdentityNumber" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.address')">
            <el-input v-model="form.custAddr" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.bank')">
            <el-input v-model="form.openBank" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('invoice.accountNo')">
            <el-input v-model="form.bankAccount" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <p class="table-title" style="width: 96%"><span></span>{{ $t('invoice.billInfo') }}</p>
          <el-form-item label-width="0" style="width: 100%;">
            <div class="fr">
              <span class="add-icon" @click="addInvoiceInfoRow">+</span>
              <span class="dec-icon" @click="deleteInvoiceInfoRow">―</span>
            </div>
            <el-table ref="multipleTable" :data="form.invoiceInfoList" class="mb20 table-now"
              @selection-change="invoiceInfoSelectionChange">
              <el-table-column type="selection" width="42"></el-table-column>
              <el-table-column :label="$t('invoice.itemName')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemDesc" :disabled="isDetail"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('invoice.partNo')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.partsNo" :disabled="isDetail"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('commonContent.unit')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.unitName" :disabled="isDetail"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('commonContent.unitPrice')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.unitPrice" :disabled="isDetail"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('commonContent.quantity')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.quantity" :disabled="isDetail"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('invoice.salesPrice')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.amount" :disabled="isDetail"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <p class="table-title" style="width: 96%"><span></span>{{ $t('commonContent.otherInfo') }}</p>
          <el-form-item :label="$t('commonContent.attachments')" style="width: 96%"
            :required="form.salesType === 'license' || form.invoiceTypeDisplay === '1'">
            <upload :fileList="form.fileList" :btnName="$t('commonContent.upload')" @handleRequest="handleRequest"
              :multiple="true" :showFileList="true"></upload>
          </el-form-item>
          <el-form-item label="PAN:">
            <el-input type="input" v-model="form.pan" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item label="GSTIN:">
            <el-input type="input" v-model="form.gstin" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('commonContent.remarksLeft')">
            <el-input type="textarea" v-model="form.remarkLeft" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('commonContent.remarks')">
            <el-input type="textarea" v-model="form.remark" clearable :disabled="isDetail"></el-input>
          </el-form-item>
          <p v-if="form.status == 3" class="table-title" style="width: 96%"><span></span>{{ $t('commonContent.opinion') }}
          </p>
          <el-form-item :label="$t('commonContent.opinion')" v-if="form.status == 3">
            <el-input v-model="comment" clearable></el-input>
          </el-form-item>
        </el-form>
        <div style="width: 95%;text-align: center;">
          <el-button type="primary" @click="saveInvoice" v-if="form.status == 2">{{ $t('invoice.saveInvoice')
          }}</el-button>
          <el-button type="primary" @click="goToInvoiceView" v-if="form.invoiceType == 3">{{
            $t('invoice.previewInvoice') }}</el-button>
          <el-button v-if="canOperateBtn()" type="primary" @click="handleOperation('disAgree')">{{
            $t('commonContent.return')
          }}</el-button>
          <el-button v-if="canOperateBtn()" type="primary" @click="handleOperation('agree')">{{
            $t('commonContent.approve')
          }}</el-button>
          <el-button v-if="form.status == 4" type="primary" @click="invoiceApply">{{ $t('commonContent.save')
          }}</el-button>
          <el-button v-if="form.status == 2" type="primary" @click="invoiceApply">{{ $t('invoice.apply') }}</el-button>
          <el-button v-if="form.status == 4" type="primary" @click="handleOperation('agree')">{{
            $t('commonContent.submit')
          }}</el-button>
        </div>
        <el-timeline :reverse="reverse">
          <el-timeline-item :key="flow.id" :timestamp="flow.createTime" v-for="flow in flowList" placement="top">
            <el-card shadow="hover">
              <p>{{ $t('flow.timeline.startProcess', {
                name: flow.assigneeName,
                time: flow.createTime,
                activity: flow.historyActivityName
              }) }}</p>
              <p v-if="flow.historyActivityDurationTime !== ''">
                {{ $t('flow.timeline.duration', { duration: flow.historyActivityDurationTime }) }}
              </p>
              <p v-if="flow.comment !== ''">
                {{ $t('flow.timeline.comment', { comment: flow.comment }) }}
              </p>
              <p v-if="flow.endTime !== ''">
                {{ $t('flow.timeline.endTime', { time: flow.endTime }) }}
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
      <el-tab-pane :label="$t('flow.flowChart')" name="second" v-if="!isMobile">
        <img class="pb100 w-100" :src="src" alt="design" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>
<script>
import upload from "@/components/upload/index";
import { toJpeg } from "html-to-image";
import print from "print-js";
import { debounce } from "@/util/util";
import InvoiceSet from "./invoiceSet";
import { invoiceDetail, invoiceStartProcess, getSalesOrderList, getCustContactList, getTaskHis, saveInvoice } from "@/api/billManage/poOrder";
import { completeTask } from '@/api/myFlow/index'
import { getDictionary } from "@/api/system/dict";
import { getSalesContractList } from "@/api/contract/salesContractNew";
import { getProjectList } from "@/api/contract/contractProject";
import { getCustList } from "@/api/contract/contractCustomer";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList } from "@/api/organizationalStructure/department";
import { mapGetters } from "vuex";
import SaleContractApplyApi from "@/api/saleContractApply/index"
// import Vue from "vue";
export default {
  components: {
    InvoiceSet,
    upload
  },
  data() {
    return {
      comment: null,
      flowList: [],
      reverse: true,
      invoiceSet: false,
      activeName: "first",
      saleTypeList: [],
      salesContractList: [],
      salesOrderList: [],
      invoiceTypeList: [],
      projectList: [],
      currencyList: [],
      custList: [],
      custContactList: [],
      userList: [],
      deptList: [],
      isDetail: false,
      invoiceInfoMultipleSelection: [],
      timeout: null,
      rules: [{}],
      form: {
        salesType: null,
        invoiceInfoList: [
          {
            key: Date.now(),
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo", "isMobile"]),
    total() {
      const invoiceInfoList = this.form.invoiceInfoList.map((item) =>
        Number(item.amount)
      );
      return invoiceInfoList.reduce((pre, cur) => pre + cur, 0);
    },
  },
  created() {
    this.init();
  },
  methods: {
    //流程
    handleClick() {
      if (this.form.id) {
        this.processInstanceId = this.form.processInstanceId;
        this.src = `/api/oa-flow/process/diagram-view?processInstanceId=${this.processInstanceId
          }&t=${new Date().getTime()}`;
        console.log("this.src-->" + this.src);
      }
    },
    handlePrint() {
      toJpeg(document.getElementById("print"), { quality: 0.95, width: 980, backgroundColor: '#ffffff' }).then(
        (dataUrl) => {
          print({
            printable: dataUrl,
            type: "image",
            base64: true,
            style: `@media print { @page {size: auto; margin: 0; } body{margin:0 5px}}`,
          });
        }
      );
    },
    updateSaleContract() {
      let row = this.salesContractList.find(ele => {
        return ele.applyNo === this.form.salesContractNo
      })
      this.form.salesContractType = row.salesContractType + ""
      this.form.salesContractName = row.titleName
      // console.log(row)
      this.form.salesContractId = row.id
      // this.getSalesContractDetail(this.form.salesContractId)
      // let row = this.salesContractList.find(ele => {
      //   return this.form.salesContractId === ele.id
      // })
      // if (row) {
      //   this.form.salesContractNo = row.applyNo
      //   this.form.salesContractName = row.titleName
      // }
    },
    async getSalesContractDetail() {
      let res = await SaleContractApplyApi.details(this.form.salesContractId)
      //  console.log(res)
      if (res.data.code === 200 || res.data.code === 0) {
        let arr = res.data.data.salesContractDetailNewList || []

        arr.map(ele => {
          this.form.invoiceInfoList.map(item => {
            if (ele.partsDetail === item.partsNo) {
              item.unitPrice = ele.unitPrice
              item.amount = Number(item.unitPrice) * Number(item.quantity)
            }
          })
        })
      }
    },
    changeProject() {
      let row = this.projectList.find(ele => {
        return this.form.projectId === ele.id
      })
      console.log(row)
      if (row) {
        this.form.projectNo = row.projectNo
        this.form.projectName = row.projectName
      }
    },
    changeSalesOrder() {
      console.log('form.salesOrderId')
      // let row = this.salesOrderList.find(ele=>{
      //   return this.form.salesOrderId === ele.id
      // })
      // console.log(row)
      // if(row){
      //   this.form.salesOrderNo = row.projectNo
      //   this.form.salesOrderName = row.projectName
      // }
    },
    invoiceApply() {
      debounce(this.submit, this, 1000)
    },
    submit() {
      invoiceStartProcess(this.form).then((res) => {
        if (res.data.success) {
          this.invoiceDetail();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    init() {
      this.invoiceDetail();
      this.getDictionary({ code: "CURRENCY" }, "currency");
      this.getDictionary({ code: "SALE_TYPE" }, "saleType");
      this.getDictionary({ code: "INVOICE_TYPE" }, "invoiceType");
      this.getSalesContractList({});
      this.getSalesOrderList({});
      this.getProjectList();
      this.getCustList();
      this.getUserList();
      this.getDeptList();
    },
    invoiceDetail() {
      const businessId = this.$route.query.businessId;
      const salesOrderNo = this.$route.query.salesOrderNo;
      if (!businessId && !salesOrderNo) return
      invoiceDetail({ salesOrderNo, businessId }).then((res) => {
        this.form = res.data.data;
        // if (this.form.salesContractNo) {
        //   this.form.salesContractNo = this.form.salesContractNo.split(",")
        // }
        if (this.form.invoicingAmount === null || this.form.invoicingAmount === '') {
          this.getAmount()
        }
        this.isDetail = (this.form.status == 1 || this.form.status == 3);
        if (this.form.invoiceTypeDisplay != null) {
          this.form.invoiceTypeDisplay = this.form.invoiceTypeDisplay.toString()
        }
        console.log("this.form.processInstanceId-->" + this.form.processInstanceId);
        if (this.form.processInstanceId != null) {
          getTaskHis({ processInstanceId: this.form.processInstanceId }).then(res => {
            console.log("res.data-->" + JSON.stringify(res));
            this.flowList = res.data.data;
          });
        }
      });
    },
    //可操作审批和退回的按钮条件，当前人和未操作人是同一个人。非已阅读，已退回状态
    canOperateBtn() {
      return this.form.assignee != null && this.form.assignee.toString() === this.userInfo.user_id.toString() && this.form.status == 3
    },
    handleOperation(key) {
      if (key === 'agree') {
        if ((!this.form.fileList || this.form.fileList.length == 0)) {
          if (this.form.salesType === 'license') {
            this.$message.error('请上传和客户签字或盖章的销售订单')
            return
          } else if (this.form.invoiceTypeDisplay === '1') {
            this.$message.error('请上传开票委托单和开票通知')
            return
          }
        }
      }
      this.$confirm(`确定${key == 'agree' ? '批准' : "退回"}此流程吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doOperate(key)
      }).catch(() => {

      });
    },
    goToSalesContractDetail() {
      this.$router.push({
        path: "/saleContractApplication",
        query: {
          businessId: this.form.salesContractId,
        },
      });

    },
    goToInvoiceView() {
      this.$router.push({
        path: "/billManage/poOrder/invoiceView",
        query: {
          businessId: this.form.id,
        },
      });
    },
    goToSalesOrderDetail() {
      this.$router.push({
        path: "/billManage/poOrder/add",
        query: {
          id: this.form.salesOrderId,
        },
      });
    },
    doOperate(key) {
      debounce(this.submit, this, 1000)
      const params = {
        taskId: this.form.taskId,
        comment: this.comment,
        processInstanceId: this.form.processInstanceId,
        flag: 'ok',
      };
      if (key === 'disAgree') {
        delete params.flag
      }
      completeTask(params).then(res => {
        const data = res.data;
        if (data.success) {
          this.invoiceDetail();
          this.$message.success(data.msg);
          //设置状态
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    invoiceSetClose(data) {
      this.invoiceSet = false;
      if (data) this.init();
    },
    getDictionary(params, type) {
      getDictionary(params).then((res) => {
        if (type === "currency") {
          this.currencyList = res.data.data;
        } else if (type === "saleType") {
          this.saleTypeList = res.data.data;
        } else if (type === "invoiceType") {
          this.invoiceTypeList = res.data.data;
        }
      });
    },
    getAmount() {
      let values = this.form.invoiceInfoList.map(ele => Number(ele.amount))
      this.form.invoicingAmount = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);
    },
    getSalesContractList(params) {
      getSalesContractList(params).then((res) => {
        this.salesContractList = res.data.data;
      });
    },
    getSalesOrderList(params) {
      getSalesOrderList(params).then((res) => {
        this.salesOrderList = res.data.data;
      });
    },
    getProjectList() {
      getProjectList({}).then((res) => {
        this.projectList = res.data.data;
      });
    },
    getCustList() {
      getCustList({}).then((res) => {
        this.custList = res.data.data;
        this.custList.forEach((item) => {
          if (this.form.custId == item.id) {
            this.form.custNo = item.custNo;
            this.form.taxpayerIdentityNumber = item.taxpayerIdentityNumber;
            this.form.custAddr = item.custAddr;
            this.form.openBank = item.openBank;
            this.form.bankAccount = item.bankAccount;
            getCustContactList({ id: item.id }).then((res) => {
              this.custContactList = res.data.data;
            });
          }
        })
      });
    },
    getUserList() {
      userList(this.tenantId).then((res) => {
        this.userList = res.data.data;
      });
    },
    getDeptList() {
      getLazyList(this.parentId, this.tenantId).then((res) => {
        this.deptList = res.data.data;
      });
    },
    handleRequest(data, list) {
      this.form.fileList = list;
      this.form.fileList.forEach((file) => {
        delete file.status
      });
    },
    addInvoiceInfoRow() {
      this.form.invoiceInfoList.push({
        key: Date.now(),
      });
    },
    deleteInvoiceInfoRow() {
      if (this.invoiceInfoMultipleSelection.length === 0) {
        this.$message.error("请先选择工作经历");
        return;
      }
      let keys = this.invoiceInfoMultipleSelection.map((ele) => ele.key);
      let ids = this.invoiceInfoMultipleSelection.map((ele) => ele.id);
      this.form.invoiceInfoList = this.form.invoiceInfoList.filter((ele) => {
        return !keys.includes(ele.key) || !ids.includes(ele.id);
      });
    },
    invoiceInfoSelectionChange(val) {
      this.invoiceInfoMultipleSelection = val;
    },
    contractCustChange(val) {
      console.log("val-->" + val);
      console.log("custList-->" + JSON.stringify(this.custList));
      this.custList.forEach((item) => {
        if (val == item.id) {
          this.form.custNo = item.custNo;
          this.form.taxpayerIdentityNumber = item.taxpayerIdentityNumber;
          this.form.custAddr = item.custAddr;
          this.form.openBank = item.openBank;
          this.form.bankAccount = item.bankAccount;
        }
      });

      getCustContactList({ id: val }).then((res) => {
        this.custContactList = res.data.data;
      });
    },
    saveInvoice() {
      saveInvoice(this.form).then((res) => {
        if (res.data.success) {
          this.$message.success(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
};
</script>
<style scoped lang="scss">
.el-form {
  display: flex;
  flex-wrap: wrap;

  .el-form-item {
    width: 48%;
    margin-left: 5px;
  }
}

.invoice-box {
  font-size: 12px;
  width: 795px;
  margin: 0 auto 50px;
}

.el-table {
  thead tr th {
    background: #81d3f8;
  }

  th,
  td {
    color: #000;
    padding: 3px 0;
  }

  .text-c {

    th,
    td {
      text-align: center;
    }
  }
}

.invoice-details {
  p {
    line-height: 20px;
  }

  .label {
    width: 110px;
    display: inline-block;
  }

  .value {
    display: inline-block;
    width: 200px;
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
