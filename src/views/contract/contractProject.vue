<template>
  <basic-container>
    <SearchForm :searchForm="searchForm" @handleSubmit="getContractProjectList" @refresh="refresh">
      <template #menuForm>
        <el-button icon="el-icon-plus" size="mini" type="primary" style="margin-left: 10px"
          @click="handleOpenDialog('', 'create')">{{ $t('commonContent.add') }}</el-button>
        <el-upload class="i-block ml10" action="#" :before-upload="beforeUpload" :limit="1">
          <el-button icon="el-icon-plus" size="mini" type="primary">{{ $t('commonContent.import') }}</el-button>
        </el-upload>
        <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDeleteData('', 'littleDelete')"
          style="margin-left: 10px" plain>{{ $t('commonContent.delete') }}</el-button>
      </template>
    </SearchForm>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px" stripe align="center" border
      @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" />
      <el-table-column prop="projectName" :label="$t('contractProject.projectName')" align="center" show-overflow-tooltip
        width="200" />
      <el-table-column prop="projectNo" :label="$t('contractProject.projectNo')" align="center" show-overflow-tooltip
        width="150" />
      <el-table-column prop="projectType" :label="$t('contractProject.projectType')" align="center" width="100"
        :formatter="projectTypeFormatter" />
      <el-table-column prop="sorpDate" :label="$t('contractProject.sorpDate')" align="center" show-overflow-tooltip
        width="150" />
      <el-table-column prop="projectManageName" :label="$t('contractProject.projectManageName')" align="center" />
      <el-table-column prop="status" :label="$t('contractProject.status')" align="center" :formatter="statusFormatter" />
      <el-table-column prop="code" :label="$t('commonContent.code')" align="center" show-overflow-tooltip width="150" />
      <el-table-column fixed="right" :label="$t('commonContent.operation')" width="170" align="center">
        <template slot-scope="scope">
          <el-button @click="handleOpenDialog(scope.row, 'detail')" type="text" icon="el-icon-view">{{
            $t('commonContent.view') }}</el-button>
          <el-button @click="handleOpenDialog(scope.row, 'edit')" type="text" icon="el-icon-edit">{{
            $t('commonContent.edit') }}</el-button>
          <el-button @click="handleDeleteData(scope.row, 'delete')" type="text" icon="el-icon-delete">{{
            $t('commonContent.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
      :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.total"></el-pagination>
    <el-dialog :visible.sync="projectDialogFormVisible" append-to-body @close="editDialogClose">
      <template slot="title">
        <div style="font-size: 15px">{{ dialogTitle }}</div>
      </template>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" class="demo-ruleForm">
        <el-row>
          <el-form-item prop="projectName">
            <label slot="label">{{ $t('contractProject.projectName') }}:</label>
            <br />
            <el-input v-model="editForm.projectName" autocomplete="off" :placeholder="isShowDetail ? '' : '项目名称'"
              style="width: 90%" :disabled="isShowDetail"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="projectNo">
            <label slot="label">{{ $t('contractProject.projectNo') }}:</label>
            <br />
            <el-input v-model="editForm.projectNo" autocomplete="off" :placeholder="isShowDetail ? '' : '项目编号'"
              style="width: 90%" :disabled="isShowDetail"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="projectManage">
            <label slot="label">{{ $t('contractProject.projectType') }}:</label>
            <br />
            <el-select v-model="editForm.projectType" :placeholder="isShowDetail ? '' : '项目类型'" style="width: 90%"
              :disabled="isShowDetail" clearable>
              <el-option v-for="item in OptionsList" :key="item.label" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="sorpDate">
            <label slot="label">{{ $t('contractProject.sorpDate') }}:</label>
            <br />
            <el-date-picker v-model="editForm.sorpDate" :placeholder="isShowDetail ? '' : 'SORP时间'" style="width: 90%"
              type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="isShowDetail"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="projectManage">
            <label slot="label">{{ $t('contractProject.projectManage') }}:</label>
            <br />
            <el-select v-model="editForm.projectManageId" :placeholder="isShowDetail ? '' : '项目经理'"
              :disabled="isShowDetail" style="width: 90%" filterable @change="getProjectRow">
              <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="status">
            <label slot="label">{{ $t('commonContent.status') }}:</label>
            <br />
            <el-select v-model="editForm.status" :placeholder="isShowDetail ? '' : '项目状态'" style="width: 90%"
              :disabled="isShowDetail" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="status">
            <label slot="label">{{ $t('commonContent.code') }}:</label>
            <br />
            <el-input v-model="editForm.code" autocomplete="off" :placeholder="isShowDetail ? '' : 'Code'"
              style="width: 90%" :disabled="isShowDetail"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer v-if="!isShowDetail">
        <span class="dialog-footer">
          <el-button @click="projectDialogFormVisible = false" size="mini" icon="el-icon-circle-close">{{
            $t('commonContent.cancel') }}</el-button>
          <el-button type="primary" @click="addCustomer" size="mini" icon="el-icon-circle-check">{{
            $t('commonContent.save') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  importExcel,
  delProject,
  saveOrUpdateProject,
} from "@/api/contract/contractProject";
import constData from "@/config/constData";
import { userList } from "@/api/contract/bomMaint";
export default {
  data() {
    return {
      searchForm: {
        column: [
          {
            label: this.$t('contractProject.projectName'),
            prop: "projectName",
          },
          "projectType",
          {
            label: this.$t('commonContent.status'),
            prop: "status",
            type: "select",
            dicData: constData.projectStatus,
          },
        ],
      },
      tableData: [],
      userList: [],
      tenantId: 629965,
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      projectDialogFormVisible: false,
      dialogTitle: "",
      isShowDetail: false,
      editForm: {
        id: "",
        projectName: "",
        projectNo: "",
        projectType: "",
        sorpDate: "",
        projectManageId: '',
        projectManage: "",
        status: "",
        code: "",
      },
      selectItems: [],
      OptionsList: constData.projectType,
      statusList: [{
        value: 1,
        label: '进行中'
      }, {
        value: 2,
        label: '已结项'
      }],
    };
  },
  methods: {
    refresh(params) {
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 10;
      this.getContractProjectList(params);
    },
    getContractProjectList(params) {
      getList(this.queryInfo.pageNum, this.queryInfo.pageSize, params).then(
        (res) => {
          this.tableData = res.data.data.records;
          this.queryInfo.total = res.data.data.total;
        }
      );
    },
    beforeUpload(file) {
      importExcel(file).then((res) => {
        if (res.data.code == 0) {
          this.getContractProjectList({});
          this.$message.success("导入成功");
        } else {
          this.$message.error("导入失败");
        }
      });
    },
    getProjectRow(v) {
      let row = this.userList.find(ele => {
        return ele.id === v
      })
      if (row) {
        this.editForm.projectManageName = row.realName
        this.editForm.projectManage = row.realName
      }
      console.log(row)
    },
    handleDeleteData(row, type) {
      if (type === "delete") {
        this.$confirm("确定将该条数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          delProject(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.getContractProjectList({});
            });
        });
      } else {
        if (!this.selectItems.length) {
          this.$message.error("至少选择一条数据!");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let ids = this.selectItems.map((project) => project.id);
          ids = ids.join(",");
          delProject(ids)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.selectItems = [];
              this.getContractProjectList();
            });
        });
      }
    },
    handleOpenDialog(row, type) {
      this.isShowDetail = false;
      switch (type) {
        case "detail":
          this.isShowDetail = true;
          this.dialogTitle = this.$t('commonContent.view');
          this.setRowValue(row);
          break;
        case "edit":
          this.dialogTitle = this.$t('commonContent.edit');
          this.isAdd = false;
          this.setRowValue(row);
          break;
        case "create":
          this.dialogTitle = this.$t('commonContent.add');
          this.isAdd = true;
          this.resetEditForm();
          break;
      }
      this.projectDialogFormVisible = true;
    },
    resetEditForm() {
      this.editForm.id = "";
      this.editForm.projectName = "";
      this.editForm.projectNo = "";
      this.editForm.projectType = "";
      this.editForm.sorpDate = "";
      this.editForm.projectManage = "";
      this.editForm.status = "";
      this.editForm.code = "";
    },
    setRowValue(row) {
      console.log("row-->" + JSON.stringify(row));
      this.editForm.id = row.id;
      this.editForm.projectName = row.projectName;
      this.editForm.projectNo = row.projectNo;
      this.editForm.projectType = row.projectType;
      this.editForm.sorpDate = row.sorpDate;
      this.editForm.projectManage = row.projectManageName;
      this.editForm.projectManageName = row.projectManageName;
      this.editForm.projectManageId = row.projectManageId ? row.projectManageId.toString() : ""
      this.editForm.status = row.status;
      this.editForm.code = row.code;
    },
    addCustomer() {
      if (this.isAdd) {
        console.log("add");
        saveOrUpdateProject(this.editForm)
          .then((res) => {
            if (res.data.success == true) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
          .finally(() => {
            this.getContractProjectList({});
            this.projectDialogFormVisible = false;
          });
      } else {
        console.log("update");
        saveOrUpdateProject(this.editForm)
          .then((res) => {
            if (res.data.success == true) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((err) => this.$message.error(`修改失败,${err.data.msg}`))
          .finally(() => {
            this.getContractProjectList({});
            this.projectDialogFormVisible = false;
          });
      }
    },
    handleCurrentChange(currentPage) {
      console.log("currentPage-->" + currentPage);
      this.queryInfo.pageNum = currentPage;
      this.getContractProjectList({});
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getContractProjectList({});
    },
    // 表格多选
    handleSelectionChange(val) {
      this.selectItems = val;
    },
    projectTypeFormatter(row) {
      switch (row.projectType) {
        case 1:
          return "N1";
        case 2:
          return "N2";
        case 3:
          return "M1";
        case 4:
          return "M2";
        case 5:
          return "I1";
        case 6:
          return "I2";
        case 7:
          return "NA";
        default:
          return "Unknown";
      }
    },
    statusFormatter(row) {
      switch (row.status) {
        case 1:
          return "进行中";
        case 2:
          return "已结项";
        default:
          return "Unknown";
      }
    },
    getUserList() {
      userList(this.tenantId).then((res) => {
        this.userList = res.data.data;
      });
    },
  },
  created() {
    this.getContractProjectList({});
    this.getUserList();
  },
};
</script>

<style></style>
