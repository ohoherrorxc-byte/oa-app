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
      icon="el-icon-delete"
      size="mini"
      type="danger"
      style="margin-left: 10px"
      plain
      @click="handleDeleteData('', 'littleDelete')"
      >删除</el-button
    >
    <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      stripe
      align="center"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" />

      <el-table-column prop="contractName" label="合同名称" align="center" />
      <!--      <el-table-column prop="applyUser" label="申请人" align="center"/>-->
      <el-table-column prop="custContact" label="客户名称" align="center" />
      <el-table-column prop="relatedPro" label="相关项目" align="center" />
      <el-table-column
        prop="saleType"
        label="销售类型"
        align="center"
        :formatter="saleTypeFormatter"
      />
      <el-table-column
        prop="currency"
        label="币种"
        align="center"
        :formatter="currencyFormatter"
      />
      <el-table-column prop="exchangeRate" label="汇率" align="center" />
      <el-table-column
        prop="contractTotalAmount"
        label="合同总金额"
        align="center"
      />
      <el-table-column
        prop="amountTotalOriginal"
        label="金额合计(原币)"
        align="center"
      />
      <el-table-column
        prop="amountTotalRmb"
        label="金额合计(RMB)"
        align="center"
      />
      <el-table-column
        prop="invoicedAmount"
        label="已开票金额"
        align="center"
      />
      <el-table-column
        prop="unInvoicedAmount"
        label="未开票金额"
        align="center"
      />
      <el-table-column
        prop="implementationTime"
        label="合同实施时间"
        align="center"
      />

      <el-table-column fixed="right" label="操作" width="170" align="center">
        <template slot-scope="scope">
          <!--<el-button @click="handleOpenDialog(scope.row, 'detail')" type="text"  icon="el-icon-view">查看</el-button>-->
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
import { getMyList } from "@/api/contract/saleContractManage";
import {
  importExcelsaleContract,
  saleContractDelete,
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
      selectItems: [],
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
    };
  },
  methods: {
    getSaleContractList(params) {
      getMyList(
        this.userInfo.content.user_id,
        this.queryInfo.pageNum,
        this.queryInfo.pageSize,
        params
      ).then((res) => {
        console.log("res--->" + JSON.stringify(res));
        this.tableData = res.data.data.records;
        this.queryInfo.total = res.data.data.total;
      });
    },
    handleOpenDialog(row, type) {
      console.log("hh", row);
      this.$router.push({ path: "/contractSellAdd", query: { id: row.id } });
    },
    beforeUpload(file) {
      importExcelsaleContract(file).then((res) => {
        console.log("res--->" + JSON.stringify(res));
        if (res.data.code == 0) {
          this.getSaleContractList({});
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
          saleContractDelete(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
                this.getSaleContractList({});
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.getSaleContractList({});
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
          saleContractDelete(ids)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
                this.getSaleContractList({});
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
              this.getSaleContractList({});
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.selectItems = [];
              this.getSaleContractList({});
            });
        });
      }
    },
    // 表格多选
    handleSelectionChange(val) {
      this.selectItems = val;
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pageNum = currentPage;
      this.getSaleContractList({});
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getSaleContractList({});
    },
    saleTypeFormatter(row) {
      switch (row.saleType) {
        case 1:
          return "NRE";
        case 2:
          return "硬件";
        case 3:
          return "孵化";
        case 4:
          return "License";
        default:
          return "Unknown";
      }
    },
    currencyFormatter(row) {
      switch (row.currency) {
        case 1:
          return "CNY";
        case 2:
          return "USD";
        default:
          return "Unknown";
      }
    },
  },
  created() {
    this.getSaleContractList({});
  },
};
</script>

<style scoped></style>
