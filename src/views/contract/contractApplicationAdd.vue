<template>
  <div>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>开票申请单</p>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title"><span></span>基本信息</p>
          <avue-form
            ref="forma"
            :option="optiona"
            v-model="form"
            @submit="handleSubmitOne"
          ></avue-form>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title"><span></span>合同信息</p>
          <avue-form
            ref="formb"
            :option="optionb"
            v-model="form"
            @submit="handleSubmitTwo"
          ></avue-form>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title"><span></span>客户信息</p>
          <avue-form
            ref="formb"
            :option="optiond"
            v-model="form"
            @submit="handleSubmitThree"
          ></avue-form>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title"><span></span>订单明细</p>
          <div class="table-button">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="onAddItem"
              >添加</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteBtn"
              >删除</el-button
            >
          </div>

          <el-table
            :data="tableData"
            border="true"
            style="width: 100%"
            :row-class-name="rowClassName"
            @selection-change="handleDetailSelectionChange"
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column label="序号" align="center" prop="xh" width="50" />
            <el-table-column label="开票名称">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.invoiceProductName"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零件号">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.partsNo"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单位">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.unit"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.unitPrice"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.quantity"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.amount"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="说明">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.explain"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.remark"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title"><span></span>其他信息</p>
          <avue-form
            ref="formc"
            :option="optionc"
            v-model="form"
            @submit="handleSubmit"
          >
            <template slot="uploadUrl">
              <el-upload
                accept=".xls,.xlsx"
                ref="upload"
                action=""
                multiple="false"
                limit="1"
                :on-change="handleSelect"
                :before-upload="uploadBefore"
                :before-remove="beforeRemove"
                :http-request="handleUpload"
                :auto-upload="false"
              >
                <el-button slot="trigger" type="primary">选取文件</el-button>
              </el-upload>
            </template>
            <template slot="menuForm">
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  :loading="disabled"
                  plain
                  @click="
                    $refs.forma.submit(),
                      $refs.formb.submit(),
                      $refs.formc.submit()
                  "
                >
                  提交
                </el-button>
              </div>
            </template>
          </avue-form>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  InvoicedAdd,
  upload,
  SellGetDetail,
} from "@/api/contract/contractSellAdd";
import constData from "@/config/constData";

