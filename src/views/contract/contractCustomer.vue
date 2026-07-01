<template>
  <basic-container>
    <SearchForm :searchForm="searchForm" @handleSubmit="getContractCustomerList" @refresh="refresh">
      <template #menuForm>
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          style="margin-left: 10px"
          @click="goto"
        >{{ $t('commonContent.add') }}</el-button>
        <el-upload class="i-block ml10" action="#" :before-upload="beforeUpload" :limit="1">
          <el-button icon="el-icon-plus" size="mini" type="primary">{{ $t('commonContent.import') }}</el-button>
        </el-upload>
        <el-button
          icon="el-icon-delete"
          size="mini"
          type="danger"
          style="margin-left: 10px"
          plain
          @click="handleDeleteData('', 'littleDelete')"
        >{{ $t('commonContent.delete') }}</el-button>
      </template>
    </SearchForm>

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
        prop="custName"
        :label="$t('contractCustomer.customerName')"
        align="center"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column prop="custNo" :label="$t('contractCustomer.customerNo')" align="center" />
      <el-table-column prop="region" :label="$t('contractCustomer.countryReginCode')" align="center" />
      <el-table-column prop="industry" :label="$t('contractCustomer.industry')" align="center" />
      <el-table-column prop="custGrade" :label="$t('contractCustomer.customerGrade')" align="center" />
      <el-table-column
        prop="openBank"
        :label="$t('contractCustomer.openBank')"
        align="center"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column prop="bankAccount" :label="$t('contractCustomer.bankAccount')" align="center" />
      <el-table-column
        prop="custAddr"
        :label="$t('contractCustomer.customerAddr')"
        align="center"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column prop="taxpayerIdentityNumber" :label="$t('contractCustomer.taxpayerIdentityNumber')" align="center" />
      <el-table-column fixed="right" label="操作" width="170" align="center">
        <template slot-scope="scope">
          <el-button @click="gotolog(scope.row, 'detail')" type="text" icon="el-icon-view">{{ $t('commonContent.view') }}</el-button>
          <el-button @click="gotolog(scope.row, 'edit')" type="text" icon="el-icon-edit">{{ $t('commonContent.edit') }}</el-button>
          <el-button
            @click="handleDeleteData(scope.row, 'delete')"
            type="text"
            icon="el-icon-delete"
          >{{ $t('commonContent.delete') }}</el-button>
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
    <el-dialog :visible.sync="customerDialogFormVisible" append-to-body @close="editDialogClose">
      <template slot="title">
        <div style="font-size: 15px">{{ dialogTitle }}</div>
      </template>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" class="demo-ruleForm">
        <el-row>
          <el-form-item prop="custName">
            <label slot="label">{{ $t('contractCustomer.customerName') }}:</label>
            <br />
            <el-input
              v-model="editForm.custName"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '客户名称'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="custNo">
            <label slot="label">{{ $t('contractCustomer.customerNo') }}:</label>
            <br />
            <el-input
              v-model="editForm.custNo"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '客户编号'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="region">
            <label slot="label">{{ $t('contractCustomer.countryReginCode') }}:</label>
            <br />
            <el-input
              v-model="editForm.region"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '所在区域'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="industry">
            <label slot="label">{{ $t('contractCustomer.industry') }}:</label>
            <br />
            <el-input
              v-model="editForm.industry"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '所属行业'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="custGrade">
            <label slot="label">{{ $t('contractCustomer.customerGrade') }}:</label>
            <br />
            <el-input
              v-model="editForm.custGrade"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '客户等级'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="bankAccount">
            <label slot="label">{{ $t('contractCustomer.openBank') }}:</label>
            <br />
            <el-input
              v-model="editForm.bankAccount"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '开户银行'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="custAddr">
            <label slot="label">{{ $t('contractCustomer.customerAddr') }}:</label>
            <br />
            <el-input
              v-model="editForm.custAddr"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '客户地址'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="taxpayerIdentityNumber">
            <label slot="label">{{ $t('contractCustomer.taxpayerIdentityNumber') }}:</label>
            <br />
            <el-input
              v-model="editForm.taxpayerIdentityNumber"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '纳税人识别号'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer v-if="!isShowDetail">
        <span class="dialog-footer">
          <el-button
            @click="customerDialogFormVisible = false"
            size="mini"
            icon="el-icon-circle-close"
          >{{ $t('commonContent.cancel') }}</el-button>
          <el-button type="primary" @click="addCustomer" size="mini" icon="el-icon-circle-check">{{ $t('commonContent.save') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  importExcel,
  delCust,
  saveOrUpdateCust,
} from "@/api/contract/contractCustomer";
export default {
  data() {
    return {
      searchForm: {
        column: [
          {
            label: this.$t('contractCustomer.customerName'),
            prop: "custName",
          },
          "countryReginCode",
        ],
      },
      tableData: [],
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      customerDialogFormVisible: false,
      dialogTitle: "",
      isShowDetail: false,
      editForm: {
        id: "",
        custName: "",
        custNo: "",
        region: "",
        industry: "",
        custGrade: "",
        openBank: "",
        bankAccount: "",
        custAddr: "",
        taxpayerIdentityNumber: "",
      },
      selectItems: [],
    };
  },
  methods: {
    refresh(params) {
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 10;
      this.getContractCustomerList(params);
    },
    getContractCustomerList(params) {
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
          this.getContractCustomerList({});
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
          delCust(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
            })
            .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
            .finally(() => {
              this.getContractCustomerList({});
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
            (contractCustomer) => contractCustomer.id
          );
          ids = ids.join(",");
          delCust(ids)
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
              this.getContractCustomerList();
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
      this.customerDialogFormVisible = true;
    },
    goto() {
      this.$router.push({ path: "/contractCustomerAdd" });
    },
    gotolog(row, type) {
      console.log("hh", row);
      this.$router.push({
        path: "/contractCustomerAdd",
        query: { id: row.id },
      });
    },
    resetEditForm() {
      this.editForm.id = "";
      this.editForm.custName = "";
      this.editForm.custNo = "";
      this.editForm.region = "";
      this.editForm.industry = "";
      this.editForm.custGrade = "";
      this.editForm.openBank = "";
      this.editForm.bankAccount = "";
      this.editForm.custAddr = "";
      this.editForm.taxpayerIdentityNumber = "";
    },
    setRowValue(row) {
      console.log("row-->" + JSON.stringify(row));
      this.editForm.id = row.id;
      this.editForm.custName = row.custName;
      this.editForm.custNo = row.custNo;
      this.editForm.region = row.region;
      this.editForm.industry = row.industry;
      this.editForm.custGrade = row.custGrade;
      this.editForm.openBank = row.openBank;
      this.editForm.bankAccount = row.bankAccount;
      this.editForm.custAddr = row.custAddr;
      this.editForm.taxpayerIdentityNumber = row.taxpayerIdentityNumber;
    },
    addCustomer() {
      if (this.isAdd) {
        saveOrUpdateCust(this.editForm)
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
            this.getContractCustomerList({});
            this.customerDialogFormVisible = false;
          });
      } else {
        saveOrUpdateCust(this.editForm)
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
            this.getContractCustomerList({});
            this.customerDialogFormVisible = false;
          });
      }
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pageNum = currentPage;
      this.getContractCustomerList({});
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getContractCustomerList({});
    },
    // 表格多选
    handleSelectionChange(val) {
      this.selectItems = val;
    },
  },
  created() {
    this.getContractCustomerList({});
  },
};
</script>

<style scoped></style>
