<template>
  <div class="avue-sidebar" style="padding-top: 64px;">
    <logo></logo>
    <el-scrollbar style="height:100%;">
      <div v-if="validatenull(menu)" class="avue-sidebar--tip">{{$t('menuTip')}}</div>
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
// 模板里第 5 行 v-if="validatenull(menu)" 用到了 validatenull，
// 这里必须 import，否则 Vue 模板编译会 warn + 渲染时拿到 undefined → 整个 el-menu 块不渲染
import { validatenull } from "@/util/validate";

export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  inject: ["index"],
  data() {
    return {};
  },
  created() {
    this.index.openMenu();
    
  },
  mounted(){
    console.log(this.website.menu.props)
    console.log(this.menu)
    console.log('this.tag')
  },
  computed: {
    ...mapGetters([
      "website",
      "menu",
      "tag",
      "keyCollapse",
      "screen",
      "menuId",
    ]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  methods: {},
};
</script>
<style lang="scss">
.avue-sidebar {

  .el-menu {
    background-color: #203b71;
    .el-menu-item,
    .el-menu-item i,
    .el-menu-item.is-active,
    .el-menu-item.is-active i,
    .el-submenu__title,
    .el-submenu__title i {
      color: #fff;
    }
   
    .el-menu-item {
      &.is-active {
        background: rgba(255, 255, 255, 0.21);
      }
      &:hover {
        // background-color: rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.21);
      }
    }
  }
}
</style>

