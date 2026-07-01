<template>
    <el-row>
        <el-col :span="24">
            <basic-container>
                <p class="table-titleName">
                    <span></span>{{ $t('accountInfo.accountDescription') }}
                </p>
                <el-form label-width="140px" class="pt10" ref="accountInfoForm"
                    :disabled="!isApproveUser || disabledAcount()" :rules="rules" :model="form">
                    <div v-for="item in accountList" :key="item.key">
                        <el-row v-if="showRowAccount(item)">
                            <div v-for="subItem in item.row">
                                <el-col :span="isMobile ? 22 : 11">
                                    <el-form-item :label="subItem.name" :prop="subItem.prop">
                                        <el-radio-group :disabled="!step1()" @change="change($event, subItem, item)"
                                            v-model="form[subItem.prop]" class="radio-class"
                                            v-if="subItem.type === 'radio'">
                                            <el-radio label="是">是</el-radio>
                                            <el-radio label="否">否</el-radio>
                                        </el-radio-group>
                                        <el-input v-else @change="change($event, subItem, item)"
                                            v-model="form[subItem.prop]"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </el-row>
                    </div>
                </el-form>
            </basic-container>
        </el-col>
    </el-row>
</template>
  
<script>
import { mapGetters } from "vuex";
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            showNumber: [],
            accountForm: {},
            form: {
                account: null,
                accountRemark: null,
                blocEmail: null,
                blocEmailRemark: null,
                pmsAccount: null,
                pmsAccountRemark: null,
                easyConnectAccount: null,
                easyConnectAccountRemark: null,
                devopsAccount: null,
                devopsAccountRemark: null,
                vdiAccount: null,
                vdiAccountRemark: null,
                oneDriveAccount: null,
                oneDriveAccountRemark: null,
                teamsAccount: null,
                teamsAccountRemark: null,
                companyDomainAccount: null,
                companyDomainAccountRemark: null,
                printPermissions: null,
                printPermissionsRemark: null
            },
            accountList: [
                {
                    key: 2,
                    isShowApprove: this.isErp,
                    row: [
                        {
                            name:this.$t('accountInfo.keepERPAccount'),
                            prop: "account",
                            type: 'radio',

                        },
                        {
                            name:this.$t('other.remarks'),
                            prop: "accountRemark",
                            type: "input"
                        }
                    ]
                },
                {
                    key: 3,
                    isShowApprove: this.isMail,
                    row: [
                        {
                            name: this.$t('accountInfo.keepEmailAccount'),
                            prop: "blocEmail",
                            type: 'radio',

                        },
                        {
                            name: this.$t('other.remarks'),
                            prop: "blocEmailRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 4,
                    isShowApprove: this.isPMS,
                    row: [
                        {
                            name: this.$t('accountInfo.keepPMSAccount'),
                            prop: "pmsAccount",
                            type: 'radio',

                        },
                        {
                            name: this.$t('other.remarks'),
                            prop: "pmsAccountRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 5,
                    isShowApprove: this.isVPN,
                    row: [
                        {
                            name:  this.$t('accountInfo.keepVPNAccount'),
                            prop: "easyConnectAccount",
                            type: 'radio',

                        },
                        {
                            name: this.$t('other.remarks'),
                            prop: "easyConnectAccountRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 6,
                    isShowApprove: this.isDevopes,
                    row: [
                        {
                            name: this.$t('accountInfo.keepDevopsAccount'),
                            prop: "devopsAccount",
                            type: 'radio',

                        },
                        {
                            name:this.$t('other.remarks'),
                            prop: "devopsAccountRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 7,
                    isShowApprove: this.isVdi,
                    row: [
                        {
                            name: this.$t('accountInfo.keepVDIAccount'),
                            prop: "vdiAccount",
                            type: 'radio',

                        },
                        {
                            name:this.$t('other.remarks'),
                            prop: "vdiAccountRemark",
                            type: 'input'
                        }
                    ]
                },
                // {
                //     key: 8,
                //     isShowApprove: this.isOneDrive,
                //     row: [
                //         {
                //             name:this.$t('accountInfo.keepOneDriveAccount'),
                //             prop: "oneDriveAccount",
                //             type: 'radio',

                //         },
                //         {
                //             name:this.$t('other.remarks'),
                //             prop: "oneDriveAccountRemark",
                //             type: 'input'
                //         }
                //     ]
                // },
                // {
                //     key: 9,
                //     isShowApprove: this.isTeams,
                //     row: [
                //         {
                //             name: this.$t('accountInfo.keepTeamsAccount'),
                //             prop: "teamsAccount",
                //             type: 'radio',

                //         },
                //         {
                //             name: this.$t('other.remarks'),
                //             prop: "teamsAccountRemark",
                //             type: 'input'

                //         }
                //     ]
                // }, 
                {
                    key: 10,
                    isShowApprove: this.isCompany,
                    row: [
                        {
                            name: this.$t('accountInfo.keepCompanyAccount'),
                            prop: "companyDomainAccount",
                            type: 'radio',

                        },
                        {
                            name: this.$t('other.remarks'),
                            prop: "companyDomainAccountRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 11,
                    isShowApprove: this.isPrint,
                    row: [
                        {
                            name: this.$t('accountInfo.keepPrintAccount'),
                            prop: "printPermissions",
                            type: 'radio',

                        },
                        {
                            name: this.$t('other.remarks'),
                            prop: "printPermissionsRemark",
                            type: 'input'
                        }
                    ]
                }
            ],
            rules: {
                account: [
                    { required: true, message: '请选择是否保留ERP账号', trigger: 'change' }
                ],
                blocEmail: [
                    { required: true, message: '请选择是否保留邮箱账号', trigger: 'change' }
                ],
                pmsAccount: [
                    { required: true, message: '请选择是否保留PMS账号', trigger: 'change' }
                ],
                easyConnectAccount: [
                    { required: true, message: '请选择是否保留VPN账号', trigger: 'change' }
                ],
                devopsAccount: [
                    { required: true, message: '请选择是否保留Devops账号', trigger: 'change' }
                ],
                vdiAccount: [
                    { required: true, message: '请选择是否保留VDI账号', trigger: 'change' }
                ],
                oneDriveAccount: [
                    { required: true, message: '请选择是否保留OneDrive账号', trigger: 'change' }
                ],
                teamsAccount: [
                    { required: true, message: '请选择是否保留Teams账号', trigger: 'change' }
                ],
                companyDomainAccount: [
                    { required: true, message: '请选择是否保留公司域账号', trigger: 'change' }
                ],
                printPermissions: [
                    { required: true, message: '请选择是否保留打印账号', trigger: 'change' }
                ]
            },

        };
    },
    watch: {
        formData() {
            this.showNumber = this.formData.showNumber
            this.form.account = this.formData.account
            this.form.accountRemark = this.formData.accountRemark
            this.form.blocEmail = this.formData.blocEmail
            this.form.blocEmailRemark = this.formData.blocEmailRemark
            this.form.pmsAccount = this.formData.pmsAccount
            this.form.pmsAccountRemark = this.formData.pmsAccountRemark
            this.form.easyConnectAccount = this.formData.easyConnectAccount
            this.form.easyConnectAccountRemark = this.formData.easyConnectAccountRemark
            this.form.devopsAccount = this.formData.devopsAccount
            this.form.devopsAccountRemark = this.formData.devopsAccountRemark
            this.form.vdiAccount = this.formData.vdiAccount
            this.form.vdiAccountRemark = this.formData.vdiAccountRemark
            this.form.oneDriveAccount = this.formData.oneDriveAccount
            this.form.oneDriveAccountRemark = this.formData.oneDriveAccountRemark
            this.form.teamsAccount = this.formData.teamsAccount
            this.form.teamsAccountRemark = this.formData.teamsAccountRemark
            this.form.companyDomainAccount = this.formData.companyDomainAccount
            this.form.companyDomainAccountRemark = this.formData.companyDomainAccountRemark
            this.form.printPermissions = this.formData.printPermissions
            this.form.printPermissionsRemark = this.formData.printPermissionsRemark
        },
    },
    props: {
        detailId: {
            type: String,
        },
        formData: {
            type: Object,
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isApproveUser: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(["userInfo", "isMobile"]),
    },
    components: {
        autoAddress
    },
    mounted() {

    },
    methods: {
        change(e, subItem, item) {
            this.accountForm[subItem.prop] = e
            console.log(this.accountForm)
        },
        showOtherInfo() {
            return this.step5() || this.step6() || this.step7() || this.step8() || this.step9() || this.step10() || this.step11()
        },
        //直接上级
        step1() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leader';
        },
        //部门主管
        step2() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'groupLeader';
        },
        //工作交接人
        step3() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'workConnect';
        },
        //账号交接人
        step4() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey && this.formData.flow.taskDefinitionKey.includes('leaveAccount');
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
        isErp() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount1'
        },
        isMail() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount2'
        },
        isPMS() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount3'
        },
        isVPN() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount4'
        },
        isDevopes() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount5'
        },
        isVdi() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount6'
        },
        isOneDrive() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount7'
        },
        isTeams() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount8'
        },
        isCompany() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount9'
        },
        isPrint() {
            return this.formData && this.formData.flow && this.formData.flow.taskDefinitionKey === 'leaveAccount10'
        },
        //当前审批人已结束
        isEndCurrPerson() {
            return this.formData && this.formData.flow && this.formData.flow.endTime
        },
        showRowAccount(item) {
            return (this.formData.flow&&this.formData.flow.status==='finished')||(((!this.isApproveUser) || this.isEndCurrPerson() || (!this.step4() || item.isShowApprove())) && Array.isArray(this.showNumber) && this.showNumber.includes(item.key))
        },
        disabledAcount() {
            return (!this.step1() && !this.step4()) || this.isEndCurrPerson()
        },
        test() {
            // console.log('dimission')
            this.accountForm = { ...this.form, ...this.accountForm }
            // console.log(  this.$refs.accountInfoForm)
            return new Promise((resolve) => {
                this.$refs.accountInfoForm.validate((valid, msg, done) => {
                    msg && Object.values(msg)[0] &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    resolve(valid);
                    // done();
                });
            });
        }

    },
};
</script>
  
<style scoped lang="scss">
.avue-form__menu {
    display: none;
}

.radio-class {
    width: 100%;

    @media (min-width: 768px) {
        text-align: center;
    }

}
</style>