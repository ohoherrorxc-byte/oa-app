<template>
  <basic-container>
    <el-upload
      style="float: left"
      action="#"
      :before-upload="beforeUpload"
      :limit="1"
    >
      <el-button icon="el-icon-plus" size="mini" type="primary">导入</el-button>
    </el-upload>
    <el-button
      icon="el-icon-plus"
      size="mini"
      type="primary"
      style="margin-left: 10px"
      @click="goto()"
      >新增</el-button
    >
    <el-button
      icon="el-icon-delete"
      size="mini"
      type="danger"
      @click="handleDeleteData('', 'littleDelete')"
      style="margin-left: 10px"
      plain
      >删除</el-button
    >
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      stripe
      align="center"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" />
      <el-table-column prop="invoiceName" label="标题" align="center" />
      <el-table-column prop="projectNo" label="申请人" align="center" />
      <el-table-column prop="projectType" label="申请部门" align="center" />
      <el-table-column prop="sorpDate" label="申请日期" align="center" />
      <el-table-column prop="invoiceNo" label="申请编号" align="center" />
      <el-table-column prop="collectedAmount" label="收款金额" align="center" />
      <el-table-column
        prop="shouldReceiveNotAmount"
        label="应收未收金额"
        align="center"
      />
      <el-table-column prop="invoiceDesc" label="开票说明" align="center" />
      <el-table-column prop="invoiceType" label="开票类型" align="center" />
      <el-table-column prop="saleType" label="销售类型" align="center" />
      <el-table-column
        prop="saleContractId"
        label="相关销售合同"
        align="center"
      />
      <el-table-column prop="saleOrderId" label="销售合同编号" align="center" />
      <el-table-column
        prop="saleOrderNo"
        label="相关PO订单编号"
        align="center"
      />
      <el-table-column prop="billType" label="票据类型" align="center" />
      <el-table-column prop="code" label="合同类型" align="center" />
      <el-table-column prop="projectId" label="项目名称" align="center" />
      <el-table-column prop="currency" label="市种" align="center" />
      <el-table-column prop="code" label="本次开票金额" align="center" />
      <el-table-column fixed="right" label="操作" width="170" align="center">
        <template slot-scope="scope">
          <el-button @click="gotoId(scope.row)" type="text" icon="el-icon-edit"
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
  </basic-container>
</template>

<script>
import {
  importExcelInvoices,
  delInvoices,
  saveOrUpdateProject,
} from "@/api/contract/contractProject";

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
      projectDialogFormVisible: false,
      dialogTitle: "",
      isShowDetail: false,
      editForm: {
        id: "",
        projectName: "",
        projectNo: "",
        projectType: "",
        sorpDate: "",
        projectManage: "",
        status: "",
        code: "",
      },
      selectItems: [],
    };
  },
  methods: {
    getContractProjectList(params) {
      // InvoicegetList(
      //   this.queryInfo.pageNum,
      //   this.queryInfo.pageSize,
      //   params
      // ).then((res) => {
      //   this.tableData = res.data.data.records;
      //   this.queryInfo.total = res.data.data.total;
      // });
    },
    beforeUpload(file) {
      importExcelInvoices(file).then((res) => {
        console.log("res--->" + JSON.stringify(res));
        if (res.data.code == 0) {
          this.getContractProjectList({});
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
          delInvoices(row.id)
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
          delInvoices(ids)
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
          this.dialogTitle = "项目查看";
          this.setRowValue(row);
          break;
        case "edit":
          this.dialogTitle = "项目编辑";
          this.isAdd = false;
          this.setRowValue(row);
          break;
        case "create":
          this.dialogTitle = "项目新增";
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
      this.editForm.projectManage = row.projectManage;
      this.editForm.status = row.status;
      this.editForm.code = row.code;
    },
    addCustomer() {
      if (this.isAdd) {
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
    goto() {
      this.$router.push({ path: "/contractApplicationAdd" });
    },
    gotoId(row) {
      this.$router.push({
        path: "/contractApplicationAdd",
        query: { id: row.id },
      });
    },
  },
  created() {
    this.getContractProjectList({});
  },
};
</script>

<style></style>
