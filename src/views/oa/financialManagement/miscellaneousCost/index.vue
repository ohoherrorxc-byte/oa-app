<template>
  <div>
    <flow ref="flowRef" canWriteInfo='true' approvalName="零星费用支付申请单" @getFormData="getFormData" @allTotalAmount="allTotalAmount" :slotForm="form"
      :detailId="businessId" :processInstanceId="processInstanceId" componentTag="miscellaneousCost" :approvalSave="true">
      <template slot="baseInfo">
        <el-form class="form-all" label-width="120px" :model="form" :rules="rules">
          <el-form-item  :label="$t('miscellaneousCost.applyAmount')">
            <el-input v-model="form.totalAmount" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('miscellaneousCost.amountInWords')">
            <el-input v-model="form.amountInWords" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('miscellaneousCost.applyReason')" style="width: 100%;" prop="applyReason">
            <el-input type="textarea" autosize :disabled="this.businessId && !this.$route.query.isEdit"
              v-model="form.applyReason"></el-input>
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
        applyReason: null

      },
      rules: {
        applyReason: [
          { required: true, message: this.$t('miscellaneousCost.applyReasonRequired'), trigger: 'blur' }
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
      // console.log(allTotalAmount+'allTotalAmount')
      this.form.amountInWords = numberToTraditionalChinese(allTotalAmount)
      this.$nextTick(()=>{
        if(this.$refs.flowRef&&this.$refs.flowRef.getFormTitle){
                    this.$refs.flowRef.getFormTitle(this.form.totalAmount)
                }
      })

    },
    getFormData(data) {
      this.form.totalAmount = data.totalAmount
      this.form.amountInWords = data.amountInWords
      this.form.applyReason = data.applyReason
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
  @media (max-width: 768px) {
    .el-form-item {
      width: 100%;
    }
  }
}
</style>
