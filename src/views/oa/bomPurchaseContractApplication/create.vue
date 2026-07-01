<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('acceptApply.basicInfo') }}
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item :label="$t('acceptApply.title')" prop="titleName" style="width: 96%">
        <el-input v-model="form.titleName" v-if="!disabled" clearable></el-input>
        <div v-else>{{ form.titleName }}</div>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applicant')" prop="applyPerson">
        <el-select v-model="form.applyPerson" disabled>
          <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acceptApply.applyDept')" prop="applyDept">
        <el-select v-model="form.applyDept" disabled>
          <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
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
          <el-option v-for="item in currencyList" :key="item.dictKey" :label="item.dictValue"
            :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预估金额" style="width: 20%">
               <el-input type="textarea" v-model="form.maybeAmount" autosize></el-input>
      </el-form-item>
      <el-form-item :label="$t('contract.applyDesc')"  style="width: 96%">
        <el-input type="textarea" v-model="form.applyDesc" autosize></el-input>
      </el-form-item>

      <p class="table-title" style="width: 96%;">
        <span></span>{{ $t('contract.contractInfo') }}
      </p>
      <el-form-item :label="$t('contract.beginTime')" prop="beginTime">
        <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" clearable v-model="form.beginTime"
          type="date"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('contract.endDate')" prop="endTime">
        <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" clearable v-model="form.endTime"
          type="date"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('contract.counterSignDept')" style="width: 96%;">
        <el-select v-model="form.counterSignDepartmentList" multiple>
          <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.type')">
        <el-select v-model="form.contractType" clearable disabled>
          <el-option v-for="item in salesContractTypeList" :value="item.dictKey" :key="item.dictKey"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.category')" prop="contractCategory">
        <el-select v-model="form.contractCategory" clearable>
          <el-option v-for="item in salesContractCategoryList" :value="item.dictKey" :key="item.dictKey"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.supplierName')" style="width: 96%;" prop="supplierNo">
        <div class="flex">
          <el-select v-model="form.supplierNo" clearable filterable @change="changeSupply">
            <el-option v-for="item in contractSupplierList" :value="item.supplierNo" :key="item.id"
              :label="item.supplierName"></el-option>
          </el-select>
          <div class="detailLink" @click="viewSupply">{{ $t('commonContent.viewDetails') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('contract.payMethod')" prop="payMethod">
        <el-select v-model="form.payMethod" clearable>
          <el-option v-for="item in payMethodList" :value="item.dictKey" :key="item.dictKey"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.performancePlace')" prop="contractPerformancePlace">
        <el-input v-model="form.contractPerformancePlace"></el-input>
      </el-form-item>
      <el-form-item label="合同金额有上限" prop="contractHaveAmountLimit">
              <el-radio-group v-model="form.contractHaveAmountLimit">
                            <el-radio label="是">是</el-radio>
                            <el-radio label="否">否</el-radio>
              </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.contractHaveAmountLimit === '是'" label="合同上限金额" prop="contractLimitAmount">
              <el-input v-model="form.contractLimitAmount"></el-input>
      </el-form-item>
      <el-form-item label="合同订单金额" prop="contractOrderTotalAmount">
              <div>{{ form.contractOrderTotalAmount || '' }}</div>
      </el-form-item>

      <p class="table-title">
        <span></span>{{ $t('contract.contractDetails') }}
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr flex-center mb10" v-if="!disabled">
          <span class="add-icon" @click="addBomPurchaseContractRow">+</span>
          <span class="dec-icon" @click="deleteChooseRow">―</span>
          <img @click="copyChoose" class="mt3" src="@/assets/svg/copy.svg" width="24" alt="">
          <el-button @click="downloadFile" >{{ $t('bom.downloadTemplate') }}</el-button>
          <upload @handleRequest="handleRequestExport" :showTip="false" class="mx10" url="/api/oa-portal/bomPurchaseContract/getBomContractDetailByFile"></upload>
        </div>
        <el-table ref="multipleTable" :data="form.bomPurchaseContractDetailList"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }"
          @selection-change="bomPurchaseContractDetailSelectionChange" class="mb20 table-now">
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="品名">
            <template slot="header">
              {{ $t('contract.productName') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'bomPurchaseContractDetailList.' + scope.$index + '.partsName'"
                :rules="rules.partsName" style="width: 100%;">
                <el-input v-if="!disabled" v-model="scope.row.partsName"></el-input>
                <div v-else>{{ scope.row.partsName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template slot="header">
              {{ $t('contract.unitPrice') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'bomPurchaseContractDetailList.' + scope.$index + '.unitPrice'"
                :rules="rules.unitPrice" style="width: 100%;">
                <el-input v-if="!disabled" v-model="scope.row.unitPrice"></el-input>
                <div v-else>{{ scope.row.unitPrice }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="80">
            <template slot="header">
              {{ $t('contract.quantity') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'bomPurchaseContractDetailList.' + scope.$index + '.quantity'" :rules="rules.quantity"
                style="width: 100%;">
                <el-input v-if="!disabled" v-model="scope.row.quantity"></el-input>
                <div v-else>{{ scope.row.quantity }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('other.remarks')">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input v-if="!disabled" v-model="scope.row.remark"></el-input>
                <div v-else>{{ scope.row.remark }}</div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <p class="table-title" style="width: 96%;">
        <span></span>  {{ $t('other.otherInfo') }}
      </p>
      <el-form-item :label="$t('contract.purchaseCommitteeResolution') " style="width: 96%">
        <div class="flex">
          <el-select ref="selectCommission" multiple v-model="form.purchaseCommissionDecisionNos" clearable filterable
            @change="changeCommission">
            <el-option v-for="item in purchaseCommissionDecisionList" :key="item.id" :label="item.titleName"
              :value="item.applyNo"></el-option>
          </el-select>
          <!-- <p @click="toPathPurchase" class="detailLink">{{ $t('commonContent.viewDetails') }}</p> -->
        </div>
      </el-form-item>
      <el-form-item :label="$t('other.attachments')" style="width: 96%">
        <upload :fileList="form.fileList" :isHistory="isHistory" :btnName="$t('other.upload')" @handleRequest="handleRequest"
        :showFileList="true"></upload>
      </el-form-item>
      <el-form-item :label="$t('other.remarks')" style="width: 96%">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <supplyDialog ref="supplyDialog"></supplyDialog>
  </basic-container>
</template>

<script>
import { getFormatDate ,downBlobFile} from "@/util/util";
import BomPurchaseContractApplyApi from "@/api/bomPurchaseContractApply/index";
import PurchaseCommissionDecisionApplyApi from "@/api/purchaseCommissionDecisionApplication/index";
import { getDictionary } from "@/api/system/dict";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import upload from "@/components/upload/index";
import { getContractSupplierList } from "@/api/contract/contractSupplier";
import { getOptions } from "@/api/base";
import { mapGetters } from "vuex";
import supplyDialog from '@/components/supplyDialog/index'
export default {
  components: {
    upload, supplyDialog
  },
  data() {
    return {
      isHistory: false,
      currencyList: [],
      purchaseTypeList: [],
      salesContractTypeList: [],
      salesContractCategoryList: [],
      countryRegionList: [],
      payMethodList: [],
      deptList: [],
      userList: [],
      purchaseType: [],
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
      purchaseApplyNo: null,
      bomPurchaseContractMultipleSelection: [],
      purchaseCommissionDecisionList: [],
      contractSupplierList: [],
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
        applyPerson: null,
        applyDept: null,
        applyDate: null,
        applyNo: null,
        currency: null,
        maybeAmount: null,
        applyDesc: null,
        beginTime: null,
        endTime: null,
        counterSignDepartmentList: [],
        contractType: null,
        contractCategory: null,
        supplierNo: null,
        payMethod: null,
        contractPerformancePlace: null,
        contractHaveAmountLimit: "否",
        contractOrderTotalAmount: null,
        contractLimitAmount: null,
        bomPurchaseContractDetailList: [
          {
            key: Date.now(),
            partsName: null,
            unitPrice: null,
            quantity: null,
            remark: null
          },
        ],
        contractType: '1',
        fileList: [],
        remark: null,
        purchaseCommissionDecisionNos: null
      },
      rules: {
        titleName: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '请填写合同币别', trigger: 'change' }
        ],
        contractCategory: [
          { required: true, message: '请填写合同类别', trigger: 'change' }
        ],
        applyDesc: [
          { required: true, message: '请填写BOM及框架合同申请说明', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '请填写合同开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请填写合同结束日期', trigger: 'change' }
        ],
        supplierNo: [
          { required: true, message: '请填写供应商名称', trigger: 'change' }
        ],
        payMethod: [
          { required: true, message: '请填写支付方式', trigger: 'change' }
        ],
        contractPerformancePlace: [
          { required: true, message: '请填写合同履行地点', trigger: 'change' }
        ],
        partsName: [
          { required: true, message: '请填写品名', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请填写单价', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请填写数量', trigger: 'blur' }
        ]

      }
    };
  },
  props: {
    isPdfDown: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.form.titleName = ('BOM及框架采购合同评审' +
      " - " +
      (this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name) +
      " - " +
      getFormatDate())
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.form.applyDept = this.userInfo.dept_id;
    this.isEdit = this.$route.query.isEdit;
    this.applyNo = this.$route.query.applyNo
    if (this.businessId || this.applyNo) {
      this.getDetail();
    }
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "CONTRACT_TYPE" }, "saleContractType");
    this.getDictionary({ code: "PAY_METHOD" }, "payMethod");
    this.getDictionary({ code: "CONTRACT_CATEGORY1" }, "purchaseContractCategory");
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
    this.getPurchaseCommissionDecisionList();
    this.getContractSupplierList();
    this.getCountryRegion();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return (this.businessId || this.applyNo) && !this.isEdit;
    },
  },
  methods: {
    getCountryRegion() {
      getOptions({
        code: "COUNTRY_REGIN"
      }).then((res) => {
        this.countryRegionList = res.data.data;
      });
    },
    changeSupply(){
      console.log(this.form.supplierNo)
      let row = this.contractSupplierList.find(ele=>{
        return ele.supplierNo === this.form.supplierNo
      })
      this.form.supplierName = row.supplierName
    },
    handleTagClick(v) {
      console.log(v)
      console.log('handleTagClick')
    },
    getContractSupplierList() {
      getContractSupplierList({}).then((res) => {
        this.contractSupplierList = res.data.data;
      });
    },
    async getPurchaseCommissionDecisionList() {
      let res = await PurchaseCommissionDecisionApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseCommissionDecisionList = res.data.data;
      }
    },
    viewSupply(){
      this.$refs.supplyDialog.supplierDialogFormVisible = true
      this.$refs.supplyDialog.getDetailSupply(this.form.supplierNo)
    },
    handleRequestExport(data,list){
      this.form.bomPurchaseContractDetailList = data
    },
    async downloadFile(){
    let res = await BomPurchaseContractApplyApi.exportBomContractDetail()
    // console.log(res)
    downBlobFile(res.data, 'BOM及框架采购合同评审')
   },
    handleRequest(val, arr) {
      this.form.fileList = arr
    },
    changeCommission() {
      setTimeout(() => {
        this.$refs.selectCommission.$refs.tags.childNodes[1].children.forEach((e, i) => {
          console.log(i)
          e.onclick = (clickEvent) => {
            //  这里写点击后的事件()
            //  e.textContent 为tag的文本内容
            let url = `/purchaseCommissionDecisionApplication?applyNo=${this.form.purchaseCommissionDecisionNos[i]}`
            window.open(this.$router.resolve({ path: url }).href, '_blank')
            clickEvent.stopPropagation(); // 防止冒泡事件
          };
        })
      }, 1000)
    },
    toPathPurchase() {
      if (this.form.purchaseCommissionDecisionNos) {
        let url = `/purchaseCommissionDecisionApplication?applyNo=${this.form.purchaseCommissionDecisionNos}`
        window.open(this.$router.resolve({ path: url }).href, '_blank')
        // this.$router.push(`/purchaseCommissionDecisionApplication?businessId=${this.form.purchaseCommissionDecisionId}`)
      }
    },
    async getDetail() {
      let res = await BomPurchaseContractApplyApi.details(this.businessId, this.applyNo);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.contractType = (this.form.contractType || "").toString()
        this.form.contractCategory = (this.form.contractCategory || '').toString()
        this.form.payMethod = (this.form.payMethod || '').toString()
        this.form.applyPerson = (this.form.applyPerson || '').toString()
        this.changeCommission()
        this.$emit("getFormData", this.form);
        this.isHistory = (this.form.opinion || this.form.source)
        this.form.bomPurchaseContractDetailList.map((ele,index)=>{
          ele.key = Date.now()+index
        })
      }
    },
    testForm() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, done, msg) => {
          msg &&
            this.$message({
              message: Object.values(msg)[0][0].message,
              type: "warning",
            });
          if (valid) {
            // this.form.purchaseCommissionDecisionNos = this.form.purchaseCommissionDecisionNos.toString()
          }
          resolve(valid);
          done();
        });
      });
    },
    getDictionary(params, type) {
      getDictionary(params).then((res) => {
        if (type === "currency") {
          this.currencyList = res.data.data;
        } else if (type === "payMethod") {
          this.payMethodList = res.data.data;
        } else if (type === "purchaseContractCategory") {
          this.salesContractCategoryList = res.data.data;
        } else if (type === "saleContractType") {
          this.salesContractTypeList = res.data.data;
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
    bomPurchaseContractDetailSelectionChange(val) {
      this.bomPurchaseContractMultipleSelection = val;
    },
    addBomPurchaseContractRow() {
      this.form.bomPurchaseContractDetailList.push({
        key: Date.now(),
      });
    },
    deleteChooseRow() {
      if (this.bomPurchaseContractMultipleSelection.length === 0) {
        this.$message.error("请先选择bom采购合同明细");
        return;
      }
      let keys = this.bomPurchaseContractMultipleSelection.map((ele) => ele.key);
      let ids = this.bomPurchaseContractMultipleSelection.map((ele) => ele.id);
      this.form.bomPurchaseContractDetailList = this.form.bomPurchaseContractDetailList.filter((ele) => {
        return !keys.includes(ele.key) || !ids.includes(ele.id);
      });
    },
    copyChoose() {
      if (this.bomPurchaseContractMultipleSelection.length === 0) {
        this.$message.error("请先选择bom采购合同明细");
        return;
      }
      let arr = JSON.parse(JSON.stringify(this.bomPurchaseContractMultipleSelection))
      arr.map((ele, index) => {
        ele.key = Date.now() + index
        this.form.bomPurchaseContractDetailList.push(ele)
      })

    },
    async getDepartment() {
      if(this.businessId)return
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

.table-now {}
.table-title {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 100;
  padding: 10px 0;
  margin: 20px 0;
  width: 100%;
  clear: both;
  display: block;
}
</style>
