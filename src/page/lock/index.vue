<template>
  <div class="lock-container">
    <div class="lock-form animated bounceInDown">
      <div class="animated"
           :class="{'shake':passwdError,'bounceOut':pass}">
        <h3 class="title">{{userInfo.username}}</h3>
        <el-input placeholder="Please input unlock password"
                  type="password"
                  class="input-with-select animated"
                  v-model="passwd"
                  @keyup.enter.native="handleLogin">
          <el-button slot="append"
                     icon="icon-bofangqi-suoping"
                     @click="handleLogin"></el-button>
          <el-button slot="append"
                     icon="icon-tuichu"
                     @click="handleLogout"></el-button>
        </el-input>
      </div>

    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import {getLoginRouter, resetRouter} from "@/router/router";
export default {
  name: "lock",
  data() {
    return {
      passwd: "",
      passwdError: false,
      pass: false
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(["tag", "lockPasswd", "refreshTokenId"])
  },
  props: [],
  methods: {
    handleLogout() {
      this.$confirm("Confirm to logout system?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          resetRouter();
          this.$router.push({path: getLoginRouter()});
          //clearInterval(this.$parent.refreshTime);
          clearInterval(this.refreshTokenId);
        });
      });
    },
    handleLogin() {
      if (this.passwd !== this.lockPasswd) {
        this.passwd = "";
        this.$message({
          message: "Unlock password wrong.",
          type: "error"
        });
        this.passwdError = true;
        setTimeout(() => {
          this.passwdError = false;
        }, 1000);
        return;
      }
      this.pass = true;
      setTimeout(() => {
        this.$store.commit("CLEAR_LOCK");
        this.$router.push({
          path: this.$router.$avueRouter.getPath({ src: this.tag.value })
        });
      }, 1000);
    }
  },
  components: {}
};
</script>

<style lang="scss">
.lock-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .title {
    margin-bottom: 8px;
    color: #333;
  }
}
.lock-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // background-image: url("~public/img/bg/login.png");
  background-size: cover;
}
.lock-form {
  width: 350px;
}
</style>
