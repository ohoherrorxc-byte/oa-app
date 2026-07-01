<template>
  <basic-container>
    <SearchForm
      :searchForm="searchForm"
      @handleSubmit="getContractSupplierList"
      @refresh="refresh"
    >
      <template #menuForm>
        <el-button
          v-if="!systemGroup()"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          style="margin-left: 10px"
          @click="handleOpenDialog('', 'create')"
          >{{ $t("commonContent.add") }}</el-button
        >
        <el-upload
          class="i-block ml10"
          action="#"
          :before-upload="beforeUpload"
          :limit="1"
        >
          <el-button
            v-if="!systemGroup()"
            icon="el-icon-plus"
            size="mini"
            type="primary"
            >{{ $t("commonContent.import") }}</el-button
          >
        </el-upload>
        <el-button
          v-if="!systemGroup()"
          icon="el-icon-delete"
          size="mini"
          type="danger"
          style="margin-left: 10px"
          plain
          @click="handleDeleteData('', 'littleDelete')"
          >{{ $t("commonContent.delete") }}</el-button
        >
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
        prop="applyTime"
        :label="$t('contractSupplier.applyDate')"
        align="center"
      />
      <el-table-column
        prop="supplierDesc"
        :label="$t('contractSupplier.supplierDesc')"
        align="center"
      />
      <el-table-column
        prop="supplierName"
        :label="$t('contractSupplier.supplierName')"
        align="center"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        prop="supplierNo"
        :label="$t('contractSupplier.supplierNo')"
        align="center"
      />
      <el-table-column
        prop="supplierType"
        :label="$t('contractSupplier.supplierType')"
        align="center"
        :formatter="supplierTypeFormatter"
      />
      <el-table-column
        prop="contactPerson"
        :label="$t('contractSupplier.contactPerson')"
        align="center"
      />
      <el-table-column
        prop="contactNumber"
        :label="$t('contractSupplier.contactNumber')"
        align="center"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        prop="openBank"
        :label="$t('contractSupplier.openBank')"
        align="center"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.supplierSettlementList[0].openBank }}
        </template>
      </el-table-column>
      <el-table-column
        prop="bankAccount"
        :label="$t('contractSupplier.bankAccount')"
        align="center"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.supplierSettlementList[0].bankAccount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('commonContent.status')"
        align="center"
        :formatter="supplierStatusFormatter"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        fixed="right"
        :label="$t('commonContent.operation')"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleOpenDialog(scope.row, 'detail')"
            type="text"
            icon="el-icon-view"
            >{{ $t("commonContent.view") }}</el-button
          >
          <el-button
            @click="handleOpenDialog(scope.row, 'edit')"
            type="text"
            icon="el-icon-edit"
            >{{ $t("commonContent.edit") }}</el-button
          >
          <el-button
            @click="(exchangeRate = true), (id = scope.row.id)"
            type="text"
            icon="el-icon-s-data"
            >{{ $t("commonContent.monthlyExchangeRate") }}</el-button
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
    <el-dialog
      :visible.sync="supplierDialogFormVisible"
      width="90%"
      append-to-body
      @close="editDialogClose"
    >
      <template slot="title">
        <div style="font-size: 15px">{{ dialogTitle }}</div>
      </template>
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-row>
          <el-card>
            <div slot="header">
              <span>{{ $t("contractSupplier.basicInformation") }}</span>
            </div>
            <el-col :span="12">
              <el-form-item prop="applyTime">
                <label slot="label"
                  >{{ $t("contractSupplier.applyDate") }}:</label
                >
                <el-date-picker
                  :disabled="disableBaseAndSettle"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="editForm.applyTime"
                  type="date"
                  placeholder="申请日期"
                >
                </el-date-picker>
                <!-- <el-input v-model="editForm.applyTime" autocomplete="off" :placeholder="isShowDetail ? '' : '申请日期'"
                  :disabled="isShowDetail"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="supplierDesc">
                <label slot="label"
                  >{{ $t("contractSupplier.supplierDesc") }}:</label
                >
                <el-select
                  v-model="editForm.supplierDesc"
                  :placeholder="isShowDetail ? '' : '供应商说明'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                >
                  <el-option
                    value="BOM框架供应商"
                    label="BOM框架供应商"
                  ></el-option>
                  <el-option
                    value="一般通用采购供应商"
                    label="一般通用采购供应商"
                  ></el-option>
                  <el-option
                    value="零星采购供应商"
                    label="零星采购供应商"
                  ></el-option>
                  <el-option value="其他" label="其他"></el-option>
                </el-select>
                <!-- <el-input
                  v-model="editForm.supplierDesc"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '供应商说明'"
                  :disabled="isShowDetail"
                ></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="supplierName">
                <label slot="label"
                  >{{ $t("contractSupplier.supplierName") }}:</label
                >
                <el-input
                  v-model="editForm.supplierName"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '供应商名称'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="supplierNo">
                <label slot="label"
                  >{{ $t("contractSupplier.supplierNo") }}:</label
                >
                <el-input
                  v-model="editForm.supplierNo"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '供应商编号'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="supplierType">
                <label slot="label"
                  >{{ $t("contractSupplier.supplierType") }}:</label
                >
                <el-select
                  v-model="editForm.supplierType"
                  multiple
                  :placeholder="isShowDetail ? '' : '供应商类型'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                  clearable
                >
                  <el-option
                    v-for="item in OptionsList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="status">
                <label slot="label">{{ $t("commonContent.status") }}:</label>
                <el-select
                  v-model="editForm.status"
                  :placeholder="isShowDetail ? '' : '状态'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                  clearable
                >
                  <el-option
                    v-for="item in OptionsListOne"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="contactPerson">
                <label slot="label"
                  >{{ $t("contractSupplier.contactPerson") }}:</label
                >
                <el-input
                  v-model="editForm.contactPerson"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '联系人'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="contactNumber">
                <label slot="label"
                  >{{ $t("contractSupplier.contactNumber") }}:</label
                >
                <el-input
                  v-model="editForm.contactNumber"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '联系电话'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="contactNumber">
                <label slot="label"
                  >{{ $t("contractSupplier.address") }}:</label
                >
                <el-input
                  v-model="editForm.address"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '地址'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="contactNumber">
                <label slot="label">{{ $t("other.remarks") }}:</label>
                <el-input
                  type="textarea"
                  v-model="editForm.remark"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '备注'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-card>
          <el-card>
            <div slot="header">
              <div class="flex-between">
                <div>计划员信息</div>
                <el-button
                  type="success"
                  @click="addPlanList"
                  icon="el-icon-plus"
                  circle
                ></el-button>
              </div>
            </div>
            <div>
              <el-table :data="editForm.planUserList" style="width: 100%">
                <el-table-column prop="planName" label="姓名">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.planName"
                      :disabled="isShowDetail"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="planEmail" label="邮箱">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.planEmail"
                      :disabled="isShowDetail"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="planPhone" label="电话">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.planPhone"
                      :disabled="isShowDetail"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="planPhone" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="deleteRow(scope.row)" type="text"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
          <div class="pt10">
            <el-button type="success" @click="addList">{{
              $t("commonContent.add")
            }}</el-button>
          </div>
          <el-card
            class="mt10"
            v-for="(item, index) in editForm.supplierSettlementList"
            :key="index"
          >
            <div slot="header">
              <div class="head-flex">
                <p>{{ $t("contractSupplier.settlementInformation") }}</p>
                <div>
                  <el-button
                    type="danger"
                    v-if="editForm.supplierSettlementList.length > 1"
                    @click="deleteList(item)"
                    >{{ $t("commonContent.delete") }}</el-button
                  >
                </div>
              </div>
            </div>
            <el-col :span="12">
              <el-form-item>
                <label slot="label"
                  ><span style="color: #f56c6c">*</span
                  >{{ $t("contractSupplier.openBank") }}:</label
                >
                <el-input
                  v-model="item.openBank"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '开户行'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <label slot="label"
                  ><span style="color: #f56c6c">*</span>
                  {{ $t("contractSupplier.bankAccount") }}:</label
                >
                <el-input
                  v-model="item.bankAccount"
                  autocomplete="off"
                  :placeholder="isShowDetail ? '' : '银行账号'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :key="index">
                <label slot="label">
                  <span style="color: #f56c6c">*</span>
                  {{ $t("contractSupplier.originalCurrency") }}:</label
                >
                <el-select
                  v-model="item.originalCurrency"
                  :placeholder="isShowDetail ? '' : '原币种'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                  @change="getRate(item)"
                >
                  <el-option
                    v-for="item in CurrencyList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <label slot="label">
                  <span style="color: #f56c6c">*</span>
                  {{ $t("contractSupplier.settlementCurrency") }}:</label
                >
                <el-select
                  v-model="item.settlementCurrency"
                  :placeholder="isShowDetail ? '' : '结算币种'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                  @change="getRate(item)"
                >
                  <el-option
                    v-for="item in CurrencyList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <label slot="label">
                  {{ $t("contractSupplier.dutyParagraph") }}:</label
                >
                <el-input
                  v-model="item.dutyParagraph"
                  :placeholder="isShowDetail ? '' : '税号'"
                  :disabled="isShowDetail || disableBaseAndSettle"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <label slot="label">
                  <span style="color: #f56c6c">*</span>
                  {{ $t("contractSupplier.exchangeRateMethod") }}:</label
                >
                <el-select
                  v-model="item.exchangeRateMethod"
                  :placeholder="isShowDetail ? '' : '汇率计算方式'"
                  :disabled="
                    isShowDetail ||
                    item.settlementCurrency === item.originalCurrency ||
                    disableBaseAndSettle
                  "
                >
                  <el-option
                    v-for="item in exchangeRateList"
                    :disabled="item.id === 1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-card>
        </el-row>
      </el-form>
      <template #footer v-if="!isShowDetail">
        <span class="dialog-footer">
          <el-button
            @click="supplierDialogFormVisible = false"
            size="mini"
            icon="el-icon-circle-close"
            >{{ $t("commonContent.cancel") }}</el-button
          >
          <el-button
            type="primary"
            @click="submitForm('editFormRef')"
            size="mini"
            icon="el-icon-circle-check"
            >{{ $t("commonContent.save") }}</el-button
          >
        </span>
      </template>
    </el-dialog>
    <ExchangeRate
      v-if="exchangeRate"
      :supplierId="id"
      @closeFn="exchangeRate = false"
    ></ExchangeRate>
  </basic-container>
