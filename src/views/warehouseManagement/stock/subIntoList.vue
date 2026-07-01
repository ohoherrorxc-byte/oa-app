<template>
    <basic-container>
      <TableForm ref="TableForm" :tableColumn="tableColumn" :searchForm="searchForm" >
        <template slot="payStatus" scope="{row:{ payStatus}}">
          <el-tag v-if=" payStatus == 1">{{ $t('stock.draft') }}</el-tag>
          <el-tag type="warning" v-if=" payStatus == 2">{{ $t('stock.pendingAcceptance') }}</el-tag>
          <el-tag v-if=" payStatus == 3" type="success">{{ $t('stock.accepted') }}</el-tag>
        </template>
        <template #operation="{row}">
          <el-button @click="handleOpenDialog(row,'see')" type="text" icon="el-icon-view">{{ $t('stock.view') }}</el-button>
          <el-button
            v-if="row.payStatus === '1'"
            @click="handleSubmit(row.id)"
            type="text"
            icon="el-icon-view"
          >{{ $t('stock.submit') }}</el-button>
          <el-button
            v-if="row.payStatus === '1'"
            @click="handleOpenDialog(row,'edit')"
            type="text"
            icon="el-icon-edit"
          >{{ $t('stock.edit') }}</el-button>
          <el-button
            v-if="row.payStatus === '1'"
            @click="handleDelete(row.id)"
            type="text"
            icon="el-icon-delete"
          >{{ $t('stock.delete') }}</el-button>
        </template>
      </TableForm>
      <IntoSubStock
        :id="rowId"
        :type="type"
        :payStatus="stockStatus"
        :options="{paymentStatusList,partsMaintListList,stockStateList}"
        ref="intoStock"
        v-if="intoStock"
        @close="close"
      ></IntoSubStock>
    </basic-container>
  </template>
  
  <script>
  import IntoSubStock from "./IntoSubStock";
  import { getOptions,getSubPartsMaintList  } from "@/api/base";
  import { partsNo, partsName, storeId } from "@/util/formSelectList";
  import { saveOrUpdate, stockDelete, submit } from "@/api/supplyChain/subStockInto";
  export default {
    components: {
      IntoSubStock,
    },
    data() {
      return {
        stockStatus: null,
        type: null,
        businessTypeList: [],
        partsMaintListList:[],
        intoStock: false,
        rowId: null,
        formData: {},
        stockStateList:[],
        searchForm: {
          downloadBtn:{
            url:"/api/oa-portal/financeCategoryStockIn/exportStockIn"
          },
          column: [
            {
              label: this.$t('stock.stockInNo'),
              prop: "stockInNo",
            },
            partsNo,
            partsName,
            storeId,
            {
              label: this.$t('stock.goodsShelvesNo'),
              prop: "goodsShelvesNo",
            },
          ],
          btnList: [
            {
              name: this.$t('stock.add'),
              icon: "el-icon-setting",
              onClick: () => {
                this.intoStock = true;
                this.rowId = null;
                this.type = "add";
                this.payStatus = 1;
              },
            },
          ],
        },
        tableColumn: {
          dicUrl: "/api/oa-portal/financeCategoryStockIn/selectPage",
          column: [
            {
              label: "",
              slotName: "payStatus",
            },
            {
              label: this.$t('stock.stockInNo'),
              prop: "stockInNo",
            },
            {
                label: this.$t('stock.partsNo'),
              prop: "partsNo",
            },
            {
              label: this.$t('stock.partsName'),
              prop: "partsName",
            },
            {
              label: this.$t('stock.addStockInNumber'),
              prop: "stockInNumber",
            },
            {
              label: this.$t('stock.stockInPrice'),
              prop: "stockInPrice",
            },
            {
              label: this.$t('stock.intoTime'),
              prop: "intoTime",
            },
            {
              label: this.$t('stock.storeName'),
              prop: "storeName",
            },
            {
              label: this.$t('stock.supplier'),
              prop: "supplier",
            },
            {
              label: this.$t('stock.goodsShelvesNo'),
              prop: "goodsShelvesNo",
            },
  
            {
              label: this.$t('stock.state'),
              prop: "payStatus",
              formatter: ({ payStatus }) => {    
                let obj = this.stockStateList.find(
                  (item) => payStatus == item.dictKey
                );
                return obj ? obj.dictValue : "";
              },
            },
            {
              label: this.$t('stock.operation'),
              slotName: "operation",
              width: 250,
              fixed: "right",
            },
          ],
        },
      };
    },
    mounted(){
      this.init();
    },
    activated() {
      this.init();
    },
    methods: {
      handleSubmit(ids) {
        this.$confirm(this.$t('stock.confirmSubmit'), this.$t('stock.submit'), {
          confirmButtonText: this.$t('stock.confirm'),
          cancelButtonText: this.$t('stock.cancel'),
          type: "warning",
        }).then(() => {
          submit({ ids }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t('stock.submitSuccess'));
              this.$refs.TableForm.getList();
            }
          });
        });
      },
      handleDelete(ids) {
        this.$confirm("确定要删除吗?", "删除", {
          confirmButtonText: this.$t('stock.confirm'),
          cancelButtonText: this.$t('stock.cancel'),
          type: "warning",
        }).then(() => {
          stockDelete({ ids }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t('stock.deleteSuccess'));
              this.$refs.TableForm.getList();
            }
          });
        });
      },
      // 入库
      handleIntoStock(row) {
        this.$confirm(this.$t('stock.confirmInto'), this.$t('stock.into'), {
          confirmButtonText: this.$t('stock.confirm'),
          cancelButtonText: this.$t('stock.cancel'),
          type: "warning",
        }).then(() => {
          saveOrUpdate({ id: row.id, payStatus: 2 }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t('stock.intoSuccess'));
              this.$refs.TableForm.getList();
            }
          });
        });
      },
      init() {
        // 业务类型
        getOptions({ code: "business_type" }).then((res) => {
          this.businessTypeList = res.data.data;
        });
        getOptions({ code: "payment_status" }).then((res) => {
          this.paymentStatusList = res.data.data;
        });
        //零件
        getSubPartsMaintList().then((res) => {
          this.partsMaintListList = res.data.data;
        });
        // 仓库验收
        getOptions({ code: "stock_state" }).then((res) => {
          this.stockStateList = res.data.data;
        });
      },
      handleOpenDialog(row, type) {
        this.intoStock = true;
        this.rowId = row.id;
        this.type = type;
      },
      advanceIntoStock(row, type) {
        this.rowId = row.id;
        this.type = type;
        this.payStatus = 3;
      },
      close(val) {
        this.intoStock = false;
        if (val) {
          this.$refs.TableForm.getList();
        }
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  </style>
  