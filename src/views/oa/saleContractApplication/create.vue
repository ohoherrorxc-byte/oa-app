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
      <el-form-item :label="$t('acceptApply.currency')" prop="currency">
        <el-select v-model="form.currency" clearable>
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.taxRate')" prop="taxRate">
        <el-input v-model="form.taxRate" clearable @change="changeRate">
          <template slot="append">%</template></el-input
        >
      </el-form-item>
      <el-form-item
        :label="$t('saleContract.originalAmount')"
        prop="salesContractTotalAmountOriginal"
      >
        <el-input
          v-model="form.salesContractTotalAmountOriginal"
          clearable
          @input="changeAmount"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('saleContract.rmbAmount')"
        prop="salesContractTotalAmountRmb"
      >
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('saleContract.applyDesc')"
        style="width: 96%"
        prop="applyDesc"
      >
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("acceptApply.contractInfo") }}
      </p>
      <!-- 销售类型是NRE和孵化的时候计算合同金额，刘亿 -->
      <el-form-item :label="$t('saleContract.salesType')" prop="salesType">
        <el-select v-model="form.salesType" clearable @change="getAmount">
          <el-option
            v-for="item in saleTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('saleContract.exchangeRate')"
        prop="exchangeRate"
      >
        <el-input
          v-model="form.exchangeRate"
          clearable
          @input="changeAmount"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('saleContract.customerName')" prop="custId">
        <el-select v-model="form.custId" @change="custChange" clearable>
          <el-option
            v-for="item in custList"
            :value="item.id"
            :key="item.id"
            :label="item.custName"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="$t('saleContract.contractAmount')" prop="salesContractTotalAmountOriginal">
        <el-input v-model="form.salesContractTotalAmountOriginal" clearable></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('saleContract.startDate')" prop="startDate">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.startDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('saleContract.endDate')" prop="endDate">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.endDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('saleContract.implementDate')"
        prop="implementTime"
        style="width: 96%"
      >
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.implementTime"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('saleContract.signDepts')" prop="deptIds">
        <el-select v-model="form.deptIds" multiple filterable>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.relatedProject')" prop="projectId">
        <el-select v-model="form.projectId" clearable filterable>
          <el-option
            v-for="item in projectList"
            :value="item.id"
            :key="item.id"
            :label="item.projectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('saleContract.contractType')"
        prop="salesContractType"
      >
        <el-select v-model="form.salesContractType" clearable>
          <el-option
            v-for="item in salesContractTypeList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('saleContract.contractCategory')"
        prop="salesContractCategory"
      >
        <el-select v-model="form.salesContractCategory" clearable>
          <el-option
            v-for="item in salesContractCategoryList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.paymentMethod')" prop="payMethod">
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
        :label="$t('saleContract.performancePlace')"
        prop="contractPerformPlace"
        style="width: 95%"
      >
        <el-input v-model="form.contractPerformPlace" clearable></el-input>
      </el-form-item>
      <p class="table-title">
        <span></span>{{ $t("saleContract.contractDetails") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr mb10 flex-center" v-if="!disabled">
          <div class="add-icon" @click="addSaleContractDetailRow">+</div>
          <div class="dec-icon" @click="deleteSaleContractDetailRow">―</div>
          <!-- <img
            @click="copyChoose"
            class="mt3"
            src="@/assets/svg/copy.svg"
            width="24"
            alt=""
          /> -->
          <el-button @click="downloadFile">{{
            $t("bom.downloadTemplate")
          }}</el-button>
          <upload
            @handleRequest="handleRequestExport"
            :showTip="false"
            class="mx10"
            url="/api/oa-flow/sale/contract/getSaleContractDetailByFile"
          ></upload>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.salesContractDetailNewList"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          @selection-change="saleContractDetailSelectChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="品名" :width="isPdfDown ? 120 : ''">
            <template slot="header">
              {{ $t("saleContract.productName") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'salesContractDetailNewList.' + scope.$index + '.partsName'
                "
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
          <el-table-column label="详述及技术性能">
            <template slot="header">
              {{ $t("saleContract.technicalDetails") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'salesContractDetailNewList.' + scope.$index + '.partsDetail'
                "
                :rules="rules.partsDetail"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.partsDetail"
                ></el-input>
                <div v-else>{{ scope.row.partsDetail }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="单位" :width="isPdfDown ? 80 : 100">
            <template slot="header">
              {{ $t("saleContract.unit") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'salesContractDetailNewList.' + scope.$index + '.unitName'
                "
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
          <el-table-column label="单价（原币）" :width="isPdfDown ? 80 : 120">
            <template slot="header">
              {{ $t("saleContract.unitPrice") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'salesContractDetailNewList.' + scope.$index + '.unitPrice'
                "
                :rules="rules.unitPrice"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.unitPrice"
                  @change="getSalePriceRow(scope.row)"
                ></el-input>
                <div v-else>{{ scope.row.unitPrice }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量" :width="isPdfDown ? 70 : 120">
            <template slot="header">
              {{ $t("saleContract.quantity") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="'salesContractDetailNewList.' + scope.$index + '.number'"
                :rules="rules.number"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.number"
                  @change="getSalePriceRow(scope.row)"
                ></el-input>
                <div v-else>{{ scope.row.number }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="是否含税" :width="isPdfDown ? 90 : 120">
            <template slot="header">
              {{ $t("saleContract.includeTax") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'salesContractDetailNewList.' + scope.$index + '.includeTax'
                "
                :rules="rules.includeTax"
              >
                <el-select
                  v-if="!disabled"
                  v-model="scope.row.includeTax"
                  clearable
                >
                  <el-option
                    v-for="item in includeTaxList"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
                <div v-else>{{ scope.row.includeTax ? "是" : "否" }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格（原币）"
            :width="isPdfDown ? 80 : 120"
          >
            <template slot="header">
              {{ $t("saleContract.salesPrice") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'salesContractDetailNewList.' + scope.$index + '.salesPrice'
                "
                :rules="rules.salesPrice"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.salesPrice"
                  @change="getAmount"
                ></el-input>
                <div v-else>{{ scope.row.salesPrice }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格（RMB）"
            :width="isPdfDown ? 80 : 120"
          >
            <!-- <template slot="header">
              {{ $t('saleContract.salesPrice') }}
              <span class="red">*</span>
            </template> -->
            <template slot-scope="scope">
              <el-form-item class="w-100" :rules="rules.salesPrice">
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.salesPriceRmb"
                  @change="getAmount"
                ></el-input>
                <div v-else>{{ scope.row.salesPriceRmb }}</div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p class="table-title">
        <span></span>{{ $t("saleContract.receiveDetails") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addReceiveDetailRow">+</span>
          <span class="dec-icon" @click="deleteReceiveDetailRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.saleContractReceiveDetailList"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          @selection-change="receiveDetailSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="预计收款日期">
            <template slot="header">
              {{ $t("saleContract.expectedReceiveDate") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'saleContractReceiveDetailList.' +
                  scope.$index +
                  '.expectReceiveDate'
                "
                :rules="rules.expectReceiveDate"
              >
                <el-date-picker
                  v-if="!disabled"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  clearable
                  v-model="scope.row.expectReceiveDate"
                  type="date"
                ></el-date-picker>
                <div v-else>{{ scope.row.expectReceiveDate }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="收款比例">
            <template slot="header">
              {{ $t("saleContract.receiveProportion") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'saleContractReceiveDetailList.' +
                  scope.$index +
                  '.receiveProportion'
                "
                :rules="rules.receiveProportion"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.receiveProportion"
                ></el-input>
                <div v-else>{{ scope.row.receiveProportion }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="收款金额" :width="isPdfDown ? 100 : ''">
            <template slot="header">
              {{ $t("saleContract.receiveAmount") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                class="w-100"
                :prop="
                  'saleContractReceiveDetailList.' +
                  scope.$index +
                  '.receiveAmount'
                "
                :rules="rules.receiveAmount"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.receiveAmount"
                ></el-input>
                <div v-else>{{ scope.row.receiveAmount }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commonContent.remarks')">
            <template slot-scope="scope">
              <el-form-item class="w-100">
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.remark"
                ></el-input>
                <div v-else>{{ scope.row.remark }}</div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p class="table-title">
        <span></span>{{ $t("saleContract.customerInfo") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addCustContactRow">+</span>
          <span class="dec-icon" @click="deleteChooseRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          :data="form.salesContractCustContactList"
          @selection-change="custContactSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column
            :label="$t('saleContract.customerContact')"
            :width="isPdfDown ? 175 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.contactName"
              ></el-input>
              <div v-else>{{ scope.row.contactName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('saleContract.contactPosition')"
            :width="isPdfDown ? 175 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.contactPost"
              ></el-input>
              <div v-else>{{ scope.row.contactPost }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('saleContract.contactPhone')"
            :width="isPdfDown ? 175 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.contactTel"
              ></el-input>
              <div v-else>{{ scope.row.contactTel }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('saleContract.email')"
            :width="isPdfDown ? 175 : ''"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!disabled"
                v-model="scope.row.contactEmail"
              ></el-input>
              <div v-else>{{ scope.row.contactEmail }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item
        label="合同文件"
        label-width="140px"
        prop="contractList"
        style="width: 100%"
      >
        <upload
          approvalName="销售合同申请"
          :isHistory="isHistory"
          :fileList="form.contractList"
          btnName="上传"
          @handleRequest="handleContractList"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { getFormatDate } from "@/util/util";
import SaleContractApplyApi from "@/api/saleContractApply/index";
import { getDictionary } from "@/api/system/dict";
import { getCustList } from "@/api/contract/contractCustomer";
import { getProjectList } from "@/api/contract/contractProject";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { mapGetters } from "vuex";
import upload from "@/components/upload/index";
import { downloadFileBlob, isGoogleChrome } from "@/util/util";
import UploadApi from "@/api/upload";

export default {
  data() {
    return {
      currencyList: [],
      saleTypeList: [],
      salesContractTypeList: [],
      salesContractCategoryList: [],
      countryRegionList: [],
      payMethodList: [],
      deptList: [],
      userList: [],
      custList: [],
      projectList: [],
      includeTaxList: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
      saleContractDetailMultipleSelection: [],
      receiveDetailMultipleSelection: [],
      custContactMultipleSelection: [],
      form: {
        id: null,
        titleName: null,
        applyPerson: null,
        applyDept: null,
        applyTime: null,
        approvalCode: null,
        currency: null,
        taxRate: null,
        contractList: [],
        salesContractTotalAmountOriginal: 0,
        salesContractTotalAmountRmb: 0,
        applyDesc: null,
        salesType: null,
        exchangeRate: null,
        startDate: null,
        endDate: null,
        implementTime: null,
        salesContractCategory: null,
        salesContractType: null,
        payMethod: null,
        custId: null,
        projectId: null,
        contractPerformPlace: null,
        deptIds: [],
        salesContractDetailNewList: [
          {
            key: Date.now(),
            partsName: null,
            partsDetail: null,
            unitName: null,
            unitPrice: null,
            number: null,
            includeTax: null,
            salesPrice: null,
            salesPriceRmb: null,
          },
        ],
        saleContractReceiveDetailList: [
          {
            key: Date.now(),
          },
        ],
        salesContractCustContactList: [
          {
            key: Date.now(),
          },
        ],
      },
      rules: {
        titleName: [{ required: true, message: "请输入标题", trigger: "blur" }],
        applyPerson: [
          { required: true, message: "请选择申请人", trigger: "change" },
        ],
        currency: [
          { required: true, message: "请选择币种", trigger: "change" },
        ],
        taxRate: [{ required: true, message: "请输入税率", trigger: "blur" }],
        salesContractTotalAmountOriginal: [
          { required: true, message: "请输入合同金额(原币)", trigger: "blur" },
        ],
        applyDesc: [
          { required: true, message: "请输入申请说明", trigger: "blur" },
        ],
        salesType: [
          { required: true, message: "请选择销售类型", trigger: "change" },
        ],
        exchangeRate: [
          { required: true, message: "请输入汇率", trigger: "blur" },
        ],
        custId: [
          { required: true, message: "请输入客户名称", trigger: "change" },
        ],
        startDate: [
          { required: true, message: "请选择合同开始日期", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择合同结束日期", trigger: "change" },
        ],
        implementTime: [
          { required: true, message: "请选择合同实施日期", trigger: "change" },
        ],
        deptIds: [
          { required: true, message: "请选择会签部门", trigger: "change" },
        ],
        projectId: [
          { required: true, message: "请选择相关项目", trigger: "change" },
        ],
        salesContractType: [
          { required: true, message: "请选择合同类型", trigger: "change" },
        ],
        salesContractCategory: [
          { required: true, message: "请选择合同类别", trigger: "change" },
        ],
        payMethod: [
          { required: true, message: "请选择收款方式", trigger: "change" },
        ],
        contractPerformPlace: [
          { required: true, message: "请填写合同履行地点", trigger: "blur" },
        ],
        partsName: [{ required: true, message: "请输入品名", trigger: "blur" }],
        partsDetail: [
          { required: true, message: "请输入详述及技术性能", trigger: "blur" },
        ],
        unitName: [{ required: true, message: "请输入单位", trigger: "blur" }],
        unitPrice: [{ required: true, message: "请输入单价", trigger: "blur" }],
        number: [{ required: true, message: "请输入数量", trigger: "blur" }],
        includeTax: [
          { required: true, message: "请选择是否含税", trigger: "change" },
        ],
        salesPrice: [
          { required: true, message: "请输入销售价格", trigger: "blur" },
        ],
        expectReceiveDate: [
          { required: true, message: "请选择预计收款日期", trigger: "change" },
        ],
        receiveProportion: [
          { required: true, message: "请输入收款比例", trigger: "blur" },
        ],
        receiveAmount: [
          { required: true, message: "请输入收款金额", trigger: "blur" },
        ],
        contractList: [
          { required: true, message: "请上传合同文件", trigger: "change" },
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
  components: {
    upload,
  },
  watch: {
    isPdfDown() {
      console.log(this.isPdfDown);
    },
  },
  mounted() {
    this.form.titleName =
      "销售合同申请" +
      " - " +
      (this.userInfo.nick_name ||
        this.userInfo.realName ||
        this.userInfo.user_name) +
      " - " +
      getFormatDate();
    this.businessId = this.$route.query.businessId;
    this.form.applyTime = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "SALE_TYPE" }, "saleType");
    this.getDictionary({ code: "CONTRACT_CATEGORY" }, "saleContractCategory");
    this.getDictionary({ code: "CONTRACT_TYPE" }, "saleContractType");
    this.getDictionary({ code: "PAY_METHOD" }, "payMethod");
    this.getDictionary({ code: "COUNTRY_REGIN" }, "countryRegion");
    this.getCustList();
    this.getProjectList();
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
  },
  computed: {
    ...mapGetters(["userInfo", "isMobile"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await SaleContractApplyApi.details(this.businessId);
      // console.log("res-->" + JSON.stringify(res));
      if (res.data.code === 0) {
        this.form = res.data.data;
        if (
          this.form.applyPerson != null &&
          this.form.applyPerson != undefined
        ) {
          this.form.applyPerson = this.form.applyPerson.toString();
        }
        if (this.form.payMethod != null && this.form.payMethod != undefined) {
          this.form.payMethod = this.form.payMethod.toString();
        }
        if (
          this.form.salesContractCategory != null &&
          this.form.salesContractCategory != undefined
        ) {
          this.form.salesContractCategory =
            this.form.salesContractCategory.toString();
        }
        if (
          this.form.salesContractType != null &&
          this.form.salesContractType != undefined
        ) {
          this.form.salesContractType = this.form.salesContractType.toString();
        }
        this.form.salesContractDetailNewList =
          this.form.salesContractDetailNewList || [];
        this.form.salesContractCustContactList =
          this.form.salesContractCustContactList || [];
        this.form.saleContractReceiveDetailList =
          this.form.saleContractReceiveDetailList || [];
        this.form.salesContractDetailNewList.map((ele, index) => {
          ele.key = new Date() + index;
        });
        this.form.salesContractCustContactList.map((ele, index) => {
          ele.key = new Date() + index;
        });
        this.form.saleContractReceiveDetailList.map((ele, index) => {
          ele.key = new Date() + index;
        });
        this.$emit("getFormData", this.form);
      }
    },
    handleRequestExport(data) {
      // console.log(data);
      // console.log('date------')
      this.form.salesContractDetailNewList = data
    },
    async downloadFile() {
      let obj = {
        url: "http://10.30.4.68:9000/license-prd/upload/20260323/41f24d49962aed5e528957f679f6d0fb.xlsx",
      };
      let res = await UploadApi.getUrl(obj);
      if (isGoogleChrome()) {
        downloadFileBlob(res.data.data, "客户订单详情.xlsx");
      } else {
        window.open(res.data.data);
      }
    },
    handleContractList(data, arr) {
      arr.map((ele) => {
        ele.businessName = "saleContractFile";
      });
      this.form.contractList = arr;
    },
    async getAmount() {
      // console.log(this.form.salesType)
      // if (this.form.salesType === 'nre' || this.form.salesType === 'incubation') {
      // }
      const values = this.form.salesContractDetailNewList.map((item) =>
        Number(item.salesPrice)
      );
      let sum = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      });
      if (!isNaN(sum)) {
        this.form.salesContractTotalAmountOriginal = sum.toFixed(2);
        this.form.salesContractTotalAmountRmb = (
          this.form.salesContractTotalAmountOriginal * this.form.exchangeRate
        ).toFixed(2);
      }
    },
    testForm() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
          if (valid) {
          } else {
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
        } else if (type === "saleType") {
          this.saleTypeList = res.data.data;
        } else if (type === "saleContractCategory") {
          this.salesContractCategoryList = res.data.data;
        } else if (type === "saleContractType") {
          this.salesContractTypeList = res.data.data;
        } else if (type === "payMethod") {
          this.payMethodList = res.data.data;
        } else if (type === "countryRegion") {
          this.countryRegionList = res.data.data;
        }
      });
    },
    getCustList() {
      getCustList({}).then((res) => {
        this.custList = res.data.data;
      });
    },
    getProjectList() {
      getProjectList({}).then((res) => {
        this.projectList = res.data.data;
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
      this.getAmount();
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
      this.getAmount();
    },
    receiveDetailSelectionChange(val) {
      this.receiveDetailMultipleSelection = val;
    },
    addReceiveDetailRow() {
      this.form.saleContractReceiveDetailList.push({
        key: Date.now(),
      });
    },
    getSalePriceRow(row) {
      // console.log(row)
      if (row.unitPrice && row.number) {
        row.salesPrice = (Number(row.unitPrice) * Number(row.number)).toFixed(
          2
        );
        row.salesPriceRmb = (
          Number(row.unitPrice) *
          Number(row.number) *
          this.form.exchangeRate
        ).toFixed(2);
        // if(Number(row.includeTax)===1){
        //   console.log(1)
        //   if(this.form.taxRate){
        //     row.salesPrice = (Number(row.unitPrice)*Number(row.number)*(1+this.form.taxRate/100)).toFixed(2)
        //   }
        // }else{
        // }
        this.getAmount();
      }
    },
    changeRate() {
      // this.form.salesContractDetailNewList.map(ele=>{
      //   this.getSalePriceRow(ele)
      // })
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
      console.log(
        "this.form.salesContractCustContactList-->" +
          this.form.salesContractCustContactList
      );
      if (this.form.salesContractCustContactList == null) {
        this.form.salesContractCustContactList = [];
      }
      this.form.salesContractCustContactList.push({
        key: Date.now(),
      });
    },
    deleteChooseRow() {
      if (this.custContactMultipleSelection.length === 0) {
        this.$message.error("请先选择客户信息");
        return;
      }
      let keys = this.custContactMultipleSelection.map((ele) => ele.key);
      let ids = this.custContactMultipleSelection.map((ele) => ele.id);
      this.form.salesContractCustContactList =
        this.form.salesContractCustContactList.filter((ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        });
    },
    custChange(data) {
      this.custList.forEach((cust) => {
        if (cust.id === data) {
          this.form.salesContractCustContactList =
            cust.salesContractCustContactList;
        }
      });
    },
    async getDepartment() {
      if (this.businessId) return;
      let res = await getDept(this.userInfo.dept_id || this.userInfo.deptId);
      this.form.applyDept = res.data.data.id;
    },
    changeAmount(val) {
      this.getAmount();
      console.log(this.form.salesContractDetailNewList);
      for (let i = 0; i < this.form.salesContractDetailNewList.length; i++) {
        let row = this.form.salesContractDetailNewList[i];
        // console.log(row)
        row.salesPriceRmb = (row.salesPrice * this.form.exchangeRate).toFixed(
          2
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
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
