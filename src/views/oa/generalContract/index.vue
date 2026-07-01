<template>
    <div>
        <flow approvalName="一般通用采购合同付款申请" @titleChange="titleChange" @getFormData="getFormData" :canWriteInfo="true" :slotForm="form" :detailId="businessId"
            :processInstanceId="processInstanceId" componentTag="generalContract">
            <template slot="baseInfo">
                <el-form :model="form" :rules="rules">
                    <el-form-item label="申请事由" :label-width="isMobile ? '70px' : '120px'" prop="applyReason">
                        <el-input type="textarea" v-model="form.applyReason"
                            :disabled="this.businessId && !this.$route.query.isEdit"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
import { mapGetters } from 'vuex'
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
                    { required: true, message: '申请事由不能为空', trigger: 'blur' }
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