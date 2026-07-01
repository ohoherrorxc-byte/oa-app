<template>
  <basic-container>
    <el-button
      icon="el-icon-delete"
      size="mini"
      type="danger"
      style="margin-left: 10px; float: right"
      plain
      @click="handleDeleteData('', 'littleDelete')"
      >删除</el-button
    >
    <el-upload
      style="float: right"
      action="#"
      :before-upload="beforeUpload"
      :limit="1"
    >
      <el-button icon="el-icon-plus" size="mini" type="primary">导入</el-button>
    </el-upload>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 40px"
      stripe
      align="center"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" />
      <el-table-column prop="orderName" label="订单名称" align="center" />
      <el-table-column prop="orderNo" label="订单编号" align="center" />
      <el-table-column prop="isDeleted" label="销售类型" align="center" />
      <el-table-column prop="supplierNo" label="订单金额" align="center" />
      <el-table-column prop="isDeleted" label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag class="ml-2" type="success">{{
            scope.row.supplierType
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="invoiceTotalAmount"
        label="开票总金额"
        align="center"
      />
      <el-table-column
        prop="shouldOpenNotOpenAmount"
        label="应开未开金额"
        align="center"
      />
      <el-table-column prop="contactPerson" label="收款方式" align="center" />
      <el-table-column prop="contactNumber" label="收款进度" align="center">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.contactNumber" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="170" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleOpenDialog(scope.row, 'detail')"
            type="text"
            icon="el-icon-view"
            >查看</el-button
          >
          <el-button
            @click="handleOpenDialog(scope.row, 'edit')"
            type="text"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            @click="handleDeleteData(scope.row, 'delete')"
            type="text"
            icon="el-icon-delete"
            >删除</el-button
          >
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

    <el-dialog
      :visible.sync="supplierDialogFormVisible"
      append-to-body
      @close="editDialogClose"
    >
      <template slot="title">
        <div style="font-size: 15px">
          {{ dialogTitle }}
        </div>
      </template>
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        class="demo-ruleForm"
      >
        <el-row>
          <el-form-item prop="applyTime">
            <label slot="label">申请日期:</label><br />
            <el-input
              v-model="editForm.applyTime"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '申请日期'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="supplierDesc">
            <label slot="label">供应商说明:</label><br />
            <el-input
              v-model="editForm.supplierDesc"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '供应商说明'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="supplierName">
            <label slot="label">供应商名称:</label><br />
            <el-input
              v-model="editForm.supplierName"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '供应商名称'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="supplierNo">
            <label slot="label">供应商编号:</label><br />
            <el-input
              v-model="editForm.supplierNo"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '供应商编号'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="supplierType">
            <label slot="label">供应商类型:</label><br />
            <el-input
              v-model="editForm.supplierType"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '供应商类型'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="contactPerson">
            <label slot="label">联系人:</label><br />
            <el-input
              v-model="editForm.contactPerson"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '联系人'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="contactNumber">
            <label slot="label">联系电话:</label><br />
            <el-input
              v-model="editForm.contactNumber"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '联系电话'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="openBank">
            <label slot="label">开户行:</label><br />
            <el-input
              v-model="editForm.openBank"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '开户行'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="bankAccount">
            <label slot="label">银行账号:</label><br />
            <el-input
              v-model="editForm.bankAccount"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '银行账号'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="status">
            <label slot="label">状态:</label><br />
            <el-input
              v-model="editForm.status"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '状态'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer v-if="!isShowDetail">
        <span class="dialog-footer">
          <el-button
            @click="supplierDialogFormVisible = false"
            size="mini"
            icon="el-icon-circle-close"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="addSupplier"
            size="mini"
            icon="el-icon-circle-check"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  importExcel,
  delSupplier,
  saveOrUpdateSuppliers,
} from "@/api/contract/contractSupplier";
import {
  SaleOrderGetList,
  importExcelsaleOrder,
  saleOrderDelete,
} from "@/api/contract/contractSellAdd";
export default {
  data() {
    return {
      tableData: [],
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      supplierDialogFormVisible: false,
      dialogTitle: "",
      isShowDetail: false,
      editForm: {
        id: "",
        applyTime: "",
        supplierDesc: "",
        supplierName: "",
        supplierNo: "",
        supplierType: "",
        contactPerson: "",
        contactNumber: "",
        openBank: "",
        bankAccount: "",
        status: "",
      },
      selectItems: [],
    };
  },
  methods: {
    getContractSupplierList(params) {
      SaleOrderGetList(
        this.queryInfo.pageNum,
        this.queryInfo.pageSize,
        params
      ).then((res) => {
        this.tableData = res.data.data.records;
        this.queryInfo.total = res.data.data.total;
      });
    },
    beforeUpload(file) {
      importExcelsaleOrder(file).then((res) => {
        console.log("res--->" + JSON.stringify(res));
        if (res.data.code == 0) {
          this.getContractSupplierList({});
          this.$message.success("导入成功");
        } else {
          this.$message.error("导入失败");
        }
      });
    },
    handleDeleteData(row, type) {
      if (type === "delete") {
        this.$confirm("确定将该条数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          saleOrderDelete(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
              this.getContractSupplierList({});
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.getContractSupplierList({});
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
          let ids = this.selectItems.map(
            (contractSupplier) => contractSupplier.id
          );
          ids = ids.join(",");
          saleOrderDelete(ids)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
              this.getContractSupplierList({});
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.selectItems = [];
              this.getContractSupplierList();
            });
        });
      }
    },
    handleOpenDialog(row, type) {
      this.isShowDetail = false;
      switch (type) {
        case "detail":
          this.$router.push({
            path: "/contractPOAdd",
            query: {
              id: row.id,
              type,
            },
          });
          break;
        case "edit":
          this.dialogTitle = "供应商编辑";
          this.$router.push({
            path: "/contractPOAdd",
            query: {
              id: row.id,
              type,
            },
          });
          break;
        case "create":
          this.$router.push({
            path: "/contractPOAdd",
            query: {
              type,
            },
          });
          break;
      }
    },
    resetEditForm() {
      this.editForm.id = "";
      this.editForm.applyTime = "";
      this.editForm.supplierDesc = "";
      this.editForm.supplierName = "";
      this.editForm.supplierNo = "";
      this.editForm.supplierType = "";
      this.editForm.contactPerson = "";
      this.editForm.contactNumber = "";
      this.editForm.openBank = "";
      this.editForm.bankAccount = "";
      this.editForm.status = "";
    },
    setRowValue(row) {
      console.log("row-->" + JSON.stringify(row));
      this.editForm.id = row.id;
      this.editForm.applyTime = row.applyTime;
      this.editForm.supplierDesc = row.supplierDesc;
      this.editForm.supplierName = row.supplierDesc;
      this.editForm.supplierNo = row.supplierNo;
      this.editForm.supplierType = row.supplierType;
      this.editForm.contactPerson = row.contactPerson;
      this.editForm.contactNumber = row.contactNumber;
      this.editForm.openBank = row.openBank;
      this.editForm.bankAccount = row.bankAccount;
      this.editForm.status = row.status;
    },
    addSupplier() {
      if (this.isAdd) {
        console.log("add");
        saveOrUpdateSuppliers(this.editForm)
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
            this.getContractSupplierList({});
            this.supplierDialogFormVisible = false;
          });
      } else {
        console.log("update");
        saveOrUpdateSuppliers(this.editForm)
          .then((res) => {
            console.log("223");
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
            this.getContractSupplierList({});
            this.supplierDialogFormVisible = false;
          });
      }
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pageNum = currentPage;
      this.getContractSupplierList({});
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getContractSupplierList({});
    },
    // 表格多选
    handleSelectionChange(val) {
      this.selectItems = val;
    },
  },
  created() {
    this.getContractSupplierList({});
  },
};
</script>

<style></style>
