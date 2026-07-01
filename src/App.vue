<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  watch: {},
  created() {
   
  },
};
</script>


<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: scroll;
}


::v-deep ep.el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  -webkit-text-fill-color: #606266 !important;
  opacity: 1
}
</style>
