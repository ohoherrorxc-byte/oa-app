<template>
  <basic-container>
    <avue-form :option="option" @submit="handleSubmit" ref="form">
      <template slot-scope="{ size }" slot="menuForm">
        <el-button type="primary" :size="size" icon="el-icon-refresh"
          @click="refresh">{{ $t('commonContent.refresh') }}</el-button>
        <el-button type="primary" :size="size" icon="el-icon-plus"
          @click="handleOpenDialog({}, 'create')">{{ $t('commonContent.add') }}</el-button>
        <el-button type="primary" :size="size" icon="el-icon-download"
          @click="handleExport">{{ $t('commonContent.export') }}</el-button>
        <el-button type="primary" :size="size" icon="el-icon-refresh"
          @click="handleModel">{{ $t('commonContent.syncModel') }}</el-button>
        <el-button :size="size" @click="handleDeleteData" icon="el-icon-delete" type="danger"
          plain>{{ $t('commonContent.delete') }}</el-button>
      </template>
    </avue-form>
    <el-table v-sticky="{ top: 0, parent: '#avue-view' }" :data="tableData" style="width: 100%; margin-top: 20px" stripe
      align="center" border @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" />
      <el-table-column prop="modelName" :label="$t('vehicleModelManage.modelName')" align="left" width="150"
        show-overflow-tooltip />
      <el-table-column prop="countryReginCode" :label="$t('vehicleModelManage.countryReginCode')" align="center"
        :formatter="regionFormatter" />
      <el-table-column prop="seriesName" :label="$t('vehicleModelManage.seriesName')" align="center" />
      <el-table-column prop="modelTypeName" :label="$t('vehicleModelManage.modelNameConnet')" align="center" />
      <el-table-column prop="statusName" :label="$t('vehicleModelManage.statusName')" align="center" />
      <el-table-column prop="sopTime" :label="$t('vehicleModelManage.sopTime')" align="center" />
      <el-table-column prop="eopTime" :label="$t('vehicleModelManage.eopTime')" align="center" />
      <el-table-column prop="bomName" :label="$t('vehicleModelManage.relatedBom')" align="center" width="150"
        show-overflow-tooltip />
      <!-- <el-table-column prop="costCny" label="成本价" align="center" /> -->
      <!-- <el-table-column prop="contractPrice" label="合同价格" align="center" /> -->
      <el-table-column prop="offenders" :label="$t('vehicleModelManage.offenders')" align="center" />
      <el-table-column fixed="right" :label="$t('commonContent.operation')" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="handleOpenDialog(scope.row, 'detail')" type="text"
            icon="el-icon-view">{{ $t('commonContent.view') }}</el-button>
          <el-button @click="handleOpenDialog(scope.row, 'edit')" type="text"
            icon="el-icon-edit">{{ $t('commonContent.edit') }}</el-button>
          <el-button @click="(rowId = scope.row.id), (maintainRecords = true)" type="text"
            icon="el-icon-view">{{ $t('commonContent.maintainRecords') }}</el-button>
          <!-- <el-button
            @click="handleDeleteData(scope.row, 'delete')"
            type="text"
            icon="el-icon-delete"
          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"></el-pagination>
    <el-dialog :visible.sync="vehicleModelDialogFormVisible" append-to-body>
      <template slot="title">
        <div style="font-size: 15px">{{ dialogTitle }}</div>
      </template>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="modelId">
              <label slot="label">{{ $t('vehicleModelManage.modelName') }}:</label>
              <el-select v-model="editForm.modelId" clearable filterable @change="selectModel"
                :disabled="isShowDetail || isEdit">
                <el-option v-for="item in modelNameList" :key="item.id" :label="item.modelName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="countryReginCode">
              <label slot="label">{{ $t('vehicleModelManage.countryReginCode') }}:</label>
              <el-select v-model="editForm.countryReginCode" clearable filterable disabled>
                <el-option v-for="item in areaList" :key="item.dictKey" :label="item.dictValue"
                  :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <label slot="label">{{ $t('vehicleModelManage.seriesName') }}:</label>
              <el-input v-model="editForm.seriesName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="type">
              <label slot="label">{{ $t('vehicleModelManage.modelNameConnet') }}:</label>
              <el-input v-model="editForm.modelTypeName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="bomIds">
              <label slot="label">{{ $t('vehicleModelManage.relatedBom') }}:</label>
              <el-select :disabled="isShowDetail" style="width: 100%" v-model="editForm.bomIds" clearable filterable
                multiple @change="selectBom">
                <el-option v-for="item in bomList" :key="item.id" :label="item.bomName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!isEdit">
            <el-form-item prop="costPrice">
              <label slot="label">{{ $t('vehicleModelManage.costPrice') }}:</label>
              <el-input v-model="editForm.costCny" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="offenders">
              <label slot="label">{{ $t('vehicleModelManage.offenders') }}:</label>
              <el-input v-model="editForm.offenders" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!isEdit">
            <el-form-item prop="contractPrice">
              <label slot="label">{{ $t('vehicleModelManage.contractPrice') }}:</label>
              <el-input v-model="editForm.contractPrice" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!isEdit">
            <el-form-item prop="sopTime">
              <label slot="label">{{ $t('vehicleModelManage.sopTime') }}:</label>
              <el-date-picker style="width: 100%" v-model="editForm.sopTime" type="date" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" :disabled="isShowDetail"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!isEdit">
            <el-form-item prop="eopTime">
              <label slot="label">{{ $t('vehicleModelManage.eopTime') }}:</label>
              <el-date-picker style="width: 100%" v-model="editForm.eopTime" type="date" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" :disabled="isShowDetail"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <label slot="label">{{ $t('vehicleModelManage.platform') }}:</label>
              <el-select :disabled="isShowDetail" style="width: 100%" v-model="editForm.platform" clearable filterable>
                <el-option v-for="item in platformList" :key="item.dictKey" :label="item.dictValue"
                  :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="!isShowDetail">
        <span class="dialog-footer">
          <el-button @click="vehicleModelDialogFormVisible = false" size="mini"
            icon="el-icon-circle-close">{{ $t('commonContent.cancel') }}</el-button>
          <el-button type="primary" @click="addCustomer('editFormRef')" size="mini"
            icon="el-icon-circle-check">{{ $t('commonContent.save') }}</el-button>
        </span>
      </template>
    </el-dialog>
    <MaintainRecords v-if="maintainRecords" :params="{ id: rowId, type: 'VEHICLE_MODEL' }"
      @close="maintainRecords = false" />
  </basic-container>
