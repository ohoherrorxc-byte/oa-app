<template>
  <div class="reative">
    <div
      class="btn-top"
      :style="styleBtn()"
      v-if="this.$route.query.type === 'waitDone' || !this.detailId"
    >
      <!-- 1.发起人提交或重新编辑!enterApproving 2.被退回isBeReturned 3.有些流程中的需要保存按钮 -->
      <el-button
        v-if="
          !enterApproving || isBeReturned || (enterApproving && someFlowSave)
        "
        type="primary"
        :disabled="disabledSubmit"
        @click="
          submit('start', '', enterApproving && someFlowSave && !saveAndTest)
        "
        >{{
          isBeReturned || (someFlowSave && !this.$route.query.isEdit)
            ? $t("flow.save")
            : $t("flow.submit")
        }}</el-button
      >
      <el-button
        v-if="!enterApproving && !isBeReturned"
        type="primary"
        @click="submit('save')"
      >
        {{ $t("flow.save") }}</el-button
      >
      <el-button
        type="primary"
        v-if="(isApproving || isBeReturned) && !isEvaluate"
        @click="operateFlow('ok', isBeReturned)"
        >{{ isBeReturned ? $t("flow.submit") : $t("flow.approve") }}</el-button
      >
      <el-button v-if="isSubmit && !isEvaluate" @click="operateFlow('notOk')">
        {{ $t("flow.return") }}</el-button
      >
      <el-button
        type="primary"
        v-if="isSubmit && !notAddSign && !isEvaluate"
        @click="addPerson('notOk')"
      >
        {{ $t("flow.addSign") }}</el-button
      >
    </div>
    <div
      class="btn-top"
      :style="styleBtn()"
      v-if="
        exportPDF &&
        showPdf &&
        (isFinished || isPdfSale) &&
        !isMobile &&
        waitLoadDone
      "
    >
      <div class="text-center flex">
        <!-- <el-button type="primary" @click="exportToPdf()">{{
          $t("flow.exportPDF")
        }}</el-button> -->
        <!-- <el-button type="primary" @click="handlePrint">{{
          $t("flow.print")
        }}</el-button> -->
      </div>
    </div>
    <basic-container class="w-100" v-loading="loading">
      <el-tabs class="w-100" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('flow.processForm')" name="first">
          <div id="container" :class="{ formFlow: isPrinf || isPdfDown }">
            <el-row class="w-100" :class="{ formFlow: isPrinf || isPdfDown }">
              <el-col :span="24">
                <basic-container>
                  <p class="text-center">{{ $t(myApprovalName) }}</p>
                </basic-container>
              </el-col>
            </el-row>
            <!-- 基础信息 -->
            <baseInfo
              :customForm="customForm"
              :askForLeaveType="askForLeaveType"
              :dealTitleName="dealTitleName"
              :approvalName="myApprovalName"
              :formData="formData"
              :detailId="detailId"
              :totalAmount="totalAmount"
              v-if="showBaseInfo"
              ref="baseInfo"
              class="w-100"
              @titleChange="titleChange"
              :disabled="disabled || !canWriteInfo"
            >
              <template slot="baseInfo">
                <slot name="baseInfo"></slot>
              </template>
            </baseInfo>
            <!-- 各流程信息 -->
            <component
              @changeFileRequest="changeFileRequest"
              @isAskForLeaveType="isAskForLeaveType"
              class="w-100"
              v-if="!customForm"
              @setName="setName"
              @getFormData="getFormData"
              ref="formRef"
              :slotForm="slotForm"
              :is="componentTag"
              :isPdfDown="isPdfDown"
              :disabled="disabled"
              @allTotalAmount="allTotalAmount"
            ></component>
            <!-- 自定义表单 -->
            <basic-container v-if="customForm">
              <form-create
                ref="formCreate"
                v-model="fApi"
                :rule="rule"
                :option="option"
                :value.sync="formValue"
              ></form-create>
            </basic-container>
            <tableForm
              :detailId="detailId"
              :initTableList="initTableList"
              :list="tableFormList"
              v-show="tableFormList.length > 0"
              ref="tableForm"
              v-if="customForm"
            ></tableForm>
            <!-- <el-button @click="operateFlow('ok')">eieiei</el-button> -->
            <!-- 附件备注等信息录入 -->
            <other
              :otherFileRequest="otherFileRequest"
              :class="{ formFlow: isPrinf || isPdfDown }"
              class="w-100"
              v-if="showOtherInfo"
              :approvalName="myApprovalName"
              :formData="formData"
              :detailId="detailId"
              ref="other"
            ></other>
            <!-- 可操作条件，待处理或新建页面 -->
            <el-row class="w-100">
              <el-col :span="24">
                <basic-container>
                  <p v-if="isApproving" class="table-title">
                    <span></span>{{ $t("flow.processOperation") }}
                  </p>
                  <el-form
                    v-if="isApproving"
                    v-model="form"
                    label-width="100px"
                  >
                    <el-form-item
                      :label="$t('flow.opinion')"
                      :class="{ 'is-error': showCommentError }"
                      :error="
                        showCommentError
                          ? '请在流程操作的意见里面填写驳回原因'
                          : ''
                      "
                    >
                      <el-input
                        type="textarea"
                        autosize
                        :placeholder="$t('flow.enterContent')"
                        v-model="comment"
                        @input="showCommentError = false"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div
                    class="row"
                    v-if="
                      (isWait || isCreate) &&
                      !saveNotSubmit &&
                      ((!this.$route.query.type && !isFinished) ||
                        this.$route.query.type === 'waitDone')
                    "
                  >
                    <!-- {{ enterApproving&&someFlowSave&&!this.$route.query.isEdit }} -->
                    <el-button
                      v-if="
                        !enterApproving ||
                        isBeReturned ||
                        (enterApproving && someFlowSave && !saveAndTest)
                      "
                      type="primary"
                      :disabled="disabledSubmit"
                      @click="submit('start')"
                      >{{
                        isBeReturned ||
                        (someFlowSave && !this.$route.query.isEdit)
                          ? $t("flow.save")
                          : $t("flow.submit")
                      }}</el-button
                    >
                    <el-button
                      v-if="!enterApproving && !isBeReturned"
                      type="primary"
                      @click="submit('save')"
                    >
                      {{ $t("flow.save") }}</el-button
                    >
                    <el-button
                      type="primary"
                      v-if="(isApproving || isBeReturned) && !isEvaluate"
                      @click="operateFlow('ok', isBeReturned)"
                      >{{
                        isBeReturned ? $t("flow.submit") : $t("flow.approve")
                      }}</el-button
                    >
                    <el-button
                      v-if="isSubmit && !isEvaluate"
                      @click="operateFlow('notOk')"
                      >{{ $t("flow.return") }}</el-button
                    >
                    <el-button
                      type="primary"
                      v-if="isSubmit && !notAddSign && !isEvaluate"
                      @click="addPerson('notOk')"
                    >
                      {{ $t("flow.addSign") }}</el-button
                    >
                  </div>
                  <div class="flex-center pt20">
                    <el-button
                      type="primary"
                      v-if="isSupplyUpdate()"
                      @click="previewEmail"
                    >
                      邮件预览</el-button
                    >
                    <el-button
                      type="primary"
                      v-if="isSupplyStatus() && isFinished"
                      @click="sendEmail"
                    >
                      发送邮件</el-button
                    >
                  </div>
                </basic-container>
              </el-col>
            </el-row>
            <!-- 流程审批时间进度 -->
            <timeline
              class="w-100"
              v-if="
                formData.processInstanceId && formData.source !== '源数据导入'
              "
              :formData="formData"
              :componentTag="componentTag"
            >
            </timeline>
            <basic-container
              v-if="formData.source === '源数据导入' || formData.opinion"
            >
              <p class="table-title">
                <span></span>{{ $t("flow.ApprovalFlow") }}
              </p>
              <div
                class="pl30"
                style="white-space: pre-line"
                v-html="formData.opinion"
              ></div>
            </basic-container>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('flow.flowChart')"
          name="second"
          v-if="!isMobile"
        >
          <img class="pb100 w-100" :src="src" alt="design" />
        </el-tab-pane>
      </el-tabs>
      <addPerson
        @reflesh="reflesh"
        :curRow="formData"
        ref="addPerson"
      ></addPerson>
      <signature @signUrl="signUrl" ref="signature"></signature>
      <el-dialog
        title="是否代签"
        :visible.sync="dialogIsSignFor"
        :append-to-body="true"
      >
        <el-form :model="form">
          <el-form-item
            v-if="isFanDa"
            :label="$t('commonContent.isSignFor')"
            style="width: 96%"
          >
            <el-radio-group v-model="isSignFor">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogIsSignFor = false">取 消</el-button>
          <el-button type="primary" @click="confirmSignFor">确 定</el-button>
        </div>
      </el-dialog>
      <emailModel :formData="emailModelData" ref="emailModel"></emailModel>
      <supplierStatus
        :formData="emailModelData"
        ref="supplierStatus"
      ></supplierStatus>
    </basic-container>
  </div>
