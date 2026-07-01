<template>
  <div>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>销售PO订单申请</p>
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
            :option="form.saleType != '3' ? optionb : optiond"
            v-model="form"
            @submit="handleSubmitTwo"
          ></avue-form>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container v-if="form.saleType != '3'">
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
            <el-table-column label="零件名称">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.partsName"
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
            <el-table-column label="区域">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.region"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="车型">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.vehicleModel"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="周期">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.cycle"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零件数量">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.partsNum"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工程车数量">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.engineVehicleNum"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="量产车数量">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.productVehicleNum"
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
            <el-table-column label="总价">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.totalPrice"
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
        <basic-container v-if="form.saleType == '3'">
          <p class="table-title"><span></span>订单明细</p>
          <!--  <div class="table-button">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="onAddItemOne">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteBtnOne">删除</el-button>
          </div>  -->
          <el-table
            :data="tableDataOne"
            border="true"
            style="width: 100%"
            :row-class-name="rowClassNameTwo"
            @selection-change="handleDetailSelectionChangeOne"
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column label="序号" align="center" prop="xh" width="50" />
            <el-table-column label="license类型">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.licensetype"
                    class="w-50 m-2"
                    placeholder=""
                    disabled
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="国家地区">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.country"
                    class="w-50 m-2"
                    placeholder=""
                    disabled
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="激活数量">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.activenumber"
                    class="w-50 m-2"
                    placeholder=""
                    disabled
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.unitprice"
                    class="w-50 m-2"
                    placeholder=""
                    disabled
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="收款金额">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.amountCollected"
                    class="w-50 m-2"
                    placeholder=""
                    disabled
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            :append-to-body="true"
            :visible.sync="needStatisticsDialogVisible"
            width="90%"
            @close="needStatisticsCancel()"
            center
          >
            <license></license>
          </el-dialog>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title"><span></span>客户信息</p>
          <div class="table-button">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="onAddItemTwo"
              >添加</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteBtnTwo"
              >删除</el-button
            >
          </div>
          <el-table
            :data="tableDataTwo"
            border="true"
            style="width: 100%"
            :row-class-name="rowClassNameOne"
            @selection-change="handleDetailSelectionChangeTwo"
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column label="序号" align="center" prop="xh" width="50" />
            <el-table-column label="联系人">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.contactName"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="联系人职位">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.contactPost"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="联系电话">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.contactTele"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="邮箱">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.contactEmail"
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
                <el-button slot="trigger"  type="primary"
                  >选取文件</el-button
                >
              </el-upload>
            </template>
            <template slot="menuForm">
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  :loading="disabled"                
                  plain
                  @click="handleSubmit"
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
  SaleOrderAdd,
  upload,
  SellGetDetail,
  getLicenseList,
} from "@/api/contract/contractSellAdd";
import { getListAllS } from "@/api/contract/saleContractManage";
import constData from "@/config/constData";
import license from "@/views/saic/license.vue";
import { validateForm } from "@/util/validate";
export default {
  name: "contractPOAdd",
  data() {
    return {
      licenseOptions: [],
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      form: {},
      optiona: {
        column: [
          {
            type: "input",
            label: "标题",
            span: 24,
            prop: "orderName",
            rules: [
              {
                required: true,
                message: "标题不能为空",
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
            label: "订单说明",
            span: 24,
            minRows: 9,
            prop: "orderDetail",
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
            type: "select",
            label: "销售类型",
            span: 24,
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
            label: "相关销售合同",
            placeholder: "请选择 相关销售合同",
            span: 12,
            dicUrl: "/api/oa-portal/saleContract/selectList",
            props: {
              label: "contractName",
              value: "id",
            },
            dataType: "string",
            virtualize: true,
            prop: "salesContractId",
            change: ({ value }) => {
              this.salesContractChange(value);
            },
          },

          {
            type: "input",
            label: "销售合同编号",
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
            label: "销售合同金额",
            span: 12,
            prop: "amountTotalOriginal",
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
            label: "汇率",
            span: 12,
            prop: "exchangeRate",
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
            disabled: true,
            span: 12,
            prop: "currency",
            placeholder: "请选择 币种",
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
            label: "PO订单金额(原币)",
            span: 12,
            prop: "amountExpected",
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
            label: "PO订单金额(人民币)",
            span: 12,
            prop: "amountExpected",
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
            label: "客户名称",
            span: 12,
            prop: "custName",
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
            label: "相关项目",
            span: 12,
            prop: "projectName",
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
      optiond: {
        column: [
          {
            type: "select",
            label: "销售类型",
            span: 24,
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
            label: "归档号",
            span: 24,
            dicUrl: "/api/oa-system/dict/dictionary?code=SALE_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            placeholder: "请选择类型",
            prop: "saleNumber",
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
            label: "相关销售合同",
            placeholder: "请选择 相关销售合同",
            span: 12,
            dicUrl: "/api/oa-portal/saleContract/selectList",
            props: {
              label: "contractName",
              value: "id",
            },
            dataType: "string",
            virtualize: true,
            prop: "salesContractId",
            change: ({ value }) => {
              this.salesContractChange(value);
            },
          },
          {
            type: "input",
            label: "销售合同编号",
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
            label: "销售合同金额",
            span: 12,
            prop: "amountTotalOriginal",
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
            label: "汇率",
            span: 12,
            prop: "exchangeRate",
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
            disabled: true,
            span: 12,
            prop: "currency",
            placeholder: "请选择 币种",
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
            label: "PO订单金额(原币)",
            span: 12,
            prop: "amountExpected",
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
            label: "PO订单金额(人民币)",
            span: 12,
            prop: "amountExpected",
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
            label: "客户名称",
            span: 12,
            prop: "custName",
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
            label: "相关项目",
            span: 12,
            prop: "projectName",
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
      tableData: [
        {
          partsName: "",
          partsNo: "",
          region: "",
          vehicleModel: "",
          cycle: "",
          partsNum: "",
          engineVehicleNum: "",
          productVehicleNum: "",
          unitPrice: "",
          totalPrice: "",
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
          contactPost: "",
          contactTele: "",
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
      needStatisticsDialogVisible: false,
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
    };
  },
  components: {
    license, //注册外部组件
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    this.getLicense();
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
    getListAll() {
      getListAllS().then((res) => {
        this.optionb.column.forEach((item) => {
          if (item.prop == "salesContractId") {
            item.dicData = res.data.data;
          }
        });
      });
    },
    handleChange(val) {
    },
    getLicense() {
      getLicenseList({ licenseOrderId: "" }).then((res) => {
        if (res.data.code == 0) {
          console.log(res.data);
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    handleSubmit() {
      validateForm(this, ["forma", "formb", "formc"], () => {
        let form = this.form;
        form["salesOrderDetailList"] = this.tableData;
        form["salesOrderCustList"] = this.tableDataTwo;
        form["createUser"] = this.userInfo.content.user_id;
        SaleOrderAdd(form).then(
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
      });
    },
    handleSubmitOne(form, done, loading) {
      console.log("val", form);
    },
    handleSubmitTwo(form, done, loading) {
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
        partsName: "",
        partsNo: "",
        region: "",
        vehicleModel: "",
        cycle: "",
        partsNum: "",
        engineVehicleNum: "",
        productVehicleNum: "",
        unitPrice: "",
        totalPrice: "",
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
      console.log("ss", this.form.licenseType);
      this.needStatisticsDialogVisible = true;
      //this.tableDataOne.push({
      //licensetype: '',
      //country: '',
      //activenumber: '',
      //unitprice: '',
      //amountCollected: '',
      //})
    },
    needStatisticsCancel() {
      this.needStatisticsDialogVisible = false;
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
                    this.tableDataOne.splice(i, 1);
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
        contactPost: "",
        contactTele: "",
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
                    this.tableDataTwo.splice(i, 1);
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
