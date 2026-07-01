<template>
  <basic-container>
    <p class="table-title">
      <span></span>申请信息
    </p>
    <el-form :disabled="disabled" ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="设备名称" prop="totalAmount">
        <el-input v-model="form.totalAmount" @blur="testAmount"></el-input>
      </el-form-item>
      <el-form-item label="设备MAC" prop="projectHead">
        <el-input v-model="form.projectHead"></el-input>
      </el-form-item>
      <el-form-item label="申请理由" prop="totalAmount">
        <el-input v-model="form.totalAmount" @blur="testAmount"></el-input>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { contractProject } from "@/api/myFlow/index";
import { budgetApprovalDetail } from "@/api/myFlow/operate/detail";
export default {
  data() {
    return {
      form: {},

      rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        projectHead: [
          { required: true, message: "请输入负责人", trigger: "blur" },
        ],
        totalAmount: [
          { required: true, message: "请输入总金额", trigger: "blur" },
        ],
      },
      rowSum: [],
      projectList: [],
      businessId: null,
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
          this.$message.error("项目金额总额不得大于总金额");
          resolve(false);
        } else {
          this.$refs.form.validate((valid) => {
            resolve(valid);
            if (valid) {
            } else {
              this.$message.error("请填写必填项");
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