<template>
    <div>
        <flow approvalName="因公出差申请" @titleChange="titleChange" @getFormData="getFormData" :canWriteInfo="true" :slotForm="form" :detailId="businessId"
            :processInstanceId="processInstanceId" componentTag="onBusinessTrip">
            <template slot="baseInfo">
                <el-form :model="form" :rules="rules">
                    <el-form-item :label="$t('businessHospitality.applyReason')" :label-width="isMobile ? '70px' : '120px'" prop="applyReason">
                        <el-input type="textarea" v-model="form.applyReason"
                        autosize  :disabled="this.businessId && !this.$route.query.isEdit"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
import { mapGetters } from 'vuex'
import { getFormatDate } from '@/util/util'
export default {
    components: { flow },
    data() {
        return {
            processInstanceId: "",
            form: {
                applyReason: null,
                titleName:'因公出差'
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
        ...mapGetters(["isMobile","userInfo"]),
        disabled() {
            return this.businessId && !this.$route.query.isEdit;
        },
    },
    created(){
    //    this.form.titleName =   "因公出差" +
    //     " - " +
    //     (this.userInfo.nick_name||this.userInfo.realName||this.userInfo.user_name) +
    //     " - " +
    //     getFormatDate();
    },
    methods: {
        getFormData(data) {
            this.form.applyReason = data.applyReason         
        },
        titleChange(data){
            // console.log(data)
            this.form.titleName = data
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