<template>
  <div>
    <div style="width: 100%; height: 40px; background-color: #999; color: white; font-weight: bolder; line-height: 250%; " align="center">
      Balance Inquiry
    </div>
    <basic-container>
      <el-row style="font-size: 14px; " type="flex" justify="space-between">
        <el-col :span="12"><span style="font-weight: bold; ">Card:</span> {{ query.chargingCardNo }}</el-col>
        <el-col :span="12" align="right"><span style="font-weight: bold; ">Balance:</span> ฿{{ balance }}</el-col>
      </el-row>
      <el-row>
        <el-col align="middle"><span style="font-size: 12px; font-weight: bold; ">Consumption Records</span></el-col>
      </el-row>
      <avue-crud
        :option="option"
        :table-loading="loading"
        :data="data"
        :page.sync="page"
        @on-load="onLoad"
      >
        <template slot-scope="{row}" slot="chargingMinutes">
          {{ row.chargingMinutes }}min
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {listForScan} from "@/api/portal/vehiclePrepaidCardFlow";
import {getUserCardByNo} from "@/api/portal/vehiclePrepaidCard";

export default {
  name: "balance",
  data() {
    return {
      query: {},
      balance: 0,
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        layout: "total, pager"
      },
      option: {
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        menu: false,
        border: true,
        emptyText: "No data",
        column: [
          {
            label: 'Time',
            prop: 'startTime',
            type: "datetime",
            format: "HH:mm dd/MM/yyyy",
          },
          {
            label: 'Amount',
            prop: 'amount'
          },
          {
            label: 'Type',
            prop: 'turnoverType',
            dicData: [{value: 1, label: "Charging"}, {value: 2, label: "Distribution"}],
          },
          {
            label: 'Duration',
            prop: 'chargingMinutes'
          },
        ]
      },
      data: [],
    }
  },
  created() {
    this.query.tenantId = this.$route.query.t;
    this.query.chargingCardNo = this.$route.query.c;
    this.query.turnoverType = 1;
  },
  mounted() {
    //this.$nextTick(()=>{
      const ele = document.getElementsByClassName("avue-crud__menu");
      //console.log(ele);
      ele[0].parentNode.removeChild(ele[0]);
    //})
  },
  methods: {
    onLoad(page, params = {}) {
      getUserCardByNo(this.query.chargingCardNo, { tenantId: this.query.tenantId }).then(res => {
        this.balance = res.data.data.balance;
      });
      this.loading = true;
      listForScan(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;

        this.$nextTick(() => {
          var arr = document.getElementsByClassName("cell");
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].innerHTML === '') {
              //console.log(arr[i]);
              arr[i].parentNode.removeChild(arr[i]);
            }
          }
        })

      });
    },
  }
}
</script>

<style scoped>

</style>
