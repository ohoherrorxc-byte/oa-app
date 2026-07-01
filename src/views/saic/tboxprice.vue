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
      @row-save="rowSave"
      @row-del="rowDel"
      @row-update="rowUpdate"
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
          v-if="permission.tbox_price_delete"
          icon="el-icon-delete"
          plain
          type="danger"
          @click="handleDelete"
          >删 除
        </el-button>
      </template>
      <template slot="seriesNameSearch">
        <series-model v-model="seriesModel" :region="regionCode"></series-model>
      </template>
      <template slot="seriesModelDataForm">
        <series-model
          v-model="seriesModelData"
          :region="country"
          :empty="true"
        ></series-model>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { add, remove, getDetail, getList, update } from "@/api/saic/tboxprice";
import { mapGetters } from "vuex";
import SeriesModel from "@/views/saic/series-model";
import constData from "@/config/constData";

export default {
  components: { SeriesModel },
  data() {
    let validateModelData = (rule, value, callback) => {
      if (this.seriesModelData.data == null) {
        callback(new Error("请选择车系车型"));
      } else {
        callback();
      }
    };
    let priceFormatter = (row) => {
      if (row.currency == "0") {
        return "￥ " + row.price;
      } else if (row.currency == "1") return "$ " + row.price;
    };

    let timeFormatter = (row) => {
      if (row.validPeriodEnd != null) {
        return row.validPeriodBegin + "~" + row.validPeriodEnd;
      }
    };

    let columnFormatter = (a, b, c) => {
      if (b === -1) return "";
      else return c;
    };
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      regionCode: "",
      //初始化的时候只需绑定model，series会做相应的勾选
      seriesModel: { model: " " },
      seriesModelData: {},
      selectionList: [],
      country: "",
      option: {
        labelWidth: 100, //标签宽度
        searchLabelWidth: 120,
        searchSpan: 10,
        height: "auto",
        calcHeight: "auto",
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        align: "center",
        headerAlign: "center",
        border: true,
        index: false,
        viewBtn: false,
        columnBtn: false,
        selection: true,

        dialogClickModal: false,

        column: [
          {
            label: "国家地区",
            prop: "countryCode",
            type: "select",
            search: true,
            editDisplay: false,
            addDisplay: false,
            hide: true,
            dicData: constData.countryList,
            change: ({ value }) => {
              this.regionCode = value;
            },
            rules: [
              {
                required: true,
                message: "请选择国家",
                trigger: "blur",
              },
            ],
          },
          {
            label: "国家地区",
            width: 100,
            prop: "countryReginCode",
            type: "select",
            editDisabled: true,
            addDisplay: true,
            dicData: constData.countryList,
            change: ({ value }) => {
              this.country = value;
              this.seriesModelData.data = null;
            },
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
            searchLabel: "车系车型",
            prop: "seriesName",
            editDisabled: true,
            addDisplay: false,
            searchSlot: true,
            width: 100,
            search: true,
            rules: [
              {
                required: true,
                message: "车系车型",
                trigger: "blur",
              },
            ],
          },
          {
            label: "车系车型",
            prop: "seriesModelData",
            editDisplay: false,
            formslot: true,
            rules: [
              {
                required: true,
                validator: validateModelData,

                trigger: "blur",
              },
            ],
            hide: true,
            viewDisplay: false,
          },

          {
            label: "车型",
            prop: "modelName",
            width: 150,
            addDisplay: false,
            editDisabled: true,

            rules: [
              {
                required: true,
                message: "请选择国家",
                trigger: "blur",
              },
            ],
          },
          {
            label: "网联车类型",
            prop: "modelType",
            type: "select",
            addDisplay: false,
            editDisplay: false,

            search: true,
            width: "100",
            span: 50,
            searchLabel: "网联/非网联",

            dicData: [
              {
                label: "网联",
                value: 0,
              },
              {
                label: "Color Radio Lite",
                value: 1,
              },
              {
                label: "Color Radio",
                value: 2,
              },
            ],
            rules: [
              {
                required: true,
                message: "请选择网联车类型",
                trigger: "blur",
              },
            ],
            formatter: columnFormatter,
          },

          {
            label: "单价",
            prop: "price",
            addDisplay: true,
            width: 100,
            span: 8,
            // dataType: "number",
            // precision: 2,
            rules: [
              {
                required: true,
                trigger: "blur",
                validator: function (rule, value, callback) {
                  var passwordreg =
                    /(^[0-9]{1,6}$)|(^[0-9]{1,6}\.{1}[0-9]{1,2}$)/;
                  if (!value) {
                    callback(new Error("请输入单价"));
                  } else if (passwordreg.test(value) == false) {
                    callback(new Error("支持小数点前6位小数点后两位"));
                  } else {
                    callback();
                  }
                },
              },
            ],
            formatter: priceFormatter,
          },

          {
            label: "单价有效期",
            width: 180,
            prop: "validPeriodBegin1",
            editDisplay: false,
            addDisplay: false,
            formatter: timeFormatter,
          },

          {
            type: "select",
            dicData: [
              {
                label: "RMB",
                value: "0",
              },
              {
                label: "USD",
                value: "1",
              },
            ],
            span: 3,
            prop: "currency",
            placeholder: "币种",
            labelWidth: 0,
            viewDisplay: false,

            rules: [
              {
                required: true,
                message: "不能为空",
                trigger: "blur",
              },
            ],
            hide: true,
          },

          {
            label: "有效期",
            labelWidth: 130,
            prop: "validPeriodBegin",
            type: "date",
            addDisplay: true,
            viewDisplay: false,
            rules: [
              {
                required: true,
                message: "请选择开始时间",
                trigger: "blur",
              },
            ],
            valueFormat: "yyyy-MM-dd",
            hide: true,
          },

          {
            label: "有效期结束时间",
            labelWidth: 130,
            prop: "validPeriodEnd",
            viewDisplay: false,
            type: "date",
            addDisplay: false,
            editDisplay: false,
            valueFormat: "yyyy-MM-dd",
            hide: true,
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
        addBtn: this.vaildData(this.permission.tbox_price_add, false),
        viewBtn: this.vaildData(this.permission.tbox_price_view, false),
        delBtn: this.vaildData(this.permission.tbox_price_delete, false),
        editBtn: this.vaildData(this.permission.tbox_price_edit, false),
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
      !this.seriesModelData.data ||
        (row.seriesModelData = this.seriesModelData.data);

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
      row.seriesModelData = null;
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
      if (
        row.validPeriodBegin &&
        new Date(row.validPeriodBegin) <= new Date()
      ) {
        this.$message({ type: "warning", message: "已经在使用中不能删除!" });
        return;
      }
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
    //打开弹窗之前执行的方法
    beforeOpen(done, type) {
      if (["add"].includes(type)) {
        this.seriesModelData = {};
        this.form = {};
      }

      if (["edit"].includes(type)) {
        getDetail(this.form.id).then((res) => {
          this.form = res.data.data;
        });
        if (
          this.form.validPeriodBegin &&
          new Date(this.form.validPeriodBegin) <= new Date()
        ) {
          this.$message({ type: "warning", message: "已经在使用的不能编辑!" });
          return;
        }
      }
      done();
    },
    searchReset() {
      this.seriesModel = {};
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
      if (this.seriesModel.model != null)
        this.query.seriesModel = this.seriesModel.model;
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
<style>
.cell-font {
  font-size: 15px;
}
</style>
