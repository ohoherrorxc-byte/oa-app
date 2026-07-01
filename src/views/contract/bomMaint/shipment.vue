<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-06-10 14:38:27
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-08-23 15:10:01
 * @FilePath: \icarx-ui\src\views\contract\bomMaint\activationNumber.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog title="出货量" append-to-body visible width="66%" @close="$emit('close')">
    <el-row type="flex">
      <el-col>出货量：{{ parts.shipmentTotal }}</el-col>
      <el-col>硬件零件名称：{{ parts.partsName }}</el-col>
      <el-col>硬件零件号：{{ parts.partsNo }}</el-col>
    </el-row>
    <el-button class="mt20 mb20" type="primary" @click="add">新增</el-button>

    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm">
      <el-table :data="dynamicValidateForm.tbHardwareShipmentList">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column width="150" align="center" label="离港日期">
          <template slot-scope="{ row, $index }">
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="离港日期"
                v-model="row.departureTime"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="150" align="center" label="到港日期">
          <template slot-scope="{ row, $index }">
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="到港日期"
                v-model="row.arrivalTime"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template #header>
            <span class="red mr5">*</span>贸易方式
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'tbHardwareShipmentList.' + $index + '.tradeMode'"
              :rules="{
                required: true,
                message: '贸易方式不能为空',
                trigger: 'change',
              }"
            >
              <el-select v-model="row.tradeMode" placeholder="请选择贸易方式">
                <el-option
                  :label="item.dictValue"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  v-for="item in tradeList"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #header>
            <span class="red mr5">*</span>客户
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'tbHardwareShipmentList.' + $index + '.custId'"
              :rules="{
                required: true,
                message: '客户不能为空',
                trigger: 'change',
              }"
            >
              <el-select v-model="row.custId" placeholder="请选择客户">
                <el-option
                  :label="item.custName"
                  :value="item.id"
                  :key="item.id"
                  v-for="item in contractCustomerList"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template #header>
            <span class="red mr5">*</span>区域/国家
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'tbHardwareShipmentList.' + $index + '.countryReginCode'"
              :rules="{
                required: true,
                message: '区域/国家不能为空',
                trigger: 'change',
              }"
            >
              <el-select v-model="row.countryReginCode" placeholder="请选择">
                <el-option
                  :label="item.dictValue"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  v-for="item in areaList"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column width="150" align="center">
          <template #header>
            <span class="red mr5">*</span>添加数量
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'tbHardwareShipmentList.' + $index + '.number'"
              :rules="[
                { required: true, message: '数量不能为空' },
                { type: 'number', message: '数量必须为数字值' },
              ]"
            >
              <el-input v-model.number="row.number" placeholder="请输入数量"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" :prop="name3" label="操作人">
          <template slot-scope="{ row }">
            <p style="margin-bottom: 18px">{{ row.createUserName || userInfo.role_name }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :prop="name3" label="操作">
          <template slot-scope="{ $index }">
            <el-button style="margin-bottom: 18px" type="danger" plain @click="del($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="text-r mt20">
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">保存</el-button>
        <el-button @click="$emit('close')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import {
  saveOrUpdate,
  hardwareShipmentSelectList,
} from "@/api/contract/bomMaint";
import { getOptions } from "@/api/base";
import { contractCustomer } from "@/api/contract/contractSellAdd";
export default {
  props: ["bomId"],
  data() {
    return {
      tradeList: [],
      areaList: [],
      contractCustomerList: [],
      parts: {
        partsName: "",
        partsNo: "",
        shipmentTotal: "",
      },
      dynamicValidateForm: {
        tbHardwareShipmentList: [
          {
            countryReginCode: "",
            createDept: "",
            createTime: "",
            createUser: "",
            custId: "",
            isDeleted: "",
            number: "",
            retrievalTime: "",
            updateTime: "",
          },
        ],
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
      });
      getOptions({ code: "TRADE_MODE" }).then((res) => {
        this.tradeList = res.data.data;
      });
      contractCustomer().then((res) => {
        this.contractCustomerList = res.data.data;
      });
      hardwareShipmentSelectList({ bomId: this.bomId }).then((res) => {
        const {
          partsName,
          partsNo,
          shipmentTotal,
          tbHardwareShipmentList,
        } = res.data.data;
        this.parts = {
          partsName,
          partsNo,
          shipmentTotal,
        };
        if (tbHardwareShipmentList.length > 0)
          this.dynamicValidateForm.tbHardwareShipmentList = tbHardwareShipmentList;
      });
    },
    add() {
      this.dynamicValidateForm.tbHardwareShipmentList.push({
        countryReginCode: "",
        createDept: "",
        createTime: "",
        createUser: "",
        custId: "",
        isDeleted: "",
        number: "",
        retrievalTime: "",
        updateTime: "",
      });
    },
    del(index) {
      this.$confirm("是否删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.dynamicValidateForm.tbHardwareShipmentList.splice(index, 1);
      });
    },
    submitForm(formName) {
      console.log(this.dynamicValidateForm.tbHardwareShipmentList);
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.onSubmit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onSubmit() {
      saveOrUpdate({
        tbHardwareShipmentList: this.dynamicValidateForm.tbHardwareShipmentList,
        bomId: this.bomId,
        createUserName: this.userInfo.role_name,
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
