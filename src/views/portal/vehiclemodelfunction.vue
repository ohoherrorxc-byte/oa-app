<template>
  <basic-container>
    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="FuncCodeNum：">
          <el-input
            v-model="query.funcCodeNum"
            @blur="query.funcCodeNum = $event.target.value.trim()"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Series Name：">
          <el-input
            v-model="query.description"
            @blur="query.description = $event.target.value.trim()"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Model Name：">
          <el-input
            v-model="query.modelName"
            @blur="query.modelName = $event.target.value.trim()"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="searchChange"
            size="mini"
            icon="el-icon-search"
            >Search</el-button
          >
          <!--          <el-button type="primary" style="margin-left: 330px"   icon="el-icon-circle-plus-outline" size="mini" @click="handleAdd">新增-->
          <!--          </el-button>-->
          <!--          <el-button type="danger"  style="margin-left: 10px" icon="el-icon-delete" size="mini" @click="handleMultiDelete">批量删除-->
          <!--          </el-button>-->
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
              @click="handleAdd"
              >Add
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-download"
              plain
              size="mini"
              @click="handleExport"
              >Export
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          border
          :data="data"
          @selection-change="selectChange"
          style="width: 100%"
        >
          <!--          <el-table-column-->
          <!--            prop="modelId"-->
          <!--            type="selection"-->
          <!--            width="55">-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            label="ID"-->
          <!--            type="index"-->
          <!--            :index="indexAdd"-->
          <!--            align="center"-->
          <!--            width="80">-->
          <!--          </el-table-column>-->
          <el-table-column prop="modelId" label="Model Number" align="center">
          </el-table-column>
          <el-table-column prop="modelName" align="center" label="Model Name">
          </el-table-column>
          <el-table-column
            prop="description"
            align="center"
            label="Series Name"
          >
          </el-table-column>
          <el-table-column
            prop="funcCodeNums"
            label="FuncCodeNum"
            align="center"
            width="280"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="Online & Offline"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-switch
                v-model.number="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="handleChangStatus(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="Operation"
            align="center"
            fixed="right"
            width="200px"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-view"
                class="el-button el-button--text el-button--mini"
                @click="handleView(scope.$index, scope.row)"
                >View
              </el-button>
              <el-button
                size="mini"
                icon="el-icon-edit"
                class="el-button el-button--text el-button--mini"
                @click="handleEdit(scope.$index, scope.row)"
                >Edit
              </el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                class="el-button el-button--text el-button--mini"
                @click="handleDelete(scope.$index, scope.row)"
                >Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          background
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="formVisible"
      :append-to-body="true"
      @open="initSelectObj"
      @close="resetForm('vModelFuncForm')"
      width="880px"
    >
      <el-form
        :model="vModelFunc"
        :rules="rules"
        ref="vModelFuncForm"
        size="mini"
        label-width="130px"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span
              ><i class="el-icon-s-order" style="font-size: 20px"
                >Model Series Info
              </i></span
            >
          </div>
          <el-form-item label="Model Number :" prop="modelId">
            <el-input
              v-model="vModelFunc.modelId"
              disabled
              placeholder="Select the model to automatically bring out"
            ></el-input>
          </el-form-item>
          <el-form-item label="Choose Model :" prop="modelName">
            <el-select
              v-model="vModelFunc.modelName"
              value-key="modelId"
              @change="onSelectvModel"
              filterable
              :disabled="viewMode"
              placeholder="please choose model"
              style="width: 100%"
            >
              <el-option
                v-for="item in selectObj.vmodelOptions"
                :key="item.modelName"
                :label="item.modelName"
                :value="item"
              >
                <span style="float: left">{{ item.modelName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.description
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Series Name:" prop="description">
            <el-input
              v-model="vModelFunc.description"
              disabled
              placeholder="Select the model to automatically bring out"
            ></el-input>
          </el-form-item>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span
              ><i class="el-icon-s-grid" style="font-size: 20px"
                >Model Function Info
              </i></span
            >
          </div>
          <el-row>
            <el-button
              v-if="!viewMode"
              @click="handleAddFunction"
              icon="el-icon-circle-plus-outline"
              style="float: right; padding: 3px 0"
              type="text"
              >Add Model Function</el-button
            >
            <el-table
              :data="vModelFunc.functionList"
              border
              stripe
              height="250"
            >
              <!--                <el-table-column-->
              <!--                  label="全选"-->
              <!--                  type="selection"-->
              <!--                  align="center"-->
              <!--                  width="55">-->
              <!--                </el-table-column>-->
              <el-table-column
                label="ID"
                type="index"
                align="center"
                width="80"
              >
              </el-table-column>
              <el-table-column
                v-if="false"
                label="Function Number"
                align="center"
              >
              </el-table-column>
              <el-table-column label="Function Name" align="center" width="450">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.functionName"
                    size="medium"
                    :disabled="viewMode"
                    value-key="id"
                    @change="onSelectvModelFunc(scope.row, $event)"
                    filterable
                    placeholder="please choose function"
                    class="item"
                  >
                    <el-option
                      v-for="(item, index) in selectObj.functionOptions"
                      :key="index"
                      :label="item.functionName"
                      :disabled="item.disabled"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="funCodeNum"
                label="FunCodeNum"
                align="center"
              >
              </el-table-column>
              <el-table-column
                v-if="!viewMode"
                align="center"
                label="Operation"
                width="120"
              >
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.row, scope.$index)"
                    type="text"
                  >
                    Remove
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!viewMode" @click="formVisible = false"
          >Cancel</el-button
        >
        <el-button
          v-if="!viewMode"
          @click="handleSubmit('vModelFuncForm')"
          type="primary"
          >Save</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
import {
  list,
  vModelSeriesList,
  vModelFuncSummary,
  getVModelFunListByModelId,
  submit,
  remove,
  removeByModelId,
  update,
  changeStatus,
} from "@/api/portal/vehiclemodelfunction";
import { getToken } from "@/util/auth";
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
        funcCodeNum: "",
        description: "",
        modelName: "",
      },
      loading: true,
      data: [],
      multiSelection: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      // 校验规则
      rules: {
        modelName: [
          {
            required: true,
            message: "please choose model ",
            trigger: ["blur"],
          },
        ],
      },
      // 表单映射模型
      vModelFunc: {
        modelId: "",
        modelName: "",
        description: "",
        functionList: [],
      },
      vehicleModelFunction: {
        id: "",
        modelId: "",
        functionId: "",
      },
      selectObj: {
        vmodelOptions: [
          {
            modelId: "",
            modelName: "",
            description: "",
          },
        ],
        functionOptions: [
          {
            id: "",
            functionName: "",
            funcCodeNum: "",
          },
        ],
      },
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
      list(
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
      this.onLoad(this.page, this.query);
    },
    selectChange(val) {
      this.multiSelection = val;
      this.onLoad(this.page, this.query);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },
    initSelectObj() {
      //获取车型车系列表
      vModelSeriesList().then((res) => {
        this.selectObj.vmodelOptions = res.data.data;
      });
      //获取功能列表
      vModelFuncSummary().then((res) => {
        this.selectObj.functionOptions = res.data.data;
        this.selectObj.functionOptions.map((vModelFun) => {
          vModelFun.disabled = false;
          return vModelFun;
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.vModelFunc = {};
    },
    handleAdd() {
      this.dialogTitle = "Add Model Function";
      this.formVisible = true;
      this.viewMode = false;
    },
    handleView(index, row) {
      this.dialogTitle = "View Model Function";
      this.formVisible = true;
      this.viewMode = true;
      getVModelFunListByModelId(row.modelId).then((res) => {
        this.vModelFunc = res.data.data;
      });
    },
    handleEdit(index, row) {
      this.dialogTitle = "Edit Model Function";
      this.formVisible = true;
      this.viewMode = false;

      vModelFuncSummary().then((res) => {
        this.selectObj.functionOptions = res.data.data;

        getVModelFunListByModelId(row.modelId).then((res) => {
          this.vModelFunc = res.data.data;

          if (res.data.data.functionList !== undefined) {
            res.data.data.functionList.map((functionInfo) => {
              //更新功能列表集合中回显选中的option的状态为禁用
              const rowFunctionId = functionInfo.id;
              if (rowFunctionId !== "" && rowFunctionId !== undefined) {
                const funOptsIndex =
                  this.searchObjIdInFunOptions(rowFunctionId);
                if (funOptsIndex > -1) {
                  this.selectObj.functionOptions[funOptsIndex].disabled = true;
                }
              }
              return functionInfo;
            });
          }
        });
      });
    },
    handleDelete(index, row) {
      this.$confirm("Are you sure you'll choose data deletion?", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        removeByModelId(row.modelId).then((res) => {
          if (res.data.success) {
            this.onLoad(this.page, this.query);
            this.$message({
              type: "success",
              message: "The operation succeeded！",
            });
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        });
      });
    },
    handleChangStatus(row) {
      const tip = row.status === 1 ? "online" : "offline";
      this.$confirm(
        "Are you sure that the corresponding function of this model will be " +
          tip +
          "?",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          changeStatus(row.modelId, row.status).then((res) => {
            if (res.data.success) {
              this.$message({ type: "success", message: tip + " success！" });
              this.onLoad(this.page, this.query);
            } else {
              this.$message({ type: "error", message: res.data.msg });
            }
          });
        })
        .catch(() => {
          this.onLoad(this.page, this.query);
        });
    },
    handleMultiDelete() {},
    handleExport() {
      this.$confirm("Do you want to export Model Function ?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        let funcCodeNum =
          this.query.funcCodeNum === undefined ? "" : this.query.funcCodeNum;
        let description =
          this.query.description === undefined ? "" : this.query.description;
        let modelName =
          this.query.modelName === undefined ? "" : this.query.modelName;

        window.open(
          `/api/oa-portal/vehicle/service/model/function/export-vModelFunc?${
            this.website.tokenHeader
          }=${getToken()}&funcCodeNum=${funcCodeNum}&description=${description}&modelName=${modelName}`
        );
      });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //提交
          this.vModelFunc.functionList = this.vModelFunc.functionList.filter(
            (func) => func.id !== ""
          );
          if (
            this.vModelFunc.functionList === undefined ||
            this.vModelFunc.functionList.length < 1
          ) {
            this.$message({
              type: "warning",
              message: "Please select at least one model function!",
            });
            return;
          }
          submit(this.vModelFunc).then((res) => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "Submission successful!",
              });

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
    onSelectvModel(item) {
      //回显车型编号、车型车系
      this.vModelFunc.modelId = item.modelId;
      this.vModelFunc.modelName = item.modelName;
      this.vModelFunc.description = item.description;

      //change变更回显功能前,先将之前的可选功能列表禁用状态清除
      this.selectObj.functionOptions.forEach((item) => {
        item.disabled = false;
      });

      //回显车型功能列表
      this.vModelFunc.functionList = [];
      getVModelFunListByModelId(item.modelId).then((res) => {
        if (res.data.data.functionList !== undefined) {
          this.vModelFunc.functionList = res.data.data.functionList;
          this.$forceUpdate();

          res.data.data.functionList.map((functionInfo) => {
            //更新功能列表集合中回显选中的option的状态为禁用
            const rowFunctionId = functionInfo.id;
            if (rowFunctionId !== "" && rowFunctionId !== undefined) {
              const funOptsIndex = this.searchObjIdInFunOptions(rowFunctionId);
              if (funOptsIndex > -1) {
                this.selectObj.functionOptions[funOptsIndex].disabled = true;
              }
            }
            return functionInfo;
          });
        }
      });
    },
    onSelectvModelFunc(row, item) {
      if (row.primaryKey !== "" && row.primaryKey !== undefined) {
        this.$confirm(
          "Changing the options will be  removes the function , Whether to continue?",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            let vehicleModelFunction = {
              id: row.primaryKey,
              functionId: item.id,
              modelId: this.vModelFunc.modelId,
            };
            update(vehicleModelFunction).then((res) => {
              if (res.data.success) {
                this.changeFunctionRowAndOption(row, item);
              }
            });
          })
          .catch(() => {
            row.functionName = row.functionCode;
          });
      } else {
        this.changeFunctionRowAndOption(row, item);
      }
    },
    changeFunctionRowAndOption(row, item) {
      //更新功能列表集合中之前选中的option的状态为可选
      if (row.id !== "" && row.id !== undefined) {
        const index = this.searchObjIdInFunOptions(row.id);
        if (index >= -1) {
          this.selectObj.functionOptions[index].disabled = false;
        }
      }

      //更新功能列表集合中该选中option的状态为禁用
      item.disabled = true;
      //更新该行中数据
      row.id = item.id;
      row.functionName = item.functionName;
      row.funCodeNum = item.funCodeNum;
    },
    handleAddFunction() {
      if (
        this.vModelFunc.modelId === "" ||
        this.vModelFunc.modelId === undefined
      ) {
        this.$message({
          type: "warning",
          message: "Please select the model first!",
        });
        return;
      }
      let functionObj = {
        id: "",
        functionName: "",
        funCodeNum: "",
        primaryKey: "", //中间表主键
      };
      this.vModelFunc.functionList.push(functionObj);
    },
    deleteRow(row, index) {
      if (row.primaryKey !== "" && row.primaryKey !== undefined) {
        this.$confirm("Are you sure you'll select Data Removal?", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }).then(() => {
          remove(row.primaryKey);
          this.removeFunctionItemAndOptions(index);
        });
      } else {
        this.removeFunctionItemAndOptions(index);
      }
    },
    removeFunctionItemAndOptions(index) {
      //更新功能列表集合中之前选中的option的状态为可选
      const rowFunctionId = this.vModelFunc.functionList[index].id;
      if (rowFunctionId !== "" && rowFunctionId !== undefined) {
        const funOptsIndex = this.searchObjIdInFunOptions(rowFunctionId);
        if (funOptsIndex > -1) {
          this.selectObj.functionOptions[funOptsIndex].disabled = false;
        }
      }
      this.vModelFunc.functionList.splice(index, 1);
    },
    searchObjIdInFunOptions(functionId) {
      let index = -1;
      for (let i = 0; i <= this.selectObj.functionOptions.length - 1; i++) {
        let funcObj = this.selectObj.functionOptions[i];
        if (funcObj.id === functionId) {
          index = i;
          break;
        }
      }
      return index;
    },
    // indexAdd(index) {
    //   const currentPage = this.page.currentPage
    //   const pageSize = this.page.pageSize
    //   return index + 1 + (currentPage - 1) * pageSize
    // }
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
