<template>
    <el-row>
        <el-col :span="24">
            <basic-container>
                <p class="table-titleName">
                    <span></span>{{ $t('dimission.baseInfo') }}
                </p>
                <avue-form ref="formBaseInfo" :option="optionBaseInfo" v-model="form">
                    <template slot-scope="{disabled,size}" slot="leaveUser">
                        <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                            @getPerson="getPerson" :initData="form.leaveUser" :disabled="disabled" :multiple="false">
                        </autoAddress>
                    </template>
                    <template slot-scope="{disabled,size}" slot="workHandoverPerson">
                        <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                            @getPerson="getPersonTransition" :initData="form.workHandoverPerson" :disabled="disabled"
                            :multiple="false"></autoAddress>
                    </template>
                </avue-form>
                <slot name="baseInfo"></slot>
            </basic-container>
        </el-col>
        <addressBookDialog @getPerson="getPerson" ref="addressBookDialog"></addressBookDialog>
    </el-row>
</template>
  
<script>
import { getFormatDate } from "@/util/util";
import { mapGetters } from "vuex";
import { getDept } from "@/api/organizationalStructure/department";
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            optionBaseInfo: {
                column: this.columnFn(),
                labelPosition: "right",
                gutter: 0,
                menuBtn: true,
                submitBtn: false,
                emptyBtn: false,
                emptyText: "清空",
                menuPosition: "center",
                detail: false,
                tabs: false,
                disabled: this.disabled,
                labelSuffix: " ",
                size: "mini",
                labelWidth: 90
            },
            queryString: "",
            form: {
                id: null,
                titleName: null,
                leaveUser: null,
                createDeptName: null,
                createDept: null,
                leaveUserId: null,
                workHandoverPersonId: null,
                applyTime: null,
                approvalCode: null,
                personType: null,
                serviceType: null,
                workHandoverPerson: null,
                finalLeaveTime: null
            },
        };
    },
    watch: {
        formData() {
            this.showNumber = this.formData.showNumber
            this.form.id = this.formData.id
            this.form.titleName = this.formData.titleName;
            this.form.createDeptName = this.formData.createDeptName
            this.form.leaveUser = this.formData.leaveUser;
            this.form.leaveUserId = this.formData.leaveUserId;
            this.form.workHandoverPersonId = this.formData.workHandoverPersonId;
            this.form.applyTime = this.formData.applyTime;
            this.form.approvalCode = this.formData.approvalCode;
            this.form.personType = this.formData.personType;
            this.form.serviceType = this.formData.serviceType;
            this.form.workHandoverPerson = this.formData.workHandoverPerson;
            this.form.leaveRemark = this.formData.leaveRemark
            this.form.finalLeaveTime = this.formData.finalLeaveTime;
            this.form.flow = this.formData.flow
            if ((this.formData.id && !this.$route.query.isEdit) && !this.step9() && !this.step1()) {
                this.optionBaseInfo.disabled = true;
            } else {
                this.optionBaseInfo.disabled = false
            }
            this.optionBaseInfo.column = this.columnFn()
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
            default: true
        }
    },
    computed: {
        ...mapGetters(["userInfo", "isMobile"]),
    },
    components: {
        autoAddress
    },
    mounted() {
        this.form.titleName =
            '人员离职申请' +
            " - " +
            this.userInfo.user_name +
            " - " +
            getFormatDate();
        this.$nextTick(() => {
            let isEdit = this.$route.query.isEdit
            this.optionBaseInfo.labelWidth = this.isMobile ? 70 : 160;
            if ((this.detailId && !isEdit) && !this.step9() && !this.step1()) {
                this.optionBaseInfo.disabled = true;
            }
        });
        this.getDepartment();
        this.form.applyTime = `${getFormatDate()} 00:00:00`;
        this.form.createUser = this.userInfo.user_id;
        this.form.createUserName = this.userInfo.user_name;
        this.form.createDept = this.userInfo.dept_id;
    },
    methods: {
        getData(formData) {
            this.showNumber = formData.showNumber
            this.form.id = formData.id
            this.form.titleName = formData.titleName;
            this.form.leaveUser = formData.leaveUser;
            this.form.leaveUserId = formData.leaveUserId;
            this.form.workHandoverPersonId = formData.workHandoverPersonId;
            this.form.applyTime = formData.applyTime;
            this.form.approvalCode = formData.approvalCode;
            this.form.personType = formData.personType;
            this.form.serviceType = formData.serviceType;
            this.form.workHandoverPerson = formData.workHandoverPerson;
            this.form.finalLeaveTime = formData.finalLeaveTime;
        },
        //行政资产
        step9() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'admin';
        },

        //直接上级
        step1() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'leader';
        },
        //发起人
        step0() {
            return !this.$route.query.businessId || this.$route.query.isEdit;
        },
        async getDepartment() {
            if(this.$route.query.businessId)return
            let res = await getDept(this.userInfo.dept_id || this.userInfo.deptId);
            this.form.createDeptName = res.data.data.deptName;
        },
        columnFn() {
            return [
                {
                    type: "input",
                    label:this.$t('dimission.title'),
                    span: 24,
                    prop: "titleName",
                    rules: [
                        {
                            required: true,
                            message: "标题不能为空",
                        },
                    ],
                    disabled: this.step9() || this.step1()
                },
                {
                    type: "input",
                    label:  this.$t('dimission.leaveUser'),
                    span: 12,
                    prop: "leaveUser",
                    rules: [
                        {
                            required: true,
                            message: "离职人员不能为空",
                        },
                    ],
                    disabled: this.step9() || this.step1()
                },
                {
                    type: "input",
                    label:this.$t('dimission.department'),
                    disabled: true,
                    span: 12,
                    prop: "createDeptName",
                },
                {
                    type: "date",
                    label: this.$t('dimission.applyDate'),
                    span: 12,
                    disabled: true,
                    prop: "applyTime",
                    valueFormat: "yyyy-MM-dd HH:mm:ss",
                    disabled: this.step9() || this.step1()
                },
                {
                    type: "input",
                    label: this.$t('dimission.applyCode'),
                    disabled: true,
                    span: 12,
                    prop: "approvalCode",
                    disabled: true
                },
                {
                    type: "select",
                    label: this.$t('dimission.personType'),
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
                    disabled: this.step9() || this.step1()
                },
                {
                    type: "select",
                    label: this.$t('dimission.serviceType'),
                    span: 12,
                    prop: "serviceType",
                    rules: [
                        {
                            required: true,
                            message: "服务类型不能为空",
                        },
                    ],
                    dicData: [
                        {
                            label: "运维",
                            value: "运维",
                        },
                        {
                            label: "项目",
                            value: "项目",
                        },
                    ],
                    disabled: this.step9() || this.step1()
                },
                {
                    type: "input",
                    label:this.$t('dimission.workHandoverPerson'), 
                    span: 12,
                    prop: "workHandoverPerson",
                    rules: [
                        {
                            required: this.step1(),
                            message: "工作交接人不能为空",
                        },
                    ],
                    disabled: this.step9() || this.step0()
                },
                {
                    type: "date",
                    label:  this.$t('dimission.finalLeaveTime'),
                    span: 12,
                    prop: "finalLeaveTime",
                    valueFormat: "yyyy-MM-dd HH:mm:ss",
                    rules: [
                        {
                            required: true,
                            message: "最终离职日期不能为空",
                        },
                    ],
                    disabled: this.step1()
                },
                {
                    label: this.$t('dimission.leaveRemark'), 
                    type: "textarea",
                    span: 24,
                    prop: "leaveRemark",
                    rules: [
                        {
                            required: true,
                            message: "离职说明不能为空",
                        },
                    ],
                    disabled: this.step9() || this.step1()
                },
            ]
        },
        async querySearchAsyncCreateUser(queryString, cb) {
            if (!queryString && !this.form.directSuperior) return cb([]);
            let personList = await this.getPersonList({
                realName: queryString || this.form.directSuperior,
            });
            cb(personList);
        },
        getPerson(data) {
            // console.log(data)
            this.form.leaveUserId = data.id;
            this.form.leaveUser = data.realName || data.name;
            this.form.createDept = data.deptId;
            this.form.createDeptName = data.deptName
            this.changeName()
            // console.log(this.form.createDeptName)
        },
        changeName() {
            this.form.titleName =
            '人员离职申请' +
            " - " +
            this.form.leaveUser +
            " - " +
            getFormatDate();
        },
        getPersonTransition(data) {
            this.form.workHandoverPerson = data.realName || data.name
            this.form.workHandoverPersonId = data.id
        },
        testBaseInfo() {
            return new Promise((resolve) => {
                this.$refs.formBaseInfo.validate((valid, done, msg) => {
                    msg &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    resolve(valid);
                    done();
                });
            });
        }

    },
};
</script>
  
<style scoped>
.avue-form__menu {
    display: none;
}
</style>