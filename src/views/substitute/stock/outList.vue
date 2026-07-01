<template>
  <basic-container>
    <searchForm
      :searchForm="searchForm"
      @handleSubmit="handleSubmit"
      @refresh="refresh"
    ></searchForm>
    <div v-for="item in tableData" :key="item" class="mb20">
      <el-row>
        <el-col :span="6"
          >{{ $t("stockOut.number") }}:{{ item.stockOutNo }}</el-col
        >
        <el-col :span="6"
          >{{ $t("stockOut.date") }}:{{ item.stockOutDate }}</el-col
        >
        <el-col :span="6"
          >{{ $t("commonContent.batchNo") }}:{{ item.batchNo }}</el-col
        >
        <el-col :span="6"
          >{{ $t("commonContent.status") }}:{{
            item.status === 0
              ? $t("commonContent.draft")
              : $t("commonContent.submitted")
          }}</el-col
        >
        <el-col :span="6"
          >{{ $t("stockOut.ladingNo") }}:{{ item.ladingNo }}</el-col
        >
        <el-col :span="6">
          {{ $t("commonContent.queryWebsite") }}:
          <el-link type="primary" :href="item.queryWebsite" target="_blank">{{
            item.queryWebsite
          }}</el-link>
        </el-col>
        <el-col :span="6"
          >{{ $t("stockOut.departureTime") }}:{{ item.departureTime }}</el-col
        >
        <el-col :span="6"
          >{{ $t("stockOut.arrivalTime") }}:{{ item.arrivalTime }}</el-col
        >
        <el-col :span="6"
          >{{ $t("stockOut.purpose") }}:{{ useToFn(item.useTo) }}</el-col
        >
        <el-col :span="6"
          >{{ $t("stockOut.tradeMode") }}:{{ item.tradeMode }}</el-col
        >
        <el-col :span="6"
          >{{ $t("commonContent.invoiceNo") }}:{{ item.invoiceNo }}</el-col
        >
        <el-col :span="6"
          >{{ $t("commonContent.approvalStage") }}:{{
            item.approvalStage
          }}</el-col
        >
        <el-col :span="6"
          >{{ $t("commonContent.remark") }}:{{ item.remark }}</el-col
        >
        <el-col :span="12" v-if="item.useTo === 8"
          >{{ $t("stockOut.fieldApply") }}:{{ item.fieldApplyName }}
          <span @click="toPath(item)" class="detailLink">{{
            $t("commonContent.viewDetails")
          }}</span></el-col
        >
        <el-col :span="6">
          <el-button type="text" @click="updateRemark(item)">{{
            $t("commonContent.updateRemark")
          }}</el-button>
          <el-button type="text" @click="showFile(item)">{{
            $t("commonContent.viewAttachment")
          }}</el-button>
          <el-button
            type="text"
            v-if="item.useTo === 5"
            @click="updateInvoiceBindStatus(item)"
            >{{ $t("commonContent.updateInvoice") }}</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="item.stockOutDetailList"
        border
        class="mt10"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          prop="partsNo"
          :label="$t('parts.number')"
        ></el-table-column>
        <el-table-column
          prop="partsName"
          :label="$t('parts.name')"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column
          prop="stockInNo"
          :label="$t('stockIn.number')"
        ></el-table-column>
        <el-table-column
          prop="intoTime"
          :label="$t('stockIn.date')"
        ></el-table-column>
        <el-table-column
          prop="storeName"
          :label="$t('commonContent.warehouse')"
        ></el-table-column>
        <el-table-column
          prop="goodsShelvesNo"
          :label="$t('stockIn.receiptNumber')"
        ></el-table-column>
        <el-table-column
          prop="seriesName"
          :label="$t('parts.series')"
        ></el-table-column>
        <el-table-column
          prop="countryRegin"
          :label="$t('commonContent.country')"
        ></el-table-column>
        <el-table-column
          prop="stockOutNumber"
          :label="$t('stockOut.quantity')"
        ></el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('commonContent.operation')"
          width="150"
        >
          <template>
            <el-button
              v-if="item.status === 0"
              @click="handleOutStock(item)"
              type="text"
              size="small"
              >{{ $t("commonContent.submit") }}</el-button
            >
            <el-button type="text" size="small" @click="billShow(item)">{{
              $t("logistics.info")
            }}</el-button>
            <el-button
              v-if="item.status === 0"
              @click="handleDel(item)"
              type="text"
              size="small"
              >{{ $t("commonContent.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="修改备注"
      :append-to-body="true"
      :visible.sync="dialogFormVisibleRemark"
    >
      <el-form :model="form">
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            type="remark"
            v-model="update.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRemark = false">取 消</el-button>
        <el-button type="primary" @click="confirmRemark">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改发票可绑定状态"
      :append-to-body="true"
      :visible.sync="dialogFormVisibleInvoice"
    >
      <el-form :model="form">
        <el-form-item label="发票绑定状态" :label-width="formLabelWidth">
          <el-radio-group
            v-model="update.associatedInvoiceStatus"
            :disabled="update.associatedInvoiceStatus == '1'"
          >
            <el-radio label="0">未绑定</el-radio>
            <el-radio disabled label="1">已绑定</el-radio>
            <el-radio label="3">历史数据无需绑定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleInvoice = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="[10, 20, 50, 100]"
        :current-page="form.current"
        :page-size="form.size"
        :total="form.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <Bill v-if="bill" :billRow="billRow" @close="close"></Bill>
    </div>
    <el-dialog
      :title="$t('commonContent.viewAttachment')"
      :visible.sync="dialogVisibleFile"
      width="50%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <div>
        <upload
          :fileList="fileList"
          ref="uploadRef"
          :btnName="$t('commonContent.upload')"
          @handleRequest="handleRequest"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">{{
          $t("commonContent.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>
<script>
import { partsNo, partsName } from "@/util/formSelectList";
import { selectPage, submit, submitCheck, stockOutDelete } from "@/api/substitute/stockOut";
import {
  updateStockOutRemark,
  updateStockInvoice,
  updateStockOutFile,
} from "@/api/substitute/stockInto";
import { getOptions } from "@/api/base";
import Bill from "./bill";
import upload from "@/components/upload/index";
export default {
  components: {
    Bill,
    upload,
  },
  data() {
    return {
      dialogFormVisibleRemark: false,
      billRow: null,
      formLabelWidth: "120px",
      bill: false,
      rowId: null,
      dialogFormVisibleInvoice: false,
      update: {
        id: null,
        remark: null,
        fileList: [],
      },
      form: {
        current: 1,
        size: 10,
        total: 0,
      },
      fileList: [],
      dialogVisibleFile: false,
      searchForm: {
        downloadBtn: {
          url: "/api/oa-portal/stockIn/exportStockOut",
        },
        column: [
          partsNo,
          partsName,
          {
            label: this.$t("stock.intoTime"),
            prop: "into",
            propRange: ["intoStartTime", "intoEndTime"],
            format: "yyyy-MM-DD",
            valueFormat: "yyyy-MM-DD",
            type: "daterange",
            startPlaceholder: "日期开始",
            endPlaceholder: "日期结束",
          },
          {
            label: this.$t("stockOut.date"),
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
  mounted() {
    this.getList();
    this.init();
  },
  methods: {
    init() {
      getOptions({ code: "useTo" }).then((res) => {
        this.useToList = res.data.data;
      });
    },
    async confirm() {
      let res = await updateStockOutFile(this.update);
      if (res.data.code === 0 || res.data.code === 200) {
        this.dialogVisibleFile = false;
      }
    },
    updateInvoiceBindStatus(row) {
      this.update = JSON.parse(JSON.stringify(row));
      this.dialogFormVisibleInvoice = true;
    },
    updateRemark(row) {
      this.update = JSON.parse(JSON.stringify(row));
      this.dialogFormVisibleRemark = true;
    },
    async confirmRemark() {
      let res = await updateStockOutRemark(this.update);
      if (res.data.code === 0 || res.data.code === 200) {
        this.dialogFormVisibleRemark = false;
        this.getList();
      }
    },
    async confirmUpdate() {
      let res = await updateStockInvoice(this.update);
      if (res.data.code === 0 || res.data.code === 200) {
        this.dialogFormVisibleInvoice = false;
        this.getList();
      }
    },
    handleRequest(data, arr) {
      console.log(arr);
      console.log(this.update.fileList);
      console.log(this.fileList);
      this.update.fileList = arr;
      this.fileList = arr;
    },
    handleClose() {
      this.dialogVisibleFile = false;
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
      this.dialogVisibleFile = true;
      this.$nextTick(() => {
        this.fileList = item.fileList;
        this.update = item;
        this.update.fileList = this.fileList;
      });
    },
    handleSubmit(from) {
      this.form.current = 1;
      this.form.size = 10;
      this.getList(from);
    },
    refresh() {
      this.form = {
        current: 1,
        size: 10,
      };
      this.getList();
    },
    handleSizeChange(val) {
      this.form.current = 1;
      this.form.size = val;
      this.getList();
    },
    toPath(item) {
      if (item.fieldApplyId) {
        let url = `/fieldApplication?businessId=${item.fieldApplyId}`;
        window.open(this.$router.resolve({ path: url }).href, "_blank");
      }
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
        const doSubmit = () => {
          submit({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("出库成功");
              this.getList();
            }
          });
        };
        // 只有包含 27162005/27159858 两个特殊零件时才需要走预校验
        const specialParts = ["27162005", "27159858"];
        const hasSpecialPart = row.stockOutDetailList && row.stockOutDetailList.some(
          (d) => specialParts.includes(d.partsNo)
        );
        if (!hasSpecialPart) {
          // 没有特殊零件，直接提交
          doSubmit();
          return;
        }
        // 有特殊零件，先做预校验
        submitCheck({ id: row.id }).then((checkRes) => {
          // true 直接提交；false 弹提示让用户确认
          if (checkRes.data && checkRes.data.data === true) {
            doSubmit();
          } else {
            this.$alert(checkRes.data.message, "出库提示", {
              confirmButtonText: "仍然提交",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => doSubmit()).catch(() => {});
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
      this.form = { ...this.form, ...from };
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
