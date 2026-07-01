<template>
    <el-dialog width="80%" :visible.sync="supplierDialogFormVisible" append-to-body @close="editDialogClose">
        <template slot="title">
            <div style="font-size: 15px">{{ dialogTitle }}</div>
        </template>
        <el-form disabled :model="editForm" label-width="120px">
            <el-row>
                <el-card>
                    <div slot="header">
                        <span>基本信息</span>
                    </div>
                    <el-col :span="12">
                        <el-form-item prop="applyTime">
                            <label slot="label">申请日期:</label>
                            <el-input v-model="editForm.applyTime" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '申请日期'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="supplierDesc">
                            <label slot="label">供应商说明:</label>
                            <el-select v-model="editForm.supplierDesc">
                                <el-option value="BOM框架供应商" label="BOM框架供应商"></el-option>
                                <el-option value="一般通用采购供应商" label="一般通用采购供应商"></el-option>
                                <el-option value="零星采购供应商" label="零星采购供应商"></el-option>
                                <el-option value="其他" label="其他"></el-option>
                            </el-select>
                            <!-- <el-input v-model="editForm.supplierDesc" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '供应商说明'" :disabled="isShowDetail"></el-input> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="supplierName">
                            <label slot="label">供应商名称:</label>
                            <el-input v-model="editForm.supplierName" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '供应商名称'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="supplierNo">
                            <label slot="label">供应商编号:</label>
                            <el-input v-model="editForm.supplierNo" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '供应商编号'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="supplierType">
                            <label slot="label">供应商类型:</label>
                            <el-select v-model="editForm.supplierType" :placeholder="isShowDetail ? '' : '供应商类型'"
                                :disabled="isShowDetail" clearable>
                                <el-option v-for="item in OptionsList" :key="item.label" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="contactPerson">
                            <label slot="label">联系人:</label>
                            <el-input v-model="editForm.contactPerson" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '联系人'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="contactNumber">
                            <label slot="label">联系电话:</label>
                            <el-input v-model="editForm.contactNumber" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '联系电话'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                </el-card>
                <el-card class="mt10" v-for="(item, index) in editForm.supplierSettlementList">
                    <div slot="header">
                        <div class="head-flex">
                            <p>结算信息</p>

                        </div>
                    </div>
                    <el-col :span="12">
                        <el-form-item>
                            <label slot="label">开户行:</label>
                            <el-input v-model="item.openBank" autocomplete="off" :placeholder="isShowDetail ? '' : '开户行'"
                                :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <label slot="label">银行账号:</label>
                            <el-input v-model="item.bankAccount" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '银行账号'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :key="index">
                            <label slot="label">
                                <span style="color: #F56C6C;">*</span>
                                原币种:</label>
                            <el-select v-model="item.originalCurrency" :placeholder="isShowDetail ? '' : '原币种'"
                                :disabled="isShowDetail" @change="getRate(item)">
                                <el-option v-for="item in CurrencyList" :key="item.dictKey" :label="item.dictValue"
                                    :value="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <label slot="label">
                                <span style="color: #F56C6C;">*</span>
                                结算币种:</label>
                            <el-select v-model="item.settlementCurrency" :placeholder="isShowDetail ? '' : '结算币种'"
                                :disabled="isShowDetail" @change="getRate(item)">
                                <el-option v-for="item in CurrencyList" :key="item.dictKey" :label="item.dictValue"
                                    :value="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <label slot="label">
                                <span style="color: #F56C6C;">*</span>
                                汇率计算方式:</label>
                            <el-select v-model="item.exchangeRateMethod" :placeholder="isShowDetail ? '' : '汇率计算方式'"
                                :disabled="isShowDetail || (item.settlementCurrency === item.originalCurrency)">
                                <el-option v-for="item in exchangeRateList" :disabled="item.id === 1" :key="item.id"
                                    :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-card>
                <!-- <el-card class="mt10">
                    <div slot="header">
                        <span>结算信息</span>
                    </div>
                    <el-col :span="12">
                        <el-form-item prop="openBank">
                            <label slot="label">开户行:</label>
                            <el-input v-model="editForm.openBank" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '开户行'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="bankAccount">
                            <label slot="label">银行账号:</label>
                            <el-input v-model="editForm.bankAccount" autocomplete="off"
                                :placeholder="isShowDetail ? '' : '银行账号'" :disabled="isShowDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="status">
                            <label slot="label">状态:</label>
                            <el-select v-model="editForm.status" :placeholder="''"
                                :disabled="isShowDetail" clearable>
                                <el-option v-for="item in OptionsListOne" :key="item.label" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="originalCurrency">
                            <label slot="label">原币种:</label>
                            <el-select v-model="editForm.originalCurrency" :placeholder="isShowDetail ? '' : '原币种'"
                                :disabled="isShowDetail" @change="getRate">
                                <el-option v-for="item in CurrencyList" :key="item.dictKey" :label="item.dictValue"
                                    :value="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="settlementCurrency">
                            <label slot="label">结算币种:</label>
                            <el-select v-model="editForm.settlementCurrency" :placeholder="isShowDetail ? '' : '结算币种'"
                                :disabled="isShowDetail" @change="getRate">
                                <el-option v-for="item in CurrencyList" :key="item.dictKey" :label="item.dictValue"
                                    :value="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="exchangeRateMethod">
                            <label slot="label">汇率计算方式:</label>
                            <el-select v-model="editForm.exchangeRateMethod" :placeholder="isShowDetail ? '' : '汇率计算方式'"
                                :disabled="isShowDetail || originalCurrency">
                                <el-option v-for="item in exchangeRateList" :disabled="item.id === 1" :key="item.id"
                                    :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-card> -->
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
import constData from "@/config/constData";
import { getCurrency } from "@/api/contract/partsMaint";
import { getDetail } from '@/api/contract/contractSupplier'
export default {
    data() {
        return {
            supplierDialogFormVisible: false,
            editForm: {
                applyTime: null,
                supplierDesc: null,
                supplierName: null,
                supplierNo: null,
                supplierType: null,
                contactPerson: null,
                contactNumber: null,
                openBank: null,
                bankAccount: null,
                status: null,
                originalCurrency: null,
                settlementCurrency: null,
                exchangeRateMethod: null
            },
            OptionsListOne: [
                {
                    label: "合格",
                    value: 1,
                },
                {
                    label: "不合格",
                    value: 2,
                },
            ],
            OptionsList: constData.supplierType,
            CurrencyList: [],
            exchangeRateList: constData.exchangeRateList
        }
    },
    props: {
        // editForm:{
        //     type:Object,
        //     default:{}
        // }
    },
    mounted() {
        this.getCurrency({ code: "CURRENCY" })
    },
    methods: {
        async getDetailSupply(supplierNo) {
            if (!supplierNo) return
            let res = await getDetail({ supplierNo: supplierNo })
            if (res.data.code === 0 || res.data.code === 200) {
                this.editForm = res.data.data
            }
        },
        getCurrency(params) {
            getCurrency(params).then((res) => {
                this.CurrencyLsist = res.data.data;
            });
        },
        editDialogClose() {
            this.supplierDialogFormVisible = false
        },
    }
}
</script>