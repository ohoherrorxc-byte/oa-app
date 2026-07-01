<template>
  <avue-crud
    :option="option"
    :table-loading="loading"
    :data="data"
    :page.sync="page"
    :permission="permissionList"
    :before-open="beforeOpen"
    v-model="form"
    ref="crud"
    @row-update="rowUpdate"
    @row-save="rowSave"
    @row-del="rowDel"
    @search-change="searchChange"
    @search-reset="searchReset"
    @selection-change="selectionChange"
    @current-change="currentChange"
    @size-change="sizeChange"
    @refresh-change="refreshChange"
    @on-load="onLoad"
  >
    <template slot="menuLeft">
      <!--<el-button type="warning"
                   
                   icon="el-icon-download"
                   plain
                   v-if="permission.fleetusertopupflow_export"
                   @click="handleExport">Export
        </el-button>-->
      <el-button
        type="warning"
        icon="el-icon-download"
        plain
        v-if="permission.fleetusertopupflow_export"
        @click="handleExportAll"
        >Export
      </el-button>
    </template>
    <template slot="finalAmount" slot-scope="{ row }">
      {{ parseFloat(row.totalAmount) + parseFloat(row.promotionAmount) }}
    </template>
    <template slot="totalAmountToSearchLabel"> - </template>
  </avue-crud>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  exportExcel,
  exportExcelAll,
} from "@/api/portal/fleetusertopupflow";
import { download } from "@/util/excel";
import { mapGetters } from "vuex";

export default {
  data() {
    const amountFormatter = (row, value, label, column) => {
      return parseFloat(eval("row." + column.prop)).toFixed(0);
    };
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        layout: "total, pager",
      },
      selectionList: [],
      option: {
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchLabelWidth: 100,
        searchMenuSpan: 1,
        border: true,
        index: false,
        indexLabel: "ID",
        emptyText: "No data",

        card: true,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        menu: false,
        emptyBtn: false,

        selection: false,
        columnBtn: false,
        dialogClickModal: false,
        rowKey: "id",
        reserveSelection: true,
        column: [
          {
            label: "Topup Time",
            prop: "createDate",
            type: "datetime",
            format: "HH:mm dd/MM/yyyy",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: "start",
            endPlaceholder: "end",
            search: true,
            searchRange: true,
          },
          {
            label: "Payment Method",
            prop: "paymentChannelId",
            dicData: [{ value: 2, label: "Thai QR" }],
          },
          /*{
              label: "User ID",
              prop: "userId",
            },*/
          {
            label: "Topup Amount",
            prop: "totalAmount",
            formatter: (row) => {
              return parseFloat(row.totalAmount).toFixed(0);
            },
          },
          {
            label: "Amount",
            prop: "totalAmountFrom",
            search: true,
            searchPlaceholder: "from",
            searchSpan: 4,
            hide: true,
          },
          {
            //label: "-",
            //searchLabel: "",
            prop: "totalAmountTo",
            search: true,
            searchPlaceholder: "to",
            searchLabelWidth: 15,
            searchSpan: 3,
            hide: true,
          },
          {
            label: "Promotion Amount",
            prop: "promotionAmount",
            formatter: amountFormatter,
          },
          {
            label: "Final Amount",
            prop: "finalAmount",
            //formatter: amountFormatter
            slot: true,
          },
          {
            label: "Order No.",
            prop: "id",
            search: true,
          },
          {
            label: "Topup Status",
            prop: "tradeStatus",
            dicData: [
              { value: "TRADE_SUCCESS", label: "Success" },
              { value: "WAIT_BUYER_PAY", label: "Failed" },
            ],
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.fleetusertopupflow_add, false),
        viewBtn: this.vaildData(this.permission.fleetusertopupflow_view, false),
        delBtn: this.vaildData(
          this.permission.fleetusertopupflow_delete,
          false
        ),
        editBtn: this.vaildData(this.permission.fleetusertopupflow_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    handleExport() {
      if (this.selectionList.length === 0) {
        this.$message.warning("Please check record!");
        return;
      }
      this.$confirm("Export checked records?", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          return exportExcel(this.ids);
        })
        .then((rsp) => {
          download(rsp);
        });
    },
    handleExportAll() {
      let values = this.getSearchValues({});

      this.$confirm("Export all records?", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          return exportExcelAll(values);
        })
        .then((rsp) => {
          download(rsp);
        });
    },
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          window.console.log(error);
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          console.log(error);
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then((res) => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    getSearchValues(params) {
      for (let i in this.query) {
        //避开数组，如时间范围
        if (!(this.query[i] instanceof Array)) {
          this.query[i] = this.query[i].trim();
        }
      }

      const { createDate, id, totalAmountFrom, totalAmountTo } = this.query;
      let values = {
        ...params,
      };
      if (createDate) {
        values = {
          ...params,
          "flow.createDate_datege": createDate[0],
          "flow.createDate_datele": createDate[1],
          ...this.query,
        };
        values.createDate = null;
      }
      if (id) {
        values = {
          ...values,
          "flow.id": id,
        };
        values.id = null;
      }
      if (totalAmountFrom) {
        values = {
          ...values,
          "flow.totalAmount_ge": totalAmountFrom,
        };
        values.totalAmountFrom = null;
      }
      if (totalAmountTo) {
        values = {
          ...values,
          "flow.totalAmount_le": totalAmountTo,
        };
        values.totalAmountTo = null;
      }

      return values;
    },
    onLoad(page, params = {}) {
      let values = this.getSearchValues(params);

      this.loading = true;
      getList(page.currentPage, page.pageSize, values).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        //this.selectionClear();
      });
    },
  },
};
</script>

<style scoped>
div ::v-deep table {
  font-size: 14px;
}
</style>
