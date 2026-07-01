<template>
    <el-table
    v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="countryRegionName"
        :label="title()"
        align="center"
       >
      </el-table-column>
      <el-table-column
        prop="activeCount"
        label="激活数"
        align="center"
       >
      </el-table-column>
      <el-table-column
        prop="invoiced"
        align="center"
        label="已开票数">
      </el-table-column>
      <el-table-column
        prop="toBeInvoice"
        align="center"
        label="待开票数"
       >
      </el-table-column>
      <el-table-column
        prop="payReceived"
        align="center"
        label="已回款">
      </el-table-column>
      <el-table-column
        prop="payPending"
        align="center"
        label="待回款">
      </el-table-column>
    </el-table>
  </template>
  
  <script>
  import {
    getBillList
} from "@/api/billManage/dataBoard";
  import {getLastDay} from '@/util/util'
    export default {
      data() {
        return {
          tableData: [],
          loading:true
        }
      },
      mounted(){
        this.getList()
        // console.log(getLastDay())
      },
      methods:{
        async getList(){
          let res = await getBillList()
          this.loading = false
          if(res.data.code===0){
            this.tableData = res.data.data
          }
        },
        title(){
            return `至${getLastDay()}`
        }
      }
    }
  </script>