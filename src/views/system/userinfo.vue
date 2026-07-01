<template>
  <div v-loading="loading">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in option.group" :label="item.title">
          <avue-form :option="item" v-model="form" ref="form" @submit="handleSubmit"></avue-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('commonContent.secondaryVerificationPassword')" name="third">
          <div v-if="isInput" style="color: red;font-size: 12px;" class="pb10">{{ $t('commonContent.note') }}：{{ $t('commonContent.passwordMustContainNumbers') }}</div>
          <avue-form v-if="isInput" :option="optionSecond" v-model="form3" @submit="handleSubmit3"></avue-form>
          <div v-else class="flex-center justify-center">
            <div class="pr20">
              <img src="@/assets/svg/system/compute.svg" alt="">
            </div>
            <div class="text pt20">
              <p class="font22 pb10">{{ $t('commonContent.secondaryVerificationPasswordStatus') }}：<span class="font-blue">{{ $t('commonContent.set') }}</span></p>
              <p>{{ $t('commonContent.secondaryVerificationPasswordCannotBeDisabled') }}</p>
              <p>{{ $t('commonContent.secondaryVerificationPasswordForgot') }}</p>
              <p>{{ $t('commonContent.contactSystemAdministrator') }}</p>
              <el-button class="mt10 mb20" type="primary" @click="update">{{ $t('commonContent.modify') }}</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- <avue-form :option="option"
                 v-model="form"
                 ref="form"
                 @tab-click="handleTabClick"
                 @submit="handleSubmit"></avue-form> -->
    </basic-container>
  </div>
</template>

