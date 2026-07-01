<template>
  <basic-container>
    <p class="table-title"><span></span>基本信息</p>
    <el-form
      :disabled="disabled"
      v-if="!isPreviewExcel && !isPreviewPdf"
      ref="form"
      :rules="rules"
      :model="form"
      :label-width="labelWidth"
    >
      <el-form-item label="标题" style="width: 96%" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="申请人" prop="assetNumber">
        <el-input v-model="form.taxRate" clearable></el-input>
      </el-form-item>
      <el-form-item label="申请部门" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountOriginal"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="申请日期" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="发票编号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="开票说明" style="width: 96%" prop="kpsm">
        <el-input type="textarea" v-model="form.kpsm"></el-input>
      </el-form-item>

      <p class="table-title"><span></span>开票信息</p>

      <el-form-item label="发票接收人" style="width: 96%">
        <el-input clearable></el-input>
      </el-form-item>
      <el-form-item label="开票类型" prop="kplx">
        <el-select v-model="form.kplx">
          <el-option v-for="item in form.kplx"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售类型" prop="xslx">
        <el-select v-model="form.xslx" @change="getSubjectInfo">
          <el-option
            v-for="item in budgetList"
            :key="item.id"
            :value="item.id"
            :label="item.xslx"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关合同" prop="assetNumber">
        <el-input v-model="form.salesContractTotalAmountRmb" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="合同编号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="相关PO订单" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="票据类型" prop="pjlx">
        <el-select v-model="form.pjlx" @change="getSubjectInfo">
          <el-option
            v-for="item in budgetList"
            :key="item.id"
            :value="item.id"
            :label="item.subjectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型">
        <el-select
          v-model="form.salesContractType"
          clearable
          :disabled="isDetail"
        >
          <el-option
            v-for="item in salesContractTypeList"
            :value="item.dictKey"
            :key="item.dictKey"
            :label="item.dictValue"
          ></el-option>
          <!-- <el-option label="开口合同" :value="0"></el-option>
                    <el-option label="闭口合同" :value="1"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="项目编号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="币种" prop="assetNumber">
        <el-select v-model="form.subjectId" @change="getSubjectInfo">
          <el-option
            v-for="item in budgetList"
            :key="item.id"
            :value="item.id"
            :label="item.subjectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税率">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="折扣金额" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="利润">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="总金额" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="已开票金额">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="未开票金额" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="本次开票金额">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="累计开票金额" style="width: 96%">
        <el-input clearable>0.0</el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%"><span></span>客户信息</p>
      <el-form-item label="客户名称" prop="khmc">
        <el-input clearable v-model="khmc"></el-input>
      </el-form-item>
      <el-form-item label="客户编号">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="客户地址、电话" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="开户银行" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="开户账号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="客户联系人" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="客户联系电话">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="进出口注册号码" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="税号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="企业永久账号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="SHIPPING MARK:" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="合同编号">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="PO编号" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="说明">
        <el-select v-model="form.subjectId" @change="getSubjectInfo">
          <el-option
            v-for="item in budgetList"
            :key="item.id"
            :value="item.id"
            :label="item.subjectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其他" prop="assetNumber">
        <el-input
          v-model="form.salesContractTotalAmountRmb"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="发票备注" style="width: 96%">
        <el-input type="textarea" clearable></el-input>
      </el-form-item>
      <p class="table-title" style="width: 96%"><span></span>票据信息</p>
      <el-form-item label-width="0" style="width: 100%">
        <div class="fr">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.supplierList"
          @selection-change="handleSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column
            prop="chooseStatus"
            type="selection"
            width="55"
            label="是否选择"
          >
          </el-table-column>
          <el-table-column
            property="potentialSuppliers"
            label="开票品名"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'supplierList.' + scope.$index + '.potentialSuppliers'"
                :rules="rules.potentialSuppliers"
              >
                <el-input
                  clearable
                  v-model="scope.row.potentialSuppliers"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            property="initialQuotation"
            label="零件号"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'supplierList.' + scope.$index + '.initialQuotation'"
                :rules="rules.initialQuotation"
              >
                <el-input
                  clearable
                  v-model="scope.row.initialQuotation"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            property="technicalEvaluationConclusion"
            label="单位"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="
                  'supplierList.' +
                  scope.$index +
                  '.technicalEvaluationConclusion'
                "
                :rules="rules.technicalEvaluationConclusion"
              >
                <el-input
                  clearable
                  v-model="scope.row.technicalEvaluationConclusion"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="finalPrice" label="单价" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'supplierList.' + scope.$index + '.finalPrice'"
                :rules="rules.finalPrice"
              >
                <el-input clearable v-model="scope.row.finalPrice"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            property="totalPriceIncludingNonDeductibleTax"
            label="数量"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="
                  'supplierList.' +
                  scope.$index +
                  '.totalPriceIncludingNonDeductibleTax'
                "
                :rules="rules.totalPriceIncludingNonDeductibleTax"
              >
                <el-input
                  clearable
                  v-model="scope.row.totalPriceIncludingNonDeductibleTax"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="savingsAmount" label="金额" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'supplierList.' + scope.$index + '.savingsAmount'"
                :rules="rules.savingsAmount"
              >
                <el-input
                  clearable
                  v-model="scope.row.savingsAmount"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="savingsRate" label="说明" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'supplierList.' + scope.$index + '.savingsRate'"
                :rules="rules.savingsRate"
              >
                <el-input clearable v-model="scope.row.savingsRate"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="remark" label="备注" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%"
                :prop="'supplierList.' + scope.$index + '.remark'"
                :rules="rules.remark"
              >
                <el-input clearable v-model="scope.row.remark"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%">
                <el-button
                  type="text"
                  @click="deleteRow(scope.row)"
                  style="color: red"
                  >删除</el-button
                >
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    
    </el-form>

    <!-- <fullscreen ref="fullScreenRef" class="fullscreenL" v-if="isPreviewExcel || isPreviewPdf">
      <div class="exitFull" @click="ExitFull"><i class="el-icon-arrow-left"></i>
        返回</div>
      <vue-office-excel v-if="isPreviewExcel" :src="fileUrl" style="height: 100vh;" @rendered="renderedHandler"
        @error="errorHandler" />
      <vue-office-pdf v-else-if="isPreviewPdf" :src="pdfUrl" @rendered="renderedHandler" @error="errorHandler" />
    </fullscreen> -->
  </basic-container>
