<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      :search.sync="query"
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
      <template slot="seriesNameSearch">
        <series-model
          v-model="seriesModel"
          :region="regionCode"
          :empty="false"
          placeholder="请选择"
        ></series-model>
      </template>
      <template slot="needStatisticsTbox" slot-scope="{ row }">
        <!-- 当switch被禁用的时候，用tip显示原因：1.工程车（默认不统计，如果显示统计则是数据被手动修改了 2.非待开票） -->
        <el-tooltip
          class="item"
          effect="dark"
          open-delay="300"
          hide-after="1000"
          :content="row.isTestVehicle === 1 ? '工程车' : '非待开票'"
          placement="left"
          :disabled="!(row.statusTbox >= 3 || row.isTestVehicle === 1)"
        >
          <el-switch
            :value="row.needStatisticsTbox.toString()"
            active-value="1"
            inactive-value="0"
            :disabled="row.statusTbox >= 3 || row.isTestVehicle === 1"
            @change="switchStat($event, row)"
          ></el-switch>
        </el-tooltip>
      </template>
      <template slot="menuLeft">
        <el-button
          type="warning"
          icon="el-icon-download"
          plain
          @click="handleExportAll"
          >导出
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
  exportExcelAll,
} from "@/api/saic/license";
import constData from "@/config/constData";
import { mapGetters } from "vuex";
import SeriesModel from "@/views/saic/series-model";
import { download } from "@/util/excel";
import { cleanParams, trimParams } from "@/util/util";

