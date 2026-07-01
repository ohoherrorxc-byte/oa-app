<template>
  <el-dropdown trigger="click" @command="handleSetLanguage">
    <span class="el-dropdown-link text-white">
      {{ $t('language') }}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <!-- <el-dropdown trigger="click"
               @command="handleSetLanguage">
    <i class="icon-zhongyingwen"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'"
                        command="zh">中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'"
                        command="en">English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown> -->
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "top-lang",
  data() {
    return {};
  },
  created() {
  },
  mounted() {
    console.log(this.language + "this.language")
    // if(!this.language){
    //   this.$store.commit("SET_LANGUAGE", 'zh');
    // }  
  },
  computed: {
    ...mapGetters(["language", "tag"])
  },
  props: [],
  watch: {
    '$i18n.locale': function (newLocale) {
      // 更新组件内容
      this.$i18n.resetLocaleMessage(this.$i18n.locale); // 清除缓存
      window.location.reload(); // 
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.commit("SET_LANGUAGE", lang);
      let tag = this.tag;
      let title = this.$router.$avueRouter.generateTitle(
        tag.label,
        (tag.meta || {}).i18n
      );
      //根据当前的标签也获取label的值动态设置浏览器标题
      this.$router.$avueRouter.setTitle(title);
    }
  }
};
</script>

<style lang="scss" scoped></style>
