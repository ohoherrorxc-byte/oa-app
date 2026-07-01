<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-06-10 14:38:27
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-06-12 16:41:46
 * @FilePath: \icarx-ui\src\views\contract\bomMaint\activationNumber.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    title="激活数更新"
    append-to-body
    :visible.sync="dialogVisible"
    width="50%"
    @close="dialogVisibleFn"
  >
    <avue-data-box :option="dataOption"></avue-data-box>
    <el-divider></el-divider>
    <el-form
      :inline="true"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
    >
      <el-form-item label="工程车VIN明细" prop="fromVin">
        <el-select
          v-model="ruleForm.fromVin"
          filterable
          clearable
          placeholder="请选择工程车VIN明细"
        >
          <el-option
            v-for="item in optionsList"
            :key="item.id"
            :label="item.vin"
            :value="item.vin"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="ml20" @click="unData">更新</el-button>
      </el-form-item>
    </el-form>
    <el-card shadow="always" class="mt25">
      <el-tag
        v-for="tag in tags"
        :key="tag.id"
        closable
        class="mr10 mt5 mb5"
        @close="closeTag(tag.id)"
      >
        {{ tag.vin }}
      </el-tag>
    </el-card>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleFn">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getVinByBomId,
  getEngineVehicleVinByBomId,
  engineVehicleVinSave,
  engineVehicleVinDelete,
} from "@/api/contract/bomMaint";
export default {
  props: {
    bomId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ruleForm: {
        fromVin: null,
      },
      rules: {
        fromVin: [{ required: true, message: "请输入工程车VIN明细" }],
      },
      dialogVisible: true,
      tags: [],
      optionsList: [],
      dataOption: {
        span: 8,
        data: [
          {
            title: "激活总数",
            count: 0,
            icon: "el-icon-view",
            prop: "activedTotoalNum",
            color: "rgb(49, 180, 141)",
          },
          {
            title: "工程车数量",
            count: 0,
            icon: "el-icon-truck",
            prop: "engineVehicleVinNum",
            color: "rgb(56, 161, 242)",
          },
          {
            title: "实际激活数",
            count: 0,
            icon: "el-icon-monitor",
            prop: "actualActivedNum",
            color: "rgb(117, 56, 199)",
          },
        ],
      },
    };
  },
  created() {
    this.initData();
    this.getEngineVehicleVinByBomId();
  },
  methods: {
    unData() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          engineVehicleVinSave({
            bomId: this.bomId,
            vin: this.ruleForm.fromVin,
          }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("更新成功");
              this.getEngineVehicleVinByBomId();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取创建人列表
    initData() {
      getVinByBomId({ bomId: this.bomId }).then((res) => {
        this.optionsList = res.data.data;
      });
    },
    getEngineVehicleVinByBomId() {
      getEngineVehicleVinByBomId({ bomId: this.bomId }).then((res) => {
        let data = res.data.data;
        this.tags = data.tbEngineVehicleVinList;
        this.dataOption.data.forEach((item) => {
          item["count"] = data[item["prop"]];
        });
      });
    },
    dialogVisibleFn() {
      this.$emit("closeFn");
    },
    closeTag(ids) {
      this.$confirm("是否确定要删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        engineVehicleVinDelete({ ids }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getEngineVehicleVinByBomId();
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
