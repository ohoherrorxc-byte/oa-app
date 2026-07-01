<template>
  <basic-container>
    <p class="table-title">
      <span></span>申请信息
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="销售订单说明" prop="usageInstructions">
        <el-input type="textarea" v-model="form.usageInstructions"></el-input>
      </el-form-item>
      <el-form-item label="订单类型" prop="usageInstructions">
        <el-input v-model="form.usageInstructions"></el-input>
      </el-form-item>
      <el-form-item label="销售合同" prop="usageInstructions">
        <el-input v-model="form.usageInstructions"></el-input>
      </el-form-item>
      <el-form-item label="销售合同编号" prop="usageInstructions">
        <el-input v-model="form.usageInstructions"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="usageInstructions">
        <el-input v-model="form.usageInstructions"></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="usageInstructions">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="订单数量" prop="usageInstructions">
        <el-input v-model="form.usageInstructions"></el-input>
      </el-form-item>
      <el-form-item label="订单金额" prop="usageInstructions">
        <el-input></el-input>
      </el-form-item>
      <div>零件信息</div>

      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.propertyList"
          @selection-change="handleSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column prop="chooseStatus" type="index" width="50" label="序号"></el-table-column>
          <el-table-column property="assetCategories" label="零件名称" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'propertyList.' + scope.$index + '.assetCategories'"
                :rules="rules.assetCategories"
              >
                <el-select v-model="scope.row.assetCategories" clearable>
                  <el-option
                    v-for="item in categoriesList"
                    :value="item.dictValue"
                    :key="item.id"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetName" label="零件订单数量" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'propertyList.' + scope.$index + '.assetName'"
                :rules="rules.assetName"
              >
                <el-input clearable v-model="scope.row.assetName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetNumber" label="单价" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input clearable v-model="scope.row.assetNumber"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="总金额" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'propertyList.' + scope.$index + '.storageLocation'"
                :rules="rules.storageLocation"
              >
                <el-select v-model="scope.row.storageLocation" clearable>
                  <el-option
                    v-for="item in placeList"
                    :value="item.dictValue"
                    :key="item.id"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="specificationAndModel" label="运单号/提单号" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input clearable v-model="scope.row.specificationAndModel"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="!disabled">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div>零件明细</div>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.propertyList"
          @selection-change="handleSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column prop="chooseStatus" type="index" width="50" label="序号"></el-table-column>
          <el-table-column property="assetCategories" label="零件类型" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'propertyList.' + scope.$index + '.assetCategories'"
                :rules="rules.assetCategories"
              >
                <el-select v-model="scope.row.assetCategories" clearable>
                  <el-option
                    v-for="item in categoriesList"
                    :value="item.dictValue"
                    :key="item.id"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetName" label="零件名称" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'propertyList.' + scope.$index + '.assetName'"
                :rules="rules.assetName"
              >
                <el-input clearable v-model="scope.row.assetName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="assetNumber" label="零件号" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input clearable v-model="scope.row.assetNumber"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="SN号" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'propertyList.' + scope.$index + '.storageLocation'"
                :rules="rules.storageLocation"
              >
                <el-select v-model="scope.row.storageLocation" clearable>
                  <el-option
                    v-for="item in placeList"
                    :value="item.dictValue"
                    :key="item.id"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="specificationAndModel" label="硬件版本" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input clearable v-model="scope.row.specificationAndModel"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="brand" label="系统软件版本" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input clearable v-model="scope.row.brand"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="brand" label="产线测试情况" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input clearable v-model="scope.row.brand"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="brand" label="运单号、提单号" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-input clearable v-model="scope.row.brand"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="!disabled">
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
import { getPlace, getPartCategories } from "../util";
export default {
  data() {
    return {
      categoriesList: [],
      placeList: [],
      form: {
        purchaseRequestId: "",
        purchaseRequestName: "",
        purchaseDate: "",
        storageTime: "",
        assetCategory: "公司零件",
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
          },
        ],
      },
      rules: {
        purchaseDate: [
          { required: true, message: "请选择采购日期", trigger: "blur" },
        ],
        storageTime: [
          { required: true, message: "请选择入库日期", trigger: "change" },
        ],

        assetCategories: [
          { required: true, message: "请选择零件大类", trigger: "change" },
        ],
        usageInstructions: [
          { required: true, message: "请输入领用说明", trigger: "blur" },
        ],
        assetName: [
          { required: true, message: "请输入零件名称", trigger: "blur" },
        ],
        assetNumber: [
          { required: true, message: "请输入零件简称", trigger: "blur" },
        ],
        assetLevel: [
          { required: true, message: "请选择零件级别", trigger: "blur" },
        ],
        specificationAndModel: [
          { required: true, message: "请输入规格型号", trigger: "blur" },
        ],
        brand: [{ required: true, message: "请输入品牌", trigger: "blur" }],
        unitPrice: [{ required: true, message: "请输入单价", trigger: "blur" }],
        quantity: [{ required: true, message: "请输入数量", trigger: "blur" }],
        money: [{ required: true, message: "请输入金额", trigger: "blur" }],
        serviceLife: [
          { required: true, message: "请输入使用年限", trigger: "blur" },
        ],
        relatedProjects: [
          { required: true, message: "请输入相关项目", trigger: "change" },
        ],
        assetDescription: [
          { required: true, message: "请选择零件说明", trigger: "change" },
        ],
        storageLocation: [
          { required: true, message: "请选择存放地点", trigger: "blur" },
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
  methods: {
    async init() {
      this.categoriesList = await getPartCategories();
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
}
</style>