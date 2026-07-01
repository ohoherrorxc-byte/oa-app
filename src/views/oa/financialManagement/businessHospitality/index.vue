<template>
    <div>
        <flow ref="flowRef" approvalName="业务招待费用报销" @allTotalAmount="allTotalAmount" @getFormData="getFormData" :slotForm="form"
            :detailId="businessId" :processInstanceId="processInstanceId" componentTag="businessHospitality" :approvalSave="true">
            <template slot="baseInfo">
                <el-form class="form-all" :model="form" :rules="rules" :label-width="isMobile ? '70px' : '120px'" :disabled="disabled">
                    <el-form-item :label="$t('businessHospitality.totalAmount')">
                        <el-input v-model="form.totalAmount" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('businessHospitality.amountInWords')">
                        <el-input v-model="form.amountInWords" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('businessHospitality.applyReason')" style="width: 100%;" prop="applyReason">
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
import { mapGetters } from 'vuex'
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
                    { required: true, message: this.$t('businessHospitality.applyReasonRequired'), trigger: 'blur' }
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
    methods: {
        allTotalAmount(allTotalAmount) {
            this.form.totalAmount = this.$formatAmt(allTotalAmount)
            this.form.amountInWords = numberToTraditionalChinese(allTotalAmount)
            this.$nextTick(()=>{
                if(this.$refs.flowRef&&this.$refs.flowRef.getFormTitle){
                    this.$refs.flowRef.getFormTitle(this.form.totalAmount)
                }

            })

        },
        getFormData(data) {
            this.form.applyReason = data.applyReason
            this.form.totalAmount = data.totalAmount
            this.form.amountInWords = data.amountInWords

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
