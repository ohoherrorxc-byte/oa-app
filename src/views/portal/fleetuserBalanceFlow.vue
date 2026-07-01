<template>
  <basic-container>
    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="Card No：">
          <el-input
            v-model="query.chargingCardNo"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            placeholder="Card No"
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item label="Allocation Amount：">
          <el-input
            v-model="query.quotaAmountFrom"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="From"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>-</el-form-item>
        <el-form-item>
          <el-input
            v-model="query.quotaAmountTo"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="To"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Allocation Time：">
          <el-date-picker
            size="mini"
            v-model="query.quotaDateFrom"
            oninput="value=value.replace(/[^\d]/g,'')"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="From"
          >
          </el-date-picker>
          -
          <el-date-picker
            size="mini"
            v-model="query.quotaDateTo"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
            oninput="value=value.replace(/[^\d]/g,'')"
            type="date"
            placeholder="To"
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
          :data="data"
          v-loading="loading"
          @selection-change="selectChange"
          style="width: 100%"
        >
          <el-table-column label="ID" type="index" align="center" width="60px">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="Allocation Time"
            :formatter="dateFormat"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="chargingCardNo" label="Card No" align="center">
          </el-table-column>
          <el-table-column prop="vin" label="VIN" align="center">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="Allocation Amount"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="orderNo" label="Order No" align="center">
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
import {
  list,
  exportDistributeExcel,
} from "@/api/portal/vehiclePrepaidCardFlow";
import { download } from "@/util/excel";

export default {
  data() {
    return {
      // 列表数据
      query: {
        chargingCardNo: "",
        orderNo: "",
        turnoverType: 2,
      },
      loading: true,
      data: [],
      multiSelection: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },
  created() {
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
    handleExport() {
      this.$confirm("Do you want to export  Allocation Record data?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          return exportDistributeExcel(this.query);
        })
        .then((res) => {
          download(res);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
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
