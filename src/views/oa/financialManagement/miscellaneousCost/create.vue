<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('miscellaneousCost.applyInfo') }}
    </p>
    <el-form :disabled="disabled" ref="form" :model="form" :rules="rules" label-width="160px">
      <el-row>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.havePurchaseApply')" prop="havePurchaseApply">
            <el-select v-model="form.havePurchaseApply" placeholder="请选择" @change="getPurchase">
              <el-option value="是"></el-option>
              <el-option value="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.PaymentType')" prop="paymentType">
            <el-select v-model="form.paymentType" placeholder="请选择" @change="getPaymentType">
              <el-option value="货物付款"></el-option>
              <el-option value="服务付款"></el-option>
              <el-option value="其他"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.relatedPurchaseApply')" prop="purchaseApplyId">
            <div class="flex">
              <el-select filterable v-if="!disabled" v-model="form.purchaseApplyId"
                :disabled="form.havePurchaseApply === '否'" @change="getRelationBill">
                <el-option v-for="item in purchaseApplyList" :key="item.id" :label="item.titleName"
                  :value="item.id"></el-option>
              </el-select>
              <div v-else class="font12">{{ form.purchaseApplyName }}</div>
              <p @click="toPath" class="detailLink font12" v-if="form.purchaseApplyName">
                {{ $t('commonContent.viewDetails') }}</p>
            </div>
            <!-- <el-input v-model="form.purchaseApplyName" ></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.purchaseApplyNo')" prop="purchaseApplyNo">
            <el-input v-if="!disabled" v-model="form.purchaseApplyNo" disabled></el-input>
            <div v-else class="font12">{{ form.purchaseApplyNo }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.costCenter')" prop="costName">
            <el-select v-if="!disabled" disabled v-model="form.costName" @change="getCostItem">
              <el-option v-for="item in costList" :label="item.costName" :value="item.costName"></el-option>
            </el-select>
            <div v-else class="font12">{{ form.costName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.purchaseAmount')" prop="purchaseAmount">
            <el-input v-if="!disabled" v-model="form.purchaseAmount" disabled></el-input>
            <div v-else class="font12">{{ form.purchaseAmount }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.budgetProject')" prop="subjectId">
            <elSelectTree :value="{ name: form.subjectName }" v-if="!disabled && form.havePurchaseApply !== '是'"
              @getValue="getSubjetRow" :options="subjectList" :accordion="false" :props="deptProps"></elSelectTree>
            <!-- <el-input v-else disabled v-model="form.subjectName"></el-input> -->
            <div v-else class="font12">{{ form.subjectName }}</div>
            <!-- <avue-input-tree v-if="!disabled" :defaultExpandAll="true" :disabled="form.havePurchaseApply === '是'" ref="tree"
              :check-strictly="true" node-key="id" v-model="form.subjectId" placeholder="请选择内容" :dic="subjectList"
              :props="deptProps" @change="getSubjetRow"></avue-input-tree>
              <el-input v-else disabled v-model="form.subjectName"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.subjectCode')" prop="subjectCode">
            <el-input v-if="!disabled" v-model="form.subjectCode" disabled></el-input>
            <div v-else class="font12">{{ form.subjectCode }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item :label="$t('miscellaneousCost.budgetInfo')" prop="budgetInfo">
            <el-input type="textarea" disabled :rows="3" v-model="form.budgetInfo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.payType')" prop="payType">
            <el-select v-if="!disabled" v-model="form.payType" @change="changePayType">
              <el-option value="对公付款"></el-option>
              <el-option value="对私付款"></el-option>
            </el-select>
            <div v-else class="font12">{{ form.payType }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.supplierName')" prop="supplierId">
            <el-select v-if="!disabled" v-model="form.supplierId" clearable filterable @change="getSupplyRow"
              :disabled="form.payType === '对私付款'">
              <el-option v-for="item in supplyList" :key="item.id" :label="item.supplierName"
                :value="item.id"></el-option>
            </el-select>
            <div v-else class="font12">{{ form.supplierName }}</div>
            <!-- <el-input v-model="form.supplierName"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.payee')" prop="payee">
            <autoAddress v-if="!disabled" placeholder="" ref="autoAddress" :initList="initList" class="w-100"
              @getPerson="getPerson" :initData="form.payee" :disabled="form.payType === '对公付款'" :multiple="false">
            </autoAddress>
            <div v-else class="font12">{{ form.payee }}</div>
          </el-form-item>
          <!-- <el-form-item label="收款人" prop="payee">
            <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100" @getPerson="getPerson"
              :initData="form.payee" :disabled="form.payType === '对公付款'" :multiple="false">
            </autoAddress>
          </el-form-item> -->
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.bankName')" prop="bankName">
            <el-input v-if="!disabled" v-model="form.bankName" disabled></el-input>
            <div v-else class="font12">{{ form.bankName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item :label="$t('miscellaneousCost.bankAccount')" prop="bankAccount">
            <el-input v-if="!disabled" v-model="form.bankAccount" disabled></el-input>
            <div v-else class="font12">{{ form.bankAccount }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="table-title">
        <span></span>{{ $t('miscellaneousCost.paymentInfo') }}
      </p>
      <div class="text-r mb10" v-if="!disabled">
        <span class="add-icon" @click="addRow">+</span>
      </div>
      <el-table ref="multipleTable" :data="form.payInfoList" :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }"
        class="mb20 table-now">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="{row}">
            {{ $t('miscellaneousCost.detail') }}
            <span class="red">*</span>
          </template>
          <template slot-scope="scope">
            <el-form-item label-width="0px" :prop="'payInfoList.' + scope.$index + '.detail'" :rules="{
              required: true, message: $t('miscellaneousCost.detailRequired')
            }">
              <el-input v-if="!disabled" clearable v-model="scope.row.detail" placeholder="请输入明细"></el-input>
              <div v-else class="font12">{{ scope.row.detail }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot="header">
            {{ $t('miscellaneousCost.amount') }}
            <span class="red">*</span>
          </template>
          <template slot-scope="scope">
            <el-form-item label-width="0px" :prop="'payInfoList.' + scope.$index + '.amount'" :rules="{
              required: true, message: $t('miscellaneousCost.amountRequired')
            }">
              <el-input v-if="!disabled" clearable v-model="scope.row.amount" @change="getTotal"
                placeholder="请输入金额"></el-input>
              <div v-else class="font12">{{ scope.row.amount }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="$t('miscellaneousCost.operation')" align="center"
          v-if="!disabled && form.payInfoList.length > 1" width="100">
          <template slot-scope="scope">
            <el-form-item label-width="0px">
              <el-button type="text" @click="deleteRow(scope.row)"
                style="color:red">{{ $t('miscellaneousCost.delete') }}</el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item :disabled="disabled && !financialBillPerson()" v-if="form.paymentType !== '其他'" :label="$t('commonContent.QuotationStamped')" style="width: 100%;"
          prop="quotationStampedList" label-width="140px" :required="true">
          <upload :isHistory="isHistory" :fileList="form.quotationStampedList" btnName="上传"
            @handleRequest="handleRequestQuotationStampedList" :multiple="true" :showFileList="true"></upload>
        </el-form-item>
        <el-form-item :disabled="disabled && !financialBillPerson()"  :label="$t('bom.pay.invoice')" style="width: 100%;" prop="invoiceList" label-width="140px">
          <upload :isHistory="isHistory" :fileList="form.invoiceList" btnName="上传" @handleRequest="handleRequestInvoice"
            :multiple="true" :showFileList="true"></upload>
        </el-form-item>
        <el-form-item :disabled="disabled && !financialBillPerson()" :required="true" v-if="form.paymentType !== '其他'"
          :label="form.paymentType === '货物付款' ? $t('commonContent.Receipt') : $t('commonContent.ServiceDeliverables')"
          style="width: 100%;" prop="signOrDeliverList" label-width="140px">
          <upload :isHistory="isHistory" :fileList="form.signOrDeliverList" btnName="上传"
            @handleRequest="handleRequestSignOrDeliverList" :multiple="true" :showFileList="true"></upload>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item>
          <div class="flex">
            <el-button type="primary" v-if="disabled" @click="downBranch">批量打印PDF文件</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-form>
  </basic-container>
</template>

<script>
import workOvertimeApi from "@/api/workOvertime/index";
import { mapGetters } from "vuex";
import { mixins } from "../Mixin";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import UserApi from '@/api/organizationalStructure/user.js'
import upload from '@/components/upload/index'
import { mergePDFs } from "@/util/util";
// 打印功能已停用
// import printJS from "print-js";
export default {
  mixins: [mixins],
  components: { upload },
  data() {
    return {
      form: {
        payInfoList: [{}],
        supplierId: null,
        costName: null,
        subjectId: null,
        subjectCode: null,
        subjectName: null,
        budgetInfo: null,
        purchaseApplyName: null,
        purchaseApplyNo: null,
        purchaseApplyId: null,
        purchaseAmount: null,
        payee: null,
        payeeId: null,
        bankAccount: null,
        bankName: null,
        signOrDeliverList: [],
        invoiceList: [],
        paymentType: null,
        quotationStampedList: [],
      },
      purchaseApplyList: [],
      rules: {
        havePurchaseApply: [
          { required: true, message: this.$t('miscellaneousCost.havePurchaseApplyRequired'), trigger: "change" },
        ],
        signOrDeliverList: [
          { required: true, message: this.$t('purchase.pleaseEnter'), trigger: "change" },
        ],
        invoiceList: [
          { required: true, message: this.$t('purchase.pleaseEnter'), trigger: "change" },
        ],
        quotationStampedList: [
          { required: true, message: this.$t('purchase.pleaseEnter'), trigger: "change" },
        ],
        payType: [
          { required: true, message: this.$t('miscellaneousCost.payTypeRequired'), trigger: "change" },
        ],
        purchaseApplyId: [
          { required: true, message: this.$t('miscellaneousCost.relatedPurchaseApplyRequired'), trigger: "change" },
        ],
        // purchaseApplyNo: [
        //   { required: true, message: "请输入采购申请编号", trigger: "change" },
        // ],
        paymentType: [
          { required: true, message: this.$t('miscellaneousCost.paymentTypeRequired'), trigger: "change" },
        ],
        costName: [
          { required: true, message: this.$t('miscellaneousCost.costNameRequired'), trigger: "change" },
        ],
        // purchaseAmount: [
        //   { required: true, message: "请输入一般采购金额", trigger: "change" },
        // ],
        subjectId: [
          { required: true, message: this.$t('miscellaneousCost.subjectIdRequired'), trigger: "change" },
        ],
        supplierId: [
          { required: false, message: this.$t('miscellaneousCost.supplierNameRequired'), trigger: "change" },
        ],
        payee: [
          { required: false, message: this.$t('miscellaneousCost.payeeRequired'), trigger: "change" },
        ],
        bankName: [
          { required: false, message: this.$t('miscellaneousCost.bankNameRequired'), trigger: 'change' }
        ],
        bankAccount: [
          { required: false, message: this.$t('miscellaneousCost.bankAccountRequired'), trigger: 'change' }
        ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
      halfSpan: 11
    };
  },
  props: {
    slotForm: {
      type: Object,
      default: {}
    },
    isPdfDown: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.getSupplier()
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    if (this.isMobile) {
      this.halfSpan = 22
    }
    this.getPurchaseApplyList()

  },
  computed: {
    ...mapGetters(["isMobile"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    financialBillPerson() {
      return this.form.flow && this.form.flow.assigneeName === '黄蓓川'
    },
    async getDetail() {
      let res = await workOvertimeApi.pettyCostPay(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        console.log(this.form)
        this.getSupplyRow(this.form.supplierId)
        this.getFeeDetail()
        this.getPurchase()
        this.$refs.form.clearValidate();
        this.$emit("getFormData", this.form);
      }
    },
    async downBranch(){
      let arr = this.form.quotationStampedList.concat(this.form.invoiceList)
      arr = arr.concat(this.form.signOrDeliverList)
      const pdfBlobs = await Promise.all(
        arr.map(async file => {
          const url = file.temUrl || file.url;
          const response = await fetch(url);
          return response.blob();
        })
      );
      // console.log(pdfBlobs)
      // Merge PDFs and print
      const mergedPdf = await mergePDFs(pdfBlobs);
      // printJS({
      //   printable: URL.createObjectURL(mergedPdf),
      //   type: 'pdf',
      //   showModal: true
      // });
      // 打印功能已停用
    },
    async getSupplier() {
      let res = await UserApi.contractSupplierAll('')
      if (res.data.code === 0 || res.data.code === 200) {
        this.supplyList = res.data.data
      }
    },
    handleRequestQuotationStampedList(data, arr) {
      arr.map(ele => {
        ele.businessName = 'quotationStampedMiscellaneousCost'
      })
      this.form.quotationStampedList = arr
    },
    handleRequestInvoice(data, arr) {
      arr.map(ele => {
        ele.businessName = 'invoiceListMiscellaneousCost'
      })
      this.form.invoiceList = arr
    },
    handleRequestSignOrDeliverList(data, arr) {
      arr.map(ele => {
        ele.businessName = 'signOrDeliverMiscellaneousCost'
      })
      this.form.signOrDeliverList = arr
    },
    getTripList() { },
    toPath() {
      if (this.form.purchaseApplyId) {
        let url = `/purchaseApplication?businessId=${this.form.purchaseApplyId}`
        window.open(this.$router.resolve({ path: url }).href, '_blank')
        // this.$router.push(`/purchaseApplication?businessId=${this.form.purchaseApplyId}`)
      }
    },
    getRelationBill() {
      let row = this.purchaseApplyList.find(ele => {
        return ele.id === this.form.purchaseApplyId
      })
      console.log(row)
      this.form.purchaseApplyName = row.titleName
      this.form.purchaseApplyNo = row.applyNo
      this.form.purchaseAmount = row.totalAmountRmb

    },
    getPaymentType() { },
    async getPurchaseApplyList() {
      let res = await PurchaseApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseApplyList = res.data.data;
      }
    },
    changePayType() {
      this.rules.supplierId[0].required = this.form.payType === '对公付款' ? true : false
      this.rules.bankAccount[0].required = this.form.payType === '对公付款' ? true : false
      this.rules.bankName[0].required = this.form.payType === '对公付款' ? true : false
      this.rules.payee[0].required = this.form.payType === '对私付款' ? true : false
      this.form.supplierId = ''
      this.form.supplierName = ''
      this.form.payee = ''
      this.form.payeeId = ''
      this.form.bankAccount = ''
      this.form.bankName = ''
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    getPurchase() {
      if (this.form.havePurchaseApply === '是') {
        this.form.costName = null
        this.form.subjectId = null
        this.form.subjectCode = null
        this.form.subjectName = null
        this.form.budgetInfo = null
      } else if (this.form.havePurchaseApply === '否') {
        this.form.purchaseApplyName = null
        this.form.purchaseApplyNo = null
        this.form.purchaseApplyId = null
        this.form.purchaseAmount = null
      }
      this.rules.costName[0].required = this.form.havePurchaseApply === '否' ? true : false
      this.rules.purchaseApplyId[0].required = this.form.havePurchaseApply === '否' ? false : true
      // this.rules.purchaseApplyNo[0].required = this.form.havePurchaseApply === '否' ? false : true
      // this.rules.purchaseAmount[0].required = this.form.havePurchaseApply === '否' ? false : true
      this.rules.subjectId[0].required = this.form.havePurchaseApply === '否' ? true : false
      // console.log(this.rules.subjectId)
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    getTotal() {
      var arr = this.form['payInfoList'].map(ele => Number(ele.amount) || 0)
      var sum = arr.reduce(function (a, b) { return a + b }, 0)
      this.$emit('allTotalAmount', sum)
    },
    getPerson(data) {
      console.log('getPerson')
      console.log(data)
      this.form.payeeId = data.id
      this.form.payee = data.realName
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate();
      // })
    },
    addRow() {
      this.form.payInfoList.push({
        key: Date.now(),
        detail: null,
        amount: null,
      });
    },
    deleteRow(row) {
      this.form.payInfoList = this.form.payInfoList.filter((ele) => {
        return ele !== row;
      });
      this.getTotal()
    },
    testForm() {
      // console.log(this.form)
      if(this.form.flow&&this.form.flow.status==='unfinished'){
        return true
      }
      if(this.form.quotationStampedList&&this.form.quotationStampedList.length===0&&this.form.paymentType!=='其他'){
        this.$message.error('请上传（盖章）报价单')
        return
      }
      if(!this.form.signOrDeliverList||this.form.signOrDeliverList.length===0&&this.form.paymentType!=='其他'){
        this.$message.error('请上传签收单或服务交付物')
        return
      }
      if (!this.slotForm.applyReason) {
        this.$message.error(this.$t('miscellaneousCost.applyReasonRequired'))
        return false
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
        });
      });
    },
    submit(val) {
      this.form.payInfoList = val;
      this.payInfoList = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
  cursor: pointer;
}</style>
