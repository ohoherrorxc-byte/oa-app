
<template>
  <el-dialog
    :title="$t('stock.into')"
    :close-on-click-modal="false"
    append-to-body
    visible
    width="80%"
    @close="$emit('close')"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row class="row-flex">
        <el-col :span="12" v-if="type === 'see'">
          <el-form-item :label="$t('stock.stockInNo')" prop="goodsShelvesNo">
            <el-input v-model="ruleForm.goodsShelvesNo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('stock.partsNo')" prop="partsId">
            <el-select
              v-model="ruleForm.partsId"
              :placeholder="$t('stock.pleaseSelectPartsNo')"
              :disabled="type === 'see'"
              filterable
              @change="getTableList"
            >
              <el-option
                v-for="item in subMaintList"
                :key="item.id"
                :label="item.partsNo"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('stock.partsName')" prop="partsId">
            <el-select
              v-model="ruleForm.partsId"
              @change="partsChange"
              :placeholder="$t('stock.pleaseSelectPartsName')"
              :disabled="type === 'see'"
            >
              <el-option
                v-for="item in subMaintList"
                :key="item.id"
                :label="item.partsName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="type === 'see'">
          <el-form-item :label="$t('stock.supplier')" prop="partsId">
            <el-select v-model="ruleForm.partsId" disabled>
              <el-option
                v-for="item in subMaintList"
                :key="item.id"
                :label="item.supplier"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="type === 'see'">
          <el-form-item :label="$t('stock.state')">
            <el-select v-model="ruleForm.payStatus" disabled>
              <el-option
                v-for="item in options.stockStateList"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('stock.storeName')" prop="storeId">
            <el-select
              v-model="ruleForm.storeId"
              :placeholder="$t('stock.pleaseSelectStoreName')"
              :disabled="type === 'see'"
            >
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.storeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('stock.goodsShelvesNo')"
            prop="goodsShelvesNo"
          >
            <el-input
              v-model="ruleForm.goodsShelvesNo"
              :disabled="type === 'see'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('stock.intoTime')" prop="intoTime">
            <el-date-picker
              v-model="ruleForm.intoTime"
              :disabled="type === 'see'"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('stock.stockInNumber')" prop="stockInNumber">
            <el-input
              v-model="ruleForm.stockInNumber"
              :disabled="type === 'see'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('commonContent.remark')" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('commonContent.relatedAttachments')"
            prop="remark"
          >
            <upload
              :fileList="ruleForm.fileList"
              :disabled="type === 'see'"
              btnName="上传"
              @handleRequest="handleRequest"
              :multiple="true"
              :showFileList="true"
            ></upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0">
            <el-table :data="ruleForm.orderInfoDtoList" style="width: 100%">
              <el-table-column
                prop="orderNo"
                :label="$t('stock.logisticsOrderNo')"
              >
              </el-table-column>
              <el-table-column prop="partsNumber" :label="$t('stock.partsNo')">
              </el-table-column>
              <el-table-column prop="partsName" :label="$t('stock.partsName')">
              </el-table-column>
              <el-table-column
                prop="needNumber"
                :label="$t('stock.orderNumber')"
              >
              </el-table-column>
              <el-table-column
                prop="uncollectedNumber"
                :label="$t('stock.uncollectedNumber')"
              >
              </el-table-column>
              <el-table-column
                prop="realNumber"
                :label="$t('stock.realNumber')"
              >
              </el-table-column>
              <el-table-column
                prop="stockInNumber"
                :label="$t('stock.stockInNumber')"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.stockInNumber"
                    @change="changeNumber"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="text-r">
        <el-button type="primary" @click="saveRemark('ruleForm')">
          {{ $t("commonContent.saveRemark") }}</el-button
        >
        <el-button type="primary" @click="submitForm('ruleForm')">
          {{ $t("commonContent.save") }}</el-button
        >
        <el-button @click="$emit('close')">{{
          $t("commonContent.cancel")
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  saveOrUpdate,
  detail,
  select,
  getOrderInfoByPartsNumber,
  updateStockInRemark,
} from "@/api/substitute/subStockInto";
import { getOptions } from "@/api/base";
import upload from "@/components/upload/index";
import { getSubMaintList } from "@/api/contract/partsMaint";

export default {
  props: ["id", "payStatus", "type", "options"],
  data() {
    return {
      subMaintList:[],
      ruleForm: {
        orderInfoDtoList: [],
        stockInNumber: null,
        partsId: null,
        storeId: null,
        intoTime: null,
      },
      rules: {
        partsId: [
          {
            required: true,
            message: this.$t("stock.pleaseSelectPartsNo"),
            trigger: "change",
          },
        ],
        storeId: [
          {
            required: true,
            message: this.$t("stock.pleaseSelectStoreName"),
            trigger: "change",
          },
        ],
        intoTime: [
          {
            required: true,
            message: this.$t("stock.pleaseSelectIntoTime"),
            trigger: "change",
          },
        ],
        stockInNumber: [
          {
            required: true,
            message: this.$t("stock.pleaseSelectStockInNumber"),
          },
        ],
      },
      storeList: [],
      vehicleDetialList: [],
      storeStateList: [],
      businessTypeList: [],
      contractSupplierList: [],
      yasNO: [],
    };
  },
  created() {
    this.init();
    if (this.id) {
      this.getDetail(this.id);
    }
    this.getSubList()
  },
  components: { upload },
  computed: {},
  methods: {
    partsChange(id, isStart) {
      const obj = this.subMaintList.find(
        (item) => item.id === id
      );
      if (!obj) return;
      this.ruleForm.partsNo = obj.partsNo;
      this.ruleForm.unitPriceCnyNoTax = obj.unitPriceCnyNoTax;
      if (!isStart) {
        this.ruleForm.stockInPrice = obj.stockInPrice;
      }
      this.setCountersigning();
    },
    async getSubList() {
      let res = await getSubMaintList();
      if (res.data.code === 200 || res.data.code === 0) {
        this.subMaintList = res.data.data;
      }
    },
    async getTableList() {
      let row = this.subMaintList.find((ele) => {
        return this.ruleForm.partsId === ele.id;
      });
      let res = await getOrderInfoByPartsNumber({ partsNumber: row.partsNo });
      if (res.data.code === 0 || res.data.code === 200) {
        this.ruleForm.orderInfoDtoList = res.data.data || [];
        this.ruleForm.orderInfoDtoList.map((ele) => {
          this.$set(ele, "stockInNumber", null);
        });
      }
    },
    changeNumber() {
      const values = this.ruleForm.orderInfoDtoList.map((item) =>
        Number(item.stockInNumber)
      );
      let sums;
      if (!values.every((value) => isNaN(value))) {
        sums = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        sums += "";
      } else {
        sums = "";
      }
      this.ruleForm.stockInNumber = sums;
      console.log(this.ruleForm.stockInNumber);
    },
    handleRequest(data, arr) {
      this.ruleForm.fileList = arr;
    },
    setCountersigning() {
      const { unitPriceCnyNoTax, stockNumber } = this.ruleForm;
      if (!unitPriceCnyNoTax || !stockNumber) return;
      this.ruleForm.countersigning = (unitPriceCnyNoTax * stockNumber).toFixed(
        2
      );
    },
    init() {
      select().then((res) => {
        this.storeList = res.data.data;
      });
      // 车型
      // getVehicleDetialList().then((res) => {
      //   this.vehicleDetialList = res.data.data;
      // });

      // 是否
      getOptions({ code: "yes_no" }).then((res) => {
        this.yasNO = res.data.data;
      });
    },
    getDetail(id) {
      detail({ id }).then((res) => {
        if (res.data.code === 0) {
          this.ruleForm = res.data.data;
          this.partsChange(this.ruleForm.partsId, "isStart");
        }
      });
    },
    async saveRemark() {
      let res = await updateStockInRemark({
        id: this.ruleForm.id,
        remark: this.ruleForm.remark,
      });
      console.log(res);
      if (res.data.code === 200 || res.data.code === 0) {
        this.$message.success("备注已保存");
        this.$emit("close");
      }
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.ruleForm.payStatus = this.payStatus;
          saveOrUpdate(this.ruleForm).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t("stock.saveSuccess"));
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
<style lang="scss" scoped>
.row-flex {
  display: flex;
  flex-wrap: wrap;
}
</style>
  