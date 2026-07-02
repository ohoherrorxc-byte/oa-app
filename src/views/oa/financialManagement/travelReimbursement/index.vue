<template>
    <div>
        <suspense>
        <flow approvalName="差旅报销申请" :approvalSave="true" ref="flowRef" @getFormData="getFormData"  @allTotalAmount="allTotalAmount" :slotForm="form" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="travelReimbursement">
            <template slot="baseInfo">
                <el-form  class="form-all" :label-width="isMobile?'100px':'120px'" :model="form" :rules="rules">
                    <el-form-item :label="$t('travelReimbursement.reimbursementTotalAmount')" >
                        <el-input  v-model="form.totalAmount" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('travelReimbursement.reimbursementAmountInWords')" >
                        <el-input v-model="form.amountInWords" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('travelReimbursement.applyInfo')" style="width: 100%;" prop="applyReason">
                        <el-input  :autosize="{ minRows: 3}"  type="textarea" v-model="form.applyReason" :disabled="this.businessId && !this.$route.query.isEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="是否异常报销" prop="reimburseStatus">
                                <el-select v-model="form.reimburseStatus" clearable>
                                  <el-option value="是"></el-option>
                                  <el-option value="否"></el-option>
                                </el-select>
                                <p class="red">实际行程与出差申请单不符、费用超标、退改签费用、费用真实性存疑</p>
                    </el-form-item>
                </el-form>
            </template>
        </flow>
        <template #fallback>
            <flow-skeleton />
        </template>
        </suspense>
    </div>
</template>

<script>
// 异步加载 flow：第一次进入下载共享 flow chunk（webpackChunkName 固定为 "flow"），
// 后续所有 flow 页面命中浏览器缓存秒进；加载期间显示 skeleton 占位
import FlowSkeleton from '@/components/flow/FlowSkeleton'
import { numberToTraditionalChinese } from '@/util/util'
import {mapGetters} from 'vuex'
export default {
    name:"差旅报销申请",
    components: {
        flow: () => import(/* webpackChunkName: "flow" */ '@/components/flow/index'),
        FlowSkeleton
    },
    data() {
        return {
            form:{
                totalAmount:null,
                amountInWords:null,
                applyReason:null,
                reimburseStatus:'否'
            },
            processInstanceId: "",
            rules: {
                applyReason: [
                    { required: true, message: this.$t('travelReimbursement.applyReasonRequired'), trigger: 'blur' }
                ],
                reimburseStatus: [
                    { required: true, message: '请选择是否异常报销', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
    },
    computed: {
        ...mapGetters(["isMobile"]),
        disabled() {
            return this.businessId && !this.$route.query.isEdit;
        },
    },
    methods:{
        allTotalAmount(allTotalAmount){
            this.form.totalAmount = allTotalAmount.toFixed(2)
            // console.log(allTotalAmount+'allTotalAmount')
            this.form.amountInWords = numberToTraditionalChinese(allTotalAmount)
            if(this.$refs.flowRef&&this.$refs.flowRef.getFormTitle){
                    this.$refs.flowRef.getFormTitle(this.form.totalAmount)
                }
        },
        getFormData(data){
            this.form.applyReason = data.applyReason
            this.form.totalAmount = data.totalAmount
            this.form.amountInWords = data.amountInWords
            this.form.reimburseStatus = data.reimburseStatus
        }
    }
}
</script>

<style lang="scss" scoped>
.form-all {
    display: flex;
    flex-wrap: wrap;

    @media (min-width: 768px) {
        .el-form-item {
            width: 50%;
        }
    }

}
</style>
