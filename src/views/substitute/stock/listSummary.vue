<template>
  <basic-container>
    <SearchForm @refresh="refresh" :searchForm="searchForm" @handleSubmit="handleSubmit">
      <template #operation="{ row }">
        <el-button @click="handleOpenDialog(row, 'see')" type="text" icon="el-icon-view">{{ $t('commonContent.see')
        }}</el-button>
        <el-button v-if="row.status === 1" @click="handleOpenDialog(row, 'edit')" type="text" icon="el-icon-edit">{{
          $t('commonContent.edit') }}</el-button>
        <el-button v-if="row.status === 1" @click="handleDelete(row.id)" type="text" icon="el-icon-delete">{{
          $t('commonContent.delete') }}</el-button>
      </template>
    </SearchForm>

    <div v-for="(item,index) in tableData" class="mb10" :key="index">
      <el-row class="">
        <el-col span="8">零件号：{{ item.partsNo }}</el-col>
        <el-col span="16">零件名称：{{ item.partsName }}</el-col>
      </el-row>
      <el-row class="">
        <el-col span="8">入库总数量：{{ item.stockInTotal }}</el-col>
        <el-col span="8">出库总数量：{{ item.stockOutTotal }}</el-col>
        <el-col span="8">库存总数量：{{ item.stockTotal }}</el-col>
      </el-row>
      <div class="my10">入库&库存详情</div>
      <el-table    height="250" :data="item.stockVOList" border @selection-change="handleSelectionChange" show-summary
        :summary-method="getSummariesIn">
        <el-table-column type="index" width="55"></el-table-column>
        <!-- <el-table-column prop="partsNo" :label="$t('stock.partsNo')"></el-table-column>
        <el-table-column prop="partsName" :label="$t('stock.partsName')" show-overflow-tooltip width="130"></el-table-column> -->
        <el-table-column prop="parentFunctionName" :label="$t('stock.partsType')"></el-table-column>
        <el-table-column prop="stockInNo" :label="$t('stock.stockInNo')"></el-table-column>
        <el-table-column prop="stockInNumber" :label="$t('stock.stockInNumber')"></el-table-column>
        <el-table-column prop="storeName" :label="$t('stock.storeName')"></el-table-column>
        <el-table-column prop="intoTime" :label="$t('stock.intoTime')"></el-table-column>
        <el-table-column prop="goodsShelvesNo" :label="$t('stock.goodsShelvesNo')"></el-table-column>
        <el-table-column prop="stockNumber" :label="$t('stock.stockNumber')"></el-table-column>
        <!-- <el-table-column prop="unitPriceCny" :label="$t('stock.unitPriceCny')"></el-table-column> -->
        <!-- <el-table-column prop="totalStockNumber" :label="$t('stock.totalStockNumber')"></el-table-column>
        <el-table-column prop="totalPriceCny" :label="$t('stock.totalPriceCny')"></el-table-column> -->
      </el-table>
      <div class="my10">出库信息</div>
      <el-table   height="250" :data="item.stockOutVOList" border @selection-change="handleSelectionChange" show-summary
        :summary-method="getSummariesOut">
        <el-table-column type="index" width="55"></el-table-column>
        <!-- <el-table-column prop="partsNo" :label="$t('stock.partsNo')"></el-table-column>
        <el-table-column prop="partsName" :label="$t('stock.partsName')" show-overflow-tooltip width="130"></el-table-column> -->
        <el-table-column prop="stockOutNo" :label="$t('stockOut.number')"></el-table-column>
        <el-table-column prop="stockOutNumber" :label="$t('stockOut.quantity')"></el-table-column>
        <el-table-column prop="stockOutDate" :label="$t('stockOut.date')"></el-table-column>
        <el-table-column prop="batchNo" :label="$t('commonContent.batchNo')"></el-table-column>
        <el-table-column prop="status" :formatter="formatterStaus" :label="$t('commonContent.status')"></el-table-column>
        <el-table-column prop="ladingNo" :label="$t('stockOut.ladingNo')"></el-table-column>
        <el-table-column prop="useTo" :formatter="formatterUseTo" :label="$t('stockOut.purpose')"></el-table-column>
        <el-table-column prop="invoiceNo" :label="$t('commonContent.invoiceNo')"></el-table-column>
        <el-table-column prop="stockInNo" :label="$t('stock.stockInNo')"></el-table-column>
        <el-table-column prop="intoTime" :label="$t('stock.intoTime')"></el-table-column>
        <el-table-column prop="remark" label="出库备注"></el-table-column>
        <el-table-column prop="tradeMode" :label="$t('stockOut.tradeMode')"></el-table-column>
        <el-table-column prop="departureTime" :label="$t('stockOut.departureTime')"></el-table-column>
        <el-table-column prop="arrivalTime" :label="$t('stockOut.arrivalTime')"></el-table-column>
        <!-- <el-table-column prop="totalPriceCny" :label="$t('stock.totalPriceCny')"></el-table-column> --> -->
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background :page-sizes="[10, 20, 50, 100]" :current-page="form.current" :page-size="form.size"
        :total="form.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"></el-pagination>
    </div>
    <OutStock :partsNos="partsNos" ref="outStock" v-if="outStock" @close="close"></OutStock>
  </basic-container>
