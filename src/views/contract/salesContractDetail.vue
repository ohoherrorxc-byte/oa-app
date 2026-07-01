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
        <el-select v-model="form.applicationDept" disabled>
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
        <el-input v-model="form.approvalCode" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="币种">
        <el-select v-model="form.currency" clearable>
          <el-option
            v-for="item in currencyList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税率" prop="assetNumber">
        <el-input v-model="form.taxRate" clearable></el-input>
      </el-form-item>
      <el-form-item label="合同金额(原币)" prop="assetNumber">
        <el-input v-model="form.salesContractTotalAmountOriginal" clearable></el-input>
      </el-form-item>
      <el-form-item label="合同金额(人民币)" prop="assetNumber">
        <el-input v-model="form.salesContractTotalAmountRmb" clearable></el-input>
      </el-form-item>
      <el-form-item label="申请说明" style="width: 96%">
        <el-input type="textarea" v-model="form.applyDesc"></el-input>
      </el-form-item>

      <p class="table-title" style="width: 96%;">
        <span></span>合同信息
      </p>
      <el-form-item label="销售类型">
        <el-select v-model="form.salesType" clearable>
          <el-option
            v-for="item in saleTypeList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇率" prop="assetNumber">
        <el-input v-model="form.exchangeRate" clearable></el-input>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-select v-model="form.custId" @change="custChange" clearable>
          <el-option
            v-for="item in custList"
            :value="item.id"
            :key="item.id"
            :label="item.custName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同金额" prop="assetNumber">
        <el-input v-model="form.salesContractTotalAmountOriginal" clearable></el-input>
      </el-form-item>
      <el-form-item label="合同开始日期">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.startDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="合同结束日期">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.endDate"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="合同实施日期" style="width: 96%">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          v-model="form.implementTime"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="会签部门">
        <el-select v-model="form.deptIds" multiple>
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关项目">
        <el-select v-model="form.projectId" clearable>
          <el-option
            v-for="item in projectList"
            :value="item.id"
            :key="item.id"
            :label="item.projectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型">
        <el-select v-model="form.salesContractType + ''" clearable>
          <el-option
            v-for="item in salesContractTypeList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类别">
        <el-select v-model="form.salesContractCategory + ''" clearable>
          <el-option
            v-for="item in salesContractCategoryList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款方式">
        <el-select v-model="form.payMethod + ''" clearable>
          <el-option
            v-for="item in payMethodList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同履行地点" prop="assetNumber">
        <el-input v-model="form.contractPerformancePlace" clearable></el-input>
      </el-form-item>

      <p class="table-title">
        <span></span>合同明细
      </p>
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
          <el-table-column label="品名">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="详述及技术性能">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsDetail"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单位">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.number"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="是否含税">
            <template slot-scope="scope">
              <el-select v-model="scope.row.includeTax" clearable>
                <el-option
                  v-for="item in includeTaxList"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="销售价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.salesPrice"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <p class="table-title">
        <span></span>收款明细
      </p>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addReceiveDetailRow">+</span>
          <span class="dec-icon" @click="deleteReceiveDetailRow">―</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.saleContractReceiveDetailList"
          @selection-change="receiveDetailSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column type="selection" width="42"></el-table-column>
          <el-table-column label="预计收款日期">
            <template slot-scope="scope">
              <el-date-picker
                style="width: 100%"
                value-format="yyyy-MM-dd"
                clearable
                v-model="scope.row.expectReceiveDate"
                type="date"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="收款比例">
            <template slot-scope="scope">
              <el-input v-model="scope.row.receiveProportion"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="收款金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.receiveAmount"></el-input>
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
          :data="form.salesContractCustContactList"
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
import { getFormatDate } from "@/util/util";
import {getSalesContractDetail} from "@/api/contract/salesContractNew";
import { getDictionary } from "@/api/system/dict";
import { getCustList } from "@/api/contract/contractCustomer";
import { getProjectList } from "@/api/contract/contractProject";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
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
      id: null,
      isEdit: false,
      tenantId: 629965,
      parentId: "",
      saleContractDetailMultipleSelection: [],
      receiveDetailMultipleSelection: [],
      custContactMultipleSelection: [],
      form: {
        titleName: null,
        applyPerson: null,
        applicationDept: null,
        applyDate: null,
        approvalCode: null,
        currency: '',
        taxRate: null,
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
        payMethod: '',
        custId: null,
        projectId: null,
        contractPerformancePlace: null,
        deptIds: [],
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
        salesContractCustContactList: [
          {
            key: Date.now(),
          },
        ],
      },
    };
  },

  mounted() {
    this.id = this.$route.query.id;
    this.form.applyDate = getFormatDate();
    this.form.applyPerson = this.userInfo.user_id;
    this.isEdit = this.$route.query.isEdit;
    if (this.id) {
      this.getDetail(this.id);
    }
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
      return this.id && !this.isEdit;
    },
  },
  methods: {
    getDetail(id) {
      getSalesContractDetail(id).then((res) => {
        if (res.data.code === 0){
          this.form = res.data.data;
        }
      });
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
      this.form.salesContractCustContactList.push({
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
      this.form.salesContractCustContactList = this.form.salesContractCustContactList.filter((ele) => {
        return !keys.includes(ele.key) || !ids.includes(ele.id);
      });
    },
    custChange(data) {
      this.custList.forEach((cust) => {
        if (cust.id === data) {
          this.form.salesContractCustContactList = cust.salesContractCustContactList;
        }
      });
    },
    async getDepartment() {
      if(this.id)return
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
