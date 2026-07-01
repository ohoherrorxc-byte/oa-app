<template>
    <div>
        <basic-container>
            <span>{{ $t('employeeRenewal.renewalInfo') }}</span>
            <avue-form ref="formBaseInfo" :defaults.sync="defaults" :option="option" v-model="form">
                <template slot-scope="{disabled,size}" slot="realName">
                    <autoAddress :disabled="disabled" :multiple="false" :initData="form.realName" class="w-100"
                        @getPerson="getPerson"></autoAddress>
                </template>
            </avue-form>
        </basic-container>
    </div>
</template>
  
<script>
import EmployeeRenewalApi from "@/api/employeeRenewal/index";
import { mapGetters } from "vuex";
import autoAddress from '@/components/autoAddress/index'

export default {
    props: {
        disabled: {
            default: false,
        },
        slotForm: {
            type: Object
        }
    },
    components: { autoAddress },
    data() {
        return {
            defaults: {},
            form: {},
            option: {
                column: [
                    {
                        label: this.$t('employeeRenewal.renewalPerson'),
                        span: 12,
                        prop: "realName",
                        rules: [
                            {
                                required: true,
                                message: "请选择续签人员",
                            },
                        ],

                    },
                    {
                        label:this.$t('employeeRenewal.employeeCode'),
                        span: 12,
                        prop: "code",
                        disabled: true,
                    },
                    {
                        label:  this.$t('employeeRenewal.department'),
                        span: 12,
                        prop: "deptName",
                        disabled: true,
                    },
                    {
                        label: this.$t('employeeRenewal.position'),
                        prop: "postName",
                        disabled: true,
                    },
                    {
                        label: this.$t('employeeRenewal.gender'),
                        type: 'select',
                        dicData: [
                            {
                                label: '男',
                                value: 1
                            },
                            {
                                label: '女',
                                value: 2
                            },
                            {
                                label: '未知',
                                value: 3
                            }
                        ],
                        span: 12,
                        prop: "gender",
                        disabled: true,
                    },
                    {
                        label:  this.$t('employeeRenewal.renewalType'),
                        prop: "renewContractType",
                        type: "select",
                        dicData: [
                            {
                                label: "固定期限",
                                value: "固定期限"
                            },
                            {
                                label: "无固定期限",
                                value: "无固定期限"
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: "请选择续签类型",
                            },
                        ],
                    },
                    {
                        label: this.$t('employeeRenewal.originalContractStartDate'),
                        span: 12,
                        prop: "oldContractStartTime",
                        type: "date",
                        valueFormat: "yyyy-MM-dd HH:mm:ss"
                    },
                    {
                        label:  this.$t('employeeRenewal.originalContractEndDate'),
                        span: 12,
                        prop: "oldContractEndTime",
                        type: "date",
                        valueFormat: "yyyy-MM-dd HH:mm:ss"
                    },

                    {
                        type: "date",
                        label:  this.$t('employeeRenewal.renewalStartDate'),
                        span: 12,
                        prop: "renewContractStartTime",
                        minRows: 2,
                        maxRows: 3,
                        rules: [
                            {
                                required: true,
                                message: "请选择续签开始日期",
                            },
                        ],
                        valueFormat: "yyyy-MM-dd HH:mm:ss"
                    },
                    {
                        type: "date",
                        label:  this.$t('employeeRenewal.renewalEndDate'),
                        span: 12,
                        prop: "renewContractEndTime",
                        minRows: 2,
                        maxRows: 3,
                        rules: [
                            {
                                required: true,
                                message: "请选择续签结束日期",
                            },
                        ],
                        valueFormat: "yyyy-MM-dd HH:mm:ss"
                    },
                ],

                labelPosition: "right",
                labelWidth: 120,
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
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        // this.deepForm = JSON.parse(JSON.stringify(this.form))
        this.businessId = this.$route.query.businessId;
        if (this.businessId) {
            this.getDetail();
        }
    },
    methods: {
        async getDetail() {
            let res = await EmployeeRenewalApi.details(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.form.gender = this.form.gender? Number(this.form.gender):""
                this.$emit("getFormData", this.form);
            }
        },
        getPerson(data) {
            this.form.realName = data.realName
            this.form.code = data.code
            this.form.deptName = data.deptName
            this.form.postName = data.postName
            this.form.gender = data.sex
            this.form.userId = data.id
            console.log(data)
        },
        testForm() {
            console.log(this.slotForm)
            if (!this.slotForm.titleName) {
                this.$message.error('请输入标题')
                return false
            }
            if (!this.slotForm.applyReason) {
                this.$message.error('请输入续签说明')
                return
            }
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
  