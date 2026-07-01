<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input @keyup.enter.native="handleLogin" v-model="loginForm.tenantId" auto-complete="off"
        :placeholder="$t('login.tenantId')">
        <i slot="prefix" class="icon-quanxian" />
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input @keyup.enter.native="handleLogin" v-model="loginForm.username" auto-complete="off"
        :placeholder="$t('login.username')">
        <i slot="prefix" class="icon-yonghu" />
        <i slot="suffix" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input maxlength="20" @keyup.enter.native="handleLogin" :type="passwordType" v-model="loginForm.password"
        auto-complete="off" :placeholder="$t('login.password')">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword" />
        <!--<i slot="suffix" class="el-input__icon el-icon-search"/>-->
        <i slot="prefix" class="icon-mima" />
      </el-input>
    </el-form-item>
    <el-form-item v-if="this.website.captchaMode" prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input @keyup.enter.native="handleLogin" v-model="loginForm.code" auto-complete="off"
            :placeholder="$t('login.code')">
            <i slot="prefix" class="icon-yanzhengma" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="loginForm.image" class="login-code-img" @click="refreshCode" />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item style="margin-top: 20px">
      <el-button type="primary" @click.native.prevent="handleLogin" class="login-submit">{{ $t("login.submit") }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button  class="login-submit-whole" @click="toLoginWhole">SAIC—IDM 登录</el-button>
    </el-form-item>
    <el-dialog title="用户信息选择" append-to-body :visible.sync="userBox" width="350px">
      <avue-form :option="userOption" v-model="userForm" @submit="submitLogin" />
    </el-dialog>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { info } from "@/api/system/tenant";
import { getCaptcha } from "@/api/user";
import { getTopUrl } from "@/util/util";
import website from "@/config/website";
// import Store from "@/store/";
import watermark from '@/util/watermark'
import {baseUrl,env} from "@/config/env";
export default {
  name: "userlogin",
  data() {
    return {
      tenantMode: this.website.tenantMode,
      loginForm: {
        //租户ID
        tenantId: "",
        //部门ID
        deptId: "",
        //角色ID
        roleId: "",
        //用户名
        username: "",
        //密码
        password: "",
        //账号类型
        type: "account",
        //验证码的值
        code: "",
        //验证码的索引
        key: "",
        //是否大客户登录
        isFleet: false,
        //预加载白色背景
        image:
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      },
      loginRules: {
        tenantId: [
          {
            required: false,
            message: "Please input tenant ID",
            trigger: "blur",
          },
          { pattern: /^[0-9]{6}$/, message: "Must be 6 digits" },
        ],
        username: [
          { required: true, message: "Please input username", trigger: "blur" },
          { pattern: /^[^\s]*$/, message: "Space not allowed" },
        ],
        password: [
          { required: true, message: "Please input password", trigger: "blur" },
          {
            min: 3,
            message: "Password must be more than 3 characters",
            trigger: "blur",
          },
          { pattern: /^[^\s]*$/, message: "Space not allowed" },
        ],
      },
      passwordType: "password",
      userBox: false,
      userForm: {
        deptId: "",
        roleId: "",
      },
      userOption: {
        labelWidth: 70,
        submitBtn: true,
        emptyBtn: false,
        submitText: "登录",
        column: [
          {
            label: "部门",
            prop: "deptId",
            type: "select",
            props: {
              label: "deptName",
              value: "id",
            },
            dicUrl: "/api/oa-system/dept/select",
            span: 24,
            display: false,
            rules: [
              {
                required: true,
                message: "请选择部门",
                trigger: "blur",
              },
            ],
          },
          {
            label: "角色",
            prop: "roleId",
            type: "select",
            props: {
              label: "roleName",
              value: "id",
            },
            dicUrl: "/api/oa-system/role/select",
            span: 24,
            display: false,
            rules: [
              {
                required: true,
                message: "请选择角色",
                trigger: "blur",
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.getTenant();
    this.refreshCode();
    this.checkFleet();
    watermark.set('remove')
  },
  mounted() { },
  watch: {
    "loginForm.deptId"() {
      const column = this.findObject(this.userOption.column, "deptId");
      if (this.loginForm.deptId.includes(",")) {
        column.dicUrl = `/api/oa-system/dept/select?deptId=${this.loginForm.deptId}`;
        column.display = true;
      } else {
        column.dicUrl = "";
      }
    },
    "loginForm.roleId"() {
      const column = this.findObject(this.userOption.column, "roleId");
      if (this.loginForm.roleId.includes(",")) {
        column.dicUrl = `/api/oa-system/role/select?roleId=${this.loginForm.roleId}`;
        column.display = true;
      } else {
        column.dicUrl = "";
      }
    },
  },
  computed: {
    ...mapGetters(["tagWel", "userInfo"]),
  },
  props:{
    canLoginWhole:{
      type:Boolean,
      require:false
    }
  },
  methods: {
    checkFleet() {
      if (this.$route.path === website.loginRouterFleet)
        this.loginForm.isFleet = true;
      else this.loginForm.isFleet = false;
      // if (Store.state.user.isSaic)
      //   this.loginForm.tenantId = "629965";
      // else
      //   this.loginForm.tenantId = "116914";
      this.loginForm.tenantId = "629965";
    },
    refreshCode() {
      if (this.website.captchaMode) {
        getCaptcha().then((res) => {
          const data = res.data;
          this.loginForm.key = data.key;
          this.loginForm.image = data.image;
        });
      }
    },
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    submitLogin(form, done) {
      if (form.deptId !== "") {
        this.loginForm.deptId = form.deptId;
      }
      if (form.roleId !== "") {
        this.loginForm.roleId = form.roleId;
      }
      this.handleLogin();
      done();
    },
    toLoginWhole(){
      console.log(process.env)
      console.log(env)
     let url = env.NODE_ENV!=='development'?
    // "https://10.30.4.61:30239/oa/%23/askForLeave?businessId=1753968532243333122%26taskId=2156701c-13f6-11ef-8748-005056b168aa%26type=waitDone%26processIsFinished=back%26status=back%26isHome=true%26isQIWei=true&ofsComeFrom=e9"
      //"https://sso-pv.saicmotor.com/idp/oauth2/authorize?state=123&client_id=OIMTOA&response_type=code&redirect_uri=https%3A%2F%2Foa.soimt.cn%3A443%2Foa%2F%23%2Ffirewall%3FbusinessId%3D1752599849481666562%26taskId%3D547fad52-c31f-11ee-b1c8-86cf49b8eb08%26type%3DhaveDone%26processIsFinished%3Dfinished%26status%3Dfinished"
     //"https://sso-pv.saicmotor.com/idp/oauth2/authorize?state=123&client_id=OIMTOA&response_type=code&redirect_uri=https%3A%2F%2Foa.soimt.cn%3A443%2Foa%2F%23%2Foa%2Fweather%3FbusinessId%3D1751935206375424001"
    "https://sso-pv.saicmotor.com/idp/oauth2/authorize?state=123&client_id=OIMTOA&response_type=code&redirect_uri=https%3A%2F%2Foa.soimt.cn%3A443%2Foa%2F%23%2Foa%2FhomePage%2Findex"
    : "https://sso-qa.saicmotortest.com/idp/oauth2/authorize?state=123&client_id=OIMTJfrog&response_type=code&redirect_uri=https://10.30.4.61:30239/oa/%23/askforleave?businessid=1753968532243333122%26taskid=2156701c-13f6-11ef-8748-005056b168aa%26type=waitdone%26processisfinished=back%26status=back%26ishome=true%26isqiwei=true"
     //https://10.30.4.61:30239/oa/#/oa"
     // 'https://61.169.5.67:31103/realms/soimt/protocol/openid-connect/auth?client_id=oa-soimt&redirect_uri=https://10.30.4.61:30239/oa/&response_type=code&scope=openid'
      window.location.href = url
      //'https://sso.soimt.intra:31101/realms/soimt/protocol/openid-connect/auth?client_id=oa-soimt&redirect_uri=https://61.169.5.67:30157/oa/&response_type=code&scope=openid'
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Sign in, pls wait ...",
            spinner: "el-icon-loading",
          });
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              if (this.website.switchMode) {
                const deptId = this.userInfo.dept_id;
                const roleId = this.userInfo.role_id;
                if (deptId.includes(",") || roleId.includes(",")) {
                  this.loginForm.deptId = deptId;
                  this.loginForm.roleId = roleId;
                  this.userBox = true;
                  loading.close();
                  return false;
                }
              }
              this.$router.push({ path: this.tagWel.value });
              loading.close();
            })
            .catch(() => {
              loading.close();
              this.refreshCode();
            });
        }
      });
    },
    getTenant() {
      if (this.$route.path === website.loginRouterSwitch) {
        this.tenantMode = true;
        return;
      }
      let domain = getTopUrl();
      // 临时指定域名，方便测试
      //domain = "https://bladex.vip";
      info(domain).then((res) => {
        const data = res.data;
        if (data.success && data.data.tenantId) {
          this.tenantMode = false;
          this.loginForm.tenantId = data.data.tenantId;
          this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-submit-whole {
  width: 100%;
  height: 45px;
  background-color:  #203b71;
  font-size: 18px;
  letter-spacing: 2px;
  font-weight: 300;
  color: #fff;
  cursor: pointer;
  margin-top: 30px;
  font-family: "neo";
  transition: 0.25s;
  margin-top: 5px;
}
</style>
