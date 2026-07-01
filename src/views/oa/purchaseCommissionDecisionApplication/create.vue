<template>
  <basic-container>
    <p class="table-title bgTitle">
      <span></span>{{ $t('acceptApply.basicInfo') }}
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item :label="$t('bom.project.name')" prop="titleName" style="width: 96%">
        <el-input v-model="form.titleName" clearable></el-input>
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
      <el-form-item :label="$t('acceptApply.applyDesc')" style="width: 96%" prop="applyDesc">
        <el-input type="textarea" autosize v-model="form.applyDesc"></el-input>
      </el-form-item>
      <p class="table-title bgTitle" style="width: 100%;">
        <span></span>{{ $t('purchaseCommissionDecision.applicationInfo') }}
      </p>
      <el-form-item :label="$t('purchaseCommissionDecision.purchaseType')" style="width: 96%">
        <el-radio-group v-model="form.purchaseType" @change="changePurchaseType">
          <el-radio :label="1">一般通用采购</el-radio>
          <el-radio :label="2">框架采购</el-radio>
          <el-radio :label="3">BOM框架采购</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('purchaseCommissionDecision.generalPurchaseApply')" prop="purchaseApplyNo"
        v-if="form.purchaseType === 1 || !form.purchaseType" style="width: 96%">
        <div class="flex-center">
          <el-select v-if="!disabled" filterable clearable v-model="form.purchaseApplyNo" @change="getPurchaseRow">
            <el-option v-for="item in purchaseApplyList" :key="item.id" :label="item.titleName"
              :value="item.applyNo"></el-option>
          </el-select>
          <div v-else>{{ form.purchaseApplyName }}</div>
          <p @click="toPath" class="detailLink">{{ $t('commonContent.viewDetails') }}</p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('purchaseCommissionDecision.supplierAssessor')" prop="supplierAssessorName"
        style="width: 96%">
        <autoAddress :disabled="disabled" :multiple="false" :initData="form.supplierAssessorName" class="w-100"
          @getPerson="getPersonAssessor"></autoAddress>
      </el-form-item>
      <p class="table-title bgTitle " style="width: 100%;">
        <span></span>{{ $t('purchaseCommissionDecision.businessNegotiation') }}
      </p>
      <businessNegotiation @updateSupply="updateSupply" :purchaseList="purchaseList" :disabled="disabled"
        ref="businessNegotiation" :formData="form" @getSupplyList="getSupplyList" :isPdfDown="isPdfDown">
      </businessNegotiation>
      <p class="table-title bgTitle" style="width: 100%;">
        <span></span>{{ $t('purchaseCommissionDecision.priceAnalysisL') }}
      </p>
      <el-form-item style="width: 100%;" label-width="0">
        <priceAnalysis :disabled="disabled" :isPdfDown="isPdfDown" ref="priceAnalysis" :formData="form"></priceAnalysis>
      </el-form-item>
      <el-form-item :label="$t('commonContent.description')" style="width: 96%">
        <el-input type="textarea" v-if="!disabled" autosize v-model="form.priceAnalysisDesc"></el-input>
        <div v-else>{{ form.priceAnalysisDesc }}</div>
      </el-form-item>
      <el-form-item :label="$t('commonContent.attachments')" style="width: 96%">
        <upload :isHistory="isHistory" :fileList="form.priceFileList" btnName="上传" @handleRequest="handleRequest"
          :multiple="true" :showFileList="true"></upload>
      </el-form-item>
      <p class="table-title bgTitle" style="width: 100%;">
        <span></span>{{ $t('purchaseCommissionDecision.resolutionRecord') }}
      </p>
      <el-form-item style="width: 100%;" label-width="0">
        <recordFile :disabled="disabled" :isPdfDown="isPdfDown" ref="recordFile" :formData="form"></recordFile>
      </el-form-item>
      <p class="table-title bgTitle " style="width: 100%;" v-if="!isPdfDown">
        <span></span>{{ $t('purchaseCommissionDecision.supplierRecommendation') }}
      </p>
      <el-form-item style="width: 100%;" label-width="0">
        <purchaseRecommend @getPurchaseList="getPurchaseList" :disabled="disabled" ref="purchaseRecommend"
          :formData="form" :supplyList="supplyList" :isPdfDown="isPdfDown"></purchaseRecommend>
      </el-form-item>
      <p class="table-title bgTitle " style="width: 100%;" v-if="!isPdfDown">
        <span></span>{{ $t('purchaseCommissionDecision.technicalEvaluation') }}
      </p>
      <el-form-item style="width: 100%;" label-width="0">
        <technicalEvaluation :disabled="disabled" ref="technicalEvaluation" :formData="form" :supplyList="supplyList"
          :isPdfDown="isPdfDown"></technicalEvaluation>
      </el-form-item>
      <p class="table-title bgTitle" style="width: 100%;">
        <span></span>{{ $t('purchaseCommissionDecision.conclusion') }}
      </p>
      <el-form-item style="width: 100%;" label-width="0">
        <el-form-item :label="$t('commonContent.description')" style="width: 96%">
          <el-input type="textarea" v-if="!disabled" autosize v-model="form.remark"></el-input>
          <div v-else>{{ form.remark }}</div>
        </el-form-item>
        <el-form-item :label="$t('commonContent.attachments')" style="width: 96%">
          <upload :isHistory="isHistory" :fileList="form.fileList" btnName="上传" @handleRequest="handleRequestFile"
            :multiple="true" :showFileList="true"></upload>
        </el-form-item>    
      </el-form-item>
      <!-- <el-form-item label="采购委员会决议附件" prop="fileList" style="width: 96%">
        <upload :isHistory="isHistory"  :fileList="form.fileList" btnName="上传" @handleRequest="handleRequest" :multiple="true"
          :showFileList="true"></upload>
      </el-form-item>
        <span></span>其他信息
      </p>
      <el-form-item label="相关采购申请" style="width: 96%">
        <div class="flex">
          <el-select filterable clearable v-model="form.purchaseApplyNo">
            <el-option v-for="item in purchaseApplyList" :key="item.id" :label="item.titleName"
              :value="item.applyNo"></el-option>
          </el-select>
          <p @click="toPath" class="detailLink">{{ $t('commonContent.viewDetails') }}</p>
        </div>
      </el-form-item>
      <el-form-item label="备注" style="width: 96%">
        <el-input type="textarea" autosize v-model="form.remark"></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('commonContent.isSignFor')" style="width: 96%">
            <el-radio-group :disabled="disabled" v-model="form.isSignFor">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { getFormatDate, deepClone } from "@/util/util";
