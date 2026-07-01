<template>
  <el-dialog append-to-body title="发票设置" :visible="true" width="30%" @close="$emit('close')">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="PAN:">
        <el-input v-model="ruleForm.pan"></el-input>
      </el-form-item>
      <el-form-item label="GSTIN:">
        <el-input v-model="ruleForm.gstin"></el-input>
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { invoiceSaveOrUpdate } from "@/api/billManage/poOrder";
export default {
  props: {
    form: {
      typeof: Object,
    },
  },
  data() {
    return {
      ruleForm: {
        pan: this.form.pan,
        gstin: this.form.gstin,
        remark: this.form.remark,
      },
    };
  },
  methods: {
    submitForm() {
      const data = {
        ...this.form,
        ...this.ruleForm,
      };
      invoiceSaveOrUpdate(data).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.$emit("close", data);
        }
      });
    },
  },
};
</script>