<template>
  <!-- 维护记录 -->
  <el-dialog
    :title="$t('maintainRecords.title')"
    append-to-body
    visible="true"
    @close="$emit('close')"
    width="66%"
  >
    <ul
      v-if="list.length > 0"
      class="infinite-list"
      v-infinite-scroll="load"
      style="overflow: auto"
    >
      <li v-for="item in list" :key="item.id" class="infinite-list-item">
        {{ item.recordContent }}
      </li>
    </ul>
    <p v-else class="no-list">{{ $t("commonContent.noData") }}</p>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('close')">{{ $t("commonContent.confirm") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { modifyRecord } from "@/api/public";
export default {
  props: {
    params: {
      type: Object,
      require: true,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      maintenanceDialogVisible: true,
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      modifyRecord(this.params).then((res) => {
        const { data, code } = res.data;
        if (code === 0) {
          this.list = data;
        }
      });
    },
  },
};
</script>
