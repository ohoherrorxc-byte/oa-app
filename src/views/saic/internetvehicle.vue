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
      @row-update="rowUpdate"
      :cell-class-name="rowStyle"
      :header-cell-class-name="headStyle"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <!--      <template slot="menuLeft">-->
      <!--        <el-button v-if="permission.internet_vehicle_delete"-->
      <!--                   icon="el-icon-delete"-->
      <!--                   plain-->
      <!--                   -->
      <!--                   type="danger"-->
      <!--                   @click="handleDelete">删 除-->
      <!--        </el-button>-->
      <!--      </template>-->
      <template slot="seriesNameSearch">
        <series-model v-model="seriesModel" :region="regionCode"></series-model>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getDetail, getList, update } from "@/api/saic/internetvehicle";
import { mapGetters } from "vuex";
import SeriesModel from "@/views/saic/series-model";
import constData from "@/config/constData";

export default {
  components: { SeriesModel },
  data() {
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
      selectionList: [],
      option: {
        labelWidth: 170,
        searchLabelWidth: 160,
        searchSpan: 8,
        align: "center",
        menuAlign: "center",
        height: "auto",
        calcHeight: "auto",
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: true,
        addBtn: false,
        delBtn: false,
        columnBtn: false,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "国家地区",
            prop: "countryReginCode",
            editDisabled: true,
            type: "select",
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
            label: "国家地区",
            prop: "countryReginCodeSelect",
            type: "select",
            search: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
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
            label: "车系",
            searchLabel: "车系车型",
            prop: "seriesName",
            editDisabled: true,
            searchSlot: true,
            search: true,
            rules: [
              {
                required: true,
                message: "请选择国家",
                trigger: "blur",
              },
            ],
          },
          {
            label: "车型",
            prop: "modelName",
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
            prop: "modelTypeSelect",
            type: "select",
            search: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            hide: true,
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
              {
                label: "待确认",
                value: 3,
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
            label: "网联车类型",
            prop: "modelType",
            type: "select",
            addDisplay: true,
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
            control: (val, form) => {
              if (val === 1) {
                return {
                  isCrLite: {
                    display: true,
                  },
                };
              } else {
                form.isCrLite = "";
                return {
                  isCrLite: {
                    display: false,
                  },
                };
              }
            },
          },
          {
            label: "责任人",
            prop: "ownerId",
            type: "select",
            dicUrl: "/api/oa-portal/licenseSeries/owner/getOwners",
            props: {
              label: "owner",
              value: "id",
            },
            rules: [
              {
                required: false,
                message: "请选择",
                //trigger: "blur"
              },
            ],
            search: true,
            row: true,
          },
          {
            label: "TBOX是否统计",
            prop: "modelNeedStatisticsTbox",
            type: "select",
            dicData: constData.booleanValue,
            rules: [
              {
                required: true,
                message: "请选择",
                //trigger: "blur"
              },
            ],
            search: true,
            row: true,
            control: this.control,
          },
          {
            label: "语音是否统计",
            prop: "modelNeedStatisticsVoice",
            type: "select",
            dicData: constData.booleanValue,
            rules: [
              {
                required: true,
                message: "请选择",
                //trigger: "blur"
              },
            ],
            search: true,
            row: true,
          },
          {
            label: "天气是否统计",
            prop: "modelNeedStatisticsWeather",
            type: "select",
            dicData: constData.booleanValue,
            rules: [
              {
                required: true,
                message: "请选择",
                //trigger: "blur"
              },
            ],
            search: true,
            row: true,
          },
          {
            label: "地图导航/图资是否统计",
            prop: "modelNeedStatisticsMap",
            type: "select",
            dicData: constData.booleanValue,
            rules: [
              {
                required: true,
                message: "请选择",
                //trigger: "blur"
              },
            ],
            search: true,
            row: true,
          },
          {
            label: "是否带导航（CR Lite）",
            prop: "isCrLite",
            type: "select",
            display: false,
            dicData: constData.booleanValue,
            rules: [
              {
                required: true,
                message: "请选择",
                //trigger: "blur"
              },
            ],
            search: true,
            row: true,
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
        // addBtn: this.vaildData(this.permission.internet_vehicle_add, false),
        viewBtn: this.vaildData(this.permission.internet_vehicle_view, false),
        // delBtn: this.vaildData(this.permission.internet_vehicle_delete, false),
        editBtn: this.vaildData(this.permission.internet_vehicle_edit, false),
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
    // rowSave(row, done, loading) {
    //   add(row).then(() => {
    //     this.onLoad(this.page);
    //     this.$message({
    //       type: "success",
    //       message: "操作成功!"
    //     });
    //     done();
    //   }, error => {
    //     loading();
    //     window.console.log(error);
    //   });
    // },
    control(val, form) {
      //这里有需要的话可以将原始值存起来

      if (val === 0) {
        form.modelNeedStatisticsVoice = 0;
        form.modelNeedStatisticsWeather = 0;
        form.modelNeedStatisticsMap = 0;
        return {
          modelNeedStatisticsVoice: {
            disabled: true,
          },
          modelNeedStatisticsWeather: {
            disabled: true,
          },
          modelNeedStatisticsMap: {
            disabled: true,
          },
        };
      } else {
        return {
          modelNeedStatisticsVoice: {
            disabled: false,
          },
          modelNeedStatisticsWeather: {
            disabled: false,
          },
          modelNeedStatisticsMap: {
            disabled: false,
          },
        };
      }
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
    // rowDel(row) {
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       return remove(row.id);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //     });
    // },
    // handleDelete() {
    //   if (this.selectionList.length === 0) {
    //     this.$message.warning("请选择至少一条数据");
    //     return;
    //   }
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       return remove(this.ids);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //       this.$refs.crud.toggleSelection();
    //     });
    // },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        if (this.form.modelType && this.form.modelType == -1) {
          this.form.modelType = "";
        }
        //debugger
        getDetail(this.form.id).then((res) => {
          //debugger
          if (res.data.data.modelType && res.data.data.modelType == -1) {
            res.data.data.modelType = "";
          }
          this.form = res.data.data;
        });
        done();
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.seriesModel = {};
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
