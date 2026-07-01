<template>
  <basic-container>
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
        <el-button
          type="danger"
          icon="el-icon-delete"
          plain
          v-if="permission.vehicledataplans_delete"
          @click="handleDelete"
          >Delete
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
} from "@/api/portal/vehicledataplans";
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
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        labelWidth: 150,
        addBtnText: "Add",
        viewBtnText: "View",
        editBtnText: "Edit",
        delBtnText: "Delete",
        menuTitle: "Operation",
        emptyText: "No data",
        columnBtn: false,

        column: [
          {
            label: "Name",
            prop: "dataPlanName",
            rules: [
              {
                required: true,
                message: "Please input Name",
                trigger: "blur",
              },
              {
                pattern: /^.{2,100}$/,
                message: "Wrong name format!",
              },
            ],
            span: 24,
            //row: true,
          },
          {
            label: "Description",
            prop: "dataPlanDescription",
            type: "textarea",
            hide: true,
            span: 24,
            //row: true,
          },
          /*
            流量包类型：
            1 –基础包
            2 –加油包
            */
          {
            label: "Type",
            prop: "dataPlanType",
            type: "radio",
            dicData: [
              { value: 1, label: "Basic" },
              { value: 2, label: "Add-On" },
            ],
            value: 1,
          },
          {
            label: "Image",
            prop: "imageUrl",
            hide: true,
          },
          {
            label: "Price",
            prop: "price",
            rules: [
              {
                required: true,
                message: "Please input Price",
                trigger: "blur",
              },
              {
                pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
                message: "Wrong price format!",
              },
            ],
          },
          {
            label: "Currency",
            prop: "currency",
            placeholder: "ISO-4217, e.g. THB",
            //hide: true
          },
          {
            label: "Duration",
            prop: "duration",
            rules: [
              {
                required: true,
                message: "Please input Duration",
                trigger: "blur",
              },
              {
                pattern: /^([1-9][\d]{0,2})$/,
                message: "Wrong number format!",
              },
            ],
          },
          {
            label: "Duration Unit",
            prop: "durationUnit",
            type: "select",
            /*
              时长单位：
              1 –日
              2 –周
              3 –月
              4 –季
              5 –半年
              6 –年
              */
            dicData: [
              { value: 1, label: "Day" },
              { value: 2, label: "Week" },
              { value: 3, label: "Month" },
              { value: 4, label: "Season" },
              { value: 5, label: "Half-Year" },
              { value: 6, label: "Year" },
            ],
            value: 6,
            rules: [
              {
                required: true,
                message: "Please select Duration Unit",
                trigger: "blur",
              },
            ],
          },
          {
            label: "Amount",
            prop: "flowAmount",
            rules: [
              {
                required: true,
                message: "Please input Amount",
                trigger: "blur",
              },
              {
                pattern: /^([1-9][\d]{0,5})$/,
                message: "Wrong number format!",
              },
            ],
          },
          /*
            流量单位：
            1 – GB（默认）
            2 – MB
            */
          {
            label: "Unit",
            prop: "flowUnit",
            type: "radio",
            dicData: [
              { value: 1, label: "GB" },
              { value: 2, label: "MB" },
            ],
            value: 1,
          },
          /*
            流量有效期：
            1 –月（默认）
            2 –不限
            */
          {
            label: "Validity",
            prop: "flowValidity",
            type: "radio",
            dicData: [
              { value: 1, label: "Month" },
              { value: 2, label: "Unlimited" },
            ],
            value: 1,
          },
          {
            label: "Promotion Price",
            prop: "promotionPrice",
            hide: true,
          },
          {
            label: "Promotion Tips",
            prop: "promotionTips",
            hide: true,
            type: "textarea",
            span: 24,
          },
          {
            label: "Agreement",
            prop: "userAgreementUrl",
            prepend: "http://",
            hide: true,
          },
          /*
            流量包状态：
            0 – Unavailable
            1 – Available
            */
          {
            label: "Status",
            prop: "dataPlanStatus",
            type: "radio",
            dicData: [
              { value: 0, label: "Unavailable" },
              { value: 1, label: "Available" },
            ],
            value: 0,
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
        addBtn: this.vaildData(this.permission.vehicledataplans_add, false),
        viewBtn: this.vaildData(this.permission.vehicledataplans_view, false),
        delBtn: this.vaildData(this.permission.vehicledataplans_delete, false),
        editBtn: this.vaildData(this.permission.vehicledataplans_edit, false),
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
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "Success!",
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
            message: "Success!",
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
      this.$confirm("Confirm to delete?", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "Success!",
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("Please select at least one record");
        return;
      }
      this.$confirm("Confirm to delete selected records?", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "Success!",
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
        this.selectionClear();
      });
    },
  },
};
</script>

<style></style>
