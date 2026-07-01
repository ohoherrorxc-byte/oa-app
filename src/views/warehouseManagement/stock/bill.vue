<template>
  <el-dialog
    title="物流信息"
    :close-on-click-modal="false"
    append-to-body
    visible
    width="44%"
    @close="$emit('close')"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="提单号">
        <el-input v-model="ruleForm.ladingNo" placeholder="提单号"></el-input>
      </el-form-item>
      <el-form-item label="查询网址">
        <el-input v-model="ruleForm.queryWebsite" placeholder="查询网址"></el-input>
      </el-form-item>
      <el-form-item label="离港日期">
        <el-date-picker
          v-model="ruleForm.departureTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
          :disabled="departureTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="到港日期">
        <el-date-picker
          v-model="ruleForm.arrivalTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
          :disabled="arrivalTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { submitLadingNo } from "@/api/supplyChain/stockOut";
export default {
  props: ["billRow"],
  data() {
    return {
      ruleForm: {},
      departureTime: true,
      arrivalTime: true,
    };
  },
  created() {
    this.departureTime = this.billRow.departureTime ? true : false;
    this.arrivalTime = this.billRow.arrivalTime ? true : false;
    this.ruleForm = {
      ladingNo: this.billRow.ladingNo,
      queryWebsite: this.billRow.queryWebsite,
      departureTime: this.billRow.departureTime,
      arrivalTime: this.billRow.arrivalTime,
      tradeMode: this.billRow.tradeMode,
      id: this.billRow.id,
    };
  },
  methods: {
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          submitLadingNo(this.ruleForm).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("保存成功");
              this.$emit("close", "success");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>