<script>
//import option from "@/option/user/info";
import optionFleet from "@/option/user/info-fleet";
import { getUserInfo, updateFleetPassword, updateInfo, updatePassword, updateSecondPassword, getSecondPasswordStatus, checkSecondPassword } from "@/api/system/user";
import md5 from 'js-md5';
import { getIndexRouter, getLoginRouter, resetRouter } from "@/router/router";
import func from "@/util/func";
import { mapGetters } from "vuex";
import store from "@/store";
import {checkPasswordStrength} from "@/util/checkPasswordStrength"
export default {
  data() {
    return {
      index: 0,
      option: {},
      form: {},
      form3: {},
      isInput: false,
      optionSecond: {
        column: [{
          label: this.$t('commonContent.password'),
          span: 12,
          row: true,
          type: 'password',
          prop: 'newPassword',
          blur:checkPasswordStrength,
          rules: store.state.userInfoIndex === 0 ? [] : [{
            required: true,
            message: "Please input  password",
            trigger: "blur"
          },
         {
            pattern: /^(?=.*?[a-z|A-Z])(?=.*?\d)(?=.*?[~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?])[a-zA-Z\d~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?]*$/,
            message: 'Wrong password format!'
          }, { min: 6, message: "password must be more than 6 chars!" }]
        }, {
          label: this.$t('commonContent.inputAgain'),
          span: 12,
          row: true,
          type: 'password',
          prop: 'newPasswordCheck',
          rules: store.state.userInfoIndex === 0 ? [] : [{
            required: true,
            message: "Please  input  password once again",
            trigger: "blur"
          }, { min: 6, message: "password must be more than 6 chars!" }],
        }]
      },
      loading: false,
      passMethod: {},
    };
  },
  mounted() {
    if (!this.isFleet) {
      this.handleWitch();
      //this.option = option;
      this.passMethod = updatePassword;
    } else {
      this.option = optionFleet;
      this.passMethod = updateFleetPassword;
    }
    console.log(this.isFleet)
    console.log(this.option)
    this.getSecondPwdStatus()
  },
  computed: {
    ...mapGetters(["isFleet", 'userInfo']),
  },
  methods: {
    handleSubmit(form, done) {
      if (this.index === 0 && !this.isFleet) {
        updateInfo(form).then(res => {
          if (res.data.code === 0||res.data.code === 200) {
            this.$message({
              type: "success",
              message: "Modify user info success!"
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
          done();
        }, error => {
          window.console.log(error);
          done();
        })
      } else {
        this.passMethod(md5(form.oldPassword), md5(form.newPassword), md5(form.newPassword1)).then(res => {
          if (res.data.code === 0 || res.data.code === 200) {
            this.$message({
              type: "success",
              message: this.$t('commonContent.modifyPasswordSuccess')
            });
            this.$store.dispatch("LogOut").then(() => {
              resetRouter();
              this.$router.push({ path: getLoginRouter() });

            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
          done();
        }, error => {
          window.console.log(error);
          done();
        })
      }
    },
    async getSecondPwdStatus() {
      let res = await getSecondPasswordStatus(this.userInfo.user_id)
      if (res.data.code === 0 || res.data.code === 200) {
        this.isInput = !res.data.data
      }
    },
    handleSubmit3(form, done) {
      if (form.newPassword !== form.newPasswordCheck) {
        this.$message.error(this.$t('commonContent.twoPasswordsDifferent'))
        return
      }
      let obj = {
        "newPassword": md5(form.newPassword),
        "newPasswordCheck": md5(form.newPasswordCheck),
      }
      if (form.oldPassword) {
        obj["oldPassword"] = md5(form.oldPassword)
      }
      updateSecondPassword(obj).then(res => {
        if (res.data.code === 200 || res.data.code === 0) {
          this.$message.success(this.$t('commonContent.submitted'))
          this.getSecondPwdStatus()
          done()
        }
      })
    },
    update() {
      this.isInput = true
      this.optionSecond = {
        column: [{
          label: this.$t('commonContent.oldPassword'),
          span: 12,
          row: true,
          type: 'password',
          prop: 'oldPassword',
          rules: store.state.userInfoIndex === 0 ? [] : [{
            required: true,
            message: "Please input  password",
            trigger: "blur"
          }]
        }, {
          label: this.$t('commonContent.newPassword'),
          span: 12,
          row: true,
          type: 'password',
          prop: 'newPassword',
          rules: store.state.userInfoIndex === 0 ? [] : [{
            required: true,
            message: "Please  input new password",
            trigger: "blur"
          },   {
            pattern: /^(?=.*?[a-z|A-Z])(?=.*?\d)(?=.*?[~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?])[a-zA-Z\d~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?]*$/,
            message: 'Wrong password format!'
          }, { min: 6, message: "password must be more than 6 chars!" }],
        },
        {
          label: this.$t('commonContent.inputAgain'),
          span: 12,
          row: true,
          type: 'password',
          prop: 'newPasswordCheck',
          rules: store.state.userInfoIndex === 0 ? [] : [{
            required: true,
            message: "Please  input  password once again",
            trigger: "blur"
          }, { min: 6, message: "password must be more than 6 chars!" }],
        }]
      }
    },
    handleWitch() {

      //非大客户用户有两个tab，在这里根据tab处理外部option js里的rules，以便提交时候只触发本tab内的validate
      if (!this.isFleet) {
        // this.$refs.form.clearValidate();

        store.state.userInfoIndex = this.index;
        delete require.cache[require.resolve("@/option/user/info")];
        console.log(require("@/option/user/info").default.group[0].column[2].rules);

        this.option = require("@/option/user/info").default;
      }

      if (this.index === 0) {
        this.loading = true;
        getUserInfo().then(res => {
          this.loading = false;
          const user = res.data.data;
          this.form = {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            realName: user.realName,
            phone: user.phone,
            email: user.email,
          }
        });
      }
    },
    handleTabClick(tabs) {
      this.index = func.toInt(tabs.index);
      this.handleWitch();
    }
  }
};
</script>

<style>
.font22 {
  font-size: 22px;
}

.text {
  line-height: 30px;
}

.font-blue {
  color: #1D76FF;
}
</style>
