<template>
    <div class="content">
        <el-row class="row1 border-bottom">
            <el-col :span="14" class="border-right setHeight1">
                <div class="m10">
                    <p>{{ $t('purchaseCommission.projectDesc') }}</p>  <!-- 待批项目的简要描述 -->
                    {{ form.projectDesc }}
                    <!-- <el-input type="textarea" v-model=""></el-input> -->
                </div>
            </el-col>
            <el-col :span="10">
                <div class="m10">
                    <div class="flex pb2">
                        <span class="w-title">{{ $t('purchaseCommission.budgetSavings') }}：</span> <!-- 预算节约 -->
                        <el-input v-if="!disabled" v-model="form.budgetSavings"></el-input>
                        <div v-else>{{ form.budgetSavings }}</div>
                    </div>
                    <div class="flex pb2">
                        <span class="w-title">{{ $t('purchaseCommission.savingsRatio') }}：</span> <!-- 节约比例% -->
                        <el-input v-if="!disabled" v-model="form.budgetSavingsRatio"></el-input>
                        <div v-else>{{ form.budgetSavingsRatio }}</div>
                    </div>
                    <div class="flex pb2">
                        <span class="w-title">{{ $t('purchaseCommission.amountLimit') }}：</span> <!-- 可执行金额上限 -->

                        <el-input v-if="!disabled" v-model="form.amountLimit"></el-input>
                        <div v-else>{{ form.amountLimit }}</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="border-bottom">
            <el-col :span="14" class="border-right setHeight2">
                <div class="m10 w-100">
                    <p>{{ $t('purchaseCommission.draftDesc') }}</p> <!-- 起草者关于待批项目的详细描述及意见 -->
                    <p class="pt10">{{ $t('purchaseCommission.recommendSupplier') }}</p> 
                    <el-input v-if="!disabled" autosize type="textarea" v-model="form.recommentSupplierName"></el-input>
                    <div v-else>{{ form.recommentSupplierName }}</div>
                    <p class="pt10">{{ $t('purchaseCommission.recommendReason') }}</p> <!-- 推荐理由 -->
                    <el-input v-if="!disabled" autosize type="textarea" v-model="form.recommendReason"></el-input>
                    <div v-else>{{ form.recommendReason }}</div>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="">
                    <div class="border-bottom p10">
                        <p>{{ $t('purchaseCommission.finalResolution') }}:</p> <!-- 最终决议值 -->
                        <el-input autosize v-if="!disabled" type="textarea" v-model="form.finalResolutionValue"></el-input>
                        <div v-else>{{ form.finalResolutionValue }}</div>
                    </div>
                    <div class="border-bottom p10">
                        <p>{{ $t('commonContent.attachments') }}:</p> <!-- 附件 -->
                        <upload :fileList="form.recordFileList" :btnName="$t('commonContent.upload')" @handleRequest="handleRequest" :multiple="true"
                            :showFileList="true"></upload>
                    </div>
                    <div class="border-bottom p10">
                        <p>{{ $t('commonContent.agree') }}</p> <!-- 同意 -->
                    </div>
                    <div class="p10">
                        <p>{{ $t('commonContent.date') }}:</p> <!-- 日期 -->
                        {{ form.applyDate }}
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="border-bottom">
            <el-col :span="24">
                <p class="m10">{{ $t('purchaseCommission.committeeApproval') }}</p> <!-- 采购委员会委员批准 -->
            </el-col>
        </el-row>
        <el-row class="flex">
            <el-col :span="5" class="border-right">
                <div class=" pb10 text-center">
                    <p class="mb40 px10 pt10">{{ $t('purchaseCommission.deptManager') }}</p> <!-- 申请部门负责人 -->
                    <!-- {{ userInfo }} -->
                    <!-- <signature @signUrl="signUrlGroup"
                        v-if="hasFlowRole && ((userInfo.user_id || userInfo.id) + '' === form.groupLeader + '')"></signature> -->
                    <!-- <signaturePad></signaturePad> -->
                    <img width="60" :src="form.groupLeaderFile" alt="">
                </div>
            </el-col>
            <el-col :span="5" class="border-right">
                <div class="pb10  text-center">
                    <p class="mb40 px10 pt10">{{ $t('purchaseCommission.projectManager') }}</p> <!-- 项目组负责人 -->

                    <!-- <signature @signUrl="signUrlPMO"
                        v-if="hasFlowRole && !samePmo && ((userInfo.user_id || userInfo.id) + '' === form.pmo + '')"></signature> -->
                    <img  width="60" :src="form.pmoFile" alt="">
                </div>
            </el-col>
            <el-col :span="5" class="border-right">
                <div class=" pb10 text-center">
                    <p class="mb40 px10 pt10">{{ $t('purchaseCommission.adminManager') }}</p> <!-- 综管组负责人 -->

                    <!-- <signature @signUrl="signUrlPersonnel"
                        v-if="hasFlowRole && !samePersonnel && ((userInfo.user_id || userInfo.id) + '' === form.personnelManager + '')">
                    </signature> -->
                    <img width="60" :src="form.personnelManagerFile" alt="">
                </div>
            </el-col>
            <el-col :span="4" class="border-right">
                <div class=" pb10 text-center">
                    <p class="mb40 px10 pt10">{{ $t('purchaseCommission.financeManager') }}</p> <!-- 财务负责人 -->
                    <!-- <signature @signUrl="signUrlFinance"
                        v-if="hasFlowRole && !sameFinance && ((userInfo.user_id || userInfo.id) + '' === form.financeManager + '')">
                    </signature> -->
                    <img  width="60" :src="form.financeManagerFile" alt="">
                </div>
            </el-col>
            <el-col :span="5">
                <div class="pb10 text-center">
                    <p class="mb40 px10 pt10">{{ $t('purchaseCommission.purchaseManager') }}</p> <!-- 采购负责人 -->
                    <!-- <signature @signUrl="signUrlPurchase"
                        v-if="hasFlowRole && !samePurchase && ((userInfo.user_id || userInfo.id) + '' === form.purchaseManager + '')">
                    </signature> -->
                    <img width="60" :src="form.purchaseManagerFile" alt="" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import upload from '@/components/upload/index'
