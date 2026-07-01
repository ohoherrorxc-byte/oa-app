<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="BOM合同付款订单"
        name="bomPurchaseOrder"
      ></el-tab-pane>
      <el-tab-pane label="一般合同付款订单" name="purchaseOrder"></el-tab-pane>
      <el-tab-pane
        label="License付款订单"
        name="licensePurchaseOrder"
      ></el-tab-pane>
    </el-tabs>
    <el-button
      icon="el-icon-delete"
      size="mini"
      type="danger"
      style="margin-left: 10px; float: right"
      plain
      @click="handleDeleteData()"
      >删除</el-button
    >
    <!--      <el-upload-->
    <!--        style="float: right"-->
    <!--        action="#"-->
    <!--        :before-upload="beforeUpload"-->
    <!--        :limit="1">-->
    <!--        <el-button icon="el-icon-plus" size="mini" type="primary">导入</el-button>-->
    <!--      </el-upload>-->
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
      <el-table-column prop="id" label="订单编号" align="center" />
      <el-table-column prop="isDeleted" label="销售类型" align="center" />
      <el-table-column prop="supplierNo" label="订单金额" align="center" />
      <el-table-column prop="supplierType" label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag class="ml-2" type="success">{{
            scope.row.supplierType
          }}</el-tag>
        </template>
      </el-table-column>
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
            @click="handleDeleteData(scope.row)"
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
  getList,
  importExcel,
  delSupplier,
  saveOrUpdateSuppliers,
} from "@/api/contract/contractSupplier";
import {
  bomPurchaseOrder,
  purchaseOrder,
  licensePurchaseOrder,
  PurchaseOrderGetList,
  importExcelIMp,
  purchaseOrderDelete,
  bomPurchaseOrderDelete,
  licensePurchaseOrderDelete,
} from "@/api/contract/contractSellAdd";
import logsVue from "../util/logs.vue";
export default {
  data() {
    return {
      activeName: "bomPurchaseOrder",
      tableData: [],
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
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
  watch: {
    activeName: {
      handler(newVal, oldVal) {
        this.getContractSupplierList({});
      },
      immediate: true,
    },
  },
  methods: {
    getContractSupplierList(params) {
      const objOrder = {
        bomPurchaseOrder,
        purchaseOrder,
        licensePurchaseOrder,
      };
      objOrder[this.activeName](
        this.queryInfo.pageNum,
        this.queryInfo.pageSize,
        params
      ).then((res) => {
        this.tableData = res.data.data.records;
        this.queryInfo.total = res.data.data.total;
      });
    },
    beforeUpload(file) {
      importExcelIMp(file).then((res) => {
        if (res.data.success) {
          this.getContractSupplierList({});
          this.$message.success("导入成功");
        } else {
          this.$message.error("导入失败");
        }
      });
    },
    handleDeleteData(row) {
      let ids;
      if (row) {
        ids = row.id;
      } else {
        if (this.selectItems.length > 0) {
          ids = this.selectItems
            .map((contractSupplier) => contractSupplier.id)
            .join(",");
        } else {
          this.$message.error("至少选择一条数据!");
          return;
        }
      }
      const objOrder = {
        bomPurchaseOrder: bomPurchaseOrderDelete,
        purchaseOrder: purchaseOrderDelete,
        licensePurchaseOrder: licensePurchaseOrderDelete,
      };
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        objOrder[this.activeName](ids)
          .then((res) => {
            if (res.data.code == 0) {
              this.$message.success("删除成功");
              this.getContractSupplierList({});
            } else {
              this.$message.error(`删除失败,${res.data.msg}`);
            }
          })
          .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
          .finally(() => {});
      });
    },
    handleOpenDialog(row, type) {
      // 一般合同 contractGeneralBuyAdd
      // bom合同 contractBOMBuyAdd
      // License合同 contractLicenseAdd
      const pathObj = {
        bomPurchaseOrder: "/contractBOMBuyAdd",
        purchaseOrder: "/contractGeneralBuyAdd",
        licensePurchaseOrder: "/contractLicenseAdd",
      };
      console.log(row);
      const { id } = row;
      this.$router.push({
        path: pathObj[this.activeName],
        query: {
          type,
          id,
        },
      });
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
};
</script>

<style></style>
