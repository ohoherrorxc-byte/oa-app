<template>
  <basic-container>
    <avue-crud
      ref="crud"
      v-model="form"
      :before-open="beforeOpen"
      :data="data"
      :option="option"
      :page.sync="page"
      :permission="permissionList"
      :table-loading="loading"
      :cell-class-name="rowStyle"
      :header-cell-class-name="headStyle"
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
          v-if="permission.project_owner_delete"
          icon="el-icon-delete"
          plain
          type="danger"
          @click="handleDelete"
          >删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  add,
  getDetail,
  getList,
  remove,
  update,
} from "@/api/saic/projectowner";
import { mapGetters } from "vuex";
import constData from "@/config/constData";

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
        calcHeight: "auto",
        tip: false,
        align: "center",
        headerAlign: "center",
        menuAlign: "center",
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: true,
        selection: true,
        columnBtn: false,
        dialogClickModal: false,
        column: [
          {
            label: "国家地区",
            prop: "countryReginCode",
            type: "select",
            search: true,
            cascaderItem: ["seriesName"],
            cascaderChange: true,
            dicData: constData.countryList,
            rules: [
              {
                required: true,
                message: "请选择国家",
                trigger: "blur",
              },
            ],
          },
          {
            label: "车系",
            prop: "seriesName",
            dicUrl:
              "/api/oa-portal/licenseSeries/owner/getSeriesNames?countryReginCode={{key}}",
            search: true,
            type: "select",
            props: {
              label: "seriesName",
              value: "seriesName",
            },
            rules: [
              {
                required: true,
                message: "请选择车系",
                trigger: "blur",
              },
            ],
          },
          {
            label: "责任人",
            search: true,
            prop: "ownerId",
            type: "select",
            dicUrl: "/api/oa-portal/licenseSeries/owner/getOwners",

            props: {
              label: "owner",
              value: "id",
            },
            rules: [
              {
                required: true,
                message: "请选择项目负责人",
                trigger: "blur",
              },
            ],
          },
        ],
      },
      data: [],
    };
  },
  // created() {
  //   this.onLoad(this.page, this.query);
  //   this.initData();
  //
  // },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.project_owner_add, false),
        viewBtn: this.vaildData(this.permission.project_owner_view, false),
        delBtn: this.vaildData(this.permission.project_owner_delete, false),
        editBtn: this.vaildData(this.permission.project_owner_edit, false),
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
    headStyle() {
      return "cell-font";
    },

    rowStyle() {
      return "cell-font";
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
  // initData(params) {
  //   getSeriesNames(params).then(res => {
  //     this.seriesName = res.data.data;
  //   });
  // }
};
</script>

<style>
.cell-font {
  font-size: 15px;
}
</style>