export default {
  components: { SeriesModel },
  data() {
    let columnFormatter = (a, b, c, d) => {
      if (b === -1) return "";
      else return c;
    };

    return {
      form: {},
      firstIn: true,
      query: {},
      regionCode: "",
      //初始化的时候只需绑定model，series会做相应的勾选
      seriesModel: { model: "" },
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        //height:'auto',
        //calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        menu: false,
        selection: false,
        addBtn: false,
        columnBtn: false,
        emptyBtn: false,
        searchLabelWidth: 110,
        dialogClickModal: false,
        column: [
          {
            label: "VIN",
            prop: "vin",
            search: true,
            searchPlaceholder: "请输入",
            searchOrder: 1,
            clearable: false,
          },
          {
            label: "国家地区",
            prop: "countryReginCode",
            search: true,
            searchPlaceholder: "请选择",
            searchOrder: 2,
            type: "select",
            dicData: constData.countryList,
            change: ({ value }) => {
              this.regionCode = value;
            },
          },
          {
            label: "车系",
            searchLabel: "车系车型",
            prop: "seriesName",
            searchSlot: true,
            search: true,
          },
          {
            label: "车型",
            prop: "modelName",
          },
          {
            label: "TBOX激活时间",
            prop: "activationTime",
            type: "datetime",
            search: true,
            startPlaceholder: "开始",
            endPlaceholder: "结束",
            searchRange: true,
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row) => {
              return row.activationTime;
            },
            searchSpan: 12,
            searchOrder: 3,
          },
          {
            label: "AVN激活时间",
            prop: "avnActivateTime",
            type: "datetime",
          },
          {
            label: "收款状态",
            prop: "statusTbox",
            search: true,
            searchPlaceholder: "请选择",
            type: "select",
            dicData: constData.orderStatus,
            formatter: columnFormatter,
          },
          {
            label: "收款订单号",
            prop: "orderIdTbox",
            search: true,
            searchPlaceholder: "请输入",
            formatter: (a, b, c, d) => {
              //待开票不显示订单号
              if (a.statusTbox === 2) return "";
              return columnFormatter(a, b, c, d);
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
            //dataType: "number",

            search: true,
            searchPlaceholder: "请选择",
            formatter: columnFormatter,
          },
          {
            label: "网联/非网联",
            prop: "modelType",
            type: "select",
            dicData: constData.modelType,
            search: true,
            searchPlaceholder: "请选择",
            formatter: (a, b, c, d) => {
              if (a.modelType === 3) return "";
              return columnFormatter(a, b, c, d);
            },
          },
          {
            label: "车辆是否统计",
            prop: "needStatisticsTbox",
            type: "select",
            dicData: constData.booleanValue,
            search: true,
            searchPlaceholder: "请选择",
            searchValue: 1,
            slot: true,
          },
          {
            label: "车型是否统计",
            prop: "modelNeedStatisticsTbox",
            type: "select",
            dicData: constData.booleanValue,
            search: true,
            searchPlaceholder: "请选择",
            searchValue: 1,
          },
        ],
      },
      data: [],
    };
  },
  created() {
    this.query.orderIdTbox = this.$route.query.orderIdTbox;
    // this.query.countryReginCode = this.$route.query.countryReginCode;
    // this.query.statusTbox = isNaN(this.$route.query.statusTbox) ? '' : parseInt(this.$route.query.statusTbox);
    //this.onLoad(this.page, this.query);
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.license_add, false),
        viewBtn: this.vaildData(this.permission.license_view, false),
        delBtn: this.vaildData(this.permission.license_delete, false),
        editBtn: this.vaildData(this.permission.license_edit, false),
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
    switchStat(value, row) {
      let msg = `车辆 ${row.vin} 是否${
        parseInt(value) ? "加入" : "取消"
      }统计？`;
      this.$confirm(msg, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          row.needStatisticsTbox = parseInt(value);
          this.rowUpdate(
            row,
            null,
            () => {},
            () => {}
          );
        })
        .catch(() => {});
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
          this.onLoad(this.page, this.query);
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
      this.seriesModel.model = "";
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      const { countryReginCode, vin, orderIdTbox } = params;
      if (!countryReginCode && !vin && !orderIdTbox) {
        this.$message.warning("国家地区 / VIN 必须选择其中一项！");
        done();
        return;
      }
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
      trimParams(params);

      const { activationTime, countryReginCode, ownerId, modelType } = params;
      //const {activationTime, countryReginCode, ownerId, modelType} = this.query;
      let values = {
        ...params,
        //...this.query,
      };

      if (activationTime) {
        values = {
          ...values,
          activationTime_datege: activationTime[0],
          activationTime_datelt: activationTime[1].replace(
            "00:00:00",
            "23:59:59"
          ),
        };
        values.activationTime = null;
      }
      if (countryReginCode) {
        values = {
          ...values,
          "l.countryReginCode": countryReginCode,
        };
        values.countryReginCode = null;
      }
      if (ownerId) {
        values = {
          ...values,
          "ls2.ownerId": ownerId,
        };
        values.ownerId = null;
      }
      //注意0
      if (modelType >= 0) {
        values = {
          ...values,
          "ls2.modelType": modelType,
        };
        values.modelType = null;
      }

      !this.seriesModel.model || (values.seriesModel = this.seriesModel.model);

      return values;
    },
    handleExportAll() {
      const { countryReginCode, vin, orderIdTbox } = this.query;
      if (!countryReginCode && !vin && !orderIdTbox) {
        this.$message.warning("国家地区 / VIN 必须选择其中一项！");
        return;
      }

      let values = this.getSearchValues(cleanParams(this.query));

      this.$confirm("导出数据？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return exportExcelAll(values);
        })
        .then((rsp) => {
          download(rsp);
        });
    },
    onLoad(page, params = {}) {
      //首次进入不加载数据
      if (this.firstIn) {
        this.firstIn = false;
        return;
      }
      console.log(this.query);

      let values = this.getSearchValues(cleanParams(this.query));

      this.loading = true;
      getList(page.currentPage, page.pageSize, values).then((res) => {
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

<style scoped>
div ::v-deep table {
  font-size: 14px;
}
div ::v-deep th {
  text-align: center;
}
div ::v-deep td {
  text-align: center;
}
div ::v-deep input {
  padding-left: 6px;
}
</style>
