<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{$t('assetsApply.storageApplication.title')}}
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="110px">
      <el-form-item :label="$t('assetsApply.storageApplication.relatedPurchaseApplication')" prop="purchaseRequestName">
        <div class="flex">
          <el-select v-model="form.purchaseRequestId" clearable filterable @change="getPurchaseRow">
            <el-option v-for="item in purchaseApplyList" :key="item.id" :label="item.titleName"
              :value="item.id"></el-option>
          </el-select>
          <p @click="toPath" class="detailLink">{{$t('assetsApply.storageApplication.viewDetails')}}</p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.storageApplication.purchaseDate')" prop="purchaseDate">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" class="w-100" v-model="form.purchaseDate" type="datetime"
          placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.storageApplication.storageDate')" prop="storageTime">
        <el-date-picker class="w-100" v-model="form.storageTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
          placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.storageApplication.assetCategory')" prop="assetCategory">
        <el-input disabled v-model="form.assetCategory"></el-input>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.storageApplication.assetCategories')" prop="assetCategories">
        <el-select v-model="form.assetCategories" clearable>
          <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('assetsApply.storageApplication.supplierName')" prop="supplierName">
        <el-input v-model="form.supplierName"></el-input>
      </el-form-item>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table ref="multipleTable" :data="form.propertyList" class="mb20 table-now">
          <el-table-column prop="chooseStatus" type="index" width="50" :label="$t('commonContent.serialNumber')"></el-table-column>
          <el-table-column property="assetName" label="资产名称" align="center"  width="160">
            <template slot="header">
                {{$t('assetsApply.storageApplication.assetName')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetName'"
                :rules="rules.assetName">
                <el-input v-model="scope.row.assetName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetAbbreviation" :label="$t('assetsApply.storageApplication.assetAbbreviation')" align="center" width="140">
            <template slot="header">
              {{$t('assetsApply.storageApplication.assetAbbreviation')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetAbbreviation'"
                :rules="rules.assetAbbreviation">
                <el-input clearable v-model="scope.row.assetAbbreviation"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetLevel" :label="$t('assetsApply.storageApplication.assetLevel')" align="center" width="100">
            <template slot="header">
              {{$t('assetsApply.storageApplication.assetLevel')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetLevel'"
                :rules="rules.assetLevel">
                <el-select clearable v-model="scope.row.assetLevel">
                  <el-option label="A" value="A"></el-option>
                  <el-option label="B" value="B"></el-option>
                  <el-option label="C" value="C"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="specificationAndModel" label="规格型号" align="center" width="140">
            <template slot="header">
              {{$t('assetsApply.storageApplication.specificationAndModel')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.specificationAndModel'"
                :rules="rules.specificationAndModel">
                <el-input clearable v-model="scope.row.specificationAndModel"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="brand" label="品牌" align="center" width="140">
            <template slot="header">
              {{$t('assetsApply.storageApplication.brand')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.brand'" :rules="rules.brand">
                <el-input clearable v-model="scope.row.brand"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="unitPrice" label="单价" align="center" width="120">
            <template slot="header">
              {{$t('assetsApply.storageApplication.unitPrice')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.unitPrice'"
                :rules="rules.unitPrice">
                <el-input clearable v-model="scope.row.unitPrice"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" width="120">
            <template slot="header">
              {{$t('assetsApply.storageApplication.quantity')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.quantity'"
                :rules="rules.quantity">
                <el-input clearable v-model="scope.row.quantity"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center" width="100">
            <template slot="header">
              {{$t('assetsApply.storageApplication.money')}}
              <!-- <span class="red">*</span> -->
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.money'" :rules="rules.money">
                <!-- <el-input clearable v-model="scope.row.money"></el-input> -->
                {{ getRowMoney(scope.row) }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="使用年限" align="center" width="140">
            <template slot="header">
              {{$t('assetsApply.storageApplication.serviceLife')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.serviceLife'"
                :rules="rules.serviceLife">
                <el-input clearable v-model="scope.row.serviceLife"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="相关项目" align="center" width="160">
            <template slot="header">
              {{$t('assetsApply.storageApplication.relatedProjects')}}
              <!-- <span class="red">*</span> -->
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.relatedProjects'"
                :rules="rules.relatedProjects">
                <el-input clearable v-model="scope.row.relatedProjects"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="资产说明" align="center" width="100">
            <template slot="header">
              {{$t('assetsApply.storageApplication.assetDescription')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.assetDescription'"
                :rules="rules.assetDescription">
                <el-select clearable v-model="scope.row.assetDescription">
                  <el-option label="个人" value="个人"></el-option>
                  <el-option label="公用" value="公用"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="存放地点" align="center" width="140">
            <template slot="header">
              {{$t('assetsApply.storageApplication.storageLocation')}}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.storageLocation'"
                :rules="rules.storageLocation">
                <el-select filterable v-model="scope.row.storageLocation" clearable>
                  <el-option v-for="item in placeList" :value="item.dictValue" :key="item.id"
                    :label="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('assetsApply.storageApplication.haveKey')" align="center" width="80">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.haveKey'"
                :rules="rules.haveKey">
                <el-select v-model="scope.row.haveKey" clearable>
                  <el-option value="是" label="是"></el-option>
                  <el-option value="否" label="否"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="钥匙数量" align="center" width="160">
                      <template slot="header">
                       钥匙数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item style="width: 100%;">
                          <el-input clearable v-model="scope.row.keyNum"></el-input>
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
          <el-table-column label="电脑是否入域" align="center" width="80">
          <template slot="header">
                        电脑是否入域
                        <!-- <span class="red">*</span> -->
                      </template>
                      <template slot-scope="scope">
                        <el-form-item style="width: 100%;">
                          <el-select v-model="scope.row.computerDomainEntry" clearable>
                            <el-option value="是" label="是"></el-option>
                            <el-option value="否" label="否"></el-option>
                          </el-select>
                        </el-form-item>
                      </template>
           </el-table-column>
          <el-table-column :label="$t('assetsApply.storageApplication.serialNumber')" align="center" width="140">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'propertyList.' + scope.$index + '.serialNumber'"
                :rules="rules.serialNumber">
                <el-input v-model="scope.row.serialNumber" clearable>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('assetsApply.storageApplication.operation')" align="center" v-if="!disabled">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">{{$t('assetsApply.storageApplication.delete')}}</el-button>
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
import PurchaseApplyApi from "@/api/purchaseApply/index";
export default {
  mixins: [mixins],
  data() {
    return {
      purchaseApplyList: [],
      categoriesList: [],
      placeList: [],
      form: {
        purchaseRequestId: "",
        purchaseRequestName: "",
        purchaseDate: "",
        storageTime: "",
        assetCategory: "公司资产",
        assetCategories: "",
        supplierName: "",
        propertyList: [
          {
            assetName: "",
            assetAbbreviation: "",
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
            keyNum: "",
            computerDomainEntry: "",
            actualUser: "",
            haveKey: '否'
          },
        ],
      },
      rules: {
        // purchaseDate: [
        //   { required: true, message: "请选择采购日期", trigger: "blur" },
        // ],
        storageTime: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseSelectStorageDate'), trigger: "change" },
        ],
        assetCategories: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseSelectAssetCategories'), trigger: "change" },
        ],
        supplierName: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterSupplierName'), trigger: "blur" },
        ],
        assetName: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterAssetName'), trigger: "blur" },
        ],
        assetAbbreviation: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterAssetAbbreviation'), trigger: "blur" },
        ],
        assetLevel: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseSelectAssetLevel'), trigger: "change" },
        ],
        specificationAndModel: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterSpecificationAndModel'), trigger: "blur" },
        ],
        brand: [{ required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterBrand'), trigger: "blur" }],
        unitPrice: [{ required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterUnitPrice'), trigger: "blur" }],
        quantity: [{ required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterQuantity'), trigger: "blur" }],
        money: [{ required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterMoney'), trigger: "blur" }],
        serviceLife: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseEnterServiceLife'), trigger: "blur" },
        ],
        // relatedProjects: [
        //   { required: true, message: "请输入相关项目", trigger: "change" },
        // ],
        assetDescription: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseSelectAssetDescription'), trigger: "change" },
        ],
        storageLocation: [
          { required: true, message: this.$t('assetsApply.storageApplication.pleaseSelectStorageLocation'), trigger: "change" },
        ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
    };
  },
  props: {
    slotForm: {
      type: Object,
      default: {}
    }
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    this.getPurchaseApplyList();
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
    async getDetail() {
      let res = await AssetsApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    async getPurchaseApplyList() {
      let res = await PurchaseApplyApi.selectList();
      if (res.data.code === 200) {
        this.purchaseApplyList = res.data.data;
      }
    },
    toPath() {
      if (this.form.purchaseRequestId) {
        let url = `/purchaseApplication?businessId=${this.form.purchaseRequestId}`
        window.open(this.$router.resolve({ path: url }).href, '_blank')
        // this.$router.push(`/purchaseApplication?businessId=${this.form.purchaseRequestId}`)
      }
    },
    getPurchaseRow(v) {
      let row = this.purchaseApplyList.find(ele => {
        return ele.id === v
      })
      this.form.purchaseDate = row.createTime
      this.form.purchaseRequestName = row.titleName
    },
    getRowMoney(row) {
      row.money = Number(row.unitPrice || 0) * Number(row.quantity || 0).toFixed(2)
      return row.money
    },
    addRow() {
      this.form.propertyList.push({
        key: Date.now(),
        haveKey: '否'
      });
    },
    deleteRow(row) {
      this.form.propertyList = this.form.propertyList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      if (!this.slotForm.titleName) {
        this.$message.error(this.$t('assetsApply.storageApplication.pleaseEnterTitle'))
        return false
      }
      // console.log(this.form);
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, msg) => {
          resolve(valid);
          if (valid) {
          } else {
            console.log(msg)
            this.$message({
              message: `${Object.values(msg)[0][0].message}`,
              type: "warning",
            });
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
