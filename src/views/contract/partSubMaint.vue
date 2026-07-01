<template>
  <basic-container>
    <el-card>
      <el-form
        :inline="true"
        ref="query"
        :model="query"
        class="demo-form-inline"
      >
        <el-form-item :label="$t('partsMaint.subPartsNo')">
          <el-input v-model.trim="query.partsNo" size="mini" clearable />
        </el-form-item>
        <el-form-item :label="$t('partsMaint.subPartsName')">
          <el-input v-model.trim="query.partsName" size="mini" clearable />
        </el-form-item>
        <el-form-item :label="$t('partsMaint.contract')">
          <el-input
            v-model.trim="query.bomPurchaseContractId"
            size="mini"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('partsMaint.supplier')">
          <template>
            <el-select
              size="mini"
              v-model="query.supplierNo"
              filterable
              style="width: 90%"
              clearable
            >
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.supplierName"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="外部零件号">
          <el-input v-model="query.partsSubExternal"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-on:click="searchChange"
            size="mini"
            icon="el-icon-search"
            >{{ $t("commonContent.search") }}</el-button
          >
          <el-button
            type="primary"
            v-on:click="ResetChange"
            size="mini"
            icon="el-icon-refresh"
            >{{ $t("commonContent.refresh") }}</el-button
          >
          <el-upload
            style="display: inline-block; margin-left: 10px"
            action="#"
            :before-upload="beforeUpload"
            :limit="1"
          >
            <el-button icon="el-icon-upload" size="mini" type="primary">{{
              $t("commonContent.subImport")
            }}</el-button>
          </el-upload>
          <el-button
            icon="el-icon-download"
            size="mini"
            type="primary"
            style="margin-left: 10px"
            @click="handleExport('', 'create')"
            >{{ $t("commonContent.export") }}</el-button
          >
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            style="margin-left: 10px"
            @click="handleAddOrUpdateOrDetail('', 'create')"
            >{{ $t("commonContent.add") }}</el-button
          >
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            style="margin-left: 10px"
            plain
            @click="handleDeleteData('', 'littleDelete')"
            >{{ $t("commonContent.delete") }}</el-button
          >
          <el-button
            icon="el-icon-download"
            size="mini"
            type="primary"
            style="margin-left: 10px"
            @click="handImportModel('', 'create')"
            >导入模板下载</el-button
          >
          <el-button @click="copySubMaint">复 制</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-tabs v-model="query.type" @tab-click="handleTypeChange">
      <el-tab-pane :label="$t('partsMaint.allParts')" name="ALL"></el-tab-pane>
      <!-- el-tab的值不能为数字0，设置为数字会被转译为字符串1 -->
      <el-tab-pane label="BOM" name="BOM"></el-tab-pane>
      <el-tab-pane
        :label="$t('partsMaint.halfParts')"
        name="半成品"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('partsMaint.subParts')"
        name="子零件"
      ></el-tab-pane>
      <!-- <el-tab-pane v-if="roleId == '1650066294260449282'" :label="$t('partsMaint.pendingActivation')" name="2"></el-tab-pane>
          <el-tab-pane :label="$t('partsMaint.unassignedParts')" name="3"></el-tab-pane>
        <el-tab-pane :label="$t('partsMaint.invalidParts')" name="4"></el-tab-pane>
        <el-tab-pane v-if="roleId == '1650066915705307138'" :label="$t('partsMaint.maintainParts')" name="5"></el-tab-pane> -->
    </el-tabs>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      stripe
      align="center"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" />
      <el-table-column
        prop="partsNo"
        :label="$t('partsMaint.partsNo')"
        align="center"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column
        prop="partsName"
        :label="$t('partsMaint.partsName')"
        align="left"
        width="250"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="canShowPrice()"
        prop="unitPriceCny"
        :label="$t('partsMaint.unitPriceCny')"
        align="center"
      />
      <!-- <el-table-column prop="bomPurchaseContractId" label="所属合同" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.bomPurchaseContractId" style="color: red">未归属</span>
            <span v-else>{{ scope.row.bomPurchaseContractId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="effectiveTime" label="生效时间" align="center" />
        <el-table-column prop="failureTime" label="失效时间" align="center" /> -->
      <!-- <el-table-column prop="status" label="零件状态" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">生效中</span>
            <span v-else-if="scope.row.status == '2'">采购待确认</span>
            <span v-else-if="scope.row.status == 3">采购已退回</span>
            <span v-else-if="scope.row.status == 4">采购已确认</span>
            <span v-else-if="scope.row.status == 5">已失效</span>
            <span v-else>采购待确认</span>
          </template>
        </el-table-column> -->
      <el-table-column
        prop="parentFunction"
        label="零件类型"
        align="center"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="externalPartNo"
        label="外部零件号"
        align="center"
        width="100"
        :formatter="formatter"
        show-overflow-tooltip
      />
      <el-table-column
        prop="childrenFunction"
        label="配置"
        align="center"
        width="100"
        show-overflow-tooltip
      />
      <!-- <el-table-column prop="supplierName" label="所属供应商NO" align="center" /> -->
      <el-table-column
        prop="createUserName"
        :label="$t('partsMaint.createUserName')"
        align="center"
      />

      <el-table-column
        fixed="right"
        :label="$t('commonContent.operation')"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleAddOrUpdateOrDetail(scope.row, 'detail')"
            type="text"
            icon="el-icon-view"
            >{{ $t("commonContent.view") }}</el-button
          >
          <el-button
            @click="(rowId = scope.row.id), (maintainRecords = true)"
            type="text"
            icon="el-icon-view"
            >{{ $t("partsMaint.maintainRecords") }}</el-button
          >
          <!-- <template v-if="roleId == '1650066294260449282'">
              <el-button
                type="text"
                v-if="statusNot134(scope.row)"
                @click="handleActive(scope.row.id, 1)"
                icon="el-icon-thumb"
              >{{ $t('partsMaint.activate') }}</el-button>
              <el-button
                type="text"
                v-if="statusNot134(scope.row)"
                @click="handleActive(scope.row.id, 0)"
                icon="el-icon-refresh-right"
              >{{ $t('partsMaint.return') }}</el-button>
            </template> -->
          <template>
            <el-button
              @click="handleAddOrUpdateOrDetail(scope.row, 'edit')"
              v-if="statusNot134(scope.row)"
              type="text"
              icon="el-icon-edit"
              >{{ $t("commonContent.edit") }}</el-button
            >
            <el-button
              @click="handleDeleteData(scope.row, 'delete')"
              v-if="statusNot134(scope.row)"
              type="text"
              icon="el-icon-delete"
              >{{ $t("commonContent.delete") }}</el-button
            >
            <el-button
              v-if="!scope.row.partsPriceStatus && canSend(scope.row)"
              icon="el-icon-message"
              type="text"
              style="margin-left: 10px"
              plain
              @click="sendToPurchase(scope.row)"
              >{{ $t("partsMaint.sendPurchase") }}</el-button
            >
            <el-button
              type="text"
              style="color: green"
              v-if="scope.row.partsPriceStatus === 1 && canSend(scope.row)"
              >已发送至采购</el-button
            >
            <el-button
              type="text"
              style="color: green"
              v-if="scope.row.partsPriceStatus === 2 && canSend(scope.row)"
              >已发送至采购,已归档</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[2, 5, 10, 20, 50]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.total"
    ></el-pagination>
    <MaintainRecords
      v-if="maintainRecords"
      :params="{ id: rowId, type: 'PARTS_MAINT' }"
      @close="maintainRecords = false"
    >
    </MaintainRecords>
  </basic-container>
</template>
  
<script>
import MaintainRecords from "@/components/maintainRecords";
import { download } from "@/util/excel";
import { downloadFileBlob, isGoogleChrome } from "@/util/util";
import UploadApi from "@/api/upload";
import PartsPriceMaintenanceApi from "@/api/partsPriceMaintenance/index.js";
import {
  getList,
  delParts,
  saveOrUpdateParts,
  getOptions,
  getAllList,
  getExchangeRate,
  getCurrency,
  importExcel,
  saveActive,
  exportList,
  getPartsCopy,
} from "@/api/contract/partsSubMaint";
export default {
  components: {
    MaintainRecords,
  },
  data() {
    return {
      maintainRecords: false,
      exchangeRate: null,
      isWarning: false,
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
      roleId: JSON.parse(localStorage.getItem("saber-userInfo")).content
        .role_id,
      tableData: [],
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      query: {
        partsNo: "",
        partsName: "",
        bomPurchaseContractId: "",
        parentFunctionId: "",
        childrenFunctionId: "",
        supplierNo: "",
        type: "ALL",
      },
      partsDialogFormVisible: false,
      dialogTitle: "",
      isShowDetail: false,
      editForm: {
        id: "",
        partsNo: "",
        partsName: "",
        amount: "",
        unitPrice: "",
        contractNo: "",
        effectiveTime: "",
        failureTime: "",
        parentFunctionId: "",
        childrenFunctionId: "",
        supplierNo: "",
        currency: "CNY",
        exchangeRateMethod: 1,
        exchangeRate: "1.00",
        unitPriceCny: "",
        remark: "",
        createTime: "",
        createUserName: "",
        updateTime: "",
        updateUserNameName: "",
      },
      selectItems: [],
      OptionsList: [],
      OptionsSeacondList: [],
      OptionsThreeList: [],
      exchangeRateList: [
        {
          name: "固定汇率",
          id: 1,
        },
        {
          name: "当年1日汇率",
          id: 2,
        },
        {
          name: "当季1日",
          id: 3,
        },
      ],
      supplierList: [],
      ExchangeRate: "",
      editFormRules: {
        unitPrice: [
          { required: true, message: this.$t("partsMaint.unitPriceRequired") },
        ],
        effectiveTime: [
          {
            required: true,
            message: this.$t("partsMaint.effectiveTimeRequired"),
          },
        ],
        failureTime: [
          {
            required: true,
            message: this.$t("partsMaint.failureTimeRequired"),
          },
        ],
      },
    };
  },
  activated() {
    if (this.$route.query.reflesh) {
      this.getPartsMaintList();
    }
  },
  methods: {
    canShowPrice() {
      return (
        this.userInfo.content.account === "shenyanxia" ||
        this.userInfo.content.account === "zhanpeng" ||
        this.userInfo.content.account === "wuzhizhen"
      );
    },
    statusNot134(row) {
      return row.status != 1 && row.status != 3 && row.status != 4;
    },
    handleExport() {
      this.$confirm("确定导出数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return exportList(this.query);
        })
        .then((res) => {
          download(res);
        });
    },
    canSend(row) {
      return (
        row &&
        row.partsNo &&
        this.userInfo.content.user_id === row.createUser &&
        (this.userInfo.content.account === "jizhonghua" ||
          this.userInfo.content.createUserName === "zhouxiangyu"||
          this.userInfo.content.createUserName === "niuyinuo")
      );
    },
    async sendToPurchase(row) {
      this.$confirm("是否确定发送流程到采购人员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await PartsPriceMaintenanceApi.startBranchPartsPrice(
            row.id,
            "sub"
          );
          if (res.data.code === 200 || res.data.code === 0) {
            this.$message.success("已发送至采购人员，可在我的请求中查看流程");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    async copySubMaint() {
      if (this.selectItems.length === 0) {
        this.$message.error("请选择一条数据复制");
        return;
      }
      let ids = this.selectItems.map((ele) => ele.id);
      let res = await getPartsCopy({
        ids: ids.toString(),
        createUser: this.userInfo.content.user_id,
      });
      // console.log(res);
      if (res.data.code === 0 || res.data.code === 200) {
        this.$message.success("已复制");
        this.getPartsMaintList();
      }
    },
    handleTypeChange() {
      // console.log(this.query.type);
      this.getPartsMaintList(this.query);
    },
    inputChange(content) {
      this.formatterBigDecimal(content);
    },
    formatter(row, column) {
      let arr = row.partsSubExternalList||[]
      let content = arr.map(ele=>ele.externalPartsNo).toString()
      return content
    },
    formatterBigDecimal(content) {
      if (this.editForm.exchangeRate !== "") {
        this.editForm.unitPriceCny = content * this.editForm.exchangeRate;
        this.editForm.unitPriceCny = parseFloat(
          this.editForm.unitPriceCny
        ).toFixed(2);
      }
    },
    getPartsMaintList(params = {}) {
      getList(
        this.queryInfo.pageNum,
        this.queryInfo.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        this.tableData = res.data.data.records;
        this.queryInfo.total = res.data.data.total;
      });
    },
    getRate(params) {
      this.editForm.currency = params;
      this.getExchangeRate();
    },
    getExchangeRateMethod(params) {
      this.editForm.exchangeRateMethod = params;
      this.getExchangeRate();
    },
    getExchangeRate() {
      let currencyCode = this.editForm.currency;
      let exchangeRateMethod = this.editForm.exchangeRateMethod;
      let createTime = this.editForm.createTime;
      if (!currencyCode || !exchangeRateMethod) return false;
      getExchangeRate({ currencyCode, exchangeRateMethod, createTime }).then(
        (res) => {
          this.editForm.exchangeRate = res.data.data.middleRate;
          const exchangeRate =
            (this.editForm.exchangeRate - this.exchangeRate) /
            this.editForm.exchangeRate;
          this.isWarning = Math.abs(exchangeRate) > 0.05 ? true : false;
          this.formatterBigDecimal(this.editForm.unitPrice);
        }
      );
    },
    getOptionsList(params) {
      getOptions(params).then((res) => {
        this.OptionsList = res.data.data;
      });
    },
    getSeaondList(params) {
      getOptions({ parentId: params }).then((res) => {
        this.OptionsSeacondList = res.data.data;
      });
    },
    getThreeList(params) {
      getOptions({ parentId: params }).then((res) => {
        this.OptionsThreeList = res.data.data;
      });
    },
    getContractSupplierList(params) {
      getAllList(params).then((res) => {
        this.supplierList = res.data.data;
      });
    },
    handleActive(id, isActive) {
      let params = {
        id,
        isActive,
        userId: this.userInfo.content.user_id,
      };
      saveActive(params)
        .then((res) => {
          console.log(params);
          if (res.data.code == 0) {
            this.$message.success("操作成功");
          } else {
            this.$message.error(`操作失败,${res.data.message}`);
          }
        })
        .finally(() => {
          this.getPartsMaintList(this.query);
        });
    },
    async handImportModel() {
      let obj = {
        url: "http://10.30.4.68:9000/license-prd/upload/20251201/8b672f1aaaf90cbb3430ebde44ed3dbf.xlsx",
      };
      let res = await UploadApi.getUrl(obj);
      if (isGoogleChrome()) {
        downloadFileBlob(res.data.data, "子零件维护模板.xlsx");
      } else {
        window.open(res.data.data);
      }
    },
    handleDeleteData(row, type) {
      if (type === "delete") {
        this.$confirm("确定将该条数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          delParts(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                console.log(123);
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.message}`);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(`删除失败,${err.data.message}`);
            })
            .finally(() => {
              this.getPartsMaintList({});
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
          let ids = this.selectItems.map((partsMaint) => partsMaint.id);
          ids = ids.join(",");
          delParts(ids)
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
              this.getPartsMaintList();
            });
        });
      }
    },
    load() {},
    handleAddOrUpdateOrDetail(row, key) {
      let path = row
        ? `/partsMaintSubAdd?id=${row.id}&key=${key}`
        : "/partsMaintSubAdd";
      this.$router.push({ path: path });
    },
    resetEditForm() {
      this.editForm.id = "";
      this.editForm.partsNo = "";
      this.editForm.partsName = "";
      this.editForm.partsNumber = "";
      this.editForm.unitPrice = "";
      this.editForm.contractNo = "";
      this.editForm.effectTime = "";
      this.editForm.vehicleFunction = "";
      this.editForm.supplierNo = "";
      this.editForm.parentFunctionId = "";
      this.editForm.childrenFunctionId = "";
      this.editForm.currency = this.CurrencyList[0].dictKey;
      this.editForm.unitPriceCny = "";
      this.editForm.status = 2;
      this.editForm.remark = "";
      this.editForm.createTime = "";
      this.editForm.createUserName = this.userInfo.content.user_name;
      this.editForm.updateTime = "";
      this.editForm.updateUserNameName = "";
    },
    addParts() {
      this.$refs["editFormRef"].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            console.log("add");
            this.editForm.createUser = this.userInfo.content.user_id;
            saveOrUpdateParts(this.editForm)
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
                this.getPartsMaintList({});
                this.partsDialogFormVisible = false;
              });
          } else {
            console.log("update");
            this.editForm.updateUser = this.userInfo.content.user_id;
            saveOrUpdateParts(this.editForm)
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
                this.getPartsMaintList({});
                this.partsDialogFormVisible = false;
              });
          }
        }
      });
    },
    // 表格多选
    handleSelectionChange(val) {
      this.selectItems = val;
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pageNum = currentPage;
      this.getPartsMaintList({});
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getPartsMaintList({});
    },
    beforeUpload(file) {
      this.$message.warning("正在导入，请稍后");
      importExcel(file).then((res) => {
        if (res.data.code == 0) {
          this.getPartsMaintList({});
          this.$message.success("导入成功");
        } else {
          this.$message.error("导入失败");
        }
      });
    },
    searchChange() {
      this.queryInfo.pageNum = 1;
      this.getPartsMaintList(this.query);
    },
    ResetChange() {
      console.log(this.$refs["query"]);
      this.$refs["query"].resetFields();
      this.query = {
        partsNo: "",
        partsName: "",
        bomPurchaseContractId: "",
        parentFunctionId: "",
        childrenFunctionId: "",
        supplierNo: "",
        type: "ALL",
      };
      this.queryInfo.pageNum = 1;
      this.getPartsMaintList({});
    },
    getCurrency(params) {
      getCurrency(params).then((res) => {
        this.CurrencyList = res.data.data;
      });
    },
  },
  created() {
    this.getPartsMaintList({});
    this.getContractSupplierList({});
    this.getOptionsList({ parentId: "0" });
    this.getCurrency({ code: "CURRENCY" });
  },
};
</script>
  
<style scope>
.el-pagination {
  padding-bottom: 20px;
}

.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-item {
  margin: 20px 10px;
}

.no-list {
  text-align: center;
  font-size: 28px;
}
</style>
  