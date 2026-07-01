<template>
  <basic-container>
    <avue-form :option="option" @submit="handleSubmit" ref="form">
      <template slot="menuForm" class="flex">
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="handleOpenDialog({}, 'add')">新增</el-button>
        <el-upload
          class="ml10"
          action="#"
          :before-upload="beforeUpload"
          :limit="1"
          style="display: inline-block"
        >
          <el-button icon="el-icon-plus" type="primary">导入</el-button>
        </el-upload>
        <el-button
          type="primary"
          class="ml10"
          :size="size"
          icon="el-icon-download"
          @click="handleExportAll"
        >导出</el-button>
        <el-button
          class="ml10"
          icon="el-icon-delete"
          type="danger"
          plain
          @click="handleDeleteData('', 'littleDelete')"
        >删除</el-button>
      </template>
    </avue-form>
    <!--表格-->
    <el-table
      v-sticky="{ top: 0, parent: '#avue-view' }"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      stripe
      align="center"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" />

      <el-table-column
        prop="contractName"
        label="合同名称"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <!--      <el-table-column prop="applyUser" label="申请人" align="center"/>-->
      <el-table-column
        prop="custName"
        label="客户名称"
        align="center"
        width="150px"
        show-overflow-tooltip
      />
      <el-table-column
        prop="projectName"
        label="相关项目"
        align="center"
        width="150px"
        show-overflow-tooltip
      />
      <el-table-column prop="saleType" label="销售类型" align="center" :formatter="saleTypeFormatter" />
      <el-table-column prop="modelName" label="车型名称 " align="center" />
      <el-table-column prop="unit" label="单位" align="center" />
      <el-table-column prop="unitPrice" label="单价" align="center" />
      <el-table-column prop="amount" label="数量" align="center" />
      <el-table-column prop="taxRate" label="税率" align="center" />
      <el-table-column prop="currency" label="币种" align="center" />
      <el-table-column prop="exchangeRate" label="汇率" align="center" />
      <el-table-column prop="amountTotalOriginal" label="金额合计(原币)" align="center" />
      <el-table-column prop="amountTotalRmb" label="金额合计(RMB)" align="center" />
      <el-table-column prop="invoicedAmount" label="已开票金额" align="center" />
      <el-table-column prop="unInvoicedAmount" label="未开票金额" align="center" />
      <el-table-column prop="implementationTime" label="合同实施时间" align="center" />

      <el-table-column fixed="right" label="操作" width="170" align="center">
        <template slot-scope="scope">
          <!--<el-button @click="handleOpenDialog(scope.row, 'detail')" type="text"  icon="el-icon-view">查看</el-button>-->
          <el-button @click="handleOpenDialog(scope.row, 'edit')" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button
            @click="handleDeleteData(scope.row, 'delete')"
            type="text"
            icon="el-icon-delete"
          >删除</el-button>
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
import { getList } from "@/api/contract/saleContractManage";
import {
  importExcelsaleContract,
  saleContractDelete,
  exportExcelAll,
} from "@/api/contract/contractSellAdd";
import { download } from "@/util/excel";
export default {
  data() {
    return {
      form: {},
      option: {
        size: "mini",
        span: 6,
        menuPosition: "left",
        submitText: "搜索",
        submitIcon: "el-icon-search",
        emptyBtn: false,
        column: [
          {
            label: "合同名称",
            prop: "contractName",
            type: "input",
          },
          {
            type: "select",
            label: "相关项目",
            prop: "projectId",
            allowCreate: true,
            filterable: true,
            dicUrl: `/api/oa-portal/contractProject/selectList`,
            props: {
              label: "projectName",
              value: "id",
            },
          },
          {
            type: "select",
            label: "销售类型",
            prop: "saleType",
            allowCreate: true,
            filterable: true,
            dicUrl: "/api/oa-system/dict/dictionary?code=SALE_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
          },
          {
            type: "select",
            label: "车型名称",
            allowCreate: true,
            filterable: true,
            prop: "modelId",
            dicUrl: "/api/oa-portal/contractLicenseSeries/selectList",
            props: {
              label: "modelName",
              value: "id",
            },
          },
        ],
      },
      tableData: [],
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      selectItems: [],
    };
  },
  methods: {
    handleSubmit(form, done) {
      this.queryInfo.pageNum = 1;
      done();
      this.getSaleContractList(form);
    },
    refresh() {
      this.$refs.form.resetForm();
      this.queryInfo.pageNum = 1;
      this.getSaleContractList({});
    },
    getSaleContractList(params) {
      getList({
        current: this.queryInfo.pageNum,
        size: this.queryInfo.pageSize,
        ...params,
      }).then((res) => {
        this.tableData = res.data.data.records;
        this.queryInfo.total = res.data.data.total;
      });
    },
    handleOpenDialog(row) {
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
    handleExportAll() {
      this.$confirm("导出数据？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return exportExcelAll();
        })
        .then((rsp) => {
          download(rsp);
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
          return "License";
        case 4:
          return "孵化";
        default:
          return "-";
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
