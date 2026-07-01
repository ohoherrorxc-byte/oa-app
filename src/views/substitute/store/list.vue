<template>
  <basic-container>
    <TableForm
      ref="TableForm"
      :tableColumn="tableColumn"
      :searchForm="searchForm"
      @handleSubmit="handleSubmit"
    >
      <template #operation="{row}">
        <el-button @click="handleOpenDialog(row,'see')" type="text" icon="el-icon-view">{{$t('commonContent.view')}}</el-button>
        <el-button @click="handleOpenDialog(row,'edit')" type="text" icon="el-icon-edit">{{$t('commonContent.edit')}}</el-button>
      </template>
    </TableForm>
    <SaveOrUpdate :id="rowId" :type="type" ref="SaveOrUpdate" v-if="SaveOrUpdate" @close="close"></SaveOrUpdate>
  </basic-container>
</template>

<script>
import SaveOrUpdate from "./saveOrUpdate";
import { getOptions } from "@/api/base";
import { storeStatus, storeProperties } from "@/util/formSelectList";
export default {
  components: {
    SaveOrUpdate,
  },
  data() {
    return {
      statusList: [],
      propertiesList: [],
      SaveOrUpdate: false,
      rowId: null,
      formData: {},
      searchForm: {
        // delBtn: {
        //   url: "/api/oa-portal/store/delete",
        // },
        column: [
          {
            label: this.$t("substitute.store.storeNo"),
            prop: "storeNo",
          },
          {
            label: this.$t("substitute.store.storeName"),
            prop: "storeName",
          },
          storeProperties,
          storeStatus,
        ],
        btnList: [
          {
            name: this.$t("commonContent.add"),
            icon: "el-icon-setting",
            onClick: () => {
              this.SaveOrUpdate = true;
              this.rowId = null;
              this.type = "add";
            },
          },
        ],
      },
      tableColumn: {
        dicUrl: "/api/oa-portal/store/selectPage",

        column: [
          {
            label: this.$t("substitute.store.storeNo"),
            prop: "storeNo",
          },
          {
            label: this.$t("substitute.store.storeName"),
            prop: "storeName",
          },
          {
            label: this.$t("substitute.store.storeAttr"),
            prop: "storeAttr",
            formatter: ({ storeAttr }) => {
              let obj = this.propertiesList.find(
                (item) => storeAttr === item.dictKey
              );
              return obj ? obj.dictValue : "";
            },
          },
          // {
          //   label: "仓库状态",
          //   prop: "storeState",
          //   formatter: ({ storeState }) => {
          //     let obj = this.statusList.find(
          //       (item) => storeState === item.dictKey
          //     );
          //     return obj ? obj.dictValue : "";
          //   },
          // },
          {
            label: this.$t("substitute.store.storeAddress"),
            prop: "storeAddress",
          },
          {
            label: this.$t("substitute.store.principal"),
            prop: "principal",
          },
          {
            label: this.$t("substitute.store.phone"),
            prop: "phone",
          },
          {
            label: this.$t("substitute.store.remark"),
            prop: "remark",
          },
          {
            label: this.$t("substitute.store.operation"),
            slotName: "operation",
            width: 120,
          },
        ],
      },
    };
  },

  created() {
    this.init();
  },
  methods: {
    init() {
      // [仓库状态]字典配置
      getOptions({ code: "store_status" }).then((res) => {
        this.statusList = res.data.data;
      });
      // [仓库属性]字典配置
      getOptions({ code: "store_properties" }).then((res) => {
        this.propertiesList = res.data.data;
      });
    },
    handleOpenDialog(row, type) {
      this.SaveOrUpdate = true;
      this.rowId = row.id;
      this.type = type;
    },
    close() {
      this.SaveOrUpdate = false;
      this.$refs.TableForm.getList();
    },
  },
};
</script>

<style scoped lang="scss">
</style>
