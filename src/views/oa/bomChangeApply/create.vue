<template>
  <basic-container>
    <p class="table-title">
      <span></span>BOM框架合同调整上限申请
    </p>
    <div class="flex-space mr20">
      <div v-if="!disabled">
        <span class="add-icon" @click="addRow">+</span>
      </div>
    </div>
    <div>
      <el-form ref="form" :model="form" :disabled="disabled">
        <el-table
          ref="multipleTable"
          :data="form.applyList"
          class="mb20 table-now"
        >
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column align="center" width="320">
            <template slot="header">
              合同标题
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.bomContractName'"
                :rules="[{ required: true, message: '请选择合同标题' }]"
              >
                <el-select
                  v-model="scope.row.bomContractName"
                  clearable
                  filterable
                  placeholder="请选择合同标题"
                  @visible-change="handleContractDropdownVisible"
                  @change="bomPurchaseContractChange($event, scope.row)"
                >
                  <el-option
                    v-for="item in bomPurchaseContractList"
                    :key="item.applyNo"
                    :label="`${item.titleName} (${item.applyNo})`"
                    :value="item.titleName"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="260">
            <template slot="header">
              合同编号
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.bomContractNo'"
                :rules="[{ required: true, message: '请输入合同编号' }]"
              >
                <el-input
                  v-model="scope.row.bomContractNo"
                  clearable
                  placeholder="合同编号"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="160">
            <template slot="header">
              原来金额
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.bomAmount'"
                :rules="[{ required: true, message: '请输入原来金额' }]"
              >
                <el-input
                  v-model="scope.row.bomAmount"
                  clearable
                  placeholder="原来金额"
                  @input="calculateNewAmount(scope.row)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="160">
            <template slot="header">
              增加金额
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.addAmount'"
                :rules="[{ required: true, message: '请输入增加金额' }]"
              >
                <el-input
                  v-model="scope.row.addAmount"
                  clearable
                  placeholder="增加金额"
                  @input="calculateNewAmount(scope.row)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="180">
            <template slot="header">
              新的上限金额
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.newAmount'"
                :rules="[{ required: true, message: '请输入新的上限金额' }]"
              >
                <el-input
                  v-model="scope.row.newAmount"
                  clearable
                  placeholder="新的上限金额"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!disabled"
            label="操作"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-button
                  type="text"
                  style="color: red"
                  @click="deleteRow(scope.row)"
                >
                  删除
                </el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </basic-container>
</template>

<script>
import BomChangeApply from "@/api/bomChangeApply/index";
import BomPurchaseContractApplyApi from "@/api/bomPurchaseContractApply/index";
import { mapGetters } from "vuex";

const createEmptyRow = () => ({
  key: Date.now(),
  applyId: "",
  bomContractName: "",
  bomContractNo: "",
  bomId: "",
  bomAmount: "",
  addAmount: "",
  newAmount: "",
});

export default {
  data() {
    return {
      option: [
        {
          column: [
            {
              label: "合同标题",
              prop: "bomContractName",
              rules: [{ required: true, message: "请输入合同标题" }],
            },
            {
              label: "合同编号",
              prop: "bomContractNo",
              rules: [{ required: true, message: "请输入合同编号" }],
            },
            {
              label: "合同ID",
              prop: "bomId",
              rules: [{ required: true, message: "请输入合同ID" }],
            },
            {
              label: "原来金额",
              prop: "bomAmount",
              rules: [{ required: true, message: "请输入原来金额" }],
            },
            {
              label: "增加金额",
              prop: "addAmount",
              rules: [{ required: true, message: "请输入增加金额" }],
            },
            {
              label: "新的上限金额",
              prop: "newAmount",
              rules: [{ required: true, message: "请输入新的上限金额" }],
            },
          ],
        },
      ],
      categoriesList: [],
      placeList: [],
      bomPurchaseContractList: [],
      form: {
        applyList: [createEmptyRow()],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
    };
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
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
      const res = await BomChangeApply.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    addRow() {
      this.form.applyList.push(createEmptyRow());
    },
    deleteRow(row) {
      this.form.applyList = this.form.applyList.filter((ele) => ele !== row);
    },
    testForm() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
        });
      });
    },
    async getBomPurchaseContractList() {
      if (this.bomPurchaseContractList.length > 0) {
        return;
      }
      const res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.bomPurchaseContractList = res.data.data;
      }
    },
    handleContractDropdownVisible(visible) {
      if (visible) {
        this.getBomPurchaseContractList();
      }
    },
    bomPurchaseContractChange(val, row) {
      for (const ele of this.bomPurchaseContractList) {
        if (val == ele.titleName || val == ele.applyNo) {
          row.bomContractNo = ele.applyNo;
          row.bomContractName = ele.titleName;
          row.bomId = ele.id;
          row.bomAmount = ele.contractLimitAmount;
          this.calculateNewAmount(row);
          break;
        }
      }
    },
    calculateNewAmount(row) {
      const bomAmount = Number(row.bomAmount);
      const addAmount = Number(row.addAmount);
      if (!Number.isNaN(bomAmount) && !Number.isNaN(addAmount)) {
        row.newAmount = String(bomAmount + addAmount);
      }
    },
    submit(val) {
      this.form.applyList = val;
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