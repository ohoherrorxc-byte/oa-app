<template>
  <basic-container>
    <TableForm ref="TableForm" :tableColumn="tableColumn" :searchForm="searchForm" :selection-show="true"
      @handleSubmit="handleSubmit" :showOverflowTooltip="false">
      <template #orderNo = '{ row }'>
       <div class="flex">
        <el-tag v-if="row.isMerged===1">{{ $t('poOrder.merge') }}</el-tag>
        <div>{{ row.orderNo }}</div>
       </div>
      </template>
      <template #operation="{ row }">
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">{{ $t('poOrder.view') }}</el-button>
          <el-button @click="invoiceDetail(row, 'detail')" type="text" icon="el-icon-printer">{{ $t('poOrder.applyInvoice') }}</el-button>
        </el-row>
        <el-row v-if="row.invoiceStatusName === '审核完成'">
          <el-button @click="printDialog(row, 'detail')" type="text" icon="el-icon-printer">{{ $t('poOrder.viewInvoice') }}</el-button>
        </el-row>
      </template>
      <template #other>
        <el-card class="box-card mb20 mt20">
          <el-row type="flex">
            <el-col style="width: 100px;">{{ $t('poOrder.receiveTotalAmount') }} ：</el-col>
            <el-col style="width: 200px;">CNY &nbsp; {{ $formatAmt(totalAmount.receiveAmount) }}</el-col>
            <el-col style="width: 200px;">USD &nbsp; {{ $formatAmt(totalAmount.receiveAmountUsd) }}</el-col>
          </el-row>

          <el-row type="flex" class="mt10">
            <el-col style="width: 100px;">{{ $t('poOrder.notReceiveTotalAmount') }} ：</el-col>
            <el-col style="width: 200px;">CNY &nbsp; {{ $formatAmt(totalAmount.notReceiveAmount) }}</el-col>
            <el-col style="width: 200px;">USD &nbsp; {{ $formatAmt(totalAmount.notReceiveAmountUsd) }}</el-col>
          </el-row>
        </el-card>
      </template>
    </TableForm>
    <generationRules v-if="generationRules" @close="generationRules = false"></generationRules>
    <print v-if="print" @close="print = false" :pdfUrl="pdfUrl"></print>
  </basic-container>
</template>

<script>
import generationRules from "./generationRules";
import print from "@/components/print/SignPdf";
import { baseUrl } from "@/config/env";
import { collectionConfirm, getTotalAmount, mergeSalesOrder } from "@/api/billManage/poOrder";
import constData from "@/config/constData";

export default {
  components: {
    generationRules,
    print,
  },
  data() {
    return {
      formData: {},
      totalAmount: {
        receiveAmount: "",
        notReceiveAmount: "",
        receiveAmountUsd: "",
        notReceiveAmountUsd: "",
      },
      collectionStatus: constData.constData,
      pdfUrl: baseUrl + "/img/2023年7月泰国License收款账单.pdf",
      print: false,
      generationRules: false,
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/saleOrder/importSaleOrder",
        column: [

          {
            label: this.$t('poOrder.orderNo'),
            prop: "orderNo",
          },
          {
            label: this.$t('poOrder.month'),
            prop: "order",
            propRange: ["orderStartMonth", "orderEndMonth"],
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
          },
          "countryReginCode",
          "custId",
          "collectionStatus",
          {
            label: this.$t('poOrder.invoiceNo'),
            prop: "invoiceNo",
          },
        ],
        btnList: [
          {
            name: this.$t('poOrder.salesOrderGenerationRules'),
            icon: "el-icon-setting",
            onClick: () => {
              this.generationRules = true;
            },
          },
          {
            name: this.$t('poOrder.orderMerge'),
            icon: "el-icon-setting",
            onClick: () => {
              let list = Object.values(this.$refs.TableForm.multipleSelection).flat(Infinity);
              if (!list || list.length < 1) {
                return this.$message.error(this.$t('poOrder.pleaseSelectAtLeastOneData'));
              }
              let ids = list.map((item) => item.id).join(",");
              mergeSalesOrder({
                ids: ids,
              }).then((res) => {
                if (res.data.code === 0) {
                  this.$message.success(this.$t('poOrder.orderMergeSuccess'));
                }
              });
              console.log("this.multipleSelection-->" + this.$refs.TableForm.multipleSelection)
            },
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/saleOrder/selectPage",

        column: [
        //  {
        //     label: "",
        //     prop: "isMerged",
        //     slotName: "isMerged"
        //   },
          {
            label: this.$t('poOrder.orderNo'),
            prop: "orderNo",
            width: 150,
            slotName:'orderNo'
          },
          // {
          //   label: "月份",
          //   prop: "orderMonth",
          // },
          {
            label: this.$t('poOrder.country'),
            prop: "countryRegin",
          },
          {
            label: this.$t('poOrder.salesContract'),
            prop: "contractName",
            width: 140
          },
          {
            label: this.$t('poOrder.invoiceNo'),
            prop: "invoiceNo",
          },
          {
            label: this.$t('poOrder.invoiceName'),
            prop: "invoiceName",
            width: 140
          },
          // {
          //   label: "标题",
          //   prop: "orderName",
          // },
          // {
          //   label: "销售合同",
          //   prop: "contractName",
          // },
          // {
          //   label: "相关项目",
          //   prop: "projectName",
          // },
          // {
          //   label: "客户",
          //   prop: "custName",
          // },
          // {
          //   label: "收款状态",
          //   prop: "collectionStatus",
          //   formatter: (val) => {
          //     return this.$findByvalue(
          //       constData.collectionStatus,
          //       val.collectionStatus
          //     );
          //   },
          // },
          // {
          //   label: "币种",
          //   prop: "currency",
          // },
          // {
          //   label: "订单总额",
          //   prop: "orderTotalAmount",
          // },
          // {
          //   label: "数据来源",
          //   prop: "dateSourceTypeName",
          // },
          {
            label: this.$t('poOrder.salesType'),
            prop: "saleType",
          },
          {
            label: this.$t('poOrder.invoiceStatus'),
            prop: "invoiceStatusName",
          },
          {
            label: this.$t('poOrder.operation'),
            slotName: "operation",
            width: 140,
          },
        ],
      },
    };
  },
  created() {
    // this.getTotalAmount();
  },
  methods: {
    handleSubmit(data) {
      this.formData = data;
      this.getTotalAmount(data);
    },
    getTotalAmount(data) {
      getTotalAmount(data).then((res) => {
        if (res.data.code === 0) {
          this.totalAmount = res.data.data;
        }
      });
    },
    handleOpenDialog(row) {
      this.$router.push({
        path: "/billManage/poOrder/add",
        query: {
          id: row.id,
        },
      });
    },
    invoiceDetail(row) {
      // this.print = true;
      this.$router.push({
        path: "/billManage/poOrder/invoice",
        query: {
          salesOrderNo: row.orderNo,
        },
      });
    },
    printDialog(row) {
      // this.print = true;
      this.$router.push({
        path: "/billManage/poOrder/invoiceView",
        query: {
          salesOrderNo: row.orderNo,
        },
      });
    },
    remarkBill(row) {
      this.$confirm(this.$t('poOrder.billHasBeenChecked'), this.$t('poOrder.prompt'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.lookAgain'),
        type: "warning",
      })
        .then(() => {
          collectionConfirm({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t('poOrder.confirmReceiptSuccess'));
              this.$refs.TableForm.getList();
              this.getTotalAmount(this.formData);
            }
          });
        })
        .catch(() => { });
    },
  },
};
</script>

<style scoped lang="scss"></style>
