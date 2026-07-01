
<template>
  <el-dialog
    title="销售订单生成规则"
    :close-on-click-modal="false"
    append-to-body
    visible
    width="44%"
    @close="$emit('close')"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
      <el-tab-pane
        :label="item.dictValue"
        :name="item.dictKey"
        v-for="item in areaList"
        :key="item.dictKey"
      >
        <el-button class="mt20 mb20" type="primary" @click="add">新增</el-button>
        <el-form
          :model="LicenseOrderRuleVO"
          ref="LicenseOrderRuleVO"
          v-if="activeName === item.dictKey"
        >
          <el-table :data="LicenseOrderRuleVO.licenseOrderRuleList">
            <el-table-column type="index" width="50" label="序号"></el-table-column>

            <el-table-column align="center">
              <template #header>
                <span class="red mr5">*</span>分组名称
              </template>
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :prop="'licenseOrderRuleList.' + $index + '.ruleName'"
                  :rules="[
                { required: true, message: '分组名称不能为空' },
              ]"
                >
                  <el-input v-model="row.ruleName" placeholder="请输入分组名称"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template #header>
                <span class="red mr5">*</span>车系
              </template>
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :prop="'licenseOrderRuleList.' + $index + '.seriesId'"
                  :rules="[
                { required: true, message: '车系不能为空', trigger: 'change' },
              ]"
                >
                  <el-select v-model="row.seriesId" multiple collapse-tags placeholder="请选择车系">
                    <el-option
                      v-for="item in treeList"
                      :key="item.id"
                      :label="item.seriesName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column align="center" width="80" label="操作">
              <template slot-scope="{ $index }">
                <el-button style="margin-bottom: 18px" type="danger" plain @click="del($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item class="text-r mt20">
            <el-button type="primary" @click="submitForm('LicenseOrderRuleVO')">保存</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getSeriesName,
  selectList,
  saveOrUpdate,
} from "@/api/billManage/poOrder";
import { getOptions } from "@/api/base";
export default {
  props: ["bomId"],
  data() {
    return {
      activeName: "",
      treeList: [],
      areaList: [],
      contractCustomerList: [],
      LicenseOrderRuleVO: {
        licenseOrderRuleList: [],
      },
    };
  },
  created() {
    this.getInit();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    getInit() {
      getOptions({ code: "COUNTRY_REGIN" }).then((res) => {
        this.areaList = res.data.data;
        this.activeName = this.areaList[0].dictKey;
        this.getOptions(this.activeName);
      });
    },
    getOptions(countryRegionCode) {
      getSeriesName({ countryRegionCode }).then((res) => {
        this.treeList = res.data.data;
        this.treeList.forEach((item) => {
          item.id += "";
        });
        this.getList(countryRegionCode);
      });
    },
    getList(countryRegionCode) {
      selectList({ countryRegionCode }).then((res) => {
        this.LicenseOrderRuleVO = res.data.data;
        this.LicenseOrderRuleVO.licenseOrderRuleList.forEach((item) => {
          item.seriesId = item.seriesId.split(",");
        });
      });
    },
    handleClick(val) {
      this.getOptions(val.name);
    },
    add() {
      this.LicenseOrderRuleVO.licenseOrderRuleList.push({
        ruleName: "",
        seriesId: [],
      });
    },
    del(index) {
      this.$confirm("是否删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.LicenseOrderRuleVO.licenseOrderRuleList.splice(index, 1);
      });
    },
    submitForm(formName) {
      this.$refs[formName][0].validate((valid) => {
        if (valid) {
          this.onSubmit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onSubmit() {
      const licenseOrderRuleList = this.LicenseOrderRuleVO.licenseOrderRuleList.map(
        (item) => {
          return {
            ruleName: item.ruleName,
            seriesId: item.seriesId.join(","),
          };
        }
      );

      saveOrUpdate({
        countryRegionCode: this.activeName,
        licenseOrderRuleList,
      }).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.$emit("close", "refresh");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
