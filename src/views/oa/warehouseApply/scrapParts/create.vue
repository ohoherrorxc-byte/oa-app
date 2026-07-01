<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('assetsApply.scrappingApplication.title') }}
    </p>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item :label="$t('assetsApply.scrappingApplication.scrapInstructions')" prop="scrapInstructions">
        <el-input type="textarea" v-model="form.scrapInstructions" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.scrappingApplication.totalAmount')" prop="totalAmount">
        {{ getTotalAmount() }}
      </el-form-item>
      <el-form-item :label="$t('assetsApply.scrappingApplication.amountInWords')" prop="amountInWords">
        <!-- <el-input v-model="form.amountInWords" :disabled="disabled"></el-input> -->
        {{ form.amountInWords }}
      </el-form-item>
      <el-form-item :label="$t('assetsApply.scrappingApplication.scrapDate')" prop="scrapDate">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" class="w-100" v-model="form.scrapDate" type="datetime"
          :placeholder="$t('assetsApply.scrappingApplication.pleaseSelectDate')" :disabled="disabled"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item :label="$t('assetsApply.scrappingApplication.scrappingMethod')" prop="scrappingMethod">
          <el-select v-model="form.scrappingMethod" :disabled="disabled">
            <el-option value="变卖" label="变卖"></el-option>
            <el-option value="处置" label="处置"></el-option>
          </el-select>
        </el-form-item> -->
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table ref="multipleTable" :data="form.partList" @selection-change="handleSelectionChange" class="mb20"
          :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }">
          <el-table-column prop="chooseStatus" type="index" width="50" :label="$t('commonContent.serialNumber')"
            v-if="!isPdfDown"></el-table-column>
          <el-table-column property="partsName" :label="$t('parts.name')" align="center" :width="isPdfDown ? 80 : '220'">
            <template slot="header">
              {{ $t('parts.name') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.partsName'"
                :rules="rules.partsName">
                <el-select v-if="!disabled" v-model="scope.row.partsName" :disabled="disabled"
                  :placeholder="$t('parts.number')" filterable @change="getPartList(scope.row, 'categoryName')">
                  <el-option v-for="item in partsMaintListList" :key="item.categoryNo" :label="item.categoryName"
                    :value="item.categoryName"></el-option>
                </el-select>
                <div v-else>{{ scope.row.partsName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="partsNo" :label="$t('parts.number')" align="center" :width="isPdfDown ? 80 : '200'">
            <!-- <template slot="header">
              {{ $t('parts.number') }}
              <span class="red">*</span>
            </template> -->
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.partsNo'" :rules="rules.partsNo">
                <!-- {{ scope.row.partsNo }} -->
                <el-select v-model="scope.row.partsNo" :disabled="disabled" :placeholder="$t('parts.number')" filterable
                  @change="getPartList(scope.row, 'categoryNo')">
                  <el-option v-for="item in partsMaintListList" :key="item.categoryNo" :label="item.categoryName"
                    :value="item.categoryNo"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="stockInNo" :label="$t('stockIn.number')" align="center"
            :width="isPdfDown ? 80 : '140'">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.stockInNo'"
               >
                <el-input clearable v-model="scope.row.stockInNo" :disabled="disabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="intoTime" :label="$t('stockIn.date')" align="center" :width="isPdfDown ? 80 : '140'">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.intoTime'" :rules="rules.intoTime">
                <el-date-picker v-model="scope.row.intoTime" :disabled="disabled" align="right" type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" placeholder="选择日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <!-- {{ scope.row.intoTime }} -->
                <!-- <el-input clearable v-model="scope.row.intoTime"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="storeName" :label="$t('commonContent.warehouse')" align="center"
            :width="isPdfDown ? 80 : '140'">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.storeName'"
                :rules="rules.storeName">
                <!-- {{ scope.row.storeName }} -->
                <el-select v-model="scope.row.storeName" :disabled="disabled" :placeholder="$t('stock.pleaseSelectStoreName')">
                  <el-option v-for="item in storeList" :key="item.id" :label="item.storeName"
                    :value="item.storeName"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" :width="isPdfDown ? 80 : '120'">
            <template slot="header">
              {{ $t('saleContract.unitPrice') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.unitPrice'"
                :rules="rules.unitPrice">
                <el-input v-model="scope.row.unitPrice" :disabled="disabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stockIn.receiptNumber')" align="center" :width="isPdfDown ? 80 : '120'">
            <template slot="header">
              {{ $t('assetsApply.scrappingApplication.money') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.stockInPrice'"
                :rules="rules.stockInPrice">
                <el-input v-model="scope.row.stockInPrice" :disabled="disabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stockIn.receiptNumber')" align="center" :width="isPdfDown ? 80 : '120'">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.goodsShelvesNo'"
                :rules="rules.goodsShelvesNo">
                <el-input v-model="scope.row.goodsShelvesNo" :disabled="disabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="seriesName" :label="$t('parts.series')" align="center"
            :width="isPdfDown ? 80 : '120'">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.seriesName'"
                :rules="rules.seriesName">
                <!-- {{ scope.row.seriesName }} -->
                <el-input v-model="scope.row.seriesName" :disabled="disabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commonContent.country')" align="center" :width="isPdfDown ? 80 : '120'">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.country'"
                :rules="rules.haveKey">
                <!-- {{ scope.row.countryRegin }} -->
                <el-select v-model="scope.row.country" :disabled="disabled">
                  <el-option v-for="item in countryList" :label="item.dictValue" :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stockOut.quantity')" align="center" :width="isPdfDown ? 80 : '120'">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partList.' + scope.$index + '.quantity'"
                :rules="rules.quantity">
                <!-- {{ scope.row.stockOutNumber }} -->
                <el-input v-model="scope.row.quantity" :disabled="disabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('assetsApply.scrappingApplication.operation')" align="center" v-if="!disabled">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </basic-container>
</template>
  
<script>
import { select } from "@/api/substitute/stockInto";
import WarehouseApplyApi from "@/api/warehouseApply/index";
import { getSubPartsMaintList } from "@/api/base";
import dictionaryApi from '@/api/dictionary'
import { numberToTraditionalChinese } from '@/util/util'
export default {
  props: {
    isPdfDown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categoriesList: [],
      placeList: [],
      partsMaintListList: [],
      form: {
        scrapInstructions: "",//报废说明
        totalAmount: "",//金额合计
        amountInWords: "",//金额大写
        scrapDate: "",//报废日期
        partList: [
          {
            partsNo: "",//零件号
            partsName: "",//零件名称
            stockInNo: "",//入库单号
            intoTime: "",//入库时间
            storeName: "",//仓库名称   
            goodsShelvesNo: "",//进仓单号
            seriesName: "",//车系
            country: "",//国家
            quantity: "",  //出库数量 
            stockInPrice: null    //金额  
          },
        ],
      },
      rules: {
        // partsNo: [
        //   { required: true, message: this.$t('parts.number'), trigger: "blur" },
        // ],
        partsName: [
          { required: true, message: this.$t('parts.name'), trigger: "change" },
        ],
        unitPrice: [
          { required: true, message: this.$t('saleContract.unitPrice'), trigger: "change" },
        ],
        // stockInNo: [
        //   { required: true, message: this.$t('stockIn.number'), trigger: "change" },
        // ],
        // intoTime: [
        //   { required: true, message: this.$t('stockIn.date'), trigger: "blur" },
        // ],
        // storeName: [
        //   { required: true, message: this.$t('commonContent.warehouse'), trigger: "blur" },
        // ],
        // goodsShelvesNo: [
        //   { required: true, message: this.$t('stockIn.receiptNumber'), trigger: "blur" },
        // ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
      storeList: [],
      countryList:[]
    };
  },

  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.init();
  },
  computed: {
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  created() {
  },
  methods: {
    async init() {
      getSubPartsMaintList().then((res) => {
        this.partsMaintListList = res.data.data;
      });
      select().then((res) => {
        this.storeList = res.data.data;
      });
      let res = await dictionaryApi.getDictionary('COUNTRY_REGIN')
      this.countryList = res.data.data
    },
    getPartList(row, key) {
      let obj = this.partsMaintListList.find(ele => {
        return ele[key] === row[key]
      })
      if (obj) {
        row.partsName = obj.categoryName
        row.partsNo = obj.categoryNo
      }
    },
    getTotalAmount(listKey = 'partList', amountKey = 'stockInPrice') {
      if (!this.form[listKey] || this.form[listKey].length === 0) return
      let arr = this.form[listKey].map(ele => ele[amountKey])
      var sum = arr.reduce(function (prev, curr, idx, arr) {
        return Number(prev || 0) + Number(curr || 0);
      });
      this.form.totalAmount = sum
      this.form.amountInWords = numberToTraditionalChinese(this.form.totalAmount)
      if (!isNaN(sum)) {
        return sum
      }
    },
    async getDetail() {
      let res = await WarehouseApplyApi.financeCategoryScrapApplyDetails(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    addRow() {
      this.form.partList.push({
        key: Date.now(),
      });
    },
    deleteRow(row) {
      this.form.partList = this.form.partList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      // console.log(this.form);
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
          if (valid) {
          } else {
            console.log("error submit!!");
            return false;
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

.fullscreenL {
  overflow: scroll;
}

.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.w-100 {
  width: 100%;
}

.dec-icon {
  color: #979797;
  background-color: #eaeaea;
  padding: 3px 6px;
  border-radius: 2px;
  margin-right: 20px;
}

.exitFull {
  position: absolute;
  padding: 20px;
  color: transparent;
  z-index: 1000;
}

.exitFull:hover {
  color: #fff;
  background-color: #000;
}

.botton-row {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.table-now {
  width: 750px;
}
</style>
  