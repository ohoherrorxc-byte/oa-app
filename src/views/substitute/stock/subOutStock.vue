
<template>
    <el-dialog
      title="出库管理"
      :close-on-click-modal="false"
      append-to-body
      visible
      width="66%"
      @close="$emit('close')"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item label="出库日期" prop="stockOutDate">
              <el-date-picker
                v-model="ruleForm.stockOutDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="国家" prop="countryRegionCode">
              <el-select v-model="ruleForm.countryRegionCode" clearable placeholder="请选择">
                <el-option
                  v-for="item in areaList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item label="用途" prop="useTo">
              <el-select v-model="ruleForm.useTo" clearable placeholder="请选择">
                <el-option
                  v-for="item in useToList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="ruleForm.useTo === '1'">
            <el-form-item label="贸易方式" prop="tradeMode">
              <el-select v-model="ruleForm.tradeMode" clearable placeholder="请选择">
                <el-option
                  v-for="item in tradeList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="相关附件" prop="remark">
              <upload  :fileList="ruleForm.fileList"  btnName="上传" @handleRequest="handleRequest"
            :multiple="true" :showFileList="true"></upload>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item) in ruleForm.partsStockVOList" :key="item" class="mb10">
          <el-row type="flex" justify="space-between">
            <el-col>零件号: {{ item. partsNo}}</el-col>
            <el-col>零件名称: {{ item.partsName }}</el-col>
            <el-col>车系:</el-col>
          </el-row>
          <el-table :data="item.stockVOList" style="width: 100%" class="mt10 out-stock">
            <el-table-column prop="stockInNo" label="入库单号"></el-table-column>
            <el-table-column prop="intoTime" label="入库日期"></el-table-column>
            <el-table-column prop="storeName" label="仓库"></el-table-column>
            <el-table-column prop="goodsShelvesNo" label="进仓单号"></el-table-column>
            <el-table-column prop="stockNumber" label="库存数量"></el-table-column>
            <el-table-column prop="stockNumber" label="出库数量">
              <template slot-scope="{row,$index}">
                <el-form-item label-width="0">
                  <el-input v-model.number="row.stockOutNumber" placeholder="请输入出库数量"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item class="text-r mt10">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="$emit('close')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </template>
  <script>
  import { selectPage, save } from "@/api/substitute/subStock";
  import { getOptions } from "@/api/base";
  import upload from '@/components/upload/index'
  export default {
    props: ["partsNos"],
    data() {
      return {
        areaList: [],
        tradeList: [],
        useToList: [],
        ruleForm: {
          stockOutDate: new Date(),
          partsStockVOList: [],
          fileList:[]
        },
        rules: {
          stockOutDate: [
            { required: true, message: "请输入出库日期", trigger: "change" },
          ],
          countryRegionCode: [
            { required: true, message: "请请选择国家", trigger: "change" },
          ],
          useTo: [{ required: true, message: "请请选择用途", trigger: "change" }],
          tradeMode: [
            { required: true, message: "请请选择贸易方式", trigger: "change" },
          ],
        },
      };
    },
    created() {
      this.init();
    },
    computed: {},
    components:{upload},
    methods: {
      init() {
        selectPage({ partsNos: this.partsNos }).then((res) => {
          this.ruleForm.partsStockVOList = res.data.data.records;
        });
        getOptions({ code: "COUNTRY_REGIN" }).then((res) => {
          console.log(res);
          this.areaList = res.data.data;
        });
        getOptions({ code: "TRADE_MODE" }).then((res) => {
          this.tradeList = res.data.data;
        });
        getOptions({ code: "useTo" }).then((res) => {
          this.useToList = res.data.data;
        });
      },
      handleRequest(data,arr){
        this.ruleForm.fileList = arr
      },
      stockOutNumberBlur(list) {
        return list.every((item) => {
          return item.stockVOList.every((data) => {
            const { stockNumber, stockOutNumber, stockInNo } = data;
            let stock = `入库单号${stockInNo}的`;
            if (stockOutNumber < 0) {
              this.$message.warning(stock + "出库数量不能小于零");
              return false;
            }
            if (stockOutNumber > stockNumber) {
              this.$message.warning(stock + "出库数量不能大于库存数量");
              return false;
            }
  
            return true;
          });
        });
      },
      submitForm() {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid && this.stockOutNumberBlur(this.ruleForm.partsStockVOList)) {
            save(this.ruleForm).then((res) => {
              if (res.data.code === 0) {
                this.$message.success("保存成功");
                this.$emit("close", true);
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
  <style lang="scss" scoped>
  .out-stock {
    ::v-deep ep .el-form-item--mini.el-form-item {
      margin-bottom: 0;
    }
  }
  </style>
  