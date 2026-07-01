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
      <el-form-item :label="$t('contract.currency')" prop="currency">
        <el-select v-model="form.currency" clearable>
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('bom.exchangeRate')" prop="exchangeRate">
        <el-input
          v-model="form.exchangeRate"
          clearable
          @input="changeAmount"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.contractAmountOriginal')"
        prop="totalAmountOriginal"
      >
        {{ getOriginalAmountToTal("purchaseDetailList", "totalPrice") }}
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.amountInWordsOriginal')"
        prop="totalAmountUpperOriginal"
      >
        {{ getOriginalAmountToTalChinese("purchaseDetailList", "totalPrice") }}
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.contractAmountRMB')"
        prop="totalAmountRmb"
      >
        {{ getRMBAmountToTal("purchaseDetailList", "totalPrice") }}
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.amountInWordsRMB')"
        prop="totalAmountUpperRmb"
      >
        {{ getRMBAmountToTalChinese("purchaseDetailList", "totalPrice") }}
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.applicationReason')"
        style="width: 96%"
        prop="applyDesc"
      >
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>

      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("purchaseContract.contractInfo") }}
      </p>
      <el-form-item :label="$t('purchaseContract.startDate')" prop="startDate">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.startDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('purchaseContract.endDate')" prop="endDate">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.endDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="采购申请单多选">
        <el-radio-group
          v-model="form.purchaseApplyNoMultiple"
          @change="changePurchaseType"
        >
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="$t('purchaseContract.purchaseApplication')"
        prop="purchaseApplyNo"
        v-if="!form.purchaseApplyNoMultiple"
      >
        <div class="flex">
          <el-select
            filterable
            v-model="form.purchaseApplyNo"
            clearable
            @change="getPurchaseInfo"
          >
            <el-option
              v-for="item in purchaseApplyList"
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
        :label="$t('purchaseContract.purchaseApplication')"
        prop="purchaseApplyNos"
        v-else
      >
        <div class="flex">
          <el-select
            filterable
            v-model="form.purchaseApplyNos"
            clearable
            @change="getPurchaseInfos"
            multiple
            ref="selectPurchaseContract"
          >
            <el-option
              v-for="item in purchaseApplyList"
              :key="item.id"
              :label="item.titleName"
              :value="item.applyNo"
            ></el-option>
          </el-select>
          <!-- <p @click="toPath" class="detailLink">{{ $t('commonContent.viewDetails') }}</p> -->
        </div>
      </el-form-item>
      <el-form-item :label="$t('purchaseContract.purchaseApplyNo')">
        {{
          form.purchaseApplyNoMultiple
            ? form.purchaseApplyNos
            : form.purchaseApplyNo
        }}
        <!-- <el-input v-model="form.purchaseApplyNo" clearable @input="changeAmount" disabled></el-input> -->
      </el-form-item>
      <el-form-item label="采购类型" prop="purchaseOrderType">
        <el-select
          v-model="form.purchaseOrderType"
          clearable
          filterable
          @change="changeType"
        >
          <el-option lable="硬件PO订单" value="硬件PO订单"></el-option>
          <el-option lable="License" value="License"></el-option>
          <el-option lable="服务类" value="服务类"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.originalAmount')"
        prop="purchaseApplyTotalAmountOriginal"
      >
        <el-input
          v-model="form.purchaseApplyTotalAmountOriginal"
          clearable
          @input="changeAmount"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.rmbAmount')"
        prop="purchaseApplyTotalAmountRmb"
      >
        <el-input
          v-model="form.purchaseApplyTotalAmountRmb"
          clearable
          @input="changeAmount"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.countersignDepts')"
        prop="deptIds"
        style="width: 96%"
      >
        <el-select v-model="form.deptIds" multiple>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.contractType')"
        prop="contractType"
      >
        <el-select v-model="form.contractType" clearable>
          <el-option
            v-for="item in salesContractTypeList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.contractCategory')"
        prop="purchaseContractCategory"
      >
        <el-select v-model="form.purchaseContractCategory" clearable>
          <el-option
            v-for="item in salesContractCategoryList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.supplierName')"
        style="width: 96%"
        prop="supplierNo"
      >
        <el-select
          v-model="form.supplierNo"
          clearable
          filterable
          @change="changeSupply"
        >
          <el-option
            v-for="item in contractSupplierList"
            :value="item.supplierNo"
            :key="item.id"
            :label="item.supplierName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.paymentMethod')"
        prop="payMethod"
      >
        <el-select v-model="form.payMethod" clearable>
          <el-option
            v-for="item in payMethodList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('purchaseContract.performancePlace')"
        prop="contractPerformPlace"
      >
        <el-input v-model="form.contractPerformPlace" clearable></el-input>
      </el-form-item>

      <p class="table-title">
        <span></span>{{ $t("purchaseContract.contractDetails") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addCustContactRow">+</span>
          <span class="dec-icon" @click="deleteChooseRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.purchaseDetailList"
          @selection-change="custContactSelectionChange"
          :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }"
          class="mb20 table-now"
        >
          <el-table-column
            v-if="!isPdfDown"
            type="selection"
            width="42"
          ></el-table-column>
          <el-table-column
            :label="$t('purchaseContract.relatedProject')"
            disabled
            :width="isPdfDown ? 50 : 120"
          >
            <template slot-scope="scope">
              {{ scope.row.projectName }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.projectManager')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              {{ scope.row.projectManageName }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.sorpTime')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              {{ scope.row.sorpTime }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.costCenter')"
            prop="costCenterName"
            :width="isPdfDown ? 40 : 120"
          >
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.budgetSubject')"
            prop="subjectName"
            :width="isPdfDown ? 40 : 120"
          >
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.subjectCode')"
            prop="subjectCode"
            :width="isPdfDown ? 45 : 120"
          >
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.budgetInfo')"
            width="120"
            :width="isPdfDown ? 55 : 120"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.budgetInfo"></div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.productName')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row.partsName }} -->
              <el-input
                v-model="scope.row.partsName"
                :disabled="disabled"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.technicalDetails')"
            :width="isPdfDown ? 50 : 120"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row.remark }} -->
              <el-input
                v-model="scope.row.remark"
                :disabled="disabled"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.unit')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row.unitName }} -->
              <el-input
                v-model="scope.row.unitName"
                :disabled="disabled"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.quantity')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row.quantity }} -->
              <el-input
                v-model="scope.row.quantity"
                :disabled="disabled"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.purchasePriceOriginal')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row.totalPriceOriginal }} -->
              <el-input
                v-model="scope.row.totalPriceOriginal"
                :disabled="disabled"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.actualPriceOriginal')"
            width="120"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot="header">
              {{ $t("purchaseContract.actualPriceOriginal") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="mt15"
                style="width: 100%"
                :prop="'purchaseDetailList.' + scope.$index + '.totalPrice'"
                :rules="rules.totalPrice"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.totalPrice"
                ></el-input>
                <div v-else>{{ scope.row.totalPrice }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.priceDiffOriginal')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              {{ getPriceVariance(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.purchasePriceRmb')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row.totalPriceRmb }} -->
              <el-input
                v-model="scope.row.totalPriceRmb"
                :disabled="disabled"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.actualPriceRmb')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              {{ getPriceActionRMB(scope.row) }}

              <!-- <el-input  v-model="scope.row.totalPrice" :disabled="disabled"></el-input> -->
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseContract.priceDiffRmb')"
            :width="isPdfDown ? 40 : 120"
          >
            <template slot-scope="scope">
              {{ getPriceVarianceRMB(scope.row) }}
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("purchaseContract.otherInfo") }}
      </p>
      <el-form-item
        :label="$t('purchaseContract.purchaseCommitteeResolution')"
        style="width: 96%"
        prop="purchaseCommissionDecisionNos"
      >
        <div class="flex">
          <el-select
            multiple
            v-model="form.purchaseCommissionDecisionNos"
            clearable
            filterable
            ref="selectCommission"
            @change="purchaseCommissionDecisionChange"
          >
            <el-option
              v-for="item in purchaseCommissionDecisionList"
              :key="item.applyNo"
              :label="item.titleName"
              :value="item.applyNo"
            ></el-option>
          </el-select>
          <!-- <p @click="toPathPurchase" class="detailLink">{{ $t('common.viewDetails') }}</p> -->
        </div>
      </el-form-item>

      <el-form-item
        :label="$t('commonContent.relatedAttachments')"
        style="width: 96%"
      >
        <upload
          :isHistory="isHistory"
          :fileList="form.fileList"
          :btnName="$t('commonContent.upload')"
          @handleRequest="handleRequest"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form-item :label="$t('commonContent.remarks')" style="width: 96%">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { getFormatDate, menuTagRemove } from "@/util/util";
