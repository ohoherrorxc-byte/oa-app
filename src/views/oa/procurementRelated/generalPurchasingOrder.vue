<template>
    <basic-container>
    <div style="color: red; font-weight: bold; margin-bottom: 10px;">
         此列表数据由“一般通用采购申请”一键生成“BOM框架订单”，以草稿形式存在“我的流程”，提交前请核对数据正确性。
       </div>
      <TableForm
        ref="TableForm"
        :tableColumn="tableColumn"
        :searchForm="searchForm"
        :selection-show="true"

      >
        <template #menuForm>
          <!-- <Upload
            :url="purchaseDetailExportUrl"
            @handleRequest="handlePurchaseDetail"
            :size="size"
            :btnName="$t('purchaseApply.importDetail')"
            class="ml10 i-block"
          ></Upload>
          <Upload
            :url="purchaseSupplierExportUrl"
            :btnName="$t('purchaseApply.importSupplier')"
            @handleRequest="handleSubmit"
            :size="size"
            class="ml10 i-block"
          ></Upload> -->
          <!-- <Upload
            :url="purchaseTechEvalExportUrl"
            :btnName="$t('purchaseApply.importTechEval')"
            @handleRequest="handleSubmit"
            :size="size"
            class="ml10 i-block"
          ></Upload> -->
        </template>
        <template #operation="{row}">
          <el-row>
            <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">
              {{ $t('commonContent.view') }}
            </el-button>
            <el-button v-if="row.acceptStatusName==='未验收'" @click="clickAccept(row, 'detail')" type="text" icon="el-icon-view">
              {{ $t('commonContent.OneClickOrder') }}
            </el-button>
          </el-row>
        </template>
      </TableForm>
    </basic-container>
  </template>

  <script>
  import Upload from "@/components/upload";
  import procurementRelatedApi from '@/api/procurementRelated/index'
  export default {
    data() {
      return {
        purchaseDetailExportUrl:'/api/oa-portal/purchaseApply/importPurchaseDetail',
        purchaseSupplierExportUrl:'/api/oa-portal/purchaseApply/importPurchaseSupplier',
        purchaseTechEvalExportUrl:'/api/oa-portal/purchaseApply/importPurchaseTechEval',
        formData: {},
        tableData: [],
        searchForm: {
          // uploadBtn: "/api/oa-portal/purchaseApply/importPurchaseApply",
          downloadBtn: {
            url: "/api/oa-portal/purchaseApply/exportPurchaseApply",
            params: {},
          },
          column: [
            {
              label: "标题名称",
              prop: "titleName",
            },
            {
              label: "申请编号",
              prop: "applyNo",
            },
            {
              label: "申请事由",
              prop: "applyDesc",
            },
            {
              label: this.$t('bom.acceptStatus'),
              prop: "acceptStatus",
              type:'select',
              dicData:[
                {
                  label:"未发起订单",
                  value:0
                },
                {
                  label:"已发起订单",
                  value:1
                }
              ]
            }
          ],

        },
        tableColumn: {
          dicUrl: "/api/oa-portal/purchaseApply/selectPageWithOrderAndStatus",
          column: [
            {
              label: this.$t('acceptApply.title'),
              prop: "titleName",
              width: 130
            },
            {
              label:this.$t('acceptApply.applicant'),
              prop: "applyPersonName",
            },
            {
              label: this.$t('acceptApply.applyDept'),
              prop: "applyDeptName",
            },
            {
              label: this.$t('acceptApply.applyDate'),
              prop: "applyDate",
            },
            {
              label:this.$t('acceptApply.applyNo'),
              prop: "applyNo",
            },
            {
               label:this.$t('acceptApply.applyDesc'),
               prop: "applyDesc",
            },
            {
              label: this.$t('bom.acceptStatus'),
              prop: "acceptStatusName",
              width: 150
            },
            {
              label: this.$t('purchase.exchangeRate'),
              prop: "totalAmountOriginal",
              width: 150
            },
            {
              label: this.$t('purchase.totalAmountRmb'),
              prop: "totalAmountRmb",
              width: 150
            },
            {
              label: this.$t('purchase.singleSupplierReason'),
              prop: "singleSupplierReason",
              width: 150
            },
            {
              label: this.$t('purchaseCommissionDecision.purchaseType'),
              prop: "purchaseTypeName",
              width: 150
            },
            {
              label: this.$t('purchase.useDept'),
              prop: "useDeptName",
              width: 150
            },
            {
              label: this.$t('purchase.expectedPurchaseDate'),
              prop: "expectedPurchaseDate",
              width: 150
            },
            {
              label: this.$t('purchase.isEmergencyPurchase'),
              prop: "isEmergencyPurchaseName",
              width: 150
            },
            {
              label: this.$t('commonContent.dataSource'),//"数据来源"
              prop: "dateSourceTypeName",
            },
            {
              label: this.$t('commonContent.auditStatus'),
              prop: "statusName",
            },
            {
              label: this.$t('commonContent.operation'),
              slotName: "operation",
              fixed:'right',
              width:140
            },
          ],
        },
      };
    },
    created() {
    },
    components: {
      Upload,
    },
    methods: {
      handleOpenDialog(row) {
        this.$router.push({
          path: "/purchaseApplication",
          query: {
            businessId: row.id,
            // isEdit: false
          },
        });
      },
      async clickAccept(row){
        let res = await procurementRelatedApi.saveBomOrderByPurchaseApply({id:row.id})
        if(res.data.code===200){
          this.$message.success('bom订单已生成，请在我的流程查看')
        }
      },
    },
  };
  </script>

  <style scoped lang="scss">
  </style>
