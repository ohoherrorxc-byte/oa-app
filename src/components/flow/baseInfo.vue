<template>
  <el-row class="baseInfo">
    <el-col :span="24">
      <basic-container>
        <p class="table-titleName">
          <span></span>{{ $t('baseInfo.basicInformation') }}
        </p>
        <avue-form ref="formBaseInfo" :option="optionBaseInfo" v-model="form"></avue-form>
        <slot name="baseInfo"></slot>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
import { getFormatDate } from "@/util/util";
import { mapGetters } from "vuex";
import { getDept } from "@/api/organizationalStructure/department";
export default {
  data() {
    return {
      deepTitle: '',
      optionBaseInfo: {
        column: [
          {
            type: "input",
            label:this.$t('baseInfo.title'),
            span: 24,
            //   // disabled: true,
            prop: "titleName",
            rules: [
              {
                required: true,
                message:this.$t('baseInfo.titleRequired'),
              },
            ],
            blur: this.titleChange
          },
          {
            type: "input",
            label: this.$t('baseInfo.applicant'),
            disabled: true,
            span: 12,
            prop: "createUserName",
          },
          {
            type: "input",
            label: this.$t('baseInfo.department'),
            disabled: true,
            span: 12,
            prop: "createDeptName",
          },
          {
            type: "date",
            label: this.$t('baseInfo.applyDate'),
            span: 12,
            disabled: true,
            prop: "applyTime",
            valueFormat: "yyyy-MM-dd",
          },
          {
            type: "input",
            label:this.$t('baseInfo.applicationNumber'),
            disabled: true,
            span: 12,
            prop: "approvalCode",
          },
        ],
        labelPosition: "right",
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelWidth: 80,
        disabled: this.disabled,
        labelSuffix: " ",
        size: "mini",
      },
      form: {
        titleName: null,
        applyTime: null,
        createUser: null,
        createDept: null,
        createUserName: null,
        createDeptName: null,
        approvalCode: null,
      },
    };
  },
  watch: {
    formData() {
      this.form.titleName = this.formData.titleName;
      this.form.applyTime = this.formData.applyTime;
      this.form.createDept = this.formData.createDept;
      this.form.createUser = this.formData.createUser;
      this.form.createUserName = this.formData.createUserName;
      this.form.createDeptName = this.formData.createDeptName;
      this.form.approvalCode = this.formData.approvalCode;
    },
    approvalName() {
      if(this.approvalName==='用印申请流程'&& (!this.detailId||this.$route.query.isEdit)){
          this.optionBaseInfo.disabled = false
      }
      if((this.customForm&&!this.form.titleName)||!this.customForm){
        this.form.titleName  = this.initTitle()
        this.titleChange()
      }
    },
    askForLeaveType(){
      if (!this.form.titleName.includes('请假类型')) {
        this.deepTitle = JSON.parse(JSON.stringify(this.form.titleName))
      }
      if (!this.detailId) {
        this.form.titleName = `${this.deepTitle} (请假类型：${this.askForLeaveType})`
      }
    },
    dealTitleName() {
      if (this.dealTitleName) {
        this.form.titleName = this.approvalName +
          " - " +
          this.dealTitleName +
          " - " +
          getFormatDate();
      }
    }
  },
  props: {
    detailId: {
      type: String,
    },
    formData: {
      type: Object,
    },
    dealTitleName: {
      type: String
    },
    customForm:{
      type:Boolean,
      default:false
    },
    approvalName: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: true
    },
    totalAmount: {
      type: String,
      default: ''
    },
    askForLeaveType:{
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(["userInfo", "isMobile"]),
  },
  mounted() {
    console.log(this.userInfo)
    console.log('this.userInfo')
    this.$nextTick(() => {
      let isEdit = this.$route.query.isEdit;

      console.log(this.isMobile + "this.isMobile");
      this.optionBaseInfo.labelWidth = this.isMobile ? 70 : 120;
      if (this.detailId && !isEdit) {
        this.optionBaseInfo.disabled = true;
      }
      this.getDepartment();
    });
    this.form.applyTime = getFormatDate();
    this.form.createUser = this.userInfo.user_id;
    this.form.createUserName = this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name;
    this.form.createDept = this.userInfo.dept_id;
  },
  methods: {
    initTitle(){
      if(this.approvalName){
        return  this.approvalName +
        " - " +
        (this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name) +
        " - " +
        getFormatDate();
      }

    },
    getMoneyTitle(data){
      if (!this.form.titleName.includes('金额合计')) {
        this.deepTitle = JSON.parse(JSON.stringify(this.form.titleName))
      }
      if(!this.deepTitle){
        this.deepTitle = this.initTitle()
      }
      this.form.titleName = `${this.deepTitle} (金额合计：${data.toFixed(2)})`
    },
    async getDepartment() {
      if( this.detailId)return
      let res = await getDept(this.userInfo.dept_id || this.userInfo.deptId);
      this.form.createDeptName = res.data.data.deptName;
    },
    titleChange() {
      this.$emit('titleChange', this.form.titleName)
    },

  },
};
</script>

<style scoped lang="scss">
.baseInfo {
  ::v-deep ep.avue-form__menu {
    display: none !important;
    padding: 0 !important;
  }

  ::v-deep ep.avue-form__menu--center {
    display: none !important;
  }
}
</style>
