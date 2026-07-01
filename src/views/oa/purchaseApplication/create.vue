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
      <el-form-item :label="$t('purchase.exchangeRate')" prop="exchangeRate">
        <el-input
          @blur="getOriginalAmountToTal()"
          v-model="form.exchangeRate"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('purchase.totalAmountOriginal')"
        prop="assetNumber"
      >
        {{ form.totalAmountOriginal }}
      </el-form-item>
      <el-form-item :label="$t('purchase.totalAmountOriginalUpper')" prop="">
        {{ form.totalAmountOriginalUpper }}
      </el-form-item>
      <el-form-item :label="$t('purchase.totalAmountRmb')" prop="">
        {{ this.form.totalAmountRmb }}
      </el-form-item>
      <el-form-item :label="$t('purchase.totalAmountRmbUpper')" prop="">
        {{ this.form.totalAmountRmbUpper }}
      </el-form-item>
      <el-form-item
        :label="$t('purchase.applyDesc')"
        style="width: 96%"
        prop="applyDesc"
      >
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('purchase.singleSupplierReason')"
        style="width: 96%"
      >
        <el-input
          type="textarea"
          v-model="form.singleSupplierReason"
        ></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("purchase.contractInfo") }}
      </p>
      <el-form-item :label="$t('purchase.purchaseType')" prop="purchaseType">
        <el-select v-model="form.purchaseType" clearable>
          <el-option
            v-for="item in purchaseTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('purchase.useDept')" prop="assetNumber">
        <el-select v-model="form.useDept">
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('purchase.expectedPurchaseDate')"
        prop="expectedPurchaseDate"
      >
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.expectedPurchaseDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('purchase.isEmergencyPurchase')"
        prop="isEmergencyPurchase"
      >
        <el-select v-model="form.isEmergencyPurchase" clearable>
          <el-option
            v-for="item in isEmergencyPurchaseList"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('purchase.prType')" prop="prType">
        <el-select v-model="form.prType" clearable>
          <el-option
            v-for="item in prTypeList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="框架合同" prop="contractNo" v-if="form.prType == 3">
        <el-select v-model="form.contractNo" clearable filterable>
          <el-option
            v-for="item in contractList"
            :value="item.applyNo"
            :key="item.applyNo"
            :label="item.titleName"
          ></el-option>
        </el-select>
        <p @click="toPath" class="detailLink">查看详情</p>
      </el-form-item>
      <p class="table-title" style="width: 96%">
        <span></span>{{ $t("purchaseDetail.title") }}
      </p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr flex-center mb10" v-if="!disabled">
          <span class="add-icon" @click="addSaleContractDetailRow">+</span>
          <span class="dec-icon" @click="deleteSaleContractDetailRow">―</span>
          <img
            @click="copyChoose"
            class="mt3"
            src="@/assets/svg/copy.svg"
            width="24"
            alt=""
          />
          <el-button @click="downloadFile">{{
            $t("purchaseDetail.downloadTemplate")
          }}</el-button>
          <upload
            @handleRequest="handleRequestExport"
            :showTip="false"
            class="mx10"
            url="/api/oa-portal/purchaseApply/getPurchaseDetailByFile"
          ></upload>
        </div>
        <div style="color: red">{{ $t("purchaseDetail.notice") }}</div>
        <el-table
          :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }"
          ref="multipleTable"
          :data="form.purchaseDetailList"
          @selection-change="saleContractDetailSelectChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="相关项目" :width="isPdfDown ? 50 : 320">
            <template slot="header">
              {{ $t("purchaseDetail.columns.project") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseDetailList.' + scope.$index + '.projectNo'"
                :rules="rules.projectNo"
              >
                <el-select
                  v-if="!disabled"
                  v-model="scope.row.projectNo"
                  filterable
                  clearable
                  @change="getProjectRow(scope.row, scope.$index)"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectNo"
                    :label="item.projectName"
                    :value="item.projectNo"
                  ></el-option>
                </el-select>
                <div v-else>
                  {{ scope.row.projectName }}
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="项目经理" :width="isPdfDown ? 50 : 120">
            <template slot="header">
              {{ $t("purchaseDetail.columns.projectManager") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :rules="rules.projectManageId">
                {{ scope.row.projectManageName }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseDetail.columns.sorpTime')"
            :width="isPdfDown ? 50 : 180"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-date-picker
                  v-if="!disabled"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  clearable
                  v-model="scope.row.sorpTime"
                  type="date"
                ></el-date-picker>
                <div v-else>{{ scope.row.sorpTime }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="预算科目" :width="isPdfDown ? 50 : 280">
            <template slot="header">
              {{ $t("purchaseDetail.columns.budgetSubject") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseDetailList.' + scope.$index + '.subjectId'"
                :rules="rules.subjectId"
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
                <div v-else>{{ scope.row.subjectName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="成本中心" :width="isPdfDown ? 50 : 200">
            <template slot="header">
              {{ $t("purchaseDetail.columns.costCenter") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseDetailList.' + scope.$index + '.costCenterName'"
                :rules="rules.costCenterName"
              >
                <el-select
                  v-if="!disabled"
                  v-model="scope.row.costCenterName"
                  @change="getCostItem(scope.row, scope.$index)"
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in costList"
                    :key="item.costName"
                    :label="item.costName"
                    :value="item.costName"
                  ></el-option>
                </el-select>
                <div v-else>{{ scope.row.costCenterName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseDetail.columns.subjectCode')"
            :width="isPdfDown ? 50 : 180"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.subjectCode"
                ></el-input>
                <div v-else>{{ scope.row.subjectCode }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseDetail.columns.budgetInfo')"
            :width="isPdfDown ? 60 : 120"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.budgetInfo"></div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseDetail.columns.productName')"
            :width="isPdfDown ? 50 : 120"
          >
            <template slot="header">
              {{ $t("purchaseDetail.columns.productName") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseDetailList.' + scope.$index + '.partsName'"
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
          <el-table-column
            :label="$t('purchaseDetail.columns.techSpec')"
            :width="isPdfDown ? 50 : 120"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.remark"
                ></el-input>
                <div v-else>{{ scope.row.remark }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="单位" :width="isPdfDown ? 50 : 120">
            <template slot="header">
              {{ $t("purchaseDetail.columns.unit") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseDetailList.' + scope.$index + '.unitName'"
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
          <el-table-column label="数量" :width="isPdfDown ? 50 : 120">
            <template slot="header">
              {{ $t("purchaseDetail.columns.quantity") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseDetailList.' + scope.$index + '.quantity'"
                :rules="rules.quantity"
              >
                <el-input
                  @blur="dealQuantity(scope.row)"
                  v-if="!disabled"
                  v-model="scope.row.quantity"
                ></el-input>
                <div v-else>{{ scope.row.quantity }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="单价(含税)" :width="isPdfDown ? 50 : 120">
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseDetailList.' + scope.$index + '.unitPrice'"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.unitPrice"
                  @blur="changePrice(scope.row)"
                ></el-input>
                <div v-else>{{ scope.row.unitPrice }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="总价格(原币)" :width="isPdfDown ? 50 : 120">
            <template slot="header">
              {{ $t("purchaseDetail.columns.totalPriceOriginal") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'purchaseDetailList.' + scope.$index + '.totalPriceOriginal'
                "
                :rules="rules.totalPriceOriginal"
              >
                <el-input
                  @change="getOriginalAmountToTal()"
                  v-if="!disabled"
                  v-model="scope.row.totalPriceOriginal"
                ></el-input>
                <div v-else>{{ scope.row.totalPriceOriginal }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('purchaseDetail.columns.totalPriceRMB')"
            :width="isPdfDown ? 60 : 120"
          >
            <template slot-scope="scope">
              <el-form-item>
                {{ getRMBAmount(scope.row.totalPriceOriginal, scope) }}
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <p class="table-title" v-if="form.prType != 3">
        <span></span>{{ $t("purchaseApplication.supplierRecommendation") }}
      </p>
      <el-form-item label-width="0" style="width: 100%" v-if="form.prType != 3">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addReceiveDetailRow">+</span>
          <span class="dec-icon" @click="deleteReceiveDetailRow">―</span>
        </div>
        <el-table
          :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }"
          ref="multipleTable"
          :data="form.purchaseSupplierList"
          @selection-change="receiveDetailSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column :label="$t('purchaseApplication.supplierList')">
            <template slot="header">
              {{ $t("purchaseApplication.supplierList") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseSupplierList.' + scope.$index + '.supplierName'"
                :rules="rules.supplierName"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.supplierName"
                ></el-input>
                <div v-else>{{ scope.row.supplierName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchaseApplication.contact')">
            <template slot="header">
              {{ $t("purchaseApplication.contact") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseSupplierList.' + scope.$index + '.contactName'"
                :rules="rules.contactName"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.contactName"
                ></el-input>
                <div v-else>{{ scope.row.contactName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchaseApplication.phone')">
            <template slot="header">
              {{ $t("purchaseApplication.phone") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseSupplierList.' + scope.$index + '.contactTel'"
                :rules="rules.contactTel"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.contactTel"
                ></el-input>
                <div v-else>{{ scope.row.contactTel }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchaseApplication.email')">
            <template slot="header">
              {{ $t("purchaseApplication.email") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseSupplierList.' + scope.$index + '.contactEmail'"
                :rules="rules.contactTel"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.contactEmail"
                ></el-input>
                <div v-else>{{ scope.row.contactEmail }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchaseApplication.relatedCases')">
            <template slot="header">
              {{ $t("purchaseApplication.relatedCases") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseSupplierList.' + scope.$index + '.remark'"
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
        </el-table>
      </el-form-item>
      <p class="table-title" v-if="form.prType != 3">
        <span></span>{{ $t("purchaseApplication.technicalEvaluation") }}
      </p>
      <el-form-item label-width="0" style="width: 100%" v-if="form.prType != 3">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addCustContactRow">+</span>
          <span class="dec-icon" @click="deleteChooseRow">―</span>
        </div>
        <el-table
          :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }"
          ref="multipleTable"
          :data="form.purchaseTechEvalList"
          @selection-change="custContactSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="公司名称">
            <template slot="header">
              {{ $t("purchaseApplication.companyName") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseTechEvalList.' + scope.$index + '.supplierName'"
                :rules="rules.supplierName"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.supplierName"
                ></el-input>
                <div v-else>{{ scope.row.supplierName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="报价日期">
            <template slot="header">
              {{ $t("purchaseApplication.quotationDate") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'purchaseTechEvalList.' + scope.$index + '.quotationDate'
                "
                :rules="rules.quotationDate"
              >
                <el-date-picker
                  v-if="!disabled"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  clearable
                  v-model="scope.row.quotationDate"
                  type="date"
                ></el-date-picker>
                <div v-else>{{ scope.row.quotationDate }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="报价价格（原币）">
            <template slot="header">
              {{ $t("purchaseApplication.quotationPriceOriginal") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'purchaseTechEvalList.' +
                  scope.$index +
                  '.quotationPriceOriginal'
                "
                :rules="rules.quotationPriceOriginal"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.quotationPriceOriginal"
                ></el-input>
                <div v-else>{{ scope.row.quotationPriceOriginal }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchaseApplication.quotationPriceRMB')">
            <template slot-scope="scope">
              <el-form-item>
                {{
                  getRMBAmount(
                    scope.row.quotationPriceOriginal,
                    scope,
                    "quotationPriceRmb"
                  )
                }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="评定结果">
            <template slot="header">
              {{ $t("purchaseApplication.evaluationResult") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseTechEvalList.' + scope.$index + '.evalResult'"
                :rules="rules.evalResult"
              >
                <el-select
                  v-if="!disabled"
                  v-model="scope.row.evalResult"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in evalResultList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div v-else>{{ scope.row.evalResult ? "合格" : "不合格" }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="合格/不合格说明">
            <template slot="header">
              {{ $t("purchaseApplication.evaluationRemark") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseTechEvalList.' + scope.$index + '.remark'"
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
          <el-table-column label="评定得分">
            <template slot="header">
              {{ $t("purchaseApplication.evaluationScore") }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'purchaseTechEvalList.' + scope.$index + '.evalScore'"
                :rules="rules.evalScore"
              >
                <el-input
                  v-if="!disabled"
                  v-model="scope.row.evalScore"
                ></el-input>
                <div v-else>{{ scope.row.evalScore }}</div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item
        label="（盖章）报价单"
        label-width="140px"
        prop="quotationSheetList"
        style="width: 100%"
        v-if="form.prType != 3"
      >
        <upload
          :isHistory="isHistory"
          :fileList="form.quotationSheetList"
          btnName="上传"
          @handleRequest="handleQuotationSheet"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form-item
        label="SOR/SOW"
        label-width="140px"
        prop="sorOrSowList"
        style="width: 100%"
        v-if="form.prType != 3"
      >
        <upload
          :isHistory="isHistory"
          :fileList="form.sorOrSowList"
          btnName="上传"
          @handleRequest="handleSOROrSOW"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import {
  getFormatDate,
  numberToTraditionalChinese,
  downBlobFile,
} from "@/util/util";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import { getDictionary } from "@/api/system/dict";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getProjectList } from "@/api/contract/contractProject";
import { mapGetters } from "vuex";
import { mixins } from "./purchaseMixins";
import { mixinsAmount } from "@/mixins/amount";
import elSelectTree from "@/components/elSelectTree/index";
import { validatenNum } from "@/util/validate";
import upload from "@/components/upload/index";
import BomPurchaseContractApplyApi from "@/api/bomPurchaseContractApply/index";

export default {
  mixins: [mixins, mixinsAmount],
  components: {
    elSelectTree,
    upload,
  },
  data() {
    return {
      deepTitle: "",
      prTypeList: [],
      contractList: [],
      currencyList: [],
      purchaseTypeList: [],
      salesContractTypeList: [],
      salesContractCategoryList: [],
      countryRegionList: [],
      deptList: [],
      userList: [],
      projectList: [],
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
      receiveDetailMultipleSelection: [],
      custContactMultipleSelection: [],
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
      purchaseApplyNo: null,
      form: {
        titleName: null,
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        applyNo: null,
        currency: null,
        totalAmountOriginal: null,
        totalAmountOriginalUpper: null,
        totalAmountRmb: null,
        totalAmountRmbUpper: null,
        applyDesc: null,
        prType: null,
        singleSupplierReason: null,
        purchaseType: null,
        useDept: null,
        expectedPurchaseDate: null,
        isEmergencyPurchase: null,
        purchaseDetailList: [
          {
            key: Date.now(),
            subjectId: null,
            projectManageName: null,
            projectNo: null,
            costCenterId: null,
            sorpTime: null,
            sorpTime: null,
            costCenterName: null,
            subjectCode: null,
            partsName: null,
            remark: null,
            unitName: null,
            quantity: null,
            unitPrice: null,
            totalPriceOriginal: null,
          },
        ],
        purchaseSupplierList: [
          {
            key: Date.now(),
            supplierName: null,
            contactName: null,
            contactTel: null,
            contactEmail: null,
            remark: null,
          },
        ],
        purchaseTechEvalList: [
          {
            key: Date.now(),
            supplierName: null,
            quotationDate: null,
            quotationPriceOriginal: null,
            evalResult: null,
            remark: null,
            evalScore: null,
          },
        ],
        quotationSheetList: [],
        sorOrSowList: [],
      },
      rules: {
        titleName: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnterTitle"),
            trigger: "change",
          },
        ],
        currency: [
          {
            required: true,
            message: this.$t("purchase.pleaseSelectCurrency"),
            trigger: "change",
          },
        ],
        exchangeRate: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnterExchangeRate"),
            trigger: "change",
          },
          { validator: validatenNum },
        ],
        applyDesc: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnterPurchaseDesc"),
            trigger: "change",
          },
        ],
        purchaseType: [
          {
            required: true,
            message: this.$t("purchase.pleaseSelectPurchaseType"),
            trigger: "change",
          },
        ],
        expectedPurchaseDate: [
          {
            required: true,
            message: this.$t("purchase.pleaseSelectExpectedDate"),
            trigger: "change",
          },
        ],
        isEmergencyPurchase: [
          {
            required: true,
            message: this.$t("purchase.pleaseSelectEmergency"),
            trigger: "change",
          },
        ],
        projectNo: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnterProject"),
            trigger: "change",
          },
        ],
        projectManageId: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnterProjectManager"),
            trigger: "change",
          },
        ],
        costCenterName: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnterCostCenter"),
            trigger: "change",
          },
        ],
        subjectId: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnterBudgetSubject"),
            trigger: "change",
          },
        ],
        supplierName: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        contactName: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        contactTel: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        contactEmail: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        remark: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        evalResult: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        evalScore: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "blur",
          },
          { validator: validatenNum },
        ],
        quotationDate: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        quotationPriceOriginal: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
          { validator: validatenNum },
        ],
        partsName: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        unitName: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        quantity: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
          { validator: validatenNum },
        ],
        totalPriceOriginal: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
          { validator: validatenNum },
        ],
        sorOrSowList: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        quotationSheetList: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        prType: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
        ],
        contractNo: [
          {
            required: true,
            message: this.$t("purchase.pleaseEnter"),
            trigger: "change",
          },
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
    this.businessId = this.$route.query.businessId;
    this.purchaseApplyNo = this.$route.query.purchaseApplyNo;
    this.form.titleName =
      "一般通用采购申请" +
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
    if (this.businessId || this.purchaseApplyNo) {
      this.getDetail();
    }
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "PURCHASE_TYPE" }, "purchaseType");
    this.getDictionary({ code: "PR_TYPE" }, "prType");
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
    this.getContractProjectList();
    this.getContractList();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return (this.businessId || this.purchaseApplyNo) && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await PurchaseApplyApi.details({
        businessId: this.businessId,
        purchaseApplyNo: this.purchaseApplyNo,
      });
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.purchaseType = this.form.purchaseType
          ? this.form.purchaseType.toString()
          : "";
        this.form.prType = this.form.prType ? this.form.prType.toString() : "";
        this.form.applyPerson = this.form.applyPerson
          ? this.form.applyPerson.toString()
          : "";
        this.form.purchaseDetailList.map((ele, index) => {
          ele.projectManageId = ele.projectManageId
            ? ele.projectManageId.toString()
            : "";
          this.getCostItem(ele, index);
          ele.key = Date.now() + index;
          // ele.budgetInfo = `可用预算:  ${ele.avaliableFee || 0.00}<br/><span style='color:blue'>已发生费用:  ${ele.costedFee || 0.00}</span><br/><span style='color:green'>审批中费用: ${ele.underApprovalFee || 0.00}</span>`
        });
        if (
          this.form.purchaseSupplierList &&
          this.form.purchaseSupplierList.length > 0
        ) {
          this.form.purchaseSupplierList.map((ele, index) => {
            ele.key = new Date() + index;
          });
        }
        if (
          this.form.purchaseTechEvalList &&
          this.form.purchaseTechEvalList.length > 0
        ) {
          this.form.purchaseTechEvalList.map((ele, index) => {
            ele.key = new Date() + index;
          });
        }
        // console.log(this.form)
        this.$emit("getFormData", this.form);
      }
    },
    handleQuotationSheet(data, arr) {
      arr.map((ele) => {
        ele.businessName = "QuotationPurchase";
      });
      this.form.quotationSheetList = arr;
    },
    handleSOROrSOW(data, arr) {
      arr.map((ele) => {
        ele.businessName = "SOROrSOW";
      });
      this.form.sorOrSowList = arr;
    },
    async downloadFile() {
      let res = await PurchaseApplyApi.exportPurchaseDetail();
      // console.log(res)
      downBlobFile(res.data, "一般通用采购申请模板");
    },
    handleRequestExport(data, list) {
      let arr = data;
      arr.map((ele) => {
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
      this.form.purchaseDetailList = data;
      this.getOriginalAmountToTal();
    },
    getProjectRow(row, index) {
      let obj = this.projectList.find((ele) => {
        return ele.projectNo === row.projectNo;
      });
      row.projectManageId = obj.projectManageId
        ? obj.projectManageId.toString()
        : null;
      row.projectManageName = obj.projectManageName;
      row.sorpTime = obj.sorpDate;
      row.projectName = obj.projectName;
      //相关项目带出
      this.form.purchaseDetailList.map((ele) => {
        ele.projectManageName = row.projectManageName;
        ele.projectManageId = row.projectManageId;
        ele.projectManageName = row.projectManageName;
        ele.sorpTime = row.sorpTime;
        ele.projectName = row.projectName;
        ele.projectNo = row.projectNo;
      });

      this.$set(this.purchaseDetailList, index, row);
      this.$refs.form.clearValidate();
    },
    getRMBAmount(money, scope, key = "totalPriceRmb") {
      if (!money) return;
      if (scope) {
        scope.row[key] = Number(money) * (this.form.exchangeRate || 1);
      }
      return (Number(money) * (this.form.exchangeRate || 1)).toFixed(2);
    },
    getOriginalAmountToTal(
      listKey = "purchaseDetailList",
      amountKey = "totalPriceOriginal",
      formKey = "totalAmountOriginal"
    ) {
      if (this.form["totalAmountRmb"]) {
        this.deepTitle = `(合计金额：${Number(
          this.form["totalAmountRmb"]
        ).toFixed(2)})`;
      }
      this.form[listKey] = this.form[listKey] || [];
      let arr = this.form[listKey].map((ele) => ele[amountKey]);
      var sum =
        this.form[listKey].length === 0
          ? 0
          : arr.reduce(function (prev, curr, idx, arr) {
              return Number(prev || 0) + Number(curr || 0);
            });
      this.form[formKey] = sum;
      this.form["totalAmountRmb"] = Number(
        (sum || 0) * (this.form.exchangeRate || 1)
      ).toFixed(2);
      this.form.totalAmountRmbUpper = numberToTraditionalChinese(
        this.form.totalAmountRmb
      );
      this.form.totalAmountOriginalUpper = numberToTraditionalChinese(
        this.form.totalAmountOriginal
      );
      let newTitle = `(合计金额：${Number(this.form["totalAmountRmb"]).toFixed(
        2
      )})`;
      if (!this.form.titleName.includes("合计金额")) {
        this.form.titleName = `${this.form.titleName}${newTitle}`;
      } else {
        this.form.titleName = this.form.titleName.replace(
          this.deepTitle,
          newTitle
        );
      }
      if (!isNaN(sum)) {
        return Number(sum).toFixed(2);
        this.changePrice(row);
      }
    },
    changePrice(row) {
      row.totalPriceOriginal = Number(row.quantity) * Number(row.unitPrice);
      this.getOriginalAmountToTal()
    },
    getMoneyTitle() {},
    dealQuantity(row) {
      if (!isNaN(row.quantity)) {
        row.quantity = Number(row.quantity).toFixed(2);
      }
     this.changePrice(row)
    },
    groupedByCode() {
      return this.form.purchaseDetailList.reduce((acc, item) => {
        acc[item.subjectCode + item.costCenterId] =
          acc[item.subjectCode + item.costCenterId] || [];
        acc[item.subjectCode + item.costCenterId].push(item);
        return acc;
      }, {});
    },
    testMoney() {
      let arrGroup = this.groupedByCode();
      for (let key in arrGroup) {
        if (arrGroup[key].length > 0) {
          let avaliableFee = Number(arrGroup[key][0].avaliableFee);
          let arrMoney = arrGroup[key].map((ele) =>
            Number(ele.totalPriceOriginal)
          );
          let sum = arrMoney.reduce(function (previousValue, currentValue) {
            return (Number(previousValue) || 0) + (Number(currentValue) || 0);
          });
          if (Number(sum) > Number(avaliableFee)) {
            this.$message.error("可用预算不足");
            return false;
          }
        }
      }
      return true;
    },
    testForm() {
      if (!this.testMoney()) {
        return;
      }
      for (let row of this.form.purchaseDetailList) {
        if (row.avaliableFee <= 0) {
          this.$message.error("可用预算不足");
          return;
        }
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, done, msg) => {
          msg &&
            this.$message({
              message: Object.values(msg)[0][0].message,
              type: "warning",
            });
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
        } else if (type === "purchaseType") {
          this.purchaseTypeList = res.data.data;
        } else if (type === "prType") {
          this.prTypeList = res.data.data;
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
      this.form.purchaseDetailList.push({
        key: Date.now(),
        sorpTime: null,
        totalPriceOriginal: null,
        quantity: null,
        unitPrice: null,
        // subjectId: this.form.purchaseDetailList[0].subjectId,
        // costCenterId: this.form.purchaseDetailList[0].costCenterId,
        // projectNo: this.form.purchaseDetailList[0].projectNo,
        // projectName: this.form.purchaseDetailList[0].projectName,
        // subjectName: this.form.purchaseDetailList[0].subjectName,
        // costCenterName: this.form.purchaseDetailList[0].costCenterName,
        // subjectNo:  this.form.purchaseDetailList[0].subjectNo,
        // budgetInfo:  this.form.purchaseDetailList[0].budgetInfo,
      });
    },
    deleteSaleContractDetailRow() {
      if (this.saleContractDetailMultipleSelection.length === 0) {
        this.$message.error("请先选择合同明细");
        return;
      }
      let keys = this.saleContractDetailMultipleSelection.map((ele) => ele.key);
      let ids = this.saleContractDetailMultipleSelection.map((ele) => ele.id);
      this.form.purchaseDetailList = this.form.purchaseDetailList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
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
        this.form.purchaseDetailList.push(ele);
      });
    },
    receiveDetailSelectionChange(val) {
      this.receiveDetailMultipleSelection = val;
    },
    addReceiveDetailRow() {
      this.form.purchaseSupplierList.push({
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
      this.form.purchaseSupplierList = this.form.purchaseSupplierList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
    },
    custContactSelectionChange(val) {
      this.custContactMultipleSelection = val;
    },
    addCustContactRow() {
      this.form.purchaseTechEvalList.push({
        key: Date.now(),
      });
    },
    deleteChooseRow() {
      if (this.custContactMultipleSelection.length === 0) {
        this.$message.error("请先选择工作经历");
        return;
      }
      let keys = this.custContactMultipleSelection.map((ele) => ele.key);
      let ids = this.custContactMultipleSelection.map((ele) => ele.id);
      this.form.purchaseTechEvalList = this.form.purchaseTechEvalList.filter(
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
    getContractList() {
      BomPurchaseContractApplyApi.selectList().then((res) => {
        this.contractList = res.data.data;
      });
    },
    toPath() {
      if (this.form.contractNo) {
        let url = `/bomPurchaseContractApplication?applyNo=${this.form.contractNo}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
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

@media (min-width: 768px) {
  .el-form-item {
    width: 48%;
  }
}

.table-now {
  .el-form-item {
    width: 100%;
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