</template>

<script>
// import VueOfficeExcel from '@vue-office/excel'
// import VueOfficePdf from '@vue-office/pdf'
import { contractProject } from "@/api/myFlow/index";
import purchaseApprovalApi from "@/api/purchaseApproval/index";
//引入相关样式
// import '@vue-office/excel/lib/index.css'
import upload from "@/components/upload/index";
import CostApi from "@/api/cost";
import subjectManageApi from "@/api/subjectManage/index";
import { fileDownload } from "@/util/util";
import { getDictionary } from "@/api/system/dict";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      labelWidth: "140px",
      projectList: [],
      isPreviewExcel: false,
      isPreviewPdf: false,
      pdfUrl: "",
      fileUrl: "",
      salesContractTypeList: [],
      fileListTechnicalEvaluation: [],
      fileListQuotation: [],
      fileListEvaluation: [],
      form: {
        title: "",
        kpsm: "",
        kplx: [],
        xslx: [],
        pjlx: [],
        khmc: [],
        subjectId: "",
        subjectName: "",
        closeStatus: null,
        conclusion: "",
        costCenter: "",
        costCenterId: null,
        deliveryDate: "",
        descriptionAndComments: "",
        openStatus: null,
        priceDescription: "",
        processDefinitionId: "",
        processInstanceId: "",
        procurementNumber: "",
        projectId: null,
        projectManager: "",
        projectManagerId: null,
        projectName: "",
        reasonForSingleSupplier: "",
        status: null,
        supplierComprehensiveEvaluationFormUrl: "",
        supplierComprehensiveEvaluationFormName: "",
        supplierQuotationDetailsName: "",
        technicalEvaluationFormName: "",
        supplierList: [
          {
            chooseStatus: 0,
            createDept: null,
            createTime: "",
            createUser: null,
            finalPrice: null,
            initialQuotation: null,
            potentialSuppliers: "",
            quotationAfterTechnicalUnification: null,
            reasonForSelection: "",
            savingsAmount: null,
            savingsRate: null,
            remark: null,
            technicalEvaluationConclusion: "",
            totalPriceIncludingNonDeductibleTax: null,
            updateTime: "",
            updateUser: null,
            key: Date.now(),
          },
        ],
        supplierQuotationDetailsUrl: "",
        targetPrice: null,
        technicalEvaluationFormUrl: "",
        unit: "上汽海外出行科技有限公司",
        wbsCode: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        kpsm: [
          {
            required: true,
            message: "请输入开票说明",
            trigger: "blur",
          },
        ],
        kplx: [
          {
            required: true,
            message: "请输入开票类型",
            trigger: "blur",
          },
        ],
        xslx: [
          {
            required: true,
            message: "请输入销售类型",
            trigger: "blur",
          },
        ],
        pjlx: [
          {
            required: true,
            message: "请输入票据类型",
            trigger: "blur",
          },
        ],
        khmc: [
          {
            required: true,
            message: "请输入客户名称",
            trigger: "blur",
          },
        ],
        procurementNumber: [
          {
            required: true,
            message: "请输入采购编号",
            trigger: "blur",
          },
        ],
        projectName: [
          {
            required: true,
            message: "请选择项目名称",
            trigger: "change",
          },
        ],
        subjectId: [
          {
            required: true,
            message: "请选择预算科目",
            trigger: "change",
          },
        ],
        costCenterId: [
          {
            required: true,
            message: "请选择成本中心",
            trigger: "change",
          },
        ],
        descriptionAndComments: [
          {
            required: true,
            message: "请输入项目描述及意见",
            trigger: "blur",
          },
        ],
        potentialSuppliers: [
          {
            required: true,
            message: "请输入开票品名",
            trigger: "blur",
          },
        ],
        technicalEvaluationConclusion: [
          {
            required: true,
            message: "请输入单位",
            trigger: "blur",
          },
        ],
        quotationAfterTechnicalUnification: [
          {
            required: true,
            message: "请输入单价",
            trigger: "blur",
          },
        ],
        finalPrice: [
          {
            required: true,
            message: "请输入单价",
            trigger: "blur",
          },
        ],
        totalPriceIncludingNonDeductibleTax: [
          {
            required: true,
            message: "请输入数量",
            trigger: "blur",
          },
        ],
        savingsAmount: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
          },
        ],
        reasonForSelection: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur",
          },
        ],
        openStatus: [
          {
            required: true,
            message: "请选择开口",
            trigger: "change",
          },
        ],
        closeStatus: [
          {
            required: true,
            message: "请选择闭口",
            trigger: "change",
          },
        ],
        targetPrice: [
          {
            required: true,
            message: "请输入目标价格",
            trigger: "blur",
          },
        ],
        deliveryDate: [
          {
            required: true,
            message: "请选择交货期",
            trigger: "change",
          },
        ],
        priceDescription: [
          {
            required: true,
            message: "请输入价格说明",
            trigger: "blur",
          },
        ],
        reasonForSingleSupplier: [
          {
            required: true,
            message: "请输入单一供应商理由",
            trigger: "blur",
          },
        ],
        conclusion: [
          {
            required: true,
            message: "请输入结论",
            trigger: "blur",
          },
        ],
        supplierQuotationDetailsUrl: [
          {
            required: true,
            message: "请上传供应商报价明细",
            trigger: "blur",
          },
        ],
        supplierComprehensiveEvaluationFormUrl: [
          {
            required: true,
            message: "请上传供应商综合评估表",
            trigger: "blur",
          },
        ],
        technicalEvaluationFormUrl: [
          {
            required: true,
            message: "请上传技术评估表",
            trigger: "blur",
          },
        ],
      },
      businessId: null,
      costList: [],
      budgetList: [],
      multipleSelection: [],
      isEdit: false,
    };
  },
  components: {
    upload,
    // VueOfficeExcel,
    // VueOfficePdf
  },
  mounted() {
    console.log(this.isMobile + "isMobile");
    if (this.isMobile) {
      this.labelWidth = "80px";
    }
    this.getProject();
    this.getCost();
    this.getBudget();
    this.getDictionary({ code: "CONTRACT_TYPE" }, "saleContractType");
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.ExitFull();
  },
  computed: {
    computed: mapGetters(["isMobile"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await purchaseApprovalApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.subjectId = (this.form.subjectId || "").toString();
        this.fileListEvaluation = [
          {
            name: this.form.supplierComprehensiveEvaluationFormName,
            url: this.form.supplierComprehensiveEvaluationFormUrl,
          },
        ];
        this.fileListQuotation = [
          {
            name: this.form.supplierQuotationDetailsName,
            url: this.form.supplierQuotationDetailsUrl,
          },
        ];
        this.fileListTechnicalEvaluation = [
          {
            name: this.form.technicalEvaluationFormName,
            url: this.form.technicalEvaluationFormUrl,
          },
        ];
        this.toggleList(this.form.supplierList);
        this.$emit("getFormData", this.form);
      }
    },
    getDictionary(params, type) {
      getDictionary(params).then((res) => {
        this.salesContractTypeList = res.data.data;
      });
    },
    toggleList(arr) {
      this.$nextTick(() => {
        arr.map((ele, index) => {
          if (ele.chooseStatus) {
            this.$refs.multipleTable.toggleRowSelection(ele, true);
          }
        });
      });
    },
    downSupplier() {
      fileDownload(
        "http://10.30.4.68:9000/license/upload/20231201/ec5e80f4924828c1b249b3611d7ccf4a.xlsx",
        "供应商综合评估表"
      );
    },
    downtechnology() {
      fileDownload(
        "http://10.30.4.68:9000/license/upload/20231201/8b827b15f930fc965afd37decc5fc86b.xlsx",
        "技术评估表"
      );
    },
    getSubjectInfo() {
      let o = this.budgetList.find((ele) => {
        return ele.id === this.form.subjectId;
      });
      if (o) {
        this.form.subjectName = o.subjectName;
        this.form.wbsCode = o.subjectCode;
      }
    },
    toPreview(url) {
      var fileExtension = url.split(".").pop().toLowerCase();
      if (fileExtension === "pdf") {
        this.isPreviewPdf = true;
        this.isPreviewExcel = false;
        this.pdfUrl = url;
      } else {
        this.isPreviewExcel = true;
        this.isPreviewPdf = false;
        this.fileUrl = url;
      }
      console.log(this.isPreviewExcel);
      console.log(this.isPreviewPdf);
    },
    async getBudget() {
      let res = await subjectManageApi.getListAll();
      console.log(res);
      this.budgetList = res.data.data;
    },
    async getCost() {
      let res = await CostApi.getCostList();
      console.log(res);
      if (res.data.code === 0 || res.data.code === 200) {
        this.costList = res.data.data;
      }
    },
    async getProject() {
      let res = await contractProject();
      this.projectList = res.data.data;
    },
    selectProject() {
      let item = this.projectList.find((ele) => {
        return ele.projectName === this.form.projectName;
      });
      if (item) {
        this.form.projectManager = item.projectManage;
        this.form.projectId = item.id;
      }
    },
    supplierQuotation(data, list) {
      this.fileListQuotation = list;
      this.form.supplierQuotationDetailsUrl = data.link;
      this.form.supplierQuotationDetailsName = list[0].name;
    },
    supplierComprehensive(data, list) {
      console.log(list);
      this.fileListEvaluation = list;
      this.form.supplierComprehensiveEvaluationFormUrl = data.link;
      this.form.supplierComprehensiveEvaluationFormName = list[0].name;
    },
    technicalEvaluation(data, list) {
      this.fileListTechnicalEvaluation = list;
      this.form.technicalEvaluationFormUrl = data.link;
      this.form.technicalEvaluationFormName = list[0].name;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
      let keysOrIds = this.multipleSelection.map((ele) => {
        return ele.id || ele.key;
      });
      if (keysOrIds.length > 0) {
        this.form.supplierList.map((ele) => {
          if (keysOrIds.includes(ele.key || ele.id)) {
            ele.chooseStatus = 1;
          }
        });
      }
      console.log(this.form.supplierList);
    },
    addRow() {
      this.form.supplierList.push({
        key: Date.now(),
      });
    },
    deleteRow(row) {
      this.form.supplierList = this.form.supplierList.filter((ele) => {
        return ele !== row;
      });
    },
    renderedHandler() {
      console.log("渲染完成");
    },
    ExitFull() {
      this.isPreviewExcel = false;
      this.isPreviewPdf = false;
    },
    errorHandler() {
      console.log("渲染失败");
    },
    testForm() {
      console.log(this.form);
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
          if (valid) {
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;

  .el-form-item {
    width: 48%;
  }
}

.fullscreenL {
  overflow: scroll;
}

.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.dec-icon {
  color: #979797;
  background-color: #eaeaea;
  padding: 3px 6px;
  border-radius: 2px;
  margin-right: 20px;
}

.exitFull {
  position: absolute;
  padding: 20px;
  color: transparent;
  z-index: 1000;
}

.exitFull:hover {
  color: #fff;
  background-color: #000;
}

.botton-row {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.table-now {
}
</style>
