<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('budgetApproval.applyInfo') }}
    </p>
    <el-form :disabled="disabled" ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item :label="$t('budgetApproval.projectName')" prop="projectName">
        <el-select v-model="form.projectName" @change="selectProject">
          <el-option v-for="item in projectList" :key="item.id" :label="item.projectName"
            :value="item.projectName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('budgetApproval.projectHead')" prop="projectHead">
        <el-input disabled v-model="form.projectHead"></el-input>
      </el-form-item>
      <el-form-item :label="$t('budgetApproval.totalAmount')" prop="totalAmount">
        <el-input v-model="form.totalAmount" @blur="testAmount"></el-input>
      </el-form-item>
      <el-form-item :label="$t('budgetApproval.subjectType')" prop="subjectType">
        <el-select v-model="form.subjectType" @change="changeSubject">
          <!-- FH-；POC-；ZY- -->
          <el-option value="FH-" label="FH-"></el-option>
          <el-option value="POC-" label="POC-"></el-option>
          <el-option value="ZY-" label="ZY-"></el-option>
        </el-select>
        <div style="color: red;font-size: 12px;">
          {{ $t('budgetApproval.subjectTypeNote') }}
        </div>
      </el-form-item>
      <el-form style="width: 100%;" label-width="100px" :disabled="disabled&&form.flow&&form.flow.taskName!=='财务审核'">
        <el-form-item :label="$t('budgetApproval.subjectCode')" prop="subjectCode" style="width: 90%;">
          <el-input v-model="form.subjectCode"></el-input>
        </el-form-item>
      </el-form>

      <el-form-item :label="$t('budgetApproval.projectAllocation')" style="width: 100%;">
        <div style="color: red;font-size: 12px;">
          {{ $t('budgetApproval.projectAllocationNote') }}
        </div>
        <el-table :data="form.subjectList" style="width: 100%" show-summary :summary-method="getSummaries">
          <el-table-column prop="subjectName" :label="$t('budgetApproval.subjectName')" width="100"
            align="center"></el-table-column>
          <el-table-column v-for="item in labelList" :key="item.key" :label="item.name" :property="item.key"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row[item.key]"
                @blur="getValue(scope.row, scope.row[item.key], item.key)"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { contractProject } from "@/api/myFlow/index";
import { budgetApprovalDetail } from "@/api/myFlow/operate/detail";
import BudgetApprovalApi from '@/api/budgetApproval/index'
export default {
  data() {
    return {
      form: {
        totalAmount: null,
        projectHead: null,
        projectName: null,
        subjectType: null,
        subjectCode: null,
        subjectList: [
          {
            subjectName: this.$t('budgetApproval.fuelPower'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.researchDevelopment'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.scientificAssetMaintenance'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.researchDevelopmentL'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.trialMaterials'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.researchResults'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.cooperativeResearch'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.otherResearch'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
          {
            subjectName: this.$t('budgetApproval.prPoSaving'),
            integratedManagementGroup: null,
            projectGroup: null,
            productGroup: null,
            platformGroup: null,
            productCenterAndDevelopmentGroup: null,
            systemGroup: null,
            qualityAssuranceGroup: null,
            testGroup: null,
          },
        ],
      },
      labelList: [
        {
          name: this.$t('budgetApproval.integratedManagementGroup'),
          key: "integratedManagementGroup",
        },
        {
          name: this.$t('budgetApproval.projectGroup'),
          key: "projectGroup",
        },
        {
          name: this.$t('budgetApproval.productGroup'),
          key: "productGroup",
        },
        {
          name: this.$t('budgetApproval.platformGroup'),
          key: "platformGroup",
        },
        {
          name: this.$t('budgetApproval.productCenterAndDevelopmentGroup'),
          key: "productCenterAndDevelopmentGroup",
        },
        {
          name: this.$t('budgetApproval.systemGroup'),
          key: "systemGroup",
        },
        {
          name: this.$t('budgetApproval.qualityAssuranceGroup'),
          key: "qualityAssuranceGroup",
        },
        {
          name: this.$t('budgetApproval.testGroup'),
          key: "testGroup",
        },
      ],
      rules: {
        projectName: [
          { required: true, message: this.$t('budgetApproval.projectNameRequired'), trigger: "change" },
        ],
        projectGroup: [
          { required: true, message: this.$t('budgetApproval.projectHeadRequired'), trigger: "blur" },
        ],
        totalAmount: [
          { required: true, message: this.$t('budgetApproval.totalAmountRequired'), trigger: "blur" },
        ],
        subjectType: [
          { required: true, message: this.$t('budgetApproval.subjectTypeRequired'), trigger: "change" },
        ]
      },
      rowSum: [],
      projectList: [],
      businessId: null,
      isEdit: false,
    };
  },
  mounted() {
    this.getProject();
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
  },
  computed: {
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await budgetApprovalDetail(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    async getProject() {
      let res = await contractProject();
      this.projectList = res.data.data;
    },
    async changeSubject() {
      // console.log('eewwewewe')
      if (this.form.projectName && this.form.subjectType) {
        let res = await BudgetApprovalApi.getSubjectCode(this.form.projectName, this.form.subjectType)
        if (res.data.code === 200 || res.data.code === 0) {
          this.form.subjectCode = res.data.data
        }
      }


    },
    selectProject() {
      let item = this.projectList.find((ele) => {
        return ele.projectName === this.form.projectName;
      });
      if (item) {
        this.form.projectHead = item.projectManageName;
        this.form.projectHeadId = item.projectManageId;
      }
      this.changeSubject()
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t('budgetApproval.totalAmount');
          return;
        }
        const values = data.map((item) => Number(item[column.property] || 0));

        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        this.rowSum[index] = sums[index];
        sums[index] += this.$t('budgetApproval.yuan');
      });
      return sums;
    },
    testAmount() {
      if (isNaN(this.form.totalAmount)) {
        this.$message.error("请输入数字");
        this.form.totalAmount = null;
      } else {
        this.form.totalAmount = Number(
          Number(this.form.totalAmount).toFixed(2)
        );
      }
    },
    getValue(row, value, key) {
      this.form.subjectList.map((ele) => {
        if (ele.name === row.name) {
          if (ele[key] === undefined) {
            this.$set(ele, key, null)
          }
          // console.log(ele[key])
          if (isNaN(value)) {
            this.$message.error("请输入数字");
            ele[key] = null;
          } else {
            ele[key] = Number(ele[key]).toFixed(2);
          }
        }
      });
    },
    testForm() {
      let arr = this.rowSum.slice(1, 9);
      var sum = arr.reduce(function (total, currentValue) {
        return total + currentValue;
      }, 0);
      return new Promise((resolve) => {
        if (Number(this.form.totalAmount) < Number(sum)) {
          this.$message.error(this.$t('budgetApproval.projectAmountTotalCannotBeGreaterThanTotalAmount'));
          resolve(false);
        } else {
          this.$refs.form.validate((valid) => {
            resolve(valid);
            if (valid) {
            } else {
              this.$message.error(this.$t('budgetApproval.pleaseFillInRequiredFields'));
            }
          });
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

.button-bottom {
  width: 100%;
  text-align: center;
}
</style>
