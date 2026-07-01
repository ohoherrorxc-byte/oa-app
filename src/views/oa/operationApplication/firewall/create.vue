<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{$t('firewall.applyInfo')}}
    </p>
    <el-form :disabled="disabled" ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item :label="$t('firewall.functionOption')" prop="functionOption">
        <el-select v-model="form.functionOption">
          <el-option :value="0" label="禁用"></el-option>
          <el-option :value="1" label="开通"></el-option>
          <el-option :value="2" label="公网开通"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('firewall.sourceIp')" prop="sourceIp">
        <el-input v-model="form.sourceIp"></el-input>
      </el-form-item>
      <el-form-item :label="$t('firewall.port')" prop="port">
        <el-input v-model="form.port"></el-input>
      </el-form-item>
      <el-form-item :label="$t('firewall.goalIp')" prop="goalIp">
        <el-input v-model="form.goalIp"></el-input>
      </el-form-item>
      <el-form-item :label="$t('firewall.goalPort')" prop="goalPort">
        <el-input v-model="form.goalPort"></el-input>
      </el-form-item>
      <el-form-item :label="$t('firewall.otherDesc')" prop="otherDesc">
        <el-input v-model="form.otherDesc" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { firewallDetail } from "@/api/myFlow/operate/detail";
export default {
  data() {
    return {
      form: {},
      rules: {
        functionOption: [
          { required: true, message: this.$t('firewall.pleaseSelectFunctionOption'), trigger: "change" },
        ],
        sourceIp: [{ required: true, message: this.$t('firewall.pleaseInputSourceIp'), trigger: "blur" }],
        port: [{ required: true, message: this.$t('firewall.pleaseInputPort'), trigger: "blur" }],
        goalIp: [
          {
            required: true,
            message: this.$t('firewall.pleaseInputGoalIp'),
            trigger: "blur",
          },
        ],
        goalPort: [
          { required: true, message: this.$t('firewall.pleaseInputGoalPort'), trigger: "blur" },
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
      let res = await firewallDetail(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },


    testForm() {
      return new Promise((resolve) => {

          this.$refs.form.validate((valid) => {
            resolve(valid);
            if (!valid) {
              this.$message.error(this.$t('firewall.pleaseFillInRequiredFields'));
            }
          });
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
