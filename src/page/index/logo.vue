<template>
  <div class="avue-logo">
    <transition name="fade">
      <span v-if="keyCollapse" class="avue-logo_subtitle" key="0" v-html="website.smallLogo"></span>
    </transition>
    <transition-group name="fade">
      <template v-if="!keyCollapse">
        <div v-if="language==='zh'" class="avue-logo_title"  key="0" v-html="website.bigLogo"></div>
        <div v-else class="avue-logo_title"  key="1" v-html="website.bigLogoEn"></div>
        <!-- <span>自动化办公流程及进销存管理平台</span> -->
        <!-- <span class="avue-logo_title" key="1" v-html="website.bigLogo"></span> -->
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "logo",
  data() {
    return {};
  },
  created() { },
  computed: {
    ...mapGetters(["language","website", "keyCollapse"]),
  },
  methods: {},
};
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-active {
  transition: opacity 1.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 64px; //跟logo图片高度一致
  line-height: 40px; //文字logo的位置调整
  //background-color: #20222a;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);

  z-index: 1024;

  &_title {
    display: flex;
    align-items: center;
    justify-content: center;
    // text-align: center;
    font-weight: 300;
    // font-size: 20px;
  }

  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
.avue-logo_title{
  width: 100%;
  height: 100%;
}

.avue-logo_title img {
  display: block;
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.imgSmall {
  width: 40px;
  margin-top: 10px;
}</style>
