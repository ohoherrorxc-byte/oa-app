<template>
  <basic-container>
    <p class="table-title">
      <span></span>申请信息
    </p>
    <el-form
      :disabled="disabled"
      v-if="!isPreviewExcel && !isPreviewPdf"
      ref="form"
      :rules="rules"
      :model="form"
      :label-width="labelWidth"
    >
      <el-form-item label="采购编号" prop="procurementNumber">
        <el-input v-model="form.procurementNumber"></el-input>
      </el-form-item>
      <el-form-item label="申请单位" prop="unit">
        <el-input disabled v-model="form.unit"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-select v-model="form.projectName" @change="selectProject">
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.projectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目经理" prop="projectManager">
        <el-input disabled v-model="form.projectManager"></el-input>
      </el-form-item>
      <el-form-item label="预算科目" prop="subjectId">
        <el-select v-model="form.subjectId" @change="getSubjectInfo">
          <el-option
            v-for="item in budgetList"
            :key="item.id"
            :value="item.id"
            :label="item.subjectName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成本中心" prop="costCenterId">
        <el-select v-model="form.costCenterId">
          <el-option
            v-for="item in costList"
            :key="item.id"
            :value="item.id"
            :label="item.costName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="WBS号" prop="wbsCode">
        <el-input disabled v-model="form.wbsCode"></el-input>
      </el-form-item>
      <el-form-item label="项目描述及意见" prop="descriptionAndComments">
        <el-input v-model="form.descriptionAndComments" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="form.supplierList"
          @selection-change="handleSelectionChange"
          class="mb20 table-now"
        >
          <el-table-column prop="chooseStatus" type="selection" width="55" label="是否选择"></el-table-column>
          <el-table-column property="potentialSuppliers" label="潜在供应商" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.potentialSuppliers'"
                :rules="rules.potentialSuppliers"
              >
                <el-input clearable v-model="scope.row.potentialSuppliers"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="initialQuotation" label="最初报价/RMB" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.initialQuotation'"
                :rules="rules.initialQuotation"
              >
                <el-input clearable v-model="scope.row.initialQuotation"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="technicalEvaluationConclusion" label="技术评估结论" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.technicalEvaluationConclusion'"
                :rules="rules.technicalEvaluationConclusion"
              >
                <el-input clearable v-model="scope.row.technicalEvaluationConclusion"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            property="quotationAfterTechnicalUnification"
            label="技术统一后报价/RMB"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.quotationAfterTechnicalUnification'"
                :rules="rules.quotationAfterTechnicalUnification"
              >
                <el-input clearable v-model="scope.row.quotationAfterTechnicalUnification"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="finalPrice" label="最终价格/RMB" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.finalPrice'"
                :rules="rules.finalPrice"
              >
                <el-input clearable v-model="scope.row.finalPrice"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            property="totalPriceIncludingNonDeductibleTax"
            label="含不可抵扣税总价/RMB"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.totalPriceIncludingNonDeductibleTax'"
                :rules="rules.totalPriceIncludingNonDeductibleTax"
              >
                <el-input clearable v-model="scope.row.totalPriceIncludingNonDeductibleTax"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="savingsAmount" label="节约金额" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.savingsAmount'"
                :rules="rules.savingsAmount"
              >
                <el-input clearable v-model="scope.row.savingsAmount"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column property="savingsRate" label="节约率%" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.savingsRate'"
                :rules="rules.savingsRate"
              >
                <el-input clearable v-model="scope.row.savingsRate"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="row && row.reasonForSelection" label="选择理由" align="center">
            <template slot-scope="scope">
              <el-form-item
                style="width: 100%;"
                :prop="'supplierList.' + scope.$index + '.reasonForSelection'"
                :rules="rules.reasonForSelection"
              >
                <el-input clearable v-model="scope.row.reasonForSelection"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="开口" prop="openStatus">
        <el-select v-model="form.openStatus">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="闭口" prop="closeStatus">
        <el-select v-model="form.closeStatus">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标价格" prop="targetPrice">
        <el-input v-model="form.targetPrice"></el-input>
      </el-form-item>
      <el-form-item label="交货期" prop="deliveryDate">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%;"
          v-model="form.deliveryDate"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
        <!-- <el-input v-model="form.deliveryDate"></el-input> -->
      </el-form-item>
      <el-form-item label="价格说明" prop="priceDescription">
        <el-input v-model="form.priceDescription"></el-input>
      </el-form-item>
      <el-form-item
        label="单一供应商理由"
        :prop="form.supplierList.length === 1?'reasonForSingleSupplier':''"
      >
        <el-input v-model="form.reasonForSingleSupplier" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="结论" prop="conclusion">
        <el-input v-model="form.conclusion" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="供应商报价明细" prop="supplierQuotationDetailsUrl">
        <!-- //supplierQuotationDetailsUrl -->
        <div class="flex-center">
          <upload
            btnName="上传excel,pdf"
            :fileList="fileListQuotation"
            @handleRequest="supplierQuotation"
            :showFileList="true"
          ></upload>
          <span
            v-if="!isMobile"
            class="pl10"
            @click="toPreview(form.supplierQuotationDetailsUrl)"
          >预览</span>
        </div>
      </el-form-item>
      <el-form-item label="供应商综合评估表" prop="supplierComprehensiveEvaluationFormUrl">
        <div class="flex-center">
          <!-- supplierComprehensiveEvaluationFormUrl -->
          <upload
            btnName="上传excel,pdf"
            :fileList="fileListEvaluation"
            @handleRequest="supplierComprehensive"
            :showFileList="true"
          ></upload>
          <span
            v-if="!isMobile"
            class="pl10"
            @click="toPreview(form.supplierComprehensiveEvaluationFormUrl)"
          >预览</span>
          <span v-if="!isMobile" class="pl10" @click="downSupplier">模板</span>
        </div>
      </el-form-item>
      <el-form-item label="技术评估表" prop="technicalEvaluationFormUrl">
        <div class="flex-center">
          <!-- technicalEvaluationFormUrl -->
          <upload
            btnName="上传excel,pdf"
            :fileList="fileListTechnicalEvaluation"
            @handleRequest="technicalEvaluation"
            :showFileList="true"
          ></upload>
          <span v-if="!isMobile" class="pl10" @click="toPreview(form.technicalEvaluationFormUrl)">预览</span>
          <span v-if="!isMobile" class="pl10" @click="downtechnology">模板</span>
        </div>
      </el-form-item>
    </el-form>
    <!-- <fullscreen ref="fullScreenRef" class="fullscreenL" v-if="isPreviewExcel || isPreviewPdf">
      <div class="exitFull" @click="ExitFull">
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <vue-office-excel
        v-if="isPreviewExcel"
        :src="fileUrl"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
      <vue-office-pdf
        v-else-if="isPreviewPdf"
        :src="pdfUrl"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </fullscreen> -->
  </basic-container>
