<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{$t('receiveApplication.applyInfo')}}
    </p>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item :label="$t('receiveApplication.usageInstructions')" prop="usageInstructions">
        <el-input type="textarea" :disabled="disabled"  v-model="form.usageInstructions"></el-input>
      </el-form-item>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table ref="multipleTable" :data="form.propertyList" @selection-change="handleSelectionChange"
          class="mb20 table-now">
          <el-table-column prop="chooseStatus" type="index" width="50" :label="$t('commonContent.serialNumber')"></el-table-column>
          <el-table-column property="assetCategories" label="资产大类" align="center">
            <template slot="header">
              {{$t('receiveApplication.assetCategories')}}
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
          <el-table-column property="assetName" label="资产名称" align="center">
            <template slot="header">
              {{$t('receiveApplication.assetName')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetName'"
                :rules="rules.assetName">
                <el-select v-if="!disabled" clearable v-model="scope.row.id" filterable @change="getAssetsDetail(scope.row, scope.$index)">
                  <el-option v-for="item in assetsList" :label="item.assetNameWithNumber" :value="item.id"
                    :key="item.id"></el-option>
                </el-select>
                <div v-else>{{ scope.row.assetName }}</div>
                <!-- <el-input disabled v-else v-model="scope.row.assetName"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
            <el-table-column property="assetNumber" :label="$t('receiveApplication.assetNumber')" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                {{ scope.row.assetNumber }}
                <!-- <el-input disabled clearable v-model="scope.row.assetNumber"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="specificationAndModel" :label="$t('receiveApplication.specificationAndModel')" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                {{ scope.row.specificationAndModel }}
                <!-- <el-input disabled clearable v-model="scope.row.specificationAndModel"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="brand"   :label="$t('receiveApplication.brand')" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                {{ scope.row.brand }}
                <!-- <el-input disabled clearable v-model="scope.row.brand"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receiveApplication.storageLocation')" align="center">
            <template slot="header">
              {{$t('receiveApplication.storageLocation')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.storageLocation'"
                :rules="rules.storageLocation">
                <el-select filterable v-model="scope.row.storageLocation" clearable :disabled="form.flow&&form.flow.status==='finished'">
                  <el-option v-for="item in placeList" :value="item.dictValue" :key="item.id"
                    :label="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receiveApplication.haveKey')" align="center" width="80">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.haveKey'"
                :rules="rules.haveKey">
               {{ scope.row.haveKey }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receiveApplication.serialNumber')" align="center" width="100">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.serialNumber'"
                :rules="rules.serialNumber">
               {{scope.row.serialNumber}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="实际使用人" align="center" width="160">
                                 <template slot="header">
                                  实际使用人
                                 </template>
                                 <template slot-scope="scope">
                                    <el-form-item style="width: 100%;">
                                      <el-input clearable v-model="scope.row.actualUser"></el-input>
                                    </el-form-item>
                                 </template>
          </el-table-column>
          <el-table-column :label="$t('receiveApplication.operation')" align="center" v-if="!disabled">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">{{$t('receiveApplication.delete')}}</el-button>
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
  data() {
    return {
      categoriesList: [],
      placeList: [],
      form: {
        purchaseRequestId: "",
        purchaseRequestName: "",
        purchaseDate: "",
        storageTime: "",
          assetCategory: "公司资产",
        assetCategories: "",
        usageInstructions: "",
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
            actualUser: "",
          },
        ],
      },
      rules: {
        purchaseDate: [
          { required: true, message: this.$t('receiveApplication.pleaseSelectPurchaseDate'), trigger: "blur" },
        ],
        storageTime: [
          { required: true, message: this.$t('receiveApplication.pleaseSelectStorageTime'), trigger: "change" },
        ],

        assetCategories: [
          { required: true, message: this.$t('receiveApplication.pleaseSelectAssetCategories'), trigger: "change" },
        ],
        usageInstructions: [
          { required: true, message: this.$t('receiveApplication.pleaseInputUsageInstructions'), trigger: "blur" },
        ],
        assetName: [
          { required: true, message: this.$t('receiveApplication.pleaseInputAssetName'), trigger: "blur" },
        ],
        assetNumber: [
          { required: true, message: this.$t('receiveApplication.pleaseInputAssetNumber'), trigger: "blur" },
        ],
        assetLevel: [
          { required: true, message: this.$t('receiveApplication.pleaseSelectAssetLevel'), trigger: "blur" },
        ],
        specificationAndModel: [
          { required: true, message: this.$t('receiveApplication.pleaseInputSpecificationAndModel'), trigger: "blur" },
        ],
        brand: [{ required: true, message: this.$t('receiveApplication.pleaseInputBrand'), trigger: "blur" }],
        unitPrice: [{ required: true, message: this.$t('receiveApplication.pleaseInputUnitPrice'), trigger: "blur" }],
        quantity: [{ required: true, message: this.$t('receiveApplication.pleaseInputQuantity'), trigger: "blur" }],
        money: [{ required: true, message: this.$t('receiveApplication.pleaseInputMoney'), trigger: "blur" }],
        serviceLife: [
          { required: true, message: this.$t('receiveApplication.pleaseInputServiceLife'), trigger: "blur" },
        ],
        relatedProjects: [
          { required: true, message: this.$t('receiveApplication.pleaseInputRelatedProjects'), trigger: "change" },
        ],
        assetDescription: [
          { required: true, message: this.$t('receiveApplication.pleaseSelectAssetDescription'), trigger: "change" },
        ],
        storageLocation: [
          { required: true, message: this.$t('receiveApplication.pleaseSelectStorageLocation'), trigger: "blur" },
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
  created() {
    this.remoteMethodAssetsName([1,5])
  },
  computed: {
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async init() {
      this.categoriesList = await getCategories();
      this.placeList = await getPlace();
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
          if (!valid) {
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

.table-now {}
</style>
