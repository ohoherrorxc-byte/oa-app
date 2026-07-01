<template>
    <div class="w-100  businessNegotiation ">
        <div class="text-right" v-if="!disabled">
            <el-button type="success" @click="addSupply">{{ $t('purchaseCommissionDecision.business.addSupplier') }}</el-button>
        </div>
        <el-form class="content" :rules="rules" :model="form" ref="form">
            <el-row class="row1 " id="descProject">
                <el-col :span="8" class="border-right set-padding ">
                    <!-- <p>项目描述</p> -->
                    <el-form-item prop="projectDesc" :label="$t('purchaseCommissionDecision.business.projectDesc')">
                        <el-input autosize v-if="!disabled" type="textarea" @blur="changeDesc"
                            v-model="form.projectDesc"></el-input>
                        <div v-else> {{ form.projectDesc }}</div>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="4" class="border-right child">
                    <p class="title-blue "><span style="color:#F56C6C ;" class="pr2 ">*</span>申请单位</p>
                    <el-form-item prop="applyCommpany">
                        <el-input v-if="!disabled" v-model="form.applyCommpany" type="text" class="set-margin"></el-input>
                        <div v-else>{{ form.applyCommpany }}</div>
                    </el-form-item>
                </el-col> -->
                <el-col :span="4" class="border-right child">
                    <p class="title-blue"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.applyDept') }}</p>
                    <el-form-item prop="assessorApplyDept">
                        <el-select v-if="!disabled" type="text" v-model="form.assessorApplyDept" class="set-margin">
                            <el-option v-for="item in deptList" :label="item.deptName" :value="item.deptName"></el-option>
                        </el-select>
                        <div v-else>{{ form.assessorApplyDept }}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="border-right child">
                    <p class="title-blue"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.budgetSubject') }}</p>
                    <el-form-item prop="subjectName" class="pt10">
                        <elSelectTree v-if="!disabled" @getValue="getSubjetRow" :value="{ name: form.subjectName }"
                            :options="subjectList" :accordion="false" :disabled="disabled" :props="deptProps">
                        </elSelectTree>
                        <div v-else>{{ form.subjectName }}</div>
                        <!-- <el-select v-if="!disabled" type="text" v-model="form.assessorApplyDept" class="set-margin">
                            <el-option v-for="item in deptList" :label="item.deptName" :value="item.deptName"></el-option>
                        </el-select>
                        <div v-else>{{ form.assessorApplyDept }}</div> -->
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="border-right child">
                    <p class="title-blue"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.subjectCode') }}</p>
                    <el-form-item prop="">
                        <!-- <el-input v-if="!disabled" type="text" v-model="form.wbsNo" class="set-margin"></el-input> -->
                        <div>{{ form.wbsNo }}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="border-right child">
                    <p class="title-blue"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.availableBudget') }}</p>
                    <el-form-item prop="wbsNo">
                        <!-- <el-input v-if="!disabled" type="text" v-model="form.availableBudget" class="set-margin"></el-input> -->
                        <div>{{ form.availableBudget }}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="child">
                    <p class="title-blue"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.currency') }}</p>
                    <el-form-item prop="currency">
                        <el-select v-if="!disabled" type="text" v-model="form.currency" class="set-margin">
                            <el-option v-for="item in currencyList" :key="item.dictKey" :label="item.dictValue"
                                :value="item.dictKey"></el-option>
                        </el-select>
                        <div v-else>{{ form.currency }}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-table :data="form.potentialSupplierList" border style="width: 100%">
                        <el-table-column prop="supplierName" label="潜在供应商" align="center">
                            <template slot="header">
                                {{$t('purchaseCommissionDecision.business.potentialSupplier')}}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input v-if="!disabled" v-model="scope.row.supplierName"
                                        @change="changeList"></el-input>
                                    <div v-else>{{ scope.row.supplierName | formatSupplyName }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="initialQuotation" :label="$t('purchaseCommissionDecision.business.initialQuote')" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input v-if="!disabled" v-model="scope.row.initialQuotation"
                                        @blur="getSaveMoney(scope.row, scope.$index)"></el-input>
                                    <div v-else>{{ scope.row.initialQuotation }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="evalResult" :label="$t('purchaseCommissionDecision.business.techEvalScore')" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <!-- <el-input v-if="!disabled" v-model="scope.row.evalResult"></el-input> -->
                                    <div>{{ scope.row.evalResult }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="evalPrice" :label="$t('purchaseCommissionDecision.business.techUnifiedPrice')" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input v-if="!disabled" v-model="scope.row.evalPrice"></el-input>
                                    <div v-else>{{ scope.row.evalPrice }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="finalPrice"  :label="$t('purchaseCommissionDecision.business.finalPrice')" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input v-if="!disabled" v-model="scope.row.finalPrice"></el-input>
                                    <div v-else>{{ scope.row.finalPrice }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="totalPriceHasTax" :label="$t('purchaseCommissionDecision.business.totalPriceWithTax')" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input v-if="!disabled" v-model="scope.row.totalPriceHasTax"
                                        @blur="getSaveMoney(scope.row, scope.$index)"></el-input>
                                    <div v-else>{{ scope.row.totalPriceHasTax }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="savingAmount" :label="$t('purchaseCommissionDecision.business.savingAmount')" align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <!-- <el-input v-if="!disabled" v-model="scope.row.savingAmount"></el-input> -->
                                    <div>{{ scope.row.savingAmount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="savingRate" :label="$t('purchaseCommissionDecision.business.savingRate')"  align="center">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <!-- <el-input v-if="!disabled" v-model="scope.row.savingRate"></el-input> -->
                                    <div>{{ scope.row.savingRate }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" align="center" :label="$t('commonContent.operation')" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-button @click="delRow(scope.row, scope.$index)" type="text" class="red">{{$t('commonContent.delete')}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row class="row2">
                <el-col :span="8" class="border-right set-padding">
                    <el-form-item prop="contractType">
                        <div class="flex-center">
                            <div style="color:#F56C6C ;" class="pr5 ">*</div>
                            <el-select type="text" v-if="!disabled" clearable v-model="form.contractType" class="mt10"
                                placeholder="合同类型">
                                <el-option label="闭口合同" :value="1"></el-option>
                                <el-option label="框架协议+订单" :value="2"></el-option>
                            </el-select>
                            <div v-else>{{ form.contractType === 1 ? '闭口合同' : "框架协议+订单" }}</div>
                        </div>
                    </el-form-item>

                </el-col>
                <el-col :span="16" class="flex set-padding">
                    <p style="width:100px;font-size: 14px;" class='mt5'> <span style="color:#F56C6C ;"
                            class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.finalFee') }}:</p>
                    <el-form-item prop="finalCost">
                        <el-input type="textarea" autosize v-if="!disabled" class="" v-model="form.finalCost"
                            placeholder="最终费用"></el-input>
                        <div v-else>{{ form.finalCost }}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="row3">
                <el-col :span="6" class="border-right set-padding">
                    <el-form-item prop="recommentSupplierType">
                        <div class="flex">
                            <div style="color:#F56C6C ;" class="pr5 ">*</div>
                            <el-select v-if="!disabled" v-model="form.recommentSupplierType" class="mb10">
                                <el-option label="推荐供应商" :value='1'></el-option>
                                <el-option label="申请单一供应商原因说明" :value='2'></el-option>
                            </el-select>
                            <div v-else-if="disabled">{{ form.recommentSupplierType == 1 ? "推荐供应商" : "申请单一供应商原因说明" }}</div>
                        </div>
                    </el-form-item>
                    <el-select placeholder="推荐供应商名称" multiple v-if="form.recommentSupplierType == 1 && !disabled"
                        v-model="form.recommentSupplierName">
                        <el-option v-for="item in form.potentialSupplierList" :key="item.supplierName"
                            :value="item.supplierName" :label="item.subjectName"></el-option>
                    </el-select>
                    <!-- <el-input type="textarea" autosize 
                      ></el-input> -->
                    <div v-else-if="form.recommentSupplierType == 1 && disabled">
                        {{ form.recommentSupplierName }}</div>
                    <el-input type="textarea" autosize placeholder="申请单一供应商原因说明"
                        v-if="form.recommentSupplierType == 2 && !disabled" v-model="form.singleSupplierDesc"></el-input>
                    <div v-else-if="form.recommentSupplierType == 2 && disabled">{{ form.singleSupplierDesc }}</div>
                </el-col>
                <el-col :span="4" class="border-right set-padding">
                    <el-form-item :label="$t('purchaseCommissionDecision.business.deliveryDate')" prop="deliveryDate">
                        <el-input v-if="!disabled" v-model="form.deliveryDate" type="text"></el-input>
                        <div v-else>{{ form.deliveryDate }}</div>
                    </el-form-item>

                </el-col>
                <el-col :span="14" class="inner set-padding">
                    <div>
                        <div class="flex mb2">
                            <p class="name-width"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.priceDescription') }}</p>
                            <el-form-item prop="priceDesc" style="width: 100%;">
                                <el-input v-if="!disabled" type="text" v-model="form.priceDesc"></el-input>
                                <div v-else>{{ form.priceDesc }}</div>
                            </el-form-item>
                        </div>
                        <div class="flex mb2">
                            <p class="name-width"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.paymentTerms') }}</p>
                            <el-form-item prop="payCondition" style="width: 100%;">
                                <el-input v-if="!disabled" type="text" v-model="form.payCondition"></el-input>
                                <div v-else>{{ form.payCondition }}</div>
                            </el-form-item>
                        </div>
                        <div class="flex">
                            <p class="name-width"><span style="color:#F56C6C ;" class="pr2 ">*</span>{{ $t('purchaseCommissionDecision.business.contractValidity') }}</p>
                            <el-form-item prop="contractValidDate" style="width: 100%;">
                                <el-input v-if="!disabled" v-model="form.contractValidDate"></el-input>
                                <!-- <el-date-picker v-if="!disabled" style="width: 100%;" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="form.contractValidDate"></el-date-picker> -->
                                <div v-else>{{ form.contractValidDate }}</div>
                            </el-form-item>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { getDictionary } from "@/api/system/dict";
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import elSelectTree from '@/components/elSelectTree/index'
import subjectManageApi from '@/api/subjectManage'
export default {
    data() {
        return {
            deptList: [],
            currencyList: [],
            form: {
                applyCommpany: null,
                assessorApplyDept: null,
                projectDesc: null,
                wbsNo: null,
                currency: null,
                contractType: null,
                finalCost: null,
                recommentSupplierType: null,
                singleSupplierDesc: null,
                recommentSupplierName: null,
                deliveryDate: null,
                priceDesc: null,
                payCondition: null,
                contractValidDate: null,
                subjectName: null,
                potentialSupplierList: [{ supplierName: '', key: new Date() + 1 }, { supplierName: "", key: new Date() + 2 }, { supplierName: "", key: new Date() + 3 }]
            },
            rules: {
                projectDesc: [
                    { required: true, message: '请输入项目描述', trigger: 'blur' }
                ],
                applyCommpany: [
                    { required: true, message: '请输入申请单位', trigger: 'blur' }
                ],
                assessorApplyDept: [
                    { required: true, message: '请输入申请部门', trigger: 'change' }
                ],
                wbsNo: [
                    { required: true, message: '请输入WBS', trigger: 'blur' }
                ],
                currency: [
                    { required: true, message: '请选择币种', trigger: 'change' }
                ],
                contractType: [
                    { required: true, message: '请选择合同类型', trigger: 'change' }
                ],
                finalCost: [
                    { required: true, message: '请输入最终费用', trigger: 'blur' }
                ],
                recommentSupplierType: [
                    { required: true, message: '请选择供应商类型', trigger: 'change' }
                ],
                deliveryDate: [
                    { required: true, message: '请输入交货期', trigger: 'blur' }
                ],
                priceDesc: [
                    { required: true, message: '请输入价格说明', trigger: 'blur' }
                ],
                payCondition: [
                    { required: true, message: '请输入支付条件', trigger: 'blur' }
                ],
                contractValidDate: [
                    { required: true, message: '请输入合同有效期', trigger: 'blur' }
                ],
                subjectName: [
                    { required: true, message: '请选择科目名称', trigger: 'change' }
                ]
            },
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },
            subjectList: [],
            searchForm: {
                currentPage: 1,
                pageSize: 10000,
            },
        }
    },
    filters: {
        formatSupplyName(value) {
            var newUrl = value.replace(new RegExp('&amp;', 'g'), "&");
            return newUrl
        }
    },
    components: {
        elSelectTree
    },
    props: {
        formData: {
            type: Object,
            default: {}
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isPdfDown: {
            type: Boolean,
            default: false
        },
        purchaseList: {
            type: Array,
            default: []
        }
    },
    watch: {
        formData() {
            if (this.formData.id) {
                this.form.projectDesc = this.formData.projectDesc
                this.form.applyCommpany = this.formData.applyCommpany
                this.form.assessorApplyDept = this.formData.assessorApplyDept
                this.form.wbsNo = this.formData.wbsNo
                this.form.currency = this.formData.currency
                this.form.contractType = this.formData.contractType
                this.form.finalCost = this.formData.finalCost
                this.form.recommentSupplierType = this.formData.recommentSupplierType
                this.form.singleSupplierDesc = this.formData.singleSupplierDesc
                if (this.formData.recommentSupplierName) {
                    this.form.recommentSupplierName = this.formData.recommentSupplierName.split(',')
                }
                this.form.deliveryDate = this.formData.deliveryDate
                this.form.priceDesc = this.formData.priceDesc
                this.form.payCondition = this.formData.payCondition
                this.form.contractValidDate = this.formData.contractValidDate
                this.form.potentialSupplierList = this.formData.potentialSupplierList
                this.form.potentialSupplierList.map(ele => {
                    if(ele&&ele.supplierName){
                        ele.supplierName =   ele.supplierName.replace(new RegExp('&amp;', 'g'), "&"); 
                    }                
                })
                this.form.subjectName = this.formData.subjectName
                this.form.availableBudget = this.formData.availableBudget
            }
            if (!this.form.assessorApplyDept) {
                this.form.assessorApplyDept = this.formData.assessorDeptName
            }
            this.$refs.form.clearValidate()

        },
        purchaseList: {
            handler() {

            },
            deep: true

        }
    },
    created() {
    },
    mounted() {
        this.getDeptList()
        this.getDictionary()
        this.getSubjectList()
        this.$emit('getSupplyList', this.form.potentialSupplierList.map(ele => ele.supplierName))
    },
    methods: {
        async getSubjectList() {
            let res = await subjectManageApi.getList(this.searchForm)
            if (res.data.code === 0) {
                this.subjectList = res.data.data
            }
        },
        updateData(purchaseList) {
            console.log(purchaseList)
            this.form.potentialSupplierList.map(ele => {
                purchaseList.map(self => {
                    if (self.supplierName === ele.supplierName) {
                        console.log(Number(self.totalEvalScore))
                        if (Number(self.totalEvalScore) > 0) {
                            // console.log('22222')
                            ele.evalResult = Number(self.totalEvalScore) <6 ? `不合格，${Number(self.totalEvalScore)}` : `合格，${Number(self.totalEvalScore)}`
                        }
                    }
                })
            })
        },
        getSubjetRow(row) {
            console.log(row)
            this.form.availableBudget = row.availableBudget
            this.form.wbsNo = row.subjectCode
            this.form.subjectName = `${row.parentSubjectName}/ ${row.subjectName}`
        },
        getDictionary() {
            getDictionary({ code: "CURRENCY" }).then((res) => {
                this.currencyList = res.data.data;
            });
        },
        getSaveMoney(row, index) {
            if (row.initialQuotation && row.totalPriceHasTax) {
                row.savingAmount = Number(row.initialQuotation) - Number(row.totalPriceHasTax)
                row.savingAmount = row.savingAmount.toFixed(2)
                row.savingRate = Number((row.savingAmount / row.initialQuotation) * 100).toFixed(2)
            }
            this.$set(this.form.potentialSupplierList, index, row)
        },
        getDeptList() {
            getLazyList('', 629965).then((res) => {
                this.deptList = res.data.data;
            });
        },
        changeList() {
            this.$emit('getSupplyList', this.form.potentialSupplierList.map(ele => ele.supplierName))
        },
        delRow(row, index) {
            this.form.potentialSupplierList.splice(index, 1)
            this.$emit('updateSupply', 'del', index)
            this.$emit('getSupplyList', this.form.potentialSupplierList.map(ele => ele.supplierName))
        },
        testForm() {
            return new Promise((resolve) => {
                this.$refs.form.validate((valid, msg) => {
                    resolve(valid);
                    if (valid) {
                    } else {
                        msg &&
                            this.$message({
                                message: Object.values(msg)[0][0].message,
                                type: "warning",
                            });
                        return false;
                    }
                });
            });
        },
        addSupply() {
            this.form.potentialSupplierList.push({
                supplierName: null,
                key: new Date()
            })
            this.$emit('updateSupply', 'add')
            this.$emit('getSupplyList', this.form.potentialSupplierList.map(ele => ele.supplierName))
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep ep.el-form-item__label {
    text-align: center;
    width: 100%;
}

@media screen and (max-width: 992px) {
    .businessNegotiation {
        font-size: 12px;
    }
}

.inner {

    ::v-deep ep.el-form-item {
        margin-bottom: 10px;
    }
}

.text-right {
    text-align: right;
    margin-bottom: 10px;
}

.content {
    border: 1px solid #DCDFE6;
}

.title-blue {
    height: 40px;
    line-height: 40px;
    background-color: #ebedf0;

}

.w-100 {
    width: 100%;
}

.row1 {
    // position: absolute;
    display: flex;
    min-height: 100px;
    border-bottom: 1px solid #DCDFE6;
}

.child {
    flex: 1;

}

.set-margin {
    margin: 10px 0;
    width: 90%;
}

.row2 {
    min-height: 60px;
    display: flex;
    border-bottom: 1px solid #DCDFE6;
}

.row3 {
    min-height: 100px;
    display: flex;
    font-size: 14px;
}

.border-right {
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;

}

.set-padding {
    padding: 5px 10px;
}

.el-col {
    text-align: center;
    // height: 100%;

}

.name-width {
    width: 100px;
}
</style>