</template>

<script>
// import VueOfficeExcel from "@vue-office/excel";
// import VueOfficePdf from "@vue-office/pdf";
import { contractProject } from "@/api/myFlow/index";
import purchaseApprovalApi from "@/api/purchaseApproval/index";
//引入相关样式
// import "@vue-office/excel/lib/index.css";
import upload from "@/components/upload/index";
import CostApi from "@/api/cost";
import subjectManageApi from "@/api/subjectManage/index";
import { fileDownload } from "@/util/util";
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
      fileListTechnicalEvaluation: [],
      fileListQuotation: [],
      fileListEvaluation: [],
      form: {
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
            status: null,
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
        procurementNumber: [
          { required: true, message: "请输入采购编号", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "请选择项目名称", trigger: "change" },
        ],
        subjectId: [
          { required: true, message: "请选择预算科目", trigger: "change" },
        ],
        costCenterId: [
          { required: true, message: "请选择成本中心", trigger: "change" },
        ],
        descriptionAndComments: [
          { required: true, message: "请输入项目描述及意见", trigger: "blur" },
        ],
        potentialSuppliers: [
          { required: true, message: "请输入潜在供应商", trigger: "blur" },
        ],
        initialQuotation: [
          { required: true, message: "请输入最初报价/RMB", trigger: "blur" },
        ],
        technicalEvaluationConclusion: [
          { required: true, message: "请输入技术评估结论", trigger: "blur" },
        ],
        quotationAfterTechnicalUnification: [
          { required: true, message: "请输入技术统一后报价", trigger: "blur" },
        ],
        finalPrice: [
          { required: true, message: "请输入最终价格/RMB", trigger: "blur" },
        ],
        totalPriceIncludingNonDeductibleTax: [
          {
            required: true,
            message: "请输入含不可抵扣税总价",
            trigger: "blur",
          },
        ],
        savingsAmount: [
          { required: true, message: "请输入节约金额", trigger: "blur" },
        ],
        savingsRate: [
          { required: true, message: "请输入节约率%", trigger: "blur" },
        ],
        reasonForSelection: [
          { required: true, message: "请输入选择理由", trigger: "blur" },
        ],
        openStatus: [
          { required: true, message: "请选择开口", trigger: "change" },
        ],
        closeStatus: [
          { required: true, message: "请选择闭口", trigger: "change" },
        ],
        targetPrice: [
          { required: true, message: "请输入目标价格", trigger: "blur" },
        ],
        deliveryDate: [
          { required: true, message: "请选择交货期", trigger: "change" },
        ],
        priceDescription: [
          { required: true, message: "请输入价格说明", trigger: "blur" },
        ],
        reasonForSingleSupplier: [
          { required: true, message: "请输入单一供应商理由", trigger: "blur" },
        ],
        conclusion: [
          { required: true, message: "请输入结论", trigger: "blur" },
        ],
        supplierQuotationDetailsUrl: [
          { required: true, message: "请上传供应商报价明细", trigger: "blur" },
        ],
        supplierComprehensiveEvaluationFormUrl: [
          {
            required: true,
            message: "请上传供应商综合评估表",
            trigger: "blur",
          },
        ],
        technicalEvaluationFormUrl: [
          { required: true, message: "请上传技术评估表", trigger: "blur" },
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
   
  },
  mounted() {
    if (this.isMobile) {
      this.labelWidth = "100px";
    }
    this.getProject();
    this.getCost();
    this.getBudget();
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.ExitFull();
  },
  computed: {
    ...mapGetters(["isMobile"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async getDetail() {
      let res = await purchaseApprovalApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.subjectId = (this.form.subjectId||"").toString();
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
      // var fileExtension = url.split(".").pop().toLowerCase();
      // if (fileExtension === "pdf") {
      //   this.isPreviewPdf = true;
      //   this.isPreviewExcel = false;
      //   this.pdfUrl = url;
      // } else {
      //   this.isPreviewExcel = true;
      //   this.isPreviewPdf = false;
      //   this.fileUrl = url;
      // }
      // console.log(this.isPreviewExcel);
      // console.log(this.isPreviewPdf);
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
}

@media (min-width: 768px) {
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