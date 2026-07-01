<template>
    <div>
        <flow ref="flowRef" @titleChange="titleChange" approvalName="工会经费使用申请表" @getFormData="getFormData" @allTotalAmount="allTotalAmount" :slotForm="form"
        :approvalSave="true"  :detailId="businessId" :canWriteInfo="true" :processInstanceId="processInstanceId" componentTag="unionFunds">
            <template slot="baseInfo">
                <el-form class="form-all" label-width="120px" :model="form" :rules="rules">
                    <el-form-item :label="$t('unionFunds.applyAmount')" prop="totalAmount">
                        <el-input v-model="form.totalAmount" @blur="getChinese" :disabled="this.businessId && !this.$route.query.isEdit"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('unionFunds.amountInWords')">
                        <el-input v-model="form.amountInWords" disabled></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
import { numberToTraditionalChinese } from '@/util/util'
import { mapGetters } from 'vuex'
export default {
    components: { flow },
    data() {
        return {
            form: {
                totalAmount: null,
                amountInWords: null,
                titleName:'工会经费'
            },
            processInstanceId: "",
            rules: {
                totalAmount: [
                    { required: true, message: this.$t('unionFunds.applyAmountRequired'), trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters(["isMobile"]),
        disabled() {
            return this.businessId && !this.$route.query.isEdit;
        },
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
    },
    methods: {
        getChinese(allTotalAmount) {
            this.form.amountInWords = numberToTraditionalChinese(this.form.totalAmount)||null
            this.$nextTick(()=>{
                if(this.$refs.flowRef&&this.$refs.flowRef.getFormTitle){
                    this.$refs.flowRef.getFormTitle(this.form.totalAmount)
                }
            })
        },
        getFormData(data) {
            // this.form.applyReason = data.applyReason
            this.form.totalAmount = data.totalAmount
            this.form.amountInWords = data.amountInWords

        },
        titleChange(data){
            // console.log(data)
            this.form.titleName = data
        }
    }
}
</script>

<style scoped lang="scss">
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
