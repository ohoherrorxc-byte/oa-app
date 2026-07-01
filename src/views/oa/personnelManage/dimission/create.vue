<template>
  <div>
    <!-- 基础信息 -->
    <baseInfo  ref="baseInfo" :formData="form" :disabled="disabled"></baseInfo>
    <!-- 账号信息 -->
    <accountInfo ref="accountInfo" :formData="form" :isApproveUser="isApproveUser"  v-if="showAccountInfo()"  ></accountInfo>
    <!-- 其他事项 -->
    <otherInfo ref="otherInfo"  :isApproveUser="isApproveUser" v-show="showOtherInfo()" :formData="form" ></otherInfo>
    <basic-container v-if="showNumber.includes(18)" class="remarkText">
      <span>{{ $t('dimission.resigneeConfirmation') }}</span>
      <div class="pt10 font14" v-html="remarkText"></div>
    </basic-container>
  </div>
</template>

<script>
import addressBookDialog from "@/components/addressBookDialog/index";
import AddressApi from "@/api/organizationalStructure/address";
import UserApi from "@/api/organizationalStructure/user.js";
import { mapGetters } from "vuex";
import baseInfo from "./components/baseInfo.vue";
import DimissionApi from '@/api/dimission/index'
import accountInfo from "./components/accountInfo.vue";
import otherInfo from "./components/otherInfo.vue";
export default {
  props: {
    disabled: {
      default: false,
    },
  },
  components: {
    addressBookDialog, baseInfo, accountInfo, otherInfo
  },
  data() {
    return {
      form: {
      },
      showNumber: [],
      formPay: {},
      remarkText: this.$t('dimission.confirmationText'), // Move text to i18n
      rules: {},
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isApproveUser(){
      const { user_id, id } = this.userInfo;
      return (
        this.form.flow &&
        (user_id || id) + "" === this.form.flow.assignee + "" 
      );
    },
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
  },
  methods: {
    async getDetail() {
      let res = await DimissionApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.showNumber = res.data.data.showNumber || []
        this.$emit("getFormData", this.form);      
      }
    },
    showAccountInfo() {
      return (!this.step0() && !this.step3())||[2,3,4,5,6,7,8,9,10,11,12].some(item => this.showNumber.includes(item))
    },
    showOtherInfo() {
      return this.step5() || this.step6() || this.step7() || this.step8() || this.step9() || this.step10() || this.step11()
    },
    //发起人
    step0() {
      return !this.$route.query.businessId || this.$route.query.isEdit;
    },
    //直接上级
    step1() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'leader';
    },
    //部门主管
    step2() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'groupLeader';
    },
    //工作交接人
    step3() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'workConnect';
    },
    //账号交接人
    step4() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey&&this.form.flow.taskDefinitionKey.includes('leaveAccount');
    },
    //财务工作交接人
    step5() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'finance';
    },
    //党建工作交接人
    step6() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'party';
    },
    //测试资产
    step7() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'testProperty';
    },
    //资产管理员
    step8() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'property';
    },
    //行政资产
    step9() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'admin';
    },
    //人力资产
    step10() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'people';
    },
    //离职人员
    step11() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'leaveConnect';
    },
    async getPersonList(name) {
      let res = await UserApi.userAllList(name);
      let arr = res.data.data;
      arr.map((ele) => {
        ele.value = ele.realName;
      });
      return arr;
    },
    async doBurialPoint(data) {
      let obj = {
        contactedUserId: data.id,
        userId: this.userInfo.user_id,
      };
      let res = await AddressApi.recentlyContactedAdd(obj);
    },
  
    async testForm() {
      let postData = JSON.parse(JSON.stringify(this.form))
      postData.showNumber = this.showNumber
      let baseInfoValid
      let testAccount
      let testOtherInfo
      postData = { ...this.$refs.baseInfo.form }
      if (this.$refs.accountInfo) {
        testAccount = await this.$refs.accountInfo.test()
        console.log(testAccount+'accountInfo')
        postData = { ...postData, ...this.$refs.accountInfo.accountForm }    
        postData.showNumber = this.showNumber
      } else {
        testAccount = true
      }
      if (this.$refs.otherInfo) {     
        testOtherInfo = await this.$refs.otherInfo.testOther()
        postData = { ...postData, ...this.$refs.otherInfo.otherForm }
        postData.showNumber = this.showNumber    
      } else {
        testOtherInfo = true
      }
      postData.showNumber = this.showNumber
      baseInfoValid = await this.$refs.baseInfo.testBaseInfo()
      this.form = JSON.parse(JSON.stringify(postData))
      return baseInfoValid&&testAccount&&testOtherInfo
    },
  },
};
</script>

<style lang="scss" scoped>
.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.remarkText {
  /* font-size: 14px; */
  line-height: 30px;

  .font14 {
    font-size: 14px;
  }
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: #004ca7!important;
}

.el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #606626;
    cursor: not-allowed;
}
</style>