import signaturePad from '@/components/signature-pad/index.vue'
import signature from './signature'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            form: {
                projectDesc: null,
                budgetSavings: null,
                budgetSavingsRatio: null,
                amountLimit: null,
                recommentSupplierName: null,
                recommendReason: null,
                finalResolutionValue: null,
                recordFileList: [],
                applyDate: null,
                financeManagerFile: null,
                purchaseManagerFile: null,
                personnelManagerFile: null,
                pmoFile: null,
                groupLeaderFile: null,
                taskDefinitionKey: null
            }
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
        hasFlowRole() {
            return this.form.taskDefinitionKey && this.form.taskDefinitionKey !== 'applyDepts' && this.$route.query.type === 'waitDone'
        },
        sameFinance() {
            return this.form.financeManager === this.form.groupLeader
        },
        samePmo() {
            return this.form.pmo === this.form.groupLeader
        },
        samePersonnel() {
            return this.form.personnelManager === this.form.groupLeader
        },
        samePurchase() {
            console.log(this.form.purchaseManager)
            console.log(this.form.groupLeader)
            return this.form.purchaseManager === this.form.groupLeader
        },

    },
    components: {
        upload,
        signaturePad,
        signature
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
        }
    },
    watch: {
        formData() {
            if (this.formData.id) {
                if (this.formData.flow) {
                    this.form.taskDefinitionKey = this.formData.flow.taskDefinitionKey
                }
                this.form.projectDesc = this.formData.projectDesc
                this.form.budgetSavings = this.formData.budgetSavings
                this.form.budgetSavingsRatio = this.formData.budgetSavingsRatio
                this.form.amountLimit = this.formData.amountLimit
                this.form.recommentSupplierName = this.formData.recommentSupplierName
                this.form.recommendReason = this.formData.recommendReason
                this.form.finalResolutionValue = this.formData.finalResolutionValue
                this.form.recordFileList = this.formData.recordFileList
                this.form.applyDate = this.formData.applyDate
                this.form.groupLeader = this.formData.groupLeader
                this.form.pmo = this.formData.pmo
                this.form.personnelManager = this.formData.personnelManager
                this.form.financeManager = this.formData.financeManager
                this.form.purchaseManager = this.formData.purchaseManager
                this.form.pmoFile = this.formData.pmoFile//decodeURIComponent(this.formData.pmoFile)
                this.form.personnelManagerFile =this.formData.personnelManagerFile// decodeURIComponent(this.formData.personnelManagerFile)
                this.form.groupLeaderFile = this.formData.groupLeaderFile//decodeURIComponent(this.formData.groupLeaderFile)
                this.form.purchaseManagerFile = this.formData.purchaseManagerFile//decodeURIComponent(this.formData.purchaseManagerFile)
                this.form.financeManagerFile = this.formData.financeManagerFile//decodeURIComponent(this.formData.financeManagerFile)
              
            }

            this.form.projectDesc = this.formData.projectDesc
            this.form.applyDate = this.formData.applyDate
        }
    },
    mounted() {
        console.log('33223232323')
        console.log(this.userInfo)
    },
    methods: {
        handleRequest(data, list) {
            this.form.recordFileList = list
        },
        signUrlFinance(data) {
            this.form.financeManagerFile = data// encodeURIComponent(data)
        },
        signUrlPurchase(data) {
            this.form.purchaseManagerFile = data// encodeURIComponent(data)
        },
        signUrlPersonnel(data) {
            this.form.personnelManagerFile = data// encodeURIComponent(data)
        },
        signUrlPMO(data) {
            this.form.pmoFile = data// encodeURIComponent(data)
        },
        signUrlGroup(data) {
            this.form.groupLeaderFile = data// encodeURIComponent(data)
            // console.log(this.sameFinance)
            if (this.sameFinance) {
                this.form.financeManagerFile = this.form.groupLeaderFile
            }
            if (this.samePmo) {
                this.form.pmoFile = this.form.groupLeaderFile
            }
            if (this.samePersonnel) {
                this.form.personnelManagerFile = this.form.groupLeaderFile
            }
            if (this.samePurchase) {
                this.form.purchaseManagerFile = this.form.groupLeaderFile
            }
            console.log(this.form)
        }
    }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 992px) {
    .content {
        font-size: 12px;
    }
}
.w-title {
    width: 160px;
    font-size: 14px;
}

.content {
    border: 1px solid #DCDFE6;
}

.border-bottom {
    border-bottom: 1px solid #DCDFE6;
}

.setHeight1 {
    min-height: 140px;
    display: flex;
}

.text-center {
    text-align: center;
}

.setHeight2 {
    min-height: 350px;
    display: flex;
}

.w-100 {
    width: 100%;
}

.border-right {
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
}</style>