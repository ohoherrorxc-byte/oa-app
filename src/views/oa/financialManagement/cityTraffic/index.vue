<template>
    <div>
        <flow ref="flowRef" approvalName="市内交通费用报销" @allTotalAmount="allTotalAmount" :detailId="businessId"
         :slotForm="form" @getFormData="getFormData"  :processInstanceId="processInstanceId" componentTag="cityTraffic" :approvalSave="true">
            <template slot="baseInfo">
                <el-form class="form-all" label-width="120px" :model="form" :rules="rules">
                    <el-form-item  :label="$t('cityTraffic.totalAmount')">
                        <el-input v-model="form.totalAmount" disabled></el-input>
                    </el-form-item>
                    <el-form-item  :label="$t('cityTraffic.amountInWords')">
                        <el-input v-model="form.amountInWords" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('cityTraffic.applyReason')" style="width: 100%;" prop="applyReason">
                        <el-input autosize type="textarea" v-model="form.applyReason" :disabled="this.businessId && !this.$route.query.isEdit"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
import { numberToTraditionalChinese } from '@/util/util'
import {mapGetters} from 'vuex'
export default {
    components: { flow },
    data() {
        return {
            processInstanceId: "",
            form: {
                totalAmount: 0,
                amountInWords: null,
                applyReason:null
            },
            rules: {
                applyReason: [
                    { required: true, message: this.$t('cityTraffic.applyReasonRequired'), trigger: 'blur' }
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
        allTotalAmount(allTotalAmount) {
            this.form.totalAmount = this.$formatAmt(allTotalAmount)
            this.form.amountInWords = numberToTraditionalChinese(allTotalAmount)
            if(this.$refs.flowRef&&this.$refs.flowRef.getFormTitle){
                    this.$refs.flowRef.getFormTitle(this.form.totalAmount)
                }
        },
        getFormData(data) {
            console.log('yyyyy')
            console.log(data)
            this.form.applyReason = data.applyReason
            this.form.totalAmount = data.totalAmount
            this.form.amountInWords = data.amountInWords
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

// .w48{
//     width: 48%;
// }
</style>
