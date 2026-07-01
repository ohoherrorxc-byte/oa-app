<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('storage.info') }}
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="110px">
      <el-form-item :label="$t('storage.instructions')" prop="warehousingRemark" style="width: 98%;">
        <el-input v-model="form.warehousingRemark" type="textarea"></el-input>
      </el-form-item>
      <el-form-item :label="$t('storage.relatedPurchase')" prop="purchaseRequestName" style="width: 98%;">
        <div v-if="!disabled" class="flex">
          <el-select  v-model="form.purchaseRequestName" clearable filterable @change="getPurchaseRow">
            <el-option v-for="item in purchaseApplyList" :key="item.id" :label="item.titleName"
              :value="item.titleName"></el-option>
          </el-select>
        </div>
        <div v-else class="flex">
          <p v-if="isWithPurchaseRequestId"  @click="toPath" class="w-100-blue">{{ form.purchaseRequestName + " - " + $t('commonContent.viewDetails') }} </p>
          <p v-else >{{ $t('commonContent.viewNoFill') }} </p>
        </div>
      </el-form-item>
      <el-form-item style="width: 98%;">
        <div v-if="!disabled" class="flex">
          <p v-if="isWithPurchaseRequestId"  @click="toPath" class="w-100-blue">{{ form.purchaseRequestName + " - " + $t('commonContent.viewDetails') }} </p>
          <p v-else >{{ $t('commonContent.viewNoFill') }} </p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('parts.category')" prop="partsCategory">
        <el-select v-model="form.partsCategory" clearable filterable>
          <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id"
            :label="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('storage.date')" prop="warehousingTime">
        <el-date-picker class="w-100" v-model="form.warehousingTime" value-format="yyyy-MM-dd HH:mm:ss" type="date"
                        :placeholder="$t('commonContent.selectDateTime')"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('storage.type')" prop="warehousingType">
        <el-select v-model="form.warehousingType">
          <el-option :label="$t('storage.purchaseStorage')" value="采购入库"></el-option>
          <el-option :label="$t('storage.manualStorage')" value="手动入库"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('storage.keeper')" prop="warehousingPerson">
        <autoAddress ref="autoAddress" :initList="initList" class="w-100" @getPerson="getWarehousing"
                     :placeholder="$t('storage.keeper')" :initData="form.warehousingPerson" :disabled="isEdit" :multiple="false">
        </autoAddress>
      </el-form-item>
      <!-- <el-form-item label="零件名称" prop="partName">
        <el-input v-model="form.partName"></el-input>
      </el-form-item> -->
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table ref="multipleTable" :data="form.partBasicDtoList" class="mb20 table-now">
          <el-table-column prop="chooseStatus" type="index" width="50"
            :label="$t('commonContent.serialNumber')"></el-table-column>
          <!-- <el-table-column property="partName" label="零件名称选择" align="center">
                        <template slot-scope="scope">
                            <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                                :rules="rules.partName">
                                <el-input clearable v-model="scope.row.partName"></el-input>
                            </el-form-item>
                        </template>
          </el-table-column>-->
          <el-table-column property="partName" :label="$t('parts.name')" align="center" width="180">
            <template slot="header">
              {{ $t('parts.name') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                :rules="rules.partName">
                <el-input clearable v-model="scope.row.partName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="partAbbreviation" :label="$t('parts.abbreviation')" align="center" width="120">
            <template slot="header">
              {{ $t('parts.abbreviation') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partAbbreviation'"
                :rules="rules.partAbbreviation">
                <el-input clearable v-model="scope.row.partAbbreviation"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- <el-table-column property="partNumber" label="零件编号" align="center" width="180">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partNumber'"
                :rules="rules.partNumber">
                {{ scope.row.partNumber }}
              </el-form-item>
            </template>
          </el-table-column> -->
          <!-- <el-table-column property="partsCategory" label="零件大类" align="center" width="120">
            <template slot-scope="scope">
              <el-form-item prop="partBasicDtoList.' + scope.$index + '.partsCategory'" style="width: 100%;">
                <el-select v-model="scope.row.partsCategory" clearable filterable>
                  <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id"
                    :label="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column> -->
          <el-table-column property="middlePart" :label="$t('parts.middleCategory')" align="center" width="120">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input v-model="scope.row.middlePart" clearable filterable>

                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="partsSubcategory" :label="$t('parts.subCategory')" align="center" width="120">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input v-model="scope.row.partsSubcategory" clearable filterable>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- <el-table-column property="partBomName" label="BOM名称" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'partBasicDtoList.' + scope.$index + '.partBomName'"
                :rules="rules.partBomName"
              >
                <el-input clearable v-model="scope.row.partBomName"></el-input>
              </el-form-item>
            </template>
          </el-table-column> -->
          <el-table-column property="specificationAndModel" :label="$t('parts.specModel')" align="center" width="180">
            <template slot="header">
              {{ $t('parts.specModel') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.specificationAndModel'"
                :rules="rules.specificationAndModel">
                <el-input clearable v-model="scope.row.specificationAndModel"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- <el-table-column property="partLevel" label="零件级别" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'partBasicDtoList.' + scope.$index + '.partLevel'"
                :rules="rules.partLevel"
              >
                <el-select clearable v-model="scope.row.partLevel">
                  <el-option label="A" value="A"></el-option>
                  <el-option label="B" value="B"></el-option>
                  <el-option label="C" value="C"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('parts.unitPrice')" align="center" width="140">
            <template slot="header">
              {{ $t('parts.unitPrice') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.unitPrice'"
                :rules="rules.unitPrice">
                <el-input clearable v-model="scope.row.unitPrice"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('parts.lossRate')" align="center">

            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                {{ "1‰/" + $t('commonContent.day') }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('parts.netWorth')" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                {{ getNetWorth(scope.row) }}
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="零件数量" align="center">
            <template slot="header">
              {{ $t('parts.quantity') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.quantity'"
                :rules="rules.quantity">
                <el-input clearable v-model="scope.row.quantity"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="适用项目" align="center" width="150">
            <template slot="header">
              {{ $t('parts.applicableProject') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partsProject'"
                :rules="rules.partsProject">
                <el-input clearable v-model="scope.row.partsProject"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="存放地点" align="center" width="150">
            <template slot="header">
              {{ $t('parts.storageLocation') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.storageLocation'"
                :rules="rules.storageLocation">
                <el-input v-model="scope.row.storageLocation"></el-input>
                <!-- <el-select v-model="scope.row.storageLocation" clearable>
                  <el-option v-for="item in placeList" :value="item.dictValue" :key="item.id"
                    :label="item.dictValue"></el-option>
                </el-select> -->
              </el-form-item>
            </template>
          </el-table-column>
          <!-- <el-table-column label="金额" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'partBasicDtoList.' + scope.$index + '.money'"
                :rules="rules.money"
              >
                <el-input clearable v-model="scope.row.money"></el-input>
              </el-form-item>
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('commonContent.status')" align="center" width="100">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                {{ scope.row.currentState }}
                <!-- <el-input clearable v-model="scope.row.status"></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commonContent.remark')" align="center" width="100">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.remark'"
                :rules="rules.remark">
                <el-input clearable v-model="scope.row.remark" type="textarea"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('parts.systemId')" align="center" width="180">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partId'"
                :rules="rules.remark">
                {{ scope.row.partId }}
                <!-- <el-input clearable v-model="scope.row.partId" disabled></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column :label="$t('commonContent.operation')" align="center" v-if="!disabled">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-button type="text" @click="deleteRow(scope.row)"
                  style="color:red">{{ $t('commonContent.delete') }}</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import autoAddress from "@/components/autoAddress/index";
import PartsApplyApi from "@/api/partsApply/index";
import { getPlace, getPartCategories } from "../util";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import { daysBetween } from '@/util/util'
import { mapGetters } from 'vuex'
export default {
  components: {
    autoAddress,
  },
  data() {
    return {
      categoriesList: [],
      purchaseApplyList: [],
      placeList: [],
      form: {
        applyTime: "",
        approvalCode: "",
        checkRemark: "",
        purchaseRequestId: '',
        purchaseRequestName: '',
        expectReturnTime: "",
        partBasicDtoList: [
          {
            appointmentPerson: "",
            currentState: "",
            middlePart: "",
            money: null,
            partBomName: "",
            partLevel: "",
            partName: "",
            partNumber: "",
            partAbbreviation: null,
            partsCategory: "",
            partsProject: "",
            partsSubcategory: "",
            purchasePartNumber: "",
            recipient: "",
            remark: "",
            returnTime: "",
            specificationAndModel: "",
            status: null,
            storageLocation: "",
            unitPrice: null,
            usageDescription: "",
            usageTime: "",
          },
        ],
        partName: "",
        partsCategory: "",
        processDefinitionId: "",
        processInstanceId: "",
        remark: "",
        returnRemark: "",
        scrapRemark: "",
        scrapTime: "",
        scrapTotalAmount: null,
        scrapWay: "",
        status: null,
        totalAmountCapital: "",
        useRemark: "",
        warehousingPerson: "",
        warehousingRemark: "",
        warehousingTime: "",
        warehousingType: "",
      },
      rules: {
        warehousingRemark: [
          { required: true, message: this.$t('storage.storageInstructionsRequired'), trigger: "blur" }
        ],
        warehousingTime: [
          { required: true, message: this.$t('storage.storageDateRequired'), trigger: "change" }
        ],
        specificationAndModel: [
          { required: true, message: this.$t('storage.specificationRequired'), trigger: "blur" }
        ],
        partsCategory: [
          { required: true, message: this.$t('storage.partCategoryRequired'), trigger: "change" }
        ],
        supplierName: [
          { required: true, message: this.$t('storage.supplierNameRequired'), trigger: "blur" }
        ],
        partName: [
          { required: true, message: this.$t('storage.partNameRequired'), trigger: "blur" }
        ],
        partAbbreviation: [
          { required: true, message: this.$t('storage.partAbbreviationRequired'), trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: this.$t('storage.unitPriceRequired'), trigger: "blur" }
        ],
        quantity: [
          { required: true, message: this.$t('storage.quantityRequired'), trigger: "blur" }
        ],
        money: [
          { required: true, message: this.$t('storage.amountRequired'), trigger: "blur" }
        ],
        partsProject: [
          { required: true, message: this.$t('storage.projectRequired'), trigger: "blur" }
        ],
        storageLocation: [
          { required: true, message: this.$t('storage.storageLocationRequired'), trigger: "change" }
        ]
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
      purchaseTitle: '',
      isLoadingTitle: false
    };
  },

  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (!this.disabled){
      this.getPurchaseApplyList();
    }
    if (this.businessId) {
      this.getDetail();
    }
    this.init();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
    isWithPurchaseRequestId(){
      return !!this.form.purchaseRequestId
    }
  },
  methods: {
    getWarehousing(data) {
      this.form.warehousingPerson = data.realName;
    },
    async getPurchaseApplyList() {
      let res = await PurchaseApplyApi.selectList();
      const userDepartmentId =  this.userInfo.dept_id;
      if (res.data.code === 200) {
        this.purchaseApplyList = res.data.data.filter(item => item.applyDept === userDepartmentId);
      }
      // const userId =  this.userInfo.user_id;
      // if (res.data.code === 200) {
      //   this.purchaseApplyList = res.data.data.filter(item => item.applyPerson === userId);
      // }
    },
    getNetWorth(row) {
      if (this.form.warehousingTime && row.unitPrice) {
        let value = daysBetween(this.form.warehousingTime)
        value = value > 0 ? value : 0
        return (Number(row.unitPrice) - Number(row.unitPrice) * 0.001 * Number(value)).toFixed(3)
      }
    },
    toPath() {
      if (this.form.purchaseRequestId) {
        let url = `/purchaseApplication?businessId=${this.form.purchaseRequestId}`
        window.open(this.$router.resolve({ path: url }).href, '_blank')
        // this.$router.push(`/purchaseApplication?businessId=${this.form.purchaseRequestId}`)
      }
    },
    getPurchaseRow(val){
      // val 是选中的 item.Name
      // 根据 val（item.id）找到对应的 item，进而拿到 titleName
      this.form.purchaseRequestId = "";
      if (val){
        const selectedItem = this.purchaseApplyList.find(item => item.titleName === val);
        if (selectedItem) {
          this.form.purchaseRequestId = selectedItem.id;
        }
      }
    },
    async init() {
      this.categoriesList = await getPartCategories();
      this.placeList = await getPlace();
    },
    async getDetail() {
      // let res = await PartsApplyApi.details(this.businessId);
      let res = await PartsApplyApi.stockInDetails(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    addRow() {
      this.form.partBasicDtoList.push({
        key: Date.now(),
      });
    },
    deleteRow(row) {
      this.form.partBasicDtoList = this.form.partBasicDtoList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      //console.log(this.form);
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

.w-100-blue {
  color: blue;
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
