<template>
  <basic-container>
    <TableForm :tableColumn="tableColumn" :searchForm="searchForm"> </TableForm>
    <DialogFrom v-if="dialog"></DialogFrom>
  </basic-container>
</template>

<script>
import DialogFrom from "./dialog.vue";
export default {
  components: {
    DialogFrom,
  },
  data() {
    return {
      dialog: false,
      page: {
        total: 1000,
        currentPage: 1,
        pageSize: 10,
      },
      data: [],
      searchForm: {
        btnList: [
          {
            icon: "el-icon-circle-plus-outline",
            name: this.$t("commonContent.add"),
            onClick: () => {
              this.dialog = true;
            },
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/subscribeApply/selectPage",
        column: [
          {
            label: this.$t("commonContent.title"),
            prop: "title",
          },
          {
            label: this.$t("commonContent.applyPerson"),
            prop: "applyPerson",
          },
          {
            label: this.$t("commonContent.applyDept"),
            prop: "applyDept",
          },
          {
            label: this.$t("commonContent.applyDate"),
            prop: "applyDate",
          },
          {
            label: this.$t("commonContent.applyNo"),
            prop: "applyNo",
          },
          {
            label: this.$t("subscriptionApplication.subscribeDesc"),
            prop: "subscribeDesc",
          },
          {
            label: this.$t("subscriptionApplication.invoiceTotalAmount"),
            prop: "receivedTotalAmount",
          },
          {
            label: this.$t("subscriptionApplication.receivedTotalAmount"),
            prop: "receivedTotalAmount",
          },
          {
            label: this.$t("subscriptionApplication.realReceivedTotalAmount"),
            prop: "realReceivedTotalAmount",
          },
          {
            label: this.$t("subscriptionApplication.deductionAmount"),
            prop: "deductionAmount",
          },
          {
            label: this.$t("commonContent.remarks"),
            prop: "remark",
          },
          {
            label: this.$t("commonContent.operation"),
            prop: "remark",
            slotName: "operation",
          },
        ],
      },
    };
  },

  methods: {
    editBtn(row, index) {
      console.log(row, index);
    },
  },
};
</script>

<style scoped></style>
