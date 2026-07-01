<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('acceptApply.basicInfo') }}
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item  :label="$t('acceptApply.title')" prop="assetNumber" style="width: 96%">
        <el-input v-model="form.titleName" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applicant')" prop="assetNumber">
        <el-select v-model="form.applyPerson" disabled>
          <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDept')" prop="assetNumber">
        <el-select v-model="form.applyDept" disabled>
          <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDate')" prop="assetNumber">
        <el-input v-model="form.applyDate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyNo')" prop="assetNumber">
        <el-input v-model="form.applyNo" clearable disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('invoice.currency')">
        <el-select v-model="form.currency" clearable>
          <el-option v-for="item in currencyList" :key="item.dictKey" :label="item.dictValue"
            :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('invoice.taxRate')" prop="taxRate">
        <el-input v-model="form.taxRate" clearable>
          <template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.exchangeRate')" prop="exchangeRate" style="width: 96%;">
        <el-input v-model="form.exchangeRate" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('saleContract.originalAmount')" prop="salesContractTotalAmountOriginal">
        <el-input v-model="form.salesContractTotalAmountOriginal" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('saleContract.rmbAmount')" prop="salesContractTotalAmountRmb">
        <el-input v-model="form.salesContractTotalAmountRmb" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('saleContract.changeReason')" style="width: 96%">
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>

      <p class="table-title" style="width: 96%;">
        <span></span>{{$t('acceptApply.contractInfo')}}
      </p>
      <el-form-item :label="$t('saleContract.relatedContract')">
        <div class="flex">
          <el-select v-model="form.salesContractId" @change="changeSalesContract" clearable filterable>
            <el-option v-for="item in salesContractList" :key="item.id" :label="item.titleName"
              :value="item.id"></el-option>
          </el-select>
          <p @click="toPath" class="detailLink">{{ $t('commonContent.viewDetails') }}</p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('saleContract.saleType')">
        <el-select v-model="form.salesType" clearable>
          <el-option v-for="item in saleTypeList" :key="item.dictKey" :label="item.dictValue"
            :value="item.dictKey"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item :label="$t('saleContract.customerName')">
        <el-select v-model="form.custId" clearable filterable>
          <el-option v-for="item in custList" :value="item.id" :key="item.id" :label="item.custName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.contractAmount')" prop="assetNumber">
        <el-input disabled v-model="form.salesContractTotalAmountOriginal" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('saleContract.startDate')">
        <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" clearable v-model="form.startDate" type="date"
          placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('saleContract.endDate')">
        <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" clearable v-model="form.endDate" type="date"
          placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('saleContract.implementDate')" style="width: 96%">
        <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" clearable v-model="form.implementTime" type="date"
          placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('saleContract.countersignDepts')">
        <el-select v-model="form.deptIds" multiple placeholder="请选择">
          <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.relatedProject')" prop="projectId">
        <el-select v-model="form.projectId" clearable filterable>
          <el-option v-for="item in projectList" :value="item.id" :key="item.id" :label="item.projectName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.contractType')">
        <el-select v-model="form.salesContractType" clearable>
          <el-option v-for="item in salesContractTypeList" :value="item.dictKey" :key="item.dictKey"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.contractCategory')">
        <el-select v-model="form.salesContractCategory" clearable>
          <el-option v-for="item in salesContractCategoryList" :value="item.dictKey" :key="item.dictKey"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.paymentMethod')">
        <el-select v-model="form.payMethod" clearable>
          <el-option v-for="item in payMethodList" :value="item.dictKey" :key="item.dictKey"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saleContract.performancePlace')" prop="assetNumber">
        <el-input v-model="form.contractPerformPlace" clearable></el-input>
      </el-form-item>

      <p class="table-title">
        <span></span>{{$t('saleContract.contractDetails')}}
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addSaleContractDetailRow">+</span>
          <span class="dec-icon" @click="deleteSaleContractDetailRow">―</span>
        </div>
        <el-table ref="multipleTable" :data="form.salesContractChangeDetailList"
          @selection-change="saleContractDetailSelectChange" class="mb20 table-now"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }">
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column :label="$t('saleContract.productName')" :width="isPdfDown ? 95 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsName"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.technicalDetails')" :width="isPdfDown ? 95 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsDetail"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.unit')" :width="isPdfDown ? 95 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitName"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.unitPrice')" :width="isPdfDown ? 95 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.quantity')" :width="isPdfDown ? 95 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.number"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.includeTax')" :width="isPdfDown ? 95 : ''">
            <template slot-scope="scope">
              <el-select v-model="scope.row.includeTax" clearable>
                <el-option v-for="item in includeTaxList" :value="item.value" :key="item.value"
                  :label="item.label"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.salesPrice')" :width="isPdfDown ? 95 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.salesPrice"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <p class="table-title">
        <span></span>{{$t('saleContract.receiveDetails')}}
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addReceiveDetailRow">+</span>
          <span class="dec-icon" @click="deleteReceiveDetailRow">―</span>
        </div>
        <el-table ref="multipleTable" :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          :data="form.saleContractChangeReceiveDetailList" @selection-change="receiveDetailSelectionChange"
          class="mb20 table-now">
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column :label="$t('saleContract.expectedReceiveDate')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" clearable
                v-model="scope.row.expectReceiveDate" type="date" placeholder="选择日期"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column  :label="$t('saleContract.receiveProportion')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.receiveProportion"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.receiveAmount')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.receiveAmount"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commonContent.remarks')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <p class="table-title">
        <span></span>{{$t('saleContract.customerInfo')}}
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addCustContactRow">+</span>
          <span class="dec-icon" @click="deleteCustContractRow">―</span>
        </div>
        <el-table ref="multipleTable" :data="form.salesContractChangeCustContactList"
          @selection-change="custContactSelectionChange" class="mb20 table-now"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }">
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column :label="$t('saleContract.customerContact')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactName"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.contactPosition')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactPost"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.contactPhone')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactTel"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('saleContract.email')" :width="isPdfDown ? 175 : ''">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactEmail"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { getFormatDate } from "@/util/util";
import SaleContractChangeApplyApi from "@/api/saleContractChangeApply/index";
import { getDictionary } from "@/api/system/dict";
import { getCustList } from "@/api/contract/contractCustomer";
import { getProjectList } from "@/api/contract/contractProject";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getSalesContractList, getSalesContractDetail } from "@/api/contract/salesContractNew";
import { userList } from "@/api/contract/bomMaint";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      currencyList: [],
      saleTypeList: [],
      salesContractTypeList: [],
      salesContractCategoryList: [],
      payMethodList: [],
      deptList: [],
      custList: [],
      projectList: [],
      salesContractList: [],
      userList: [],
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
      rules: {
        projectId: [
          { required: true, message: '请选择相关项目', trigger: 'change' }
        ],
      },
      form: {
        salesContractId: null,
        titleName: null,
        applyDate: null,
        applyPerson: null,
        applyDept: null,
        currency: "",
        taxRate: null,
        salesContractTotalAmountOriginal: null,
        salesContractTotalAmountRmb: null,
        applyDesc: "",
        salesType: "",
        exchangeRate: "",
        startDate: "",
        endDate: "",
        implementTime: "",
        salesContractCategory: "",
        salesContractType: "",
        payMethod: "",
        custId: null,
        projectId: null,
        contractPerformPlace: null,
        remark: null,
        deptIds: [],
        saleContractDetailMultipleSelection: [],
        receiveDetailMultipleSelection: [],
        custContactMultipleSelection: [],
        salesContractChangeDetailList: [
          {
            key: Date.now(),
          },
        ],
        saleContractChangeReceiveDetailList: [
          {
            key: Date.now(),
          },
        ],
        salesContractChangeCustContactList: [
          {
            key: Date.now(),
          },
        ],
      },
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
    };
  },

  mounted() {
    this.form.titleName = ('销售合同变更申请' +
      " - " +
      (this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name) +
      " - " +
      getFormatDate())
    this.businessId = this.$route.query.businessId;
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.getSalesContractList();
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "SALE_TYPE" }, "saleType");
    this.getDictionary({ code: "CONTRACT_CATEGORY" }, "saleContractCategory");
    this.getDictionary({ code: "CONTRACT_TYPE" }, "saleContractType");
    this.getDictionary({ code: "PAY_METHOD" }, "payMethod");
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
  props: {
    isPdfDown: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getDetail() {
      let res = await SaleContractChangeApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.applyPerson = this.form.applyPerson ? this.form.applyPerson.toString() : ""
        this.form.payMethod = this.form.payMethod ? this.form.payMethod.toString() : ""
        this.form.salesContractCategory = this.form.salesContractCategory ? this.form.salesContractCategory.toString() : ""
        this.form.salesContractType = this.form.salesContractType ? this.form.salesContractType.toString() : ""
        this.$emit("getFormData", this.form);
      }
    },
    toPath() {
      if (this.form.salesContractId) {
        let url = `/saleContractApplication?businessId=${this.form.salesContractId}`
        window.open(this.$router.resolve({ path: url }).href, '_blank')
      }
    },
    saleContractDetailSelectChange(val) {
      this.saleContractDetailMultipleSelection = val;
    },
    addSaleContractDetailRow() {
      this.form.salesContractChangeDetailList.push({
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
      this.form.salesContractChangeDetailList = this.form.salesContractChangeDetailList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
    },
    receiveDetailSelectionChange(val) {
      this.receiveDetailMultipleSelection = val;
    },
    addReceiveDetailRow() {
      this.form.saleContractChangeReceiveDetailList.push({
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
      this.form.saleContractChangeReceiveDetailList = this.form.saleContractChangeReceiveDetailList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
    },
    custContactSelectionChange(val) {
      this.custContactMultipleSelection = val;
    },
    addCustContactRow() {
      this.form.salesContractChangeCustContactList.push({
        key: Date.now(),
      });
    },
    deleteCustContractRow() {
      if (this.custContactMultipleSelection.length === 0) {
        this.$message.error("请先选择客户信息");
        return;
      }
      let keys = this.custContactMultipleSelection.map((ele) => ele.key);
      let ids = this.custContactMultipleSelection.map((ele) => ele.id);
      this.form.salesContractChangeCustContactList = this.form.salesContractChangeCustContactList.filter((ele) => {
        return !keys.includes(ele.key) || !ids.includes(ele.id);
      });
    },
    testForm() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid,msg) => {
          resolve(valid);
          if (valid) {
          } else {
            console.log(msg)
            console.log("error submit!!");
            this.$message({
              message: `${Object.values(msg)[0][0].message}`,
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
        } else if (type === "saleType") {
          this.saleTypeList = res.data.data;
        } else if (type === "saleContractCategory") {
          this.salesContractCategoryList = res.data.data;
        } else if (type === "saleContractType") {
          this.salesContractTypeList = res.data.data;
        } else if (type === "payMethod") {
          this.payMethodList = res.data.data;
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
    getSalesContractList() {
      getSalesContractList().then((res) => {
        this.salesContractList = res.data.data;
      });
    },
    changeSalesContract(val) {
      if (val != '') {
        getSalesContractDetail(val).then((res) => {
          let salesContract = res.data.data;
          this.form.titleName = salesContract.titleName;
          this.form.currency = salesContract.currency;
          this.form.taxRate = salesContract.taxRate;
          this.form.exchangeRate = salesContract.exchangeRate;
          this.form.salesContractTotalAmountRmb = salesContract.salesContractTotalAmountRmb;
          this.form.salesContractTotalAmountOriginal = salesContract.salesContractTotalAmountOriginal;
          this.form.applyDesc = salesContract.applyDesc;
          this.form.salesType = salesContract.salesType;
          this.form.custId = salesContract.custId;
          this.form.startDate = salesContract.startDate;
          this.form.endDate = salesContract.endDate;
          this.form.implementTime = salesContract.implementTime;
          this.form.projectId = salesContract.projectId;
          this.form.salesContractType = "" + salesContract.salesContractType;
          this.form.salesContractCategory = "" + salesContract.salesContractCategory;
          this.form.payMethod = "" + salesContract.payMethod;
          this.form.contractPerformPlace = salesContract.contractPerformPlace;
          this.form.salesContractChangeDetailList = salesContract.salesContractDetailNewList;
          this.form.saleContractChangeReceiveDetailList = salesContract.saleContractReceiveDetailList;
          this.form.salesContractChangeCustContactList = salesContract.salesContractCustContactList;

          this.form.remark = salesContract.remark;
        });
      }
    },
    async getDepartment() {
      this.form.applyDept = this.userInfo.dept_id;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
}

.w100 {
  width: 100px;
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

.table-now {}
</style>
