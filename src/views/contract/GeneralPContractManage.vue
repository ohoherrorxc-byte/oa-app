<template>
  <basic-container>
    <SearchForm
      :searchForm="searchForm"
      @handleSubmit="handleSubmit"
      @refresh="refresh"
    >
      <template #menuForm="{ size }">
        <el-upload
          action="#"
          :before-upload="beforeUpload"
          :limit="1"
          style="margin-left: 10px; display: inline-block"
        >
          <el-button icon="el-icon-plus" :size="size" type="primary"
            >导入</el-button
          >
        </el-upload>
        <el-button
          icon="el-icon-delete"
          :size="size"
          type="danger"
          style="margin-left: 10px"
          plain
          @click="handleDeleteData('', 'littleDelete')"
          >删除</el-button
        >
      </template>
    </SearchForm>

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
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column
        prop="contractApplyDesc"
        label="BOM及框架合同申请说明"
        align="center"
      />
      <el-table-column
        prop="counterSignDepartment"
        label="会签部门"
        align="center"
      />
      <el-table-column
        prop="contractType"
        label="合同类型"
        align="center"
        :formatter="contractTypeFormatter"
      />
      <el-table-column prop="supplierName" label="供应商名称" align="center" />
      <el-table-column
        prop="payMethod"
        label="支付方式"
        align="center"
        :formatter="payMethodFormatter"
      />
      <el-table-column
        prop="contractPerformancePlace"
        label="合同履行地点"
        align="center"
      />

      <el-table-column
        prop="procurementCommitteeResolution"
        label="采购委员会决议单"
        align="center"
      />
      <el-table-column prop="attachUrl" label="相关附件" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column
        prop="applyAmountOriginal"
        label="已申请订单合计(原币)"
        align="center"
      />
      <el-table-column
        prop="applyAmountRmb"
        label="已申请订单合计(RMB)"
        align="center"
      />
      <el-table-column
        prop="payAmountOriginal"
        label="已付款金额合计(原币)"
        align="center"
      />
      <el-table-column
        prop="payAmountRmb"
        label="已付款金额合计(RMB)"
        align="center"
      />
      <el-table-column
        prop="cumulativeAcceptAmountOriginal"
        label="累计验收金额(原币)"
        align="center"
      />
      <el-table-column
        prop="cumulativeAcceptAmountRmb"
        label="累计验收金额(原币)"
        align="center"
      />
      <el-table-column prop="createTime" label="创建日期" align="center" />
      <el-table-column prop="contractName" label="合同名称" align="center" />
      <el-table-column prop="createUser" label="创建人" align="center" />
      <el-table-column prop="contractNo" label="合同编号" align="center" />
      <el-table-column
        prop="contractBeginTime"
        label="合同开始日期"
        align="center"
      />
      <el-table-column
        prop="contractEndTime"
        label="合同结束日期"
        align="center"
      />
      <el-table-column prop="currency" label="合同币别" align="center" />
      <el-table-column
        prop="contractCategory"
        label="合同类别"
        align="center"
      />
      <el-table-column prop="applyUser" label="申请人" align="center" />
      <el-table-column prop="applyDepartment" label="申请部门" align="center" />
      <el-table-column prop="applyTime" label="申请日期" align="center" />
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
          <!--<el-dropdown>-->
          <!--<span class="el-dropdown-link">-->
          <!--更多菜单<i class="el-icon-arrow-down el-icon--right"></i>-->
          <!--</span>-->
          <!-- <el-dropdown-menu slot="dropdown">-->
          <!--  <el-dropdown-item>查看</el-dropdown-item>-->
          <!--  <el-dropdown-item>编辑</el-dropdown-item>-->
          <!--  <el-dropdown-item>狮子头</el-dropdown-item>-->
          <!--  <el-dropdown-item>螺蛳粉</el-dropdown-item>-->
          <!--  <el-dropdown-item disabled>双皮奶</el-dropdown-item>-->
          <!--  <el-dropdown-item divided>蚵仔煎</el-dropdown-item>-->
          <!--</el-dropdown-menu>-->
          <!-- </el-dropdown>-->
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
  purchaseContractDelete,
} from "@/api/contract/GeneralPContractManage";
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
      searchForm: {
        column: [
          {
            label: "合同名称",
            props: "contractName",
          },
          "contractType",
          "supplierName",
        ],
      },
    };
  },
  methods: {
    handleSubmit(from) {
      this.getPurchaseContractList(from);
    },
    refresh(from) {
      this.queryInfo.pageNum = 1;
      this.getPurchaseContractList(from);
    },
    getPurchaseContractList(params) {
      getList(this.queryInfo.pageNum, this.queryInfo.pageSize, params).then(
        (res) => {
          this.tableData = res.data.data.records;
          this.queryInfo.total = res.data.data.total;
        }
      );
    },
    handleOpenDialog(row, type) {
      if (row.addType == 1) {
        this.$router.push({ path: "/contractBOMAdd", query: { id: row.id } });
      } else {
        this.$router.push({
          path: "/contractGeneralAdd",
          query: { id: row.id },
        });
      }
    },
    beforeUpload(file) {
      importExcel(file).then((res) => {
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
          purchaseContractDelete(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
              this.getPurchaseContractList({});
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.getPurchaseContractList({});
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
          purchaseContractDelete(ids)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
              this.getPurchaseContractList({});
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.selectItems = [];
              this.getPurchaseContractList({});
            });
        });
      }
    },
    // 表格多选
    handleSelectionChange(val) {
      this.selectItems = val;
    },
    contractTypeFormatter(row) {
      switch (row.contractType) {
        case 1:
          return "合资合作法律文件";
        case 2:
          return "重组改制法律文件";
        case 3:
          return "金融合同";
        case 4:
          return "采购合同(不包括房地产、知识产权类合同)";
        default:
          return "";
      }
    },
    payMethodFormatter(row) {
      switch (row.payMethod) {
        case 1:
          return "现金";
        case 2:
          return "转账";
        default:
          return "";
      }
    },
  },
  created() {
    this.getPurchaseContractList({});
  },
};
</script>

<style scoped></style>
