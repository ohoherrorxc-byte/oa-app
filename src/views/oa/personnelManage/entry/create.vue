<template>
  <div>
    <basic-container>
      <span>{{ $t('entry.applicationInfo') }}</span>
      <!-- <el-checkbox v-model="checked">备选项</el-checkbox> -->
      <avue-form ref="formBaseInfo" :option="option" v-model="form">
        <template slot-scope="{disabled,size}" slot="directSuperior">
          <el-autocomplete :disabled='!isStep0()' :placeholder="$t('entry.enterDirectSuperior')" class="w100"
            v-model="form.directSuperior" clearable :fetch-suggestions="querySearchAsyncSuperior"
            @select="handleSelectSuperior">
            <el-button slot="append" :disabled='!isStep0()' @click="openAddress('isDirect')"
              icon="el-icon-search"></el-button>
          </el-autocomplete>
        </template>
      </avue-form>
      <div class="red">注意：1.收到账号注册成功的短信后，登录上汽统一身份管理平台 https://idm-pv.saicmotor.com , 在自助服务/安全中心 可进行账号密码的修改；<br/>
          <p class="pl50">2. 在上汽统一身份管理平台>自助服务/我的信息/信息维护 中查看邮箱前缀, 邮箱后缀为saicmotor.com, 请下载APP端企业微信，接收上汽集团的企微推送，并进入到邮箱界面，绑定邮箱;</p>
          <p class="pl50">3. 供应商电脑目前还未入域，暂时不支持电脑端的企微授权安装</p>
        </div>
    </basic-container>
    <basic-container v-if="!isStep0()">
      <span>{{ $t('entry.accountInfo') }}</span>
      <avue-form ref="formAccount" :option="optionAccount" v-model="form"></avue-form>
    </basic-container>
    <addressBookDialog @getPerson="getPerson" ref="addressBookDialog"></addressBookDialog>
  </div>
</template>

