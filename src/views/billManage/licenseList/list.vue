<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page.sync="page" :search.sync="query"
      :permission="permissionList" :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate"
      @row-save="rowSave" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset"
      @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary" icon="el-icon-download" @click="handleExportAll">{{$t('commonContent.exportL')}}</el-button>
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
  importExcel,
  importExcelAdd,
  exportLicenseExcelAll
} from "@/api/billManage/activationDetails";
import constData from "@/config/constData";
import { mapGetters } from "vuex";
import { download } from "@/util/excel";
import { cleanParams, trimParams } from "@/util/util";

export default {
  components: {},
  data() {


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
            width: 150,
            overHidden: true,
            label: "VIN",
            prop: "vin",
            search: true,
            searchPlaceholder: "请输入",
            clearable: false,
          },
          {
            label: this.$t('activationDetails.countryRegin'),
            prop: "countryReginCode",
            search: true,
            searchPlaceholder: "请选择",
            type: "select",
            multiple: true,
            dicUrl: "/api/oa-system/dict/dictionary?code=COUNTRY_REGIN",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            change: ({ value }) => {
              this.regionCode = value.toString();
            },
          },
          {
            label: this.$t('activationDetails.series'),
            searchLabel: this.$t('activationDetails.series'),
            prop: "seriesName",
            searchSlot: true,
            search: true,
            width: 100,
            overHidden: true,
          },
          {
            label: this.$t('activationDetails.model'),
            prop: "modelName",
            width: 100,
            overHidden: true,
          },
          {
            label: this.$t('activationDetails.tboxActivationTime'),
            prop: "activationTime",
            type: "datetime",
            search: true,
            startPlaceholder: this.$t('commonContent.start'),
            endPlaceholder: this.$t('commonContent.end'),
            searchRange: true,
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row) => {
              return row.activationTime;
            },
            searchSpan: 12,
            searchOrder: 1,
            width: 150,
            overHidden: true,
          },
          {
            label: this.$t('activationDetails.mapActivatedTime'),
            prop: "mapActivatedTime",
            type: "datetime",
            search: true,
            startPlaceholder: this.$t('commonContent.start'),
            endPlaceholder: this.$t('commonContent.end'),
            searchRange: true,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            formatter: (row) => {
              return row.mapActivatedTime;
            },
            searchOrder: 2,
            searchSpan: 12,
            width: 150,
            overHidden: true,
          },
          {
            search: true,
            type: "select",
            label: this.$t('activationDetails.invoiceSituation'),
            prop: "invoiceSituation",
            width: 150,
            overHidden: true,
            dicUrl: "/api/oa-system/dict/dictionary?code=INVOICE_SITUATION",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
          },
          {
            search: true,
            type: "select",
            label: this.$t('activationDetails.abnormalStatus'),
            prop: "statisticStatus111",
            width: 150,
            overHidden: true,
            dicData: [
              {
                label: "未开票地图已激活",
                value: 0,
              },
            ],
          },
          {
            label: this.$t('activationDetails.avnActivateTime'),
            prop: "avnActivateTime",
            type: "datetime",
            width: 150,
            overHidden: true,
          },
          {
            search: true,
            type: "select",
            label: this.$t('activationDetails.relatedBom'),
            prop: "bomId",
            width: 150,
            overHidden: true,
            dicUrl: "/api/oa-portal/bomMaint/selectList",
            props: {
              label: "bomName",
              value: "id",
            },
            filterable: true
          },
          {
            search: true,
            type: "select",
            label: this.$t('activationDetails.bomType'),
            prop: "bomType",
            dicData: constData.bomType,
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
    beforeUpload(file) {
      importExcel(file).then((res) => {
        if (res.data.code == 0) {
          this.onLoad(this.page)
          this.$message.success(this.$t('commonContent.importSuccess'));
        } else {
          this.$message.error(this.$t('commonContent.importFailed'));
        }
      });
    },
    beforeUploadAdd(file) {
      importExcelAdd(file).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(this.$t('commonContent.importSuccess'));
        } else {
          this.$message.error(this.$t('commonContent.importFailed'));
        }
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
          this.onLoad(this.page, this.query);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
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

      const {
        activationTime,
        countryReginCode,
        ownerId,
        modelType,
        mapTransformedStatus,
        vin,
        shipmentDate,
        mapActivatedTime,
        departDate,
        arrivalDate,
        confirmDate
      } = params;
      //const {activationTime, countryReginCode, ownerId, modelType} = this.query;
      let values = {
        ...params,
        //...this.query,
      };
      if (shipmentDate) {
        values = {
          ...values,
          shipmentStartDate: shipmentDate[0],
          shipmentEndDate: shipmentDate[1],
        };
        values.shipmentDate = null;
      } else {
        values = {
          ...values,
          shipmentStartDate: "",
          shipmentEndDate: "",
        };
      }

      if (confirmDate) {
        values = {
          ...values,
          confirmStartDate: confirmDate[0],
          confirmEndDate: confirmDate[1],
        };
        values.confirmDate = null;
      } else {
        values = {
          ...values,
          confirmStartDate: "",
          confirmEndDate: "",
        };
      }

      if (arrivalDate) {
        values = {
          ...values,
          startArrivalDate: arrivalDate[0],
          endArrivalDate: arrivalDate[1],
        };
        values.shipmentDate = null;
      } else {
        values = {
          ...values,
          startArrivalDate: "",
          endArrivalDate: "",
        };
      }

      if (departDate) {
        values = {
          ...values,
          startDepartTime: departDate[0],
          endDepartTime: departDate[1],
        };
        values.shipmentDate = null;
      } else {
        values = {
          ...values,
          startDepartTime: "",
          endDepartTime: "",
        };
      }

      if (mapActivatedTime) {
        values = {
          ...values,
          mapActivatedStartTime: mapActivatedTime[0],
          mapActivatedEndTime: mapActivatedTime[1],
        };
        values.mapActivatedTime = null;
      } else {
        values = {
          ...values,
          mapActivatedStartTime: "",
          mapActivatedEndTime: "",
        };
      }
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
      

      !this.seriesModel.model || (values.seriesModel = this.seriesModel.model);

      return values;
    },
    handleExportAll() {
      const { countryReginCode, vin, orderIdTbox } = this.query;

      let values = this.getSearchValues(cleanParams(this.query));
      values.countryReginCode = values.countryReginCode + ''
      this.$confirm("导出数据？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return exportLicenseExcelAll(values);
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

      let values = this.getSearchValues(cleanParams(this.query));
      values.countryReginCode = values.countryReginCode.toString()
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

<style scoped lang="scss">
div::v-deep table {
  font-size: 14px;
}

div::v-deep th {
  text-align: center;
}

div::v-deep td {
  text-align: center;
}

div::v-deep input {
  padding-left: 6px;
}

::v-deep ep .avue-empty {
  text-align: left;
}
</style>
