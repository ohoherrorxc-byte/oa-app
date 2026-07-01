<template>
    <div>
        <el-form :disabled="disabled" ref="form" :model="form" :rules="rules" label-width="160px">
            <basic-container>
                <p class="table-title">
                    <span></span>{{$t('internalTransfer.applyInfo')}}
                </p>
                <el-row class="row-content">
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.currency')" prop="currency" clearable>
                            <el-select v-model="form.currency" placeholder="请选择" @change="getPurchase">
                                <el-option v-for="item in currencyList" :value="item.dictValue" :label="item.dictValue" :key="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.exchangeRate')" prop="exchangeRate">
                            <div class="flex">
                                <el-input v-model="form.exchangeRate"></el-input>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.amount')" prop="amount">
                            <el-input v-model="form.amount" @change="changeMoney" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.amountInWords')" prop="amountInWords">
                           {{form.amountInWords}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item :label="$t('internalTransfer.payWay')" prop="payWay">
                            <el-input v-model="form.payWay"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </basic-container>
            <basic-container>
                <p class="table-title">
                    <span></span>{{$t('internalTransfer.bankTransfer')}}
                </p>
                <el-row class="row-content">
                    <el-col :span="22">
                        <el-form-item :label="$t('internalTransfer.payReason')" prop="payReason">
                            <el-input type="textarea" autosize v-model="form.payReason"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.transferOutBank')" prop="transferOutBank">
                            <div class="flex">
                                <el-select v-if="!disabled" v-model="form.transferOutBank" placeholder="请选择" @change="changeBank('transferOutBank','transferOutAccount')">
                                    <el-option v-for="item in bankList" :value="item.dictValue" :label="item.dictValue" :key="item.dictKey"></el-option>
                                </el-select>
                                <div v-else class="font12">{{ form.transferOutBank }}</div>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.transferOutAccount')" prop="transferOutAccount">
                            <el-input v-model="form.transferOutAccount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.transferInBank')" prop="transferInBank">
                            <div class="flex">
                                <el-select v-if="!disabled" v-model="form.transferInBank" placeholder="请选择" @change="changeBank('transferInBank','transferInAccount')">
                                    <el-option v-for="item in bankList" :value="item.dictValue" :label="item.dictValue" :key="item.dictKey"></el-option>
                                </el-select>
                                <div v-else class="font12">{{ form.transferInBank }}</div>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="halfSpan">
                        <el-form-item :label="$t('internalTransfer.transferInAccount')" prop="transferInAccount">
                            <el-input v-model="form.transferInAccount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </basic-container>
        </el-form>
    </div>
</template>

<script>
import FinancialManagementApi from "@/api/financialManagement/index";
import { mapGetters } from "vuex";
import { mixins } from "../Mixin";
import PurchaseApplyApi from "@/api/purchaseApply/index";
import { numberToTraditionalChinese } from '@/util/util'
import {getDictionary} from '@/api/base/index.js'
export default {
    mixins: [mixins],
    data() {
        return {
            form: {
                currency: null,
                payWay: '银行转账',
                exchangeRate: null,
                amount: null,
                amountInWords: null,
                transferOutBank: null,
                transferOutAccount: null,
                transferInBank: null,
                transferInAccount: null,
            },
            rules: {
                payee: [
                    { required: false, message: this.$t('internalTransfer.payeeRequired'), trigger: "change" },
                ],

            },
            businessId: null,
            multipleSelection: [],
            isEdit: false,
            halfSpan: 11,
            bankList:[],
            currencyList:[]
        };
    },
    props: {
        slotForm: {
            type: Object,
            default: {}
        },
        isPdfDown: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
        }
        if (this.isMobile) {
            this.halfSpan = 22
        }
        this.getPurchaseApplyList()
        this.getSupplier()
        this.getBankList()
        this.getCurrencyList()
    },
    computed: {
        ...mapGetters(["isMobile"]),
        disabled() {
            return this.businessId && !this.isEdit;
        },
    },
    methods: {
        async getDetail() {
            let res = await FinancialManagementApi.internalTransferDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.$refs.form.clearValidate();
                this.$emit("getFormData", this.form);
            }
        },
        changeMoney(){
            this.form.amountInWords =  numberToTraditionalChinese(this.form.amount)
        },
        async getBankList(){
            let res = await getDictionary({code:"companyBankAccount"})
            this.bankList = res.data.data
        },
        async getCurrencyList(){
            let res = await getDictionary({code:"CURRENCY"})
            this.currencyList = res.data.data
        },


        getRelationBill() {
            let row = this.purchaseApplyList.find(ele => {
                return ele.id === this.form.purchaseApplyId
            })
            console.log(row)
            this.form.purchaseApplyName = row.titleName
            this.form.purchaseApplyNo = row.applyNo
            this.form.purchaseAmount = row.totalAmountRmb

        },
        async getPurchaseApplyList() {
            let res = await PurchaseApplyApi.selectList();
            if (res.data.code === 200) {
                this.purchaseApplyList = res.data.data;
            }
        },
       geBank(key,codeKey){
            let row = this.bankList.find(ele=>{
              return  ele.dictValue===this.form[key]
            })
            if(row){
                this.form[codeKey] = row.dictKey
            }
        },
        testForm() {
            return new Promise((resolve) => {
                this.$refs.form.validate((valid) => {
                    resolve(valid);
                });
            });
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
    cursor: pointer;
}
.row-content{
    display: flex;
    flex-wrap: wrap;
}
</style>