import PurchaseContractApplyApi from "@/api/purchaseContractApply/index";
import PurchaseCommissionDecisionApplyApi from "@/api/purchaseCommissionDecisionApplication/index";
import { getDictionary } from "@/api/system/dict";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getContractSupplierList } from "@/api/contract/contractSupplier";
import upload from "@/components/upload/index";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import { getOptions } from "@/api/base";
import { mapGetters } from "vuex";
import { mixinsAmount } from "@/mixins/amount";
import subjectManageApi from "@/api/subjectManage";
export default {
  mixins: [mixinsAmount],
  components: {
    upload,
  },
  data() {
    return {
      isHistory: false,
      applyNo: null,
      currencyList: [],
      purchaseTypeList: [],
      salesContractTypeList: [],
      salesContractCategoryList: [],
      countryRegionList: [],
      contractSupplierList: [],
      payMethodList: [],
      deptList: [],
      userList: [],
      purchaseType: [],
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
      saleContractDetailMultipleSelection: [],
      receiveDetailMultipleSelection: [],
      custContactMultipleSelection: [],
      purchaseCommissionDecisionList: [],
      purchaseApplyList: [],
      isStart: false,
      form: {
        titleName: null,
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        applyNo: null,
        currency: null,
        purchaseOrderType:null,
        exchangeRate: null,
        purchaseApplyNoMultiple: 0,
        applyDesc: null,
        startDate: null,
        endDate: null,
        purchaseApplyNos: null,
        purchaseApplyNo: null,
        purchaseApplyTotalAmountOriginal: null,
        purchaseApplyTotalAmountRmb: null,
        deptIds: [],
        contractType: null,
        purchaseContractCategory: null,
        supplierNo: null,
        payMethod: null,
        contractPerformPlace: null,
        purchaseDetailList: [
          {
            key: Date.now(),
            projectName: null,
            projectManageName: null,
            sorpTime: null,
            costCenterName: null,
            subjectName: null,
            subjectCode: null,
            budgetInfo: null,
            partsName: null,
            remark: null,
            unitName: null,
            quantity: null,
            totalPriceOriginal: null,
            totalPrice: null,
            totalPriceRmb: null,
          },
        ],
        purchaseCommissionDecisionNos: null,
      },
      rules: {
        titleName: [{ required: true, message: "请输入标题", trigger: "blur" }],
        applyDesc: [
          { required: true, message: "请输入申请事由", trigger: "blur" },
        ],
        purchaseOrderType: [
          { required: true, message: "请选择采购合同类型", trigger: "change" },
        ],
        exchangeRate: [
          { required: true, message: "请输入汇率", trigger: "blur" },
        ],
        startDate: [
          { required: true, message: "请选择合同开始日期", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择合同结束日期", trigger: "change" },
        ],
        purchaseApplyId: [
          { required: true, message: "请选择采购申请单", trigger: "change" },
        ],
        contractType: [
          { required: true, message: "请选择合同类型", trigger: "change" },
        ],
        purchaseContractCategory: [
          { required: true, message: "请选择合同类别", trigger: "change" },
        ],
        supplierNo: [
          { required: true, message: "请选择供应商名称", trigger: "change" },
        ],
        payMethod: [
          { required: true, message: "请选择支付方式", trigger: "change" },
        ],
        purchaseApplyNo: [
          { required: true, message: "请选择采购申请编号", trigger: "change" },
        ],
        purchaseApplyNos: [
          { required: true, message: "请选择采购申请编号", trigger: "change" },
        ],
        contractPerformPlace: [
          { required: true, message: "请选择合同履行地点", trigger: "blur" },
        ],
        totalPrice: [
          { required: true, message: "请输入实际价格(原币)", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    isPdfDown: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.form.titleName =
      "一般通用采购合同评审" +
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
    this.applyNo = this.$route.query.applyNo;
    if (this.businessId || this.applyNo) {
      this.getDetail();
    }
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "PURCHASE_TYPE" }, "purchaseType");
    this.getDictionary({ code: "PAY_METHOD" }, "payMethod");
    this.getDictionary({ code: "CONTRACT_CATEGORY" }, "saleContractCategory");
    this.getDictionary({ code: "CONTRACT_TYPE" }, "saleContractType");
    this.getDictionary(
      { code: "CONTRACT_CATEGORY1" },
      "purchaseContractCategory"
    );
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
    this.getPurchaseCommissionDecisionList();
    this.getPurchaseApplyList();
    this.getCountryRegion();
    this.getContractSupplierList();
  },
  computed: {
    ...mapGetters(["userInfo", "tagList"]),
    disabled() {
      return (this.businessId || this.applyNo) && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      this.isStart = true;
      let res = await PurchaseContractApplyApi.details(
        this.businessId,
        this.applyNo
      );
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.applyPerson = this.form.applyPerson
          ? this.form.applyPerson.toString()
          : "";
        if (this.form.purchaseApplyNoMultiple) {
          this.form.purchaseApplyNoMultiple = Number(
            this.form.purchaseApplyNoMultiple
          );
        }
        if (this.form.purchaseApplyNos) {
          this.form.purchaseApplyNos = this.form.purchaseApplyNos.split(",");
        }
        this.isHistory = this.form.opinion || this.form.source;
        if (!this.form.purchaseDetailList) {
          this.$set(this.form, "purchaseDetailList", []);
        } else {
          this.form.purchaseDetailList.map((ele, index) => {
            this.getFeeDetail(ele, index);
          });
        }
        if (!this.isEdit) {
          // await this.getListDetail()
        }
        setTimeout(() => {
          this.isStart = false;
        }, 1000);
        this.changeCommission();
        this.changePurchaseClick();
      }
      this.form.contractType = (this.form.contractType || "").toString();
      this.form.purchaseContractCategory = (
        this.form.purchaseContractCategory || ""
      ).toString();
      this.form.payMethod = (this.form.payMethod || "").toString();
      this.$emit("form", this.form);
      this.$emit("getFormData", this.form);
    },
    changePurchaseType() {
      this.form.purchaseApplyNo = null;
      this.form.purchaseApplyNos = null;
    },
    changeSupply() {
      console.log(this.form.supplierNo);
      let row = this.contractSupplierList.find((ele) => {
        return ele.supplierNo === this.form.supplierNo;
      });
      this.form.supplierName = row.supplierName;
    },
    getContractSupplierList() {
      getContractSupplierList({}).then((res) => {
        this.contractSupplierList = res.data.data;
      });
    },
    toPath() {
      if (this.form.purchaseApplyNo) {
        window.open(
          this.$router.resolve({
            path: `/purchaseApplication?purchaseApplyNo=${this.form.purchaseApplyNo}`,
          }).href,
          "_blank"
        );
      }
    },
    handleRequest(data, arr) {
      this.form.fileList = arr;
    },
    async getFeeDetail(row, index) {
      if (row.costCenterId && row.subjectId) {
        let res = await subjectManageApi.subjectMoney(
          row.subjectId,
          row.costCenterId
        );
        if (res.data.code === 0) {
          let data = res.data.data;
          row.avaliableFee = data.availableBudget;
          row.costedFee = data.expensesIncurred;
          row.underApprovalFee = data.expensesUnderReview;
          row.budgetInfo = `可用预算:  ${
            data.availableBudget || 0.0
          }<br/><span style='color:blue'>已发生费用:  ${
            data.expensesIncurred || 0.0
          }</span><br/><span style='color:green'>审批中费用: ${
            data.expensesUnderReview || 0.0
          }</span>`;
          this.$set(this.form.purchaseDetailList, index, row);
        }
      }
    },
    toPathPurchase() {
      if (this.form.purchaseCommissionDecisionNos) {
        let url = `/purchaseCommissionDecisionApplication?applyNo=${this.form.purchaseCommissionDecisionNos}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    getCountryRegion() {
      getOptions({
        code: "COUNTRY_REGIN",
      }).then((res) => {
        this.countryRegionList = res.data.data;
      });
    },
    async getPurchaseApplyList() {
      let res = await PurchaseApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseApplyList = res.data.data;
        if (this.businessId || this.applyNo) {
          this.getPurchaseInfo();
        }
      }
    },
    async getPurchaseInfos() {
      let arr = [];
      console.log(this.form.purchaseApplyNos);
      for (let i = 0; i < this.form.purchaseApplyNos.length; i++) {
        let row = this.purchaseApplyList.find((ele) => {
          return ele.applyNo === this.form.purchaseApplyNos[i];
        });
        console.log(row);
        if (
          !row ||
          this.isStart ||
          ((this.businessId || this.applyNo) && !this.isEdit)
        )
          return;

        let res = await PurchaseApplyApi.details({
          purchaseApplyNo: this.form.purchaseApplyNos[i],
        });
        row.detailList = res.data.data.purchaseDetailList;
        arr.push(row);
        this.changePurchaseClick();
      }
      this.form.purchaseDetailList = [];
      arr.map((ele) => {
        if (ele.detailList) {
          ele.detailList.map((self) => {
            this.form.purchaseDetailList.push(self);
          });
        }
      });
      let amoutOriginal = arr.map((ele) => Number(ele.totalAmountOriginal));
      let amountRmb = arr.map((ele) => Number(ele.totalAmountRmb));
      this.form.purchaseApplyTotalAmountRmb = this.arraySum(amountRmb);
      this.form.purchaseApplyTotalAmountOriginal = this.arraySum(amoutOriginal);
      console.log("tttt");
      console.log(arr);
    },
    arraySum(arr) {
      return arr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
    },
    getPurchaseInfo() {
      let row = this.purchaseApplyList.find((ele) => {
        return ele.applyNo === this.form.purchaseApplyNo;
      });
      if (
        !row ||
        this.isStart ||
        ((this.businessId || this.applyNo) && !this.isEdit)
      )
        return;
      this.form.purchaseApplyNo = row.applyNo;
      this.form.purchaseApplyTotalAmountOriginal = row.totalAmountOriginal;
      this.form.purchaseApplyTotalAmountRmb = row.totalAmountRmb;
      this.form.currency = row.currency;
      this.getPurchaseApplyDetail();
    },
    async getPurchaseApplyDetail() {
      let res = await PurchaseApplyApi.details({
        purchaseApplyNo: this.form.purchaseApplyNo,
      });
      if (res.data.code === 200) {
        this.form.purchaseDetailList = res.data.data.purchaseDetailList;
        this.form.purchaseDetailList.map((ele, index) => {
          this.getFeeDetail(ele, index);
        });
      }
    },
    getPriceVariance(row) {
      let val =
        Number(row.totalPrice || 0) - Number(row.totalPriceOriginal || 0);
      row.priceDiffOriginal = Math.abs(val);
      return row.priceDiffOriginal;
    },
    getPriceActionRMB(row) {
      row.totalRmbPrice = (row.totalPrice || 0) * (this.form.exchangeRate || 1);
      return (row.totalPrice || 0) * (this.form.exchangeRate || 1);
    },
    getPriceVarianceRMB(row) {
      row.priceDiffRmb =
        (row.priceDiffOriginal || 0) * (this.form.exchangeRate || 1);
      return (row.priceDiffOriginal || 0) * (this.form.exchangeRate || 1);
    },
    async purchaseCommissionDecisionChange(val) {
      for (const ele of this.purchaseCommissionDecisionList) {
        if (val === ele.applyNo) {
          console.log("ele-->" + ele.purchaseApplyNo);
          if (ele.purchaseApplyNo != null) {
            let res = await PurchaseApplyApi.details({
              purchaseApplyNo: ele.purchaseApplyNo,
            });
            this.form.purchaseApplyId = ele.purchaseApplyId;
            if (res.data.code === 200) {
              this.form.purchaseApplyNo = res.data.data.applyNo;
              this.form.purchaseApplyTotalAmountOriginal =
                res.data.data.purchaseApplyTotalAmountOriginal;
              this.form.purchaseApplyTotalAmountRmb =
                res.data.data.purchaseApplyTotalAmountRmb;
              this.form.exchangeRate = res.data.data.exchangeRate;
              this.form.currency = res.data.data.currency;
            }
          }
        }
      }
      this.changeCommission();
    },
    changeCommission() {
      setTimeout(() => {
        // 防御性：setTimeout 触发时组件可能已卸载（用户切换页面等），避免 $refs 为 undefined
        if (!this.$refs || !this.$refs.selectCommission || !this.$refs.selectCommission.$refs || !this.$refs.selectCommission.$refs.tags) {
          return;
        }
        this.$refs.selectCommission.$refs.tags.childNodes[1].children.forEach(
          (e, i) => {
            console.log(i);
            e.onclick = (clickEvent) => {
              //  这里写点击后的事件()
              //  e.textContent 为tag的文本内容
              let url = `/purchaseCommissionDecisionApplication?applyNo=${this.form.purchaseCommissionDecisionNos[i]}`;
              window.open(this.$router.resolve({ path: url }).href, "_blank");
              clickEvent.stopPropagation(); // 防止冒泡事件
            };
          }
        );
      }, 1000);
    },
    changePurchaseClick() {
      setTimeout(() => {
        // 防御性：setTimeout 触发时组件可能已卸载（用户切换页面等），避免 $refs 为 undefined
        if (!this.$refs || !this.$refs.selectPurchaseContract || !this.$refs.selectPurchaseContract.$refs || !this.$refs.selectPurchaseContract.$refs.tags) {
          return;
        }
        this.$refs.selectPurchaseContract.$refs.tags.childNodes[1].children.forEach(
          (e, i) => {
            console.log(i);
            e.onclick = (clickEvent) => {
              //  这里写点击后的事件()
              //  e.textContent 为tag的文本内容
              let url = `/purchaseApplication?purchaseApplyNo=${this.form.purchaseApplyNos[i]}`;
              window.open(this.$router.resolve({ path: url }).href, "_blank");
              clickEvent.stopPropagation(); // 防止冒泡事件
            };
          }
        );
      }, 1000);
    },
    async getPurchaseCommissionDecisionList() {
      let res = await PurchaseCommissionDecisionApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseCommissionDecisionList = res.data.data;
      }
    },

    async getListDetail() {
      if (!this.form.purchaseApplyId) return;
      let res = await PurchaseApplyApi.details(this.form.purchaseApplyId);
      if (res.data.code === 200) {
        this.form.purchaseDetailList = res.data.data.purchaseDetailList;
        this.form.purchaseApplyNo = res.data.data.applyNo;
        this.form.purchaseApplyTotalAmountOriginal =
          res.data.data.purchaseApplyTotalAmountOriginal;
        this.form.purchaseApplyTotalAmountRmb =
          res.data.data.purchaseApplyTotalAmountRmb;
        this.form.purchaseDetailList.map((ele, index) => {
          ele.budgetInfo = `可用预算:  ${
            ele.avaliableFee || 0.0
          }<br/><span style='color:blue'>已发生费用:  ${
            ele.costedFee || 0.0
          }</span><br/><span style='color:green'>审批中费用: ${
            ele.underApprovalFee || 0.0
          }</span>`;
          this.getFeeDetail(ele, index);
        });
      }
    },
    testForm() {
      console.log(this.form);
      // this.form.totalAmountOriginal = getOriginalAmountToTal('purchaseDetailList', 'totalPrice')
      if (
        Number(this.form.totalAmountOriginal) >
        Number(this.form.purchaseApplyTotalAmountOriginal)
      ) {
        this.$message.error("合同金额(原币)不得大于采购申请金额(原币)金额");
        return;
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, msg) => {
          if (valid) {
            if (this.form.purchaseApplyNos) {
              this.form.purchaseApplyNos =
                this.form.purchaseApplyNos.toString();
            }
            resolve(valid);
            // this.form.purchaseCommissionDecisionNos = this.form.purchaseCommissionDecisionNos.toString()
          } else {
            msg &&
              this.$message({
                message: Object.values(msg)[0][0].message,
                type: "warning",
              });
            resolve(valid);
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
        } else if (type === "payMethod") {
          this.payMethodList = res.data.data;
        } else if (type === "saleContractType") {
          this.salesContractTypeList = res.data.data;
        } else if (type === "purchaseContractCategory") {
          this.salesContractCategoryList = res.data.data;
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
    saleContractDetailSelectChange(val) {
      this.saleContractDetailMultipleSelection = val;
    },
    addSaleContractDetailRow() {
      this.form.salesContractDetailNewList.push({
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
      this.form.salesContractDetailNewList =
        this.form.salesContractDetailNewList.filter((ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        });
    },
    receiveDetailSelectionChange(val) {
      this.receiveDetailMultipleSelection = val;
    },
    addReceiveDetailRow() {
      this.form.saleContractReceiveDetailList.push({
        key: Date.now(),
      });
    },
    deleteReceiveDetailRow() {
      if (this.receiveDetailMultipleSelection.length === 0) {
        this.$message.error("请先选择收款明细");
        return;
      }
      let keys = this.receiveDetailMultipleSelection.map((ele) => ele.key);
      let ids = this.receiveDetailMultipleSelection.map((ele) => ele.id);
      this.form.saleContractReceiveDetailList =
        this.form.saleContractReceiveDetailList.filter((ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        });
    },
    custContactSelectionChange(val) {
      this.custContactMultipleSelection = val;
    },
    addCustContactRow() {
      this.form.purchaseDetailList.push({
        key: Date.now(),
        projectName: this.form.purchaseDetailList[0].projectName,
        projectManageName: this.form.purchaseDetailList[0].projectManageName,
        sorpTime: this.form.purchaseDetailList[0].sorpTime,
        costCenterName: this.form.purchaseDetailList[0].costCenterName,
        subjectName: this.form.purchaseDetailList[0].subjectName,
        subjectCode: this.form.purchaseDetailList[0].subjectCode,
        budgetInfo: this.form.purchaseDetailList[0].budgetInfo,
        avaliableFee: this.form.purchaseDetailList[0].avaliableFee,
        costedFee: this.form.purchaseDetailList[0].costedFee,
        underApprovalFee: this.form.purchaseDetailList[0].underApprovalFee,
        costCenterId: this.form.purchaseDetailList[0].costCenterId,
        subjectId: this.form.purchaseDetailList[0].subjectId,
      });
    },
    deleteChooseRow() {
      if (this.custContactMultipleSelection.length === 0) {
        this.$message.error("请先选择合同明细");
        return;
      }
      let keys = this.custContactMultipleSelection.map((ele) => ele.key);
      let ids = this.custContactMultipleSelection.map((ele) => ele.id);
      this.form.purchaseDetailList = this.form.purchaseDetailList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
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
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.table-now {
}

.mt15 {
  margin-top: 15px;
}
</style>
