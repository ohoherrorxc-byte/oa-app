<template>
  <basic-container>
    <div class="customs-page">
      <!-- 查询区 -->
      <el-card class="filter-card" shadow="never">
        <el-form :model="form" inline class="filter-form">
          <el-form-item
            :label="$t('customsDeclaration.customsNo')"
            label-width="100px"
          >
            <el-input
              v-model="queryInfo.customsNo"
              placeholder="请输入报关单号"
              clearable
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('customsDeclaration.invoiceNumber')"
            label-width="100px"
          >
            <el-input
              v-model="queryInfo.invoiceNumber"
              placeholder="请输入发票编号"
              clearable
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('customsDeclaration.haveInvoice')"
            label-width="100px"
          >
            <el-select
              v-model="queryInfo.haveInvoice"
              placeholder="请选择"
              clearable
              autocomplete="off"
            >
              <el-option value="1" label="是"></el-option>
              <el-option value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="filter-buttons">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getList"
              >{{ $t("commonContent.search") }}</el-button
            >
            <el-button icon="el-icon-refresh" @click="reflesh">{{
              $t("commonContent.refresh")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addNew"
          >{{ $t("commonContent.new") }}</el-button
        >
        <div class="toolbar-right">
          <span class="total-tip">共 <b>{{ total || 0 }}</b> 条记录</span>
        </div>
      </div>

      <!-- 列表 -->
      <el-table
        :data="tableData"
        :max-height="tableMaxHeight"
        style="width: 100%"
        border
        stripe
        :header-cell-style="headerCellStyle"
        class="customs-table"
      >
        <el-table-column
          type="index"
          label="#"
          width="55"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column
          prop="customsName"
          :label="$t('customsDeclaration.customsName')"
          min-width="180"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="customsNo"
          :label="$t('customsDeclaration.customsNo')"
          min-width="160"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="outTime"
          :label="$t('customsDeclaration.outTime')"
          min-width="160"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="applyTime"
          :label="$t('customsDeclaration.applyTime')"
          min-width="160"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="contractNo"
          :label="$t('customsDeclaration.contractNo')"
          min-width="140"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="发票编号"
          align="center"
          header-align="center"
        >
          <el-table-column
            label="发票号"
            min-width="180"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="cell-strong multi-line"
                v-html="getInvoiceInfo(scope.row).invoiceNo"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="发票总金额"
            min-width="120"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line qty-cell"
                v-html="formatMoney(getInvoiceInfo(scope.row).invoiceAmount)"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="零件数量"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line qty-cell"
                v-html="formatQty(getInvoiceInfo(scope.row).partsQuantity)"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="零件号"
            min-width="140"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getInvoiceInfo(scope.row).partsNo"
              ></span>
            </template>
          </el-table-column>
        </el-table-column>

        <!-- 出库信息 多表头 -->
        <el-table-column
          label="出库信息"
          align="center"
          header-align="center"
        >
          <el-table-column
            label="出库单号"
            min-width="140"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="cell-strong multi-line"
                v-html="getStockInfo(scope.row).outStockNo"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="出库时间"
            width="140"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getStockInfo(scope.row).outStockTime"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="入库时间"
            width="140"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getStockInfo(scope.row).intoTime"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="零件编号"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getStockInfo(scope.row).partNo"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="零件名称"
            min-width="200"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getStockInfo(scope.row).partName"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="出库数量"
            min-width="80"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <div
                class="multi-line qty-cell"
                v-html="formatQty(getStockInfo(scope.row).outStockQty)"
              ></div>
            </template>
          </el-table-column>
        </el-table-column>

        <!-- BOM 订单 多表头 -->
        <el-table-column
          :label="$t('commonContent.bomOrders')"
          align="center"
          header-align="center"
        >
          <el-table-column
            label="订单号"
            min-width="240"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="cell-strong multi-line"
                v-html="getBomOrderInfo(scope.row).orderNo"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商名称"
            min-width="200"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getBomOrderInfo(scope.row).supplierName"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getBomOrderInfo(scope.row).quantity"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="品名"
            min-width="160"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getBomOrderInfo(scope.row).partsName"
              ></span>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- 供应商发票 多表头 -->
        <el-table-column
          label="供应商发票"
          align="center"
          header-align="center"
        >
          <el-table-column
            label="订单号"
            min-width="200"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="cell-strong multi-line"
                v-html="getSupplierInvoiceInfo(scope.row).orderNo"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商发票号"
            min-width="200"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getSupplierInvoiceInfo(scope.row).supplierInvoiceNo"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商发票名称"
            min-width="240"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getSupplierInvoiceInfo(scope.row).invoiceName"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商发票价格"
            min-width="120"
            align="center"
            header-align="center"
          >
            <template v-slot="scope">
              <span
                class="multi-line"
                v-html="getSupplierInvoiceInfo(scope.row).invoicePrice"
              ></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="$t('commonContent.remarks')"
          min-width="160"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          :label="$t('commonContent.operation')"
          fixed="right"
          min-width="240"
          align="center"
        >
          <template v-slot="scope">
            <div class="op-group op-flat">
              <el-button
                type="text"
                @click="createdOrder(scope.row)"
                >{{ $t("commonContent.generateOrder") }}</el-button
              >
              <el-button
                type="text"
                @click="editRow(scope.row)"
                >{{ $t("commonContent.edit") }}</el-button
              >
              <el-button
                type="text"
                class="danger"
                @click="deleteRow(scope.row)"
                >{{ $t("commonContent.delete") }}</el-button
              >
              <el-button
                type="text"
                @click="downUrl(scope.row)"
                >{{ $t("commonContent.download") }}</el-button
              >
              <el-button
                type="text"
                @click="downBranch(scope.row)"
                >打印文件</el-button
              >
              <el-button
                type="text"
                @click="preview(scope.row)"
                >报关单预览</el-button
              >
              <el-button
                type="text"
                @click="downSupplyList(scope.row)"
                >下载供应商发票</el-button
              >
              <el-button
                type="text"
                v-if="scope.row.bomOrder"
                @click="uploadSupplyList(scope.row)"
                >上传供应商发票</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    <!--分页-->
    <el-pagination
      v-if="!isSwiper"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.current"
      :page-sizes="[2, 5, 10, 20, 50]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog
      :append-to-body="true"
      title="新增报关单"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item label="报关单名称" label-width="120px">
          <el-input v-model="form.customsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="报关单号" label-width="120px">
          <el-input v-model="form.customsNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出口时间" label-width="120px">
          <el-date-picker
            v-model="form.outTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申报时间" label-width="120px">
          <el-date-picker
            v-model="form.applyTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同编号" label-width="120px">
          <el-input v-model="form.contractNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发票信息" label-width="120px">
          <el-select
            v-model="form.invoiceNumbers"
            autocomplete="off"
            multiple
            clearable
            filterable
          >
            <el-option
              v-for="item in invoiceList"
              :key="item.id"
              :value="item.invoiceNo"
              :label="item.invoiceNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传附件" label-width="120px">
          <upload
            btnName="上传"
            :fileList="fileList"
            :showFileList="true"
            @handleRequest="handleRequest"
            :multiple="false"
          ></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <div id="parentView" class="setInvoiceView">
      <div
        v-for="(item, index) in currForm.invoiceIds"
        class="setInvoiceView"
        :key="index"
        v-if="currForm.invoiceIds.length > 0"
      >
        <invoiceView class="child-class" :invoiceId="item"></invoiceView>
      </div>
    </div>
    <div id="print-container"></div>
    <priview ref="pdfPriview"></priview>
    <el-dialog
      title="上传供应商发票"
      :visible.sync="dialogVisible"
      width="70%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-form
        :model="formInvoice"
        label-width="120px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="BOM采购订单" prop="orderCode">
          <el-select v-model="formInvoice.orderCode" @change="changeBomOrder">
            <el-option
              v-for="item in bomOrderList"
              :key="item.id"
              :value="item.applyNo"
              :label="item.applyNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票编号" label-width="120px" prop="supplierInvoiceNo">
          <el-input
            v-model="formInvoice.supplierInvoiceNo"
            autocomplete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传供应商发票">
          <upload
            btnName="上传"
            :fileList="formInvoice.fileList"
            :showFileList="true"
            @handleRequest="handleRequestInvoice"
            :multiple="false"
          ></upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSupply">确 定</el-button>
      </span>
    </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import CustomsDeclarationApi from "@/api/customsDeclaration/index";
import { downloadFileBlob, mergePDFs } from "@/util/util";
import upload from "@/components/upload";
import printJS from "print-js";
import html2pdf from "html2pdf.js";
import invoiceView from "./invoiceView";
import priview from "@/components/upload/priview.vue";
import SupplierInvoiceApi from "@/api/supplierInvoice/index";

export default {
  data() {
    return {
      currForm: {
        invoiceIds: [],
      },
      tableData: [],
      // 表格最大高度（用于固定表头），根据窗口高度动态计算
      tableMaxHeight: 600,
      invoiceList: [],
      formInvoice: {
        orderCode: null,
        fileList: [],
        supplierInvoiceNo: null,
      },
      dialogFormVisible: false,
      queryInfo: {
        current: 1,
        size: 10,
        customsNo: null,
        invoiceNumber: null,
      },
      rules: {
        orderCode: [
          { required: true, message: "请选择BOM采购订单", trigger: "change" },
        ],
        supplierInvoiceNo: [
          { required: true, message: "请输入发票编号", trigger: "change" },
        ],
      },
      bomOrderList: [],
      dialogVisible: false,
      fileList: [],
      total: null,
      form: {
        invoiceIds: [],
      },
      headerCellStyle: {
        background: "#f5f7fa",
        color: "#303133",
        fontWeight: "600",
        borderBottom: "1px solid #ebeef5",
      },
    };
  },
  components: { upload, invoiceView, priview },
  created() {
    this.getList();
    this.getInvoiceList();
    this.calcTableHeight();
    window.addEventListener("resize", this.calcTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calcTableHeight);
  },
  methods: {
    // 解析 outStockInfo HTML 字符串，提取出库信息（支持多条记录，按 <br> 拆分）
    getStockInfo(row) {
      const emptyRecord = () => ({
        outStockNo: "-",
        outStockTime: "-",
        intoTime: "-",
        partNo: "-",
        partName: "-",
        outStockQty: "-",
      });

      if (!row) return { ...emptyRecord(), records: [] };

      // 1. 优先使用后端返回的结构化字段
      if (row.outStockDetail) {
        if (Array.isArray(row.outStockDetail)) {
          const records = row.outStockDetail.length
            ? row.outStockDetail.map((r) => ({
                outStockNo: r.outStockNo || "-",
                outStockTime: r.outStockTime || "-",
                intoTime: r.intoTime || "-",
                partNo: r.partNo || "-",
                partName: r.partName || "-",
                outStockQty: r.outStockQty || "-",
              }))
            : [emptyRecord()];
          return { ...this._combineRecords(records), records };
        }
        if (typeof row.outStockDetail === "object") {
          const r = {
            outStockNo: row.outStockDetail.outStockNo || "-",
            outStockTime: row.outStockDetail.outStockTime || "-",
            intoTime: row.outStockDetail.intoTime || "-",
            partNo: row.outStockDetail.partNo || "-",
            partName: row.outStockDetail.partName || "-",
            outStockQty: row.outStockDetail.outStockQty || "-",
          };
          return { ...r, records: [r] };
        }
      }

      const html = row.outStockInfo;
      if (!html) return { ...emptyRecord(), records: [] };

      // 字段映射配置
      const fieldMap = [
        { keys: ["出库单号"], target: "outStockNo" },
        { keys: ["出库时间"], target: "outStockTime" },
        { keys: ["入库时间"], target: "intoTime" },
        { keys: ["零件编号", "零件号", "物料编号"], target: "partNo" },
        { keys: ["零件名称", "物料名称", "物料描述"], target: "partName" },
        { keys: ["出库数量"], target: "outStockQty" },
      ];

      // 把单条记录字符串解析成对象
      const parseOneRecord = (recordStr) => {
        const rec = emptyRecord();
        if (!recordStr) return rec;
        const segments = recordStr
          .split(/[;；]/)
          .map((s) => s.trim())
          .filter(Boolean);
        segments.forEach((seg) => {
          for (const f of fieldMap) {
            if (rec[f.target] !== "-") continue;
            for (const k of f.keys) {
              const re = new RegExp(k + "[\\s:：\\-=]+([^\\n]{1,200})");
              const m = seg.match(re);
              if (m) {
                rec[f.target] = m[1].trim();
                break;
              }
            }
          }
        });
        return rec;
      };

      let records = [];

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // 方式1：按 <br> 切分，每段当成一条出库记录（用户实际数据格式）
        const brSegments = doc.body.innerHTML
          .split(/<br\s*\/?>/i)
          .map((s) => {
            // 去掉 HTML 标签，只保留文本
            const tmp = parser.parseFromString(s, "text/html");
            return (tmp.body.textContent || "").trim();
          })
          .filter(Boolean);
        if (brSegments.length > 0) {
          records = brSegments.map(parseOneRecord);
        } else {
          // 方式2：解析 <table><tr><td> 结构
          const trList = doc.querySelectorAll("tr");
          if (trList.length >= 2) {
            const rec = emptyRecord();
            trList.forEach((tr) => {
              const cells = tr.querySelectorAll("td, th");
              if (cells.length >= 2) {
                const key = cells[0].textContent.trim();
                const value = cells[1].textContent.trim();
                for (const f of fieldMap) {
                  if (rec[f.target] !== "-") continue;
                  if (f.keys.some((k) => key.includes(k))) {
                    rec[f.target] = value;
                    break;
                  }
                }
              }
            });
            records = [rec];
          } else {
            // 方式3：整段按 ; 切分
            const text = doc.body.textContent || "";
            records = [parseOneRecord(text)];
          }
        }
      } catch (e) {
        records = [];
      }

      if (!records.length) return { ...emptyRecord(), records: [] };
      return { ...this._combineRecords(records), records };
    },
    // 把出库数量值转成绿底 tag 的 HTML（按 <br> 拼接）
    formatQty(value) {
      if (!value || value === "-") return "-";
      return value
        .split("<br>")
        .map((v) =>
          v && v !== "-"
            ? `<span class="qty-tag">${v}</span>`
            : "<span>-</span>"
        )
        .join("<br>");
    },
    // 把金额值转成蓝底 tag 的 HTML（按 <br> 拼接）
    formatMoney(value) {
      if (value === null || value === undefined || value === "") return "-";
      const list = String(value)
        .split("<br>")
        .map((v) => {
          if (v === "" || v === "-") return "<span>-</span>";
          const num = Number(v);
          if (Number.isFinite(num)) {
            return `<span class="money-tag">¥ ${num.toLocaleString("zh-CN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</span>`;
          }
          return `<span>${v}</span>`;
        });
      return list.join("<br>");
    },
    // 把多条记录合并成单元格用的 HTML（按 <br> 拼接）
    _combineRecords(records) {
      const join = (key) =>
        records
          .map((r) => r[key])
          .filter((v) => v && v !== "-")
          .join("<br>") || "-";
      return {
        outStockNo: join("outStockNo"),
        outStockTime: join("outStockTime"),
        intoTime: join("intoTime"),
        partNo: join("partNo"),
        partName: join("partName"),
        outStockQty: join("outStockQty"),
      };
    },
    // 解析 bomOrder / bomOrderDetail，提取 BOM 订单信息（订单号/供应商名称/数量/品名）
    getBomOrderInfo(row) {
      const empty = {
        orderNo: "-",
        supplierName: "-",
        quantity: "-",
        partsName: "-",
      };
      if (!row) return empty;

      // 1) 优先使用后端返回的结构化字段
      if (Array.isArray(row.bomOrderDetail) && row.bomOrderDetail.length) {
        const join = (key) =>
          row.bomOrderDetail
            .map((r) => r[key])
            .filter((v) => v !== null && v !== undefined && v !== "")
            .join("<br>") || "-";
        return {
          orderNo: join("orderNo"),
          supplierName: join("supplierName"),
          quantity: join("quantity"),
          partsName: join("partsName"),
        };
      }

      // 2) 兜底：解析 bomOrder HTML 字符串
      //    新格式（后端改动后）：
      //      "订单号：xxx;供应商名称：yyy;数量：zzz;品名：www;<br>订单号：aaa;供应商名称：bbb;数量：ccc;品名：ddd;<br>"
      //    旧格式（兼容）：
      //      "订单号1：品名1;<br>订单号2：品名2;<br>"
      const html = row.bomOrder;
      if (!html) return empty;

      const fieldKeys = [
        { keys: ["订单号"], target: "orderNo" },
        { keys: ["供应商名称"], target: "supplierName" },
        { keys: ["数量"], target: "quantity" },
        { keys: ["品名"], target: "partsName" },
      ];

      const records = [];
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const segments = doc.body.innerHTML
          .split(/<br\s*\/?>/i)
          .map((s) => {
            const tmp = parser.parseFromString(s, "text/html");
            return (tmp.body.textContent || "").trim();
          })
          .filter(Boolean);
        segments.forEach((seg) => {
          const rec = {
            orderNo: "-",
            supplierName: "-",
            quantity: "-",
            partsName: "-",
          };
          // 按 ";" 切成多段 key:value
          const kvs = seg.split(/[;；]/).map((s) => s.trim()).filter(Boolean);
          let hasKnownKey = false;
          kvs.forEach((kv) => {
            const m = kv.match(/^(.*?)[:：](.*)$/);
            if (!m) return;
            const k = m[1].trim();
            const v = m[2].trim();
            for (const f of fieldKeys) {
              if (f.keys.some((kk) => k.includes(kk))) {
                if (v) rec[f.target] = v;
                hasKnownKey = true;
                break;
              }
            }
          });
          // 旧格式兼容：只有 "订单号：品名" 一对时
          if (!hasKnownKey) {
            const m = seg.match(/^(.*?)[:：](.*)$/);
            if (m) {
              rec.orderNo = m[1].trim() || "-";
              rec.partsName = m[2].trim() || "-";
            } else {
              rec.orderNo = seg;
            }
          }
          records.push(rec);
        });
      } catch (e) {
        // 解析失败
      }

      if (!records.length) {
        // 完全无法解析，回退展示原文
        return { ...empty, orderNo: html };
      }
      const join = (key) =>
        records
          .map((r) => r[key])
          .filter((v) => v && v !== "-")
          .join("<br>") || "-";
      return {
        orderNo: join("orderNo"),
        supplierName: join("supplierName"),
        quantity: join("quantity"),
        partsName: join("partsName"),
      };
    },
    // 解析 supplierInvoiceDetail / fileListName，提取供应商发票附件信息
    getSupplierInvoiceInfo(row) {
      const empty = {
        orderNo: "-",
        supplierInvoiceNo: "-",
        invoiceName: "-",
        invoicePrice: "-",
      };
      if (!row) return empty;

      // 1) 优先使用后端返回的结构化字段
      if (Array.isArray(row.supplierInvoiceDetail) && row.supplierInvoiceDetail.length) {
        const join = (key) =>
          row.supplierInvoiceDetail
            .map((r) => r[key])
            .filter((v) => v !== null && v !== undefined && v !== "")
            .join("<br>") || "-";
        return {
          orderNo: join("orderNo"),
          supplierInvoiceNo: join("supplierInvoiceNo"),
          invoiceName: join("invoiceName"),
          invoicePrice: join("invoicePrice"),
        };
      }

      // 2) 兜底：解析 fileListName HTML 字符串，格式形如：
      //    "订单号：文件名1;<br>订单号：文件名2;<br>"
      const html = row.fileListName;
      if (!html) return empty;

      const records = [];
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const segments = doc.body.innerHTML
          .split(/<br\s*\/?>/i)
          .map((s) => {
            const tmp = parser.parseFromString(s, "text/html");
            return (tmp.body.textContent || "").trim();
          })
          .filter(Boolean);
        segments.forEach((seg) => {
          const rec = { orderNo: "-", invoiceName: "-" };
          const m = seg.match(/^(.*?)[:：](.*)$/);
          if (m) {
            rec.orderNo = m[1].trim() || "-";
            rec.invoiceName = m[2].trim().replace(/;$/, "") || "-";
          } else {
            rec.orderNo = seg.replace(/;$/, "");
          }
          records.push(rec);
        });
      } catch (e) {
        // 解析失败
      }

      if (!records.length) {
        return { ...empty, orderNo: html };
      }
      const join = (key) =>
        records
          .map((r) => r[key])
          .filter((v) => v && v !== "-")
          .join("<br>") || "-";
      return {
        orderNo: join("orderNo"),
        supplierInvoiceNo: "-", // HTML 字符串里没有发票号
        invoiceName: join("invoiceName"),
        invoicePrice: "-",
      };
    },
    // 解析 invoiceDetail，提取发票信息（发票号/发票金额/零件数量/零件号）
    // 数据来源：tb_invoice + tb_invoice_info（前端仅消费结构化字段）
    getInvoiceInfo(row) {
      const empty = {
        invoiceNo: "-",
        invoiceAmount: "-",
        partsQuantity: "-",
        partsNo: "-",
      };
      if (!row) return empty;

      // 1) 优先使用后端返回的结构化字段
      if (Array.isArray(row.invoiceDetail) && row.invoiceDetail.length) {
        const join = (key) =>
          row.invoiceDetail
            .map((r) => r[key])
            .filter((v) => v !== null && v !== undefined && v !== "")
            .join("<br>") || "-";
        return {
          invoiceNo: join("invoiceNo"),
          invoiceAmount: join("invoiceAmount"),
          partsQuantity: join("partsQuantity"),
          partsNo: join("partsNo"),
        };
      }

      // 2) 兜底：从 invoiceNumber 字段（JSON 数组字符串）拆出多个发票号展示
      if (row.invoiceNumber) {
        try {
          const arr = JSON.parse(row.invoiceNumber);
          if (Array.isArray(arr) && arr.length) {
            return { ...empty, invoiceNo: arr.filter(Boolean).join("<br>") || "-" };
          }
        } catch (e) {
          // 解析失败忽略
        }
        return { ...empty, invoiceNo: row.invoiceNumber };
      }
      return empty;
    },
    addNew() {
      this.form = {
        customsName: null,
        customsNo: null,
        outTime: null,
        applyTime: null,
        contractNo: null,
        invoiceNumbers: [],
        remark: null,
      };
      this.fileList = [];
      this.dialogFormVisible = true;
    },
    async getInvoiceList() {
      let res = await CustomsDeclarationApi.listInvoice();
      this.invoiceList = res.data.data;
    },
    async saveSupply() {
      // console.log(this.formInvoice)
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await SupplierInvoiceApi.add(this.formInvoice);
          if (res.data.code === 200 || res.data.code === 0) {
            this.$message.success("供应商发票已上传");
            this.dialogVisible = false;
          }
        }else{
          console.log(valid)
        }
      });
    },
    async changeBomOrder() {
      let res = await SupplierInvoiceApi.detail(
        null,
        this.formInvoice.orderCode
      );
      if (res.data.code === 200 || res.data.code === 0) {
        this.formInvoice = res.data.data;
      }
    },
    handleRequestInvoice(data, list) {
      this.formInvoice.fileList = list;
    },
    async uploadSupplyList(row) {
      this.formInvoice = {
        orderCode: null,
        fileList: [],
        supplierInvoiceNo: null,
      };
      this.dialogVisible = true;
      let res = await SupplierInvoiceApi.listOrderDeclaration(row.customsNo);
      if (res.data.code === 200 || res.data.code === 0) {
        this.bomOrderList = res.data.data;
      }
    },
    async downBranch(row) {
      let pdfUrlList = [];
      this.currForm.invoiceIds = row.invoiceIds;
      setTimeout(async () => {
        let dom = document.getElementById("parentView");
        const options = {
          margin: 10,
          filename: "page.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            font_size: 12,
          },
          pagebreak: { mode: "always" },
        };
        if (dom.children && dom.children.length > 0) {
          for (let i = 0; i < dom.children.length; i++) {
            const domContent = dom.children[i].innerHTML;
            console.log(domContent);
            let pdfUrl = await html2pdf()
              .from(domContent)
              .set(options)
              .outputPdf("blob") // 将 PDF 输出为 Blob 对象
              .then((blob) => {
                // 将 Blob 对象转换为 URL
                return blob;
              });
            pdfUrlList.push(pdfUrl);
          }
        }
        let arr = [
          { url: row.url, downUrl: row.downUrl },
          { url: row.url, downUrl: row.downUrl },
          { url: row.url, downUrl: row.downUrl },
          { url: row.url, downUrl: row.downUrl },
        ];
        let allArr = arr.concat([]);
        row.fileList.map((ele) => {
          for (let i = 0; i < 4; i++) {
            allArr.push({ url: ele.url, downUrl: ele.downUrl });
          }
        });
        let pdfBlobs = await Promise.all(
          allArr.map(async (file) => {
            const url = file.downUrl || file.url;
            const response = await fetch(url);
            return response.blob();
          })
        );
        pdfBlobs = pdfBlobs.concat(pdfUrlList);
        const mergedPdf = await mergePDFs(pdfBlobs);
        printJS({
          printable: [URL.createObjectURL(mergedPdf)],
          type: "pdf",
          showModal: true,
        });
        this.currForm.invoiceIds = [];
      }, 300);
    },
    async downSupplyList(row) {
      row.fileList.map((ele) => {
        downloadFileBlob(ele.url, ele.name);
      });
    },
    async getList() {
      CustomsDeclarationApi.getList(this.queryInfo).then((res) => {
        this.tableData = res.data.data.records;
        this.total = res.data.data.total;
      });
    },
    reflesh() {
      this.queryInfo.current = 1;
      this.queryInfo.size = 10;
      this.queryInfo.customsNo = null;
      this.queryInfo.invoiceNumber = null;
      this.queryInfo.haveInvoice = null;
      this.getList();
    },
    // 根据窗口高度计算表格最大高度，用于固定表头
    // 顶部 chrome（查询区+工具栏+分页+边距）≈ 320px，剩余空间给表格，超出时表格内部滚动
    calcTableHeight() {
      const offset = 320;
      const h = window.innerHeight - offset;
      // 最小值 320，防止窗口过小时表头被挤压
      this.tableMaxHeight = h > 320 ? h : 320;
    },
    async save() {
      let res = await CustomsDeclarationApi.add(this.form);
      if (res.data.code === 0 || res.data.code === 200) {
        this.$message.success("保存成功");
        this.dialogFormVisible = false;
        this.getList();
      }
    },
    handleRequest(data, data1) {
      this.form.url = data1[0].url;
      this.form.name = data1[0].name;
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.queryInfo.size = val;
      this.getList();
    },
    async editRow(row) {
      let res = await CustomsDeclarationApi.detail(row.id);
      this.form = res.data.data;
      if (this.form.url) {
        this.fileList = [{ url: this.form.url, name: this.form.name }];
      } else {
        this.fileList = [];
      }
      // 如果有供应商发票文件，也添加到fileList中显示
      if (this.form.fileList && this.form.fileList.length > 0) {
        this.form.fileList.forEach(file => {
          this.fileList.push({ url: file.url, name: file.name });
        });
      }
      this.dialogFormVisible = true;
    },
    async createdOrder(row) {
      let res =  await CustomsDeclarationApi.createBomOrderByCustomsDeclaration(
        row.id
      );
      if(res.data.code===0||res.data.code===200){
        this.$message.success("订单已生成");
      }
      
    },
    downUrl(row) {
      downloadFileBlob(row.downUrl, row.name);
    },
    preview(row) {
      this.$refs.pdfPriview.dialogTableVisible = true;
      this.$refs.pdfPriview.Preview({ url: row.downUrl });
    },
    printFile(row) {},
  },
};
</script>


