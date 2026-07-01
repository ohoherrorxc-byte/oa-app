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
              <el-select v-model="form.partsId" disabled>
                <el-option v-for="item in partsMaintListList" :key="item.id" :label="item.supplier"
                  :value="item.id"></el-option>
              </el-select> 
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item :label="$t('stock.state')">
              {{ form.status }}
            
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
        <!-- <el-col :span="24">
          <el-form-item label-width="0" style="width: 100%;">
            <el-table :data="form.orderInfoDtoList" style="width: 100%">
              <el-table-column prop="goodsShelvesNo" :label="$t('stock.stockInNo')">
              </el-table-column>
              <el-table-column prop="partsId" :label="$t('stock.partsNo')">
              </el-table-column>
              <el-table-column prop="partsName" :label="$t('stock.partsName')">
              </el-table-column>
              <el-table-column prop="payStatus" :label="$t('stock.state')">
              </el-table-column>
              <el-table-column prop="storeId" :label="$t('stock.storeName')">
              </el-table-column>
              <el-table-column prop="goodsShelvesNo" :label="$t('stock.goodsShelvesNo')">
              </el-table-column>
              <el-table-column prop="intoTime" :label="$t('stock.intoTime')">
              </el-table-column>
              <el-table-column prop="stockInNumber" :label="$t('stock.stockInNumber')">
              </el-table-column>
              <el-table-column prop="remark" :label="$t('commonContent.remark')">
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
  </basic-container>
</template>
  
<script>
import { getPartsMaintList } from "@/api/base";
import upload from '@/components/upload/index'
import WarehouseApplyApi from "@/api/warehouseApply/index";
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
      let res = await WarehouseApplyApi.financeStockInApplyDetails(this.businessId);
      if (res.data.code === 200||res.data.code === 0) {
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
  