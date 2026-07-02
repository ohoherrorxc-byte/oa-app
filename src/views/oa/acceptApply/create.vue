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
      <el-form-item
        :label="$t('acceptApply.applyDesc')"
        style="width: 96%"
        prop="applyDesc"
      >
        <el-input type="textarea" autosize v-model="form.applyDesc"></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("acceptApply.contractInfo") }}
      </p>
      <el-form-item :label="$t('acceptApply.acceptType')" prop="acceptType">
        <el-select
          v-model="form.acceptType"
          clearable
          @change="changeAccpetType"
        >
          <el-option
            v-for="item in acceptTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.acceptCategory')"
        prop="acceptCategory"
      >
        <el-select v-model="form.acceptCategory" @change="getAcceptRow">
          <el-option
            v-for="item in acceptCategoryList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.acceptPerson')" prop="acceptPerson">
        <el-select v-model="form.acceptPerson" clearable filterable>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.purchaseApplyNo')"
        prop="purchaseApplyNo"
      >
        <div class="flex">
          <el-select
            v-model="form.purchaseApplyNo"
            clearable
            filterable
            @change="getPurchaseRow"
          >
            <el-option
              v-for="item in purchaseApplyList"
              :key="item.applyNo"
              :label="item.titleName"
              :value="item.applyNo"
            ></el-option>
          </el-select>
          <p @click="toPath" class="detailLink">
            {{ $t("commonContent.viewDetails") }}
          </p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.purchaseRequisitionNo')">
        <el-input disabled v-model="form.purchaseApplyNo" clearable></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.purchaseContractNo')"
        prop="purchaseContractNo"
        style="width: 96%"
      >
        <div class="flex">
          <el-select
            filterable
            v-model="form.purchaseContractNo"
            clearable
            :disabled="form.acceptCategory !== '1'"
            @change="getContractNormalRow"
          >
            <el-option
              v-for="item in purchaseContractList"
              :key="item.id"
              :label="item.titleName"
              :value="item.applyNo"
            ></el-option>
          </el-select>
          <p @click="toPathPurchaseContract" class="detailLink">
            {{ $t("commonContent.viewDetails") }}
          </p>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.bomPurchaseContractNo')"
        prop="bomPurchaseContractNo"
        style="width: 96%"
      >
        <div class="flex">
          <el-select
            filterable
            v-model="form.bomPurchaseContractNo"
            clearable
            :disabled="form.acceptCategory !== '2'"
            @change="getBomContractNormalRow"
          >
            <el-option
              v-for="item in bomPurchaseContractList"
              :key="item.id"
              :label="item.titleName"
              :value="item.applyNo"
            ></el-option>
          </el-select>
          <p @click="toPathBomPurchaseContract" class="detailLink">
            {{ $t("commonContent.viewDetails") }}
          </p>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.bomPurchaseOrderNo')"
        prop="bomPurchaseOrderNo"
        style="width: 96%"
      >
        <div class="flex">
          <el-select
            filterable
            @change="changeBomPurchaseOrder"
            v-model="form.bomPurchaseOrderNo"
            clearable
            :disabled="form.acceptCategory !== '2'"
          >
            <el-option
              v-for="item in bomPurchaseOrderList"
              :key="item.id"
              :label="item.titleName"
              :value="item.applyNo"
            ></el-option>
          </el-select>
          <p @click="toPathBomPurchaseOrder" class="detailLink">
            {{ $t("commonContent.viewDetails") }}
          </p>
        </div>
      </el-form-item>
      <el-form-item
        v-if="form.acceptCategory == '2'"
        :label="$t('acceptApply.orderTotalAmount')"
        >{{ form.orderTotalAmountOriginal }}</el-form-item
      >
      <el-form-item
        v-if="form.acceptCategory == '2'"
        :label="$t('acceptApply.orderAcceptAmount')"
        >{{ form.ordertAcceptAmountOriginal }}</el-form-item
      >
      <el-form-item
        v-if="form.acceptCategory == '2'"
        :label="$t('acceptApply.orderApprovalAcceptAmount')"
        >{{ form.ordertApprovalAcceptAmountOriginal }}</el-form-item
      >
      <el-form-item :label="$t('acceptApply.currency')">
        <el-select v-model="form.currency" clearable>
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.exchangeRate')" prop="exchangeRate">
        <el-input v-model="form.exchangeRate" clearable></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.acceptCategory === '2'"
        :label="$t('acceptApply.contractNo')"
        prop="bomPurchaseContractNo"
      >
        <el-input
          disabled
          v-model="form.bomPurchaseContractNo"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.relatedProject')"
        prop="projectNo"
        style="width: 96%"
      >
        <el-select
          v-model="form.projectNo"
          clearable
          filterable
          @change="getProjectRow"
        >
          <el-option
            v-for="item in projectList"
            :key="item.projectNo"
            :label="item.projectName"
            :value="item.projectNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.projectNo')"
        prop="projectNo"
        style="width: 96%"
      >
        <el-input v-model="form.projectNo" disabled clearable></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.acceptCategory !== '2'"
        :label="$t('acceptApply.contractNo')"
        prop="purchaseContractNo"
        style="width: 96%"
      >
        <el-input
          disabled
          v-model="form.purchaseContractNo"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.contractTotalAmountOriginal')">
        <el-input
          disabled
          v-model="form.contractTotalAmountOriginal"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.contractTotalAmountRmb')">
        <el-input
          disabled
          v-model="form.contractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.totalAcceptAmountOriginal')"
        prop=""
      >
        {{ form.totalAmountOriginal }}
      </el-form-item>
      <el-form-item :label="$t('acceptApply.totalAcceptAmountRmb')" prop="">
        {{ form.totalAmountRmb }}
      </el-form-item>
      <el-form-item :label="$t('acceptApply.currentApprovalAmount')" prop="">
        {{ form.acceptApprovalAmountOriginal }}
      </el-form-item>
      <el-form-item :label="$t('acceptApply.currentApprovalAmountRmb')" prop="">
        {{ form.acceptApprovalAmountRmb }}
      </el-form-item>
      <el-form-item :label="$t('acceptApply.currentAcceptAmount')" prop="">
        {{
          getAmountToTal("acceptApplyDetailList", "", "acceptAmountOriginal")
        }}
      </el-form-item>
      <el-form-item :label="$t('acceptApply.currentAcceptAmountRmb')" prop="">
        {{
          getRMBAmountToTalWithRow(
            "acceptApplyDetailList",
            "",
            "acceptAmountOriginal"
          )
        }}
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
      <p class="table-title">
        <span></span>{{ $t("acceptApply.acceptanceDetails") }}
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
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          :data="form.acceptApplyDetailList"
          @selection-change="saleContractDetailSelectChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="品名">
            <template slot="header">
              {{ $t("acceptApply.productName") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'acceptApplyDetailList.' + scope.$index + '.partsName'"
                :rules="rules.partsName"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.partsName"
                ></el-input>
                <div v-else>{{ scope.row.partsName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('acceptApply.technicalDetails')">
            <template slot="header">
              {{ $t("acceptApply.technicalDetails") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'acceptApplyDetailList.' + scope.$index + '.remark'"
                :rules="rules.remark"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.remark"
                ></el-input>
                <div v-else>{{ scope.row.remark }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="零件号">
            <!-- <template slot="header">
              {{ $t("acceptApply.unit") }}
              <span class="red">*</span>
            </template> -->
            <template slot-scope="scope">
              <el-form-item
                :prop="'acceptApplyDetailList.' + scope.$index + '.partsNo'"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.partsNo"
                ></el-input>
                <div v-else>{{ scope.row.partsNo }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="单位">
            <template slot="header">
              {{ $t("acceptApply.unit") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'acceptApplyDetailList.' + scope.$index + '.unitName'"
                :rules="rules.unitName"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.unitName"
                ></el-input>
                <div v-else>{{ scope.row.unitName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot="header">
              {{ $t("acceptApply.quantity") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'acceptApplyDetailList.' + scope.$index + '.quantity'"
                :rules="rules.quantity"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.quantity"
                ></el-input>
                <div v-else>{{ scope.row.quantity }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="验收金额(原币)">
            <template slot="header">
              {{ $t("acceptApply.acceptanceAmountOriginal") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'acceptApplyDetailList.' +
                  scope.$index +
                  '.totalPriceOriginal'
                "
                :rules="rules.totalPriceOriginal"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.totalPriceOriginal"
                ></el-input>
                <div v-else>{{ scope.row.totalPriceOriginal }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('acceptApply.acceptanceAmountRMB')">
            <template slot-scope="scope">
              <el-form-item>
                {{
                  getRMBAmount(
                    scope.row.totalPriceOriginal,
                    scope.row.totalPriceRmb,
                    scope
                  )
                }}
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("acceptApply.approvalInfo") }}
      </p>
      <el-form-item
        :label="$t('acceptApply.productPlatformManager')"
        prop=""
        label-width="200px"
        style="width: 90%"
      >
        <autoAddress
          v-if="!disabled"
          :multiple="false"
          :initData="devCheckId"
          :initList="form.devCheckList"
          class="w-100"
          ref="autoAddress1"
          @getPerson="getPersonProductCenter"
        ></autoAddress>
        <div v-else>
          {{
            form.devCheckList && form.devCheckList.length > 0
              ? form.devCheckList[0].realName
              : ""
          }}
        </div>
        <!-- <el-input v-else disabled>{{ form.devCheckList&&form.devCheckList.length>0?form.devCheckList[0].realName:'' }}</el-input> -->
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.systemManager')"
        prop=""
        label-width="200px"
        style="width: 90%"
      >
        <autoAddress
          v-if="!disabled"
          :multiple="false"
          :initData="sysCheckId"
          :initList="form.sysCheckList"
          class="w-100"
          ref="autoAddress2"
          @getPerson="getPersonSystem"
        ></autoAddress>
        <div v-else>
          {{
            form.sysCheckList && form.sysCheckList.length > 0
              ? form.sysCheckList[0].realName
              : ""
          }}
        </div>
        <!-- <el-input v-else disabled>{{ form.sysCheckList&&form.sysCheckList.length>0?form.sysCheckList[0].realName:'' }}</el-input> -->
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.testManager')"
        prop=""
        label-width="200px"
        style="width: 90%"
      >
        <autoAddress
          ref="autoAddress3"
          v-if="!disabled"
          :multiple="false"
          :initData="testCheckId"
          :initList="form.testCheckList"
          class="w-100"
          @getPerson="getPersonTest"
        ></autoAddress>
        <div v-else>
          {{
            form.testCheckList && form.testCheckList.length > 0
              ? form.testCheckList[0].realName
              : ""
          }}
        </div>
        <!-- <el-input v-else >{{ form.testCheckList&&form.testCheckList.length>0?form.testCheckList[0].realName:'' }}</el-input> -->
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.projectManager')"
        prop=""
        label-width="200px"
        style="width: 90%"
      >
        <autoAddress
          v-if="!disabled"
          :multiple="false"
          :initData="projectCheckId"
          :initList="form.projectCheckList"
          class="w-100"
          ref="autoAddress4"
          @getPerson="getPersonProject"
        ></autoAddress>
        <div v-else>
          {{
            form.projectCheckList && form.projectCheckList.length > 0
              ? form.projectCheckList[0].realName
              : ""
          }}
        </div>
        <!-- <el-input v-else disabled>{{ form.projectCheckList&&form.projectCheckList.length>0?form.projectCheckList[0].realName:'' }}</el-input> -->
      </el-form-item>
      <el-form-item
        :label="$t('acceptApply.productManager')"
        prop=""
        label-width="200px"
        style="width: 90%"
      >
        <autoAddress
          v-if="!disabled"
          :multiple="false"
          :initData="productCheckId"
          :initList="form.productCheckList"
          class="w-100"
          ref="autoAddress5"
          @getPerson="getPersonProduct"
        ></autoAddress>
        <div v-else>
          {{
            form.productCheckList && form.productCheckList.length > 0
              ? form.productCheckList[0].realName
              : ""
          }}
        </div>
        <!-- <el-input v-else disabled>{{ form.productCheckList&&form.productCheckList.length>0?form.productCheckList[0].realName:'' }}</el-input> -->
      </el-form-item>
      <div class="red font12" v-html="$t('acceptApply.instructions')"></div>
      <el-form-item
        prop="acceptFileList"
        v-if="form.acceptType"
        :label="
          form.acceptType === '1'
            ? $t('acceptApply.DeliveryFile')
            : $t('acceptApply.ServiceDeliverables')
        "
        label-width="100px"
        class="pt20"
      >
        <upload
          ref="uploadRef"
          :isHistory="isHistory"
          :fileList="form.acceptFileList"
          btnName="上传"
          @handleRequest="handleAcceptFileList"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { getFormatDate } from "@/util/util";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import AcceptApplyApi from "@/api/acceptApply/index";
import upload from "@/components/upload/index";
import PurchaseContractApplyApi from "@/api/purchaseContractApply/index";
import BomPurchaseContractApplyApi from "@/api/bomPurchaseContractApply/index";
import BomPurchaseOrderApplyApi from "@/api/bomPurchaseOrderApply/index";
import { getDictionary } from "@/api/system/dict";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getProjectList } from "@/api/contract/contractProject";
import { mapGetters } from "vuex";
import { mixins } from "./purchaseMixins";
import { numberToTraditionalChinese } from "@/util/util";
import { validatenNum } from "@/util/validate";
import autoAddress from "@/components/autoAddress/index";
export default {
  mixins: [mixins],
  components: {
    autoAddress,
    upload,
  },
  data() {
    return {
      orderMoney: "",
      currencyList: [],
      acceptTypeList: [],
      acceptCategoryList: [],
      salesContractTypeList: [],
      salesContractCategoryList: [],
      countryRegionList: [],
      deptList: [],
      userList: [],
      projectList: [],
      purchaseApplyList: [],
      purchaseContractList: [],
      bomPurchaseContractList: [],
      bomPurchaseOrderList: [],
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
      devCheckId: [],
      sysCheckId: [],
      testCheckId: [],
      projectCheckId: [],
      productCheckId: [],
      form: {
        acceptFileList: [],
        titleName: null,
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        applyNo: null,
        applyDesc: null,
        acceptType: null,
        acceptCategory: null,
        projectNo: null,
        acceptPerson: null,
        purchaseApplyNo: null,
        bomPurchaseContractNo: null,
        bomPurchaseOrderNo: null,
        contractTotalAmountRmb: null,
        currency: null,
        contractTotalAmountOriginal: null,
        totalAmountOriginal: null,
        totalAmountRmb: null,
        acceptApprovalAmountOriginal: null,
        acceptApprovalAmountRmb: null,
        acceptApplyDetailList: [
          {
            key: Date.now(),
            partsName: null,
            remark: null,
            unitName: null,
            quantity: null,
            partsNo:null
          },
        ],
        exchangeRate: null,
        purchaseContractNo: "",
        totalAmountRmb: null,
        contractTotalAmountOriginal: null,
        contractTotalAmountRmb: null,
        acceptApprovalAmountOriginal: null,
        acceptApprovalAmountRmb: null,
        devCheckList: [], //产品中台及开发组审批负责人
        sysCheckList: [], //系统组审批负责人
        testCheckList: [], //测试组审批负责人
        projectCheckList: [], //项目组审批负责人
        productCheckList: [], //产品组审批负责人
        ordertAcceptAmountOriginal: null, //订单验收金额合计(原币)
        orderAcceptAmountRmb: null, //订单验收金额合计(RMB)
        ordertApprovalAcceptAmountOriginal: null, //订单审核验收金额合计(原币)
        orderApprovalAcceptAmountRmb: null, //订单审核验收金额合计(RMB)
        orderTotalAmountOriginal: null, //订单审核验收金额合计(原币)
        orderTotalAmountRmb: null, //订单总金额(RMB)
        contractSame: null, //和合同是否一致
        contractSpecial: null, //和合同是否有特殊约定
        isBalancePay: null, //是否尾款
      },
      variables: {
        acceptApplyPass1: 0, //产品组负责人
        acceptApplyPass2: 0, //项目组负责人
        acceptApplyPass3: 0, //产品中台及开发组
        acceptApplyPass4: 0, //系统组
        acceptApplyPass5: 0, //测试组
      },
      rules: {
        titleName: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterTitle"),
            trigger: "blur",
          },
        ],
        applyDesc: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterReason"),
            trigger: "blur",
          },
        ],
        acceptFileList: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseAcceptFileList"),
            trigger: "change",
          },
        ],
        projectNo: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseSelectProject"),
            trigger: "change",
          },
        ],
        currency: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterCurrency"),
            trigger: "blur",
          },
        ],
        exchangeRate: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterExchangeRate"),
            trigger: "blur",
          },
          { validator: validatenNum },
        ],
        acceptType: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseSelectAcceptType1"),
            trigger: "change",
          },
        ],
        acceptCategory: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseSelectAcceptType"),
            trigger: "change",
          },
        ],
        projectId: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseSelectProject"),
            trigger: "change",
          },
        ],
        acceptPerson: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseSelectAcceptor"),
            trigger: "change",
          },
        ],
        purchaseContractCategory: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseSelectContractCategory"),
            trigger: "change",
          },
        ],
        purchaseContractNo: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterGeneralContract"),
            trigger: "change",
          },
        ],
        bomPurchaseContractNo: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseSelectBOMContract"),
            trigger: "change",
          },
        ],
        bomPurchaseOrderNo: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterBOMOrder"),
            trigger: "change",
          },
        ],
        partsName: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterPartsName"),
            trigger: "change",
          },
        ],
        remark: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterTechDetails"),
            trigger: "change",
          },
        ],
        unitName: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterUnit"),
            trigger: "change",
          },
        ],
        quantity: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterQuantity"),
            trigger: "blur",
          },
          { validator: validatenNum },
        ],
        totalPriceOriginal: [
          {
            required: true,
            message: this.$t("acceptApply.pleaseEnterOriginalAmount"),
            trigger: "blur",
          },
          { validator: validatenNum },
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
        isBalancePay: [
          {
            required: true,
            message: "请选择是否尾款",
            trigger: "change",
          },
        ],
      },
      textHint:
        "说明：<br/>1.产品中台及开发组：验收申请提交人所属部门负责人审批后，流转至产品中台及开发组填写代码量，详细填写样式如下：（若不勾选，则不流转）<br/>2.系统组：验收申请人所属部门负责人完成审批，产品中台及开发组提交代码后（若勾选该工作），流转至系统组填写代码量，详细填写样式如下：（若不勾选，则不流转）</br>3.测试组：验收申请人所属部门负责人完成审批，系统组提交代码后（若勾选该工作），流转至测试组提交测试报告，详细样式如下：（若不勾选，则不流转）</br>4.项目组：验收申请人所属部门负责人完成审批，测试组提交验证后（若勾选该工作），流转至项目组，详细样式如下：（若不勾选，则不流转）",
    };
  },
  props: {
    isPdfDown: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.form.applyDept = this.userInfo.dept_id;
    this.form.titleName =
      "验收申请单" +
      " - " +
      (this.userInfo.nick_name ||
        this.userInfo.realName ||
        this.userInfo.user_name) +
      " - " +
      getFormatDate();
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "acceptType" }, "acceptType");
    this.getDictionary({ code: "acceptCategory" }, "acceptCategory");
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
    this.getContractProjectList();
    this.getPurchaseApplyList();
    this.getPurchaseContractList();
    this.getBomPurchaseContractList();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getBomPurchaseOrderList() {
      if (!this.form.bomPurchaseContractNo) return;
      let res = await BomPurchaseOrderApplyApi.selectList({
        bomPurchaseContractNo: this.form.bomPurchaseContractNo,
      });
      if (res.data.code === 0) {
        this.bomPurchaseOrderList = res.data.data;
      }
    },
    handleAcceptFileList(data, arr) {
      arr.map((ele) => {
        ele.businessName = "acceptFileDeliver";
      });
      this.form.acceptFileList = arr;
      this.$refs.form.clearValidate();
    },
    getRMBAmount(money, moneyRmb, scope) {
      if (moneyRmb && this.disabled) {
        return moneyRmb;
      }
      if (!money) return;
      if (scope) {
        scope.row.totalPriceRmb = (
          Number(money) * (this.form.exchangeRate || 1)
        ).toFixed(2);
      }
      return (Number(money) * (this.form.exchangeRate || 1)).toFixed(2);
    },
    getAmountToTal() {
      if (
        !this.form["acceptApplyDetailList"] ||
        this.form["acceptApplyDetailList"].length === 0
      )
        return;
      let arr = this.form["acceptApplyDetailList"].map(
        (ele) => ele["totalPriceOriginal"]
      );
      this.form["acceptAmountOriginal"] = arr.reduce(function (
        prev,
        curr,
        idx,
        arr
      ) {
        return Number(prev || 0) + Number(curr || 0);
      });
      if (!isNaN(this.form["acceptAmountOriginal"])) {
        return Number(this.form["acceptAmountOriginal"]).toFixed(2);
      }
    },
    getRMBAmountToTal() {
      if (
        !this.form["acceptApplyDetailList"] ||
        this.form["acceptApplyDetailList"].length === 0
      )
        return;
      let arr = this.form["acceptApplyDetailList"].map(
        (ele) => ele["totalPriceOriginal"]
      );
      var sum = arr.reduce(function (prev, curr, idx, arr) {
        return Number(prev || 0) + Number(curr || 0);
      });
      if (sum && this.form.exchangeRate) {
        this.form["acceptAmountRmb"] = Number(
          sum * (this.form.exchangeRate || 1)
        ).toFixed(2);
      }
      if (!isNaN(sum)) {
        return this.form["acceptAmountRmb"];
      }
    },
    getRMBAmountToTalWithRow() {
      let original = this.getAmountToTal("acceptApplyDetailList", "", "acceptAmountOriginal")
      let num = (Number(original)*Number(this.form.exchangeRate)).toFixed(2)
      this.form["acceptAmountRmb"] = num
      return num
      // if (
      //   !this.form["acceptApplyDetailList"] ||
      //   this.form["acceptApplyDetailList"].length === 0
      // )
      //   return;
      // let arr = this.form["acceptApplyDetailList"].map(
      //   (ele) => ele["totalPriceRmb"]
      // );
      // var sum = arr.reduce(function (prev, curr, idx, arr) {
      //   return Number(prev || 0) + Number(curr || 0);
      // });
      // if (!isNaN(sum)) {
      //   this.form.acceptAmountRmb = Number(sum).toFixed(2);
      //   return Number(sum).toFixed(2);
      // }
    },
    getRMBAmountToTalChineseWithRow() {
      this.form.acceptAmountRmb = numberToTraditionalChinese(
        this.form.acceptAmountOriginal || 0
      );
      return numberToTraditionalChinese(this.form.acceptAmountOriginal || 0);
    },
    //人民币金额合计大写
    getRMBAmountToTalChinese() {
      this.form.acceptAmountRmb = numberToTraditionalChinese(
        this.form.acceptAmountOriginal || 0
      );
      return numberToTraditionalChinese(this.form.acceptAmountOriginal || 0);
    },
    getAcceptRow() {
      this.rules.projectId[0].required =
        this.form.acceptCategory !== "3" ? true : false;
      this.rules.purchaseContractNo[0].required =
        this.form.acceptCategory === "1" ? true : false;
      this.rules.bomPurchaseContractNo[0].required =
        this.form.acceptCategory === "2" ? true : false;
      this.rules.bomPurchaseOrderNo[0].required =
        this.form.acceptCategory === "2" ? true : false;
      this.rules.currency[0].required =
        this.form.acceptCategory === "3" ? true : false;
      // 一般合同类型(isBalancePay必填)
      this.rules.isBalancePay[0].required =
        this.form.acceptCategory === "1" ? true : false;
      if (this.form.acceptCategory === "1") {
        this.form.bomPurchaseContractNo = "";
        this.form.bomPurchaseOrderNo = "";
      } else if (this.form.acceptCategory === "2") {
        this.form.purchaseContractNo = "";
      } else {
        // 其他类型清空必填字段
        this.form.contractSame = null;
        this.form.contractSpecial = null;
        this.form.isBalancePay = null;
      }
      this.form.contractTotalAmountOriginal = null;
      this.form.contractTotalAmountRmb = null;
      this.form.totalAmountOriginal = null;
      this.form.totalAmountRmb = null;
      this.orderMoney = null;
      this.form.acceptApprovalAmountOriginal = null;
      this.form.acceptApprovalAmountRmb = null;
    },
    changeAccpetType(v) {
      this.rules.acceptFileList[0].message =
        this.form.acceptType === "1"
          ? this.$t("acceptApply.pleaseAcceptFileList")
          : this.$t("acceptApply.pleaseServiceDeliverables");
    },
    toPath() {
      if (this.form.purchaseApplyNo) {
        let url = `/purchaseApplication?purchaseApplyNo=${this.form.purchaseApplyNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    toPathPurchaseContract() {
      if (this.form.purchaseContractNo) {
        let url = `/purchaseContractApplication?applyNo=${this.form.purchaseContractNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    getPersonProductCenter(data) {
      if (data) {
        this.form.devCheckList = [
          {
            id: data.id,
            realName: data.realName,
            userId: data.id,
            userName: data.realName,
          },
        ];
        this.devCheckId = data.id;
      } else {
        this.form.devCheckList = [];
        this.devCheckId = null;
      }
    },
    getPersonSystem(data) {
      this.form.sysCheckList = !data
        ? []
        : [
            {
              id: data.id,
              realName: data.realName,
              userId: data.id,
              userName: data.realName,
            },
          ];
      this.sysCheckId = !data ? null : data.id;
    },
    getPersonTest(data) {
      this.form.testCheckList = !data
        ? []
        : [
            {
              id: data.id,
              realName: data.realName,
              userId: data.id,
              userName: data.realName,
            },
          ];
      this.testCheckId = !data ? null : data.id;
    },
    getPersonProject(data) {
      this.form.projectCheckList = !data
        ? []
        : [
            {
              id: data.id,
              realName: data.realName,
              userId: data.id,
              userName: data.realName,
            },
          ];
      this.projectCheckId = !data ? null : data.id;
    },
    getPersonProduct(data) {
      this.form.productCheckList = !data
        ? []
        : [
            {
              id: data.id,
              realName: data.realName,
              userId: data.id,
              userName: data.realName,
            },
          ];
      this.productCheckId = !data ? null : data.id;
    },
    toPathBomPurchaseContract() {
      if (this.form.bomPurchaseContractNo) {
        let url = `/bomPurchaseContractApplication?applyNo=${this.form.bomPurchaseContractNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    toPathBomPurchaseOrder() {
      if (this.form.bomPurchaseOrderNo) {
        let url = `/bomPurchaseOrderApplication?applyNo=${this.form.bomPurchaseOrderNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
    },
    getProjectRow() {},
    getPurchaseRow() {},
    getContractNormalRow() {
      let row = this.purchaseContractList.find((ele) => {
        return ele.applyNo === this.form.purchaseContractNo;
      });
      if (row) {
        this.form.currency = row.currency;
        this.form.exchangeRate = row.exchangeRate;
      }
      this.getContractNormalMoney();
    },
    async getContractNormalMoney(isDetail) {
      if (!this.form.purchaseContractNo) return;
      let res = await PurchaseContractApplyApi.details(
        "",
        this.form.purchaseContractNo
      );
      if (res.data.code === 0 || res.data.code === 200) {
        this.form.contractTotalAmountOriginal =
          res.data.data.totalAmountOriginal;
        this.form.contractTotalAmountRmb = res.data.data.totalAmountRmb;
        this.form.totalAmountOriginal = res.data.data.acceptTotalAmountOriginal;
        this.form.totalAmountRmb = res.data.data.acceptTotalAmountRmb || null;
        this.form.acceptApprovalAmountOriginal =
          res.data.data.acceptApprovalAmountOriginal;
        this.form.acceptApprovalAmountRmb =
          res.data.data.acceptApprovalTotalAmountRmb;
        this.form.projectName = res.data.data.projectName;
        this.form.projectNo = res.data.data.projectNo;
        let arr = res.data.data.purchaseDetailList;
        if (isDetail) {
          return;
        }
        this.form.acceptApplyDetailList = [];
        arr.map((ele, index) => {
          this.form.acceptApplyDetailList.push({
            partsName: ele.partsName,
            remark: ele.remark,
            unitName: ele.unitName,
            quantity: ele.quantity,
            partsNo:ele.partsNo,
            totalPriceOriginal: ele.totalPriceOriginal,
            totalPriceRmb: ele.totalPriceRmb,
            key: Date.now() + index,
            id: ele.id,
          });
        });
      }
    },
    getBomContractNormalRow() {
      let row = this.bomPurchaseContractList.find((ele) => {
        return ele.applyNo === this.form.bomPurchaseContractNo;
      });
      if (row) {
        this.form.bomPurchaseContractName = row.titleName;
        this.form.bomPurchaseOrderNo = null;
      }
      this.getBomPurchaseOrderList();
      this.getMoneyDetail();
    },
    async getMoneyDetail() {
      if (!this.form.bomPurchaseContractNo) return;
      let res = await BomPurchaseContractApplyApi.details(
        "",
        this.form.bomPurchaseContractNo
      );
      if (res.data.code === 200 || res.data.code === 0) {
        this.form.contractTotalAmountOriginal =
          res.data.data.totalAmountOriginal;
        this.form.contractTotalAmountRmb = res.data.data.totalAmountRmb;
        this.form.totalAmountOriginal = res.data.data.acceptTotalAmountOriginal;
        this.form.totalAmountRmb = res.data.data.acceptTotalAmountRmb || null;
        this.form.acceptApprovalAmountOriginal =
          res.data.data.acceptApprovalAmountOriginal;
        this.form.acceptApprovalAmountRmb =
          res.data.data.acceptApprovalTotalAmountRmb;
      }
    },
    changeBomPurchaseOrder(v,key) {
      console.log(v);
      console.log('ddddd')
      let row = this.bomPurchaseOrderList.find((ele) => {
        return ele.applyNo === v;
      });
      console.log(row);
      if (!row) return;
      this.form.currency = row.currency;
      this.form.exchangeRate = row.exchangeRate;
      this.form.bomPurchaseOrderName = row.titleName;
      if (row.customsDeclarationNo) {
        this.getDeliverFile(row.customsDeclarationNo);
      }
      if(key=="isDetail")return
      this.getOrderMoney();
    },
    async getDeliverFile(customsDeclarationNo) {
      let res = await BomPurchaseOrderApplyApi.getDeliverFile(
        customsDeclarationNo
      );
      if (res.data.code === 200 || res.data.code === 0) {
        this.form.acceptFileList = res.data.data;
      }
    },
    async getOrderMoney(isDetail) {
      if (!this.form.bomPurchaseOrderNo) return;
      let res = await BomPurchaseOrderApplyApi.details(
        "",
        this.form.bomPurchaseOrderNo
      );
      if (res.data.code === 0 || res.data.code === 200) {
        this.form.orderTotalAmountOriginal =
          res.data.data.orderTotalAmountOriginal;
        this.form.ordertApprovalAcceptAmountOriginal =
          res.data.data.acceptApprovalAmountOriginal;
        this.form.ordertAcceptAmountOriginal =
          res.data.data.acceptTotalAmountOriginal;
        let arr = res.data.data.bomPurchaseOrderDetailList;
        this.form.projectName = res.data.data.projectName;
        this.form.projectNo = res.data.data.projectNo;
        if (isDetail) {
          return;
        }
        console.log('tttt')
        this.form.acceptApplyDetailList = [];
        arr.map((ele, index) => {
          this.form.acceptApplyDetailList.push({
            partsName: ele.partsName,
            remark: ele.partsName,
            unitName: "批次",
            quantity: ele.quantity,
            partsNo:ele.partsNo,
            totalPriceOriginal: ele.totalPriceOriginal,
            totalPriceRmb: ele.totalPriceRmb,
            key: Date.now() + index,
            id: ele.id,
          });
        });
      }
    },
    async getBomPurchaseContractList() {
      let res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.bomPurchaseContractList = res.data.data;
      }
    },
    async getPurchaseContractList() {
      let res = await PurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.purchaseContractList = res.data.data;
      }
    },
    async getPurchaseApplyList() {
      let res = await PurchaseApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseApplyList = res.data.data;
      }
    },
    async getDetail() {
      let res = await AcceptApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.acceptCategory = this.form.acceptCategory
          ? this.form.acceptCategory.toString()
          : "";
        this.form.acceptType = this.form.acceptType
          ? this.form.acceptType.toString()
          : null;
        this.form.applyPerson = this.form.applyPerson
          ? this.form.applyPerson.toString()
          : null;
        this.form.acceptPerson = this.form.acceptPerson
          ? this.form.acceptPerson.toString()
          : null;
        this.form.acceptApplyDetailList.map((ele, index) => {
          ele.key = new Date() + index;
          ele.budgetInfo = `可用预算:  ${
            ele.avaliableFee || 0.0
          }<br/><span style='color:blue'>已发生费用:  ${
            ele.costedFee || 0.0
          }</span><br/><span style='color:green'>审批中费用: ${
            ele.underApprovalFee || 0.0
          }</span>`;
        });
        await this.getBomPurchaseOrderList();
        this.getAcceptRow();
        this.getOrderMoney("isDetail");
        this.getMoneyDetail();
        this.getContractNormalMoney("isDetail");
        this.projectCheckId = this.form.projectCheckId
          ? this.form.projectCheckId.toString()
          : "";
        this.testCheckId = this.form.testCheckId
          ? this.form.testCheckId.toString()
          : "";
        this.sysCheckId = this.form.sysCheckId
          ? this.form.sysCheckId.toString()
          : "";
        this.devCheckId = this.form.devCheckId
          ? this.form.devCheckId.toString()
          : "";
        this.productCheckId = this.form.productCheckId
          ? this.form.productCheckId.toString()
          : "";
        this.$emit("getFormData", this.form);
        this.dealFlowPerson();
        if (this.$route.query.isEdit) {
          this.changeBomPurchaseOrder(this.form.bomPurchaseOrderNo,"isDetail");
        }
        this.$refs.uploadRef.fileListFn(this.form.acceptFileList)
      }
    },
    dealFlowPerson() {
      this.variables = {
        acceptApplyPass1: !this.form.productCheckId ? 0 : 1,
        acceptApplyPass2: !this.form.projectCheckId ? 0 : 1,
        acceptApplyPass3: !this.form.devCheckId ? 0 : 1,
        acceptApplyPass4: !this.form.sysCheckId ? 0 : 1,
        acceptApplyPass5: !this.form.testCheckId ? 0 : 1,
      };
    },
    testBomMoney() {
      if (!this.form.orderTotalAmountOriginal) {
        this.$message.error("订单总金额为空，请检查数据");
        return false;
      }
      this.form["acceptAmountOriginal"] = Number(
        this.form.acceptAmountOriginal
      ).toFixed(2);
      this.form.orderTotalAmountOriginal = Number(
        this.form.orderTotalAmountOriginal
      ).toFixed(2);
      if (
        Number(this.form.acceptAmountOriginal) >
        Number(this.form.orderTotalAmountOriginal)
      ) {
        this.$message.error("本次验收金额合计不得大于BOM订单总金额");
        return false;
      }
      let sum1 = (
        Number(this.form.ordertAcceptAmountOriginal || 0) +
        Number(this.form.ordertApprovalAcceptAmountOriginal || 0) +
        Number(this.form.acceptAmountOriginal || 0)
      ).toFixed(2);
      sum1 = Number(sum1).toFixed(2);
      if (Number(this.form.orderTotalAmountOriginal) < Number(sum1)) {
        this.$message.error(
          "BOM订单已验收金额（已归档）、BOM订单审批中验收金额、本次验收金额合计(原币)数量之和不得大于BOM订单总金额"
        );
        return false;
      }
      console.log(sum1);
      console.log(this.form.orderTotalAmountOriginal);
      return true;
    },
    testMoney() {
      let sum2 = (
        Number(this.form.totalAmountOriginal || 0) +
        Number(this.form.acceptApprovalAmountOriginal || 0) +
        Number(this.form.acceptAmountOriginal || 0)
      ).toFixed(2);
      if (Number(this.form.contractTotalAmountOriginal) < Number(sum2)) {
        this.$message.error(
          "累计合同验收金额(原币)已归档、当前审批中验收金额、本次验收金额合计(原币)数量之和不得大于合同总金额（原币）"
        );
        return false;
      }
      console.log(this.form.contractTotalAmountOriginal);
      console.log(sum2);
      if (this.form.acceptCategory === "2") {
        return this.testBomMoney();
      } else if (this.form.acceptCategory === "1") {
      }
      return true;
    },
    testForm() {
      if (!this.testMoney()) return;
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
            return false;
          }
        });
      });
    },
    getDictionary(params, type) {
      getDictionary(params).then((res) => {
        if (type === "currency") {
          this.currencyList = res.data.data;
        } else if (type === "acceptType") {
          this.acceptTypeList = res.data.data;
        } else if (type === "acceptCategory") {
          this.acceptCategoryList = res.data.data;
        }
      });
    },
    getDeptList() {
      getLazyList(this.parentId, this.tenantId).then((res) => {
        this.deptList = res.data.data;
      });
    },
    getUserList() {
      // 走 vuex action，与 5 个 autoAddress 共享同一个全量用户列表缓存
      this.$store.dispatch('GetUserAllList').then(list => {
        this.userList = list;
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
      this.form.acceptApplyDetailList.push({
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
      this.form.acceptApplyDetailList = this.form.acceptApplyDetailList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
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
        this.form.acceptApplyDetailList.push(ele);
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
.table-now {
  // width: 100%;
  width: 700px;
}

.w-100 {
  width: 100%;
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

.red {
  color: red;
}

.font12 {
  font-size: 12px;
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
  .el-form-item {
    width: 100%;
  }
}
</style>
