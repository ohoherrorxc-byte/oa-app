<template>
  <basic-container>
    <avue-crud :option="option"
               :search.sync="search"
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
               @on-load="onLoad">
      <template slot="menuLeft">
<!--        <el-button type="primary"-->
<!--                   icon="el-icon-plus"-->
<!--                   size="small"-->
<!--                   @click="handleAdd">新 建-->
<!--        </el-button>-->
<!--        <el-button type="danger"-->
<!--                   size="small"-->
<!--                   icon="el-icon-delete"-->
<!--                   plain-->
<!--                   @click="handleDelete">删 除-->
<!--        </el-button>-->
<!--        <el-button type="warning"-->
<!--                   size="small"-->
<!--                   plain-->
<!--                   icon="el-icon-download"-->
<!--                   @click="handleExport">导 出-->
<!--        </el-button>-->
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/lightctrl/lightCtrlAreaDeviceMap";
  import option from "@/option/lightctrl/lightCtrlAreaDeviceMap";
  import {mapGetters} from "vuex";
  // import {exportBlob} from "@/api/common";
  // import {getToken} from '@/util/auth';
  // import {downloadXls} from "@/util/util";
  // import {dateNow} from "@/util/date";
  // import NProgress from 'nprogress';
  import 'nprogress/nprogress.css';
  import dayjs from "dayjs";

  export default {
    data() {
      return {
        form: {},
        query: {},
        search: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: option,
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.lightCtrlAreaDeviceMap_add, true),
          viewBtn: this.vaildData(this.permission.lightCtrlAreaDeviceMap_view, true),
          delBtn: this.vaildData(this.permission.lightCtrlAreaDeviceMap_delete, true),
          editBtn: this.vaildData(this.permission.lightCtrlAreaDeviceMap_edit, true)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleAdd(){
        this.$refs.crud.rowAdd();
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },

      // handleExport() {
      //   let downloadUrl = `/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/export-lightCtrlAreaDeviceMap?${this.website.tokenHeader}=${getToken()}`;
      //   // const {
      //   // } = this.query;
      //   let values = {
      //   };
      //   this.$confirm("是否导出数据?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }).then(() => {
      //     NProgress.start();
      //     exportBlob(downloadUrl, values).then(res => {
      //       downloadXls(res.data, `lightCtrlAreaDeviceMap${dateNow()}.xlsx`);
      //       NProgress.done();
      //     })
      //   });
      // },
      // beforeOpen(done, type) {
      //   if (["edit", "view"].includes(type)) {
      //     getDetail(this.form.id).then(res => {
      //       this.form = res.data.data;
      //     });
      //   }
      //   done();
      // },

      beforeOpen(done, type) {
        if (type === 'add') {
          this.form = {
            createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          };
        } else if (['edit', 'view'].includes(type)) {
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      // onLoad(page, params = {}) {
      onLoad(page) {
        this.loading = true;

        // const {
        // } = this.query;

        let values = {
        };

        getList(page.currentPage, page.pageSize, values).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
