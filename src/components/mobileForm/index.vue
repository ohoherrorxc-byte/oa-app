<template>
  <div>
    <div class="text-r mb10" v-if="!disabled">
      <span class="add-icon" @click="addRow">+</span>
    </div>
    <MobileTable :data="formList" :option="option" @show="addRow" />
    <MobileForm :option="option" @submit="submit" ref="MobileForm" />
  </div>
</template>
<script>
import MobileForm from "./form.vue";
import MobileTable from "./table.vue";
export default {
  components: {
    MobileForm,
    MobileTable,
  },
  props: {
    option: {
      default: () => [],
    },
    current: {
      default: 1,
    },
    applyList: {
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    disabled() {
      const { businessId, isEdit } = this.$route.query;
      return businessId && !isEdit;
    },
    formList() {
      return this.applyList;
    },
  },
  methods: {
    submit(val) {
      this.formList = val;
      this.$emit("submit", val);
    },
    addRow() {
      if (!this.disabled) {
        this.$refs.MobileForm.show();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.drawer {
  margin: 1rem;
}
</style>