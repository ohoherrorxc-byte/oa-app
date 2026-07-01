<template>
  <!-- 主要容器，包含在线信息、项目信息和测试报告三个部分 -->
  <basic-container class="basicContainer">
    <el-form
      :disabled="disabled"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <!-- 在线信息部分 -->
      <p class="table-title">
        <span></span>{{ $t('appOnline.onlineInfo') }}
      </p>
      <p class="table-title">
        {{ $t('appOnline.onlineNotice') }}
      </p>
      <br><br>
      <!-- 表单，用于收集应用上线相关信息 -->
      <!-- 变更类型选择 -->
      <el-form-item :label="$t('appOnline.changeType')" prop="changeType" class="full-width-item">
        <el-checkbox-group v-model="form.changeType">
          <el-checkbox label="IOS"/>
          <el-checkbox label="Android"/>
        </el-checkbox-group>
      </el-form-item>
      <!-- 应用发布版本输入 -->
      <el-form-item :label="$t('appOnline.appReleaseVersion')" prop="versionApp">
        <el-input v-model="form.versionApp"/>
      </el-form-item>
      <!-- 变更ID输入 -->
      <el-form-item :label="$t('appOnline.changeId')" prop="changeId">
        <el-input v-model="form.changeId"/>
      </el-form-item>
      <!-- 应用下载链接输入 -->
      <el-form-item :label="$t('appOnline.appDownloadLink')" prop="downloadLinkApp">
        <el-input v-model="form.downloadLinkApp" type="textarea"/>
      </el-form-item>
      <!-- 国家/地区输入 -->
      <el-form-item :label="$t('appOnline.countryRegion')" prop="countryRegion">
        <el-input v-model="form.countryRegion"/>
      </el-form-item>
      <!-- 环境输入 -->
      <el-form-item :label="$t('appOnline.environment')" prop="environment">
        <el-input v-model="form.environment"/>
      </el-form-item>
      <!-- 变更计划原因输入 -->
      <el-form-item :label="$t('appOnline.reasonPlan')" prop="reasonPlan" class="full-width-item">
        <el-input v-model="form.reasonPlan" type="textarea"/>
      </el-form-item>
      <!-- 计划开始时间选择 -->
      <el-form-item :label="$t('appOnline.planStartTime')" prop="planStartTime"  class="full-width-item">
        <el-date-picker
          v-model="form.planStartTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('appOnline.pleaseSelect') + $t('appOnline.planStartTime')"
        />
      </el-form-item>
      <!-- 计划结束时间选择 -->
      <el-form-item :label="$t('appOnline.planEndTime')" prop="planEndTime"  class="full-width-item">
        <el-date-picker
          v-model="form.planEndTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('appOnline.pleaseSelect') + $t('appOnline.planEndTime')"
        />
      </el-form-item>
      <!-- 应用发布说明输入 -->
      <el-form-item :label="$t('appOnline.appReleaseNote')" prop="appReleaseNote" class="full-width-item">
        <el-input v-model="form.appReleaseNote" type="textarea"/>
      </el-form-item>
      <!-- 其他信息输入 -->
      <el-form-item :label="$t('appOnline.other')" prop="other" class="full-width-item">
        <el-input v-model="form.other" type="textarea"/>
      </el-form-item>
      <!-- 项目信息部分 -->
      <p class="table-title">
        <span></span>{{ $t('appOnline.projectsInfo') }}
      </p>
      <!-- 项目相关信息表单 -->
      <!-- 项目经理选择 -->
      <el-form-item :label="$t('appOnline.projectManager')" prop="projectManager">
        <el-select
          v-model="form.projectManager"
          @change="handleProjectManagerChange"
          :placeholder="$t('appOnline.pleaseSelect') + $t('appOnline.projectManager')"
        >
          <el-option
            v-for="manager in projectManagers"
            :key="manager"
            :label="manager"
            :value="manager"
          />
        </el-select>
      </el-form-item>
      <el-form-item >
      </el-form-item>
      <!-- 项目代码选择 -->
      <el-form-item :label="$t('appOnline.projectCode')" prop="projectCode">
        <el-select
          v-model="form.projectCode"
          @change="handleProjectCodeChange"
          :placeholder="$t('appOnline.pleaseSelect') + $t('appOnline.projectCode')"
        >
          <el-option
            v-for="code in projectCodes"
            :key="code"
            :label="code"
            :value="code"
          />
        </el-select>
      </el-form-item>
      <!-- 项目名称输入（只读） -->
      <el-form-item :label="$t('appOnline.projectName')" prop="projectName" class="full-width-item">
        <el-input v-model="form.projectName" disabled/>
      </el-form-item>
      <!-- 影响模型输入 -->
      <el-form-item :label="$t('appOnline.affectModel')" prop="affectModel">
        <el-input v-model="form.affectModel"/>
      </el-form-item>
      <el-form-item >
      </el-form-item>
      <!-- 确认UAT文件上传 -->
      <el-form-item :label="$t('appOnline.confirmedUATEmail')" prop="uatFileList">
        <upload
          :disabled="disabled"
          :isHistory="isHistory"
          :show-tip="!disabled"
          accept=".jpg,.png,.pdf"
          :fileList="form.uatFileList"
          :before-upload="beforeUpload"
          @handleRequest="handleConfirmedUATRequest"
          :btnName="$t('other.upload')"
          :multiple="true"
          :showFileList="true"
        >
          <template #tip>
            <div class="el-upload__tip">
              {{ $t('appOnline.upLoadTip') }}
            </div>
          </template>
        </upload>
      </el-form-item>
      <!-- 测试报告部分 -->
      <p class="table-title">
        <span></span>{{ $t('appOnline.testReport') }}
      </p>
      <!-- 测试相关信息表单 -->
      <!-- 测试结论选择 -->
      <el-form-item :label="$t('appOnline.testConclusion')" prop="testConclusion" class="full-width-item">
        <el-checkbox-group v-model="form.testConclusion">
          <el-checkbox label="IOS"/>
          <el-checkbox label="Android"/>
        </el-checkbox-group>
      </el-form-item>
      <!-- 测试总结输入 -->
      <el-form-item :label="$t('appOnline.testSummary')" prop="testSummary" class="full-width-item">
        <el-input v-model="form.testSummary"/>
      </el-form-item>
      <!-- 测试报告文件上传 -->
      <el-form-item :label="$t('appOnline.testReport')" prop="testReportFileList">
        <upload
          :disabled="disabled"
          :isHistory="isHistory"
          :show-tip="!disabled"
          :fileList="form.testReportFileList"
          :before-upload="beforeUpload"
          :btnName="$t('other.upload')"
          @handleRequest="handleTestReportRequest"
          :multiple="true"
          :showFileList="true"
        >
          <template #tip>
            <div class="el-upload__tip">
              {{ $t('appOnline.upLoadTip') }}
            </div>
          </template>
        </upload>
      </el-form-item>

    </el-form>
  </basic-container>
