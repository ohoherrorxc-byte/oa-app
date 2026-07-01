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
      <el-button
        type="danger"
        icon="el-icon-delete"
        plain
        v-if="permission.servicesubpackage_delete"
        @click="handleDelete"
        >Delete
      </el-button>
      <el-button
        type="warning"
        icon="el-icon-download"
        plain
        v-if="permission.servicesubpackage_export"
        @click="handleExport"
        >Export
      </el-button>
    </template>
    <template slot-scope="{ row }" slot="status">
      <el-tag class="custom-tag">{{ convertAvailability(row.status) }}</el-tag>
    </template>
    <template slot-scope="{ row }" slot="functionCascader">
      <!--<div v-for="item in convertCascader(row.functionCascader)">
          <el-tag>{{item}}</el-tag>
        </div>-->
      <!--<div v-for="[a, b, c] in row.functionCascader">
          <el-tag>{{c}}</el-tag>
        </div>-->
      <div v-for="(code, index) in row.functionCodeNums" :key="code">
        <el-tag
          class="custom-tag"
          v-show="index < functionCodeNumsLength || expandList.includes(row.id)"
          >{{ code }}</el-tag
        >
      </div>
      <el-link
        @click="expandFunctionCode(row.id)"
        v-if="row.functionCodeNums.length > functionCodeNumsLength"
        style="font-size: 12px"
        >{{ expandText }}</el-link
      >
    </template>
    <template slot-scope="{ row }" slot="dataplanCascader">
      <div v-for="code in row.dataPlanNames" :key="code">
        <el-tag class="custom-tag">{{ code }}</el-tag>
      </div>
    </template>
    <template slot-scope="{ row }" slot="optionCascader">
      <div v-for="code in row.optionNames" :key="code">
        <el-tag class="custom-tag">{{ code }}</el-tag>
      </div>
    </template>
    <template slot-scope="scope" slot="menu">
      <br />
      <el-button
        type="text"
        icon="el-icon-check"
        v-if="permission.servicesubpackage_operate"
        class="none-border"
        @click="changeStatus(scope.row)"
        >On
      </el-button>
      <el-button
        type="text"
        icon="el-icon-close"
        v-if="permission.servicesubpackage_operate"
        class="none-border"
        @click="changeStatus(scope.row)"
        >Off
      </el-button>
    </template>
    <template slot-scope="scope" slot="functionCascaderLabel">
      Function:
    </template>
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
} from "@/api/portal/servicesubpackage";
import { download } from "@/util/excel";
import { mapGetters } from "vuex";
import { uuid } from "vue-uuid";
import { getFileSuffix } from "@/util/util";
import website from "@/config/website";
import { functionList } from "@/api/portal/vehicleservicefunction";
import { getList as dataplanList } from "@/api/portal/vehicledataplans";
import { getList as optionList } from "@/api/portal/serviceoption";

