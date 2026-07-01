<template>
  <basic-container>
    <p class="table-title"><span></span>{{ $t("acceptApply.basicInfo") }}</p>
    <el-form
      :disabled="disabled"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="140px"
    >
      <el-form-item
        :label="$t('acceptApply.title')"
        prop="titleName"
        style="width: 96%"
      >
        <el-input
          v-model="form.titleName"
          v-if="!disabled"
          clearable
        ></el-input>
        <div v-else>{{ form.titleName }}</div>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applicant')" prop="applyPerson">
        <el-select v-model="form.applyPerson" disabled>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDept')" prop="applyDept">
        <el-select v-model="form.applyDept" disabled>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDate')" prop="applyDate">
        <el-input v-model="form.applyDate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyNo')" prop="applyNo">
        <el-input v-model="form.applyNo" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.apply.amount')" prop="">
        {{ getOriginalAmountToTal("bomPurchaseContractPayDetailList") }}
      </el-form-item>
      <el-form-item :label="$t('bom.apply.amountUpperOriginal')" prop="">
        {{ form.totalAmountOriginalUpper }}
      </el-form-item>
      <el-form-item :label="$t('bom.apply.amountRmb')" prop="">
        {{ form.totalAmountRmb }}
      </el-form-item>
      <el-form-item :label="$t('bom.apply.amountUpperRmb')" prop="">
        {{ form.totalAmountRmbUpper }}
      </el-form-item>
      <el-form-item
        :label="$t('bom.apply.reason')"
        style="width: 100%"
        prop="applyDesc"
      >
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("bom.contract.info") }}
      </p>
      <el-form-item
        :label="$t('bom.contract.relatedAcceptance')"
        style="width: 96%"
        prop="acceptApplyId"
      >
        <div class="flex">
          <el-select
            v-if="!disabled"
            v-model="form.acceptApplyId"
            clearable
            filterable
            @change="getAcceptRow"
          >
            <el-option
              v-for="item in acceptApplyList"
              :key="item.id"
              :label="item.titleName"
              :value="item.id"
            ></el-option>
          </el-select>
          <div v-else>{{ form.acceptApplyName }}</div>
          <p @click="toPathAcceptApply" class="detailLink">
            {{ $t("commonContent.viewDetails") }}
          </p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('bom.project.name')" prop="projectNo">
        <el-select v-model="form.projectNo" clearable filterable>
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.projectNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('bom.project.no')" prop="projectNo">
        <el-input disabled v-model="form.projectNo" clearable></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('bom.contract.related')"
        prop="bomPurchaseContractNo"
      >
        <div class="flex">
          <el-select
            v-model="form.bomPurchaseContractNo"
            clearable
            filterable
            @change="getPurchaseRow"
          >
            <el-option
              v-for="item in purchaseContractList"
              :key="item.id"
              :label="item.titleName"
              :value="item.applyNo"
            ></el-option>
          </el-select>
          <p @click="toPath" class="detailLink">
            {{ $t("commonContent.viewDetails") }}
          </p>
        </div>
      </el-form-item>
      <el-form-item label="和合同条款是否一致" prop="contractSame">
        <el-select v-model="form.contractSame" clearable>
          <el-option value="是" label="是"></el-option>
          <el-option value="否" label="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同条款是否有特殊约定" prop="contractSpecial">
        <el-select v-model="form.contractSpecial" clearable>
          <el-option value="是" label="是"></el-option>
          <el-option value="否" label="否"></el-option>
        </el-select>
        <p class="red">有特殊约定指付款日期非常规次月25日</p>
      </el-form-item>
      <el-form-item label="供应商开票时间" prop="supplierInvoiceTime">
              <el-date-picker
                v-model="form.supplierInvoiceTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('bom.contract.contractNo')"
        prop="bomPurchaseContractNo"
      >
        <el-input
          disabled
          v-model="form.bomPurchaseContractNo"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.contract.currency')" prop="currency">
        <el-select disabled v-model="form.currency" clearable>
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('bom.contract.exchangeRate')"
        prop="exchangeRate"
      >
        <el-input disabled v-model="form.exchangeRate" clearable></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('bom.contract.paidAmountOriginal')"
        prop="contractPaidAmountOriginal"
      >
        <el-input
          disabled
          v-model="form.contractPaidAmountOriginal"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('bom.contract.paidAmountRmb')"
        prop="contractPaidAmountRmb"
      >
        <el-input
          disabled
          v-model="form.contractPaidAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.contract.currentPaymentOriginal')" prop="">
        {{ getOriginalAmountToTal("bomPurchaseContractPayDetailList") }}
      </el-form-item>
      <el-form-item :label="$t('bom.contract.currentPaymentRmb')" prop="">
        {{ form.totalAmountRmb }}
      </el-form-item>
      <!-- <el-form-item :label="$t('contract.openInvoiceDate')" prop="invoiceDate">
        <el-date-picker
          v-model="form.invoiceDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item> -->
      <p class="table-title" style="width: 100%"><span></span>{{ $t("bom.pay.paymentDetail") }}</p>
      <el-form-item label-width="0" style="width: 100%">
        <el-table
          ref="multipleTable"
          :data="form.bomPurchaseContractPayDetailList"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          @selection-change="saleContractDetailSelectChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column
            :label="$t('bom.pay.productName')"
            :width="isPdfDown ? 160 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.partsName"
              ></el-input>
              <div v-else>{{ scope.row.partsName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.pay.technicalDetails')"
            :width="isPdfDown ? 160 : ''"
          >
            <template slot-scope="scope">
              <el-input v-if="!disabled" v-model="scope.row.remark"></el-input>
              <div v-else>{{ scope.row.remark }}</div>
            </template>
          </el-table-column>
         <el-table-column label='零件号'  :width="isPdfDown ? 160 : ''">
           <template slot-scope="scope">
              <el-input v-if="!disabled" v-model="scope.row.partsNo" style="width:100%"></el-input>
              <div v-else>{{ scope.row.partsNo }}</div>
          </template>
         </el-table-column>
          <el-table-column
            :label="$t('bom.pay.unit')"
            :width="isPdfDown ? 120 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.unitName"
              ></el-input>
              <div v-else>{{ scope.row.unitName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.pay.quantity')"
            :width="isPdfDown ? 120 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.quantity"
              ></el-input>
              <div v-else>{{ scope.row.quantity }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.pay.acceptanceAmountOriginal')"
            :width="isPdfDown ? 140 : ''"
          >
            <template slot-scope="scope">
              <el-input
                @change="getRMBAmountToTal()"
                v-if="!disabled"
                v-model="scope.row.totalPriceOriginal"
              ></el-input>
              <div v-else>{{ scope.row.totalPriceOriginal }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('acceptApply.acceptanceAmountRMB')"
            :width="isPdfDown ? 160 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.totalPriceRmb"
                @change="getOriginalAmountToTal"
              ></el-input>
              <div v-else>{{ scope.row.totalPriceRmb }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("bom.pay.paymentInfo") }}
      </p>
      <el-form-item
        :label="$t('bom.pay.supplierName')"
        style="width: 96%"
        prop="supplierId"
      >
        <div class="flex">
          <el-select
            v-if="!disabled"
            @change="getSupplyRow"
            v-model="form.supplierNo"
            clearable
            filterable
          >
            <el-option
              v-for="item in contractSupplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.supplierNo"
            ></el-option>
          </el-select>
          <el-input v-else v-model="form.supplierName"></el-input>
          <div class="detailLink" @click="viewSupply">
            {{ $t("bom.pay.viewDetails") }}
          </div>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('bom.pay.bankName')"
        style="width: 96%"
        prop="openBank"
      >
        <el-input v-model="form.openBank" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.pay.bankAccount')" prop="bankAccount">
        <el-input v-model="form.bankAccount" clearable></el-input>
      </el-form-item>
      <el-form-item label="供应商发票号" prop="" style="width:98%">
        <el-input v-model="form.supplierInvoiceNo" clearable></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('bom.pay.completionOrder')"
        style="width: 100%"
        prop="completionOrderList"
        label-width="140px"
      >
        <upload
          :isHistory="isHistory"
          :fileList="form.completionOrderList"
          btnName="上传"
          @handleRequest="handleRequestCompletion"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form-item
        :label="$t('bom.pay.invoice')"
        style="width: 100%"
        prop="invoiceList"
        label-width="140px"
      >
        <upload
          :isHistory="isHistory"
          :fileList="form.invoiceList"
          btnName="上传"
          @handleRequest="handleRequestInvoice"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form-item
        :label="$t('bom.pay.orderPdf')"
        style="width: 100%"
        prop="bomOrderFileList"
        label-width="140px"
      >
        <upload
          :isHistory="isHistory"
          :fileList="form.bomOrderFileList"
          btnName="上传"
          @handleRequest="handleRequestBomOrderFile"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form>
        <el-form-item>
          <div class="flex">
            <el-button type="primary" v-if="disabled" @click="downBranch"
              >批量打印文件</el-button
            >
            <el-button type="primary" v-if="disabled" @click="viewFile"
              >打印所有文件</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-form>
    <viewAllFile ref="viewAllFile"></viewAllFile>
    <supplyDialog ref="supplyDialog"></supplyDialog>
  </basic-container>
</template>

<script>
import {
  getFormatDate,
  numberToTraditionalChinese,
  mergePDFs,
} from "@/util/util";
import AcceptApplyApi from "@/api/acceptApply/index";
import { getDictionary } from "@/api/system/dict";
import { userList } from "@/api/contract/bomMaint";
import upload from "@/components/upload/index";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getProjectList } from "@/api/contract/contractProject";
import { mapGetters } from "vuex";
import { mixins } from "./purchaseMixins";
import { mixinsAmount } from "@/mixins/amount";
import supplyDialog from "@/components/supplyDialog/index";
import BomPurchaseContractApplyApi from "@/api/bomPurchaseContractApply/index";
import BomPurchaseContractPayApplyApi from "@/api/bomPurchaseContractPayApply/index";
import PurchaseContractPayApplyApi from "@/api/purchaseContractPayApply/index";
import { getContractSupplierList } from "@/api/contract/contractSupplier";
import viewAllFile from "./viewAllFile";
import printJS from "print-js";

export default {
  mixins: [mixins, mixinsAmount],
  components: { supplyDialog, upload, viewAllFile },
  data() {
    return {
      currencyList: [],
      purchaseTypeList: [],
      salesContractTypeList: [],
      salesContractCategoryList: [],
      countryRegionList: [],
      deptList: [],
      userList: [],
      projectList: [],
      purchaseContractList: [],
      bomPurchaseContractList: [],
      acceptApplyList: [],
      contractSupplierList: [],
      evalResultList: [
        {
          value: 1,
          label: "合格",
        },
        {
          value: 0,
          label: "不合格",
        },
      ],
      purchaseType: [],
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
      deepTitle: null,
      saleContractDetailMultipleSelection: [],
      isEmergencyPurchaseList: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      form: {
        titleName: null,
        contractPaidAmountOriginal: null,
        contractPaidAmountRmb: null,
        acceptApplyNo: null,
        applyPerson: null,
        applyDate: null,
        applyNo: null,
        totalAmountRmb: null,
        totalAmountRmbUpper: null,
        totalAmountOriginalUpper: null,
        totalAmountOriginal: null,
        applyDesc: null,
        projectNo: null,
        bomPurchaseContractNo: null,
        currency: null,
        contractSame: "是",
        contractSpecial: "否",
        supplierInvoiceTime: null,
        supplierInvoiceNo:null,
        exchangeRate: null,
        acceptType: null,
        contractPaidAmountOriginal: null,
        contractPaidAmountRmb: null,
        acceptApplyId: null,
        bomPurchaseContractPayDetailList: [],
        bankAccount: null,
        openBank: null,
        completionOrderList: [],
        invoiceList: [],
        bomOrderFileList: [],
      },
      rules: {
        titleName: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseentertitle"),
            trigger: "blur",
          },
        ],
        invoiceList: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseuploadinvoice"),
            trigger: "change",
          },
        ],
        completionOrderList: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseuploadcompletionorder"),
            trigger: "change",
          },
        ],
        applyDesc: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseenterapplyreason"),
            trigger: "change",
          },
        ],
        projectNo: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseenterprojectname"),
            trigger: "change",
          },
        ],
        bomPurchaseContractNo: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseselectrelatedcontract"),
            trigger: "change",
          },
        ],
        isBalancePay: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseselectisbalancepay"),
            trigger: "change",
          },
        ],
        totalAmountOriginal: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseenterpaymentamountoriginal"),
            trigger: "change",
          },
        ],
        acceptApplyId: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseselectrelatedacceptance"),
            trigger: "change",
          },
        ],
        supplierId: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseselectsuppliername"),
            trigger: "change",
          },
        ],
        openBank: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseenterbankname"),
            trigger: "change",
          },
        ],
        bankAccount: [
          {
            required: true,
            message: this.$t("bom.pay.pleaseenterbankaccount"),
            trigger: "change",
          },
        ],
        contractSame: [
          {
            required: true,
            message: "请选择和合同条款是否一致",
            trigger: "change",
          },
        ],
        contractSpecial: [
          {
            required: true,
            message: "请选择合同条款是否有特殊约定",
            trigger: "change",
          },
        ],
        supplierInvoiceTime: [
          {
             required: true,
             message: "供应商开票时间",
             trigger: "change",
          },
        ],
      },
    };
  },
  watch: {},
  props: {
    isPdfDown: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.getContractSupplierList();
    this.businessId = this.$route.query.businessId;
    this.form.titleName =
      "BOM及框架采购合同付款" +
      " - " +
      (this.userInfo.nick_name ||
        this.userInfo.realName ||
        this.userInfo.user_name) +
      " - " +
      getFormatDate();
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.form.applyDept = this.userInfo.dept_id;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "PURCHASE_TYPE" }, "purchaseType");
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
    this.getPurchaseContractList();
    this.getContractProjectList();
    this.getBomPurchaseContractList();
    this.getAcceptApplyList();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await BomPurchaseContractPayApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        if (this.form.acceptApplyId) {
          this.form.acceptApplyId = Number(this.form.acceptApplyId);
        }
        if (this.form.acceptType === 2) {
          this.rules.completionOrderList[0].required = false;
        }
        if (this.form.acceptApplyId) {
          this.form.acceptApplyId = Number(this.form.acceptApplyId);
        }
        this.form.applyPerson = (this.form.applyPerson || "").toString();
        if (this.form.supplierId) {
          this.form.supplierId = Number(this.form.supplierId);
        }
        this.form.bomPurchaseContractPayDetailList.map((ele, index) => {
          ele.budgetInfo = `可用预算:  ${
            ele.avaliableFee || 0.0
          }<br/><span style='color:blue'>已发生费用:  ${
            ele.costedFee || 0.0
          }</span><br/><span style='color:green'>审批中费用: ${
            ele.underApprovalFee || 0.0
          }</span>`;
          this.getFeeDetail(ele, index);
        });
        this.getRMBAmountToTal();
        this.getSupplyRow(this.form.supplierNo);
        this.$emit("getFormData", this.form);
      }
    },
    viewFile() {
      this.$refs.viewAllFile.dialogTableVisible = true;
      this.$refs.viewAllFile.getFileList(this.form, "bomPay");
    },
    handleRequestCompletion(data, arr) {
      arr.map((ele) => {
        ele.businessName = "acceptFinished";
      });
      this.$refs.form.clearValidate();
      this.form.completionOrderList = arr;
    },
    async getContractSupplierList() {
      let res = await getContractSupplierList({});
      this.contractSupplierList = res.data.data;
    },
    async getSupplyRow(v) {
      if (this.contractSupplierList.length === 0) {
        await this.getContractSupplierList();
      }
      let row = this.contractSupplierList.find((ele) => {
        return ele.supplierNo === v;
      });
      if (!row) return;
      this.form.supplierId = row.id;
      this.form.supplierName = row.supplierName;
      if (row.supplierSettlementList && row.supplierSettlementList.length > 0) {
        this.form.openBank = row.supplierSettlementList[0].openBank;
        this.form.bankAccount = row.supplierSettlementList[0].bankAccount;
      }
    },
    handleRequestInvoice(data, arr) {
      arr.map((ele) => {
        ele.businessName = "invoiveBomPay";
      });
      this.form.invoiceList = arr;
      this.$refs.form.clearValidate();
    },
    viewSupply() {
      this.$refs.supplyDialog.supplierDialogFormVisible = true;
      this.$refs.supplyDialog.getDetailSupply(this.form.supplierNo);
    },
    toPath() {
      if (this.form.bomPurchaseContractNo) {
        let url = `/bomPurchaseContractApplication?applyNo=${this.form.bomPurchaseContractNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    toPathAcceptApply() {
      if (this.form.acceptApplyId) {
        let url = `/acceptApply?businessId=${this.form.acceptApplyId}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    //完工单，订单回显
    async getFileList(row) {
      this.form.fileList = this.form.fileList || [];
      this.form.fileList = this.form.fileList.filter((ele) => {
        return (
          ele.businessName !== "acceptFinished" &&
          ele.businessName !== "BomOrderFinished"
        );
      });
      let res = await AcceptApplyApi.getFileList(row.id, "acceptFinished");
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.map((ele) => {
          this.form.completionOrderList.push(ele);
        });
      }
      let resOrder = await AcceptApplyApi.getFileList(
        "",
        "BomOrderFinished",
        row.bomPurchaseOrderNo
      );
      if (resOrder.data.data && resOrder.data.data.length > 0) {
        resOrder.data.data.map((ele) => {
          this.form.fileList.push(ele);
        });
      }
      this.$emit("getFormData", this.form);
    },
    async testAccept(row) {
      if (!row.applyNo) {
        this.$message.error("该验收单没有编号，请查看验收单详情核对数据");
      }
      let res = await AcceptApplyApi.isUsed(row.applyNo);
      if (res.data.code !== 0 && res.data.code !== 200) {
        this.form.exchangeRate = null;
        this.form.bomPurchaseContractPayDetailList = [];
        this.form.acceptApplyName = null;
        this.form.acceptApplyNo = null;
        this.form.acceptApplyId = null;
      } else {
        this.form.exchangeRate = row.exchangeRate;
        this.form.acceptApplyName = row.titleName;
        this.form.acceptApplyNo = row.applyNo;
        if (row.acceptApplyDetailList && row.acceptApplyDetailList.length > 0) {
          this.form.bomPurchaseContractPayDetailList =
            row.acceptApplyDetailList;
          this.form.bomPurchaseContractPayDetailList.map((ele) => {
            ele.compareAmount = ele.totalPriceOriginal;
          });
        }
        this.getRMBAmountToTal();
      }
    },
    getPurchaseRow(v) {
      let row = this.purchaseContractList.find((ele) => {
        return ele.applyNo === v;
      });
      this.form.bomPurchaseContractNo = row.applyNo;
      this.form.currency = row.currency;
      this.form.bomPurchaseContractName = row.titleName;
      this.getPayDetail();
    },
    async getPayDetail() {
      if (!this.form.bomPurchaseContractNo) return;
      let res = await BomPurchaseContractApplyApi.details(
        "",
        this.form.bomPurchaseContractNo
      );
      if (res.data.code === 200 || res.data.code === 0) {
        this.form.contractPaidAmountOriginal =
          res.data.data.paidTotalAmountOriginal;
        this.form.contractPaidAmountRmb = res.data.data.paidTotalAmountRmb;
      }
    },
    async getPurchaseContractList() {
      let res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.purchaseContractList = res.data.data;
      }
    },
    async getAcceptApplyList() {
      let res = await AcceptApplyApi.selectList(
        "bomPurchase",
        this.$route.query.businessId
      );
      if (res.data.code === 0 || res.data.code === 200) {
        this.acceptApplyList = res.data.data;
      }
    },
    async getBomPurchaseContractList() {
      let res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.bomPurchaseContractList = res.data.data;
      }
    },
    testForm() {
      for (let ele of this.form.bomPurchaseContractPayDetailList) {
        if (Number(ele.compareAmount) < Number(ele.totalPriceOriginal)) {
          this.$message.error("验收金额(原币)不得大于原始带出验收金额(原币)");
          return;
        }
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, msg) => {
          resolve(valid);
          if (valid) {
          } else {
            msg &&
              this.$message({
                message: Object.values(msg)[0][0].message,
                type: "warning",
              });
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
    getDictionary(params, type) {
      getDictionary(params).then((res) => {
        if (type === "currency") {
          this.currencyList = res.data.data;
        } else if (type === "purchaseType") {
          this.purchaseTypeList = res.data.data;
        }
      });
    },
    getDeptList() {
      getLazyList(this.parentId, this.tenantId).then((res) => {
        this.deptList = res.data.data;
      });
    },
    getUserList() {
      userList(this.tenantId).then((res) => {
        this.userList = res.data.data;
      });
    },
    getContractProjectList() {
      getProjectList().then((res) => {
        this.projectList = res.data.data;
      });
    },
    saleContractDetailSelectChange(val) {
      this.saleContractDetailMultipleSelection = val;
    },
    addSaleContractDetailRow() {
      this.form.bomPurchaseContractPayDetailList.push({
        key: Date.now(),
      });
    },
    deleteSaleContractDetailRow() {
      if (this.saleContractDetailMultipleSelection.length === 0) {
        this.$message.error("请先选择合同明细");
        return;
      }
      let keys = this.saleContractDetailMultipleSelection.map((ele) => ele.key);
      let ids = this.saleContractDetailMultipleSelection.map((ele) => ele.id);
      this.form.bomPurchaseContractPayDetailList =
        this.form.bomPurchaseContractPayDetailList.filter((ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        });
    },
    async downBranch() {
      let arr = this.form.completionOrderList.concat(this.form.invoiceList);
      let allArr = arr.concat(this.form.bomOrderFileList);
      const pdfBlobs = await Promise.all(
        allArr.map(async (file) => {
          const url = file.temUrl || file.url;
          const response = await fetch(url);
          return response.blob();
        })
      );
      // Merge PDFs and print
      const mergedPdf = await mergePDFs(pdfBlobs);
      printJS({
        printable: URL.createObjectURL(mergedPdf),
        type: "pdf",
        showModal: true,
      });
    },
    handleRequestBomOrderFile(data, arr) {
      arr.map((ele) => {
        ele.businessName = "BomOrderFinished";
      });
      this.$refs.form.clearValidate();
      this.form.bomOrderFileList = arr;
    },
    async getContractSupplierList() {
      let res = await getContractSupplierList({});
      this.contractSupplierList = res.data.data;
    },
    getRMBAmountToTal(
      listKey = "bomPurchaseContractPayDetailList",
      amountKey = "totalPriceOriginal",
      formKey = "totalAmountRmb"
    ) {
      if (this.form[formKey]) {
        this.deepTitle = `(合计金额：${Number(this.form[formKey]).toFixed(2)})`;
      }
      if (!this.form[listKey] || this.form[listKey].length === 0) return;
      let arr = this.form[listKey].map((ele) => ele[amountKey]);
      var sum = arr.reduce(function (prev, curr, idx, arr) {
        return Number(prev || 0) + Number(curr || 0);
      });
      let arr2 = this.form[listKey].map((ele) => ele["totalPriceRmb"]);
      var sum2 = arr2.reduce(function (prev, curr, idx, arr) {
        return Number(prev || 0) + Number(curr || 0);
      });
      this.form.totalAmountRmb = Number(sum2).toFixed(2);
      this.form.totalAmountOriginalUpper = numberToTraditionalChinese(sum);
      this.form.totalAmountRmbUpper = numberToTraditionalChinese(
        this.form[formKey] || 0
      );
      let newTitle = `(合计金额：${Number(this.form[formKey]).toFixed(2)})`;
      if (!this.form.titleName.includes("合计金额")) {
        this.form.titleName = `${this.form.titleName}${newTitle}`;
      } else {
        this.form.titleName = this.form.titleName.replace(
          this.deepTitle,
          newTitle
        );
      }
    },
    async getSupplyRow(v) {
      if (this.contractSupplierList.length === 0) {
        await this.getContractSupplierList();
      }
      let row = this.contractSupplierList.find((ele) => {
        return ele.supplierNo === v;
      });
      if (!row) return;
      this.form.supplierId = row.id;
      this.form.supplierName = row.supplierName;
      if (row.supplierSettlementList && row.supplierSettlementList.length > 0) {
        this.form.openBank = row.supplierSettlementList[0].openBank;
        this.form.bankAccount = row.supplierSettlementList[0].bankAccount;
      }
    },
    viewSupply() {
      this.$refs.supplyDialog.supplierDialogFormVisible = true;
      this.$refs.supplyDialog.getDetailSupply(this.form.supplierNo);
    },
    toPath() {
      if (this.form.bomPurchaseContractNo) {
        let url = `/bomPurchaseContractApplication?applyNo=${this.form.bomPurchaseContractNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    toPathAcceptApply() {
      if (this.form.acceptApplyId) {
        let url = `/acceptApply?businessId=${this.form.acceptApplyId}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    getAcceptRow(v) {
      let row = this.acceptApplyList.find((ele) => {
        return ele.id === v;
      });
      if (row) {
        this.form.projectNo = row.projectNo;
        this.form.projectName = row.projectName;
        this.form.acceptType = row.acceptType;
        if (this.form.acceptType === 2) {
          this.rules.completionOrderList[0].required = false;
        }
        this.form.bomPurchaseContractNo = row.bomPurchaseContractNo;
        this.testAccept(row);
        this.getFileList(row);
        this.getInvoice(row);
      }
    },
    async getInvoice(row) {
      let res = await PurchaseContractPayApplyApi.getInvoiceList(
        row.bomPurchaseOrderNo
      );
      // console.log(res);
      if (res.data.code === 200 || res.data.code === 0) {
        let data = res.data.data
        let arr = data.fileList;
        arr.map((ele) => {
          ele.businessName = "invoiveBomPay";
        });
        // Only pre-fill from order if user hasn't uploaded their own invoices
        if (!this.form.invoiceList || this.form.invoiceList.length === 0) {
          this.form.invoiceList = arr;
        }
        this.form.supplierInvoiceNo = data.supplierInvoiceNo
        this.$refs.form.clearValidate();
      }
    },
    //完工单，订单回显
    async getFileList(row) {
      this.form.fileList = this.form.fileList || [];
      this.form.fileList = this.form.fileList.filter((ele) => {
        return (
          ele.businessName !== "acceptFinished" &&
          ele.businessName !== "BomOrderFinished"
        );
      });
      let res = await AcceptApplyApi.getFileList(row.id, "acceptFinished");
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.map((ele) => {
          this.form.completionOrderList.push(ele);
        });
      }
      let resOrder = await AcceptApplyApi.getFileList(
        "",
        "BomOrderFinished",
        row.bomPurchaseOrderNo
      );
      if (resOrder.data.data && resOrder.data.data.length > 0) {
        resOrder.data.data.map((ele) => {
          this.form.bomOrderFileList.push(ele);
        });
      }
      this.$emit("getFormData", this.form);
    },
    async testAccept(row) {
      if (!row.applyNo) {
        this.$message.error("该验收单没有编号，请查看验收单详情核对数据");
      }
      let res = await AcceptApplyApi.isUsed(row.applyNo);
      if (res.data.code !== 0 && res.data.code !== 200) {
        this.form.exchangeRate = null;
        this.form.bomPurchaseContractPayDetailList = [];
        this.form.acceptApplyName = null;
        this.form.acceptApplyNo = null;
        this.form.acceptApplyId = null;
      } else {
        this.form.exchangeRate = row.exchangeRate;
        this.form.acceptApplyName = row.titleName;
        this.form.acceptApplyNo = row.applyNo;
        if (row.acceptApplyDetailList && row.acceptApplyDetailList.length > 0) {
          this.form.bomPurchaseContractPayDetailList =
            row.acceptApplyDetailList;
          this.form.bomPurchaseContractPayDetailList.map((ele) => {
            ele.compareAmount = ele.totalPriceOriginal;
          });
        }
        this.getRMBAmountToTal();
      }
    },
    getPurchaseRow(v) {
      let row = this.purchaseContractList.find((ele) => {
        return ele.applyNo === v;
      });
      this.form.bomPurchaseContractNo = row.applyNo;
      this.form.currency = row.currency;
      this.form.bomPurchaseContractName = row.titleName;
      this.getPayDetail();
    },
    async getPayDetail() {
      if (!this.form.bomPurchaseContractNo) return;
      let res = await BomPurchaseContractApplyApi.details(
        "",
        this.form.bomPurchaseContractNo
      );
      if (res.data.code === 200 || res.data.code === 0) {
        this.form.contractPaidAmountOriginal =
          res.data.data.paidTotalAmountOriginal;
        this.form.contractPaidAmountRmb = res.data.data.paidTotalAmountRmb;
      }
    },
    async getPurchaseContractList() {
      let res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.purchaseContractList = res.data.data;
      }
    },
    async getAcceptApplyList() {
      let res = await AcceptApplyApi.selectList(
        "bomPurchase",
        this.$route.query.businessId
      );
      if (res.data.code === 0 || res.data.code === 200) {
        this.acceptApplyList = res.data.data;
      }
    },
    async getBomPurchaseContractList() {
      let res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.bomPurchaseContractList = res.data.data;
      }
    },
    testForm() {
      for (let ele of this.form.bomPurchaseContractPayDetailList) {
        if (Number(ele.compareAmount) < Number(ele.totalPriceOriginal)) {
          this.$message.error("验收金额(原币)不得大于原始带出验收金额(原币)");
          return;
        }
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, msg) => {
          resolve(valid);
          if (valid) {
          } else {
            msg &&
              this.$message({
                message: Object.values(msg)[0][0].message,
                type: "warning",
              });
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
    getDictionary(params, type) {
      getDictionary(params).then((res) => {
        if (type === "currency") {
          this.currencyList = res.data.data;
        } else if (type === "purchaseType") {
          this.purchaseTypeList = res.data.data;
        }
      });
    },
    getDeptList() {
      getLazyList(this.parentId, this.tenantId).then((res) => {
        this.deptList = res.data.data;
      });
    },
    getUserList() {
      userList(this.tenantId).then((res) => {
        this.userList = res.data.data;
      });
    },
    getContractProjectList() {
      getProjectList().then((res) => {
        this.projectList = res.data.data;
      });
    },
    saleContractDetailSelectChange(val) {
      this.saleContractDetailMultipleSelection = val;
    },
    addSaleContractDetailRow() {
      this.form.bomPurchaseContractPayDetailList.push({
        key: Date.now(),
      });
    },
    deleteSaleContractDetailRow() {
      if (this.saleContractDetailMultipleSelection.length === 0) {
        this.$message.error("请先选择合同明细");
        return;
      }
      let keys = this.saleContractDetailMultipleSelection.map((ele) => ele.key);
      let ids = this.saleContractDetailMultipleSelection.map((ele) => ele.id);
      this.form.bomPurchaseContractPayDetailList =
        this.form.bomPurchaseContractPayDetailList.filter((ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        });
    },
    async getDepartment() {
      if (this.businessId) return;
      let res = await getDept(this.userInfo.dept_id || this.userInfo.deptId);
      this.form.applicationDept = res.data.data.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
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

.table-now {
}
</style>
