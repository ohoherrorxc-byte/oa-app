<template>
    <div>
        <basic-container>
            <p class="pb10">{{ $t('transferSalaryAndPost.transferInfo') }}</p>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot-scope="{disabled}" slot="userName">
                    <autoAddress placeholder="" ref="autoAddress"  class="w-100"
                        @getPerson="getPersonName" :initData="form.userName" :disabled="disabled"
                        :multiple="false"></autoAddress>
                </template>
                <template slot-scope="{disabled}" slot="deptName">
                    <avue-input-tree :disabled="disabled" :check-strictly="true" ref="deptTree" node-key="id" v-model="form.deptName"
                        placeholder="请选择内容" :dic="departmentList" :props="deptProps"></avue-input-tree>
                </template>
            </avue-form>
        </basic-container>
        <basic-container>
            <p class="pb10">{{ $t('transferSalaryAndPost.postTransferInfo') }}</p>
            <avue-form ref="formMoveInfo" :option="optionMove" v-model="form">
                <template slot-scope="{disabled}" slot="beforeDeptName">
                    <avue-input-tree :disabled="disabled"  :check-strictly="true" ref="deptTree" node-key="id" v-model="form.beforeDeptName"
                        placeholder="请选择内容" :dic="departmentList" :props="deptProps"></avue-input-tree>
                </template>
                <template slot-scope="{disabled}" slot="afterDeptName">
                    <avue-input-tree :disabled="disabled"  :check-strictly="true" ref="deptTree" node-key="id" v-model="form.afterDeptName"
                        placeholder="请选择内容" :dic="departmentList" :props="deptProps"></avue-input-tree>
                </template>
                <template slot-scope="{disabled}" slot="beforeLeader">
                    <autoAddress placeholder="" ref="autoAddress"  class="w-100"
                        @getPerson="getPersonBeforeLeader" :initData="form.beforeLeader" :disabled="disabled"
                        :multiple="false"></autoAddress>
                </template>
                <template slot-scope="{disabled}" slot="afterLeader">
                    <autoAddress placeholder="" ref="autoAddress"  class="w-100"
                        @getPerson="getPersonAfterLeader" :initData="form.afterLeader" :disabled="disabled"
                        :multiple="false"></autoAddress>
                </template>
            </avue-form>
        </basic-container>
        <basic-container>
            <p class="pb10">{{ $t('transferSalaryAndPost.salaryInfo') }}</p>
            <avue-form ref="formMoveInfo" :option="optionMoney" v-model="form">
                <template slot="directSuperior">
                </template>
            </avue-form>
        </basic-container>
    </div>
</template>
  