export default {
  data() {
    let checkTwoTimes = (rule, value, callback) => {
      if (
        new Date(value).getTime() <= new Date(this.form.startTime).getTime()
      ) {
        callback(new Error("End time should be later than start time"));
      } else {
        callback();
      }
    };

    return {
      form: {
        //functionCascader: [["100003", "100003-3"], ["100004", "100004-1"]]
      },
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      //Function Code 展开的列表
      expandList: [],
      expandText: "expand+",
      functionCodeNumsLength: 3,
      option: {
        height: "auto",
        calcHeight: 30,
        columnBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        indexLabel: "index",
        card: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        menuWidth: 200,
        labelWidth: 150,
        addBtnText: "Add",
        searchBtnText: "Search",
        emptyBtnText: "Clear",
        viewBtnText: "View",
        editBtnText: "Edit",
        delBtnText: "Delete",
        menuTitle: "Operation",
        excelBtn: false,
        addTitle: "Package Add",
        editTitle: "Package Edit",
        viewTitle: "Package View",
        rowKey: "id",
        reserveSelection: true,
        emptyText: "No data",

        column: [
          {
            label: "Name",
            prop: "packageName",
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "Please input package name",
                trigger: "blur",
              },
            ],
          },
          {
            label: "Local Name",
            prop: "packageNameLocal",
            search: false,
            span: 24,
            rules: [
              {
                required: true,
                message: "Please input package Local name",
                trigger: "blur",
              },
            ],
          },
          {
            label: "Description",
            prop: "description",
            span: 24,
            minRows: 4,
            type: "textarea",
            hide: true,
          },
          {
            label: "Local Description",
            prop: "descriptionLocal",
            span: 24,
            minRows: 4,
            type: "textarea",
            hide: true,
          },
          {
            label: "Image URL",
            prop: "imageUrl",
            span: 24,
            type: "upload",
            action: "/api/oa-resource/oss/endpoint/put-file-attach-by-name",
            data: {
              fileName: "",
            },
            propsHttp: {
              res: "data",
              url: "link",
            },
            dataType: "string",
            listType: "picture",
            limit: 1,
            uploadBefore: (file, done, loading, column) => {
              column.data.fileName = `${
                website.ossPath
              }${uuid.v4()}.${getFileSuffix(file.name)}`;
              done();
            },
            /*rules: [{
                //required: true,
                message: "请输入",
                trigger: "blur"
              }]*/
          },
          {
            label: "Suitable User",
            prop: "suitableUser",
            span: 24,
            rules: [
              {
                required: true,
                message: "Please input Suitable User",
                trigger: "blur",
              },
            ],
          },
          {
            label: "Monthly Trans",
            prop: "monthlyTrans",
            span: 24,
            rules: [
              {
                required: true,
                message: "Please input Monthly Trans",
                trigger: "blur",
              },
            ],
            hide: true,
          },
          {
            label: "Start Time",
            prop: "startTime",
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            span: 12,
            rules: [
              {
                required: true,
                message: "Please input Start Time",
                trigger: "blur",
              },
            ],
          },
          {
            label: "End Time",
            prop: "endTime",
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            span: 12,
            rules: [
              {
                required: true,
                message: "Please input End Time",
                trigger: "blur",
              },
              {
                validator: checkTwoTimes,
              },
            ],
          },
          {
            label: "Availability",
            prop: "status",
            slot: true,
            display: false,
          },
          {
            label: "Function Code",
            labelSlot: true,
            prop: "functionCascader",
            type: "cascader",
            //dicData: dic,
            multiple: true,
            //tags: true,
            span: 24,
            rules: [
              {
                required: true,
              },
            ],
          },
          {
            label: "Dataplan",
            prop: "dataplanCascader",
            type: "cascader",
            multiple: true,
            span: 24,
            rules: [
              {
                required: true,
              },
            ],
            //hide: true,
          },
          {
            label: "Price Option",
            prop: "optionCascader",
            type: "cascader",
            multiple: true,
            span: 24,
            rules: [
              {
                required: true,
              },
            ],
            //hide: true,
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
        addBtn: this.vaildData(this.permission.servicesubpackage_add, false),
        viewBtn: this.vaildData(this.permission.servicesubpackage_view, false),
        delBtn: this.vaildData(this.permission.servicesubpackage_delete, false),
        editBtn: this.vaildData(this.permission.servicesubpackage_edit, false),
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
    expandFunctionCode(id) {
      //this.$nextTick(() => {
      if (this.expandList.indexOf(id) >= 0) {
        this.expandList.remove(id);
        this.expandText = "expand+";
        //重新赋值内部el-table的高度，防止滚动条不出现
        setTimeout(() => {
          this.$refs.crud.$refs.table.$el.style.height = "100%";
          this.$refs.crud.$refs.table.height = "100%";
        }, 100);
      } else {
        this.expandList.push(id);
        this.expandText = "collapse-";
        //重新赋值内部el-table的高度，防止滚动条不出现
        setTimeout(() => {
          this.$refs.crud.$refs.table.$el.style.height = "100%";
          this.$refs.crud.$refs.table.height = "100%";
        }, 100);
      }
      //});
    },
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
        //this.selectionClear();
      });
      /*getPage(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          console.log(res);
        });*/
      functionList(1, 100).then((res) => {
        const records = res.data.data.records;
        const column = this.findObject(this.option.column, "functionCascader");
        column.dicData = this.mappingDic(records);
      });
      dataplanList(1, 100).then((res) => {
        const records = res.data.data.records;
        const column = this.findObject(this.option.column, "dataplanCascader");
        column.dicData = this.mappingDic2(records);
      });
      optionList(1, 100).then((res) => {
        const records = res.data.data.records;
        const column = this.findObject(this.option.column, "optionCascader");
        column.dicData = this.mappingDic3(records);
      });
    },
    mappingDic(records) {
      let app = [];
      records.forEach((a) => {
        let func = [];
        if (a.functionList && a.functionList.length > 0) {
          a.functionList.forEach((f) => {
            //func.push({'value': f.functionCodeNum, 'label': f.functionName});
            func.push({ value: f.id, label: f.functionName });
          });
          app.push({ value: a.id, label: a.applicationName, children: func });
        } else {
          //过滤其下func为空的app，因为tr_service_package_func只保存package和func的关联
          //app.push({'value': a.id, 'label': a.applicationName});
        }
      });
      console.log(app);
      return app;
    },
    mappingDic2(records) {
      let plan = [];
      records.forEach((d) => {
        plan.push({ value: d.id, label: d.dataPlanName });
      });
      return plan;
    },
    mappingDic3(records) {
      let option = [];
      records.forEach((d) => {
        option.push({
          value: d.id,
          label: `${d.price} ${d.currency} / ${d.optionName}`,
        });
      });
      return option;
    },
    convertAvailability(code) {
      switch (code) {
        case 1:
          return "True";
        case 0:
          return "False";
        default:
          return code;
      }
    },
    /*convertCascader(cascader) {
        //console.log(cascader);
        var arr = [];
        cascader.forEach(i => {
          arr.push(i[1]);
        });
        return arr;
      },*/
    changeStatus(row) {
      //上下线转换
      row.status = Math.abs(row.status - 1);
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "Success!",
          });
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};
</script>

<style>
.custom-tag {
  white-space: normal;
  height: auto;
  padding: 0 5px;
  line-height: 20px;
  margin: 1px 0;
}
</style>
