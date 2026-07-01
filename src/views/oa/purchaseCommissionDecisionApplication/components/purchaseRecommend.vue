<template>
    <div class="pt20" v-if="!isPdfDown">
        <el-form label-width="120px">
            <el-row>
                <el-col span="8"> <el-form-item :label="$t('purchaseRecommend.assessmentDept')">
                        {{ formData.assessorDeptName }}
                    </el-form-item></el-col>
                <el-col span="8"> <el-form-item :label="$t('purchaseRecommend.assessor')">
                        {{ formData.supplierAssessorName }}
                    </el-form-item></el-col>
                <el-col span="8"> <el-form-item :label="$t('purchaseRecommend.assessmentDate')">
                        <el-date-picker style="width: 100%;" v-if="!disabled" @change="changeDate"
                            value-format="yyyy-MM-dd mm:HH:ss" v-model="form.assessorDate" type="date" placeholder="选择日期">
                        </el-date-picker>
                        <div v-else>{{ form.assessorDate }}</div>
                    </el-form-item></el-col>
            </el-row>
        </el-form>
        <el-table :data="purchaseList" style="width: 100%" :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }">
            <el-table-column type="index" :width="isPdfDown ? 30 : ''">
                <template slot-scope="scope">
                    <div>
                        {{ leftTitle(scope.$index) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="itemName" :label="$t('purchaseRecommend.evaluationItem')"  :width="isPdfDown ? 60 : ''">
            </el-table-column>
            <el-table-column align="center" prop="itemDesc" :label="$t('purchaseRecommend.description')" :width="isPdfDown ? 60 : '200'">
            </el-table-column>
            <el-table-column align="center" prop="itemStandard" :label="$t('purchaseRecommend.scoringStandard')" width="200">
            </el-table-column>
            <el-table-column align="center" prop="itemWeight" :label="$t('purchaseRecommend.weight')" :width="isPdfDown ? 60 : ''">
                <template slot-scope="scope">
                    <div v-if="scope.$index < listLength - 1">
                        {{ `${(Number(scope.row.itemWeight) * 100).toFixed(2)}%` }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="item" v-for="(item, supplyIndex) in mySupplyList">
                <el-table-column align="center" :label="$t('purchaseRecommend.score')"  :width="isPdfDown ? 45 : ''">
                    <template slot-scope="scope">
                        <el-form-item>
                            <div v-if="scope.$index < listLength - 2">
                                <el-input v-if="!disabled" @blur="getFactAmount(scope.row, supplyIndex)"
                                    v-model="scope.row.purchaseSupplierEvalResultList[supplyIndex].evalScore"></el-input>
                                <div v-else>{{ scope.row.purchaseSupplierEvalResultList[supplyIndex].evalScore }}</div>
                            </div>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="$t('purchaseRecommend.actual')"  :width="isPdfDown ? 45 : ''">
                    <template slot-scope="scope">
                        <el-form-item>
                            <div v-if="scope.$index < listLength - 2">
                                {{ scope.row.purchaseSupplierEvalResultList[supplyIndex].evalScoreWeight }}
                            </div>
                            <div v-else-if="scope.$index < listLength - 1">
                                {{ getTotal(scope.row, supplyIndex) }}
                            </div>
                            <div v-else>
                                {{ getTotal(scope.row, supplyIndex)
                                    < 6 ? '小于6为：不合格' : "大于等于6为：合格" }} </div>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="$t('purchaseRecommend.remarks')" :width="isPdfDown ? 45 : ''">
                    <template slot-scope="scope">
                        <el-form-item>
                            <div v-if="scope.$index < listLength - 2">
                                <el-input type="textarea" v-if="!disabled"
                                    v-model="scope.row.purchaseSupplierEvalResultList[supplyIndex].remark"></el-input>
                                <div v-else>{{ scope.row.purchaseSupplierEvalResultList[supplyIndex].remark }}</div>
                            </div>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script>
import PurchaseCommissionDecisionApplyApi from '@/api/purchaseCommissionDecisionApplication/index'
export default {
    data() {
        return {
            purchaseList: [],
            listLength: 0,
            form: {
                assessorDate: null
            },
            isStart: true,
            nameList: null,
            mySupplyList: [],
            deepList: []
        }
    },
    props: {
        supplyList: {
            type: Array,
            default: []
        },
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
        }
    },
    mounted() {
        this.init()
        setTimeout(() => {
            this.isStart = false
        }, 10000);
    },
    watch: {
        formData() {
            if (this.formData.id) {
                this.form.assessorDate = this.formData.assessorDate
                this.purchaseList = this.formData.purchaseSupplierEvalItemList
                console.log(this.supplyList)
                console.log('this.supplyList')
                this.deepList = JSON.parse(JSON.stringify(this.purchaseList))
            }
        },
        supplyList: {
            handler() {    
                this.mySupplyList = this.supplyList  
                if (!this.isStart) {       
                    this.purchaseList = JSON.parse(JSON.stringify(this.deepList))
                }
            },
            deep: true
        }
    },
    methods: {
        async init() {
            let res = await PurchaseCommissionDecisionApplyApi.getPurchaseSupplierEvalList()
            if (res.data.code === 200 || res.data.code === 0) {
                this.purchaseList = res.data.data
                this.purchaseList.map(ele => {
                    ele.evalScore1 = null
                    ele.purchaseSupplierEvalResultList = [
                        {
                            evalScore: null,
                            evalScoreWeight: null,
                            remark: null,
                            totalEvalScore: null
                        },
                        {
                            evalScore: null,
                            evalScoreWeight: null,
                            remark: null,
                            totalEvalScore: null
                        },
                        {
                            evalScore: null,
                            evalScoreWeight: null,
                            remark: null,
                            totalEvalScore: null
                        }
                    ]
                })
            }
            this.deepList = JSON.parse(JSON.stringify(this.purchaseList))
            this.listLength = this.purchaseList.length
        },
        updateSupply(key, index) {
            this.deepList = JSON.parse(JSON.stringify(this.purchaseList))
            if (key === 'del') {
                this.deepList.map(ele => {
                    ele.purchaseSupplierEvalResultList.splice(index, 1)
                })
            } else if (key === 'add') {
                this.deepList.map(ele => {
                    ele.purchaseSupplierEvalResultList.push({
                        evalScore: null,
                        supplierName: null,
                        evalScoreWeight: null,
                        remark: null,
                        totalEvalScore: null
                    })
                })
               

            }
            this.purchaseList =  JSON.parse(JSON.stringify(this.deepList))
            // console.log(this.purchaseList)
        },
        getFactAmount(row, supplyIndex) {
            row.purchaseSupplierEvalResultList[supplyIndex].evalScoreWeight = row.purchaseSupplierEvalResultList[supplyIndex].evalScore * row.itemWeight
            row.purchaseSupplierEvalResultList[supplyIndex].evalScoreWeight = Number(row.purchaseSupplierEvalResultList[supplyIndex].evalScoreWeight).toFixed(2)
        },
        leftTitle(index) {
            let title
            if (index < this.listLength - 2) {
                title = index + 1
            } else if (index === this.listLength - 1) {
                title = '结论'
            } else if (index === this.listLength - 2) {
                title = '总计'
            }
            return title
        },
        getTotal(row, supplyIndex) {
            let values = this.purchaseList.map(ele => ele.purchaseSupplierEvalResultList[supplyIndex].evalScoreWeight)
            let sum
            sum = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return Number(prev) + Number(curr);
                } else {
                    return Number(prev);
                }
            });
            row.purchaseSupplierEvalResultList[supplyIndex].totalEvalScore = Number(sum).toFixed(2)
            this.$emit('getPurchaseList', this.purchaseList[this.purchaseList.length - 1],this.mySupplyList)
            return Number(sum).toFixed(2)
        }
    }
}
</script>