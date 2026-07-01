<template>
  <div>
    <el-button v-if="form.status == 2 || form.status == 4" type="primary" @click="invoiceApply">发票申请</el-button>
    <!--国外发票form.invoiceType == 3-->
    <el-scrollbar>
      <el-button   v-if="form.status == 1" type="primary" @click="handlePrint">打印发票</el-button>
      <!--      <el-button v-if="form.status == 2 || form.status == 4" type="primary" @click="invoiceSet = true">发票设置</el-button>-->
      <InvoiceSet v-if="invoiceSet" @close="invoiceSetClose" :form="form"></InvoiceSet>
      <div class="text-center">
        <el-card shadow="always" id="print" class="invoice-box pt50 pb50 pr40" style="border:none;">
          <el-row type="flex">
            <el-col style="width: 50px;" class="mr10">
              <img src="/oa/img/newlogo.png" width="100%" />
            </el-col>
            <el-col>
              <el-row type="flex" class="mb10 text-left">
                <el-col class="fs14" style="line-height: 24px">
                  <span class="fs16">SAIC MOTOR Overseas Intelligent Mobility Technology Co., Ltd</span>
                  <br />
                  <span>7th Floor, 1CVIC, NO.36 South YuTian Rd.</span>
                  <br />
                  <span>AnTing, JiaDing District, Shanghai PR.China 201805</span>
                  <br />
                  <span>Tel: 021-59110319</span>
                </el-col>
                <el-col style="width: 300px;">
                  <p class="fr">Invoice</p>
                  <table class="el-table el-table--border">
                    <thead class="el-table__header">
                      <tr class="el-table__row">
                        <th class="is-center" width="50%">Date</th>
                        <th class="is-center" width="50%">Invoice #</th>
                      </tr>
                    </thead>
                    <tbody class="el-table__body">
                      <tr class="el-table__row">
                        <td class="is-center">{{ form.applyDate }}</td>
                        <td class="is-center">{{ form.invoiceNo }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="el-table el-table--border">
                    <thead class="el-table__header">
                      <tr class="el-table__row">
                        <th class="is-center" width="50%">Contract NO.</th>
                        <th class="is-center" width="50%">POR</th>
                      </tr>
                    </thead>
                    <tbody class="el-table__body">
                      <tr class="el-table__row">
                        <td class="is-center"></td>
                        <td class="is-center"></td>
                      </tr>
                    </tbody>
                  </table>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20">
                <el-col>
                  <table class="el-table el-table--border">
                    <thead>
                      <tr>
                        <th class="is-center">Bill To</th>
                      </tr>
                    </thead>
                    <tbody class="el-table__body">
                      <tr class="el-table__row">
                        <td height="120px" style="padding-left: 10px;">
                          <p>{{ form.custName }}</p>
                          <div class="mt30 mb30">{{ form.custAddr }}</div>
                          <p>Attn:</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </el-col>
                <el-col>
                  <table class="el-table el-table--border">
                    <thead>
                      <tr>
                        <th class="is-center">Notify</th>
                      </tr>
                    </thead>
                    <tbody class="el-table__body">
                      <tr class="el-table__row">
                        <td height="120px" style="padding-left: 10px;" class="fs12">
                          <p>{{ form.contactName }}</p>
                          <p>Tel:{{ form.contactTel }}</p>
                          <p>email:{{ form.contactEmail }}</p>
                          <p>Fax:{{ form.fax }}</p>
                          <p>IEC:{{ form.iec }}</p>
                          <p>PAN:{{ form.pan }}</p>
                          <p>GSTIN:{{ form.gstin }}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </el-col>
              </el-row>
              <el-row type="flex" class="mb10 mt10 text-left">
                <el-col>Terms:{{ form.projectName }}</el-col>
                <el-col>Currency：{{ form.currency }}</el-col>
              </el-row>
              <table class="el-table el-table--border">
                <thead>
                  <tr>
                    <th class="is-center">Item NO</th>
                    <th class="is-center">Item Description</th>
                    <th class="is-center">part no</th>
                    <th class="is-center">QTY</th>
                    <th class="is-center">UNIT PRICE</th>
                    <th class="is-center">Amount</th>
                  </tr>
                </thead>
                <tbody class="el-table__body">
                  <tr class="el-table__row text-c" v-for="(item, index) in form.invoiceInfoList" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td style="width: 310px;text-align: left;">{{ item.itemDesc }}</td>
                    <td>{{ item.partsNo }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.unitPrice }}</td>
                    <td>{{ item.amount }}</td>
                  </tr>
                </tbody>
              </table>

              <el-row type="flex" class="mt5">
                <el-col>
                  <el-card style="min-height: 120px; white-space: pre-wrap; font-size: 15px; line-height: 1.6; word-break: break-word;"
                    shadow="never">Remarks： {{ form.remarkLeft }}</el-card>
                </el-col>
                <el-col class="ml40 invoice-details text-left" style="line-height: 30px;">
                  <p>
                    <span class="label">Discount item</span>
                    <span class="value"></span>
                  </p>
                  <p>
                    <span class="label">Margin</span>
                    <span class="value"></span>
                  </p>
                  <p>
                    <span class="label">Total Net Expense Flat Fee</span>
                    <span class="value">{{ total.toFixed(2) }}</span>
                  </p>
                  <p>
                    <span class="label">Remarks</span>
                    <span class="value">{{ form.remark }}</span>
                  </p>
                  <p>
                    <span class="label">Others</span>
                    <span class="value"></span>
                  </p>
                  <p>
                    <span class="label">Total</span>
                    <span class="value">{{ total.toFixed(2) }}</span>
                  </p>
                </el-col>
              </el-row>
              <table class="el-table el-table--border mt5">
                <thead>
                  <tr>
                    <th style="padding-left: 10px;">PLEASE MAKE A DIRECT DEPOSIT OF <span style="color: red">{{
                      total.toFixed(2) }}</span> WITHIN 30 DAYS TO:</th>
                  </tr>
                </thead>
                <tbody class="el-table__body">
                  <tr class="el-table__row">
                    <td style="padding-left: 10px;     height: 110px;
      vertical-align: top;" class="fs12">
                      Bank Name: Industrial and Commercial Bank of China , Shanghai Municipal Branch
                      <br />Account Name: SAIC MOTOR Overseas Intelligent Mobility Technology Co., Ltd
                      <br />CNY Account No: 1001190709004852992
                      <br />USD Account No: 1001190709148033951
                      <br />Swift Code: ICBKCNBJSHI
                      <br />CNAPS Code: 102290019077
                      <br />Bank Address: NO.9 Pudong Avenue 200120 Shanghai,China
                    </td>
                  </tr>
                </tbody>
              </table>
              <el-card style="height: 100px; " class="mt10 fs12 text-left" shadow="never" :body-style="{ padding: '10px' }">
                <p class="mb20">
                  We would like to thank you very much for the pleasant and trustful cooperation.
                  <br />Regards,
                </p>Finance
                <br />SAIC MOTOR Overseas Intelligent Mobility Technoloy Co., Ltd
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div>

    </el-scrollbar>
  </div>
