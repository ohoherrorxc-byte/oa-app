
<template>
  <el-dialog :title="type === 'see' ? $t('commonContent.view'):$t('commonContent.edit')" :close-on-click-modal="false" append-to-body visible width="66%" @close="$emit('close')">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('substitute.store.storeNo')">
            <el-input v-model="ruleForm.storeNo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('substitute.store.storeName')" prop="storeName">
            <el-input v-model="ruleForm.storeName" :disabled="type === 'see'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('substitute.store.storeAttr')" prop="storeAttr">
            <el-select v-model="ruleForm.storeAttr" :placeholder="$t('substitute.store.storeAttr')" :disabled="type === 'see'">
              <el-option v-for="item in propertiesList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"
                :disabled="type === 'see'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="仓库状态" prop="storeState">
            <el-select
              v-model="ruleForm.storeState"
              placeholder="请选择仓库状态"
              :disabled="type === 'see'"
            >
              <el-option
                v-for="item in statusList"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item :label="$t('substitute.store.storeAddress')" prop="storeAddress">
            <el-input v-model="ruleForm.storeAddress" :disabled="type === 'see'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('substitute.store.principal')" prop="principal">
            <el-input v-model="ruleForm.principal" :disabled="type === 'see'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('substitute.store.phone')" prop="phone">
            <el-input v-model="ruleForm.phone" :disabled="type === 'see'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item :label="$t('substitute.store.remark')" prop="remark">
            <el-input v-model="ruleForm.remark" :disabled="type === 'see'"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('commonContent.save')}}</el-button>
        <el-button @click="$emit('close')">{{$t('commonContent.cancel')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { saveOrUpdate, detail } from "@/api/substitute/store";
import { getOptions } from "@/api/base";

export default {
  props: ["id", "type"],

  data() {
    return {
      ruleForm: {
        storeName: "",
        fileList: []
      },
      rules: {
        storeName: [
          { required: true, message: this.$t('substitute.store.storeName'), trigger: "blur" },
        ],
        storeAttr: [
          { required: true, message: this.$t('substitute.store.storeAttr'), trigger: "change" },
        ],
        storeState: [
          { required: true, message: this.$t('substitute.store.storeState'), trigger: "change" },
        ],
        storeAddress: [
          { required: true, message: this.$t('substitute.store.storeAddress'), trigger: "blur" },
        ],
        principal: [
          { required: true, message: this.$t('substitute.store.principal'), trigger: "blur" },
        ],
        phone: [{ required: true, message: this.$t('substitute.store.phone'), trigger: "blur" }],
      },
      statusList: [],
      propertiesList: [],
    };
  },
  created() {
    if (this.id) {
      this.getDetail(this.id);
    }
    this.init();
  },
  computed: {},
  methods: {
    init() {
      // [仓库状态]字典配置
      getOptions({ code: "store_status" }).then((res) => {
        this.statusList = res.data.data;
      });
      // [仓库属性]字典配置
      getOptions({ code: "store_properties" }).then((res) => {
        this.propertiesList = res.data.data;
      });
    },
    getDetail(id) {
      detail({ id }).then((res) => {
        if (res.data.code === 0) {
          this.ruleForm = res.data.data;
        }
      });
    },

    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          saveOrUpdate(this.ruleForm).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t('substitute.store.saveSuccess'));
              this.$emit("close");
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
<style lang="scss" scoped></style>