</template>

<script>
import {
  getList,
  delVehicleModel,
  saveOrUpdateVehicleModel,
  selectLists,
  exportList, syncModelType
} from "@/api/contract/vehicleModelManage";
import { selectList } from "@/api/contract/bomMaint";
import { getOptions } from "@/api/base";
import { countryReginCode, modelId, bomId } from "@/util/formSelectList";
import { download } from "@/util/excel";
import MaintainRecords from "@/components/maintainRecords";
export default {
  components: {
    MaintainRecords,
  },
  data() {
    return {
      maintainRecords: false,
      areaList: [],
      option: {
        size: "mini",
        span: 6,
        menuPosition: "left",
        submitText: this.$t('commonContent.search'),
        submitIcon: "el-icon-search",
        emptyBtn: false,
        column: [
          countryReginCode,
          modelId,
          bomId,
          {
            type: "select",
            label: this.$t('vehicleModelManage.offenders'),
            allowCreate: true,
            filterable: true,
            prop: "offenders",
            dicUrl: `/api/oa-user/user-list?tenantId=${JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
              }`,
            props: {
              label: "name",
              value: "id",
            },
          },
          // {
          //   type: "input",
          //   label: "车系",
          //   prop: "offenders",
          // },
        ],
      },
      tableData: [],
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      editFormRules: {
        modelId: [{ required: true, message: this.$t('vehicleModelManage.modelName') }],
        bomIds: [{ required: true, message: this.$t('vehicleModelManage.bomName'), trigger: "change" }],
        eopTime: [{ required: true, message: this.$t('vehicleModelManage.eopTime') }],
        sopTime: [{ required: true, message: this.$t('vehicleModelManage.sopTime') }],
      },
      vehicleModelDialogFormVisible: false,
      dialogTitle: "",
      isShowDetail: false,
      editForm: {},
      isEdit: false,
      selectItems: [],
      bomList: [],
      platformList: [],
      modelNameList: [],
    };
  },
  methods: {
    // 导出
    handleExport() {
      this.$confirm(this.$t('commonContent.confirmExport'), this.$t('commonContent.tip'), {
        confirmButtonText: this.$t('commonContent.confirm'),
        cancelButtonText: this.$t('commonContent.cancel'),
        type: "warning",
      })
        .then(() => {
          return exportList();
        })
        .then((res) => {
          download(res);
        });
    },
    async handleModel() {
      let res = await syncModelType()
      if (res.data.code === 200 || res.data.code === 0) {
        this.$message.success(this.$t('commonContent.syncSuccess'))
        this.getVehicleModelManageList({});
      }
    },
    regionFormatter(val) {
      let data = this.areaList.find((item) => {
        if (item.dictKey === val.countryReginCode) {
          return item;
        }
      });
      return data ? data.dictValue : "";
    },
    handleSubmit(form, done) {
      this.form = form;
      this.queryInfo.pageNum = 1;
      this.getVehicleModelManageList(form);
      done();
    },
    getVehicleModelManageList() {
      getList(this.queryInfo.pageNum, this.queryInfo.pageSize, this.form).then(
        (res) => {
          this.tableData = res.data.data.records;
          this.queryInfo.total = res.data.data.total;
        }
      );
    },
    handleDeleteData(row, type) {
      if (type === "delete") {
        this.$confirm(this.$t('commonContent.confirmDelete'), this.$t('commonContent.tip'), {
          confirmButtonText: this.$t('commonContent.confirm'),
          cancelButtonText: this.$t('commonContent.cancel'),
          type: "warning",
        }).then(() => {
          delVehicleModel(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success(this.$t('commonContent.deleteSuccess'));
              } else {
                this.$message.error(`${this.$t('commonContent.deleteFail')},${res.data.msg}`);
              }
            })
            .catch((err) => this.$message.error(`${this.$t('commonContent.deleteFail')},${err.data.msg}`))
            .finally(() => {
              this.getVehicleModelManageList({});
            });
        });
      } else {
        if (!this.selectItems.length) {
          this.$message.error(this.$t('commonContent.selectOne'));
          return;
        }
        this.$confirm(this.$t('commonContent.confirmDelete'), this.$t('commonContent.tip'), {
          confirmButtonText: this.$t('commonContent.confirm'),
          cancelButtonText: this.$t('commonContent.cancel'),
          type: "warning",
        }).then(() => {
          let ids = this.selectItems.map((vehicleModel) => vehicleModel.id);
          ids = ids.join(",");
          delVehicleModel(ids)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success(this.$t('commonContent.deleteSuccess'));
              } else {
                this.$message.error(`${this.$t('commonContent.deleteFail')},${res.data.msg}`);
              }
            })
            .catch((err) => this.$message.error(`${this.$t('commonContent.deleteFail')},${err.data.msg}`))
            .finally(() => {
              this.selectItems = [];
              this.getVehicleModelManageList({});
            });
        });
      }
    },
    editDialogClose() {

    },
    handleOpenDialog(row, type) {
      this.isShowDetail = false;
      this.vehicleModelDialogFormVisible = true;
      this.$refs.editFormRef && this.$refs.editFormRef.resetFields();
      switch (type) {
        case "detail":
          this.isShowDetail = true;
          this.dialogTitle = "车型查看";
          this.setRowValue(row);
          break;
        case "edit":
          this.dialogTitle = "车型编辑";
          this.isEdit = true
          this.isAdd = false;
          this.setRowValue(row);
          break;
        case "create":
          this.dialogTitle = "车型新增";
          this.isAdd = true;
          this.isEdit = false
          this.setRowValue({});
          break;
      }
    },
    setRowValue(row) {
      this.editForm = row;
    },

    addCustomer(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const message = this.isAdd ? "新增成功" : "编辑成功";
          saveOrUpdateVehicleModel(this.editForm)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message,
                  type: "success",
                });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
            .finally(() => {
              this.getVehicleModelManageList({});
              this.vehicleModelDialogFormVisible = false;
            });
        }
      });
    },
    refresh() {
      this.$refs.form.resetForm();
      this.queryInfo.pageNum = 1;
      this.getVehicleModelManageList({});
    },
    // 表格多选
    handleSelectionChange(val) {
      this.selectItems = val;
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pageNum = currentPage;
      this.getVehicleModelManageList({});
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getVehicleModelManageList({});
    },
    initData(params) {
      selectList(params).then((res) => {
        this.bomList = res.data.data;
        this.bomList.forEach((item) => {
          item.id = +item.id;
        });
      });
      selectLists().then((res) => {
        this.modelNameList = res.data.data;
        this.modelNameList.forEach((item) => {
          item.id = +item.id;
        });
      });
      getOptions({ code: "COUNTRY_REGIN" }).then((res) => {
        this.areaList = res.data.data;
      });
      getOptions({ code: "PLATFORM" }).then((res) => {
        this.platformList = res.data.data;
      });
    },
    selectBom(val) {
      //选中的数据和options进行匹配
      this.bomList.find((item) => {
        if (item.id === val) {
          this.editForm.costCny = item.costCny;
          this.editForm.offenders = item.offenders;
          this.editForm.contractPrice = item.contractPrice;
          return false;
        }
      });
    },
    selectModel(val) {
      //选中的数据和options进行匹配
      this.modelNameList.find((item) => {
        if (item.id === val) {
          this.editForm.countryReginCode = item.countryReginCode;
          this.editForm.seriesName = item.seriesName;
          this.editForm.modelTypeName = item.modelTypeName;
          return false;
        }
      });
    },
  },
  created() {
    this.getVehicleModelManageList({});
    this.initData({});
  },
};
</script>

<style></style>
