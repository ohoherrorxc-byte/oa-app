<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('application.info') }}
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item :label="$t('application.useInstructions')" prop="useRemark">
        <el-input type="textarea" v-model="form.useRemark"></el-input>
      </el-form-item>
      <el-form-item :label="$t('application.expectedReturnDate')" prop="expectReturnTime">
        <el-date-picker
          v-model="form.expectReturnTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('commonContent.selectDateTime')"
          style="width: 100%;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.partBasicDtoList"
          @selection-change="handleSelectionChange"
          class="mb20 table-now">
          <el-table-column prop="chooseStatus" type="index" width="50"
                           :label="$t('commonContent.serialNumber')"></el-table-column>
          <!-- 1. 零件大类列（新增：先选大类） -->
          <el-table-column :label="$t('parts.category')" align="center" width="180">
            <template slot-scope="scope">
              <el-form-item :prop="'partBasicDtoList.' + scope.$index + '.partsCategory'" :rules="rules.partsCategory">
                <el-select v-model="scope.row.partsCategory" @change="onCategoryChange(scope.row, scope.$index)"
                           placeholder="请选零件大类">
                  <el-option v-for="item in categoriesList" :key="item.id" :label="item.dictValue"
                             :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 2. 零件名称列（联动：仅显示当前大类下的零件） -->
          <el-table-column :label="$t('parts.name')" align="center" width="360">
            <template slot-scope="scope">
              <el-form-item :prop="'partBasicDtoList.' + scope.$index + '.partName'" :rules="rules.partName">
                <el-select filterable clearable v-model="scope.row.partName"
                           @change="getPartsDetail(scope.row, scope.$index)"
                           :placeholder="scope.row.partsCategory ? '可模糊筛选，例如输入零件号后4位' : '请先选择零件大类'"
                           :disabled="!scope.row.partsCategory">
                  <el-option
                    v-for="item in getPartsByCategory(scope.row.partsCategory)" :key="item.id"
                    :label="`${item.partName || '缺零件名'}（型号：${item.specificationAndModel || 'N/A'}；项目：${item.partsProject || 'N/A'}；零件号：${item.partNumber || 'N/A'}）`"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="partsProject"
            :label="$t('parts.applicableProject')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="specificationAndModel"
            :label="$t('parts.specification')"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('parts.storageLocation')"
            prop="storageLocation"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('parts.number')"
            prop="partNumber"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="partId"
            :label="$t('parts.systemId')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="remark"
            :label="$t('commonContent.remark')"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('commonContent.operation')"
            align="center"
            v-if="!disabled"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="deleteRow(scope.row)"
                style="color:#ff0000"
              >{{ $t('commonContent.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--          <el-table-column property="partName" :label="$t('parts.name')" align="center" width="180">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"-->
        <!--                :rules="rules.partName">-->
        <!--                <el-select-->
        <!--                  filterable-->
        <!--                  clearable-->
        <!--                  v-model="scope.row.partName"-->
        <!--                  @change="getPartsDetail(scope.row, scope.$index)">-->
        <!--                  <el-option-->
        <!--                    v-for="item in partsList"-->
        <!--                    :key="item.id"-->
        <!--                    :label="item.partName + ' ' + item.specificationAndModel + ' ' + item.partNumber"-->
        <!--                    :value="item.id">-->
        <!--                  </el-option>-->
        <!--                </el-select>-->
        <!--              </el-form-item>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="partsCategory" :label="$t('parts.category')" align="center"></el-table-column>-->
        <!--          <el-table-column property="partNumber" :label="$t('parts.number')" prop="partNumber" align="center">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partNumber'"-->
        <!--                :rules="rules.partNumber">-->
        <!--                <el-select filterable clearable v-model="scope.row.partNumber"-->
        <!--                  @change="getPartsDetail(scope.row, scope.$index, 'partNumber')">-->
        <!--                  <el-option v-for="item in partsList" :key="item.id" :label="item.partNumber"-->
        <!--                    :value="item.id"></el-option>-->
        <!--                </el-select>-->
        <!--              </el-form-item>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column :label="$t('parts.storageLocation')" align="center" prop="storageLocation"></el-table-column>-->
        <!--          <el-table-column prop="partId" :label="$t('parts.systemId')" align="center"></el-table-column>-->
        <!--          <el-table-column prop="specificationAndModel" :label="$t('parts.specification')" align="center">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.specificationAndModel'"-->
        <!--                :rules="rules.specificationAndModel">-->
        <!--                <el-select filterable clearable v-model="scope.row.specificationAndModel"-->
        <!--                  @change="getPartsDetail(scope.row, scope.$index, 'specificationAndModel')">-->
        <!--                  <el-option v-for="item in partsList" :key="item.id" :label="item.specificationAndModel"-->
        <!--                    :value="item.id"></el-option>-->
        <!--                </el-select>-->
        <!--              </el-form-item>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="partsProject" :label="$t('parts.applicableProject')" align="center"></el-table-column>-->
        <!--          <el-table-column prop="remark" :label="$t('commonContent.remark')" align="center"></el-table-column>-->
        <!--          <el-table-column :label="$t('commonContent.operation')" align="center" v-if="!disabled">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-form-item style="width: 100%;">-->
        <!--                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">{{ $t('commonContent.delete') }}</el-button>-->
        <!--              </el-form-item>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import PartsApplyApi from "@/api/partsApply/index";
import {getPlace, getPartCategories} from "../util";
import {mixins} from "../Mixin";
import {dealTimerSecond} from '@/util/util'
import {mapGetters} from 'vuex'

export default {
  mixins: [mixins],
  data() {
    return {
      categoriesList: [],
      placeList: [],
      partsList: [],
      allInStockParts: [],
      form: {
        expectReturnTime: "",
        useRemark: "",
        partBasicDtoList: [
          {
            partName: "",
            partId: "",
            partNumber: "",
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
        partsCategory: [
          {required: true, message: this.$t('application.partCategoryRequired'), trigger: "change"},
        ],
        useRemark: [
          {required: true, message: this.$t('application.useRemarkRequired'), trigger: 'blur'}
        ],
        expectReturnTime: [
          {required: true, message: this.$t('application.returnDateRequired'), trigger: 'change'}
        ],
        partName: [
          {required: true, message: this.$t('application.partNameRequired'), trigger: 'blur'}
        ],
        partNumber: [
          {required: true, message: this.$t('application.partNumberRequired'), trigger: 'blur'}
        ]
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
    this.remoteMethodPartName('isStart', '在库中')
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async init() {
      this.categoriesList = await getPartCategories();
      this.placeList = await getPlace();
      await this.loadAllInStockParts();
    },
    async loadAllInStockParts() {
      const obj = {
       currentState:"在库中",
      };
      let res = await PartsApplyApi.getBasicList(obj);
      if (res.data.code === 0) {
        this.allInStockParts = res.data.data;
      }
    },
    onCategoryChange(row, index) {
      row.partName = "";
      row.partNumber = "";
      row.partId = "";
      row.storageLocation = "";
      row.specificationAndModel = "";
    },
    getPartsByCategory(categoryId) {
      return this.allInStockParts.filter(
        part => part.partsCategory === categoryId
      );
    },
    async getPartsDetail(row, index) {
      const selectedPart = this.getPartsByCategory(row.partsCategory).find(
        item => item.id === row.partName
      );
      if (selectedPart) {
        row.partNumber = selectedPart.partNumber;
        row.storageLocation = selectedPart.storageLocation;
        row.specificationAndModel = selectedPart.specificationAndModel;
        row.partId = selectedPart.id;
        row.partsProject = selectedPart.partsProject;
      }
    },
    async getDetail() {
      // let res = await PartsApplyApi.details(this.businessId);
      let res = await PartsApplyApi.usingDetails(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    addRow() {
      this.form.partBasicDtoList.push({
        key: Date.now(),
        partsCategory: "",
        partName: "",
        partNumber: "",
        storageLocation: "",
        specificationAndModel: "",
      });
    },
    deleteRow(row) {
      this.form.partBasicDtoList = this.form.partBasicDtoList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      this.form.expectReturnTime = dealTimerSecond(this.form.expectReturnTime)
      let partCategoryList = this.form.partBasicDtoList.map(ele => ele.partsCategory)
      partCategoryList = Array.from(new Set(partCategoryList));
      if (partCategoryList.length > 1 && (partCategoryList.includes('插拔SIM卡') || partCategoryList.includes('贴片SIM卡'))) {
        this.$message.error('零件大类包括SIM卡只能选择SIM卡一种类型')
        return
      }
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
    width: 90%;
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
}
</style>
