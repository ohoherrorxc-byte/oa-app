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
    @search-change="searchChange"
    @search-reset="searchReset"
    @selection-change="selectionChange"
    @current-change="currentChange"
    @size-change="sizeChange"
    @refresh-change="refreshChange"
    @on-load="onLoad"
  >
    <template slot="menuLeft">
      <el-button
        type="warning"
        icon="el-icon-download"
        plain
        v-if="permission.vehicleservicesubflow_export"
        @click="handleExport"
        >Export
      </el-button>
    </template>
  </avue-crud>
</template>

<script>
import {
  getList,
  getDetail,
  exportExcel,
} from "@/api/portal/vehicleservicesubflow";
import { download } from "@/util/excel";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchMenuSpan: 6,
        border: true,
        index: false,
        card: true,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        menu: false,
        selection: true,
        dialogClickModal: false,
        excelBtn: false,
        columnBtn: false,
        rowKey: "id",
        reserveSelection: true,
        emptyText: "No data",

        column: [
          {
            label: "Uid",
            prop: "userId",
            search: true,
          },
          {
            label: "Vin",
            prop: "vin",
            search: true,
            width: 140,
          },
          {
            label: "Package",
            prop: "packageName",
          },
          {
            label: "Top-up option",
            prop: "optionName",
          },
          {
            label: "Payment channel",
            prop: "channelName",
          },
          {
            label: "Trade status",
            prop: "tradeStatus",
          },
          {
            label: "Amount",
            prop: "amount",
          },
          {
            label: "Promotion amount",
            prop: "promotionAmount",
            width: 140,
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
        /*addBtn: this.vaildData(this.permission.vehicleservicesubflow_add, false),
          viewBtn: this.vaildData(this.permission.vehicleservicesubflow_view, false),
          delBtn: this.vaildData(this.permission.vehicleservicesubflow_delete, false),
          editBtn: this.vaildData(this.permission.vehicleservicesubflow_edit, false)*/
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
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
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

<style></style>
