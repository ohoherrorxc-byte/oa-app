<template>
  <basic-container>
    <p class="table-title">
      <span></span>基本信息
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="标题" prop="assetNumber">
        <el-input v-model="form.titleName" clearable></el-input>
      </el-form-item>
      <el-form-item label="申请人" prop="assetNumber">
        <el-input v-model="form.createUserName" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="申请部门" prop="assetNumber">
        <el-input v-model="form.applicationDept" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="申请日期" prop="assetNumber">
        <el-input v-model="form.applyTime" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="申请编号" prop="assetNumber">
        <el-input v-model="form.approvalCode" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="订单说明">
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>

      <p class="table-title">
        <span></span>合同信息
      </p>
      <el-form-item label="销售类型" style="width: 96%;">
        <el-select v-model="form.salesType" clearable disabled>
          <el-option
            v-for="item in saleTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关销售合同">
        <el-select v-model="form.salesContractId" @change="changeSalesContract" clearable>
          <el-option
            v-for="item in salesContractList"
            :key="item.id"
            :label="item.titleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售合同编号" prop="assetNumber">
        <el-input v-model="form.salesContractNo" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="销售合同金额" prop="assetNumber">
        <el-input v-model="form.salesContractTotalAmount" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="汇率" prop="assetNumber">
        <el-input v-model="form.exchangeRate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="币种">
        <el-select v-model="form.currency" clearable disabled>
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税率" prop="assetNumber">
        <el-input v-model="form.taxRate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="PO订单金额(原币)" prop="assetNumber">
        <el-input v-model="form.salesOrderTotalAmountOriginal" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="PO订单金额(RMB)" prop="assetNumber">
        <el-input v-model="form.salesOrderTotalAmountRmb" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-select v-model="form.custId" clearable disabled>
          <el-option
            v-for="item in custList"
            :value="item.id"
            :key="item.id"
            :label="item.custName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关项目">
        <el-select v-model="form.projectId" clearable disabled>
          <el-option
            v-for="item in projectList"
            :value="item.id"
            :key="item.id"
            :label="item.projectName"
          ></el-option>
        </el-select>
      </el-form-item>

      <p class="table-title">
        <span></span>订单明细
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addSaleContractDetailRow">+</span>
          <span class="dec-icon" @click="deleteSaleContractDetailRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.salesOrderDetailNewList"
          @selection-change="saleContractDetailSelectChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="零件名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="零件号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsNo"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="区域">
            <template slot-scope="scope">
              <el-input v-model="scope.row.area"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="车型">
            <template slot-scope="scope">
              <el-input v-model="scope.row.modelName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="周期">
            <template slot-scope="scope">
              <el-input v-model="scope.row.cycle"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="零件数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="工程车数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.engineVehicleNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="量产车数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.productCarNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="总价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.totalPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <p class="table-title">
        <span></span>客户信息
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addCustContactRow">+</span>
          <span class="dec-icon" @click="deleteChooseRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.custContactList"
          @selection-change="custContactSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="客户联系人">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="联系人职位">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactPost"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactTel"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="邮箱">
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
import SaleOrderApplyApi from "@/api/saleOrderApply/index";
import { getDictionary } from "@/api/system/dict";
import { getCustList } from "@/api/contract/contractCustomer";
import { getProjectList } from "@/api/contract/contractProject";
import { getLazyList } from "@/api/organizationalStructure/department";
import { getSalesContractList } from "@/api/contract/salesContractNew";
export default {
  data() {
    return {
      currencyList: [],
      saleTypeList: [],
      payMethodList: [],
      deptList: [],
      custList: [],
      projectList: [],
      salesContractList: [],
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
        titleName: null,
        createUserName: null,
        applicationDept: null,
        applyTime: null,
        approvalCode: null,
        applyDesc: null,
        salesContractId: null,
        salesContractNo: null,
        salesContractTotalAmount: null,
        exchangeRate: null,
        currency: null,
        taxRate: null,
        salesOrderTotalAmountOriginal: null,
        salesOrderTotalAmountRmb: null,
        custId: null,
        projectId: null,
        salesOrderDetailNewList: [
          {
            key: Date.now(),
          },
        ],
        custContactList: [
          {
            key: Date.now(),
          },
        ],
      },
    };
  },

  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.getSalesContractList();
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "SALE_TYPE" }, "saleType");
    this.getDictionary({ code: "PAY_METHOD" }, "payMethod");
    this.getCustList();
    this.getProjectList();
    this.getDeptList();
  },
  computed: {
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await SaleOrderApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.applyPerson =  (this.form.applyPerson||"").toString()
        this.$emit("getFormData", this.form);
      }
    },
    testForm() {
     
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
          if (!valid) {
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
      this.form.salesContractDetailNewList = this.form.salesContractDetailNewList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
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
      this.form.saleContractReceiveDetailList = this.form.saleContractReceiveDetailList.filter(
        (ele) => {
          return !keys.includes(ele.key) || !ids.includes(ele.id);
        }
      );
    },
    custContactSelectionChange(val) {
      this.custContactMultipleSelection = val;
    },
    addCustContactRow() {
      this.form.custContactList.push({
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
      this.form.custContactList = this.form.custContactList.filter((ele) => {
        return !keys.includes(ele.key) || !ids.includes(ele.id);
      });
    },
    getSalesContractList() {
      getSalesContractList().then((res) => {
        this.salesContractList = res.data.data;
      });
    },
    changeSalesContract(val) {
      this.salesContractList.forEach((salesContract) => {
        if (salesContract.id === val) {
          this.form.titleName = salesContract.titleName;
          this.form.createUserName = salesContract.createUserName;
          this.form.applicationDept = salesContract.applicationDept;
          this.form.applyTime = salesContract.applyTime;
          this.form.approvalCode = salesContract.approvalCode;
          this.form.salesContractId = salesContract.id;
          this.form.salesContractNo = salesContract.applyNo;
          this.form.salesContractTotalAmount =
            salesContract.salesContractTotalAmountOriginal;
          this.form.exchangeRate = salesContract.exchangeRate;
          this.form.currency = salesContract.currency;
          this.form.taxRate = salesContract.taxRate;
          this.form.custId = salesContract.custId;
          this.form.projectId = salesContract.projectId;
          if (salesContract.custId != undefined) {
            this.custList.forEach((cust) => {
              if (cust.id === salesContract.custId) {
                this.form.custContactList = cust.tbCustContactList;
              }
            });
          }
        }
      });
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
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.table-now {
}
</style>
