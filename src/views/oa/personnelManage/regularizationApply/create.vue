<template>
    <div>
        <basic-container>
            <span>{{ $t('regularization.title') }}</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot-scope="{disabled,size}" slot="userName">
                    <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100" @getPerson="getPerson"
                        :initData="form.userName" :disabled="disabled" :multiple="false"></autoAddress>
                </template>
                <template slot-scope="{disabled,size}" slot="deptName">
                    <avue-input-tree :check-strictly="true" ref="deptTree" node-key="id" v-model="form.deptName"
                    :placeholder="$t('regularization.selectDept')"  :dic="deptNameList" :props="deptProps"></avue-input-tree>
                </template>
            </avue-form>
        </basic-container>
        <addressBookDialog @getPerson="getPerson" ref="addressBookDialog"></addressBookDialog>
    </div>
</template>
  
<script>
import addressBookDialog from "@/components/addressBookDialog/index";
import { getDeptTree } from "@/api/organizationalStructure/department";
import { mapGetters } from "vuex";
import autoAddress from '@/components/autoAddress/index'
import RegularizationApplyApi from '@/api/regularizationApply/index'
export default {
    components: {
        addressBookDialog, autoAddress
    },
    props: {
        disabled: {
            default: false,
        },
    },
    data() {
        return {
            deptNameList: [],
            form: {
                propertyList: []
            },
            deptProps: {
                label: "title",
                value: "title",
                children: "children",
            },
            option: {
                column: [
                    {
                        label: this.$t('regularization.userName'),
                        span: 12,
                        prop: "userName",
                        type: "input",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.userNameRequired'),
                            },
                        ],
                    },
                    {
                        label: this.$t('regularization.code'),
                        span: 12,
                        prop: "code",
                    },
                    {
                        label:  this.$t('regularization.gender'),
                        span: 12,
                        type: 'select',
                        prop: "gender",
                        dicData: [
                            {
                                label:  this.$t('regularization.male'),
                                value: '男'
                            },
                            {
                                label: this.$t('regularization.female'),
                                value: '女'
                            }
                        ]
                    },
                    {
                        type: "select",
                        label: this.$t('regularization.deptName'),
                        span: 12,
                        prop: "deptName",

                    },
                    {
                        type: "date",
                        label:this.$t('regularization.birthDate'),
                        span: 12,
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        prop: "birthDate",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.birthDateRequired'),
                            },
                        ],
                    },
                    {
                        type: "date",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label: this.$t('regularization.workingTime'),
                        span: 12,
                        prop: "workingTime",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.workingTimeRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label:this.$t('regularization.ethnicGroup'),
                        span: 12,
                        prop: "ethnicGroup",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.ethnicGroupRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('regularization.nativePlace'),
                        span: 12,
                        prop: "nativePlace",
                        rules: [
                            {
                                required: true,
                                message:  this.$t('regularization.nativePlaceRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        filterable: true,
                        label: this.$t('regularization.birthplace'),
                        span: 12,
                        prop: "birthplace",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.birthplaceRequired'),
                            },
                        ],
                    },
                    {
                        type: "date",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label:this.$t('regularization.partyTime'),
                        span: 12,
                        prop: "partyTime"
                    },
                    {
                        type: "input",
                        filterable: true,
                        label: this.$t('regularization.healthCondition'),
                        span: 12,
                        prop: "healthCondition",
                        dicUrl: "/api/oa-system/post/v2.0/select?tenantId=629965",
                        props: {
                            label: "postName",
                            value: "id",
                        },

                    },
                    {
                        type: "date",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label: this.$t('regularization.confirmationDate'),
                        span: 12,
                        prop: "confirmationDate",

                    },
                    {
                        type: "input",
                        filterable: true,
                        label:  this.$t('regularization.technicalPosition'),
                        span: 24,
                        prop: "technicalPosition",
                    },
                    {
                        type: "input",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label: this.$t('regularization.academicDegrees'),
                        span: 12,
                        prop: "academicDegrees",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.academicDegreesRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label: this.$t('regularization.graduation'),
                        span: 12,
                        prop: "graduation",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.graduationRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        filterable: true,
                        label: this.$t('regularization.expertise'),
                        span: 24,
                        prop: "expertise",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.expertiseRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        label: this.$t('regularization.foreignLanguage'),
                        span: 24,
                        prop: "foreignLanguage",

                    },
                    {
                        type: "input",
                        filterable: true,
                        label: this.$t('regularization.currentPosition'),
                        span: 24,
                        prop: "currentJobPosition",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.currentPositionRequired'),
                            },
                        ],
                    },
                    {
                        type: "textarea",
                        label: this.$t('regularization.workHistory'),
                        span: 24,
                        prop: "workStudyResume",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.workHistoryRequired'),
                            },
                        ],
                    },
                    {
                        type: "textarea",
                        filterable: true,
                        label: this.$t('regularization.probationSummary'),
                        span: 24,
                        prop: "summary",
                        rules: [
                            {
                                required: true,
                                message: this.$t('regularization.probationSummaryRequired'),
                            },
                        ],
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
                disabled: this.disabled,
                labelSuffix: " ",
            },
            rules: {},
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        this.getdeptName()
        this.deepForm = JSON.parse(JSON.stringify(this.form))
        this.businessId = this.$route.query.businessId;

        if (this.businessId) {
            this.getDetail();
        }
    },
    methods: {
        async getDetail() {
            let res = await RegularizationApplyApi.details(this.businessId)
            if(res.data.code===200||res.data.code===0){
                this.form = res.data.data
                this.$emit('getFormData',this.form)
            }
        },
        getPerson(data){
            this.form.userName = data.realName
            this.form.userId = data.id
        },
        addRow() {
            this.form.propertyList.push({})
        },
        async getdeptName() {
            if(this.businessId)return
            let res = await getDeptTree(629965)
            if (res.data.code === 0 || res.data.code === 200) {
                this.deptNameList = res.data.data
            }
        },
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
</style>
  