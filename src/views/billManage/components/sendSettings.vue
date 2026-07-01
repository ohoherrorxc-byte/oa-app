<template>
  <el-dialog append-to-body title="邮件发送设置" visible="true" width="66%" @close="$emit('close')">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="mini">
      <el-row
        type="flex"
        justify="space-between"
        v-for="(item, index) in ruleForm.emailInfoList"
        :key="index"
      >
        <el-col :span="10">
          <el-form-item label="收件人" prop="email">
            <el-input v-model="item.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="国家/区域" prop="regionList">
            <el-select v-model="item.regionList" multiple collapse-tags placeholder="请选择国家/区域">
              <el-option
                v-for="item in areaList"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="text-r">
          <el-button v-if="index === 0" size="mini" type="primary" @click="addList">添加</el-button>
          <el-button v-if="index !== 0" size="mini" type="danger" @click="delList(index)">删除</el-button>
        </el-col>
      </el-row>
      <el-form-item label="设置模板">
        <el-alert :closable="false" description="2023年6月 ，泰国 区域 AXU 客户，需收款的合同总额为 CNY 200000.00"></el-alert>*数据明细会以附件的形式发送到您的邮箱
      </el-form-item>
      <el-form-item label="每月发送日">
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="dateDay">
              <el-select v-model="ruleForm.dateDay" placeholder="请选择每月发送日">
                <el-option :label="item + '号'" :value="item + ''" v-for="item in 28" :key="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="dateTime">
              <el-time-select
                placeholder="选择时间"
                v-model="ruleForm.dateTime"
                style="width: 100%"
                :picker-options="{
                  start: '00:00',
                  step: '00:60',
                  end: '24:00',
                }"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="el-dialog__footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getOptions } from "@/api/base";
import { saveEmailInfo, getEmailInfo } from "@/api/contract/monthlyBilling";
export default {
  props: {
    emailType: {
      type: Number,
    },
  },
  data() {
    return {
      areaList: [],
      ruleForm: {
        emailType: this.emailType,
        dateDay: 5,
        dateTime: "10:00",
        emailInfoList: [
          {
            email: "",
            regionList: [],
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getEmailInfo({ emailType: this.emailType }).then((res) => {
        const { data } = res.data;
        if (Object.keys(data).length > 0) this.ruleForm = data;
      });
      getOptions({ code: "COUNTRY_REGIN" }).then((res) => {
        this.areaList = res.data.data;
      });
    },
    handleClose() {
      this.$emit("close");
    },
    addList() {
      this.ruleForm.emailInfoList.push({
        email: "",
        regionList: [],
      });
    },
    delList(index) {
      this.ruleForm.emailInfoList.splice(index, 1);
    },
    submit() {
      saveEmailInfo(this.ruleForm).then((res) => {
        const { code } = res.data;
        if (code === 0) {
          this.$message.success("保存成功");
          this.$emit("close");
        }
      });
    },
  },
};
</script>
