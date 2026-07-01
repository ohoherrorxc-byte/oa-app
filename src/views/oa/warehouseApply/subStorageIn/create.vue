<template>
    <basic-container>
      <p class="table-title">
        <span></span>{{ $t('assetsApply.storageApplication.title') }}
      </p>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-row class="row-flex">
          <el-col :span="12">
            <el-form-item :label="$t('stock.stockInNo')" prop="goodsShelvesNo">
              {{ form. goodsShelvesNo}}
              <!-- <el-input v-model="form.goodsShelvesNo" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('stock.partsNo')" prop="partsId">
              {{ form.partsNo }}
              <!-- <el-select v-model="form.partsId" :placeholder="$t('stock.pleaseSelectPartsNo')" :disabled="type === 'see'"
                filterable @change="getTableList">
                <el-option v-for="item in partsMaintListList" :key="item.id" :label="item.partsNo"
                  :value="item.id"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('stock.partsName')" prop="partsId">
              {{ form.partsName }}
              <!-- <el-select v-model="form.partsId" :placeholder="$t('stock.pleaseSelectPartsName')" :disabled="type === 'see'">
                <el-option v-for="item in partsMaintListList" :key="item.id" :label="item.partsName"
                  :value="item.id"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item :label="$t('stock.supplier')" prop="partsId">
              {{ form.supplier }}
            
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item :label="$t('stock.state')">
              {{ form.payStatus }}
             
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item :label="$t('stock.storeName')" prop="storeId">
              {{ form.storeName }}
              <!-- <el-select v-model="form.storeId" :placeholder="$t('stock.pleaseSelectStoreName')">
                <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('stock.goodsShelvesNo')" prop="goodsShelvesNo">
              <!-- <el-input v-model="form.goodsShelvesNo"></el-input> -->
              {{ form.goodsShelvesNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('stock.intoTime')" prop="intoTime">
              {{ form.intoTime }}
              <!-- <el-date-picker v-model="form.intoTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                style="width: 100%;"></el-date-picker> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('stock.stockInNumber')" prop="stockInNumber">
              {{form.quantity}}
              <!-- <el-input v-model="form.stockInNumber" :disabled="type === 'see'"></el-input> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item :label="$t('commonContent.remark')" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item :label="$t('commonContent.relatedAttachments')" prop="remark">
              <upload :fileList="form.fileList" btnName="上传" @handleRequest="handleRequest" :multiple="true"
                :showFileList="true"></upload>
            </el-form-item>
          </el-col> -->      
        </el-row>
      </el-form>
    </basic-container>
  </template>
    
  <script>
import WarehouseApplyApi from "@/api/warehouseApply/index";
  import PurchaseApplyApi from "@/api/purchaseApply/index";
  import { getPartsMaintList } from "@/api/base";
  import upload from '@/components/upload/index'
  export default {
    data() {
      return {
        purchaseApplyList: [],
        categoriesList: [],
        placeList: [],
        form: {
        },
        partsMaintListList:[],
        options: {
          partsMaintListList: []
        },
        rules: {
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
    components:{upload},
    props: {
      slotForm: {
        type: Object,
        default: {}
      }
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
        getPartsMaintList().then((res) => {
          this.partsMaintListList = res.data.data;
        });
      },
      async getDetail() {
        let res = await WarehouseApplyApi.financeCategoryStockInApplyDetails(this.businessId);
        if (res.data.code === 200) {
          this.form = res.data.data;
          this.$emit("getFormData", this.form);
        }
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
  
  @media (min-width: 768px) {}
  
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
    