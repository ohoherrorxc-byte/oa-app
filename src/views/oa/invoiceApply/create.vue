<template>
  <basic-container>
    <p class="table-title"><span></span>{{ $t("acceptApply.basicInfo") }}</p>
    <el-form
      v-if="!isPreviewExcel && !isPreviewPdf"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item :label="$t('acceptApply.title')" style="width: 96%">
        <el-input v-model="form.titleName" :disabled="isDetail"></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applicant')">
        <el-select v-model="form.applyPerson" disabled>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDept')">
        <el-select v-model="form.applyDept" clearable disabled>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDate')">
        <el-input v-model="form.applyDate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.invoiceNo')">
        <el-input v-model="form.invoiceNo" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.applyDesc')" style="width: 96%">
        <el-input
          type="textarea"
          v-model="form.applyDesc"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <div class="flex-center">
        <p class="table-title"><span></span>{{ $t("invoice.billingInfo") }}</p>
        <el-button @click="goToSalesOrderDetail">{{
          $t("invoice.viewOrder")
        }}</el-button>
        <el-button @click="goToSalesContractDetail">{{
          $t("invoice.viewContract")
        }}</el-button>
      </div>
      <el-form-item
        :label="$t('invoice.salesType')"
        style="width: 96%"
        prop="salesType"
      >
        <el-select v-model="form.salesType" :disabled="isDetail">
          <el-option
            v-for="item in saleTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('invoice.relatedContract')"
        prop="salesContractNo"
      >
        <el-select
          filterable
          v-model="form.salesContractNo"
          :disabled="isDetail"
          @change="salesContractChange"
        >
          <el-option
            v-for="item in salesContractList"
            :key="item.id"
            :label="item.titleName"
            :value="item.applyNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.contractNo')">
        <el-select
          filterable
          v-model="form.salesContractNo"
          :disabled="isDetail"
          @change="salesContractChange"
        >
          <el-option
            v-for="item in salesContractList"
            :key="item.id"
            :label="item.applyNo"
            :value="item.applyNo"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="form.salesContractNo" clearable :disabled="isDetail"></el-input> -->
      </el-form-item>
      <el-form-item :label="$t('invoice.relatedPOOrder')">
        <el-select
          @change="salesOrderChange"
          v-model="form.salesOrderId"
          clearable
          :disabled="isDetail"
        >
          <el-option
            v-for="item in salesOrderList"
            :key="item.id"
            :label="item.orderName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.orderNo')">
        <el-input
          v-model="form.salesOrderNo"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.invoiceType')" prop="invoiceType">
        <el-select v-model="form.invoiceType" :disabled="isDetail">
          <el-option
            v-for="item in invoiceTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.contractType')">
        <el-select
          v-model="form.salesContractType"
          clearable
          :disabled="isDetail"
        >
          <el-option
            v-for="item in salesContractTypeList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.salesContractType == '2'" :label="'合同金额（原币）'">
              <el-input v-model="form.salesContractTotalAmountOriginal" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="form.salesContractType == '2'" :label="'合同金额（RMB）'">
              <el-input v-model="form.salesContractTotalAmountRmb" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="form.salesContractType == '2'" :label="'合同已开票金额'">
              <el-input v-model="form.salesContractInvoiceAmount" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="form.salesContractType == '2'" :label="'合同未开票金额'">
              <el-input v-model="form.salesContractNotInvoiceAmount" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.projectName')">
        <el-select
          filterable
          @change="projectListChange"
          v-model="form.projectId"
          clearable
          :disabled="isDetail"
        >
          <el-option
            v-for="item in projectList"
            :value="item.id"
            :key="item.id"
            :label="item.projectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.projectNo')">
        <el-input
          v-model="form.projectNo"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.currency')" prop="currency">
        <el-select v-model="form.currency" clearable :disabled="isDetail">
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.taxRate')">
        <el-input
          v-model="form.taxRate"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('invoice.invoicingAmount')"
        prop="invoicingAmount"
      >
        <el-input
          :disabled="isDetail"
          v-model="form.invoicingAmount"
          clearable
        ></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("invoice.customerInfo") }}
      </p>
      <el-form-item :label="$t('invoice.customerName')">
        <el-select
          v-model="form.custId"
          clearable
          @change="contractCustChange"
          :disabled="isDetail"
        >
          <el-option
            v-for="item in custList"
            :value="item.id"
            :key="item.id"
            :label="item.custName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.contact')">
        <el-select
          v-model="form.contactId"
          clearable
          :disabled="isDetail"
          @change="getCustChange"
        >
          <el-option
            v-for="item in custContactList"
            :value="item.id"
            :key="item.id"
            :label="item.contactName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.customerNo')">
        <el-input
          v-model="form.custNo"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.taxId')">
        <el-input
          v-model="form.taxpayerIdentityNumber"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.addressPhone')">
        <el-input
          v-model="form.custAddr"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.bankName')">
        <el-input
          v-model="form.openBank"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.bankAccount')">
        <el-input
          v-model="form.bankAccount"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("invoice.invoiceInfo") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr" v-if="!isDetail">
          <span class="add-icon" @click="addInvoiceInfoRow">+</span>
          <span class="dec-icon" @click="deleteInvoiceInfoRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.invoiceInfoList"
          class="mb20 table-now"
          @selection-change="invoiceInfoSelectionChange"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column :label="$t('invoice.productName')">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.itemDesc"
                :disabled="isDetail"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('invoice.partNo')">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.partsNo"
                :disabled="isDetail"
                @blur="changeInvoice(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('invoice.unit')">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.unitName"
                :disabled="isDetail"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('invoice.salePrice')">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.unitPrice"
                :disabled="isDetail"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('invoice.quantity')">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.quantity"
                :disabled="isDetail"
                @blur="changeQuantity(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('invoice.totalPrice')">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.amount"
                @change="getAmount"
                :disabled="isDetail"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p v-if="isDomesticHardware" class="table-title" style="width: 96%">
        <span></span>出库信息
      </p>
      <el-form-item
        v-if="isDomesticHardware"
        label-width="0"
        style="width: 100%"
      >
        <div class="fr" v-if="!isDetail || isLogistic">
          <span class="add-icon" @click="addRowStockOut">+</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.stockOutList"
          @selection-change="handleSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column property="partsNo" label="零件号" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'stockOutList.' + scope.$index + '.partsNo'"
                :rules="rules.partsNo"
              >
                <el-select
                  :disabled="isDetail && !isLogistic"
                  filterable
                  clearable
                  v-model="scope.row.partsNo"
                  @change="getStockOut(scope.row)"
                >
                  <el-option
                    v-for="item in partsList"
                    :value="item.partsNo"
                    :key="item.partsNo"
                    :label="item.partsNo"
                  ></el-option>
                </el-select>
                <!-- <el-input clearable v-model="scope.row.partsNo"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="partsName" label="零件名称" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'stockOutList.' + scope.$index + '.partsName'"
                :rules="rules.partsName"
              >
                <el-input
                  :disabled="isDetail && !isLogistic"
                  clearable
                  v-model="scope.row.partsName"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            property="stockOutNo"
            label="出库单号"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'stockOutList.' + scope.$index + '.stockOutNo'"
                :rules="rules.stockOutNo"
              >
                <el-select
                  :disabled="isDetail && !isLogistic"
                  clearable
                  v-model="scope.row.stockOutNo"
                  filterable
                  @change="changeStockOutNo(scope.row)"
                >
                <!--  -->
                  <el-option
                    v-for="item in scope.row.stockList"
                    :label="item.stockOutNo+'（剩余数量：'+item.stockOutNumber+')'"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            property="invoiceUseNumber"
            label="数量"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'stockOutList.' + scope.$index + '.invoiceUseNumber'"
                :rules="rules.invoiceUseNumber"
              >
                <el-input
                  :disabled="isDetail && !isLogistic"
                  clearable
                  v-model="scope.row.invoiceUseNumber"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            v-if="!isDetail || isLogistic"
          >
            <template slot-scope="scope">
              <el-form-item style="width: 100%">
                <el-button
                  type="text"
                  @click="deleteRowStock(scope.row)"
                  style="color: red"
                  >删除</el-button
                >
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("other.otherInfo") }}
      </p>
      <el-form-item
        :label="$t('commonContent.relatedAttachments')"
        style="width: 96%"
        :required="form.salesType === 'license' || form.invoiceType === '1'"
      >
        <upload
          :disabled="isDetail"
          :fileList="form.fileList"
          :btnName="$t('commonContent.upload')"
          @handleRequest="handleRequest"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form-item label="PAN:">
        <el-input
          type="input"
          v-model="form.pan"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item label="GSTIN:">
        <el-input
          type="input"
          v-model="form.gstin"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item label="Remarks(Left)">
        <el-input
          type="textarea"
          v-model="form.remarkLeft"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input
          type="textarea"
          v-model="form.remark"
          clearable
          :disabled="isDetail"
        ></el-input>
      </el-form-item>
      <div style="width: 95%; text-align: center">
        <el-button
          type="primary"
          @click="goToInvoiceView"
          v-if="form.flow && form.flow.status === 'finished'"
          >预览发票</el-button
        >
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import upload from "@/components/upload/index";
import { toJpeg } from "html-to-image";
import print from "print-js";
import InvoiceSet from "@/views/billManage/poOrder/invoiceSet";
import {
  invoiceDetail,
  getSalesOrderList,
  getCustContactList,
  getTaskHis,
  saveInvoice,
  testStockOutNum,
} from "@/api/billManage/poOrder";
import { getDictionary } from "@/api/system/dict";
import { getSalesContractList } from "@/api/contract/salesContractNew";
import { getContractInvoiceAmount } from "@/api/contract/salesContractNew";
import { getProjectList } from "@/api/contract/contractProject";
import { getCustList } from "@/api/contract/contractCustomer";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList } from "@/api/organizationalStructure/department";
import { mapGetters } from "vuex";
import { getFormatDate } from "@/util/util";
import { getDept } from "@/api/organizationalStructure/department";
import substituteOrderManageApi from "@/api/substitute/orderManage";
export default {
  components: {
    InvoiceSet,
    upload,
  },
  data() {
    return {
      comment: null,
      flowList: [],
      reverse: true,
      invoiceSet: false,
      partsList: [],
      activeName: "first",
      saleTypeList: [],
      salesContractList: [],
      salesOrderList: [],
      invoiceTypeList: [],
      salesContractTypeList: [],
      projectList: [],
      currencyList: [],
      custList: [],
      custContactList: [],
      userList: [],
      deptList: [],
      isDetail: false,
      invoiceInfoMultipleSelection: [],
      timeout: null,
      form: {
        titleName: null,
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        invoiceNo: null,
        applyDesc: null,
        salesType: null,
        salesContractId: null,
        salesContractNo: null,
        salesOrderId: null,
        salesOrderNo: null,
        projectName: null,
        salesOrderName: null,
        invoiceType: null,
        salesContractType: null,
        salesContractName: null,
        salesContractTotalAmountOriginal: null,
        salesContractTotalAmountRmb: null,
        salesContractInvoiceAmount: null,
        salesContractNotInvoiceAmount: null,
        projectId: null,
        projectNo: null,
        currency: null,
        taxRate: null,
        invoicingAmount: null,
        custId: null,
        contactId: null,
        custNo: null,
        taxpayerIdentityNumber: null,
        custAddr: null,
        openBank: null,
        bankAccount: null,
        fileList: [],
        pan: null,
        gstin: null,
        remarkLeft: null,
        remark: null,
        invoiceInfoList: [
          {
            itemDesc: null,
            partsNo: null,
            unitName: null,
            unitPrice: null,
            quantity: null,
            amount: null,
            key: Date.now(),
          },
        ],
        stockOutList: [
          // {
          //   partsNo: null,
          //   partsName: null,
          //   stockOutNo: null,
          //   stockOutDetailId:null,
          //   invoiceUseNumber: null,
          //   stockList:[]
          // },
        ],
      },
      rules: {
        invoiceType: [
          { required: true, message: "请输入票据类型", trigger: "change" },
        ],
        invoicingAmount: [
          { required: true, message: "请输入本次开票金额", trigger: "change" },
        ],
        salesContractNo: [
          { required: true, message: "请选择相关合同", trigger: "change" },
        ],
        currency: [
          { required: true, message: "请选择币种", trigger: "change" },
        ],
        salesType: [
          { required: true, message: "请选择销售类型", trigger: "change" },
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
    isDomesticHardware() {
      return (
        this.form.salesType === "hardware" && this.form.invoiceType !== "3"
      );
    },
    disabled() {
      return this.$route.query.businessId && !this.$route.query.isEdit;
    },
    isLogistic() {
      return (
        this.form.id &&
        this.form.flow &&
        this.form.flow.taskName === "物流工程师"
      );
    },
  },
  created() {
    this.init();
    this.getPartList();
  },
  methods: {
    //流程
    handleClick() {
      if (this.form.id) {
        this.processInstanceId = this.form.processInstanceId;
        this.src = `/api/oa-flow/process/diagram-view?processInstanceId=${
          this.processInstanceId
        }&t=${new Date().getTime()}`;
      }
    },
    async getPartList() {
      let res = await substituteOrderManageApi.partsMaintList();
      this.partsList = res.data.data;
    },
    handlePrint() {
      toJpeg(document.getElementById("print"), {
        quality: 0.95,
        width: 980,
        backgroundColor: "#ffffff",
      }).then((dataUrl) => {
        print({
          printable: dataUrl,
          type: "image",
          base64: true,
          style: `@media print { @page {size: auto; margin: 0; } body{margin:0 5px}}`,
        });
      });
    },
    changeQuantity(row){
      let match = false
      if(row.partsNo){
        for(let i=0;i<this.form.stockOutList.length;i++){
          if(row.partsNo===this.form.stockOutList[i].partsNo&&!match){
            if(Number(row.quantity)<Number(this.form.stockOutList[i].invoiceUseNumber)){
                this.form.stockOutList[i].invoiceUseNumber = row.quantity
            }
          }
          match = true
        }
      }
    },
    changeStockOutNo(row) {
      let one = row.stockList.find((ele) => {
        return ele.id === row.stockOutNo;
      });
      row.stockOutDetailId = one.id;
      row.stockOutId = one.stockOutId
      row.stockOutNo = one.stockOutNo
      row.invoiceUseNumber = one.stockOutNumber
    },
    changeInvoice(row) {
      if (!row.partsNo) return;
      let partsNos = this.form.stockOutList.map((ele) => ele.partsNo);
      if (!partsNos.includes(row.partsNo)) {
        let key = new Date();
        let rowOut = {
          partsNo: row.partsNo,
          key: key,
          stockOutNo:null,
          partsName:null,
          stockOutDetailId:null,
          stockOutId:null,
          invoiceUseNumber:null
        };
        this.form.stockOutList.push(rowOut);
        this.getStockOut(rowOut);
      }
    },
    async getStockOut(row) {
      let res = await substituteOrderManageApi.selectSaleInnerListByPartsNo({
        partsNo: row.partsNo,
        invoiceId:this.form.id
      });
      if (res.data.code === 200 || res.data.code === 0) {
        row.stockList = res.data.data;
        if (row.stockList.length > 0) {
          row.stockOutNo = row.stockList[0].stockOutNo;
          row.partsName = row.stockList[0].partsName;
          row.stockOutDetailId = row.stockList[0].id;
          row.stockOutId = row.stockList[0].stockOutId
          row.invoiceUseNumber = row.stockList[0].stockOutNumber;
        }
      }
      if (row.key) {
        for (let i = 0; i < this.form.stockOutList.length; i++) {
          if (this.form.stockOutList[i].key === row.key) {
            this.$set(this.form.stockOutList, i, row);
          }
        }
      }
    },
    addRowStockOut() {
      this.form.stockOutList.push({
        partsNo: null,
        partsName: null,
        stockOutNo: null,
        invoiceUseNumber: null,
        stockOutId:null,
        stockOutDetailId:null,
        key: new Date(),
      });
    },
    deleteRowStock(row) {
      this.form.stockOutList = this.form.stockOutList.filter((ele) => {
        return ele != row;
      });
    },
    init() {
      this.getDepartment();
      this.form.applyDate = getFormatDate();
      this.form.applyPerson = this.userInfo.user_id;
      this.form.applyPersonName =
        this.userInfo.nick_name ||
        this.userInfo.realName ||
        this.userInfo.user_name;
      this.form.applyDept = this.userInfo.dept_id;
      const businessId = this.$route.query.businessId;
      this.form.titleName = `发票申请 - ${
        this.userInfo.nick_name ||
        this.userInfo.realName ||
        this.userInfo.user_name
      } - ${getFormatDate()}`;
      if (businessId) {
        this.invoiceDetail();
      }
      this.getDictionary({ code: "CURRENCY" }, "currency");
      this.getDictionary({ code: "SALE_TYPE" }, "saleType");
      this.getDictionary({ code: "INVOICE_TYPE" }, "invoiceType");
      this.getDictionary({ code: "CONTRACT_TYPE" }, "saleContractType");
      this.getSalesContractList({});
      this.getSalesOrderList({});
      this.getProjectList();
      this.getCustList();
      this.getUserList();
      this.getDeptList();
      this.getContractInvoiceAmount();
    },
    invoiceDetail() {
      const businessId = this.$route.query.businessId;
      const salesOrderNo = this.$route.query.salesOrderNo;
      invoiceDetail({ salesOrderNo, businessId }).then((res) => {
        this.form = res.data.data;
        if (this.$route.query.isEdit) {
          this.isDetail = false;
        } else {
          this.isDetail = true;
        }
        this.form.salesContractType = this.form.salesContractType + "";
        if (this.form.invoiceType != null) {
          this.form.invoiceType = this.form.invoiceType.toString();
        }
        if (this.form.processInstanceId != null) {
          getTaskHis({ processInstanceId: this.form.processInstanceId }).then(
            (res) => {
              this.flowList = res.data.data;
            }
          );
        }
        if (
          this.form.invoicingAmount === null ||
          this.form.invoicingAmount === ""
        ) {
          this.getAmount();
        }
        this.$emit("getFormData", this.form);
      });
    },
    salesContractChange() {
      let row = this.salesContractList.find((ele) => {
        return ele.applyNo === this.form.salesContractNo;
      });
      this.form.salesContractType = row.salesContractType + "";
      this.form.salesContractName = row.titleName;
      this.form.salesContractId = row.id;
       if (row.salesContractType == 2) {
              this.form.salesContractTotalAmountOriginal = row.salesContractTotalAmountOriginal;
              this.form.salesContractTotalAmountRmb = row.salesContractTotalAmountRmb;
              this.getContractInvoiceAmount(this.form.salesContractId);
       } else {
              this.form.salesContractTotalAmountOriginal = null;
              this.form.salesContractTotalAmountRmb = null;
              this.form.salesContractInvoiceAmount = null;
              this.form.salesContractNotInvoiceAmount = null;
       }
    },
    getContractInvoiceAmount(contractId){
     if(!contractId)return;
     getContractInvoiceAmount(contractId).then((res) => {
     this.form.salesContractInvoiceAmount = res.data.data;
     this.form.salesContractNotInvoiceAmount = this.form.salesContractTotalAmountRmb -  this.form.salesContractInvoiceAmount;
    })
    },
    salesOrderChange() {
      let row = this.salesOrderList.find((ele) => {
        return ele.id === this.form.salesOrderId;
      });
      this.form.salesOrderNo = row.orderNo;
      this.form.salesOrderName = row.orderName;
    },
    projectListChange() {
      let row = this.projectList.find((ele) => {
        return ele.id === this.form.projectId;
      });
      this.form.projectNo = row.projectNo;
      this.form.projectName = row.projectName;
    },
    async getDepartment() {
      if (this.detailId) return;
      let res = await getDept(this.userInfo.dept_id || this.userInfo.deptId);
      this.form.createDeptName = res.data.data.deptName;
    },
    goToSalesContractDetail() {
      if (!this.form.salesContractId) return;
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
        } else if (type === "saleContractType") {
          this.salesContractTypeList = res.data.data;
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
    getCustChange() {
      let row = this.custContactList.find((ele) => {
        return ele.id === this.form.contactId;
      });
      this.form.contactName = row.contactName;
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
        });
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
        delete file.status;
      });
    },
    addInvoiceInfoRow() {
      this.form.invoiceInfoList.push({
        key: Date.now(),
      });
    },
    deleteInvoiceInfoRow() {
      if (this.invoiceInfoMultipleSelection.length === 0) {
        this.$message.error("请先选择票据信息");
        return;
      }
      let keys = this.invoiceInfoMultipleSelection.map((ele) => ele.key);
      let ids = this.invoiceInfoMultipleSelection.map((ele) => ele.id);
      this.form.invoiceInfoList = this.form.invoiceInfoList.filter((ele) => {
        return !keys.includes(ele.key) || !ids.includes(ele.id);
      });
      this.getAmount();
    },
    getAmount() {
      let values = this.form.invoiceInfoList.map((ele) => Number(ele.amount));
      this.form.invoicingAmount = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);
    },
    invoiceInfoSelectionChange(val) {
      this.invoiceInfoMultipleSelection = val;
    },
    contractCustChange(val) {
      this.custList.forEach((item) => {
        if (val == item.id) {
          this.form.custNo = item.custNo;
          this.form.taxpayerIdentityNumber = item.taxpayerIdentityNumber;
          this.form.custAddr = item.custAddr;
          this.form.openBank = item.openBank;
          this.form.bankAccount = item.bankAccount;
          this.form.custName = item.custName;
          this.form.contactName = item.contactName;
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
    },
    compareParts() {
      const sumA = {};
      const sumB = {};
      this.form.invoiceInfoList.forEach((item) => {
        sumA[item.partsNo] =
          Number(sumA[item.partsNo] || 0) + Number(item.quantity);
      });
      this.form.stockOutList.forEach((item) => {
        sumB[item.partsNo] =
          Number(sumB[item.partsNo] || 0) + Number(item.invoiceUseNumber);
      });
      const allParts = new Set([...Object.keys(sumA), ...Object.keys(sumB)]);
      const result = { match: true, differences: [] };
      for (const partsNo of allParts) {
        const countA = sumA[partsNo] || 0;
        const countB = sumB[partsNo] || 0;
        if (Number(countA) !== Number(countB)) {
          result.match = false;
          result.differences.push({
            partsNo,
            countA,
            countB,
            difference: countA - countB,
          });
        }
      }
      return result;
    },
    async testStockNum() {
      let res = await testStockOutNum(this.form);
      if (res.data.code === 200 || res.data.code === 0) {
        return true;
      } else {
        return false;
      }
    },
    async testForm() {
      if(this.form.salesType!="hardware"||this.form.invoiceType==="3"){
        this.form.stockOutList = []
      }
      if (
        this.form.id &&
        this.form.flow &&
        this.form.flow.taskName === "物流工程师"
      ) {
        if (!this.compareParts().match) {
          if (this.compareParts().differences.length > 0) {
            this.$message.error(
              `零件号${
                this.compareParts().differences[0].partsNo
              }票据和出库数量不匹配`
            );
          }
          return false;
        }
        // let arr = this.form.stockOutList.map((ele) => ele.stockOutDetailId);
        // let unique = new Set(arr);
        // if (arr.length !== unique.length) {
        //   this.$message.error("同一零件请勿提交重复的出库单");
        //   return false;
        // }
        if ((await this.testStockNum()) === false) return;
      }
      if (
        (!this.form.fileList || this.form.fileList.length === 0) &&
        this.form.salesType === "license"
      ) {
        this.$message.error("请上传客户签字或盖章的销售订单");
        return;
      } else if (
        (!this.form.fileList || this.form.fileList.length === 0) &&
        this.form.invoiceType === "1"
      ) {
        this.$message.error("请上传开票委托单和开票通知");
        return;
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, msg) => {
          resolve(valid);
          if (valid) {
          } else {
            this.$message.error(Object.values(msg)[0][0].message);
          }
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.el-form {
  display: flex;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    .el-form-item {
      width: 48%;
      margin-left: 5px;
    }
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
