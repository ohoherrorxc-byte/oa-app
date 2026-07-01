<template>
    <div>
        <basic-container>
            <p class="pb10">{{$t('unionFunds.activityInfo')}}</p>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template  slot="activityManager">
                    <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                        @getPerson="getPerson" :initData="form.activityManager" :disabled="disabled" :multiple="false">
                    </autoAddress>
                </template>
            </avue-form>
        </basic-container>
        <basic-container>
            <p class="pb10">{{$t('unionFunds.receivableInfo')}}</p>
            <avue-form :option="optionBudget" ref="formBudget" v-model="form">
                <template slot="subjectName">
                    <elSelectTree  :value="{name:form.subjectName}" :disabled="disabled" @getValue="getSubjetRow" :options="subjectList" :accordion="false" :props="deptProps"></elSelectTree>
                    <!-- <avue-input-tree ref="tree" :check-strictly="true" node-key="id" v-model="form.subjectId"
                        placeholder="请选择内容" :dic="subjectList" :props="deptProps" @change="getSubjetRow"
                        :disabled="disabled"></avue-input-tree> -->
                </template>
            </avue-form>
        </basic-container>
    </div>
</template>

<script>
import { numberToTraditionalChinese } from '@/util/util'
import { mixins } from "../Mixin";
import autoAddress from '@/components/autoAddress/index'
import FinancialManagementApi from '@/api/financialManagement';
import UserApi from '@/api/organizationalStructure/user'
export default {
    mixins: [mixins],
    components: {
        autoAddress
    },
    props: {
        slotForm: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            isEdit: false,
            allTotalAmount: 0,
            form: {
                utilList: [],
                otherList: [],
                perkList: [],
                hotelList: []
            },
            amountObj: {
                utilListAmount: 0,
                otherListAmount: 0,
                perkListAmount: 0,
                hotelListAmount: 0,
            },
            subjectList: [],
            formPay: {},
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },
            searchForm: {
                currentPage: 1,
                pageSize: 10000,
            },
            option: {
                column: [
                    {
                        type: "input",
                        label:  this.$t('unionFunds.activityName'),
                        span: 12,
                        prop: "activityName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('unionFunds.activityNameRequired'),
                            },
                        ],
                    },
                    {
                        type: "date",
                        label: this.$t('unionFunds.activityTime'),
                        span: 12,
                        valueFormat: 'yyyy-MM-dd',
                        prop: "activityTime",
                        rules: [
                            {
                                required: true,
                                message: this.$t('unionFunds.activityTimeRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('unionFunds.activityLocation'),
                        span: 12,
                        prop: "activityLocation",
                        rules: [
                            {
                                required: true,
                                message: this.$t('unionFunds.activityLocationRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('unionFunds.activityManager'),
                        span: 12,
                        prop: "activityManager",
                        rules: [
                            {
                                required: true,
                                message: this.$t('unionFunds.activityManagerRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('unionFunds.participantNumber'),
                        span: 12,
                        prop: "participantNumber",
                        rules: [
                            {
                                required: true,
                                message: this.$t('unionFunds.participantNumberRequired'),
                            },
                        ],
                    },
                    {
                        type: "select",
                        label: this.$t('unionFunds.paymentMethod'),
                        span: 12,
                        dicData: [
                            {
                                label: '现金',
                                value: '现金'
                            },
                            {
                                label: '转账',
                                value: '转账'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        prop: "paymentType",
                        rules: [
                            {
                                required: true,
                                message: this.$t('unionFunds.paymentMethodRequired'),
                            },
                        ],
                    },
                ],
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
                disabled: this.disabled,
                labelSuffix: " ",

            },
            optionBudget: {
                column: [
                    {
                        type: "select",
                        label: this.$t('unionFunds.collectingUnit'),
                        span: 12,
                        prop: "collectingUnit",
                        props:{
                            label:'supplierName',
                            value:'id'
                        },
                        filterable:true,
                        dicUrl:'/api/oa-portal/contractSupplier/list?supplierName=&supplierType=1',
                        rules: [
                            {
                                required: true,
                                message: this.$t('unionFunds.collectingUnitRequired'),
                            },
                        ],
                        change:this.getSupplyRow
                    },
                    {
                        type: "input",
                        label: this.$t('unionFunds.bankName'),
                        span: 12,
                        disabled: true,
                        prop: "bankName",
                    },
                    {
                        type: "input",
                        disabled: true,
                        label: this.$t('unionFunds.bankAccount'),
                        span: 12,
                        prop: "bankAccount",
                    },
                ],
                menuBtn: true,
                submitBtn: false,
                emptyBtn: false,
                labelWidth: 160,
                disabled: this.disabled
            },
            rules: {
                applyReason: [
                    { required: true, message: this.$t('unionFunds.applyReasonRequired'), trigger: 'blur' }
                ],

            }
        }
    },
    mounted() {
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
        }
        this.getSupply()
    },
    computed: {
        disabled() {
            // console.log('ssssssss')
            // console.log(this.businessId && !this.$route.query.isEdit)
            return this.businessId && !this.$route.query.isEdit;
        },
        // ...mapGetters(['userInfo']),
    },
    methods: {
        async getDetail() {
            let res = await FinancialManagementApi.unionFundsDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.$emit("getFormData", this.form);
            }
        },
        async getSupply(){
            let res = await UserApi.contractSupplier()
            console.log(res)
            this.supplyList = res.data.data
        },
        getSupplyRow(v){
            let row = this.supplyList.find(ele=>{
                return ele.id === v.value
            })
            if(row.supplierSettlementList&&row.supplierSettlementList.length>0){
                this.form.bankName = row.supplierSettlementList[0].openBank
                this.form.bankAccount = row.supplierSettlementList[0].bankAccount
            }
        },
        addRow(key) {
            this.form[key].push({})
        },
        getPerson(data){
            this.form.activityManager = data.realName
            this.form.activityManagerId = data.id
        },
        getRMB(row, index, key) {
            if (row.amount && row.exchangeRate) {
                row.rmbAmount = Number(row.amount) * Number(row.exchangeRate).toFixed(2)
            }
            this.$set(this.form[key], index, row)
        },
        getToTal(key) {
            var arr = this.form[key].map(ele => Number(ele.rmbAmount) || 0)
            var sum = arr.reduce(function (a, b) { return a + b }, 0)
            this.amountObj[key + 'Amount'] = sum
            this.allTotalAmount = Number(this.amountObj.utilListAmount) + Number(this.amountObj.otherListAmount) + Number(this.amountObj.perkListAmount) + Number(this.amountObj.hotelListAmount)
            // console.log(this.allTotalAmount)
            this.$emit('allTotalAmount', this.allTotalAmount)
            return { amount: this.$formatAmt(sum), amountChinese: numberToTraditionalChinese(sum) }
        },
        testForm() {
            if(!this.slotForm.titleName){
                this.$message.error(this.$t('unionFunds.titleNameRequired'))
                return
            }
            if(!this.slotForm.totalAmount){
                this.$message.error(this.$t('unionFunds.totalAmountRequired'))
                return
            }
            return new Promise((resolve) => {
                this.$refs.formBaseInfo.validate((valid, done, msg) => {
                    msg &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    this.$refs.formBudget.validate((validForm) => {
                        resolve(valid && validForm);
                    })
                    done();
                });
            });

        }

    }
}
</script>

<style scoped lang="scss">
.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.w-100 {
    width: 100%;
}

</style>
