<template>
  <basic-container>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      @handleSubmit="handleSubmit"
      @searchForm="searchFormFn">
      <template #other>
        <el-row class="mb20">
          <el-col :span="24">{{$t('table.total')}}：CNY{{formData.totalAmount }}</el-col>
        </el-row>
        <el-row class="mb20">
          <el-col :span="8">{{$t('table.openedAmount')}}：CNY {{formData.openedAmount }}</el-col>
          <el-col :span="16">{{$t('table.shouldOpenNotOpenAmount')}}：CNY {{formData.shouldOpenNotOpenAmount }}</el-col>
        </el-row>
        <el-row class="mb20">
          <el-col :span="8">{{$t('table.collectionTotalAmount')}}：CNY {{formData.collectionTotalAmount }}</el-col>
          <el-col :span="16">{{$t('table.shouldReceiveNotReceiveAmount')}}：CNY {{formData.shouldReceiveNotReceiveAmount }}</el-col>
        </el-row>
      </template>
      <template #operation = "{row}" >
        <el-button type="text" @click="handleOpenDialog(row,'detail')"> {{$t('table.view')}}</el-button>
        <el-button type="text" @click="handleOpenDialog(row,'generate')" v-if="row.salesType === 'nre'">{{$t('table.generateOrder')}}</el-button>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import constData from "@/config/constData";
import { getTotal,generateSalesOrder } from "@/api/contract/salesContractNew";
export default {
  data() {
    return {
      formData: {},
      collectionStatus: constData.constData,

      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/salesContractNew/importSalesContract",
        downloadBtn: {
          url: "/api/oa-portal/salesContractNew/exportSalesContract",
          params: {},
        },
        column: [
          {
            label: this.$t('table.applyDept'),
            prop: "applyDept",
            type: "select",
            filterable:true,
            dicUrl: `/api/oa-system/dept/tree?tenantId=${
              JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
            }`,
            props: {
              label: "title",
              value: "id",
            },
          },
          {
            label: this.$t('table.applyDate'),
            prop: "applyDate",
            propRange: ["applyStartDate", "applyEndDate"],
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
          },
          {
            label: this.$t('table.applyNo'),
            prop: "applyNo",
          },

          {
            label: this.$t('table.salesContractCategory'),
            prop: "salesContractCategory",
            type: "select",
            dicUrl: "/api/oa-system/dict/dictionary?code=CONTRACT_CATEGORY",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
          },
          {
            label: this.$t('table.salesContractType'),
            prop: "salesContractType",
            type: "select",
            dicUrl: "/api/oa-system/dict/dictionary?code=CONTRACT_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
          },
          {
            label: this.$t('table.applyPerson'),
            type: "select",
            prop: "applyPerson",
            filterable:true,
            dicUrl: `/api/oa-user/user-list?tenantId=${
              JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
            }`,
            props: {
              label: "realName",
              value: "id",
            },
          },
          {
            label: this.$t('table.custName'),
            type: "select",
            filterable:true,
            dicUrl: `/api/oa-portal/contractCustomer/selectList`,
            props: {
              label: "custName",
              value: "id",
            },
            prop: "custId",
          },
          {
            label: this.$t('table.salesType'),
            prop: "salesType",
            type: "select",
            dicUrl: "/api/oa-system/dict/dictionary?code=SALE_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/salesContractNew/selectPage",
        column: [
          {
            label: this.$t('table.applyDept'),
            prop: "applyDeptName",
          },
          {
            label: this.$t('table.applyDate'),
            prop: "applyDate",
          },
          {
            label: this.$t('table.applyNo'),
            prop: "applyNo",
            width: 120,
            sortable:true
          },
          {
            label: this.$t('table.salesContractTitle'),
            prop: "titleName",
          },
          {
            label: this.$t('table.salesContractCategory'),
            prop: "salesContractCategoryName",
          },
          {
            label: this.$t('table.payMethod'),
            prop: "payMethodName",
          },
          {
            label: this.$t('table.contractPerformPlace'),
            prop: "contractPerformPlaceName",
          },
          {
            label: this.$t('table.salesContractAmount'),
            prop: "salesContractAmount",
          },
          {
            label: this.$t('table.applyDesc'),
            prop: "applyDesc",
          },
          {
            label: this.$t('table.salesContractContent'),
            prop: "salesContractContent",
          },
          {
            label: this.$t('table.remark'),
            prop: "remark",
          },
          {
            label: this.$t('table.taxRate'),
            prop: "taxRate",
          },
          {
            label: this.$t('table.shouldOpenNotOpenAmount'),
            prop: "shouldOpenNotOpenAmount",
          },
          {
            label: this.$t('table.shouldReceiveNotReceiveAmount'),
            prop: "shouldReceiveNotReceiveAmount",
          },
          {
            label: this.$t('table.status'),
            prop: "statusName",
          },
          {
            label: this.$t('table.createDate'),
            prop: "createTime",
          },
          {
            label: this.$t('table.contractName'),
            prop: "titleName",
          },
          {
            label: this.$t('table.createUser'),
            prop: "createUserName",
          },
          {
            label: this.$t('table.salesContractType'),
            prop: "salesContractTypeName",
          },
          {
            label: this.$t('table.applyPerson'),
            prop: "applyPersonName",
          },
          {
            label: this.$t('table.custName'),
            prop: "custName",
          },
          {
            label: this.$t('table.projectName'),
            prop: "projectName",
          },
          {
            label: this.$t('table.updateUser'),
            prop: "updateUserName",
          },
          {
            label: this.$t('table.salesType'),
            prop: "salesTypeName",
          },
          {
            label: this.$t('table.updateDate'),
            prop: "updateTime",
          },
          {
            label: this.$t('table.currency'),
            prop: "currency",
          },
          {
            label: this.$t('table.exchangeRate'),
            prop: "exchangeRate",
          },
          {
            label: this.$t('table.salesContractTotalAmount'),
            prop: "salesContractTotalAmount",
          },
          {
            label: this.$t('table.salesContractTotalAmountOriginal'),
            prop: "salesContractTotalAmountOriginal",
          },
          {
            label: this.$t('table.salesContractTotalAmountRmb'),
            prop: "salesContractTotalAmountRmb",
          },
          {
            label: this.$t('table.openedAmount'),
            prop: "openedAmount",
          },
          {
            label: this.$t('table.notOpenedAmount'),
            prop: "notOpenedAmount",
          },
          {
            label: this.$t('table.implementTime'),
            prop: "implementTime",
          },
          {
            label: this.$t('table.operation'),
            slotName : 'operation',
            fixed:'right',
            width: 130
          },
        ],
      },
    };
  },
  methods: {
    searchFormFn(form) {
      console.log(form);
      getTotal(form).then((res) => {
        this.formData = res.data.data;
      });
    },
    handleOpenDialog(row,type){
      if (type === 'detail'){
        this.$router.push({
          path: "/saleContractApplication",
          query: {
            businessId: row.id,
          },
        });
      } else if (type === 'generate'){
        const id = row.id;
        generateSalesOrder({id}).then((res) => {
          if (res.data.code === 0){
            this.$message.success(res.data.message);
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
