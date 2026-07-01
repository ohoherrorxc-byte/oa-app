<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{$t('assetsApply.scrappingApplication.title')}}
    </p>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" >
      <el-form-item :label="$t('assetsApply.scrappingApplication.scrapInstructions')" prop="scrapInstructions">
        <el-input type="textarea" v-model="form.scrapInstructions" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.scrappingApplication.totalAmount')" prop="totalAmount">
        {{ getTotalAmount() }}
        <!-- <el-input disabled v-model="form.totalAmount"></el-input> -->
      </el-form-item>
      <el-form-item :label="$t('assetsApply.scrappingApplication.amountInWords')" prop="amountInWords">
        <el-input v-model="form.amountInWords" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.scrappingApplication.scrapDate')" prop="scrapDate">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" class="w-100" v-model="form.scrapDate" type="datetime"
          :placeholder="$t('assetsApply.scrappingApplication.pleaseSelectDate')" :disabled="disabled"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.scrappingApplication.scrappingMethod')" prop="scrappingMethod">
        <el-select v-model="form.scrappingMethod" :disabled="disabled">
          <el-option value="变卖" label="变卖"></el-option>
          <el-option value="处置" label="处置"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table ref="multipleTable" :data="form.propertyList" @selection-change="handleSelectionChange"
          class="mb20" :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }">
          <el-table-column prop="chooseStatus" type="index" width="50" :label="$t('commonContent.serialNumber')" v-if="!isPdfDown"></el-table-column>
          <el-table-column property="assetCategories" :label="$t('assetsApply.scrappingApplication.assetCategories')" align="center" :width="isPdfDown?80:''">
            <template slot="header">
              {{$t('assetsApply.scrappingApplication.assetCategories')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetCategories'"
                :rules="rules.assetCategories">
                {{ scope.row.assetCategories }}
                <!-- <el-select disabled v-model="scope.row.assetCategories" clearable>
                  <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id"
                    :label="item.dictValue"></el-option>
                </el-select> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetName" :label="$t('assetsApply.scrappingApplication.assetName')" align="center" :width="isPdfDown?80:''">
            <template slot="header">
              {{$t('assetsApply.scrappingApplication.assetName')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetName'"
                :rules="rules.assetName">
                <el-select v-if="!disabled" :disabled="disabled" clearable v-model="scope.row.id" filterable @change="getAssetsDetail(scope.row, scope.$index)">
                  <el-option v-for="item in assetsList" :label="item.assetNameWithNumber" :value="item.id"
                    :key="item.id"></el-option>
                </el-select>
                <div v-else>{{ scope.row.assetName }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetNumber" :label="$t('assetsApply.scrappingApplication.assetNumber')" align="center" :width="isPdfDown?80:''">
            <template slot-scope="scope">
              {{ scope.row.assetNumber }}
              <!-- <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetNumber'"
                :rules="rules.assetNumber">
                <el-input disabled clearable v-model="scope.row.assetNumber"></el-input>
              </el-form-item> -->
            </template>
          </el-table-column>

          <el-table-column property="specificationAndModel" :label="$t('assetsApply.scrappingApplication.specificationAndModel')" align="center" :width="isPdfDown?80:''">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.specificationAndModel'"
                :rules="rules.specificationAndModel">
                {{ scope.row.specificationAndModel }}
                <!-- <el-input disabled clearable v-model="scope.row.specificationAndModel"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="brand" :label="$t('assetsApply.scrappingApplication.brand')" align="center" :width="isPdfDown?80:''">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.brand'" :rules="rules.brand">
                {{ scope.row.brand }}
                <!-- <el-input disabled clearable v-model="scope.row.brand"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('assetsApply.scrappingApplication.storageLocation')" align="center" :width="isPdfDown?80:''">
            <template slot="header">
              {{$t('assetsApply.scrappingApplication.storageLocation')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.storageLocation'"
                :rules="rules.storageLocation">
                <el-select  v-if="form.flow&&form.flow.status!=='finished'" filterable v-model="scope.row.storageLocation" clearable>
                  <el-option v-for="item in placeList" :value="item.dictValue" :key="item.id"
                    :label="item.dictValue"></el-option>
                </el-select>
                <div v-else>{{ scope.row.storageLocation }}</div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="unitPrice" :label="$t('assetsApply.scrappingApplication.unitPrice')" align="center" :width="isPdfDown?80:''">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.unitPrice'"
                :rules="rules.unitPrice">
                {{ scope.row.unitPrice }}
                <!-- <el-input disabled clearable v-model="scope.row.unitPrice"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('assetsApply.scrappingApplication.haveKey')" align="center" :width="isPdfDown?80:''">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.haveKey'"
                :rules="rules.haveKey">
               {{ scope.row.haveKey }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('assetsApply.scrappingApplication.serialNumber')" align="center" :width="isPdfDown?80:''">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.serialNumber'"
                :rules="rules.serialNumber">
               {{scope.row.serialNumber}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('assetsApply.scrappingApplication.operation')" align="center" v-if="!disabled" >
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
import AssetsApplyApi from "@/api/assetsApply/index";
import { getPlace, getCategories } from "../util";
import { mixins } from "../Mixin";
export default {
  mixins: [mixins],
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
      form: {
        scrapInstructions: "",
        totalAmount: "",
        amountInWords: "",
        scrapDate: "",
        scrappingMethod: "",
        assetCategory: "公司资产",
        assetCategories: "",
        supplierName: "",
        propertyList: [
          {
            assetName: "",
            assetNumber: "",
            assetClass: "",
            assetSubcategories: "",
            assetLevel: "",
            specificationAndModel: "",
            brand: "",
            unitPrice: "",
            quantity: "",
            money: "",
            serviceLife: "",
            relatedProjects: "",
            assetDescription: "",
            storageLocation: "",
          },
        ],
      },
      rules: {
        scrappingMethod: [
          { required: true, message: this.$t('assetsApply.scrappingApplication.pleaseSelectScrappingMethod'), trigger: "blur" },
        ],
        scrapInstructions: [
          { required: true, message: this.$t('assetsApply.scrappingApplication.pleaseEnterScrapInstructions'), trigger: "change" },
        ],

        assetCategories: [
          { required: true, message: this.$t('assetsApply.scrappingApplication.pleaseSelectAssetCategories'), trigger: "change" },
        ],
        supplierName: [
          { required: true, message: this.$t('assetsApply.scrappingApplication.pleaseEnterSupplierName'), trigger: "blur" },
        ],
        assetName: [
          { required: true, message: this.$t('assetsApply.scrappingApplication.pleaseEnterAssetName'), trigger: "blur" },
        ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
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
    this.remoteMethodAssetsName([2])
  },
  methods: {
    async init() {
      this.categoriesList = await getCategories();
      this.placeList = await getPlace();
    },
    getTotalAmount(listKey = 'propertyList', amountKey = 'unitPrice') {
      if (!this.form[listKey] || this.form[listKey].length === 0) return

      let arr = this.form[listKey].map(ele => ele[amountKey])
      var sum = arr.reduce(function (prev, curr, idx, arr) {
        return Number(prev || 0) + Number(curr || 0);
      });
      // console.log('sum'+sum)
      this.form.totalAmount = sum
      if (!isNaN(sum)) {
        return sum
      }
    },
    async getDetail() {
      let res = await AssetsApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    addRow() {
      this.form.propertyList.push({
        key: Date.now(),
      });
    },
    deleteRow(row) {
      this.form.propertyList = this.form.propertyList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      console.log(this.form);
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
