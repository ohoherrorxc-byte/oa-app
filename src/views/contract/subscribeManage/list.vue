<template>
  <basic-container>
    <TableForm ref="TableForm" :tableColumn="tableColumn" :searchForm="searchForm" :selection-show="true">
      <!-- <template #menuForm>
        <el-button type="primary" @click="exportDetail"  icon="el-icon-download">导出详情</el-button>
      </template> -->
      <template #operation="{ row }">
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">{{$t('commonContent.viewDetails')}}</el-button>
        </el-row>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import SubscribeManageApi from '@/api/contract/subscribeManage'
import {downBlobFile} from '@/util/util'
export default {
  data() {
    return {
      formData: {},
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/subscribeApply/importSubscribe",
        downloadBtn: {
          url: "/api/oa-portal/subscribeApply/exportSubscribeDetail",
          params: {},
        },
        column: [
          {
            label: this.$t('commonContent.title'),
            prop: "titleName",
          }
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/subscribeApply/selectPage",
        column: [
          {
            label: this.$t('commonContent.title'),
            prop: "titleName",
            width: 130
          },
          {
            label: this.$t('commonContent.applicant'),
            prop: "applyPersonName",
          },
          {
            label: this.$t('commonContent.applyDept'),
            prop: "applyDeptName",
          },
          {
            label: this.$t('commonContent.applyDate'),
            prop: "applyDate",
          },
          {
            label: this.$t('commonContent.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('subscribeManage.applyDesc'),
            prop: "applyDesc",
            width: 150
          },
          {
            label: this.$t('subscribeManage.deductionAmount'),
            prop: "deductionAmount",
          },
          {
            label: this.$t('subscribeManage.receivedTotalAmount'),
            prop: "receivedTotalAmount",
          },
          {
            label: this.$t('subscribeManage.invoiceTotalAmount'),
            prop: "invoiceTotalAmount",
          },
          {
            label: this.$t('subscribeManage.dataSource'),
            prop: "dateSourceTypeName",
          },
          {
            label: this.$t('subscribeManage.auditStatus'),
            prop: "statusName",
          },
          {
            label: this.$t('commonContent.operation'),
            slotName: "operation",
            fixed:'right'
          },
        ],
      },
    };
  },
  created() {
  },
  methods: {
    handleOpenDialog(row) {
      this.$router.push({
        path: "/subscriptionApplication",
        query: {
          businessId: row.id,
          // isEdit: false
        },
      });
    },
   async  exportDetail(){
      let res = await SubscribeManageApi.exportSubscribeDetail()
      downBlobFile(res.data, '认款详情')
    }
  },
};
</script>

<style scoped lang="scss"></style>