</template>

<script>
import baseInfo from "./baseInfo.vue";
import other from "./other.vue";
import signature from "./signature";
import addPerson from "./addPersonDialog";
import timeline from "./timeline.vue";
import { mixins } from "./componentMixin";
import emailModel from "./emailModel/emailModel.vue";
import supplierStatus from "./emailModel/supplierStatus.vue";
import {
  debounce,
  dealTimerSecond,
  menuTagRemove,
  getFormatDate,
} from "@/util/util";
import SaveOperate from "./config/saveOperate";
import TemporarySaveOperate from "./config/temporarySave";
import { completeTask, readUpdate, historyFlowList } from "@/api/myFlow/index";
import { mapGetters } from "vuex";
import SupplierOrderStatusApi from "@/api/supplierOrderStatus/index";
import { generateFormReqHeader } from "@/util/form-auth";
import tableForm from "./tableForm";
import FormEditorApi from "@/api/formEditor/index";
import { customDetail } from "@/api/myFlow/operate/detail";
// html-to-image + print-js 改 dynamic import（见 handlePrint）
// 这两个包只在用户点"打印"时才需要，加在 flow chunk 顶层 import 会拖慢流程页加载
import PurchaseCommissionDecisionApplyApi from "@/api/purchaseCommissionDecisionApplication/index";
export default {
  mixins: [mixins],
  components: {
    baseInfo,
    other,
    timeline,
    signature,
    tableForm,
    addPerson,
    emailModel,
    supplierStatus,
  },
  props: {
    //流程组件名称
    componentTag: {
      type: String,
    },
    canWriteInfo: {
      type: Boolean,
      default: false,
    },
    //自定义表单
    customForm: {
      type: Boolean,
      default: false,
    },
    //流程名称
    approvalName: {
      type: String,
    },
    //流程id 取值id或已发流程processInstanceId
    processInstanceId: {
      type: String,
    },
    //详情ID
    detailId: {
      type: String,
    },
    //展示基本信息
    showBaseInfo: {
      type: Boolean,
      default: true,
    },
    //展示其他信息
    showOtherInfo: {
      type: Boolean,
      default: true,
    },
    approvalSave: {
      type: Boolean,
      default: false,
    },
    slotForm: {
      type: Object,
      default: {},
    },
    // otherFileRequest:{
    //   type: Boolean,
    //   default: false
    // },
    otherFileMsg: {
      type: String,
      default: "请上传文件",
    },
  },
  watch: {
    formValue() {},
  },
  data() {
    return {
      disabledSubmit: false,
      isPrinf: false,
      totalAmount: null,
      askForLeaveType: null,
      isPdfDown: false,
      loading: false,
      timeout: null,
      activeName: "first",
      src: "",
      fApi: null,
      rule: [],
      option: {},
      comment: "",
      dialogIsSignFor: false,
      waitLoadDone: false,
      isSignFor: "",
      formData: {},
      isBack: false,
      tableFormList: [],
      myApprovalName: null,
      initTableList: [],
      isEdit: false,
      formValue: {},
      exportPDF: true,
      dealTitleName: null,
      flowList: [],
      otherFileRequest: false,
      title: null,
      showCommentError: false,
    };
  },
  //页面四种状态1.新建；2.保存未提交；3.退回；4.已提交未退回
  //提交操作 1.2.3；3退回时，以保存的名字操作提交的功能
  //保持按钮 1.2
  //批准 3.4；3退回时，以提交实现批准的功能
  //退回 4
  //当前流程审批人this.formData.flow.assignee
  computed: {
    ...mapGetters(["userInfo", "isMobile", "tagList"]),
    //2.保持未提交
    saveNotSubmit() {
      return (
        this.detailId &&
        !this.$route.query.isEdit &&
        this.formData.flow &&
        !this.formData.flow.assignee
      );
    },
    //3.退回
    isBeReturned() {
      const { user_id, id } = this.userInfo;
      return (
        this.detailId &&
        this.$route.query.isEdit &&
        this.formData.flow &&
        ((user_id || id) + "" === this.formData.flow.assignee + "" ||
          (user_id || id) + "" === this.formData.flow.otherAssignee + "")
      );
    },
    isCreate() {
      return !this.detailId;
    },
    isFanDa() {
      return (
        this.formData.flow &&
        this.formData.flow.assigneeName === "范达" &&
        this.formData.flow.taskName === "会签审批"
      );
    },
    saveAndTest() {
      let ispurchaseCommissionDecision =
        this.approvalName === "采购委员会决议申请" &&
        this.formData.flow &&
        this.formData.flow.taskDefinitionKey === "applyDepts";
      return ispurchaseCommissionDecision;
    },
    //某些流程需要再审批的时候保存信息
    someFlowSave() {
      let isSubscriptionApplication =
        this.approvalName === "认款申请单" &&
        this.formData.flow &&
        (this.formData.flow.taskDefinitionKey === "assigneePmo" ||
          this.formData.flow.assigneeName === "范达");
      let ispurchaseCommissionDecision =
        this.approvalName === "采购委员会决议申请" &&
        this.formData.flow &&
        this.formData.flow.taskDefinitionKey === "applyDepts";
      return isSubscriptionApplication || ispurchaseCommissionDecision;
    },
    isEvaluate() {
      const { user_id, id } = this.userInfo;
      return (
        this.approvalName === "采购委员会决议申请" &&
        this.formData.flow &&
        this.formData.flow.taskDefinitionKey === "applyDepts" &&
        this.formData.supplierAssessor + "" === (user_id || id) + "" &&
        this.formData.applyPerson + "" !== (user_id || id) + "" &&
        this.formData.applyPerson + "" !== (user_id || id) + "" &&
        this.formData.flow.otherAssignee + "" !== (user_id || id) + ""
      );
    },
    showPdf() {
      return (
        this.approvalName === "因公出差申请" ||
        this.approvalName === "验收申请单" ||
        this.approvalName === "BOM及框架采购合同订单" ||
        this.approvalName === "一般通用采购申请" ||
        this.approvalName === "业务招待费用报销" ||
        this.approvalName === "零星费用支付申请单" ||
        this.approvalName === "差旅报销申请" ||
        this.approvalName === "培训申请" ||
        this.approvalName === "BOM及框架采购合同评审" ||
        this.approvalName === "销售合同变更申请" ||
        this.approvalName === "销售合同申请" ||
        this.approvalName === "BOM及框架采购合同付款" ||
        this.approvalName === "一般通用采购合同付款申请" ||
        this.approvalName === "销售合同变更申请" ||
        this.approvalName === "采购委员会决议申请" ||
        this.approvalName === "一般通用采购合同评审" ||
        this.approvalName === "认款申请单" ||
        this.approvalName === "公司内部划款申请单" ||
        this.approvalName === "资产报废申请" ||
        this.approvalName === "支付申请-薪资支付" ||
        this.approvalName === "支付申请-财务月度支付" ||
        this.approvalName === "支付申请-无合同支付" ||
        this.approvalName === "报销-其他" ||
        this.approvalName === "报销-会议费" ||
        this.approvalName === "报销-培训费" ||
        this.approvalName === "报销-车贴/探亲费/通讯费"
      );
    },
    isFinished() {
      return this.formData.flow && this.formData.flow.status === "finished";
    },
    //销售合同不归档也要有打印按钮
    isPdfSale() {
      return (
        this.$route.query.businessId &&
        this.$route.query.taskId !== "null" &&
        this.approvalName === "销售合同申请"
      );
    },
    //4.已提交未退回
    isSubmit() {
      const { user_id, id } = this.userInfo;
      return (
        this.detailId &&
        !this.$route.query.isEdit &&
        this.$route.query.status !== "back" &&
        this.formData.flow &&
        ((user_id || id) + "" === this.formData.flow.assignee + "" ||
          (user_id || id) + "" === this.formData.flow.otherAssignee + "")
      );
    },
    notAddSign() {
      return (
        this.approvalName === "人员入职申请" ||
        this.approvalName === "人员离职申请"
      );
    },
    //进入流程阶段
    enterApproving() {
      return this.formData.flow && this.formData.flow.assignee;
    },
    //处于流程审批阶段,已提交未退回的，是审核人
    isApproving() {
      const { user_id, id } = this.userInfo;
      return (
        this.detailId &&
        this.formData.flow &&
        ((user_id || id) + "" === this.formData.flow.assignee + "" ||
          (user_id || id) + "" === this.formData.flow.otherAssignee + "") &&
        this.$route.query.status === "unfinished"
      );
    },
    //待处理
    isWait() {
      return (
        this.$route.query.type === "waitDone" ||
        this.$route.query.status === "unfinished"
      );
    },
    // 是否可编辑
    disabled() {
      return this.$route.query.businessId && !this.$route.query.isEdit;
    },
  },
  mounted() {
    // 刷新前一个窗口
    this.myApprovalName = this.approvalName;
    setTimeout(() => {
      this.waitLoadDone = true;
    }, 1000);
    this.$nextTick(() => {
      this.isBack = this.$route.query.processIsFinished === "back";
      if (this.processInstanceId) {
        this.src = `/api/oa-flow/process/resource-view?processDefinitionId=${this.processInstanceId}`;
      }
      if (this.detailId) {
        this.handleRead(); //已阅读接口
      }
      //自定义表单相关接口
      if (this.customForm) {
        if (this.detailId) {
          this.getCustomDetail();
        } else {
          this.getCustomInfo();
        }
      }
    });
  },
  methods: {
    isAskForLeaveType(data) {
      this.askForLeaveType = data;
    },
    async sendEmail() {
      let data = this.$refs.formRef.getSendFormData();
      // console.log(data)
      data.sendPersons = data.sendPersons.toString();
      data.sendPersonsCC = data.sendPersonsCC.toString();
      let res = await SupplierOrderStatusApi.sendEmail(data);
    },
    isSupplyUpdate() {
      return (
        this.approvalName === "供应商订单变更" ||
        this.approvalName === "供应商订单状态"
      );
    },
    isSupplyStatus() {
      return this.approvalName === "供应商订单状态";
    },
    previewEmail() {
      this.$nextTick(() => {
        this.emailModelData = this.$refs.formRef.getFormData();
        if (this.approvalName === "供应商订单变更") {
          this.$refs.emailModel.showDialog(this.emailModelData);
        } else {
          this.$refs.supplierStatus.showDialog(this.emailModelData);
        }
      });
    },
    styleBtn() {
      let style = {
        width: this.isMobile ? "30%" : "10%",
        top: this.isMobile ? "40px" : "130px",
        display: "flex",
      };
      return style;
    },
    //自定义表单样式获取
    async getCustomInfo() {
      let id = this.$route.query.processInstanceId;
      let res = await FormEditorApi.detail(id);
      if (res.data.code === 200 || res.data.code === 0) {
        let data = res.data.data;
        this.myApprovalName = data.flowName;
        let arr = this.tagList;
        arr.map((ele) => {
          if (ele.nameLabel === "自定义审批单") {
            ele.label = this.$t(`${data.flowName}`);
            ele.meta.alias = this.$t(`${data.flowName}`);
          }
        });
        this.$store.commit("UPDATE_TAG_LIST", arr);
        this.rule = generateFormReqHeader(
          formCreate.parseJson(data.formConfigList)
        );
        this.rule.map((ele) => {
          if (ele.title) {
            ele.title = this.$t(`${ele.title}`);
          }
          if (ele.children) {
            ele.children.map((self) => {
              if (self.children) {
                self.children.map((t) => {
                  t.title = this.$t(`${t.title}`);
                });
              }
            });
          }
        });
        this.option = data.formConfig;
        this.tableFormList = data.tableConfigList;
      }
    },
    //自定义表单详情内容获取
    async getCustomDetail() {
      let businessId = this.$route.query.businessId;
      let res = await customDetail(businessId);
      if (res.data.code === 0 || res.data.code === 200) {
        let tempForm = res.data.data;
        this.myApprovalName = tempForm.flowName;
        let arr = this.tagList;
        arr.map((ele) => {
          if (ele.nameLabel === "自定义审批单") {
            ele.label = this.$t(`${tempForm.flowName}`);
            ele.meta.alias = this.$t(`${tempForm.flowName}`);
          }
        });
        this.$store.commit("UPDATE_TAG_LIST", arr);
        this.rule = generateFormReqHeader(
          formCreate.parseJson(tempForm.formConfigList)
        );
        this.rule.map((ele) => {
          if (ele.title) {
            ele.title = this.$t(`${ele.title}`);
          }
          if (ele.children) {
            ele.children.map((self) => {
              console.log(self);
              if (self.children) {
                self.children.map((t) => {
                  t.title = this.$t(`${t.title}`);
                });
              }
            });
          }
        });
        // console.log(this.rule)
        this.option = tempForm.formConfig;
        this.isEdit = this.$route.query.isEdit;
        if (!this.isEdit) {
          this.option.form.disabled = true;
        } else {
          this.option.form.disabled = false;
        }
        this.tableFormList = tempForm.tableConfigList;
        this.initTableList = tempForm.tableList;
        this.formData = res.data.data;
      }
    },
    setName(data) {
      this.dealTitleName = data;
    },
    changeFileRequest(otherFileRequest) {
      // console.log(otherFileRequest+'otherFileRequest')
      this.otherFileRequest = otherFileRequest;
    },
    reflesh() {
      this.$refs.formRef.getDetail();
    },
    // async handlePrint() {
    //   this.isPdfDown = true;
    //   this.isPrinf = true;
    //   // html-to-image (~500KB) + print-js (~180KB) 改为 dynamic import，
    //   // 仅在用户点击"打印"时才下载，避免 flow chunk 首屏就背着这俩
    //   const [{ toJpeg }, { default: print }] = await Promise.all([
    //     import('html-to-image'),
    //     import('print-js')
    //   ])
    //   let container = document.getElementById("container");
    //   var width = 800;
    //   let that = this;
    //   setTimeout(() => {
    //     toJpeg(container, {
    //       quality: 0.99,
    //       width: width,
    //       backgroundColor: "#ffffff",
    //     }).then((dataUrl) => {
    //       print({
    //         printable: dataUrl,
    //         type: "image",
    //         base64: true,
    //         style: `@media print { @page {size: auto; margin: 10mm 0 15mm 0;display:block;page-break-inside: avoid;} body{margin:0 5px}}`,
    //       });
    //       that.isPrinf = false;
    //       that.isPdfDown = false;
    //     });
    //   }, 300);
    // },
    // exportToPdf() {
    //   this.exportPDF = false;
    //   this.isPdfDown = true;
    //   // PDF 导出功能已移除（html2pdf 依赖被清理）
    //   this.exportPDF = true;
    //   this.isPdfDown = false;
    // },
    //通过子组件获取表单详情内容
    getFormData(data) {
      this.formData = data;
      this.$emit("getFormData", data);
    },
    getFormTitle(data) {},
    titleChange(data) {
      this.title = data;
      this.$emit("titleChange", data);
    },
    //加签
    addPerson() {
      this.$refs.addPerson.dialogFormVisible = true;
      this.formData.comment = this.comment;
    },
    allTotalAmount(allTotalAmount) {
      this.totalAmount = allTotalAmount;
      if (!this.$route.query.businessId || this.$route.query.isEdit) {
        this.$refs.baseInfo.getMoneyTitle(this.totalAmount);
      }
      this.$emit("allTotalAmount", allTotalAmount);
    },
    //已读触发，进详情页则已读
    async handleRead() {
      await readUpdate(this.detailId);
    },
    async getDataHistory() {
      let keys = [
        "productCheck",
        "projectCheck",
        "devCheck",
        "sysCheck",
        "testCheck",
      ];
      if (!keys.includes(this.formData.flow.taskDefinitionKey)) {
        return;
      }
      let res = await historyFlowList(this.formData.processInstanceId);
      let arr = res.data.data;
      let obj = arr[arr.length - 1];
      let taskId = null;
      if (obj.historyActivityId === "managerAssignee") {
        taskId = obj.taskId;
      } else {
        return;
      }
      let otherArr = [];
      let otherIds = [];
      arr = arr.filter((ele) => {
        return keys.includes(ele.historyActivityId);
      });
      arr.map((ele) => {
        if (
          keys.includes(ele.historyActivityId) &&
          !otherIds.includes(ele.historyActivityId)
        ) {
          otherArr.push(ele);
          otherIds.push(ele.historyActivityId);
        } else if (
          keys.includes(ele.historyActivityId) &&
          otherIds.includes(ele.historyActivityId)
        ) {
          otherArr.map((other) => {
            if (
              other.historyActivityId === ele.historyActivityId &&
              other.createTime < ele.createTime
            ) {
              other = ele;
            }
          });
        }
      });
      let comments = otherArr.map((ele) => ele.comment);
      if (comments.includes("驳回")) {
        let obj = {
          comment: "系统自动驳回",
          processInstanceId: this.formData.processInstanceId,
          taskId: taskId,
        };
        let res = await completeTask(obj);
      }
    },
    //流程
    handleClick() {
      if (this.formData.processInstanceId) {
        this.processInstanceId = this.formData.processInstanceId;
        this.src = `/api/oa-flow/process/diagram-view?processInstanceId=${
          this.processInstanceId
        }&t=${new Date().getTime()}`;
      } else if (this.formData.flow.processDefinitionId) {
        this.src = `/api/oa-flow/process/resource-view?processDefinitionId=${this.formData.flow.processDefinitionId}`;
      }
    },
    testCustomForm() {
      let baseInfo = this.showBaseInfo ? this.$refs.baseInfo.form : {};
      if (this.myApprovalName === "用印申请流程" && !baseInfo.titleName) {
        this.$message.error("请输入标题名称");
        return false;
      }
      for (let row of this.rule) {
        if (row.$required === true) {
          if (
            row.value === "" ||
            row.value === undefined ||
            row.value === null
          ) {
            this.$message.error(`请填写${row.title}`);
            return false;
          }
        }
        if (row.children.length > 0) {
          for (let subItem of row.children) {
            if (
              subItem.children &&
              Array.isArray(subItem.children) &&
              subItem.children[0] &&
              subItem.children[0].$required === true
            ) {
              if (
                subItem.children[0].value === "" ||
                subItem.children[0].value === undefined ||
                subItem.children[0].value === null
              ) {
                this.$message.error(`请填写${subItem.children[0].title}`);
                return false;
              }
            }
          }
        }
      }
      if (this.tableFormList && this.tableFormList.length > 0) {
        for (let row of this.tableFormList) {
          if (row.required === true) {
            let arr = this.$refs.tableForm.tableList;
            for (let valueRow of arr) {
              if (!valueRow[row.nameKey]) {
                this.$message.error(`请填写${row.name}`);
                return false;
              }
            }
          }
        }
      }
      return true;
    },
    //提交表单
    async submit(key, isApprove, otherFlow, notest) {
      //otherFlow有些流程不校验
      //校验表单
      this.disabledSubmit = true;
      let result = true;
      if (!this.customForm && key !== "save" && !otherFlow && !notest) {
        result = await this.$refs.formRef.testForm();
      } else if (this.customForm && key !== "save") {
        result = this.testCustomForm();
      }
      if (result || key === "save" || notest) {
        if (
          this.approvalName === "采购委员会决议申请" ||
          this.approvalName === "供应商订单变更" ||
          this.approvalName === "供应商订单状态" ||
          this.approvalName === "供应商订单发送"
        ) {
          this.$refs.formRef.dealData();
        }
        //防抖
        debounce(this.debounceSubmit, this, 1000, key, isApprove);
        return true;
      } else {
        this.disabledSubmit = false;
        return false;
      }
    },
    async clearSign() {
      let obj = {
        id: this.$route.query.businessId,
        pmoFile: "",
        purchaseManagerFile: "",
        financeManagerFile: "",
        groupLeaderFile: "",
        personnelManagerFile: "",
      };
      let res = await PurchaseCommissionDecisionApplyApi.saveSign(obj);
    },
    async signUrl(data) {
      let curId = (this.userInfo.user_id || this.userInfo.id) + "";
      let isPmo = curId === this.formData.pmo + "";
      let isPurchase =
        curId === this.formData.purchaseManager + "" ||
        curId === "1647788145559539713";
      let isPersonnel = curId === this.formData.personnelManager + "";
      let isFinance = curId === this.formData.financeManager + "";
      let isGroup = curId === this.formData.groupLeader + "";
      let isPersonnelAndGroup =
        this.formData.personnelManager === this.formData.groupLeader;
      if (isPmo) {
        this.formData.pmoFile = data;
      }
      if (isPurchase) {
        this.formData.purchaseManagerFile = data;
      }
      if (isPersonnel) {
        this.formData.personnelManagerFile = data;
      }
      if (isFinance) {
        this.formData.financeManagerFile = data;
      }
      if (isGroup) {
        this.formData.groupLeaderFile = data;
      }
      //代签只有达总这一步才会有，所以可以直接赋值
      if (this.isFanDa && this.formData.isSignFor === "是") {
        this.formData.personnelManagerFile = data;
        if (isPersonnelAndGroup) {
          this.formData.groupLeaderFile = data;
        }
      }
      let obj = {
        id: this.$route.query.businessId,
        pmoFile: this.formData.pmoFile, //encodeURIComponent(this.formData.pmoFile),
        purchaseManagerFile: this.formData.purchaseManagerFile, //encodeURIComponent(this.formData.purchaseManagerFile),
        financeManagerFile: this.formData.financeManagerFile, //encodeURIComponent(this.formData.financeManagerFile),
        groupLeaderFile: this.formData.groupLeaderFile, //encodeURIComponent(this.formData.groupLeaderFile),
        personnelManagerFile: this.formData.personnelManagerFile, //encodeURIComponent(this.formData.personnelManagerFile)
      };
      let res = await PurchaseCommissionDecisionApplyApi.saveSign(obj);
      if (res.data.code === 0 || res.data.code === 200) {
        this.$message.success("已签名");
        this.operateFlow("ok", "", "haveSign");
        this.$refs.signature.dialogVisible = false;
      }
    },
    dealSign() {
      let curId = (this.userInfo.user_id || this.userInfo.id) + "";
      // console.log(curId)
      let isPmo = curId === this.formData.pmo + "";
      let isPurchase =
        curId === this.formData.purchaseManager + "" ||
        curId === "1647788145559539713";
      let isPersonnel = curId === this.formData.personnelManager + "";
      let isFinance = curId === this.formData.financeManager + "";
      let isGroup = curId === this.formData.groupLeader + "";
      console.log(isPmo, isPurchase, isPersonnel, isFinance, isGroup);
      //非项目组、非采购、非财务、非综管、非部门负责人
      if (!isPmo && !isPurchase && !isPersonnel && !isFinance && !isGroup) {
        this.operateFlow("ok", "", "haveSign");
        // if (this.isMobile) {
        //   this.mobileRouterPush(res, "shenpi");
        // } else {
        //   window.close();
        // }
      } else {
        this.$refs.signature.dialogVisible = true;
        // if (this.isFanDa) {
        //   this.dialogIsSignFor = true
        // } else {
        //   this.$refs.signature.dialogVisible = true
        // }
      }
    },
    confirmSignFor() {
      this.dialogIsSignFor = false;
      this.$refs.signature.dialogVisible = true;
    },
    //审批 包括退回和批准
    async operateFlow(key, isBeReturned = false, haveSign) {
      if (
        this.approvalName === "采购委员会决议申请" &&
        key === "notOk" &&
        !haveSign &&
        this.formData.flow.taskDefinitionKey !== "applyDepts" &&
        this.formData.flow.taskDefinitionKey !== "applyAssignee"
      ) {
        this.clearSign();
      } else if (
        this.approvalName === "采购委员会决议申请" &&
        key !== "notOk" &&
        !haveSign &&
        this.formData.flow.taskDefinitionKey !== "applyDepts" &&
        this.formData.flow.taskDefinitionKey !== "applyAssignee"
      ) {
        this.dealSign();
        return;
      }
      if (this.approvalName === "零件价格维护") {
        await this.$refs.formRef.submit();
      }
      if (
        (this.approvalSave && key !== "notOk") ||
        isBeReturned ||
        this.myApprovalName === "机房软硬件变更申请"
      ) {
        let canSubmit = await this.submit("start", "isApprove");
        if (!canSubmit) return;
      } else if (key !== "notOk") {
        // &&!this.customForm
        // let canSubmit = await this.submit('start', 'isApprove','','notest')
      }
      let obj = {
        comment: this.comment,
        flag: "ok",
        processInstanceId: this.formData.processInstanceId,
        taskId: this.$route.query.taskId,
      };
      if (key === "notOk") {
        this.showCommentError = !this.comment;
        if (this.showCommentError) {
          this.$message.error("请在流程操作的意见里面填写驳回原因");
          return;
        }
        delete obj.flag;
      }
      if (this.approvalName === "采购委员会决议申请" && this.isFanDa) {
        obj.isSignFor = this.formData.isSignFor;
      }
      if (
        this.approvalName === "人员入职申请" ||
        this.approvalName === "验收申请单"
      ) {
        obj.variables = this.$refs.formRef.variables;
      }
      this.loading = true;
      let res = await completeTask(obj);
      this.loading = false;
      if (res.data.code === 200 || res.data.code === 0) {
        if (this.approvalName === "验收申请单") {
          await this.getDataHistory();
        }
        if (this.approvalName === "采购委员会决议申请" && key === "notOk") {
          this.clearSign();
        }
        if (this.isMobile) {
          if (this.$route.query.isQiWei) {
            window.open(
              `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx963179f52abc1968&redirect_uri=https%3A%2F%2Fsaic-dpmobile.saicmotor.com%2Fwxapi%2Fwxclientmenu%2F1e53e950687d4b278be528ef3a30d958&response_type=code&scope=SCOPE&agentid=1000148&state=1#wechat_redirect`
            );
          }
          //移动端提交逻辑
          this.mobileRouterPush(res, "shenpi");
        } else {
          localStorage.setItem("reloadPage", new Date().getTime());
          if (process.env.NODE_ENV === "production") {
            window.close();
          }
          menuTagRemove(this.$route.path, this.tagList, this);
          if (this.$route.query.isHome) {
            //关闭当前页tag
            this.$router.push("/wel/index?reflesh=true");
          } else if (this.$route.query.isQiWei) {
            //关闭当前页tag
            window.location.href(`${env.QIWEI_URL}?reflush=1`);
            this.$router.push("/wel/index?reflesh=true");
          } else {
            this.$router.push("/wel/index?reflesh=true");
          }
        }
      }
    },
    //移动端提交逻辑
    mobileRouterPush(res, state) {
      this.$message.success({
        message: "提交成功",
        type: "success",
        offset: 150,
      });
      let obj = {
        ...res.data,
        state: state,
      };
      window.parent.postMessage(
        {
          param: obj,
          msg: "success",
        },
        "*"
      );
      uni.navigateBack({
        delta: 1,
      });
    },
    async debounceSubmit(key, isApprove) {
      let deepFormData = JSON.parse(JSON.stringify(this.formData));
      //基本信息表单
      let baseInfo = this.showBaseInfo ? this.$refs.baseInfo.form : {};

      baseInfo.applyTime = dealTimerSecond(baseInfo.applyTime); //时间处理
      //自定义表单
      let componentForm = !this.customForm ? this.$refs.formRef.form : {};

      if (this.approvalName === "采购委员会决议申请") {
        (componentForm.pmoFile = this.formData.pmoFile), //encodeURIComponent(this.formData.pmoFile),
          (componentForm.purchaseManagerFile =
            this.formData.purchaseManagerFile), //encodeURIComponent(this.formData.purchaseManagerFile),
          (componentForm.financeManagerFile = this.formData.financeManagerFile), //encodeURIComponent(this.formData.financeManagerFile),
          (componentForm.groupLeaderFile = this.formData.groupLeaderFile), //encodeURIComponent(this.formData.groupLeaderFile),
          (componentForm.personnelManagerFile =
            this.formData.personnelManagerFile);
      }
      //其他信息表单
      let other = this.showOtherInfo ? this.$refs.other.form : {};
      if (this.otherFileRequest && other.fileList.length === 0) {
        this.$message.error(this.otherFileMsg);
        this.disabledSubmit = false;
        return;
      }
      let combinedObject = {
        ...componentForm,
        ...baseInfo,
        ...other,
        ...this.slotForm,
      };

      //详情的时候取得processDefinitionId，新建的时候取得流程I
      combinedObject.processDefinitionId = this.$route.query.businessId
        ? deepFormData.processDefinitionId ||
          this.formData.flow.processDefinitionId
        : this.processInstanceId;
      if (combinedObject.fileList && combinedObject.fileList.length > 0) {
        combinedObject.fileList.map((ele) => {
          if (ele.originalUrl) {
            ele.url = ele.originalUrl;
          }
        });
      }
      //自定义组件表单样式信息
      if (this.customForm) {
        combinedObject.id = this.$route.query.businessId;
        combinedObject.businessId = this.$route.query.businessId;
        combinedObject.formConfig = this.option;
        combinedObject.formConfigList = `${formCreate.toJson(this.rule)}`;
        combinedObject.tableConfigList = this.tableFormList;
        combinedObject.tableList = this.$refs.tableForm.tableList;
        combinedObject.flowName = this.myApprovalName;
        combinedObject.flow = deepFormData.flow;
      }
      if (this.showBaseInfo) {
        combinedObject.titleName = baseInfo.titleName;
      }
      if (this.approvalName === "项目预算申请") {
        combinedObject.titleName = ` ${this.approvalName} - ${
          this.userInfo.nick_name ||
          this.userInfo.realName ||
          this.userInfo.user_name
        } - ${getFormatDate()} - ${combinedObject.projectName}`;
      }
      console.log(this.componentTag + "this.componentTag");
      let fn =
        key === "save"
          ? TemporarySaveOperate[this.componentTag] //暂存即现在的保存
          : SaveOperate[this.componentTag]; //保存即现在的提交
      //暂存信息不走向流程，需要提交了才能进入流程模块
      this.loading = true;
      try {
        let res = await fn(combinedObject);
        this.loading = false;
        if (res.data.code === 200 || res.data.code === 0) {
          if (isApprove) return;
          this.$message.success("已提交");
          if (this.isMobile) {
            //移动端提交逻辑confirmSignFor
            if (!isApprove) {
              this.mobileRouterPush(res, "tijiao");
            }
          } else {
            menuTagRemove(this.$route.path, this.tagList, this);
            this.$router.push("/wel/index?reflesh=true");
          }
        } else {
          this.disabledSubmit = false;
        }
      } catch (error) {
       
      }
    },
  },
};
</script>

<style scoped lang="scss">
.text-center {
  text-align: center;
}

.formFlow {
  width: 800px;
  background-color: #fff !important;
  background: white !important;
  margin: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
}

.btn-top {
  position: fixed;
  top: 130px;
  z-index: 99999;
  background: #fff;
  width: 10%;
  padding: 10px;
  right: 40px;
  text-align: right;
}

.w-100 {
  width: 100%;
}
.flex-center {
  display: flex;
  justify-content: center;
}
.text-center {
  text-align: center;
}
body.pdf-export {
  background: white !important;
  margin: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
}

/* 移除所有可能产生阴影的元素 */
* {
  box-shadow: none !important;
  text-shadow: none !important;
  filter: none !important;
}

/* 特殊处理固定定位元素 */
.fixed-element {
  position: relative !important;
}
.row {
  text-align: center;
  padding-top: 50px;
}

.table-title {
  height: 30px;
  line-height: 30px;
  padding: 8px;
}

.table-title span {
  display: inline-block;
  width: 3px;
  height: 16px;
  background: #000;
  margin-right: 10px;
}

@media (max-width: 768px) {
  ::v-deep ep .el-col-12 {
    width: 100% !important;
  }
}
</style>