</template>

<script>
import {appOnline25Detail} from "@/api/maintenance/index";
import autoAddress from '@/components/autoAddress/index';
import upload from "@/components/upload/index";
import {getProjectList} from "@/api/contract/contractProject";

export default {
  // 注册组件
  components: {autoAddress, upload},
  // 数据定义
  data() {
    return {
      // 表单数据模型
      form: {
        changeType: [], // 变更类型
        testConclusion: [], // 测试结论
        testReportFileList: [], // 测试报告文件列表
        uatFileList: [], // UAT文件列表
        changeId: '', // 变更ID
        versionApp: '', // 应用版本
        downloadLinkApp: '', // 下载链接
        countryRegion: '', // 国家/地区
        environment: '', // 环境
        reasonPlan: '', // 变更计划原因
        planStartTime: '', // 计划开始时间
        planEndTime: '', // 计划结束时间
        appReleaseNote: '', // 发布说明
        other: '', // 其他信息
        projectManager: '', // 项目经理
        affectModel: '', // 影响模型
        projectCode: '', // 项目代码
        projectName: '', // 项目名称
        testSummary: '' // 测试总结
      },
      // 表单验证规则
      rules: {
        changeId: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.changeId'),
          trigger: ['blur', 'change']
        }],
        versionApp: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.appReleaseVersion'),
          trigger: ['blur', 'change']
        }],
        downloadLinkApp: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.appDownloadLink'),
          trigger: ['blur', 'change']
        }],
        countryRegion: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.countryRegion'),
          trigger: ['blur', 'change']
        }],
        changeType: [{
          required: true,
          message: this.$t('appOnline.pleaseSelect') + this.$t('appOnline.changeType'),
          trigger: ['blur', 'change']
        }],
        environment: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.environment'),
          trigger: ['blur', 'change']
        }],
        reasonPlan: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.reasonPlan'),
          trigger: ['blur', 'change']
        }],
        appReleaseNote: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.appReleaseNote'),
          trigger: ['blur', 'change']
        }],
        planStartTime: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.planStartTimeRequired'),
          trigger: ['blur', 'change']
        }],
        planEndTime: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.planEndTimeRequired'),
          trigger: ['blur', 'change']
        }],
        affectModel: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.affectModel'),
          trigger: ['blur', 'change']
        }],
        uatFileList: [{required: true, validator: this.validateFileList, trigger: ['change']}], // 自定义验证规则，确保上传了UAT文件
        testConclusion: [{
          required: true,
          message: this.$t('appOnline.pleaseSelect') + this.$t('appOnline.testConclusion'),
          trigger: ['blur', 'change']
        }],
        testReportFileList: [{required: true, validator: this.validateFileList, trigger: ['change']}], // 自定义验证规则，确保上传了测试报告文件
        testSummary: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.testSummary'),
          trigger: ['blur', 'change']
        }],
        projectManager: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.projectManager'),
          trigger: ['blur', 'change']
        }],
        projectName: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.projectName'),
          trigger: ['blur', 'change']
        }],
        projectCode: [{
          required: true,
          message: this.$t('appOnline.pleaseInput') + this.$t('appOnline.projectCode'),
          trigger: ['blur', 'change']
        }],
      },
      businessId: null, // 业务ID
      isEdit: false, // 是否编辑模式
      projectManagers: [], // 项目经理列表
      projectCodes: [], // 项目代码列表
      projectList: [], // 项目列表
      isHistory: false // 是否显示历史记录
    };
  },
  // 组件创建时执行
  created() {
    // 获取项目列表
    this.fetchProjectList();
    // 从路由获取业务ID和编辑状态
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    // 如果有业务ID，获取详细信息
    if (this.businessId) {
      this.getDetail();
    }
  },
  // 计算属性
  computed: {
    // 表单是否禁用
    disabled() {
      // 存在业务ID且不是编辑状态
      return this.businessId && !this.isEdit;
    }
  },
  // 方法定义
  methods: {
    // 获取详细信息
    async getDetail() {
      try {
        const res = await appOnline25Detail(this.businessId);
        if (res.data.code === 200) {
          this.form = {
            ...this.form,
            ...res.data.data,
            testConclusion: res.data.data.testConclusion || [],
            changeType: res.data.data.changeType || [],
            testReportFileList: res.data.data.testReportFileList || [],
            uatFileList: res.data.data.uatFileList || []
          };
          // 触发获取表单数据事件
          this.$emit("getFormData", this.form);
        }
      } catch (error) {
        console.error("获取详情失败:", error);
      }
    },
    // 处理测试报告文件上传
    handleTestReportRequest(data, list) {
      this.form.testReportFileList = list.map(ele => ({
        ...ele,
        businessName: 'appOnline25TestReport'
      }));
      // 手动触发测试报告文件列表的验证
      this.$refs.form.validateField('testReportFileList');
    },
    // 处理UAT文件上传
    handleConfirmedUATRequest(data, list) {
      this.form.uatFileList = list.map(ele => ({
        ...ele,
        businessName: 'appOnline25UAT'
      }));
      // 手动触发UAT文件列表的验证
      this.$refs.form.validateField('uatFileList');
    },
    // 验证表单
    async testForm() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) {
          this.$message.error(this.$t('appOnline.pleaseFillInRequiredFields'));
        }
        return valid;
      } catch (error) {
        this.$message.error(this.$t('appOnline.pleaseFillInRequiredFields'));
        return false;
      }
    },
    // 获取项目列表
    async fetchProjectList() {
      try {
        const res = await getProjectList();
        this.projectList = res.data.data;
        this.projectManagers = [...new Set(this.projectList.map(item => item.projectManageName))];
      } catch (error) {
        console.error("获取项目列表失败:", error);
      }
    },
    // 处理项目经理变更
    handleProjectManagerChange() {
      this.projectCodes = this.projectList
        .filter(item => item.projectManageName === this.form.projectManager)
        .map(item => item.projectNo);
      this.form.projectCode = '';
      this.form.projectName = '';
    },
    // 处理项目代码变更
    handleProjectCodeChange() {
      const selectedProject = this.projectList.find(
        item => item.projectNo === this.form.projectCode
      );
      this.form.projectName = selectedProject ? selectedProject.projectName : '';
    },
    //
    validateFileList(rule, value, callback) {
      console.log('Validating', rule.field, value);
      if (!value || value.length === 0) {
        callback(new Error(this.$t('appOnline.pleaseOnload') + ""));
      } else {
        callback();
      }
    },
    //
    handleChange(file, fileList) {
      console.log('Change event triggered', file, fileList);
    },
    /**
     * 上传前检查
     * @param {File} file - 待上传的文件对象
     * @returns {boolean} - 返回true表示允许上传，false表示拒绝上传
     */
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
        return false;
      }

      // 检查文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.$message.error('只允许上传 JPG/PNG/PDF 格式文件!');
        return false;
      }

      return true;
    },
  }
};
</script>

