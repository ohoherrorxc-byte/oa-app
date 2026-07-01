<template>
  <basic-container>
    <p class="table-title"><span></span>{{ $t("acceptApply.basicInfo") }}</p>
    <el-form
      :disabled="disabled"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="120px"
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
        {{ form.totalAmountOriginal }}
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
        style="width: 96%"
        prop="applyDesc"
      >
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("contract.contractInfo") }}
      </p>
      <el-form-item :label="$t('contract.projectName')" prop="projectNo">
        <el-select
          v-model="form.projectNo"
          clearable
          filterable
          @change="getProjectRow"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.projectNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.projectNo')" prop="projectNo">
        <el-input v-model="form.projectNo" clearable></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.relatedAcceptance')"
        prop="acceptApplyId"
      >
        <div class="flex">
          <el-select
            v-if="!disabled"
            filterable
            v-model="form.acceptApplyId"
            clearable
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
          <p @click="toPathYS" class="detailLink">
            {{ $t("commonContent.viewDetails") }}
          </p>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('contract.relatedContract')"
        prop="purchaseContractNo"
      >
        <div class="flex">
          <el-select
            v-model="form.purchaseContractNo"
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
      <el-form-item
        :label="$t('contract.contractNo')"
        prop="purchaseContractNo"
      >
        <el-input v-model="form.purchaseContractNo" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('contract.currency')">
        <el-select v-model="form.currency" clearable>
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
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
      <el-form-item :label="$t('contract.exchangeRate')" prop="exchangeRate">
        <el-input
          v-model="form.exchangeRate"
          clearable
          @input="getMoneyAll(form.totalAmountOriginal)"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.totalAmountOriginal')"
        prop="contractTotalAmountOriginal"
      >
        <el-input
          v-model="form.contractTotalAmountOriginal"
          disabled
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.paidAmountOriginal')"
        prop="contractPaidAmountOriginal"
      >
        <el-input
          diabled
          v-model="form.contractPaidAmountOriginal"
          disabled
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.remainAmountOriginal')"
        prop="contractRemainAmountOriginal"
      >
        <el-input
          diabled
          v-model="form.contractRemainAmountOriginal"
          disabled
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.currentPaymentOriginal')"
        prop="totalAmountOriginal"
      >
        <el-input v-model="form.totalAmountOriginal" disabled></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.totalAmountRmb')"
        prop="totalAmountRmb"
      >
        <el-input
          v-model="form.contractTotalAmountRmb"
          disabled
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.paidAmountRmb')"
        prop="contractPaidAmountRmb"
      >
        <el-input
          v-model="form.contractPaidAmountRmb"
          disabled
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.remainAmountRmb')"
        prop="contractRemainAmountRmb"
      >
        <el-input
          v-model="form.contractRemainAmountRmb"
          disabled
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('contract.currentPaymentRmb')"
        prop="totalAmountRmb"
      >
        {{ form.totalAmountRmb }}
      </el-form-item>

      <el-form-item :label="$t('contract.isFinalPayment')" prop="isBalancePay">
        <el-select v-model="form.isBalancePay" clearable>
          <el-option
            v-for="item in isBalancePayList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <p class="table-title">
        <span></span>{{ $t("contract.acceptanceDetails") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addSaleContractDetailRow">+</span>
          <span class="dec-icon" @click="deleteSaleContractDetailRow">―</span>
          <img
            @click="copyChoose"
            class="mt3"
            src="@/assets/svg/copy.svg"
            width="24"
            alt=""
          />
        </div>
        <el-table
          ref="multipleTable"
          :data="form.purchaseContractPayDetailList"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          @selection-change="saleContractDetailSelectChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column
            :label="$t('contract.productName')"
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
            :label="$t('contract.technicalDetails')"
            :width="isPdfDown ? 160 : ''"
          >
            <template slot-scope="scope">
              <el-input v-if="!disabled" v-model="scope.row.remark"></el-input>
              <div v-else>{{ scope.row.remark }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('contract.unit')"
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
            :label="$t('contract.quantity')"
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
            :label="$t('contract.acceptanceAmount')"
            :width="isPdfDown ? 160 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.totalPriceOriginal"
                @change="getOriginalAmountToTal"
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
        <span></span>{{ $t("contract.paymentInfo") }}
      </p>
      <el-form-item
        :label="$t('contract.supplierName')"
        style="width: 96%"
        prop="supplierNo"
      >
        <el-select
          filterable
          v-model="form.supplierNo"
          clearable
          @change="getSupplyRow"
        >
          <el-option
            v-for="item in contractSupplierList"
            :key="item.id"
            :label="item.supplierName"
            :value="item.supplierNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('contract.bankName')"
        style="width: 96%"
        prop="openBank"
      >
        <el-input v-model="form.openBank" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('contract.bankAccount')" prop="bankAccount">
        <el-input v-model="form.bankAccount" clearable></el-input>
      </el-form-item>

      <el-form-item
        :label="$t('contract.completionOrder')"
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
        :label="$t('contract.invoice')"
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
  </basic-container>
</template>

<script>
import { getFormatDate, mergePDFs } from "@/util/util";
import PurchaseContractPayApplyApi from "@/api/purchaseContractPayApply/index";
import { getDictionary } from "@/api/system/dict";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getProjectList } from "@/api/contract/contractProject";
import { mapGetters } from "vuex";
import { numberToTraditionalChinese } from "@/util/util";
import { mixins } from "./purchaseMixins";
import AcceptApplyApi from "@/api/acceptApply/index";
import upload from "@/components/upload/index";
import PurchaseContractApplyApi from "@/api/purchaseContractApply/index";
import { getContractSupplierList } from "@/api/contract/contractSupplier";
import printJS from "print-js";
import viewAllFile from "../bomPurchaseContractPayApplication/viewAllFile";
export default {
  mixins: [mixins],
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
      acceptApplyList: [],
      contractSupplierList: [],
      isBalancePayList: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
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
      saleContractDetailMultipleSelection: [],
      form: {
        purchaseContractPayDetailList: [
          {
            key: Date.now(),
            partsName: null,
            remark: null,
            unitName: null,
            quantity: null,
            totalPriceOriginal: null,
          },
        ],
        acceptApplyNo: null,
        purchaseContractNo: "",
        titleName: null,
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        applyNo: null,
        totalAmountOriginalUpper: null,
        totalAmountRmb: null,
        totalAmountRmbUpper: null,
        applyDesc: null,
        projectNo: null,
        purchaseContractNo: null,
        currency: null,
        contractSame: null,
        contractSpecial: null,
        exchangeRate: null,
        contractTotalAmountOriginal: null,
        contractPaidAmountOriginal: null,
        contractRemainAmountOriginal: null,
        totalAmountOriginal: null,
        contractTotalAmountRmb: null,
        contractPaidAmountRmb: null,
        contractRemainAmountRmb: null,
        acceptApplyId: null,
        acceptApplyName: null,
        isBalancePay: null,
        supplierNo: null,
        openBank: null,
        bankAccount: null,
        completionOrderList: [],
        invoiceList: [],
      },
      rules: {
        completionOrderList: [
          { required: true, message: "请上传(盖章）完工单", trigger: "change" },
        ],
        invoiceList: [
          { required: true, message: "请上传发票", trigger: "change" },
        ],
        titleName: [{ required: true, message: "请输入标题", trigger: "blur" }],
        applyDesc: [
          { required: true, message: "请输入申请事由", trigger: "blur" },
        ],
        projectNo: [
          { required: true, message: "请输入项目名称", trigger: "change" },
        ],
        exchangeRate: [
          { required: true, message: "请输入汇率", trigger: "blur" },
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
        purchaseContractId: [
          { required: true, message: "请选择相关合同", trigger: "change" },
        ],
        isBalancePay: [
          { required: true, message: "请选择是否尾款", trigger: "change" },
        ],
        totalAmountOriginal: [
          { required: true, message: "请输入本次付款金额(原币)" },
        ],
        acceptApplyId: [
          { required: true, message: "请选择相关验收", trigger: "change" },
        ],
        supplierNo: [
          { required: true, message: "请选择供应商名称", trigger: "change" },
        ],
        purchaseContractNo: [
          { required: true, message: "请选择相关合同", trigger: "change" },
        ],
        openBank: [
          { required: true, message: "请输入银行开户行", trigger: "change" },
        ],
        bankAccount: [
          { required: true, message: "请输入银行账号", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.form.titleName =
      "一般通用采购合同付款申请" +
      " - " +
      (this.userInfo.nick_name ||
        this.userInfo.realName ||
        this.userInfo.user_name) +
      " - " +
      getFormatDate();
    this.businessId = this.$route.query.businessId;
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
    this.getContractProjectList();
    this.getAcceptApplyList();
    this.getPurchaseContractList();
    this.getContractSupplierList();
  },
  props: {
    isPdfDown: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  components: { upload, viewAllFile },
  methods: {
    viewFile() {
      this.$refs.viewAllFile.dialogTableVisible = true;
      this.$refs.viewAllFile.getFileList(this.form, "purchasePay");
    },
    getRMBAmount(money) {
      this.form.totalAmountRmb =
        Number(money || 0) * (this.form.exchangeRate || 1);
      this.form.totalAmountRmb = Number(this.form.totalAmountRmb).toFixed(2);
      this.form.totalAmountOriginalUpper = numberToTraditionalChinese(
        money || 0
      );
      this.form.totalAmountRmbUpper = numberToTraditionalChinese(
        this.form.totalAmountRmb || 0
      );
      return this.form.totalAmountRmb;
    },
    toPath() {
      if (this.form.purchaseContractNo) {
        let url = `/purchaseContractApplication?applyNo=${this.form.purchaseContractNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    toPathYS() {
      if (this.form.acceptApplyId) {
        let url = `/acceptApply?businessId=${this.form.acceptApplyId}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    handleRequestCompletion(data, arr) {
      // console.log(data)
      // console.log(arr)
      arr.map((ele) => {
        ele.businessName = "acceptFinished";
      });
      this.form.completionOrderList = arr;
    },
    handleRequestInvoice(data, arr) {
      arr.map((ele) => {
        ele.businessName = "invoivePurchaseContractPay";
      });
      this.form.invoiceList = arr;
    },
    getMoneyAll(money) {
      this.form.totalAmountRmb =
        Number(money || 0) * (this.form.exchangeRate || 1);
      this.form.totalAmountRmb = Number(this.form.totalAmountRmb).toFixed(2);
      this.form.totalAmountOriginalUpper = numberToTraditionalChinese(
        money || 0
      );
      this.form.totalAmountRmbUpper = numberToTraditionalChinese(
        this.form.totalAmountRmb || 0
      );
    },
    async downBranch() {
      let arr = this.form.completionOrderList.concat(this.form.invoiceList);
      const pdfBlobs = await Promise.all(
        arr.map(async (file) => {
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
    getOriginalAmountToTal() {
      if (
        !this.form["purchaseContractPayDetailList"] ||
        this.form["purchaseContractPayDetailList"].length === 0
      )
        return;
      let arr = this.form["purchaseContractPayDetailList"].map(
        (ele) => ele["totalPriceOriginal"]
      );
      var sum = arr.reduce(function (prev, curr, idx, arr) {
        return Number(prev || 0) + Number(curr || 0);
      });
      this.form["totalAmountOriginal"] = Number(sum).toFixed(2);
      this.getMoneyAll(this.form.totalAmountOriginal);
      if (!isNaN(sum)) {
        return Number(sum).toFixed(2);
      }
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
      this.form.supplierId = row.id;
      this.form.supplierName = row.supplierName;
      if (row.supplierSettlementList && row.supplierSettlementList.length > 0) {
        this.form.openBank = row.supplierSettlementList[0].openBank;
        this.form.bankAccount = row.supplierSettlementList[0].bankAccount;
      }
    },
    getPurchaseRow(v) {
      let row = this.purchaseContractList.find((ele) => {
        return ele.applyNo === v;
      });
      this.form.currency = row.currency;
      this.form.exchangeRate = row.exchangeRate;
      this.form.contractTotalAmountOriginal = row.totalAmountOriginal;
      this.form.contractPaidAmountOriginal = row.contractPaidAmountOriginal;
      this.form.contractRemainAmountOriginal = row.contractRemainAmountOriginal;
      this.form.contractTotalAmountRmb = row.totalAmountRmb;
      this.form.contractPaidAmountRmb = row.contractPaidAmountRmb;
      this.form.contractRemainAmountRmb = row.contractRemainAmountRmb;
      this.getMoneyAll(this.form.totalAmountOriginal);
    },
    getProjectRow(v) {
      let row = this.projectList.find((ele) => {
        return ele.projectNo === v;
      });
      this.form.projectName = row.projectName;
    },
    async getPurchaseContractList() {
      let res = await PurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.purchaseContractList = res.data.data;
      }
    },
    getAcceptRow(v) {
      let row = this.acceptApplyList.find((ele) => {
        return ele.id === v;
      });
      console.log(row);
      if (row) {
        this.form.purchaseContractNo = row.purchaseContractNo;
        this.getPurchaseRow(row.purchaseContractNo);
        this.testAccept(row);
        this.getFileList(row);
        this.getInvoice(row);
      }
    },
    async getInvoice(row) {
      console.log(row);
      let res = await PurchaseContractPayApplyApi.getInvoiceList(
        row.purchaseContractNo
      );
      console.log(res);
      if (res.data.code === 200 || res.data.code === 0) {
        let arr = res.data.data;
        arr.map((ele) => {
          ele.businessName = "invoivePurchaseContractPay";
        });
        this.form.invoiceList = arr;
        this.$refs.form.clearValidate();
      }
    },
    async getFileList(row) {
      this.form.fileList = this.form.fileList || [];
      this.form.fileList = this.form.fileList.filter((ele) => {
        return (
          ele.businessName !== "acceptFinished" &&
          ele.businessName !== "BomOrderFinished"
        );
      });
      console.log(this.form.fileList);
      let res = await AcceptApplyApi.getFileList(row.id, "acceptFinished");
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.map((ele) => {
          this.form.completionOrderList.push(ele);
        });
      }
      this.$emit("getFormData", this.form);
    },
    async testAccept(row) {
      if (!row.applyNo) {
        this.$message.error("该验收单没有编号，请查看验收单详情核对数据");
      }
      console.log(row);
      console.log(22222222222);
      let res = await AcceptApplyApi.isUsed(row.applyNo);
      if (res.data.code !== 0 && res.data.code !== 200) {
        this.form.acceptApplyName = null;
        this.form.purchaseContractPayDetailList = [];
        this.form.acceptApplyNo = null;
        this.form.acceptApplyId = null;
        this.form.totalAmountOriginal = null;
      } else {
        this.form.acceptApplyName = row.titleName;
        this.form.acceptApplyNo = row.applyNo;
        this.form.purchaseContractPayDetailList =
          row.acceptApplyDetailList || [];
        this.form.purchaseContractPayDetailList.map((ele) => {
          ele.compareAmount = ele.totalPriceOriginal;
        });
        this.getOriginalAmountToTal();
      }
    },
    async getAcceptApplyList() {
      let res = await AcceptApplyApi.selectList(
        "purchase",
        this.$route.query.businessId
      );
      if (res.data.code === 0 || res.data.code === 200) {
        this.acceptApplyList = res.data.data;
      }
    },
    async getDetail() {
      let res = await PurchaseContractPayApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.acceptApplyId = Number(this.form.acceptApplyId);
        this.form.applyPerson = this.form.applyPerson
          ? this.form.applyPerson.toString()
          : "";
        if (
          this.form.purchaseType != undefined &&
          this.form.purchaseType != null
        ) {
          this.form.purchaseType = this.form.purchaseType
            ? this.form.purchaseType.toString()
            : "";
        }
        this.form.purchaseContractPayDetailList.map((ele) => {
          ele.budgetInfo = `可用预算:  ${
            ele.avaliableFee || 0.0
          }<br/><span style='color:blue'>已发生费用:  ${
            ele.costedFee || 0.0
          }</span><br/><span style='color:green'>审批中费用: ${
            ele.underApprovalFee || 0.0
          }</span>`;
        });
        this.getSupplyRow(this.form.supplierNo);
        this.form.totalAmountRmb = Number(this.form.totalAmountRmb).toFixed(2);
        this.$emit("getFormData", this.form);
      }
    },
    testForm() {
      for (let ele of this.form.purchaseContractPayDetailList) {
        if (Number(ele.compareAmount) < Number(ele.totalPriceOriginal)) {
          this.$message.error("验收金额(原币)不得大于原始带出验收金额(原币)");
          return;
        }
      }
      if (!Number(this.form.exchangeRate)) {
        this.$message.error("汇率不能为0或为空");
        return;
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
      this.form.purchaseContractPayDetailList.push({
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
      this.form.purchaseContractPayDetailList =
        this.form.purchaseContractPayDetailList.filter((ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        });
      this.getOriginalAmountToTal();
    },
    copyChoose() {
      if (this.saleContractDetailMultipleSelection.length === 0) {
        this.$message.error("请先选择合同明细");
        return;
      }
      let arr = JSON.parse(
        JSON.stringify(this.saleContractDetailMultipleSelection)
      );
      arr.map((ele, index) => {
        ele.key = Date.now() + index;
        this.form.purchaseContractPayDetailList.push(ele);
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
  margin-right: 5px;
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
