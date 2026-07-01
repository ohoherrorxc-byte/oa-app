<template>
 
    <basic-container>
      <searchForm :searchForm="searchForm" @handleSubmit="handleSubmit" @refresh="refresh"></searchForm>
      <div v-for="item in tableData" :key="item" class="mb20">
        <el-row>
          <el-col :span="6">{{ $t('stockOut.number') }}:{{ item.stockOutNo }}</el-col>
          <el-col :span="6">{{ $t('stockOut.date') }}:{{ item.stockOutDate }}</el-col>
          <el-col :span="6">{{ $t('commonContent.batchNo') }}:{{ item.batchNo }}</el-col>
          <el-col :span="6">{{ $t('commonContent.status') }}:{{ item.status === 0 ? $t('commonContent.draft') : $t('commonContent.submitted') }}</el-col>
          <el-col :span="6">{{ $t('stockOut.ladingNo') }}:{{ item.ladingNo }}</el-col>
          <el-col :span="6">
            {{ $t('commonContent.queryWebsite') }}:
            <el-link type="primary" :href="item.queryWebsite" target="_blank">{{ item.queryWebsite }}</el-link>
          </el-col>
          <el-col :span="6">{{ $t('stockOut.departureTime') }}:{{ item.departureTime }}</el-col>
          <el-col :span="6">{{ $t('stockOut.arrivalTime') }}:{{ item.arrivalTime }}</el-col>
          <el-col :span="6">{{ $t('stockOut.purpose') }}:{{ useToFn(item.useTo) }}</el-col>
          <el-col :span="6">{{ $t('stockOut.tradeMode') }}:{{ item.tradeMode }}</el-col>
          <el-col :span="6">{{ $t('commonContent.invoiceNo') }}:{{ item.invoiceNo }}</el-col>
          <el-col :span="6">{{ $t('commonContent.approvalStage') }}:{{ item.approvalStage }}</el-col>
          <el-col :span="6">{{ $t('commonContent.remark') }}:{{ item.remark }}</el-col>
          <el-col :span="6">
              <el-button type="text" @click="updateRemark(item)">{{ $t('commonContent.updateRemark') }}</el-button>
            <el-button type="text" @click="showFile(item)">{{ $t('commonContent.viewAttachment') }}</el-button>
          </el-col>
        </el-row>
        <el-table :data="item.stockOutDetailList" border class="mt10" :span-method="objectSpanMethod">
          <el-table-column prop="partsNo" :label="$t('parts.number')"></el-table-column>
          <el-table-column prop="partsName" :label="$t('parts.name')" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="stockInNo" :label="$t('stockIn.number')"></el-table-column>
          <el-table-column prop="intoTime" :label="$t('stockIn.date')"></el-table-column>
          <el-table-column prop="storeName" :label="$t('commonContent.warehouse')"></el-table-column>
          <el-table-column prop="goodsShelvesNo" :label="$t('stockIn.receiptNumber')"></el-table-column>
          <el-table-column prop="seriesName" :label="$t('parts.series')"></el-table-column>
          <el-table-column prop="countryRegin" :label="$t('commonContent.country')"></el-table-column>
          <el-table-column prop="stockOutNumber" :label="$t('stockOut.quantity')"></el-table-column>
          <el-table-column fixed="right" :label="$t('commonContent.operation')" width="150">
            <template slot-scope="{row}">
              <el-button v-if="item.status === 0" @click="handleOutStock(item)" type="text" size="small">{{ $t('commonContent.submit') }}</el-button>
              <el-button type="text" size="small" @click="billShow(item)">{{ $t('logistics.info') }}</el-button>
              <el-button v-if="item.status === 0" @click="handleDel(item)" type="text" size="small">{{ $t('commonContent.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination background :page-sizes="[10, 20, 50, 100]" :current-page="form.current" :page-size="form.size"
          :total="form.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange"></el-pagination>
        <subBill v-if="bill" :billRow="billRow" @close="close"></subBill>
      </div>
      <el-dialog :title="$t('commonContent.viewAttachment')" :visible.sync="dialogVisibleFile" width="50%" :append-to-body="true" :before-close="handleClose">
        <div>
          <upload :fileList="fileList" disabled :btnName="$t('commonContent.upload')" @handleRequest="handleRequest" :multiple="true"
            :showFileList="true"></upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisibleFile = false">{{ $t('commonContent.confirm') }}</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </template>
  <script>
  import { partsNo, partsName } from "@/util/formSelectList";
  import { selectPage, submit, stockOutDelete } from "@/api/substitute/subStockOut";
  import { getOptions } from "@/api/base";
  import subBill from "./subBill";
  import upload from '@/components/upload/index'
  export default {
    components: {
      subBill,upload
    },
    data() {
      return {
        billRow: null,
        bill: false,
        rowId: null,
        form: {
          current: 1,
          size: 10,
          total: 0,
        },
        fileList: [],
        dialogVisibleFile: false,
        searchForm: {
          downloadBtn:{
            url:"/api/oa-portal/categoryStockIn/exportStockOut"
          },
          column: [
            partsNo,
            partsName,
            {
              label: this.$t('stock.intoTime'),
              prop: "into",
              propRange: ["intoStartTime", "intoEndTime"],
              format: "yyyy-MM-DD",
              valueFormat: "yyyy-MM-DD",
              type: "daterange",
              startPlaceholder: "日期开始",
              endPlaceholder: "日期结束",
            },
            {
              label:  this.$t('stockOut.date'),
              prop: "out",
              propRange: ["outStartTime", "outEndTime"],
              format: "yyyy-MM-DD",
              valueFormat: "yyyy-MM-DD",
              type: "daterange",
              startPlaceholder: "日期开始",
              endPlaceholder: "日期结束",
            },
          ],
        },
        tableData: [],
        useToList: [],
      };
    },
    activated() {
      this.getList();
      this.init();
    },
    mounted(){
      this.getList();
      this.init();},
    methods: {
      init() {
        getOptions({ code: "useTo" }).then((res) => {
          this.useToList = res.data.data;
        });
      },
      updateRemark(){},
      handleClose(){
        this.dialogVisibleFile = false
      },
      useToFn(val) {
        const dict = this.useToList.find((item) => item.dictKey == val);
        return dict ? dict.dictValue : "";
      },
      close(val) {
        this.bill = false;
        if (val) this.getList();
      },
      billShow(row) {
        this.bill = true;
        this.billRow = row;
      },
      showFile(item) {
        this.dialogVisibleFile = true
        this.fileList = item.fileList
      },
      handleSubmit(from) {
        this.form.current = 1
        this.form.size = 10
        this.getList(from);
      },
      refresh() {
        this.form = {
          current: 1,
          size: 10
        }
        this.getList()
      },
      handleSizeChange(val) {
        this.form.current = 1;
        this.form.size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.form.current = val;
        this.getList();
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 10) {
          if (rowIndex == 0) {
            return {
              rowspan: row.length,
              colspan: 1,
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
      },
      handleOutStock(row) {
        this.$confirm("确定要出库吗?", "出库", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          submit({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("出库成功");
              this.getList();
            }
          });
        });
      },
      handleDel(row) {
        this.$confirm("确定要删除吗?", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          stockOutDelete({ ids: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        });
      },
      getList(from) {
        // console.log(from)
        this.form = { ...this.form, ...from }
        selectPage({ ...this.form, ...from }).then((res) => {
          this.tableData = res.data.data.records;
          this.form.total = res.data.data.total;
          this.tableData.forEach((item) => {
            item.stockOutDetailList.forEach((i) => {
              i.length = item.stockOutDetailList.length;
            });
          });
        });
      },
    },
  };
  </script>
  
  <style scoped lang="scss"></style>
  