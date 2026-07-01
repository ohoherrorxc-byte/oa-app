<template>
  <basic-container>
    <p class="table-title">
      <span></span>基本信息
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="标题" prop="assetNumber" style="width: 96%">
        <el-input v-model="form.titleName" clearable></el-input>
      </el-form-item>
      <el-form-item label="申请人" prop="assetNumber">
        <el-select v-model="form.applyPerson" disabled>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请部门" prop="assetNumber">
        <el-select v-model="form.applyDept" disabled>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" prop="assetNumber">
        <el-input v-model="form.applyDate" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="申请编号" prop="assetNumber">
        <el-input v-model="form.applyNo" clearable disabled></el-input>
      </el-form-item>

      <p class="table-title" style="width: 96%;">
        <span></span>申请信息
      </p>
      <el-form-item label="申请类型">
        <el-select v-model="form.purchaseType" clearable>
          <el-option
            v-for="item in purchaseTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统计周期">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.expectedPurchaseDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addSaleContractDetailRow">+</span>
          <span class="dec-icon" @click="deleteSaleContractDetailRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.salesContractDetailNewList"
          @selection-change="saleContractDetailSelectChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="服务类型">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="使用说明">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="服务期检查结果">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsName"></el-input>
            </template>
          </el-table-column>

        </el-table>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { getFormatDate } from "@/util/util";
import LicensePurchaseContractApplyApi from "@/api/licensePurchaseContractApply/index";
import { getDictionary } from "@/api/system/dict";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
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
      saleContractDetailMultipleSelection: [],
      receiveDetailMultipleSelection: [],
      custContactMultipleSelection: [],
      isEmergencyPurchaseList:[
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
        titleName:null,
        salesContractDetailNewList: [
          {
            key: Date.now(),
          },
        ],
        saleContractReceiveDetailList: [
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
    this.form.titleName = ('License数据核对验收单' +
        " - " +
        (this.userInfo.nick_name||this.userInfo.realName||this.userInfo.user_name) +
        " - " +
        getFormatDate())
    this.businessId = this.$route.query.businessId;
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.form.applyDept = this.userInfo.dept_id;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.getDictionary({ code: "CURRENCY" }, "currency");
    this.getDictionary({ code: "PURCHASE_TYPE" }, "purchaseType");
    this.getDeptList();
    this.getDepartment();
    this.getUserList();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await LicensePurchaseContractApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    testForm() {
      console.log(this.form)
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
        } else if (type === "purchaseType"){
          this.purchaseTypeList = res.data.data;
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