<script>
import autoAddress from '@/components/autoAddress/index'
import { getDeptTree } from "@/api/organizationalStructure/department";
import { mapGetters } from "vuex";
import TransferSalaryAndPostApi from '@/api/transferSalaryAndPost/index'
export default {
    components: {
         autoAddress
    },
    props: {
        disabled: {
            default: false,
        },
    },
    data() {
        return {
            form: {
                propertyList: []
            },
            initList:[],
            departmentList: [],
            deptProps: {
                label: "title",
                value: "title",
                children: "children",
            },
            formConfig: {
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
                disabled: this.disabled,
                labelSuffix: " ",
            },
            option: {
                column: [
                    {
                        label: this.$t('transferSalaryAndPost.employeeName'), 
                        span: 12,
                        prop: "userName",
                        type: "input",
                        slot:true,
                        rules: [
                            {
                                required: true,
                                message: this.$t('transferSalaryAndPost.employeeNameRequired'),
                            },
                        ],

                    },
                    {
                        label: this.$t('transferSalaryAndPost.employeeCode'),
                        span: 12,
                        prop: "code",

                    },
                    {
                        label: this.$t('transferSalaryAndPost.department'),
                        span: 12,
                        prop: "deptName",
                        slot: true
                    },
                    {
                        type: "select",
                        label:  this.$t('transferSalaryAndPost.gender'),
                        span: 12,
                        prop: "gender",
                        dicData: [
                            {
                                label: this.$t('transferSalaryAndPost.male'),
                                value: '男'
                            }, {
                                label: this.$t('transferSalaryAndPost.female'),
                                value: '女'
                            }
                        ],

                    },
                    {
                        type: "date",
                        label: this.$t('transferSalaryAndPost.joinDate'),
                        span: 12,
                        prop: "joinDate",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",

                    },
                    {
                        type: "input",
                        label: this.$t('transferSalaryAndPost.postInfo'),
                        span: 12,
                        prop: "postInfo",
                    },
                    {
                        type: "select",
                        label: this.$t('transferSalaryAndPost.transferType'),
                        span: 12,
                        prop: "transferType",
                        dicData: [
                            {
                                label: '部门内调动',
                                value: '部门内调动'
                            }, {
                                label: '跨部门调动',
                                value: '跨部门调动'
                            }
                            , {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message:this.$t('transferSalaryAndPost.transferTypeRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('transferSalaryAndPost.transferCause'),
                        span: 12,
                        prop: "transferCause",
                        dicData: [
                            {
                                label: '晋升',
                                value: '晋升'
                            }, {
                                label: '降职',
                                value: '降职'
                            }
                            , {
                                label: '调岗',
                                value: '调岗'
                            },
                            {
                                label: '调薪',
                                value: '调薪'
                            }
                            , {
                                label: '临时调动',
                                value: '临时调动'
                            }, {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: this.$t('transferSalaryAndPost.transferCauseRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        filterable: true,
                        label:  this.$t('transferSalaryAndPost.transferReason'),
                        span: 12,
                        prop: "transferReason",
                    }
                ],
            },
            optionMove: {
                column: [
                    {
                        label: this.$t('transferSalaryAndPost.beforeDept'),
                        span: 12,
                        prop: "beforeDeptName",
                        type: "input",

                    },
                    {
                        label: this.$t('transferSalaryAndPost.afterDept'),
                        span: 12,
                        prop: "afterDeptName",
                        rules: [
                            {
                                required: true,
                                message:  this.$t('transferSalaryAndPost.afterPostRequired'),
                            },
                        ],
                    },
                    {
                        type: "select",
                        label: this.$t('transferSalaryAndPost.beforePost'),
                        span: 12,
                        dicUrl: "/api/oa-system/post/v2.0/select?tenantId=629965",
                        prop: "beforePostName",
                        props: {
                            label: "postName",
                            value: "id",
                        },
                    },
                    {
                        type: "select",
                        label: this.$t('transferSalaryAndPost.afterPost'),
                        span: 12,
                        prop: "afterPostName",
                        dicUrl: "/api/oa-system/post/v2.0/select?tenantId=629965",
                        props: {
                            label: "postName",
                            value: "id",
                        },
                        rules: [
                            {
                                required: true,
                                message: this.$t('transferSalaryAndPost.afterPostRequired'),
                            },
                        ],
                    },
                    {
                        type: "date",
                        label: this.$t('transferSalaryAndPost.beforeLeader'),
                        span: 12,
                        slot: true,
                        prop: "beforeLeader",

                    },
                    {
                        type: "date",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label:  this.$t('transferSalaryAndPost.afterLeader'),
                        slot: true,
                        span: 12,
                        prop: "afterLeader",
                        rules: [
                            {
                                required: true,
                                message: this.$t('transferSalaryAndPost.afterLeaderRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('transferSalaryAndPost.beforeWorkplace'),
                        span: 12,
                        prop: "beforeWorkplace",

                    },
                    {
                        type: "input",
                        label: this.$t('transferSalaryAndPost.afterWorkplace'),
                        span: 12,
                        prop: "afterWorkplace",
                        rules: [
                            {
                                required: true,
                                message: this.$t('transferSalaryAndPost.afterWorkplaceRequired'),
                            },
                        ],
                    },
                    {
                        type: "date",
                        filterable: true,
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label: this.$t('transferSalaryAndPost.transferDate'),
                        span: 12,
                        prop: "transferUseDate",
                        rules: [
                            {
                                required: true,
                                message: this.$t('transferSalaryAndPost.transferDateRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label: this.$t('transferSalaryAndPost.postArrangement'),
                        span: 12,
                        prop: "beforePostJob",
                        dicData: [
                            {
                                label: '新增人员',
                                value: '新增人员'
                            }, {
                                label: '部门内部调整',
                                value: '部门内部调整'
                            }, {
                                label: '岗位撤销',
                                value: '岗位撤销'
                            }
                            , {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: this.$t('transferSalaryAndPost.postArrangementRequired'),
                            },
                        ],
                    },
                ]
            },
            optionMoney: {
                column: [
                {
            label: this.$t('transferSalaryAndPost.beforeBasic'), // "调整前基本工资"
            span: 12,
            prop: "beforeBasic",
            type: "input",
        },
        {
            label: this.$t('transferSalaryAndPost.afterBasic'), // "调整后基本工资"
            span: 12,
            prop: "afterBasic",
        },
        {
            label: this.$t('transferSalaryAndPost.beforePerformance'), // "调整前绩效工资"
            span: 12,
            prop: "beforePerformance",
        },
        {
            type: "input", 
            label: this.$t('transferSalaryAndPost.afterPerformance'), // "调整后绩效工资"
            span: 12,
            prop: "afterPerformance",
        },
        {
            type: "input",
            label: this.$t('transferSalaryAndPost.beforeSubsidy'), // "调整前补助/津贴"
            span: 12,
            prop: "beforeSubsidy",
        },
        {
            type: "input",
            label: this.$t('transferSalaryAndPost.afterSubsidy'), // "调整后补助/津贴"
            span: 12,
            prop: "afterSubsidy",
        },
        {
            type: "input",
            label: this.$t('transferSalaryAndPost.beforeOther'), // "调整前其他"
            span: 12,
            prop: "beforeOther",
        },
        {
            type: "input",
            label: this.$t('transferSalaryAndPost.afterOther'), // "调整后其他"
            span: 12,
            prop: "afterOther",
        },
                ]
            },
            rules: {},
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        this.option = { ...this.option, ...this.formConfig }
        this.optionMove = { ...this.optionMove, ...this.formConfig }
        this.optionMoney = { ...this.optionMoney, ...this.formConfig }
        this.getDepartment()
        this.deepForm = JSON.parse(JSON.stringify(this.form))
        this.businessId = this.$route.query.businessId;

        if (this.businessId) {
            this.getDetail();
        }
    },
    methods: {
        async getDetail() {
            let res = await TransferSalaryAndPostApi.details(this.businessId)
            if(res.data.code===200||res.data.code===0){
                this.form = res.data.data
                this.$emit('getFormData',this.form)
            }
        },
        addRow() {
            this.form.propertyList.push({})
        },
        getPersonName(data){
            console.log(data)
            this.form.userName = data.realName
            this.form.userId = data.id
        },
        getPersonBeforeLeader(data){
            console.log(data)
            this.form.beforeLeader = data.realName
            this.form.beforeLeaderId = data.id
        },
        getPersonAfterLeader(data){
            this.form.afterLeader = data.realName
            this.form.afterLeaderId = data.id
        },
        async getDepartment() {
            if(this.businessId)return
            let res = await getDeptTree(629965)
            if (res.data.code === 0 || res.data.code === 200) {
                this.departmentList = res.data.data
            }
        },
        getPerson(){},
        testForm() {
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

.w-100 {
    width: 100%;
}
</style>
  