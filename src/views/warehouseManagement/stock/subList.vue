<template>
    <basic-container>
      <SearchForm :searchForm="searchForm" @handleSubmit="handleSubmit">
        <template #operation="{ row }">
          <el-button @click="handleOpenDialog(row, 'see')" type="text" icon="el-icon-view">{{$t('commonContent.see')}}</el-button>
          <el-button v-if="row.status === 1" @click="handleOpenDialog(row, 'edit')" type="text"
            icon="el-icon-edit">{{$t('commonContent.edit')}}</el-button>
          <el-button v-if="row.status === 1" @click="handleDelete(row.id)" type="text" icon="el-icon-delete">{{$t('commonContent.delete')}}</el-button>
        </template>
      </SearchForm>
      <el-table :data="tableData" border :span-method="objectSpanMethod" @selection-change="handleSelectionChange"
        :summary-method="getSummaries" show-summary>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="partsNo" :label="$t('stock.partsNo')"></el-table-column>
        <el-table-column prop="partsName" :label="$t('stock.partsName')" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column prop="parentFunctionName" :label="$t('stock.partsType')"></el-table-column>
        <el-table-column prop="stockInNo" :label="$t('stock.stockInNo')"></el-table-column>
        <el-table-column prop="storeName" :label="$t('stock.storeName')"></el-table-column>
        <el-table-column prop="intoTime" :label="$t('stock.intoTime')"></el-table-column>
        <el-table-column prop="goodsShelvesNo" :label="$t('stock.goodsShelvesNo')"></el-table-column>
        <el-table-column prop="stockNumber" :label="$t('stock.stockNumber')"></el-table-column>
        <el-table-column prop="unitPriceCny" :label="$t('stock.unitPriceCny')"></el-table-column>
        <el-table-column prop="totalStockNumber" :label="$t('stock.totalStockNumber')"></el-table-column>
        <el-table-column prop="totalPriceCny" :label="$t('stock.totalPriceCny')"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background :page-sizes="[10, 20, 50, 100]" :current-page="form.current" :page-size="form.size"
          :total="form.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange"></el-pagination>
      </div>
      <subOutStock :partsNos="partsNos" ref="outStock" v-if="outStock" @close="close"></subOutStock>
    </basic-container>
  </template>
  
  <script>
  import subOutStock from "./subOutStock";
  import {  partsName, storeId } from "@/util/formSelectList";
  import { selectPage } from "@/api/supplyChain/subStock";
  export default {
    components: {
      subOutStock,
    },
    data() {
      return {
        stockStatus: null,
        type: null,
        partsNos: null,
        outStock: false,
        form: {
          current: 1,
          size: 10,
          total: 0,
        },
        searchForm: {
          column: [
            // partsNo,
            {
              label: this.$t('stock.partsNo'),
              prop: "partsNo",
            },
            partsName,
            storeId,
            {
              label: this.$t('stock.goodsShelvesNo'),
              prop: "goodsShelvesNo",
            },
            {
              label: this.$t('stock.intoTime'),
              propRange: ["intoStartTime", "intoEndTime"],
              format: "yyyy-MM-DD",
              valueFormat: "yyyy-MM-DD",
              type: "daterange",
              startPlaceholder: this.$t('commonContent.startDate'),
              endPlaceholder: this.$t('commonContent.endDate'),
            },
          ],
          btnList: [
            {
              name: this.$t('stock.outStock'),
              icon: "el-icon-setting",
              onClick: () => {
                if (!this.partsNos)
                  return this.$message.warning(this.$t('commonContent.pleaseSelectAtLeastOneStock'));
                this.outStock = true;
              },
            },
          ],
        },
        tableData: [],
      };
    },
    activated() {
      this.init();
    },
    mounted(){this.init();},
    methods: {
      handleSubmit(from) {
        this.getList(from);
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
      initialization(table) {
        this.tableData = table
          .map((item) => {
            return item.stockVOList.map((i, index) => {
              let length = 0;
              if (index === 0) {
                length = item.stockVOList.length;
              }
              let totalStockNumber = item.stockVOList
                .map((t) => t.stockNumber)
                .reduce((s1, s2) => s1 + s2, 0);
              return {
                partsNo: i.partsNo,
                partsName: i.partsName,
                parentFunctionName: i.parentFunctionName,
                stockInNo: i.stockInNo,
                storeName: i.storeName,
                intoTime: i.intoTime,
                goodsShelvesNo: i.goodsShelvesNo,
                stockNumber: i.stockNumber,
                unitPriceCny: i.unitPriceCny,
                totalStockNumber,
                totalPriceCny: (i.unitPriceCny * totalStockNumber).toFixed(2),
                length,
              };
            });
          })
          .flat(Infinity);
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (
          columnIndex === 0 ||
          columnIndex === 1 ||
          columnIndex === 2 ||
          columnIndex === 3 ||
          columnIndex === 10 ||
          columnIndex === 11
        ) {
          return {
            rowspan: row.length,
            colspan: 1,
          };
        }
      },
      init() {
        this.getList();
      },
      getList(form) {
        selectPage({ ...this.form, ...form }).then((res) => {
          this.initialization(res.data.data.records);
  
          this.form.total = res.data.data.total;
        });
      },
      handleSelectionChange(val) {
        this.partsNos = val.map((item) => item.partsNo).join(",");
      },
  
      close(val) {
        this.outStock = false;
        if (val) {
          this.getList();
        }
      },
      getSummaries(param) {
        //此处打印param可以看到有两项，一项是columns，一项是data，最后一列可以通过columns.length获取到。
        const { columns, data } = param
        const len = columns.length
        const sums = []
        columns.forEach((column, index) => {
          //如果是第一列，则最后一行展示为“总计”两个字
          if (index === 0) {
            sums[index] = '总计'
            //如果是最后一列，索引为列数-1，则显示计算总和
          } else if (index === len - 1) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              sums[index] = sums[index].toFixed(2)
            } else {
              sums[index] = 'N/A'
            }
            //如果是除了第一列和最后一列的其他列，则显示为空
          } else {
            sums[index] = ''
          }
        })
        return sums
      }
    },
  };
  </script>
  
  <style scoped lang="scss"></style>
  