<!--</style>-->
<style lang="scss" scoped>

.el-form {
  display: flex;
  flex-wrap: wrap;
}

.el-form-item {
  width: 100%;
}

@media (min-width: 768px) {
  /* 除了标记为full-width-item的项目外，其他项目都设置为48%宽度 */
  .el-form-item:not(.full-width-item) {
    width: calc(50% - 5px);
  }

  /* 全宽项目 */
  .el-form-item.full-width-item {
    flex-basis: calc(100% - 10px); /* 宽度占满整行 */
    margin-right: 0;
  }

  /* 特殊处理包含textarea的项目 */
  .el-form-item:has(textarea) {
    width: calc(100% - 10px) !important;
  }

  ///* 每行第二个项目移除右边距 */
  //.el-form-item:nth-child(2n):not(.full-width-item) {
  //  margin-right: 0;
  //}

  ///* 特殊处理包含选择器的项目 */
  //.el-form-item:has(.el-select) {
  //  width: calc(49% - 10px);
  //  margin-right: 20px;
  //}

  ///* 选择器项目每行第二个移除右边距 */
  //.el-form-item:has(.el-select):nth-child(2n) {
  //  margin-right: 0;
  //}
}

.table-title{
  width: calc(100% - 10px)
}

.button-bottom {
  width: 100%;
  text-align: center;
}

</style>