</template>

<script>
import {
  getList,
  importExcel,
  delSupplier,
  saveOrUpdateSuppliers,
} from "@/api/contract/contractSupplier";
import constData from "@/config/constData";
import { getCurrency } from "@/api/contract/partsMaint";
import ExchangeRate from "./contractSupplier/exchangeRate.vue";
import { getFormatDate } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  components: {
    ExchangeRate,
  },
  data() {
    return {
      CurrencyList: [],
      originalCurrency: false,
      exchangeRate: false,
      searchForm: {
        column: [
          {
            label: this.$t("contractSupplier.supplierDesc"),
            prop: "supplierDesc",
          },
          {
            label: this.$t("contractSupplier.supplierName"),
            prop: "supplierName",
          },
          "supplierType",
        ],
      },
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
        planUserList: [
          {
            planName: "",
            planEmail: "",
          },
        ],
        supplierSettlementList: [
          {
            supplierId: null,
            openBank: null,
            bankAccount: null,
            originalCurrency: null,
            settlementCurrency: null,
            exchangeRateMethod: null,
          },
        ],
      },
      selectItems: [],
      OptionsList: constData.supplierType,
      exchangeRateList: constData.exchangeRateList,
      OptionsListOne: [
        {
          label: "合格",
          value: 1,
        },
        {
          label: "不合格",
          value: 2,
        },
      ],
      editFormRules: {
        supplierName: [
          {
            required: true,
            message: this.$t("contractSupplier.pleaseInputSupplierName"),
          },
        ],
        supplierType: [
          {
            required: true,
            message: "请填写供应商类型",
          },
        ],
        bankAccount: [
          {
            required: true,
            message: this.$t("contractSupplier.pleaseInputOpenBank"),
          },
        ],
        originalCurrency: [
          {
            required: true,
            message: this.$t("contractSupplier.pleaseSelectOriginalCurrency"),
            trigger: "change",
          },
        ],
        settlementCurrency: [
          {
            required: true,
            message: this.$t("contractSupplier.pleaseSelectSettlementCurrency"),
          },
        ],
        exchangeRateMethod: [
          {
            required: true,
            message: this.$t("contractSupplier.pleaseSelectExchangeRateMethod"),
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disableBaseAndSettle() {
      return (
        this.userInfo.account === "niuyinuo" ||
        this.userInfo.account === "xuyunting" ||
        this.userInfo.account === "jizhonghua"
      );
    },
  },
  methods: {
    systemGroup() {
      return (
        this.userInfo.account === "niuyinuo" ||
        this.userInfo.account === "xuyunting"
      );
    },
    deleteRow(row) {
      console.log(row);
      this.editForm.planUserList = this.editForm.planUserList.filter((ele) => {
        return ele !== row;
      });
    },
    getRate(item) {
      console.log(item);
      // const { originalCurrency, settlementCurrency } = this.editForm;
      if (!(item.originalCurrency || item.settlementCurrency)) return false;
      if (item.originalCurrency === item.settlementCurrency) {
        item.exchangeRateMethod = 1;
      } else {
        item.exchangeRateMethod = "";
      }
    },
    getCurrency(params) {
      getCurrency(params).then((res) => {
        this.CurrencyList = res.data.data;
      });
    },
    addPlanList() {
      this.editForm.planUserList.push({
        planEmail: null,
        planName: null,
        planPhone: null,
      });
    },
    refresh() {
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 10;
      this.getContractSupplierList({});
    },
    addList() {
      this.editForm.supplierSettlementList.push({
        supplierId: null,
        openBank: null,
        bankAccount: null,
        originalCurrency: null,
        settlementCurrency: null,
        exchangeRateMethod: null,
      });
    },
    deleteList(item) {
      this.editForm.supplierSettlementList =
        this.editForm.supplierSettlementList.filter((ele) => {
          return ele !== item;
        });
    },
    getContractSupplierList(params) {
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
          delSupplier(row.id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(`删除失败,${res.data.msg}`);
              }
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
          delSupplier(ids)
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
              this.getContractSupplierList();
            });
        });
      }
    },
    handleOpenDialog(row, type) {
      this.isShowDetail = false;
      switch (type) {
        case "detail":
          this.isShowDetail = true;
          this.dialogTitle = this.$t("contractSupplier.supplierView");
          this.setRowValue(row);
          break;
        case "edit":
          this.dialogTitle = this.$t("contractSupplier.supplierEdit");
          this.isAdd = false;
          this.setRowValue(row);
          break;
        case "create":
          this.dialogTitle = this.$t("contractSupplier.supplierAdd");
          this.isAdd = true;
          this.resetEditForm();
          break;
      }
      this.supplierDialogFormVisible = true;
    },
    resetEditForm() {
      this.originalCurrency = true;
      this.editForm = {
        applyTime: null,
        supplierDesc: null,
        supplierName: null,
        supplierNo: null,
        supplierType: [],
        status: null,
        contactPerson: null,
        contactNumber: null,
        planUserList: [
          {
            planName: "",
            planEmail: "",
          },
        ],
        supplierSettlementList: [
          {
            supplierId: null,
            openBank: null,
            bankAccount: null,
            originalCurrency: null,
            settlementCurrency: null,
            exchangeRateMethod: null,
          },
        ],
      };
    },
    setRowValue(row) {
      const { originalCurrency, settlementCurrency, exchangeRateMethod } = row;
      if (
        exchangeRateMethod === 1 &&
        originalCurrency === "CNY" &&
        settlementCurrency === "CNY"
      ) {
        this.originalCurrency = true;
      } else {
        this.originalCurrency = false;
      }
      this.editForm = row;
      if(this.editForm.supplierType&&!Array.isArray(this.editForm.supplierType)){
        this.editForm.supplierType = this.editForm.supplierType.split(",")
      }
      console.log(this.editForm);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSupplier();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addSupplier() {
      if (this.editForm.planUserList.length > 0) {
        this.editForm.planUserList = this.editForm.planUserList.filter(
          (ele) => {
            return ele.planEmail || ele.planName || ele.planPhone;
          }
        );
      }
      for (let row of this.editForm.supplierSettlementList) {
        console.log(row);
        if (!row.bankAccount) {
          this.$message.error(this.$t("contractSupplier.pleaseInputOpenBank"));
          return;
        } else if (!row.openBank) {
          this.$message.error(this.$t("contractSupplier.pleaseInputOpenBank"));
          return;
        } else if (!row.originalCurrency) {
          this.$message.error(
            this.$t("contractSupplier.pleaseSelectOriginalCurrency")
          );
          return;
        } else if (!row.settlementCurrency) {
          this.$message.error(
            this.$t("contractSupplier.pleaseSelectSettlementCurrency")
          );
          return;
        } else if (!row.exchangeRateMethod) {
          this.$message.error(
            this.$t("contractSupplier.pleaseSelectExchangeRateMethod")
          );
          return;
        }
      }
      if(this.editForm.supplierType&&this.editForm.supplierType.length>0){
        this.editForm.supplierType = this.editForm.supplierType.toString()
      }    
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
    supplierTypeFormatter(row) {
      switch (row.supplierType) {
        case "1":
          return "IT";
        case "2":
          return "代理";
        case "3":
          return "行政";
        case "4":
          return "项目咨询";
        case "5":
          return "制作";
        case "6":
          return "代理";
        case "7":
          return "工程";
        case "8":
          return "物流";
        case "9":
          return "培训";
        case "10":
          return "活动";
        case "11":
          return "生产";
        case "12":
          return "产品";
        case "13":
          return "人力";
        case "14":
          return "实验";
        default:
          return "Unknown";
      }
    },
    supplierStatusFormatter(row) {
      switch (row.status) {
        case 1:
          return "合格";
        case 2:
          return "不合格";
        default:
          return "Unknown";
      }
    },
  },
  created() {
    this.editForm.applyTime = getFormatDate();
    this.getContractSupplierList({});
    this.getCurrency({ code: "CURRENCY" });
  },
};
</script>

<style scoped>
.flex-between {
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
</style>

<style lang="scss" scoped>
.head-flex {
  display: flex;
  justify-content: space-between;
}
</style>
