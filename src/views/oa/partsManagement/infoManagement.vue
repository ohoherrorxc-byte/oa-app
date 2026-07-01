<template>
  <basic-container>
    <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
               :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
               @selection-change="handleSelectionChange">
      <template slot-scope="{disabled}" slot="recipientSearch">
        <autoAddress placeholder="" @getPersonClear="getPersonClear" ref="autoAddress" :initList="initList"
                     class="w-100" @getPerson="getPerson" :initData="form.recipient" v-model="search.recipient"
                     :disabled="disabled" :multiple="false">
        </autoAddress>
      </template>
      <template slot="menuLeft">
        <div class="btn ">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">新增
          </el-button>
          <el-button type="primary" size="small" plain icon="el-icon-download" @click="downModel">下载模板
          </el-button>
          <div style="margin-top: 7px;" v-if=ifShowUploadButton>
            <upload url="/api/oa-portal/partsManagement/basicImport" @handleRequest="handleRequest"></upload>
          </div>
          <el-button size="small" type="warning" plain icon="el-icon-download" @click="handleExport">导出
          </el-button>
          <el-button size="small" type="primary" plain icon="el-icon-printer" @click="handlePrinf">批量打印
          </el-button>
        </div>
      </template>
      <template slot-scope="{type,size,row}" slot="menu">
        <el-button icon="el-icon-edit" :size="size" :type="type" @click="editRow(row)">编辑</el-button>
        <el-button icon="el-icon-delete" :size="size" :type="type" @click="deleteRow(row)">删除</el-button>
                <el-button icon="el-icon-view" :size="size" :type="type" @click="viewDetail(row)">打印</el-button>
        <el-button icon="el-icon-view" :size="size" :type="type" @click="toDetail(row, 'view')">二维码详情</el-button>
      </template>
    </avue-crud>
    <printDetail v-if="printPage" :multipleSelection="multipleSelection" ref="printDetail"></printDetail>
    <createPart @getReflesh="onLoad(page)" ref="createPart"></createPart>

    <!-- 弹窗：承载已有的partsDetails页面组件 -->
    <el-dialog title="零件二维码" :visible.sync="detailDialogVisible" width="90%" :close-on-click-modal="false"
               append-to-body="true" style="z-index: 9999;">
      <component :is="detailComponent" :detail-id="currentDetailId " :row="selectedRow"
                 @close-dialog="detailDialogVisible = false"></component>
    </el-dialog>
  </basic-container>
</template>

