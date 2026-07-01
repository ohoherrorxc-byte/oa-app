<template>
  <basic-container>
    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="Card No：">
          <el-input
            v-model="query.chargingCardNo"
            placeholder="Card No"
            size="mini"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Consumption Type：">
          <el-select
            v-model.number="query.turnoverType"
            clearable
            placeholder="Consumption Type"
            size="mini"
          >
            <el-option
              v-for="item in turnoverTypeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Order Number：">
          <el-input
            v-model="query.orderNo"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            placeholder="Order Number"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Order Time：">
          <el-date-picker
            size="mini"
            v-model="query.orderTimeFrom"
            type="date"
            editable="false"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
            placeholder="Choose order start time"
          >
          </el-date-picker>
          -
          <el-date-picker
            size="mini"
            v-model="query.orderTimeTo"
            type="date"
            editable="false"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
            placeholder="Choose order end time"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="searchChange"
            size="mini"
            icon="el-icon-search"
            >Search</el-button
          >
        </el-form-item>
      </el-form>
      <el-row>
        <el-table
          border
          id="table"
          v-loading="loading"
          :data="data"
          @selection-change="selectChange"
          style="width: 100%"
        >
          <el-table-column label="ID" type="index" align="center">
          </el-table-column>
          <el-table-column prop="chargingCardNo" label="Card No" align="center">
          </el-table-column>
          <el-table-column
            prop="orderType"
            align="center"
            label="Order Type"
            :formatter="orderTypeFormatter"
          >
          </el-table-column>
          <el-table-column
            prop="turnoverType"
            label="Consumption Type"
            :formatter="turnoverTypeFormatter"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="Charging Start Time"
            :formatter="dateFormat"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="Charging End Time"
            :formatter="dateFormat"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="Order Amount"
            :formatter="amountFormatter"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="balance" label="Card Balance" align="center">
          </el-table-column>
          <el-table-column prop="vin" label="VIN" width="120px" align="center">
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="Order Number"
            width="130px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="Order Time"
            :formatter="dateFormat"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="tradeStatus" label="State" align="center">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="page.total"
        >
        </el-pagination>
      </el-row>
      <el-row>
        <el-button type="primary" @click="handlePrint">Print</el-button>
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="handleExport"
          >Export</el-button
        >
      </el-row>
    </el-card>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { list, exportExcel } from "@/api/portal/vehiclePrepaidCardFlow";
import { download } from "@/util/excel";
import * as Printjs from "print-js";

export default {
  data() {
    return {
      // 列表数据
      query: {
        chargingCardNo: "",
        orderNo: "",
      },
      loading: true,
      data: [],
      multiSelection: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      turnoverTypeOptions: [
        {
          value: 1,
          label: "Charging",
        },
        {
          value: 2,
          label: "Allocation",
        },
      ],
    };
  },
  created() {
    if (this.$route.query.chargingCardNo) {
      this.query.chargingCardNo = this.$route.query.chargingCardNo;
    }
    this.onLoad(this.page, this.query);
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
  },
  methods: {
    onLoad(page, params = {}) {
      this.loading = true;
      list(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;
        this.loading = false;
      });
    },
    searchChange() {
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
    },
    selectChange(val) {
      this.multiSelection = val;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },

    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.vehiclePrepaidCard = {
        balance: "",
      };
      this.vehiclePrepaidCards = [];
    },
    orderTypeFormatter(row) {
      switch (row.orderType) {
        case 1:
          return "Consumption";
        case 2:
          return "Income";
        default:
          return "Unknown";
      }
    },
    turnoverTypeFormatter(row) {
      switch (row.turnoverType) {
        case 1:
          return "Charging";
        case 2:
          return "Allocation";
        default:
          return "Unknown";
      }
    },
    amountFormatter(row) {
      switch (row.turnoverType) {
        case 1:
          return "-" + row.amount;
        case 2:
          return "+" + row.amount;
        default:
          return "0";
      }
    },
    dateFormat(row, column) {
      const daterc = row[column.property];
      if (daterc) {
        const dateMat = new Date(daterc);
        const year = dateMat.getFullYear();
        let month = dateMat.getMonth() + 1;
        let day = dateMat.getDate();
        let hh = dateMat.getHours();
        let mm = dateMat.getMinutes();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        // const ss = dateMat.getSeconds();
        const timeFormat = hh + ":" + mm + " " + day + "/" + month + "/" + year;
        return timeFormat;
      }
    },
    handlePrint() {
      Printjs({
        printable: "table",
        type: "html",
        // header:"Prepaid Card Flow",
        // headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
        scanStyles: false,
        style:
          "table{table-layout: fixed;border-collapse:collapse;} table tr td,th { padding:10px;border:1px #000 solid; white-space:normal;word-break:break-all; text-align:center}",
      });
    },
    handleExport() {
      this.$confirm("Do you want to export  Card Transactions data?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          return exportExcel(this.query);
        })
        .then((res) => {
          download(res);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.print-container {
  width: 1000px;
  margin: 0 auto;
}
.el-pagination {
  position: relative;
  text-align: right;
  padding: 25px 0 20px 20px;
}
</style>
<style>
.el-upload-dragger {
  height: 150px;
  width: 300px;
}
.el-card__header {
  height: 50px;
}
</style>