</template>
<script>
import upload from "@/components/upload/index";
import { toJpeg } from "html-to-image";
import print from "print-js";
import InvoiceSet from "./invoiceSet";
import { invoiceDetail, invoiceStartProcess, getSalesOrderList } from "@/api/billManage/poOrder";
import { completeTask } from '@/api/myFlow/index'
import { getDictionary } from "@/api/system/dict";
import { getSalesContractList } from "@/api/contract/salesContractNew";
import { getProjectList } from "@/api/contract/contractProject";
import { getCustList } from "@/api/contract/contractCustomer";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";

import { mapGetters } from "vuex";
export default {
  components: {
    InvoiceSet,
    upload
  },
  data() {
    return {
      invoiceSet: false,
      saleTypeList: [],
      salesContractList: [],
      salesOrderList: [],
      invoiceTypeList: [],
      projectList: [],
      currencyList: [],
      custList: [],
      userList: [],
      deptList: [],
      invoiceInfoMultipleSelection: [],
      form: {
        invoiceInfoList: [
          {
            key: Date.now(),
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
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
    handlePrint() {
      toJpeg(document.getElementById("print"), { quality: 0.99, width: 790, backgroundColor: '#ffffff' }).then(
        (dataUrl) => {
          print({
            printable: dataUrl,
            type: "image",
            base64: true,
            style: `@media print { @page {size: auto; margin: 30; } body{margin:0 5px;padding: 20px;}}`,
          });
        }
      );
    },
    invoiceApply() {
      invoiceStartProcess(this.form).then((res) => {
        if (res.data.success) {
          this.form.status = 3;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    init() {
      const businessId = this.$route.query.businessId;
      const salesOrderNo = this.$route.query.salesOrderNo;
      invoiceDetail({ salesOrderNo, businessId }).then((res) => {
        this.form = res.data.data;
        if (this.form.invoiceTypeDisplay != null) {
          this.form.invoiceTypeDisplay = this.form.invoiceTypeDisplay.toString()
        }
      });

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
    //可操作审批和退回的按钮条件，当前人和未操作人是同一个人。非已阅读，已退回状态
    canOperateBtn() {
      return this.form.assignee != null && this.form.assignee.toString() === this.userInfo.user_id.toString() && this.form.status == 3
    },
    handleOperation(key) {
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
    goToSalesOrderDetail() {
      this.$router.push({
        path: "/billManage/poOrder/add",
        query: {
          id: this.form.salesOrderId,
        },
      });
    },
    doOperate(key) {
      const params = {
        taskId: this.form.taskId,
        processInstanceId: this.form.processInstanceId,
        flag: 'ok',
      };
      if (key === 'disAgree') {
        delete params.flag
      }
      completeTask(params).then(res => {
        const data = res.data;
        if (data.success) {
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
  },
};
</script>
<style scoped lang="scss">
.text-center {
  display: flex;
  justify-content: center
}

.el-form {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .el-form-item {
    width: 48%;
    margin-left: 5px;
  }
}
.text-left{
  text-align: left;
}

.invoice-box {
  font-size: 12px;
  width: 795px;
  // margin: 0 auto 50px;
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
