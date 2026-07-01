<template>
  <basic-container>
    <p class="table-title">
      <span></span>申请信息
    </p>
    <el-form :disabled="disabled" ref="form" :model="form" :rules="rules" label-width="160px">
      <el-row>
        <el-col :span="22">
          <el-form-item label="是否存在采购申请" prop="havePurchaseApply">
            <el-select v-model="form.havePurchaseApply" placeholder="请选择">
              <el-option value="是"></el-option>
              <el-option value="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="相关采购申请" prop="purchaseApplyName">
            <!-- <el-input v-model="form.purchaseApplyName"></el-input> -->
            <el-select v-model="form.purchaseApplyId">
              <el-option v-for="item in purchaseApplyList" :key="item.id" :label="item.titleName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="采购申请编号" prop="purchaseApplyNo">
            <el-input v-model="form.purchaseApplyNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="成本中心" prop="costCenter">
            <el-input v-model="form.costCenter"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="一般采购金额" prop="purchaseAmount">
            <el-input v-model="form.purchaseAmount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="预算项目" prop="budgetItems">
            <el-input v-model="form.budgetItems"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="科目代码" prop="subjectCode">
            <el-input v-model="form.subjectCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="预算信息" prop="budgetInfo">
            <el-input v-model="form.budgetInfo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="付款类型" prop="payType">
            <el-input v-model="form.payType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="form.supplierName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="收款人" prop="payee">
            <el-input v-model="form.payee"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="银行开户行" prop="bankName">
            <el-input v-model="form.bankName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="halfSpan">
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input v-model="form.bankAccount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="table-title">
        <span></span>付款信息
      </p>
      <div class="text-r mb10" v-if="!disabled">
        <span class="add-icon" @click="addRow">+</span>
      </div>
      <el-table ref="multipleTable" :data="form.payInfoList" class="mb20 table-now">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="{row}">
            明细
            <span class="red">*</span>
          </template>
          <template slot-scope="scope">
            <el-form-item label-width="0px" :prop="'payInfoList.' + scope.$index + '.detail'" :rules="{
              required: true, message: '明细不能为空'
            }">
              <el-input clearable v-model="scope.row.detail" placeholder="请输入明细"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100">
          <template slot="header">
            金额
            <span class="red">*</span>
          </template>
          <template slot-scope="scope">
            <el-form-item label-width="0px" :prop="'payInfoList.' + scope.$index + '.amount'" :rules="{
              required: true, message: '金额不能为空'
            }">
              <el-input clearable v-model="scope.row.amount" placeholder="请输入金额"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="!disabled" width="100">
          <template slot-scope="scope">
            <el-form-item label-width="0px">
              <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </basic-container>
</template>

<script>
import workOvertimeApi from "@/api/workOvertime/index";
import { mapGetters } from "vuex";
import PurchaseApplyApi from "@/api/purchaseApply/index";
export default {
  data() {
    return {
      form: {
        payInfoList: [],
        purchaseApplyList:[]
      },
      rules: {
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
      halfSpan: 11
    };
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    if (this.isMobile) {
      this.halfSpan = 22
    }
  },
  computed: {
    ...mapGetters(["isMobile"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await workOvertimeApi.pettyCostPay(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    
    async getPurchaseApplyList(){
      let res = await PurchaseApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseApplyList = res.data.data;
      }
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
    },
    testForm() {
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
}
</style>
