<template>
  <el-row>
    <el-col :span="24">
      <basic-container>
        <p class="table-title">
          <span></span>{{ $t('other.otherInfo') }}
        </p>
        <el-form :disabled="((detailId || purchaseApplyNo) && !isEdit) && !financialBillPerson() && !appOnlinePerson()"
          v-model="form" :rules="rules" ref="ruleForm" label-width="100px">
          <!-- {{ approvalName+'approvalNameapprovalNameapprovalNameapprovalName' }} -->
          <el-form-item v-if="approvalName === '系统权限申请'">
            <p class="red">{{ $t('other.securityNoteText') }}</p>
            <p class="">{{ $t('other.templateDownload') }}  <span class="blue" @click="downFile">{{ $t('other.downloadLink') }}</span></p>
          </el-form-item>
          <el-form-item :label="$t('other.attachments')" prop="fileList" :required="otherFileRequest">
            <upload :disabled="((detailId || purchaseApplyNo) && !isEdit) && !financialBillPerson() && !appOnlinePerson()" :isHistory="isHistory" :fileList="form.fileList"
            :btnName="$t('other.upload')" @handleRequest="handleRequest" :multiple="true" :approvalName="approvalName" :showFileList="true"></upload>
            <!-- <upload v-else :isHistory="isHistory"  :fileList="form.fileList" btnName="上传" @handleRequest="handleRequest" :multiple="true"
              :showFileList="true"></upload> -->
          </el-form-item>
          <el-form-item style="width: 98%;" v-if="formData.id && Number(formData.acceptType) === 1">
            <div style="color: #409eff;" @click="downWord" v-html="formData.docTitle"></div>
          </el-form-item>
          <el-form-item :label="$t('other.remarks')">
            <el-input type="textarea" v-if="!detailId || isEdit" autosize :placeholder="$t('other.enterContent')"
              v-model="form.remark"></el-input>
            <div v-else>{{ form.remark }}</div>
          </el-form-item>
        </el-form>
        <acceptService v-show="false" ref="acceptService" :downModelTitle="formData.docTitle"></acceptService>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
import upload from "@/components/upload/index";
import { fileDownload, downloadFileBlob } from '@/util/util'
import UploadApi from "@/api/upload";
import acceptService from './wordModel/acceptService'

export default {
  components: {
    upload, acceptService
  },
  data() {
    return {
      form: {
        remark: "",
        fileList: [],
      },
      isHistory: false,
      rules: {
      },
      purchaseApplyNo: null,
      isEdit: false,
      processInstanceId: null
    };
  },
  props: {
    detailId: {
      type: String,
    },
    formData: {
      type: Object,
    },
    approvalName: {
      type: String,
    },
    otherFileRequest: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    "formData.fileList": {
      handler() {   
        this.form.fileList = this.formData.fileList||[];
      },
      deep:true 
    },
    formData:{
      handler(){
        if(!this.form.fileList||this.form.fileList.length===0){
          this.form.fileList = this.formData.fileList;
        }
        this.isHistory = (this.formData.opinion || this.formData.source)
      },
      deep:true
    },
    "formData.remark": {
      handler() {   
        this.form.remark = this.formData.remark;
      },
      deep:true 
    },
  },
  mounted() {
    this.purchaseApplyNo = this.$route.query.purchaseApplyNo
    this.isEdit = this.$route.query.isEdit;
  },
  methods: {
    handleRequest(data, list) {
      this.form.fileList = list;
    },
    downModelTitle() { },
    downWord() {
      this.$refs.acceptService.downModel(this.formData.id)
    },
    async downFile() {
      let obj = {
        url: 'http://10.30.4.68:9000/license-prd/upload/20241017/5901bef060b2ae8bb36b983e7532a951.pdf'
      }
      let res = await UploadApi.getUrl(obj)
      console.log(this.isGoogleChrome() + 'isGoogle')
      if (this.isGoogleChrome()) {
        downloadFileBlob(res.data.data, '邮箱、VPN、USB使用安全及保密承诺书V1.pdf')
      } else {
        window.open(res.data.data)
      }
    },
    isGoogleChrome() {
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      return isChrome;
    },
    financialBillPerson() {
      return this.formData.flow && this.formData.flow.assigneeName === '黄蓓川'
        && (this.approvalName === '业务招待费用报销' || this.approvalName === '零星费用支付申请单' || this.approvalName === '差旅报销申请' || this.approvalName === '工会经费使用申请表')
    },
    canUpload() {
      return this.approvalName === '机房软硬件变更申请'
    },
    // && this.formData.flow.assigneeName === '闫书磊'
    appOnlinePerson() {
      return this.formData.flow
        && (this.approvalName === 'APP上线申请单')
    }
  },
};
</script>

<style scoped lang="scss">
.red {
  color: red;
}

.blue {
  color: blue;
}
</style>