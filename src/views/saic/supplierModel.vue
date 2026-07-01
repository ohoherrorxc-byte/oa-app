<template>
  <basic-container>
    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="供应商类型：">
          <el-select
            v-model="query.supplierType"
            placeholder="全部"
            style="width: 90%"
            clearable
          >
            <el-option
              v-for="item in supplierTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商名称：">
          <el-input
            v-model.trim="query.supplierName"
            style="width: 90%"
            clearable
          />
        </el-form-item>

        <el-form-item label="国家地区：">
          <el-select
            v-model="query.countryReginCode"
            @change="changeValueRegionCode($event)"
            placeholder="请选择"
            style="width: 90%"
            clearable
          >
            <el-option
              v-for="item in countryCodes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车系车型：">
          <template>
            <series-model
              v-model="query.seriesModel"
              :region="regionCode"
            ></series-model>
          </template>
        </el-form-item>

        <el-form-item label="网联车类型：">
          <el-select
            v-model="query.modelType"
            placeholder="全部"
            style="width: 90%"
            clearable
          >
            <el-option
              v-for="item in models"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-on:click="searchChange"
            size="mini"
            icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              v-on:click="handleAdd"
              >新增
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              v-on:click="handleEdit"
              >修改
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              v-on:click="handleDelete"
              >删除
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- table 列表 -->
      <el-row>
        <el-table
          border
          :data="data"
          @selection-change="selectChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <!--          <el-table-column prop="id" label="ID" align="center" width="80">-->
          <!--          </el-table-column>-->
          <el-table-column
            prop="supplierType"
            align="center"
            label="供应商类型"
            v-bind:formatter="dateFormatType"
          >
          </el-table-column>
          <el-table-column prop="supplierName" align="center" label="供应商">
          </el-table-column>
          <el-table-column
            prop="countryReginCode"
            align="center"
            label="国家地区"
            v-bind:formatter="dateFormatTypeForcountryReginCode"
          >
          </el-table-column>
          <el-table-column prop="seriesName" align="center" label="车系">
          </el-table-column>
          <el-table-column prop="modelName" align="center" label="车型">
          </el-table-column>
          <el-table-column
            prop="modelType"
            align="center"
            label="网联车类型"
            v-bind:formatter="dateFormatTypeForModelType"
          >
          </el-table-column>
          <el-table-column
            prop="price"
            align="center"
            label="单价"
            v-bind:formatter="dateFormatPrice"
          >
          </el-table-column>
          <el-table-column
            prop="validPeriodEnd"
            align="center"
            width="180"
            label="单价有效期"
            v-bind:formatter="dateFormatTypeForValidPeriod"
          >
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 分页 -->
      <el-row>
        <el-pagination
          background
          :key="page.elementuiKey"
          :current-page.sync="page.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="page.total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="formVisible"
      :append-to-body="true"
      @open="initSelectObj"
      @close="resetForm('vModelMaintenanceForm')"
      width="700px"
    >
      <el-form
        :model="supplierModelMainten"
        :rules="rules"
        ref="vModelMaintenanceForm"
        size="mini"
        label-width="130px"
      >
        <el-input v-model="supplierModelMainten.id" v-show="false"></el-input>
        <el-card>
          <el-form-item
            label="供应商类型:"
            prop="supplierType"
            :rules="[
              {
                required: true,
                message: '供应商类型不能为空.',
                trigger: 'blur',
              },
            ]"
          >
            <el-select
              v-model="supplierModelMainten.supplierType"
              @change="changeValue($event)"
              v-bind:disabled="editable"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in supplierTypeOptionsForDialog"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商名称:" prop="supplierId">
            <el-select
              v-model="supplierModelMainten.supplierId"
              placeholder="请选择"
              v-bind:disabled="editable"
              style="width: 100%"
            >
              <el-option
                v-for="item in supplierNames"
                :key="item.value"
                :label="item.supplierName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="国家地区:"
            prop="countryReginCode"
            :rules="[
              { required: true, message: '国家地区不能为空.', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="supplierModelMainten.countryReginCode"
              @change="changeDialogRegionCode($event)"
              placeholder="请选择"
              v-bind:disabled="editable"
              style="width: 100%"
            >
              <el-option
                v-for="item in countryCodesForDialog"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!--  prop="seriesModelDialog" :rules="[{required: true, message: '车系车型不能为空.', trigger: 'blur'}]"-->
          <template v-if="isShow">
            <el-form-item label="车系车型：" prop="seriesModelDialog.data">
              <series-model
                v-model="supplierModelMainten.seriesModelDialog"
                :region="dialogRegionCode"
                :empty="true"
              ></series-model>
            </el-form-item>
          </template>

          <template v-if="!isShow">
            <el-form-item
              label="车系车型："
              prop="modelNames"
              :rules="[
                {
                  required: true,
                  message: '车系车型不能为空.',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                v-model="supplierModelMainten.modelNames"
                v-bind:disabled="editable"
              />
            </el-form-item>
          </template>
          <el-form-item
            label="单价:"
            prop="price"
            :rules="[
              { required: true, message: '价格不能为空.', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="supplierModelMainten.price"
              label-position="left"
              label-width="10px"
              maxlength="11"
              @input="formatPrice($event, index)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="币种:"
            prop="currency"
            :rules="[
              { required: true, message: '币种不能为空.', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="supplierModelMainten.currency"
              placeholder="币种"
              label-position="left"
              label-width="10px"
            >
              <el-option
                v-for="item in currencys"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="有效期:"
            prop="validPeriodBegin"
            :rules="[
              { required: true, message: '有效期不能为空.', trigger: 'blur' },
            ]"
          >
            <el-date-picker
              v-model="supplierModelMainten.validPeriodBegin"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!viewMode" @click="formVisible = false"
          >取消</el-button
        >
        <el-button
          v-if="!viewMode"
          @click="handleSubmit('vModelMaintenanceForm')"
          type="primary"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  add,
  remove,
  getSupplier,
} from "@/api/saic/supplierModelMaintenance.js";
import { mapGetters } from "vuex";
import SeriesModel from "@/views/saic/series-model";
import constData from "@/config/constData";

export default {
  components: { SeriesModel },
  data() {
    return {
      // 是否显示
      formVisible: false,
      // 是否查看
      viewMode: false,
      //是否编辑
      editable: false,
      // dialog标题
      dialogTitle: "",
      // 列表查询数据
      query: {
        supplierType: "",
        supplierName: "",
        countryReginCode: "",
        modelType: "",
        seriesModel: { model: "" },
        modelNames: "",
      },
      loading: true,
      //table中数据
      data: [],
      multiSelection: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        elementuiKey: 0,
      },
      // 校验规则
      rules: {
        supplierId: [
          { required: true, message: "供应商名称不能为空.", trigger: "blur" },
        ],
        "seriesModelDialog.data": [
          // {required: true ,validator: validatorData, trigger: "blur" }
          { required: true, message: "车型车系不能为空.", trigger: "blur" },
        ],
      },

      // 表单映射模型
      supplierModelMainten: {
        id: "",
        supplierType: "",
        supplierId: "",
        countryReginCode: "",
        price: "",
        currency: "",
        validPeriodBegin: "",
        seriesModelDialog: {},
        // seriesModelDialog: { model: '' },
        // seriesModel: { },
        modelNames: "",
      },
      supplierNames: [],
      supplierTypeOptionsForDialog: [
        { name: "天气", value: 1 },
        { name: "语音", value: 2 },
        { name: "地图", value: 3 },
      ],
      supplierTypeOptions: [
        { name: "全部", value: "" },
        { name: "天气", value: "1" },
        { name: "语音", value: "2" },
        { name: "地图", value: "3" },
      ],
      currencys: [
        { name: "RMB", value: "0" },
        { name: "USD", value: "1" },
      ],
      countryCodes: [
        // { name: '全部',  value: ''  },
        // {name: '欧盟', value: '3G02'}, {  name: '英国',  value: '3F02' },
        // { name: '泰国',  value: '3G05' },{name: '印度', value: '3G07'}, {  name: '印尼',  value: '3G16' },
        // { name: '澳洲设计标准',  value: '3G08' }
      ],
      countryCodesForDialog: [
        // {name: '欧盟', value: '3G02'}, {  name: '英国',  value: '3F02' },
        // { name: '泰国',  value: '3G05' },{name: '印度', value: '3G07'}, {  name: '印尼',  value: '3G16' },
        // { name: '澳洲设计标准',  value: '3G08' }
      ],
      models: [
        { name: "全部", value: "" },
        { name: "网联", value: 0 },
        { name: "Color Radio Lite", value: 1 },
        { name: "Color Radio", value: 2 },
      ],
      editRowObj: {},
      regionCode: "",
      dialogRegionCode: "",
      checkValidEditOrDel: false,
      isShow: true,
      // ,modelNames: []
    };
    // let validatorData =(rule, value, callback) => {
    //   if (this.supplierModelMainten.seriesModelDialog.data == null ||
    //         this.supplierModelMainten.seriesModelDialog.data === '') {
    //         callback(new Error("请选择车系车型"));
    //     } else {
    //         callback();
    //     }
    // }
  },
  created() {
    this.countryCodesForDialog = constData.countryList;
    this.countryCodes = constData.countryList;
    this.onLoad(this.page, this.query);
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    ids() {
      let ids = [];
      this.multiSelection.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;
      });
      this.loading = false;
    },
    searchChange() {
      debugger;
      this.modelNames = [];
      if (this.query.seriesModel.data) {
        let da = this.query.seriesModel.data;
        for (let i = 0; i < da.length; i++) {
          this.seriesMod = {
            model: "",
            series: "",
          };
          let t = [];
          for (let j = 0; j < da[i].model.length; j++) {
            t.push(da[i].model[j]);
          }
          this.seriesMod.series = da[i].series;
          this.seriesMod.model = t.join(",");
          this.modelNames.push(this.seriesMod);
        }
        const tempDatas = JSON.stringify(this.modelNames);
        this.query.modelNames = tempDatas;
      }
      this.page.currentPage = 1;
      this.page.elementuiKey = 1;
      this.onLoad(this.page, this.query);
    },
    dateFormatTypeForcountryReginCode(row, column) {
      const daterc = row[column.property];
      // if (daterc == '3G02') {
      //     return "欧盟";
      // } else if (daterc == '3F02') {
      //     return "英国";
      // } else if (daterc == '3G05') {
      //     return "泰国";
      // } else if (daterc == '3G07') {
      //     return "印度";
      // } else if (daterc == '3G16') {
      //     return "印尼";
      // } else if (daterc == '3G08') {
      //     return "澳洲设计标准";
      // }
      for (let i = 0; i < this.countryCodes.length; i++) {
        if (daterc == this.countryCodes[i].value) {
          return this.countryCodes[i].label;
        }
      }
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    selectChange(val) {
      // debugger
      this.editRowObj = {};
      this.editRowObj = val;
      this.multiSelection = val;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },
    dateFormatType(row, column) {
      const daterc = row[column.property];
      return this.findTypeName(daterc);
    },
    findTypeName(daterc) {
      if (daterc) {
        if (daterc == 1) {
          return "天气";
        } else if (daterc == 2) {
          return "语音";
        } else if (daterc == 3) {
          return "地图";
        }
      }
    },
    dateFormatTypeForModelType(row, column) {
      const daterc = row[column.property];
      if (daterc == 0) {
        return "网联";
      } else if (daterc == 1) {
        return "Color Radio Lite";
      } else if (daterc == 2) {
        return "Color Radio";
      }
    },
    dateFormatPrice(row, column) {
      const daterc = row[column.property];
      const currencyTyep = row.currency;
      if (currencyTyep == 0) {
        return "￥ " + Number(daterc).toFixed(2);
      } else if (currencyTyep == 1) {
        return "$ " + Number(daterc).toFixed(2);
      }
    },
    // 价格输入框校验
    formatPrice(val, index) {
      val = val.replace(/。/g, ".");
      val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      val = val.replace(/^\./g, ""); //验证第一个字符是数字
      val = val.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
      val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      if (val.indexOf(".") < 0 && val !== "") {
        if (val.length > 8) {
          val = val.substr(0, 8);
        }
      }
      this.supplierModelMainten.price = val;
    },
    dateFormatTypeForValidPeriod(row, column) {
      const begin = row.validPeriodBegin.substring(
        0,
        row.validPeriodBegin.lastIndexOf("-") + 3
      );
      const end = row.validPeriodEnd.substring(
        0,
        row.validPeriodEnd.lastIndexOf("-") + 3
      );
      return `${begin} \~ ${end}`;
    },
    initSelectObj() {},
    resetForm(formName) {
      debugger;
      this.$refs[formName].clearValidate();
      // this.supplierModelMainten.seriesModelDialog= { model: '' };
      // this.supplierModelMainten.seriesModelDialog = null;
      // this.supplierModelMainten = {};
      this.supplierModelMainten.id = "";
      this.supplierModelMainten.supplierType = "";
      this.supplierModelMainten.supplierId = "";
      this.supplierModelMainten.countryReginCode = "";
      this.supplierModelMainten.price = "";
      this.supplierModelMainten.currency = "";
      this.supplierModelMainten.validPeriodBegin = "";
      this.isShow = true;
    },
    handleAdd() {
      debugger;
      this.dialogTitle = "新增供应商车型关系";
      this.formVisible = true;
      this.editable = false;
      this.supplierNames = [];
      this.supplierModelMainten.seriesModelDialog = {};
      // this.supplierTypeOptionsForDialog=[];
      // this.supplierTypeOptionsForDialog = this.supplierTypeOptions;
      this.isShow = true;
      // this.supplierModelMainten.seriesModelDialog = { };
      // this.supplierModelMainten.seriesModelDialog = { model: ''}
    },
    changeValue(obj) {
      this.supplierModelMainten.supplierId = "";
      this.supplierNames = [];
      // debugger
      getSupplier(obj).then((res) => {
        let obj = res.data.data;
        for (let j = 0; j < obj.length; j++) {
          this.supplierNames.push(obj[j]);
        }
      });
    },
    changeValueRegionCode(value) {
      // debugger
      this.regionCode = value;
    },
    changeDialogRegionCode(value) {
      // debugger
      this.dialogRegionCode = value;
    },
    checkValid() {
      // debugger
      this.checkValidEditOrDel = false;
      let currentTime = new Date();
      this.multiSelection.forEach((ele) => {
        if (ele.validPeriodEnd && new Date(ele.validPeriodEnd) <= currentTime) {
          this.checkValidEditOrDel = true;
          return;
        }
        if (new Date(ele.validPeriodBegin) <= currentTime) {
          this.checkValidEditOrDel = true;
          return;
        }
      });
    },
    handleEdit() {
      let tempLength = this.ids.split(",").length;
      if (tempLength > 1) {
        this.$message({ type: "warning", message: "只能选择一行记录编辑!" });
        return;
      } else if (tempLength == 0 || this.ids === "") {
        this.$message({ type: "warning", message: "选择一行记录编辑!" });
        return;
      }
      this.checkValid();
      if (this.checkValidEditOrDel) {
        this.$message({ type: "warning", message: "已经在使用的不能编辑!" });
        return;
      }
      this.dialogTitle = "编辑供应商车型关系";
      this.formVisible = true;
      this.viewMode = false;
      this.editable = true;
      this.isShow = false;
      debugger;
      // this.supplierModelMainten = this.editRowObj[0];
      this.supplierModelMainten.id = this.editRowObj[0].id;
      this.supplierModelMainten.supplierType = this.editRowObj[0].supplierType;
      this.supplierModelMainten.supplierId = this.editRowObj[0].supplierId;
      this.supplierModelMainten.countryReginCode =
        this.editRowObj[0].countryReginCode;
      this.supplierModelMainten.price = this.editRowObj[0].price;
      this.supplierModelMainten.currency = this.editRowObj[0].currency;
      this.supplierModelMainten.validPeriodBegin =
        this.editRowObj[0].validPeriodBegin;
      this.supplierModelMainten.modelNames = this.editRowObj[0].modelName;
      // this.supplierModelMainten.seriesModelDialog=this.editRowObj[0].modelName;
      let obj = {
        id: this.supplierModelMainten.supplierId,
        supplierName: this.editRowObj[0].supplierName,
      };
      this.supplierNames.push(obj);
      // let name = this.findTypeName(this.supplierModelMainten.supplierType);
      // let arr = {
      //     name: name,
      //     value: this.supplierModelMainten.supplierType
      // }
      // this.supplierTypeOptionsForDialog=[];
      // this.supplierTypeOptionsForDialog.push(arr);
    },
    handleDelete() {
      if (this.ids.length <= 0) {
        this.$message({ type: "warning", message: "选择一行记录编辑!" });
        return;
      }
      this.checkValid();
      if (this.checkValidEditOrDel) {
        this.$message({
          type: "warning",
          message: "已经在使用的不能编辑删除!",
        });
        return;
      }
      this.$confirm("是否删除已选记录?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        remove(this.ids).then((res) => {
          if (res.data.success) {
            this.$message({ type: "success", message: "删除成功！" });
            this.page.currentPage = 1;
            this.onLoad(this.page, this.query);
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        });
      });
    },
    //
    handleSubmit(formName) {
      debugger;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.editable) {
            if (
              this.supplierModelMainten.seriesModelDialog.data === undefined ||
              this.supplierModelMainten.seriesModelDialog.data === ""
            ) {
              this.$message({ type: "warning", message: "选择车型车系！" });
              return;
            }
            this.modelNames = [];
            let da = this.supplierModelMainten.seriesModelDialog.data;
            for (let i = 0; i < da.length; i++) {
              this.seriesMod = {
                model: "",
                series: "",
              };
              let t = [];
              for (let j = 0; j < da[i].model.length; j++) {
                t.push(da[i].model[j]);
              }
              this.seriesMod.series = da[i].series;
              this.seriesMod.model = t.join(",");
              this.modelNames.push(this.seriesMod);
            }
            const tempDatas = JSON.stringify(this.modelNames);
            this.supplierModelMainten.modelNames = tempDatas;
            if (!this.supplierModelMainten.modelNames) {
              this.$message({
                type: "warning",
                message: "车型车系必须选择其中一项.",
              });
              return;
            }
          }
          //提交
          add(this.supplierModelMainten).then((res) => {
            if (res.data.success) {
              this.$message({ type: "success", message: "提交成功!" });
              this.formVisible = false;
              this.resetForm("vModelMaintenanceForm");
              this.editable = false;
              this.isShow = true;
              this.supplierModelMainten.seriesModelDialog = {};
              this.onLoad(this.page, this.query);
            } else {
              this.$message({ type: "error", message: res.data.msg });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-pagination {
  position: relative;
  text-align: right;
  padding: 25px 0 20px 20px;
}

.el-form .el-select {
  width: 100%;
}
</style>
