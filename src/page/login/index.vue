<template>
  <div class="login-container"
       ref="login"
       @keyup.enter.native="handleLogin">
    <top-color v-show="false"></top-color>
    <div class="login-weaper animated bounceInDown">
      <div class="login-left" :style='[isFleet ? {backgroundColor: "#FFF", background: "linear-gradient(45deg, black, transparent)"} :
        isSaic ? {backgroundColor: "#FFF", background: "linear-gradient(45deg, blue, transparent)"} : {}]'>
        <div class="login-time">
          {{time}}
        </div>
        <img class="img" :src="logo" style="width: 220px; " alt="">
        <p class="title" v-if="isFleet">For Fleet User</p>
        <p class="title" v-else-if="isSaic">For Saic User</p>
        <p class="title" v-else="" @click="canLoginWhole=true">For MG Admin</p>
      </div>
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">
            {{ $t('login.title') }}{{website.title}}
            <!--<top-lang></top-lang>-->
          </h4>
          <userLogin ref="userLogin" :canLoginWhole="canLoginWhole" v-if="activeName==='user'"></userLogin>
          <!-- <codeLogin v-else-if="activeName==='code'"></codeLogin>
          <thirdLogin v-else-if="activeName==='third'"></thirdLogin> -->
          <div class="login-menu" v-show="false">
            <a href="#" @click.stop="activeName='user'">{{ $t('login.userLogin') }}</a>
            <!--<a href="#" @click.stop="activeName='code'">{{ $t('login.phoneLogin') }}</a>-->
            <a href="#" @click.stop="activeName='third'">{{ $t('login.thirdLogin') }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import userLogin from "./userlogin";
  // import codeLogin from "./codelogin";
  // import thirdLogin from "./thirdlogin";
  import {mapGetters} from "vuex";
  import {dateFormat} from "@/util/date";
  import {validatenull} from "@/util/validate";
  import topLang from "@/page/index/top/top-lang";
  import topColor from "@/page/index/top/top-color";
  import {getQueryString, getTopUrl} from "@/util/util";
  import {baseUrl,env} from "@/config/env";
  import website from "@/config/website";

  export default {
    name: "login",
    components: {
      userLogin,
      // codeLogin,
      // thirdLogin,
      topLang,
      topColor
    },
    data() {
      return {
        time: "",
        activeName: "user",
        socialForm: {
          tenantId: "000000",
          source: "",
          code: "",
          state: "",
        },
        canLoginWhole:false,
        isFleet: false,
        isSaic: false,
        logo:  `${baseUrl}/img/mg.jfif`,
      };
    },
    watch: {
      $route() {
        this.checkSaic();
        this.$refs.userLogin.checkFleet();
        this.$refs.userLogin.getTenant();
        this.checkFleet();
      }
    },
    created() {
      this.handleLogin();
      this.getTime();
      this.checkSaic();
      console.log(env);
    },
    mounted() {
      this.checkFleet();
    },
    computed: {
      ...mapGetters(["website", "tagWel"])
    },
    props: [],
    methods: {
      checkSaic() {
        //判断是否Saic用户
        this.isSaic = (this.$route.path === website.loginRouterSaic);
        //直接提交mutation，不经过action
        this.$store.commit("SET_IS_SAIC", this.isSaic);
      },
      checkFleet() {
        this.isFleet = this.$refs.userLogin.loginForm.isFleet;
      },
      getTime() {
        setInterval(() => {
          this.time = dateFormat(new Date());
        }, 1000);
      },
      handleLogin() {
        const topUrl = getTopUrl();
        const redirectUrl = "/oauth/redirect/";
        this.socialForm.source = getQueryString("source");
        this.socialForm.code = getQueryString("code");
        this.socialForm.state = getQueryString("state");
        if (validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
          let source = topUrl.split("?")[0];
          source = source.split(redirectUrl)[1];
          this.socialForm.source = source;
        }
        if (!validatenull(this.socialForm.source) && !validatenull(this.socialForm.code) && !validatenull(this.socialForm.state)) {
          const loading = this.$loading({
            lock: true,
            text: '第三方系统登录中,请稍后。。。',
            spinner: "el-icon-loading"
          });
          this.$store.dispatch("LoginBySocial", this.socialForm).then(() => {
            window.location.href = topUrl.split(redirectUrl)[0];
            this.$router.push({path: this.tagWel.value});
            loading.close();
          }).catch(() => {
            loading.close();
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "@/styles/login.scss";
</style>
