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
          v-if="permission.serviceoption_delete"
          @click="handleDelete"
          >Delete
        </el-button>
      </template>
      <!--<template slot-scope="{row}" slot="durationUnit">
        <el-tag>{{row.durationUnit}}</el-tag>
      </template>-->
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
} from "@/api/portal/serviceoption";
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
        excelBtn: false,

        column: [
          {
            label: "Option Name",
            prop: "optionName",
            span: 24,
            rules: [
              {
                required: true,
                message: "Please input Option Name",
                trigger: "blur",
              },
            ],
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
            ],
          },
          {
            label: "Promotion Price",
            prop: "promotionPrice",
            rules: [
              {
                required: true,
                message: "Please input Promotion Price",
                trigger: "blur",
              },
            ],
          },
          {
            label: "Promotion Tips",
            prop: "promotionTips",
            type: "textarea",
            span: 24,
            hide: true,
            rules: [
              {
                required: true,
                message: "Please input Promotion Tips",
                trigger: "blur",
              },
            ],
          },
          {
            label: "Currency",
            prop: "currency",
            row: true,
            rules: [
              {
                required: true,
                message: "Please input Currency",
                trigger: "blur",
              },
            ],
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
            ],
          },
          {
            label: "Duration Unit",
            prop: "durationUnit",
            type: "select",
            //slot: true,
            dicData: [
              { label: "day", value: 1 },
              { label: "week", value: 2 },
              { label: "month", value: 3 },
              { label: "season", value: 4 },
              { label: "half year", value: 5 },
              { label: "year", value: 6 },
            ],
            rules: [
              {
                required: true,
                message: "Please select Duration Unit",
                trigger: "blur",
              },
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
        addBtn: this.vaildData(this.permission.serviceoption_add, false),
        viewBtn: this.vaildData(this.permission.serviceoption_view, false),
        delBtn: this.vaildData(this.permission.serviceoption_delete, false),
        editBtn: this.vaildData(this.permission.serviceoption_edit, false),
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
