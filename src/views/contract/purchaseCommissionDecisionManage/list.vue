<template>
  <basic-container>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      :selection-show="true"
      :btnName="$t('commonContent.export')"
    >
      <template #operation="{row}">
        <el-row>
          <el-button @click="handleOpenDialog(row, 'detail')" type="text" icon="el-icon-view">{{$t('commonContent.view')}}</el-button>
        </el-row>
      </template>
    </TableForm>
  </basic-container>
</template>

<script>
import Upload from "@/components/upload";
export default {
  data() {
    return {
      formData: {},
      tableData: [],
      searchForm: {
        uploadBtn: "/api/oa-portal/purchaseCommissionDecision/importPurchaseCommissionDecision",
        column: [
          {
            label:this.$t('bom.project.name'),
            prop: "titleName",
          },
          {
            label: "申请编号",
            prop: "applyNo",
          }
        ],

      },
      tableColumn: {
        dicUrl: "/api/oa-portal/purchaseCommissionDecision/selectPage",
        column: [
          {
            label: this.$t('bom.project.name'),
            prop: "titleName",
            width: 130
          },
          {
            label: this.$t('acceptApply.applicant'),
            prop: "applyPersonName",
          },
          {
            label: this.$t('acceptApply.applyDept'),
            prop: "applyDeptName",
          },
          {
            label:this.$t('acceptApply.applyDate'),
            prop: "applyDate",
          },
          {
            label: this.$t('acceptApply.applyNo'),
            prop: "applyNo",
          },
          {
            label: this.$t('acceptApply.applyDesc'),
            prop: "applyDesc",
            width: 150
          },
          {
            label: this.$t('purchaseCommissionDecision.purchaseType'),
            prop: "purchaseApplyName",
            width: 150
          },
          {
            label:this.$t('commonContent.dataSource'),
            prop: "dateSourceTypeName",
          },
          {
            label:this.$t('commonContent.auditStatus'),
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
  components: {
    Upload,
  },
  methods: {
    handleOpenDialog(row) {
      this.$router.push({
        path: "/purchaseCommissionDecisionApplication",
        query: {
          businessId: row.id,
          // isEdit: false
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