export default {
  name: "contractApplicationAdd",
  data() {
    return {
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      form: {},
      optiona: {
        column: [
          {
            type: "input",
            label: "标题",
            span: 24,
            prop: "invoiceName",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "申请人",
            span: 12,
            prop: "name",
            slot: true,
            disabled: true,
            placeholder: " ",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "申请部门",
            span: 12,
            prop: "department",
            disabled: true,
            placeholder: " ",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "申请日期",
            disabled: true,
            placeholder: " ",
            span: 12,
            prop: "Date",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "申请编号",
            span: 12,
            prop: "Date",
            disabled: true,
            placeholder: " ",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "textarea",
            label: "开票说明",
            span: 24,
            minRows: 9,
            prop: "invoiceDesc",
            rules: [
              {
                pattern: /^.{0,255}$/,
                message: "不能超过255个字符",
              },
            ],
          },
        ],
        labelPosition: "left",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        submitText: "验证文件",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
      },
      optionb: {
        column: [
          {
            type: "input",
            label: "开票接收人",
            span: 24,
            prop: "invoiceRecipient",
            slot: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "开票类型",
            span: 12,
            dicUrl: "/api/oa-system/dict/dictionary?code=INVOICE_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            placeholder: "请选择类型",
            prop: "invoiceType",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "销售类型",
            span: 12,
            dicUrl: "/api/oa-system/dict/dictionary?code=SALE_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            placeholder: "请选择类型",
            prop: "saleType",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "相关合同",
            placeholder: "请选择 相关合同",
            span: 12,
            dicUrl: "/api/oa-portal/saleContract/selectList",
            props: {
              label: "contractName",
              value: "id",
            },
            dataType: "string",
            virtualize: true,
            prop: "saleContractId",
            change: ({ value }) => {
              this.salesContractChange(value);
            },
          },
          {
            type: "input",
            label: "合同编号",
            span: 12,
            prop: "contractNo",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "相关PO订单",
            span: 12,
            prop: "saleOrderNo",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "订单编号",
            span: 12,
            prop: "customer",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "票据类型",
            span: 12,
            dicUrl: "/api/oa-system/dict/dictionary?code=BILL_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            placeholder: "请选择类型",
            prop: "billType",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "合同类型",
            span: 12,
            prop: "amount",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "项目名称",
            span: 12,
            prop: "amount",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "项目编号",
            span: 12,
            prop: "amount",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "币种",
            dicUrl: "/api/oa-system/dict/dictionary?code=CURRENCY",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "string",
            span: 12,
            prop: "currency",
            placeholder: "请选择 币种",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                //trigger: "blur"
              },
            ],
          },
          {
            type: "input",
            label: "税率",
            span: 12,
            prop: "taxRate",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "折扣金额",
            span: 12,
            prop: "discountAmount",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "利润",
            span: 12,
            prop: "profit",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "总金额",
            span: 12,
            prop: "countersigning",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "已开票金额",
            span: 12,
            prop: "project",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "未开票金额",
            span: 12,
            prop: "project",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "本次开票金额",
            span: 12,
            prop: "project",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "累计开票金额",
            span: 24,
            prop: "project",
            disabled: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
        ],
        labelPosition: "left",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        submitText: "验证文件",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
      },
      optionc: {
        column: [
          {
            type: "upload",
            label: "相关附件",
            span: 24,
            showFileList: true,
            prop: "uploadUrl",
            slot: true,
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "textarea",
            label: "备注",
            span: 24,
            minRows: 9,
            prop: "remark",
            rules: [
              {
                pattern: /^.{0,255}$/,
                message: "不能超过255个字符",
              },
            ],
          },
        ],
        labelPosition: "left",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        submitText: "验证文件",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
      },
      optiond: {
        column: [
          {
            type: "input",
            label: "客户名称",
            span: 12,
            prop: "project",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "客户编号",
            span: 12,
            prop: "custId",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "纳税人识别号",
            span: 12,
            prop: "project",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "客户地址、电话",
            span: 12,
            prop: "custContactTel",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "开户银行",
            span: 12,
            prop: "project",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "开户账号",
            span: 12,
            prop: "project",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "客户联系人",
            span: 12,
            prop: "custContact",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "客户联系电话",
            span: 12,
            prop: "custContactTel",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "邮编",
            span: 12,
            prop: "custZipCode",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "邮箱",
            span: 12,
            prop: "custEmail",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "进出口注册号码",
            span: 12,
            prop: "importExportRegistNo",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "税号",
            span: 12,
            prop: "taxNo",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "企业永久账号",
            span: 24,
            prop: "enterprisePermanentAccount",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "合同编号",
            span: 12,
            prop: "contractNo",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "PO编号",
            span: 12,
            prop: "saleOrderNo",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "说明",
            span: 12,
            prop: "explain",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "其他",
            span: 12,
            prop: "other",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "textarea",
            label: "发票备注",
            span: 24,
            minRows: 9,
            prop: "invoiceRemark",
            rules: [
              {
                pattern: /^.{0,255}$/,
                message: "不能超过255个字符",
              },
            ],
          },
        ],
        labelPosition: "left",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        submitText: "验证文件",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
      },
      attribute: [],
      tableData: [
        {
          invoiceProductName: "",
          partsNo: "",
          unit: "",
          unitPrice: "",
          quantity: "",
          amount: "",
          explain: "",
          remark: "",
        },
      ], //合同明细
      optionsa: [
        {
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
      ],
      checkedDetail: [],
      tableDataOne: [
        {
          licensetype: "",
          country: "",
          activenumber: "",
          unitprice: "",
          amountCollected: "",
        },
      ],
      checkedDetailOne: [],
      tableDataTwo: [
        {
          contactName: "",
          contactJob: "",
          contactPhone: "",
          contactEmail: "",
        },
      ],
      checkedDetailTwo: [],
      optionsa: [
        {
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
      ],
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    salesContractChange(value) {
      if (!value) return false;
      SellGetDetail(value).then((res) => {
        const data = res.data.data;
        this.form["contractNo"] = data["contractNo"];
        this.form["amountTotalOriginal"] = data["amountTotalOriginal"];
        this.form["exchangeRate"] = data["exchangeRate"];
        this.form["currency"] = data["currency"];
        this.form["taxRate"] = data["taxRate"];
        this.form["custName"] = data["custName"];
        this.form["projectName"] = data["projectName"];
        this.tableDataOne[0]["licensetype"] = data["licensetype"];
        this.tableDataOne[0]["country"] = data["country"];
        this.tableDataOne[0]["activenumber"] = data["activenumber"];
        this.tableDataOne[0]["unitprice"] = data["unitprice"];
        this.tableDataOne[0]["amountCollected"] = data["amountCollected"];
      });
    },
    handleChange(val) {
      window.console.log(val);
    },
    handleSubmit(form, done, loading) {
      console.log("val", form);
      form["tbBomPurchaseContractDetailList"] = this.tableData;
      form["createUser"] = this.userInfo.content.user_id;
      console.log("val", form);
      InvoicedAdd(form).then(
        (res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "创建成功！",
            });
          } else {
            this.$message({
              type: "error",
              message: "创建失败" + res.data.msg,
            });
          }
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    handleSubmitOne(form, done, loading) {
      console.log("val", form);
    },
    handleSubmitTwo(form, done, loading) {
      console.log("val", form);
    },
    handleSubmitThree(form, done, loading) {
      console.log("val", form);
    },
    handleSelect(file) {
      console.log("file", file);
    },
    uploadBefore: (file) => {
      debugger;
    },
    beforeRemove(file, fileList) {
      this.form.uploadUrl = [];
    },
    handleUpload(params) {
      upload(
        params.file,
        new Date().Format("yyyyMMddHHmmss") + "-" + params.file.name
      ).then((res) => {
        if (res.data.success) {
          this.form.uploadUrl = res.data.data.link;
          this.$message({
            type: "success",
            message: "上传成功！",
          });
        } else {
          this.$message({
            type: "error",
            message: "上传失败" + res.data.msg,
          });
        }
      });
    },
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    onAddItem() {
      this.tableData.push({
        invoiceProductName: "",
        partsNo: "",
        unit: "",
        unitPrice: "",
        quantity: "",
        amount: "",
        explain: "",
        remark: "",
      });
    },
    handleDeleteBtn() {
      if (this.checkedDetail.length == 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.$confirm("请是否确认删除该属性?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              let val = this.checkedDetail; //checkedDetail为表格多选选中的数组
              val.forEach((val, index) => {
                this.tableData.forEach((v, i) => {
                  if (val.xh === v.xh) {
                    this.tableData.splice(i, 1);
                  }
                });
              });
              this.$message({
                message: "删除成功，记得保存修改喔！",
                type: "success",
              });
              this.$refs.tb.clearSelection();
              return;
            } else {
              this.$message({
                message: "已取消删除操作",
                type: "warning",
              });
              return;
            }
          },
        });
      }
    },
    // 单选框选中数据
    handleDetailSelectionChange(selection) {
      this.checkedDetail = selection;
    },
    rowClassNameOne({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    onAddItemOne() {
      this.tableDataOne.push({
        licensetype: "",
        country: "",
        activenumber: "",
        unitprice: "",
        amountCollected: "",
      });
    },
    handleDeleteBtnOne() {
      if (this.checkedDetailOne.length == 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.$confirm("请是否确认删除该属性?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              let val = this.checkedDetailOne; //checkedDetail为表格多选选中的数组
              val.forEach((val, index) => {
                this.tableDataOne.forEach((v, i) => {
                  if (val.xh === v.xh) {
                    this.tableData.splice(i, 1);
                  }
                });
              });
              this.$message({
                message: "删除成功，记得保存修改喔！",
                type: "success",
              });
              this.$refs.tb.clearSelection();
              return;
            } else {
              this.$message({
                message: "已取消删除操作",
                type: "warning",
              });
              return;
            }
          },
        });
      }
    },
    // 单选框选中数据
    handleDetailSelectionChangeOne(selection) {
      this.checkedDetailOne = selection;
    },
    rowClassNameTwo({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    onAddItemTwo() {
      this.tableDataTwo.push({
        contactName: "",
        contactJob: "",
        contactPhone: "",
        contactEmail: "",
      });
    },
    handleDeleteBtnTwo() {
      if (this.checkedDetailTwo.length == 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.$confirm("请是否确认删除该属性?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              let val = this.checkedDetailTwo; //checkedDetail为表格多选选中的数组
              val.forEach((val, index) => {
                this.tableDataTwo.forEach((v, i) => {
                  if (val.xh === v.xh) {
                    this.tableData.splice(i, 1);
                  }
                });
              });
              this.$message({
                message: "删除成功，记得保存修改喔！",
                type: "success",
              });
              this.$refs.tb.clearSelection();
              return;
            } else {
              this.$message({
                message: "已取消删除操作",
                type: "warning",
              });
              return;
            }
          },
        });
      }
    },
    // 单选框选中数据
    handleDetailSelectionChangeTwo(selection) {
      this.checkedDetailTwo = selection;
    },
  },
};
</script>

<style>
.el-font-size {
  font-size: 14px;
}
p {
  margin: 0;
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
.table-button {
  text-align: right;
  margin-bottom: 10px;
}
</style>
