<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t("baseInfo.basicInformation") }}
    </p>
    <el-form
      :disabled="disabled"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item
        :label="$t('baseInfo.title')"
        prop="titleName"
        style="width: 96%"
      >
        <el-input v-model="form.titleName" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('baseInfo.applicant')" prop="applyPerson">
        <el-select v-model="form.applyPerson" disabled>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('baseInfo.department')" prop="assetNumber">
        <el-select v-model="form.applyDept" disabled>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('baseInfo.applyDate')" prop="assetNumber">
        <el-input v-model="form.applyDate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('baseInfo.applicationNumber')"
        prop="assetNumber"
      >
        <el-input v-model="form.applyNo" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.currency')">
        <el-select disabled v-model="form.currency" clearable>
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
          @input="getRMB"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.originalAmount')" prop="assetNumber">
        {{ getOriginalAmountToTal("bomPurchaseOrderDetailList") }}
      </el-form-item>
      <el-form-item :label="$t('bom.originalAmountUpper')" prop="assetNumber">
        {{ getOriginalAmountToTalChinese("bomPurchaseOrderDetailList") }}
      </el-form-item>
      <el-form-item :label="$t('bom.rmbAmount')" prop="assetNumber">
        {{ getRMBAmountToTalWithRow("bomPurchaseOrderDetailList") }}
      </el-form-item>
      <el-form-item :label="$t('bom.rmbAmountUpper')" prop="assetNumber">
        {{ getRMBAmountToTalChineseWithRow("bomPurchaseOrderDetailList") }}
      </el-form-item>
      <el-form-item
        :label="$t('bom.applyReason')"
        style="width: 96%"
        prop="applyDesc"
      >
        <el-input type="textarea" autosize v-model="form.applyDesc"></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("bom.contractInfo") }}
      </p>
      <el-form-item
        :label="$t('bom.relatedContract')"
        style="width: 96%"
        prop="bomPurchaseContractNo"
      >
        <div class="flex">
          <el-select
            v-model="form.bomPurchaseContractNo"
            clearable
            filterable
            @change="bomPurchaseContractChange"
          >
            <el-option
              v-for="item in bomPurchaseContractList"
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
      <el-form-item :label="$t('bom.contractNo')">
        <el-input
          v-model="form.bomPurchaseContractNo"
          clearable
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.contractType')">
        <el-select v-model="form.bomPurchaseContractType" clearable disabled>
          <el-option
            v-for="item in salesContractTypeList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('bom.purchaseOrderType')"
        prop="purchaseOrderType"
      >
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
      <el-form-item :label="$t('bom.deliveryAddress')" prop="deliveryAddress">
        <el-input v-model="form.deliveryAddress"></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.exporter')" prop="exporter">
        <el-input v-model="form.exporter"></el-input>
      </el-form-item>
      <el-form-item :label="$t('bom.associatedPurchaseRequest')" prop="havePr">
        <el-radio-group v-model="form.havePr" @change="changePr">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('bom.purchaseRequestLinkage')"
        prop="havePr"
        v-if="form.havePr === 1"
      >
        <div class="flex">
          <el-select
            v-model="form.purchaseId"
            @change="getPurchaseInfo"
            filterable
            clearable
          >
            <el-option
              v-for="item in purchaseList"
              :key="item.id"
              :label="item.titleName"
              :value="item.id"
            ></el-option>
          </el-select>
          <p @click="toPathApply" class="detailLink">查看详情</p>
        </div>
      </el-form-item>
      <el-form-item label="税率" prop="">
        <el-input v-model="form.taxRate"></el-input>
      </el-form-item>
      <p class="table-title" style="width: 100%">
        <span></span>{{ $t("bom.orderDetails") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr mb10 flex-center" v-if="!disabled">
          <div class="add-icon" @click="addCustContactRow">+</div>
          <div class="dec-icon" @click="deleteChooseRow">―</div>
          <img
            @click="copyChoose"
            class="mt3"
            src="@/assets/svg/copy.svg"
            width="24"
            alt=""
          />
          <el-button @click="downloadFile">{{
            $t("bom.downloadTemplate")
          }}</el-button>
          <upload
            @handleRequest="handleRequestExport"
            :showTip="false"
            class="mx10"
            url="/api/oa-portal/bomPurchaseOrder/getBomOrderDetailByFile"
          ></upload>
        </div>
        <div style="color: red">{{ $t("bom.tipWatch") }}</div>
        <el-table
          ref="multipleTable"
          :data="form.bomPurchaseOrderDetailList"
          border
          :key="key"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          @selection-change="custContactSelectionChange"
          class="mb20 table-now borderless-resizable"
   
        >
          <el-table-column
            type="selection"
            width="42"
            v-if="!isPdfDown"
          ></el-table-column>
          <el-table-column label="相关项目" :width="isPdfDown ? 80 : 300">
            <template slot="header">
              {{ $t("bom.projectL") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'bomPurchaseOrderDetailList.' + scope.$index + '.projectNo'
                "
                :rules="rules.projectNo"
                style="width: 100%"
              >
                <el-select
                  v-if="!disabled"
                  v-model="scope.row.projectNo"
                  filterable
                  clearable
                  placeholder=""
                  @change="getProjectRow(scope.row)"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.id"
                    :label="item.projectName"
                    :value="item.projectNo"
                  ></el-option>
                </el-select>
                <div v-else>{{ scope.row.projectName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="预算科目"
            prop="subjectName"
            :width="isPdfDown ? 80 : 240"
          >
            <template slot="header">
              {{ $t("bom.budgetSubject") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'bomPurchaseOrderDetailList.' + scope.$index + '.subjectId'
                "
                :rules="rules.subjectId"
                style="width: 100%"
              >
                <elSelectTree
                  v-if="!disabled"
                  @getValue="getSubjetRow($event, scope.row, scope.$index)"
                  :value="{ name: scope.row.subjectName }"
                  :options="subjectList"
                  :accordion="false"
                  :disabled="disabled"
                  :props="deptProps"
                ></elSelectTree>
                <!-- <avue-input-tree   v-if="!disabled" @change="getSubjetRow(scope.row, scope.$index)" ref="tree" :check-strictly="true"
                  node-key="id" v-model="scope.row.subjectId" placeholder="" :dic="subjectList" :defaultExpandAll="false"
                  :props="deptProps"></avue-input-tree> -->
                <div v-else>{{ scope.row.subjectName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="成本中心"
            prop="costCenterName"
            :width="isPdfDown ? 60 : 140"
          >
            <template slot="header">
              {{ $t("bom.costCenter") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'bomPurchaseOrderDetailList.' +
                  scope.$index +
                  '.costCenterName'
                "
                :rules="rules.costCenterName"
                style="width: 100%"
              >
                <el-select
                  v-if="!disabled"
                  v-model="scope.row.costCenterName"
                  @change="getCostItem(scope.row, scope.$index)"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, index) in costList"
                    :key="index"
                    :label="item.costName"
                    :value="item.costName"
                  ></el-option>
                </el-select>
                <div v-else>{{ scope.row.costCenterName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.subjectCode')"
            prop="subjectNo"
            :width="isPdfDown ? 60 : 120"
          >
            <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.subjectCode" disabled></el-input>
            </template> -->
          </el-table-column>
          <el-table-column
            :label="$t('bom.budgetInfo')"
            :width="isPdfDown ? 100 : 120"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.budgetInfo"></div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.productName')"
            :width="isPdfDown ? 60 : 120"
          >
            <template slot="header">
              {{ $t("bom.productName") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'bomPurchaseOrderDetailList.' + scope.$index + '.partsName'
                "
                :rules="rules.partsName"
                style="width: 100%"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.partsName"
                ></el-input>
                <div v-else>{{ scope.row.partsName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.partNo')"
            :width="isPdfDown ? 60 : 200"
            :render-header="renderHeader"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="
                  'bomPurchaseOrderDetailList.' + scope.$index + '.partsNo'
                "
                :rules="rules.partsNo"
              >
                <div class="flex">
                  <el-select
                    v-if="!disabled"
                    allow-create
                    v-model="scope.row.partsNo"
                    @change="changePartPrice(scope.row)"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="item in partList"
                      :key="item.id"
                      :value="item.partsNo"
                      :label="item.partsNo"
                    ></el-option>
                  </el-select>
                  <el-button
                    type="text"
                    @click="chooseRow(scope.row, scope.$index)"
                    >选择</el-button
                  >
                </div>
                <div v-if="disabled">{{ scope.row.partsNo }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.quantity')"
            :width="isPdfDown ? 60 : 120"
          >
            <template slot="header">
              {{ $t("bom.quantity") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'bomPurchaseOrderDetailList.' + scope.$index + '.quantity'
                "
                :rules="rules.quantity"
                style="width: 100%"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.quantity"
                  @change="getOriginal(scope.row, scope.$index)"
                ></el-input>
                <div v-else>{{ scope.row.quantity }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.unitPrice')"
            :width="isPdfDown ? 60 : 120"
          >
            <template slot="header">
              {{ $t("bom.unitPrice") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'bomPurchaseOrderDetailList.' + scope.$index + '.unitPrice'
                "
                :rules="rules.unitPrice"
                style="width: 100%"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.unitPrice"
                  @change="getOriginal(scope.row, scope.$index)"
                ></el-input>
                <div v-else>{{ scope.row.unitPrice }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.originalAmount')"
            :width="isPdfDown ? 60 : 120"
          >
            <template slot="header">
              {{ $t("bom.originalAmount") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'bomPurchaseOrderDetailList.' +
                  scope.$index +
                  '.totalPriceOriginal'
                "
                :rules="rules.totalPriceOriginal"
                style="width: 100%"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.totalPriceOriginal"
                  @change="getRMB"
                ></el-input>
                <div v-else>{{ scope.row.totalPriceOriginal }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.rmbAmount')"
            :width="isPdfDown ? 70 : 120"
          >
            <template slot-scope="scope">
              <el-form-item>
                {{ scope.row.totalPriceRmb }}
                <!-- {{ getRMBAmount(scope.row.totalPriceOriginal, scope) }} -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.remark')"
            :width="isPdfDown ? 70 : 120"
          >
            <template slot-scope="scope">
              <el-form-item style="width: 100%">
                <el-input
                  v-model="scope.row.remark"
                  v-if="!disabled"
                  type="textarea"
                ></el-input>
                <div v-else>{{ scope.row.remark }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.cycle')"
            :width="isPdfDown ? 70 : 100"
          >
            <template slot-scope="scope">
              <el-form-item style="width: 100%">
                <el-input v-if="!disabled" v-model="scope.row.cycle"></el-input>
                <div v-else>{{ scope.row.cycle }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bom.deliveryDate')"
            :width="isPdfDown ? 70 : 120"
          >
            <template slot-scope="scope">
              <el-form-item style="width: 100%">
                <el-date-picker
                  v-if="!disabled"
                  v-model="scope.row.deliveryTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
                <div v-else>
                  {{
                    scope.row.deliveryTime
                      ? scope.row.deliveryTime.substring(0, 10)
                      : ""
                  }}
                </div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span> {{ $t("other.otherInfo") }}
      </p>
      <el-form-item :label="$t('other.attachments')">
        <upload
          :isHistory="isHistory"
          :fileList="form.fileList"
          :btnName="$t('other.upload')"
          @handleRequest="handleRequest"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form-item style="width: 98%" v-if="form.id">
        <div
          style="color: #409eff"
          @click="downWord"
          v-html="downModelTitle()"
        ></div>
      </el-form-item>
      <el-form-item :label="$t('other.remarks')" style="width: 96%">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <partDialog ref="partDialog" @getChooseList="getChooseList"></partDialog>
    <wordModelHardware
      v-show="false"
      :downModelTitle="downModelTitle()"
      :bomPurchaseContractForm="bomPurchaseContractForm"
      ref="wordModelRefHardware"
    ></wordModelHardware>
    <wordModelLicense
      v-show="false"
      :downModelTitle="downModelTitle()"
      :bomPurchaseContractForm="bomPurchaseContractForm"
      ref="wordModelRefLicense"
    ></wordModelLicense>
    <wordModelOther
      v-show="false"
      :downModelTitle="downModelTitle()"
      :bomPurchaseContractForm="bomPurchaseContractForm"
      ref="wordModelRefOther"
    ></wordModelOther>
  </basic-container>
</template>

<script>
import { mixinsAmount } from "@/mixins/amount";
import { getFormatDate, downBlobFile, getCurrentDateTime } from "@/util/util";
import { getDictionary } from "@/api/system/dict";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getContractSupplierList } from "@/api/contract/contractSupplier";
import wordModelHardware from "@/components/flow/wordModel/hardware.vue";
import wordModelOther from "@/components/flow/wordModel/other.vue";
import wordModelLicense from "@/components/flow/wordModel/license";
import upload from "@/components/upload/index";
import BomPurchaseContractApplyApi from "@/api/bomPurchaseContractApply/index";
import BomPurchaseOrderApplyApi from "@/api/bomPurchaseOrderApply/index";
import { getOptions } from "@/api/base";
import partDialog from "./partDialog";
import { mapGetters } from "vuex";
import { mixins } from "./purchaseMixins";
import elSelectTree from "@/components/elSelectTree/index";
import { getProjectList } from "@/api/contract/contractProject";
import { numberToTraditionalChinese } from "@/util/util";
import { validatenNum } from "@/util/validate";
import { getPartsMaintList } from "@/api/base/index";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import subjectManageApi from "@/api/subjectManage";
import { getPartsNoPrice } from "@/api/contract/partsMaint";

export default {
  components: {
    upload,
    elSelectTree,
    partDialog,
    wordModelHardware,
    wordModelOther,
    wordModelLicense,
  },
  mixins: [mixins, mixinsAmount],
  data() {
    return {
      isNeedPartNo: false,
      applyNo: null,
      partList: [],
      purchaseList: [],
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
      projectList: [],
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
      saleContractDetailMultipleSelection: [],
      receiveDetailMultipleSelection: [],
      custContactMultipleSelection: [],
      bomPurchaseContractList: [],
      isHistory: false,
      form: {
        titleName: null,
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        applyNo: null,
        currency: null,
        exchangeRate: null,
        applyDesc: null,
        contractEndTime: null,
        bomPurchaseContractNo: null,
        bomPurchaseContractType: null,
        purchaseAmountRmb: null,
        purchaseOrderType: null,
        bomPurchaseOrderDetailList: [
          {
            key: Date.now(),
            subjectId: null,
            costCenterId: null,
            projectNo: null,
            projectName: null,
            subjectName: null,
            costCenterName: null,
            subjectNo: null,
            budgetInfo: null,
            partsName: null,
            quantity: null,
            unitPrice: null,
            totalPriceOriginal: null,
          },
        ],
        fileList: [],
        totalAmountRmb: null,
        remark: null,
        totalAmountRmbUpper: null,
        totalAmountOriginal: null,
        totalAmountOriginalUpper: null,
      },
      bomPurchaseContractForm: {},
      rules: {
        titleName: [
          {
            required: true,
            message: this.$t("bom.pleaseEnterTitle"),
            trigger: "blur",
          },
        ],
        applyDesc: [
          {
            required: true,
            message: this.$t("bom.pleaseEnterReason"),
            trigger: "blur",
          },
        ],
        purchaseOrderType: [
          {
            required: true,
            message: this.$t("bom.purchaseOrderType"),
            trigger: "blur",
          },
        ],
        exchangeRate: [
          {
            required: true,
            message: this.$t("bom.pleaseEnterExchangeRate"),
            trigger: "blur",
          },
          { validator: validatenNum },
        ],
        bomPurchaseContractNo: [
          {
            required: true,
            message: this.$t("bom.pleaseSelectContract"),
            trigger: "change",
          },
        ],
        projectNo: [
          {
            required: true,
            message: this.$t("bom.pleaseSelectProject"),
            trigger: "change",
          },
        ],
        partsNo: [
          {
            required: false,
            message: this.$t("bom.pleaseSelectPartsNo"),
            trigger: "change",
          },
        ],
        costCenterName: [
          {
            required: true,
            message: this.$t("bom.pleaseSelectCostCenter"),
            trigger: "change",
          },
        ],
        subjectId: [
          {
            required: true,
            message: this.$t("bom.pleaseSelectSubject"),
            trigger: "change",
          },
        ],
        partsName: [
          {
            required: true,
            message: this.$t("bom.pleaseEnterProductName"),
            trigger: "blur",
          },
        ],
        quantity: [
          {
            required: true,
            message: this.$t("bom.pleaseEnterQuantity"),
            trigger: "blur",
          },
          { validator: validatenNum },
        ],
        unitPrice: [
          {
            required: true,
            message: this.$t("bom.pleaseEnterUnitPrice"),
            trigger: "blur",
          },
          { validator: validatenNum },
        ],
        totalPriceOriginal: [
          {
            required: true,
            message: this.$t("bom.pleaseEnterOrderAmount"),
            trigger: "blur",
          },
          { validator: validatenNum },
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
  watch: {
    isPdfDown() {},
  },
  mounted() {
    this.form.titleName =
      "BOM及框架采购合同订单" +
      " - " +
      (this.userInfo.nick_name ||
        this.userInfo.realName ||
        this.userInfo.user_name) +
      " - " +
      getFormatDate();
    this.businessId = this.$route.query.businessId;
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.form.applyPersonName =
      this.userInfo.nick_name ||
      this.userInfo.realName ||
      this.userInfo.user_name;
    this.form.applyDept = this.userInfo.dept_id;
    this.isEdit = this.$route.query.isEdit;
    this.applyNo = this.$route.query.applyNo;
    if (this.businessId || this.applyNo) {
      this.getDetail();
    }
    this.getPurchaseApplyList();
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
    this.getBomPurchaseContractList();
    this.getCountryRegion();
    this.getContractSupplierList();
    this.getContractProjectList();
    this.getPartList();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return (this.businessId || this.applyNo) && !this.isEdit;
    },
  },
  methods: {
    async getPartList() {
      let res = await getPartsMaintList();
      this.partList = res.data.data;
      this.partList.unshift({
        partsNo: "其他",
      });
    },
    //人民币金额合计----明细版本
    getRMBAmountToTalWithRow(
      listKey = "bomPurchaseOrderDetailList",
      amountKey = "totalPriceOriginal",
      formKey = "totalPriceRmb"
    ) {
     return (Number(this.getOriginalAmountToTal("bomPurchaseOrderDetailList"))*Number(this.form.exchangeRate)).toFixed(2)
    },
    async changePartPrice(row) {
      if (this.disabled) return;
      if (
        row.partsNo !== "其他" &&
        this.form.purchaseOrderType === "硬件PO订单"
      ) {
        let res = await getPartsNoPrice({ partsNo: row.partsNo });
        if (res.data.code === 200 || res.data.code === 0) {
          row.unitPrice = res.data.data;
        }
      }
    },
      //人民币金额合计----明细版本
    getRMBAmountToTalWithRow(
      listKey = "bomPurchaseOrderDetailList",
      amountKey = "totalPriceOriginal",
      formKey = "totalPriceRmb"
    ) {
     return (Number(this.getOriginalAmountToTal("bomPurchaseOrderDetailList"))*Number(this.form.exchangeRate)).toFixed(2)
    },
    async getRMB(num1, num2, row) {
      this.form.bomPurchaseOrderDetailList.forEach(async (ele, index) => {
        let newValue = ele;
        if (newValue.totalPriceOriginal && this.form.exchangeRate) {
          let res = await BomPurchaseOrderApplyApi.getMultiplicationMoney(
            newValue.totalPriceOriginal,
            this.form.exchangeRate
          );
          newValue.totalPriceRmb = res.data.data;
          newValue.totalPriceRmb = newValue.totalPriceRmb.toFixed(2)
        }
        this.$set(this.form.bomPurchaseOrderDetailList, index, newValue);
        this.$forceUpdate();
      });
    },
    renderHeader(h) {
      let title = h("div", [
        h("span", "零件号"),
        h("span", { style: { color: "red" } }, "*"),
      ]);
      let title1 = h("span", "零件号");
      return this.form.purchaseOrderType === "硬件PO订单" ? title : title1;
    },
    changeType() {
      if (this.form.purchaseOrderType === "硬件PO订单") {
        this.rules.partsNo[0].required = true;
      } else {
        this.rules.partsNo[0].required = false;
      }
      console.log(this.rules);
      console.log("222");
    },
    async getPurchaseApplyList() {
      let res = await PurchaseApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseList = res.data.data;
        // if (this.businessId || this.applyNo) {
        //   this.getPurchaseInfo()
        // }
      }
    },
    changePr() {
      this.form.purchaseId = null;
    },
    getPurchaseInfo() {
      let row = this.purchaseList.find((ele) => {
        return ele.id === this.form.purchaseId;
      });
      if (
        !row ||
        this.isStart ||
        ((this.businessId || this.applyNo) && !this.isEdit)
      )
        return;
      console.log(row);
      if (row) {
        this.form.currency = row.currency;
      }
      // this.form.purchaseApplyNo = row.applyNo
      // this.form.purchaseApplyTotalAmountOriginal = row.totalAmountOriginal
      // this.form.purchaseApplyTotalAmountRmb = row.totalAmountRmb

      this.getPurchaseApplyDetail();
    },
    async getPurchaseApplyDetail() {
      let res = await PurchaseApplyApi.details({
        businessId: this.form.purchaseId,
      });
      if (res.data.code === 200) {
        this.form.purchaseAmountRmb = res.data.data.totalAmountRmb;
        console.log(this.form.purchaseAmountRmb + "purchaseAmountRmb");
        this.form.bomPurchaseOrderDetailList = res.data.data.purchaseDetailList;
        this.form.bomPurchaseOrderDetailList.map((ele, index) => {
          this.getFeeDetail(ele, index);
          this.$set(ele, "subjectNo", ele.subjectCode);
        });
      }
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
          this.$set(this.form.bomPurchaseOrderDetailList, index, row);
        }
      }
    },
    async downloadFile() {
      let res = await BomPurchaseOrderApplyApi.exportBomOrderDetail();
      downBlobFile(res.data, "BOM及框架采购合同订单模板");
    },
    async getOriginal(row, index) {
      if (row.quantity && row.unitPrice) {
        let res = await BomPurchaseOrderApplyApi.getMultiplicationMoney(
          row.quantity,
          row.unitPrice
        );
        row.totalPriceOriginal = res.data.data;
        this.$set(this.form.bomPurchaseOrderDetailList, row, index);
        this.getRMB();
      }
    },
    downWord() {
      this.$nextTick(() => {
        if (this.form.purchaseOrderType === "硬件PO订单") {
          this.$refs.wordModelRefHardware.downModel(this.form.id);
        } else if (this.form.purchaseOrderType === "License") {
          this.$refs.wordModelRefLicense.downModel(this.form.id);
        } else if (
          this.form.purchaseOrderType === "服务类" ||
          !this.form.purchaseOrderType
        ) {
          this.$refs.wordModelRefOther.downModel(this.form.id);
        }
      });
    },
    getContractProjectList() {
      getProjectList().then((res) => {
        this.projectList = res.data.data;
      });
    },
    sum(arr) {
      return arr.reduce((acc, curr) => acc + curr, 0);
    },
    downModelTitle() {
      let arr = this.form.bomPurchaseOrderDetailList.map((ele) => ele.cycle);
      arr = Array.from(new Set(arr));
      let arrQuantity = this.form.bomPurchaseOrderDetailList.map((ele) =>
        Number(ele.quantity)
      );
      let sumNum = this.sum(arrQuantity);
      if (this.form.purchaseOrderType === "License") {
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        return `${year}年${arr.toString()}License采购订单`;
      }
      return `上汽海外出行科技有限公司和${this.form.supplierName}<br/>${
        this.form.purchaseOrderType === "硬件PO订单"
          ? `订单_${sumNum}台`
          : `${arr.toString()}`
      }_${this.form.applyDate}`;
    },
    getContractSupplierList() {
      getContractSupplierList({}).then((res) => {
        this.contractSupplierList = res.data.data;
      });
    },
    toPath() {
      if (this.form.bomPurchaseContractNo) {
        let url = `/bomPurchaseContractApplication?applyNo=${this.form.bomPurchaseContractNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    toPathApply() {
      if (this.form.purchaseId) {
        let url = `/purchaseApplication?businessId=${this.form.purchaseId}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    getProjectRow(row) {
      let obj = this.projectList.find((ele) => {
        return ele.projectNo === row.projectNo;
      });
      row.projectName = obj.projectName;
      this.form.bomPurchaseOrderDetailList.map((ele) => {
        ele.projectName = row.projectName;
        ele.projectNo = row.projectNo;
      });
    },
    getCountryRegion() {
      getOptions({
        code: "COUNTRY_REGIN",
      }).then((res) => {
        this.countryRegionList = res.data.data;
      });
    },
    chooseRow(row, index) {
      this.$refs.partDialog.dialogTableVisible = true;
      this.$refs.partDialog.getList(row, index);
    },
    getChooseList(arr, index) {
      let sums = null;
      const values = arr.map((item) => Number(item["stockOutNumber"]));
      if (!values.every((value) => isNaN(value))) {
        sums = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        sums += "";
      }
      this.form.bomPurchaseOrderDetailList[index].quantity = sums;
      console.log(sums + "sums");
    },
    async bomContractMoney() {
      let res = await BomPurchaseContractApplyApi.details(
        "",
        this.form.bomPurchaseContractNo
      );
      if (res.data.code === 0 || res.data.code === 200) {
        let ele = res.data.data;
        this.form.totalAmountOriginal = ele.totalAmountOriginal;
        this.form.totalAmountOriginalUpper = numberToTraditionalChinese(
          this.form.totalAmountOriginal
        );
        this.form.totalAmountRmb = ele.totalAmountRmb;
        this.form.totalAmountRmbUpper = numberToTraditionalChinese(
          this.form.totalAmountRmb
        );
        this.bomPurchaseContractForm.supplierName = ele.supplierName;
        this.bomPurchaseContractForm.payMethod =
          this.bomPurchaseContractForm.payMethod === "2"
            ? "转账"
            : this.bomPurchaseContractForm.payMethod === "1"
            ? "现金"
            : "";
      }
    },
    async bomPurchaseContractChange(val) {
      for (const ele of this.bomPurchaseContractList) {
        if (val == ele.applyNo) {
          console.log(ele);
          console.log("ele-->" + JSON.stringify(ele));
          this.form.bomPurchaseContractNo = ele.applyNo;
          this.form.bomPurchaseContractType = (
            ele.contractType || ""
          ).toString();
          this.form.currency = ele.currency;
          this.form.totalAmountOriginal = ele.totalAmountOriginal;
          this.form.totalAmountOriginalUpper = numberToTraditionalChinese(
            this.form.totalAmountOriginal
          );
          this.form.totalAmountRmb = ele.totalAmountRmb;
          this.form.totalAmountRmbUpper = numberToTraditionalChinese(
            this.form.totalAmountRmb
          );
          this.form.bomPurchaseContractName = ele.titleName;
        }
      }
    },
    handleRequest(data, list) {
      this.form.fileList = list;
    },
    handleRequestExport(data, list) {
      let arr = data;
      arr.map((ele, index) => {
        ele.deliveryTime = getCurrentDateTime(ele.deliveryTime);
        ele.key = new Date() + index;
        ele.costCenterName = null;
        ele.costCenterId = null;
        ele.subjectName = null;
        ele.subjectCode = null;
        ele.subjectNo = null;
        ele.subjectId = null;
        ele.avaliableFee = null;
        ele.costedFee = null;
        ele.underApprovalFee = null;
        ele.budgetInfo = null;
      });
      this.form.bomPurchaseOrderDetailList = arr;
    },
    dealQuantity(row) {
      if (!isNaN(row.quantity)) {
        row.quantity = Number(row.quantity).toFixed(2);
      }
    },
    async getBomPurchaseContractList() {
      let res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.bomPurchaseContractList = res.data.data;
      }
    },
    async getDetail() {
      let res = await BomPurchaseOrderApplyApi.details(
        this.businessId,
        this.applyNo
      );
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.applyPerson = (this.form.applyPerson || "").toString();
        this.form.bomPurchaseContractType = (
          this.form.bomPurchaseContractType || ""
        ).toString();
        this.form.bomPurchaseOrderDetailList.map((item, index) => {
          this.getFeeDetail(item, index);
          item.key = new Date() + index;
          // let budgetInfo = `可用预算:  ${item.availableBudget || 0.00}<br/><span style='color:blue'>已发生费用:  ${item.expensesIncurred || 0.00}</span><br/><span style='color:green'>审批中费用: ${item.expensesUnderReview || 0.00}</span>`
          // this.$set(item, 'budgetInfo', budgetInfo)
        });
        if (this.form.purchaseId) {
          let res = await PurchaseApplyApi.details({
            businessId: this.form.purchaseId,
          });
          if (res.data.code === 200) {
            this.form.purchaseAmountRmb = res.data.data.totalAmountRmb;
          }
        }
        if (this.form.bomPurchaseContractNo) {
          this.bomContractMoney(this.form.bomPurchaseContractNo);
        }
      }
      this.$emit("getFormData", this.form);
      this.isHistory = this.form.opinion || this.form.source;
    },
    groupedByCode() {
      console.log(this.form.bomPurchaseOrderDetailList);
      return this.form.bomPurchaseOrderDetailList.reduce((acc, item) => {
        acc[item.subjectNo + item.costCenterId] =
          acc[item.subjectNo + item.costCenterId] || [];
        acc[item.subjectNo + item.costCenterId].push(item);
        return acc;
      }, {});
    },
    testMoney() {
      let arrGroup = this.groupedByCode();
      // console.log(arrGroup)
      for (let key in arrGroup) {
        if (arrGroup[key].length > 0) {
          let avaliableFee = Number(
            arrGroup[key][0].avaliableFee || arrGroup[key][0].availableBudget
          );
          let arrMoney = arrGroup[key].map((ele) =>
            Number(ele.totalPriceOriginal)
          );
          let sum = arrMoney.reduce(function (previousValue, currentValue) {
            return (Number(previousValue) || 0) + (Number(currentValue) || 0);
          });
          sum = Number(sum).toFixed(2);
          if (Number(sum) > Number(avaliableFee)) {
            this.$message.error("可用预算不足");
            return false;
          }
        }
      }
      return true;
    },
    testForm() {
      if (!this.form.havePr && !this.testMoney()) {
        return;
      }
      this.form.totalAmountOriginal = this.getOriginalAmountToTal(
        "bomPurchaseOrderDetailList"
      );
      this.form.totalAmountRmb = this.getRMBAmountToTal(
        "bomPurchaseOrderDetailList"
      );
      this.form.orderTotalAmountOriginal = this.form.totalAmountOriginal;
      this.form.orderTotalAmountRmb = this.form.totalAmountRmb;
      for (let row of this.form.bomPurchaseOrderDetailList) {
        if (row.avaliableFee <= 0 && row.availableBudget <= 0) {
          this.$message.error("可用预算不足");
          return;
        }
      }
      console.log(this.form.purchaseAmountRmb + "purchaseAmountRmb");
      if (
        Number(this.form.totalAmountRmb) >
          Number(this.form.purchaseAmountRmb) &&
        this.form.havePr
      ) {
        this.$message.error("订单金额总和不得超过采购申请金额总和");
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
            // console.log("error submit!!");
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
      this.form.bomPurchaseOrderDetailList.push({
        key: Date.now(),
        subjectId:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].subjectId
            : "",
        costCenterId:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].costCenterId
            : "",
        projectNo:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].projectNo
            : "",
        projectName:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].projectName
            : "",
        subjectName:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].subjectName
            : "",
        costCenterName:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].costCenterName
            : "",
        subjectNo:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].subjectNo
            : "",
        budgetInfo:
          this.form.bomPurchaseOrderDetailList.length > 0
            ? this.form.bomPurchaseOrderDetailList[0].budgetInfo
            : "",
        partsName: null,
        quantity: null,
        unitPrice: null,
        totalPriceOriginal: null,
      });
    },
    deleteChooseRow() {
      if (this.custContactMultipleSelection.length === 0) {
        this.$message.error("请先选择订单明细");
        return;
      }
      let keys = this.custContactMultipleSelection.map((ele) => ele.key);
      let ids = this.custContactMultipleSelection.map((ele) => ele.id);
      this.form.bomPurchaseOrderDetailList =
        this.form.bomPurchaseOrderDetailList.filter((ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        });
    },
    copyChoose() {
      if (this.custContactMultipleSelection.length === 0) {
        this.$message.error("请先选择订单明细");
        return;
      }
      let arr = JSON.parse(JSON.stringify(this.custContactMultipleSelection));
      arr.map((ele, index) => {
        ele.key = Date.now() + index;
        this.form.bomPurchaseOrderDetailList.push(ele);
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
::v-deep ep .borderless-resizable,
.borderless-resizable .el-table__border-left-patch,
.borderless-resizable .el-table__border-right-patch,
.borderless-resizable .el-table__header-wrapper th,
.borderless-resizable .el-table__body-wrapper td {
  border: none !important;
}
::v-deep ep td{
   border: none !important;
}
.table-now {
}
</style>