<style scoped>
.customs-page {
  padding: 16px;
  background: #f5f7fa;
  min-height: calc(100vh - 100px);
}

/* 查询卡片 */
.filter-card {
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}
.filter-card >>> .el-card__body {
  padding: 16px 20px 4px;
}
.filter-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #203b71;
  margin-bottom: 12px;
  padding-left: 4px;
}
.filter-title i {
  margin-right: 6px;
  font-size: 16px;
}
.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.filter-form >>> .el-form-item {
  margin-right: 16px;
  margin-bottom: 12px;
}
.filter-buttons {
  margin-left: auto;
}
.filter-buttons >>> .el-form-item__content {
  display: flex;
  gap: 8px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.toolbar .el-button {
  border-radius: 4px;
}
.toolbar-right {
  display: flex;
  align-items: center;
}
.total-tip {
  font-size: 13px;
  color: #606266;
}
.total-tip b {
  color: #203b71;
  font-weight: 600;
  margin: 0 2px;
}

/* 表格 */
.customs-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.customs-table >>> .el-table__header-wrapper th {
  background: #f5f7fa !important;
  color: #303133;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
}
.customs-table >>> .el-table__row:hover > td {
  background: #f0f4ff !important;
}
.customs-table >>> .el-table__row td {
  border-bottom: 1px solid #f0f2f5;
}
.cell-strong {
  color: #203b71;
  font-weight: 600;
}

/* 多行记录样式（出库信息多记录按 <br> 拆分） */
.multi-line {
  display: inline-block;
  line-height: 1.7;
  text-align: center;
  vertical-align: middle;
  word-break: break-all;
}
.qty-cell .qty-tag {
  display: inline-block;
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
  border-radius: 10px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
}
.qty-cell .money-tag {
  display: inline-block;
  background: #ecf5ff;
  color: #203b71;
  border: 1px solid #d9ecff;
  border-radius: 10px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
}
.qty-cell span {
  display: inline-block;
  line-height: 20px;
}
/* 出库信息列 hover 高亮一条记录 */
.customs-table >>> td:hover .multi-line {
  color: #203b71;
}

/* 操作列 */
.op-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  justify-content: center;
}
.op-group .el-button--text {
  padding: 2px 4px;
  font-size: 12px;
}
.op-group .el-button--text.danger {
  color: #f56c6c;
}
.op-group .el-button--text.danger:hover {
  color: #ff7875;
}
/* 操作列全展示样式：按钮按行平铺，无 icon，悬停轻微高亮 */
.op-flat {
  flex-wrap: wrap;
  row-gap: 4px;
  /* padding: 4px 6px; */
}
.op-flat .el-button--text {
  border-right: 1px solid #ebeef5;
  border-radius: 0;
  padding: 0 4px;
  line-height: 1.2;
}
.op-flat .el-button--text:last-child {
  border-right: none;
}
.op-flat .el-button--text:hover {
  background: #f0f4ff;
  color: #203b71;
}
.op-flat .el-button--text.danger:hover {
  background: #fef0f0;
  color: #f56c6c;
}

/* 分页 */
.customs-page >>> .el-pagination {
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
  text-align: right;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* 对话框 */
.customs-page >>> .el-dialog__header {
  background: linear-gradient(135deg, #203b71 0%, #3050a0 100%);
  padding: 14px 20px;
}
.customs-page >>> .el-dialog__title {
  color: #fff;
  font-weight: 600;
}
.customs-page >>> .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.customs-page >>> .el-dialog__body {
  padding: 20px 24px;
}

/* 多表头样式 */
.customs-table >>> .el-table__header-wrapper .el-table__header thead tr:first-child th {
  background: #e8edf6 !important;
  color: #203b71;
  font-weight: 700;
  font-size: 14px;
}
.customs-table >>> .el-table__header-wrapper .el-table__header thead tr:nth-child(2) th {
  background: #f5f7fa;
  color: #303133;
  font-weight: 600;
}
</style>