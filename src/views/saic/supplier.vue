<template>
  <basic-container>
    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="供应商类型：">
          <el-select
            v-model="query.supplierType"
            placeholder="请选择"
            style="width: 90%"
          >
            <el-option
              v-for="item in supplierTypeSearch"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商名称：">
          <el-input
            v-model="query.supplierName"
            @blur="query.supplierName = $event.target.value.trim()"
            size="mini"
            clearable
          />
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
          <el-table-column type="selection" width="55"> </el-table-column>
          <!--          <el-table-column label="ID" type="index" :index="indexAdd" align="center" width="80">-->
          <!--          <el-table-column prop="id"  label="ID"  align="center" width="80">-->
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
      @close="resetForm('vModelFuncForm')"
      width="880px"
    >
      <el-form
        :model="licenseSupplier"
        :rules="rules"
        ref="vModelFuncForm"
        size="mini"
        label-width="130px"
      >
        <el-input v-model="licenseSupplier.id" v-show="false"></el-input>
        <el-card>
          <el-form-item
            label="供应商类型 :"
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
              v-model="licenseSupplier.supplierType"
              placeholder="请选择"
              style="width: 100%"
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

          <el-form-item
            label="供应商名称:"
            prop="supplierName"
            :rules="[
              {
                required: true,
                message: '供应商名称不能为空.',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model.trim="licenseSupplier.supplierName"
              maxlength="100"
            ></el-input>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!viewMode" @click="formVisible = false"
          >取消</el-button
        >
        <el-button
          v-if="!viewMode"
          @click="handleSubmit('vModelFuncForm')"
          type="primary"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from "@/api/saic/supplier";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // 是否显示
      formVisible: false,
      // 是否查看
      viewMode: false,
      // dialog标题
      dialogTitle: "",
      // 列表数据
      query: {
        supplierType: "",
        supplierName: "",
      },
      loading: true,
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
        supplierName: [
          { required: true, message: "供应商不能为空 ", trigger: ["blur"] },
        ],
        supplierType: [
          { required: true, message: "供应商类型不能为空 ", trigger: ["blur"] },
        ],
      },
      // 表单映射模型
      licenseSupplier: {
        id: "",
        supplierType: "",
        supplierName: "",
      },
      supplierTypeSearch: [
        {
          name: "全部",
          value: "",
        },
        {
          name: "天气",
          value: "1",
        },
        { name: "语音", value: "2" },
        { name: "地图导航", value: "3" },
        { name: "地图图资", value: "4" },
      ],
      supplierTypeOptions: [
        {
          name: "天气",
          value: "1",
        },
        {
          name: "语音",
          value: "2",
        },
        { name: "地图导航", value: "3" },
        { name: "地图图资", value: "4" },
      ],
    };
  },
  created() {
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
      this.page.currentPage = 1;
      this.page.elementuiKey = 1;
      this.onLoad(this.page, this.query);
    },

    selectChange(val) {
      this.multiSelection = val;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },
    dateFormatType(row, column) {
      const daterc = row[column.property];
      if (daterc) {
        if (daterc == 1) {
          return "天气";
        } else if (daterc == 2) {
          return "语音";
        } else if (daterc == 3) {
          return "地图导航";
        } else if (daterc == 4) {
          return "地图图资";
        }
      }
    },
    initSelectObj() {
      //获取车型车系列表
      // vModelSeriesList().then(res =>{
      //     this.selectObj.vmodelOptions = res.data.data;
      // });
      // //获取功能列表
      // vModelFuncSummary().then(res =>{
      //     this.selectObj.functionOptions=res.data.data;
      //     this.selectObj.functionOptions.map(vModelFun =>{
      //         vModelFun.disabled=false;
      //         return vModelFun;
      //     });
      // })
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.licenseSupplier = {};
    },
    handleAdd() {
      this.dialogTitle = "新增供应商";
      this.formVisible = true;
      // this.viewMode =false;
    },

    handleEdit() {
      debugger;
      let tempLength = this.ids.split(",").length;
      if (tempLength > 1) {
        this.$message({ type: "warning", message: "只能选择一行记录编辑!" });
        return;
      } else if (tempLength == 0 || this.ids === "") {
        this.$message({ type: "warning", message: "选择一行记录编辑!" });
        return;
      }
      this.dialogTitle = "编辑";
      this.formVisible = true;
      this.viewMode = false;
      getDetail(this.ids).then((res) => {
        this.licenseSupplier = {
          id: res.data.data.id,
          supplierName: res.data.data.supplierName,
          supplierType: res.data.data.supplierType.toString(),
        };
        // this.licenseSupplier=res.data.data;
      });
    },

    handleDelete() {
      if (this.ids.length <= 0) {
        this.$message({ type: "warning", message: "选择一行记录编辑!" });
        return;
      }
      this.$confirm("是否确定删除选中记录?", {
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

    handleSubmit(formName) {
      // debugger
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //提交
          if (
            this.licenseSupplier.supplierType === undefined ||
            this.licenseSupplier.supplierType === ""
          ) {
            this.$message({ type: "warning", message: "供应商类型不能为空!" });
            return;
          }
          if (
            this.licenseSupplier.supplierName === undefined ||
            this.licenseSupplier.supplierName === ""
          ) {
            this.$message({ type: "warning", message: "供应商不能为空!" });
            return;
          }
          add(this.licenseSupplier).then((res) => {
            if (res.data.success) {
              this.$message({ type: "success", message: "提交成功!" });
              this.formVisible = false;
              this.resetForm("vModelFuncForm");
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