import businessNegotiation from './components/businessNegotiation.vue'
import PurchaseCommissionDecisionApplyApi from "@/api/purchaseCommissionDecisionApplication/index";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import upload from "@/components/upload/index";
import { mapGetters } from "vuex";
import purchaseRecommend from './components/purchaseRecommend'
import technicalEvaluation from './components/technicalEvaluation'
import priceAnalysis from './components/priceAnalysis'
import recordFile from './components/recordFile'
import autoAddress from '@/components/autoAddress/index'
export default {
  components: {
    autoAddress,
    upload, businessNegotiation, purchaseRecommend, technicalEvaluation, priceAnalysis, recordFile
  },
  data() {
    return {
      supplyList: [],
      userList: [],
      purchaseList: [],
      purchaseApplyList: [],
      businessId: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
      applyNo: null,
      isHistory: false,
      form: {
        isSignFor:'',
        projectDesc: null,
        deptIds: [],
        fileList: [],
        priceFileList: [],
        titleName: null,
        applyPerson: null,
        applyDeptName: null,
        applyDate: null,
        applyNo: null,
        applyDesc: null,
        purchaseApplyNo: null,
        remark: null,
        supplierAssessorName: null,
        supplierAssessor: null,
        assessorDeptName: null,
        wbsNo: null,
        assessorDept: null
      },
      rules: {
        titleName: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        purchaseApplyNo: [
          { required: true, message: '请选择一般采购申请', trigger: 'blur' }
        ],
        applyDesc: [
          { required: true, message: '请输入申请事由', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '请上传采购委员会决议附件' }
        ],
        supplierAssessorName: [
          { required: true, message: '请选择供应商评估员', trigger: 'change' }
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
    this.form.titleName = ('采购委员会决议申请' +
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
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
    this.getPurchaseApplyList();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return (this.businessId || this.applyNo) && !this.isEdit && this.form.flow && this.form.flow.taskDefinitionKey !== 'applyDepts';
    },
    isFanDa(){
      return this.form.flow&&this.form.flow.assigneeName==='范达'&&this.form.flow.taskName==='会签审批'
    }
  },
  methods: {
    async getDetail() {
      let res = await PurchaseCommissionDecisionApplyApi.details(this.businessId, this.applyNo);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.applyPerson = this.form.applyPerson + ''
        this.isHistory = (this.form.opinion || this.form.source)
      }
      this.$emit("getFormData", this.form);
      this.supplyList = this.form.potentialSupplierList.map(ele => ele.supplierName)
    },
    updateSupply(key, index) {
      this.$refs.purchaseRecommend.updateSupply(key, index)
      this.$refs.technicalEvaluation.updateSupply(key, index)
    },
    async getPurchaseApplyList() {
      let res = await PurchaseApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseApplyList = res.data.data;
      }
    },
    getPurchaseList(data, supplyList) {
      this.purchaseList = data.purchaseSupplierEvalResultList
      this.purchaseList.map((ele, index) => {
        ele.supplierName = supplyList[index]
      })
      this.$refs.businessNegotiation.updateData(this.purchaseList)
    },
    changePurchaseType(v) {
      if (v === 2 || v === 3) {
        this.form.purchaseApplyNo = null
      }
    },
    getSupplyList(data) {
      // console.log('getSupplyList')
      this.supplyList = data
      // console.log(this.supplyList)
    },
    getPersonAssessor(data) {
      this.form.supplierAssessorName = data.realName
      this.form.supplierAssessor = data.id
      this.form.assessorDeptName = data.deptName
      this.form.assessorDept = data.deptId
    },
    getPurchaseRow() {
      let row = this.purchaseApplyList.find(ele => {
        return ele.applyNo === this.form.purchaseApplyNo
      })
      this.form.purchaseApplyName = row.titleName
    },

    toPath() {
      if (this.form.purchaseApplyNo) {
        let url = `/purchaseApplication?purchaseApplyNo=${this.form.purchaseApplyNo}`
        window.open(this.$router.resolve({ path: url }).href, '_blank')
      }
    },
    dealData() {
      let businessNegotiationForm = this.$refs.businessNegotiation.form
      this.form.purchaseSupplierEvalItemList = this.$refs.purchaseRecommend.purchaseList
      this.form.assessorDate = this.$refs.purchaseRecommend.form.assessorDate
      this.form.purchaseSupplierEvalItemSecondList = this.$refs.technicalEvaluation.tableData
      this.form.priceAnalysisList = this.$refs.priceAnalysis.tableData
      let baseRecordForm = this.$refs.recordFile.form
      if (businessNegotiationForm.recommentSupplierName) {
        businessNegotiationForm.recommentSupplierName = businessNegotiationForm.recommentSupplierName.toString()
      }
      this.form = { ...this.form, ...businessNegotiationForm, ...baseRecordForm }
      this.form.projectDesc = businessNegotiationForm.projectDesc

      this.form.priceFileList.map(ele => {
        if (ele.originalUrl) {
          ele.url = ele.originalUrl
        }
      })
      this.form.recordFileList.map(ele => {
        if (ele.originalUrl) {
          ele.url = ele.originalUrl
        }
      })
      this.form.recommentSupplierName = businessNegotiationForm.recommentSupplierName || baseRecordForm.recommentSupplierName
      // console.log(businessNegotiationForm)
      // console.log(this.form.recommentSupplierName)
    },
    resetData() {
      let businessNegotiationForm = this.$refs.businessNegotiation.form
      if (businessNegotiationForm.recommentSupplierName) {
        businessNegotiationForm.recommentSupplierName = businessNegotiationForm.recommentSupplierName.split(',')
      }
    },
    async testForm() {
      this.dealData()

      const list = this.form.potentialSupplierList.filter(ele => {
        return ele.supplierName
      })
      if (list.length === 0) {
        this.$message.error('请填写潜在供应商')
        this.resetData()
        return
      }
      let valueBusiness = await this.$refs.businessNegotiation.testForm()
      console.log(valueBusiness + 'valueBusiness')
      if (!valueBusiness) {
        this.resetData()
        return
      }

      return new Promise((resolve) => {
        this.$refs.form.validate((valid, msg) => {
          resolve(valid);
          if (valid) {
          } else {
            this.resetData()
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
    async getDepartment() {
      if (this.businessId) return
      let res = await getDept(this.userInfo.dept_id || this.userInfo.deptId);
      this.form.applicationDept = res.data.data.id;
      this.form.applyDeptName = res.data.data.deptName
      this.form.applyDept = res.data.data.id
    },
    handleRequest(data, list) {
      console.log(list)
      this.form.priceFileList = list;
    },
    handleRequestFile(data, list) {
      this.form.fileList = list;
    }
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

.bgTitle {
  background: #DCDFE6;
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

.stop-scroll {
  overflow: hidden;
  position: fixed;
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

.table-now {}</style>