<script>
import addressBookDialog from "@/components/addressBookDialog/index";
import AddressApi from "@/api/organizationalStructure/address";
import UserApi from "@/api/organizationalStructure/user.js";
import EntryWorkshopApi from "@/api/entryWorkshop/index.js";
import { mapGetters } from "vuex";
import OtherApi from '@/api/organizationalStructure/other'
import { deepClone } from '@/util/util'
export default {
  components: {
    addressBookDialog,
  },
  props: {
    // disabled: {
    //   default: false,
    // },
  },
  data() {
    return {
      form: {
        accountType: [],
        doorAccessControl: [],
      },
      variables: {},
      option: {
        column: [
          {
            type: "select",
            label: this.$t('entry.sex'),
            span: 12,
            prop: "sex",

            dicUrl: "/api/oa-system/dict/dictionary?code=sex",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            rules: [
              {
                required: true,
                message: this.$t('entry.sexRequired'),
              },
            ],
            disabled: !this.isStep0()
          },
          {
            type: "select",
            filterable: true,
            label: this.$t('entry.position'),
            span: 12,
            prop: "postId",
            dicUrl: "/api/oa-system/post/v2.0/select?tenantId=629965",
            props: {
              label: "postName",
              value: "id",
            },
            rules: [
              {
                required: true,
                message: this.$t('entry.positionRequired'),
              },
            ],
            disabled: !this.isStep0()
          },
          {
            type: "tree",
            label: this.$t('entry.department'),
            span: 12,
            prop: "deptId",
            dicUrl: "/api/oa-system/dept/v2.0/tree?tenantId=629965",
            props: {
              label: "title",
              value: "id",
              children: "children",
            },
            rules: [
              {
                required: true,
                message: this.$t('entry.departmentRequired'),
              },
            ],
            disabled: !this.isStep0()
          },
          {
            type: "select",
            label: this.$t('entry.officeLocation'),
            span: 12,
            prop: "officeLocation",
            disabled: !this.isStep0(),
            // dicData: [],
            dicUrl: "/api/oa-user/dict/addressList",
            dicMethod: "post",
            props: {
              label: "address",
              value: "address",

            },
          },
        ],
        labelPosition: "right",
        labelWidth: 140,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        // disabled: this.disabled,
        labelSuffix: " ",
      },
      optionAccount: {
        column: [],
        labelPosition: "right",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        disabled: !this.isStep3(),
        labelSuffix: " ",
      },
      rules: {},
      sexList: []
    };

  },
  computed: {
    ...mapGetters(["userInfo"]),

  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    } else {
      this.option.column = this.columnOption()
      this.optionAccount.column = this.columnAccount()
    }
  },
  methods: {
    async getDetail() {
      let res = await EntryWorkshopApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.accountType = this.form.accountType || []
        this.form.doorAccessControl = this.form.doorAccessControl || []
        this.form.emailType = this.form.emailType || []
        this.option.column = this.columnOption()
        this.optionAccount.column = this.columnAccount()
        this.optionAccount.disabled = !this.isStep3()
        this.form = res.data.data;
        this.form.sex = this.form.sex ? this.form.sex.toString() : ''
        this.$emit("getFormData", this.form);
        this.$nextTick(() => {
          if (this.$refs.formBaseInfo) {
            this.$refs.formBaseInfo.form = res.data.data
          }
          if (this.$refs.formAccount) {
            this.$refs.formAccount.form = res.data.data
          }
        })

      }
    },

    async getPersonList(name) {
      let res = await UserApi.userAllList(name);
      let arr = res.data.data;
      arr.map((ele) => {
        ele.value = ele.realName;
      });
      return arr;
    },

    canAccessControlNo() {
      return this.isStep5() && this.form && this.form.isAccessControl === '是'
    },
    canEditEmailType() {
      return this.form && this.form.accountType.includes('邮箱') && (this.isStep1() || this.isStep2())
    },
    setAccount(e) {
      console.log(e.value)
      this.form.accountType = e.value || []
      var emailTypeColumn = this.findObject(this.option.column, 'emailType')
      emailTypeColumn.disabled = !this.canEditEmailType()
      if (Array.isArray(e.value) && !e.value.includes('邮箱')) {
        this.form.emailType = []
        emailTypeColumn.rules[0].required = false
      } else {
        emailTypeColumn.rules[0].required = true
      }
      if (Array.isArray(e.value) && e.value.includes('无')) {
        this.form.accountType = ['无']
      }
      // console.log(this.form.accountType)
    },
    setAccessControl(e) {
      var doorAccessControlColumn = this.findObject(this.option.column, 'doorAccessControl')
      doorAccessControlColumn.disabled = e.value === '是' && (this.isStep1() || this.isStep2()) ? false : true
      doorAccessControlColumn.rules[0].required = e.value === '是' ? true : false
      console.log(doorAccessControlColumn)
      if (e.value === '否' && this.form && this.form.doorAccessControl) {
        this.form.doorAccessControl = []
      }
    },
    hasERP() {
      return this.form && this.form.accountType.includes('ERP') && this.form.flow && (this.form.flow.taskDefinitionKey === 'account3' || this.form.flow.taskDefinitionKey === 'account4')
    },
    hasGSY() {
      return this.form && this.form.accountType.includes('公司域账号') && this.form.flow && this.form.flow.taskDefinitionKey === 'account6'
    },
    hasPMS() {
      return this.form && this.form.accountType.includes('PMS') && this.form.flow && this.form.flow.taskDefinitionKey === 'account5'
    },
    hasEASY() {
      return this.form && this.form.accountType.includes('EASY CONNECT') && this.form.flow && this.form.flow.taskDefinitionKey === 'account6'
    },
    hasDevops() {
      return this.form && this.form.accountType.includes('Devops') && this.form.flow && this.form.flow.taskDefinitionKey === 'account1'
    },
    hasOneDrive() {
      return this.form && this.form.accountType.includes('OneDrive+Teams') && this.form.flow && this.form.flow.taskDefinitionKey === 'account1'
    },
    hasSAP() {
      return this.form && this.form.accountType.includes('SAP (财务系统)') && this.form.flow && this.form.flow.taskDefinitionKey === 'account7'
    },
    hasVDI() {
      return this.form && this.form.accountType.includes('VDI') && this.form.flow && this.form.flow.taskDefinitionKey === 'account6'
    },
    hasDY() {
      return this.form && this.form.accountType.includes('打印权限') && this.form.flow && this.form.flow.taskDefinitionKey === 'account6'
    },
    hasOIMTTECH() {
      return this.form && this.form.emailType.includes('公司邮箱（OIMT.TECH）') && this.form.flow && this.form.flow.taskDefinitionKey === 'account1';
    },
    hasSAICMOTOR() {
      return this.form && this.form.emailType.includes('集团邮箱（SAICMOTOR.COM）') && this.form.flow && this.form.flow.taskDefinitionKey === 'account2'
    },
    async querySearchAsyncSuperior(queryString, cb) {
      if (!queryString && !this.form.directSuperior) return cb([]);
      let personList = await this.getPersonList({
        realName: queryString || this.form.directSuperior,
      });
      cb(personList);
    },
    handleSelectSuperior(data) {
      this.form.directSuperior = data.realName || data.name;
      this.form.directSuperiorId = data.id;
    },
    openAddress(key) {
      this.choosePersonKey = key;
      this.$refs.addressBookDialog.dialogVisibleAddress = true;
    },
    getPerson(data) {
      if (this.choosePersonKey === "isDirect") {
        this.handleSelectSuperior(data);
      } else if (this.choosePersonKey === "isAssistant") {
        this.handleSelectAssistant(data);
      } else if (this.choosePersonKey === "isResponsible") {
        this.handleSelectPerson(data);
      }
      this.doBurialPoint(data);
    },
    async doBurialPoint(data) {
      let obj = {
        contactedUserId: data.id,
        userId: this.userInfo.user_id,
      };
      let res = await AddressApi.recentlyContactedAdd(obj);
    },
    isStep0() {
      return !this.$route.query.businessId || this.$route.query.isEdit;
    },
    //直接上级
    isStep1() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'leader';
    },
    //部门主管
    isStep2() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'groupLeader';
    },
    //分配账号
    isStep3() {
      // console.log('isStep3')
      // console.log(this.form && this.form.flow && this.form.flow.taskDefinitionKey.includes('account'))
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey && this.form.flow.taskDefinitionKey.includes('account');
    },
    //资产管理员
    isStep4() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey && this.form.flow.taskDefinitionKey === 'property';
    },
    //行政
    isStep5() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'administration';
    },
    //账号分配
    isStep6() {
      return this.form && this.form.flow && this.form.flow.taskDefinitionKey && this.form.flow.taskDefinitionKey === 'useAccount' && this.form.flow.status !== 'finished';
    },
    isNeedState() {
      // this.form.state
      return this.form.haveStation === '是'
    },
    changeState(v) {
      let column = this.findObject(this.option.column, 'stationCode')
      // console.log(column)
      column.disabled = v.value === '是' ? false : true
      column.rules[0].required = v.value === '是' ? true : false

    },
    dealAccount() {
      this.variables = {
        pass1: ['Devops', 'OneDrive+Teams'].some(item => this.form.accountType.includes(item)) ? 1 : 0,//|| this.form.emailType.includes('公司邮箱（OIMT.TECH）') 
        "pass2": this.form.emailType.includes('集团邮箱（SAICMOTOR.COM）') ? 1 : 0,
        "pass3": this.form.accountType.includes("ERP") && this.form.personType !== '内部员工' ? 1 : 0,
        "pass4": this.form.accountType.includes("ERP") && this.form.personType === '内部员工' ? 1 : 0,
        "pass5": this.form.accountType.includes("PMS") ? 1 : 0,
        "pass6": ['EASY CONNECT', 'VDI', '公司域账号', '打印权限'].some(item => this.form.accountType.includes(item)) ? 1 : 0,
        "pass7": this.form.accountType.includes("SAP (财务系统)") ? 1 : 0
      }
    },
    changeName() {
      console.log(this.form)
      this.$emit('setName', this.form.realName)
    },
    testForm() {
      this.dealAccount()
      return new Promise((resolve) => {
        this.$refs.formBaseInfo.validate((valid, done, msg) => {
          msg &&
            this.$message({
              message: Object.values(msg)[0][0].message,
              type: "warning",
            });
          if (this.$refs.formAccount) {
            this.$refs.formAccount.validate((validAccount, done, msgAccount) => {
              msgAccount &&
                this.$message({
                  message: Object.values(msgAccount)[0][0].message,
                  type: "warning",
                });
              resolve(validAccount && valid);
            })
          } else {
            resolve(valid);
          }
        });
      });
    },
    columnAccount() {
      return [
        {
          type: "input",
          label: this.$t('account.erp.username'), // "ERP登录账号"
          span: 12,
          prop: "account",
          disabled: !this.hasERP(),
          rules: [
            {
              required: this.hasERP(),
              message: this.$t('account.erp.usernameRequired'), // "ERP登录账号不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.erp.password'), // "ERP初始密码" 
          span: 12,
          prop: "password",
          disabled: !this.hasERP(),
          rules: [
            {
              required: this.hasERP(),
              message: this.$t('account.erp.passwordRequired'), // "ERP初始密码不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.group.email'), // "集团邮箱账号"
          span: 12,
          prop: "blocEmail",
          disabled: !this.hasSAICMOTOR(),
          rules: [
            {
              required: this.hasSAICMOTOR(),
              message: this.$t('account.group.emailRequired'), // "集团邮箱账号不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.group.password'), // "集团邮箱初始密码"
          span: 12,
          prop: "blocEmailPassword",
          disabled: !this.hasSAICMOTOR(),
          rules: [
            {
              required: this.hasSAICMOTOR(),
              message: this.$t('account.group.passwordRequired'), // "集团邮箱初始密码不能为空"
            },
          ],
        },
        // {
        //   type: "input",
        //   label: this.$t('account.company.email'), // "公司邮箱账号"
        //   span: 12,
        //   prop: "companyEmail",
        //   disabled: !this.hasOIMTTECH(),
        //   rules: [
        //     {
        //       required: this.hasOIMTTECH(),
        //       message: this.$t('account.company.emailRequired'), // "公司邮箱账号不能为空" 
        //     },
        //   ],
        // },
        // {
        //   type: "input",
        //   label: this.$t('account.company.password'), // "公司邮箱初始密码"
        //   span: 12,
        //   prop: "companyEmailPassword",
        //   disabled: !this.hasOIMTTECH(),
        //   rules: [
        //     {
        //       required: this.hasOIMTTECH(),
        //       message: this.$t('account.company.passwordRequired'), // "公司邮箱初始密码不能为空"
        //     },
        //   ],
        // },
        {
          type: "input",
          label: this.$t('account.pms.username'), // "PMS账号"
          span: 12,
          prop: "pmsAccount",
          disabled: !this.hasPMS(),
          rules: [
            {
              required: this.hasPMS(),
              message: this.$t('account.pms.usernameRequired'), // "PMS账号不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.pms.password'), // "PMS初始密码"
          span: 12,
          prop: "pmsPassword",
          disabled: !this.hasPMS(),
          rules: [
            {
              required: this.hasPMS(),
              message: this.$t('account.pms.passwordRequired'), // "PMS初始密码不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.easyConnect.account'), // "EASY CONNECT账号"
          span: 12,
          prop: "easyConnectAccount",
          disabled: !this.hasEASY(),
          rules: [
            {
              required: this.hasEASY(),
              message: this.$t('account.easyConnect.accountRequired'), // "EASY CONNECT账号不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.easyConnect.password'), // "EASY CONNECT初始密码"
          span: 12,
          prop: "easyConnectPassword",
          disabled: !this.hasEASY(),
          rules: [
            {
              required: this.hasEASY(),
              message: this.$t('account.easyConnect.passwordRequired'), // "EASY CONNECT初始密码不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.devops.account'), // "Devops账号"
          span: 12,
          prop: "devopsAccount",
          disabled: !this.hasDevops(),
          rules: [
            {
              required: this.hasDevops(),
              message: this.$t('account.devops.accountRequired'), // "Devops账号不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.devops.password'), // "Devops密码"
          span: 12,
          prop: "devopsPassword",
          disabled: !this.hasDevops(),
          rules: [
            {
              required: this.hasDevops(),
              message: this.$t('account.devops.passwordRequired'), // "Devops密码不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.sap.username'),  // "SAP账号"
          span: 12,
          prop: "sapAccount",
          disabled: !this.hasSAP(),
          rules: [
            {
              required: this.hasSAP(),
              message: this.$t('account.sap.usernameRequired'), // "SAP账号不能为空"
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.sap.password'), // "SAP初始密码"
          span: 12,
          prop: "sapPassword",
          disabled: !this.hasSAP(),
          rules: [
            {
              required: this.hasSAP(),
              message: this.$t('account.sap.passwordRequired'), // "SAP初始密码不能为空"
            },
          ],
        },
        // {
        //   type: "input",
        //   label: this.$t('account.onedrive.username'), // "OneDrive账号"
        //   span: 12,
        //   prop: "oneDriveAccount",
        //   disabled: !this.hasOneDrive(),
        //   rules: [
        //     {
        //       required: this.hasOneDrive(),
        //       message: this.$t('account.onedrive.usernameRequired'), // "OneDrive账号不能为空"
        //     },
        //   ],
        // },
        // {
        //   type: "input",
        //   label:this.$t('account.onedrive.password'),
        //   span: 12,
        //   prop: "oneDrivePassword",
        //   disabled: !this.hasOneDrive(),
        //   rules: [
        //     {
        //       required: this.hasOneDrive(),
        //       message: this.$t('account.onedrive.password_required'),
        //     },
        //   ],
        // },
        // {
        //   type: "input",
        //   label: this.$t('account.teams.username'),
        //   span: 12,
        //   prop: "teamsAccount",
        //   disabled: !this.hasOneDrive(),
        //   rules: [
        //     {
        //       required: this.hasOneDrive(),
        //       message: this.$t('account.teams.username_required'),
        //     },
        //   ],
        // },
        // {
        //   type: "input",
        //   label: this.$t('account.teams.password'),
        //   span: 12,
        //   prop: "teamsPassword",
        //   disabled: !this.hasOneDrive(),
        //   rules: [
        //     {
        //       required: this.hasOneDrive(),
        //       message:  this.$t('account.teams.password_required'),
        //     },
        //   ],
        // },
        {
          type: "input",
          label: this.$t('account.domain.username'),
          span: 12,
          prop: "companyDomainAccount",
          disabled: !this.hasGSY(),
          rules: [
            {
              required: this.hasGSY(),
              message: this.$t('account.domain.username_required'),
            },
          ],
        },
        {
          type: "input",
          label: this.$t('account.domain.password'),
          span: 12,
          prop: "companyDomainPassword",
          disabled: !this.hasGSY(),
          rules: [
            {
              required: this.hasGSY(),
              message: this.$t('account.domain.password_required'),
            },
          ],
        },
      ]
    },
    columnOption() {
      let arr = [
        {
          label:  this.$t('entry.employeeName'),
          span: 12,
          prop: "realName",
          rules: [
            {
              required: true,
              message: "员工姓名不能为空",
            },
          ],
          disabled: !this.isStep0(),
          blur: this.changeName
        },
        {
          label:  this.$t('entry.employeeId'),
          span: 12,
          prop: "code",
          disabled: !this.isStep6(),
          rules: [
            {
              required: this.isStep6(),
              message: "员工工号不能为空",
            },
          ],

        },
        {
          type: "select",
          label: this.$t('entry.gender'),
          span: 12,
          prop: "sex",

          dicUrl: "/api/oa-system/dict/dictionary?code=sex",
          props: {
            label: "dictValue",
            value: "dictKey",
          },
          rules: [
            {
              required: true,
              message: "性别不能为空",
            },
          ],
          disabled: !this.isStep0(),

        },
        {
          type: "input",
          label:  this.$t('entry.idCard'),
          span: 12,
          prop: "cardNumber",
          rules: [
            {
              required: true,
              message: "身份证号不能为空",
            },
          ],
          disabled: !this.isStep0()
        },
        {
          type: "date",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          label: this.$t('entry.entryDate'),
          span: 12,
          prop: "employmentDate",
          disabled: !this.isStep0() && !this.isStep6()
        },
        {
          type: "input",
          label:this.$t('entry.phone'),
          span: 12,
          prop: "phone",
          rules: [
            {
              required: true,
              message: "手机号不能为空",
            },
          ],
          disabled: !this.isStep0()
        },
        {
          type: "tree",
          label: this.$t('entry.department'),
          span: 12,
          prop: "deptId",
          dicUrl: "/api/oa-system/dept/v2.0/tree?tenantId=629965",
          props: {
            label: "title",
            value: "id",
            children: "children",
          },
          rules: [
            {
              required: true,
              message: "入职部门不能为空",
            },
          ],
          disabled: !this.isStep0()
        },
        {
          type: "select",
          filterable: true,
          label: this.$t('entry.position'),
          span: 12,
          prop: "postId",
          dicUrl: "/api/oa-system/post/v2.0/select?tenantId=629965",
          props: {
            label: "postName",
            value: "id",
          },
          rules: [
            {
              required: true,
              message: "职位不能为空",
            },
          ],
          disabled: !this.isStep0()
        },
        {
          type: "date",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          label: this.$t('entry.probationStart'),
          span: 12,
          prop: "probationStartTime",
          rules: [
            {
              required: true,
              message: "试用期开始日期不能为空",
            },
          ],
          disabled: !this.isStep0() && !this.isStep6()
        },
        {
          type: "date",
          label:  this.$t('entry.probationEnd'),
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          span: 12,
          prop: "probationEndTime",
          rules: [
            {
              required: true,
              message: "试用期结束日期不能为空",
            },
          ],
          disabled: !this.isStep0() && !this.isStep6()
        },
        {
          type: "date",
          label:  this.$t('entry.contractStart'),
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          span: 12,
          prop: "contractStartTime",
          rules: [
            {
              required: true,
              message: "合同开始日期不能为空",
            },
          ],
          disabled: !this.isStep0() && !this.isStep6()
        },
        {
          type: "date",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          label:  this.$t('entry.contractEnd'),
          span: 12,
          prop: "contractEndTime",
          rules: [
            {
              required: true,
              message: "合同结束日期不能为空",
            },
          ],
          disabled: !this.isStep0() && !this.isStep6()
        },
        {
          label: this.$t('entry.supervisor'),
          span: 12,
          prop: "directSuperior",
          formslot: true,
          rules: [
            {
              required: true,
              message: "直接上级不能为空",
            },
          ],
          disabled: !this.isStep0()
        },
        {
          type: "select",
          label: this.$t('entry.personType'),
          span: 12,
          prop: "personType",
          rules: [
            {
              required: true,
              message: "人员类型不能为空",
            },
          ],
          dicData: [
            {
              label: "内部员工",
              value: "内部员工",
            },
            {
              label: "供应商",
              value: "供应商",
            },
            {
              label: "临时人员",
              value: "临时人员",
            },
          ],
          disabled: !this.isStep0()
        },
        {
          type: "select",
          label: this.$t('entry.officeLocation'),
          span: 12,
          prop: "officeLocation",
          disabled: !this.isStep0(),
          dicUrl: "/api/oa-user/dict/addressList",
          dicMethod: "post",
          props: {
            label: "address",
            value: "address",

          },
          rules: [
            {
              required: true,
              message: "办公地点不能为空",
            },
          ],
        },
        {
          type: "select",
          label:this.$t('entry.isAccessControl'),
          span: 12,
          prop: "isAccessControl",
          dicData: [
            {
              label: "否",
              value: "否",
            },
            {
              label: "是",
              value: "是",
            },
          ],
          rules: [
            {
              required: this.isStep1() || this.isStep2(),
              message: "是否需要门禁",
            },
          ],
          disabled: !this.isStep1() && !this.isStep2(),
          change: this.setAccessControl
        },
        {
          type: "input",
          label: this.$t('entry.accessControlNo'),
          span: 24,
          prop: "accessControlNo",
          rules: [
            {
              required: this.canAccessControlNo(),
              message: "门禁卡号",
            },
          ],
          disabled: !this.canAccessControlNo()
        },
        {
          type: "checkbox",
          label: this.$t('entry.doorAccessControl'),
          span: 24,
          multiple: true,
          prop: "doorAccessControl",
          dicData: [
            {
              label: "4楼玻璃门",
              value: "4楼玻璃门",
            },
            {
              label: "7楼玻璃门",
              value: "7楼玻璃门",
            },
            {
              label: "7楼综管办公室",
              value: "7楼综管办公室",
            },
            {
              label: "智能网联在环实验室",
              value: "智能网联在环实验室",
            },
            {
              label: "AI测试实验室",
              value: "AI测试实验室",
            },
            {
              label: "零件管理室",
              value: "零件管理室",
            },
            {
              label: "数字广播测试实验室",
              value: "数字广播测试实验室",
            },
            {
              label: "4楼智能硬件PPO",
              value: "4楼智能硬件PPO",
            },
            {
              label: "4楼智能硬件PPO仓库",
              value: "4楼智能硬件PPO仓库",
            },
            {
              label: "7楼副总办公室",
              value: "7楼副总办公室",
            },
            {
              label: "3楼VIP ROOM",
              value: "3楼VIP ROOM",
            },
            {
              label: "3楼玻璃门",
              value: "3楼玻璃门",
            },
            {
              label: "7楼会议室E",
              value: "7楼会议室E",
            },
            {
              label: "4楼库房",
              value: "4楼库房",
            },
          ],
          rules: [
            {
              required: this.form.isAccessControl === '是',
              message: "门禁权限",
            },
          ],
          disabled: !this.isStep1() && !this.isStep2()
        },
        {
          type: "input",
          label:  this.$t('entry.other'),
          span: 12,
          prop: "others",
          disabled: !this.isStep1() && !this.isStep2()
        },
        {
          type: "select",
          label: this.$t('entry.officeSupplies'),
          span: 12,
          prop: "haveOfficeSupplies",
          dicData: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
          rules: [
            {
              required: this.isStep5(),
              message: "办公用品是否发放",
            },
          ],
          disabled: !this.isStep5()
        },
        {
          type: "select",
          label: this.$t('entry.fixedStation'),
          span: 12,
          prop: "haveStation",
          dicData: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
          rules: [
            {
              required: this.isStep4(),
              message: "是否有固定工位",
            },
          ],
          change: this.changeState,
          disabled: !this.isStep4()
        },
        {
          type: "input",
          label:  this.$t('entry.stationCode'),
          span: 12,
          prop: "stationCode",
          rules: [
            {
              required: this.isNeedState(),
              message: "工位编号",
            },
          ],
          disabled: !this.isNeedState()
        },
        {
          type: "checkbox",
          multiple: true,
          label: this.$t('entry.accountType'),
          span: 24,
          prop: "accountType",
          dicData: [
            {
              label: "邮箱",
              value: "邮箱",
            },
            {
              label: "公司域账号",
              value: "公司域账号",
            },
            {
              label: "ERP",
              value: "ERP",
            },
            {
              label: "PMS",
              value: "PMS",
            },
            {
              label: "EASY CONNECT",
              value: "EASY CONNECT",
            },
            {
              label: "Devops",
              value: "Devops",
            },
            // {
            //   label: "OneDrive+Teams",
            //   value: "OneDrive+Teams",
            // },
            {
              label: "SAP (财务系统)",
              value: "SAP (财务系统)",
            },
            {
              label: "VDI",
              value: "VDI",
            },
            {
              label: "打印权限",
              value: "打印权限",
            },
            {
              label: "无",
              value: "无",
            },
          ],
          change: this.setAccount,
          rules: [
            {
              required: !(!this.isStep1() && !this.isStep2()),
              message: "账号类型",
            },
          ],
          disabled: !this.isStep1() && !this.isStep2()
        },
        {
          type: "checkbox",
          label: this.$t('entry.emailType'),
          multiple: true,
          dicData: [
            // {
            //   label: "公司邮箱（OIMT.TECH）",
            //   value: "公司邮箱（OIMT.TECH）",
            // },
            {
              label: "集团邮箱（SAICMOTOR.COM）",
              value: "集团邮箱（SAICMOTOR.COM）",
            },
          ],
          rules: [
            {
              required: this.canEditEmailType(),
              message: "邮箱类别",
            },
          ],
          span: 24,
          prop: "emailType",
          disabled: !this.canEditEmailType()
        },
      ]
      return arr
    },
  },
};
</script>

<style>
.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.w100 {
  width: 100%;
}

.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #004ca7 !important;
}

.el-checkbox__input.is-disabled+span.el-checkbox__label {
  color: #606626;
  cursor: not-allowed;
}
</style>