</template>
  
<script>
import OutStock from "./outStock";
import { getOptions } from "@/api/base";
import { partsName, storeId } from "@/util/formSelectList";
import { selectPageSummary, exportAll } from "@/api/substitute/stock";
import { downBlobFile } from '@/util/util'
export default {
  components: {
    OutStock,
  },
  data() {
    return {
      useToList: [],
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
          // {
          //   span:16,
          //   label: '日期',
          //   prop: "dateRange",
          //   type: 'datetimerange',
          //   format: 'yyyy-MM-dd HH:mm:ss',
          //   valueFormat: 'yyyy-MM-dd HH:mm:ss',
          // },
          // {
          //   filterable:true,
          //   label: this.$t("commonContent.partsName"),
          //   dicUrl: "/api/oa-portal/partsMaint/selectlist",
          //   props: {
          //     label: "partsName",
          //     value: "partsNo",
          //   },
          //   prop: "partsNo",
          //   type:"select"
          // },
          // partsName,
          // storeId,
          // {
          //   label: "仓库",
          //   dicUrl: "/api/oa-portal/store/select",
          //   props: {
          //     label: "storeName",
          //     value: "id",
          //   },
          //   prop: "storeId",
          // },
          // {
          //   label: this.$t('stock.goodsShelvesNo'),
          //   prop: "goodsShelvesNo",
          // },
          // {
          //   label: this.$t('stock.intoTime'),
          //   propRange: ["intoStartTime", "intoEndTime"],
          //   format: "yyyy-MM-DD",
          //   valueFormat: "yyyy-MM-DD",
          //   type: "daterange",
          //   startPlaceholder: this.$t('commonContent.startDate'),
          //   endPlaceholder: this.$t('commonContent.endDate'),
          // },
        ],
        btnList: [
          // {
          //   name: this.$t('stock.outStock'),
          //   icon: "el-icon-setting",
          //   onClick: () => {
          //     if (!this.partsNos)
          //       return this.$message.warning(this.$t('commonContent.pleaseSelectAtLeastOneStock'));
          //     this.outStock = true;
          //   },
          // },
          {
            name: this.$t('orderManage.export'),
            icon: "el-icon-setting",
            onClick: () => {
              this.exportTabalPage()
            },
          }
        ],
      },
      tableData: [],
    };
  },

  activated() {
    this.init();
  },
  mounted() { this.init(); },
  methods: {
    handleSubmit(from) {
      this.getList(from);
    },
   async exportTabalPage(){
      let res = await exportAll(this.form)
      console.log(res)
      if(res.status===200){
        downBlobFile(res.data, '出入库总表.xlsx')
      }
   
    },
    formatterUseTo(row, column) {
      let item = this.useToList.find(ele => {
        return Number(ele.dictKey) == row.useTo
      })
      if (item) {
        return item.dictValue
      }
    },
    formatterStaus(row) {
      let obj = {
        0: '草稿',
        1: '已提交'
      }
      return obj[row.status]
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
    refresh() {
      this.getList();
    },
    // initialization(table) {
    //   this.tableData = table
    //     .map((item) => {
    //       return item.stockVOList.map((i, index) => {
    //         let length = 0;
    //         if (index === 0) {
    //           length = item.stockVOList.length;
    //         }
    //         let totalStockNumber = item.stockVOList
    //           .map((t) => t.stockNumber)
    //           .reduce((s1, s2) => s1 + s2, 0);
    //         return {
    //           partsNo: i.partsNo,
    //           partsName: i.partsName,
    //           parentFunctionName: i.parentFunctionName,
    //           stockInNo: i.stockInNo,
    //           storeName: i.storeName,
    //           intoTime: i.intoTime,
    //           goodsShelvesNo: i.goodsShelvesNo,
    //           stockNumber: i.stockNumber,
    //           unitPriceCny: i.unitPriceCny,
    //           totalStockNumber,
    //           totalPriceCny: (i.unitPriceCny * totalStockNumber).toFixed(2),
    //           length,
    //         };
    //       });
    //     })
    //     .flat(Infinity);
    // },
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
      getOptions({ code: "useTo" }).then((res) => {
        this.useToList = res.data.data;
      });
    },
    getList(form) {
      selectPageSummary({ ...this.form, ...form }).then((res) => {
        // this.initialization(res.data.data.records);
        this.tableData = res.data.data.records
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
    getSummariesOut(param) {
      return this.getSummaries(param, [2])
    },
    getSummariesIn(param) {
      return this.getSummaries(param, [3, 7])
    },
    getSummaries(param, indexArr) {
      //此处打印param可以看到有两项，一项是columns，一项是data，最后一列可以通过columns.length获取到。
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        //如果是第一列，则最后一行展示为“总计”两个字
        if (index === 0) {
          sums[index] = '总计'
        } else if (indexArr.includes(index)) {
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
            sums[index] = sums[index]
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
  