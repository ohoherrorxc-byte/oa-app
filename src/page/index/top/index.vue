<template>
  <div class="avue-top" v-if="!isMobile">
    <div class="top-bar__left">
      <div class="avue-breadcrumb" :class="[{ 'avue-breadcrumb--active': isCollapse }]" v-if="showCollapse">
        <i class="icon-navicon" @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show" v-if="showMenu">
        <top-menu ref="topMenu"></top-menu>
      </div>
      <span class="top-bar__item" v-if="showSearch">
        <top-search></top-search>
      </span>
    </div>
    <div class="top-bar__right">
      <el-tooltip v-show="showColor" effect="dark" :content="$t('navbar.color')" placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
      <!-- <el-tooltip v-if="showDebug" effect="dark" :content="logsFlag ? $t('navbar.bug') : logsLen + $t('navbar.bugs')"
        placement="bottom">
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip> -->
      <el-tooltip v-if="showLock" effect="dark" :content="$t('navbar.lock')" placement="bottom">
        <div class="top-bar__item">
          <!--          <top-lock></top-lock>-->
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme" effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" v-if="false" :content="$t('navbar.notice')" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-notice></top-notice>
        </div>
      </el-tooltip>
      <!-- v-if="showLang()" -->
      <el-tooltip effect="dark"   :content="$t('navbar.language')" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-lang></top-lang>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showFullScren" effect="dark"
        :content="isFullScren ? $t('navbar.screenfullF') : $t('navbar.screenfull')" placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScren ? 'icon-tuichuquanping' : 'icon-quanping'" @click="handleScreen"></i>
        </div>
      </el-tooltip>
    
      <img class="top-bar__img" :src="userInfo.avatar" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.userName }}
          <i class="el-icon-arrow-down el-icon--right" style="color: #fff;"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!--          <el-dropdown-item>-->
          <!--            <router-link to="/">{{$t('navbar.dashboard')}}</router-link>-->
          <el-dropdown-item @click.native="getIndex" divided>{{ $t('navbar.dashboard') }}</el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">{{ $t('navbar.userinfo') }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>{{ $t('navbar.logOut') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { getIndexRouter, getLoginRouter, resetRouter } from "@/router/router";
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/util";
// import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
// import topLogs from "./top-logs";
import topColor from "./top-color";
import topNotice from "./top-notice";
import topLang from "./top-lang";

export default {
  components: {
    // topLock,
    topMenu,
    topSearch,
    topTheme,
    // topLogs,
    topColor,
    topNotice,
    topLang,
  },
  name: "top",
  data() {
    return {
      isMobile: false
    };
  },
  filters: {},
  created() {
    let screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.$store.commit("SET_IS_MOBILE", this.isMobile);
    console.log(screenWidth)
  },
  mounted() {
    listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      showDebug: (state) => state.common.showDebug,
      showTheme: (state) => state.common.showTheme,
      showLock: (state) => state.common.showLock,
      showFullScren: (state) => state.common.showFullScren,
      showCollapse: (state) => state.common.showCollapse,
      showSearch: (state) => state.common.showSearch,
      showMenu: (state) => state.common.showMenu,
      showColor: (state) => state.common.showColor,
    }),
    ...mapGetters([
      "userInfo",
      "isFullScren",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag",
    ]),
  },
  methods: {
    handleScreen() {
      fullscreenToggel();
    },
    showLang(){
      // console.log('wwwwwwwwww')
      // console.log(this.userInfo)
      return this.userInfo.account==='xuchang'||this.userInfo.account==='admin'||this.userInfo.account==='chenqiang'
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    changeLocale(lang) {
      console.log('222222')
      this.$i18n.locale = lang
      console.log(this.$i18n)
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },

    getIndex() {
      this.$router.push({ path: getIndexRouter() });
    },
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          resetRouter();
          this.$router.push({ path: getLoginRouter() });
          clearInterval(this.$parent.refreshTime);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