<script>
import createPart from './components/createPart'
import upload from '@/components/upload/index'
import PartsManageApi from '@/api/partsManage/index'
import {downBlobFile} from '@/util/util'
import autoAddress from '@/components/autoAddress/index'
import printDetail from './printDetail'
import partsDetailsPop from '@/views/oa/partsManagement/partsDetailsPop';
import QrCodeComponent from "@/components/qrcodeComponent"; // 引入已有页面
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      activeName: "all",
      search: {},
      printPage: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      multipleSelection: [],
      data: [],
      form: {},
      option: {
        // height: "500",
        calcHeight: 80,
        tip: false,
        searchShow: true,
        searchMenuSpan: 5,
        border: true,
        index: true,
        selection: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        // menu: false,
        //dialogType: 'drawer',
        dialogClickModal: false,
        searchShowBtn: false,
        column: [
          {
            label: "零件BOM名称",
            prop: "partBomName",
            searchLabelWidth: 120,
            // searchSpan: 6,
            search: false,
            display: false,
          },
          {
            label: "零件名称",
            prop: "partName",
            slot: true,
            search: true,
            display: false,
          },
          {
            label: "零件编号",
            prop: "partNumber",
            // searchSpan: 6,
            searchLabelWidth: 80,
            search: true,
            display: false,
          },
          {
            label: "零件简称",
            prop: "partAbbreviation",
            display: false,
          },
          {
            label: "采购件号",
            prop: "purchasePartNumber",
            width: 100,
            search: true,
            display: false,
          },
          {
            label: "规格型号",
            prop: "specificationAndModel",
            search: true,
            // searchSpan: 6,
            display: false,
          },
          {
            label: "零件大类",
            prop: "partsCategory",
            search: true,
            display: false,
            props: {
              value: 'dictValue',
              label: 'dictValue'
            },
            type: 'select',
            dicUrl: "/api/oa-system/dict-biz/dictionary?code=partCategories"
          },
          {
            label: "零件中类",
            prop: "middlePart",
            search: true,
            display: false,
          },
          {
            label: "零件小类",
            prop: "partsSubcategory",
            search: true,
            display: false,
          },
          {
            label: "适用项目",
            prop: "partsProject",
            display: false,
            // searchSpan: 4,
            search: true,
          },
          {
            label: "当前状态",
            prop: "currentState",
            search: true,
            // searchSpan: 4,
            searchType: "select",
            dicData: [
              {
                label: '在库中',
                value: '在库中'
              },
              {
                label: '已领用',
                value: '已领用'
              },
              {
                label: '已报废',
                value: '已报废'
              }
            ]

          },
          {
            label: "存放地点",
            prop: "storageLocation",
            search: true,
            searchType: "input",
            // searchSpan: 5,
            // props: {
            //     label: "dictValue",
            //     value: "dictKey",
            // },
            // dicUrl: "/api/oa-system/dict-biz/dictionary?code=storageLocation",
            display: false,
          },
          {
            label: "领用人",
            prop: "recipient",
            display: false,
            search: true,
            // searchSpan: 5,
          },
          {
            label: "领用部门",
            prop: "recipientDept",
            display: false,
            search: true,
            // searchSpan: 5,
          },
          {
            label: "领用时间",
            prop: "usageTime",
            display: false,
          },
          {
            label: "领用说明",
            prop: "usageDescription",
            display: false,
          },
          {
            label: "入库时间",
            prop: "warehousingTime",
            display: false,
          },
        ],
      },
      detailDialogVisible: false, // 弹窗显隐
      currentDetailId: '', // 详情ID
      selectedRow: null,
      detailComponent: 'partsDetailsPop', // 动态组件名称
    }
  },
  components: {
    createPart, upload, autoAddress, printDetail, QrCodeComponent, partsDetailsPop
  },
  computed: {
    ...mapGetters(['userInfo']),
    ifShowUploadButton() {
      const allowUserNames = ["chenqiang"];
      return this.userInfo && allowUserNames.includes(this.userInfo.user_name);
    },
  },
  methods: {
    async onLoad(page, params = {}) {
      let obj = {
        size: page.pageSize,
        current: page.currentPage
      }
      let postdata = {...obj, ...params, ...this.query, ...this.form}
      this.loading = true;
      await PartsManageApi.basicList(
        postdata
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    },
    handleClick() {
      //0：进行中；1：闲置中；2：领用中；3：维修中；4：已报废;5:已归还
      let obj = {
        'all': null,
        "inReceipt": [2],
        "scrapped": [4],
        "inIdle": [1],
        "isDoing": [0],
        "isReturn": [5],
        "isRepair": [3]
      }
      this.form.assetStatusList = obj[this.activeName]
      this.onLoad(this.page)
    },
    handleRequest() {
      this.query = {};
      this.form.recipient = ''
      this.onLoad(this.page)
    },
    getPerson(data) {
      this.form.recipient = data.realName
    },
    handleAdd() {
      this.$refs.createPart.dialogVisible = true
      this.$refs.createPart.resetForm()
    },
    async downModel() {
      let res = await PartsManageApi.basicExportTemplate()
      downBlobFile(res.data, '零件信息管理模板.xlsx')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async handleExport() {
      let res = await PartsManageApi.basicExport(this.query)
      downBlobFile(res.data, '零件信息管理.xlsx')
    },
    handlePrinf() {
      this.printPage = true
      setTimeout(() => {
        this.$refs.printDetail.handlePrint()
      }, 100)
      setTimeout(() => {
        this.printPage = false
      }, 1000)
    },
    async editRow(row) {
      this.$refs.createPart.dialogVisible = true
      this.$refs.createPart.getDetails(row.id)
    },
    viewDetail(row) {
      this.$router.push(`/partsDetails?id=${row.id}`)
    },
    toDetail(row) {
      this.currentDetailId = row.id;
      this.selectedRow = row;
      this.detailDialogVisible = true;
    },
    deleteRow(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await PartsManageApi.basicDelete([row.id])
        if (res.data.code === 0) {
          this.$message.success('该条数据已删除')
          this.onLoad(this.page)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    searchReset() {
      this.query = {};
      this.form.recipient = ''
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    getPersonClear() {
      this.form.recipient = ''
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
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin: 0;
}
</style>
