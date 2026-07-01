<template>
  <div>
    <basic-container>
      <el-row type="flex" justify="space-between">
        <el-col class="mt5 mr10">销售合同申请</el-col>
        <el-col class="text-r" v-if="!queryId">
          <!-- <span class="mt5 mr10">自动识别：</span> -->
          <Upload @handleRequest="handleRequest" btnName="OCR识别"></Upload>
        </el-col>
      </el-row>
    </basic-container>
    <!-- 销售类型 -->
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>销售类型
          </p>
          <avue-form ref="form" :option="option" v-model="form">
            <template slot="saleType">
              <el-radio-group v-model="form.saleType" size="mini">
                <el-radio
                  :disabled="item.dictKey == 1 || item.dictKey == 4"
                  :label="item.dictKey"
                  border
                  v-for="item in saleTypeList"
                  :key="item.dictKey"
                >{{ item.dictValue }}</el-radio>
              </el-radio-group>
            </template>
          </avue-form>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>基本信息
          </p>
          <avue-form ref="forma" :option="optiona" v-model="form"></avue-form>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>合同信息
          </p>
          <avue-form ref="formb" :option="optionb" v-model="form"></avue-form>
        </basic-container>
      </el-col>
    </el-row>
    <!--  合同明细-->
    <el-row v-if="false">
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>合同明细
          </p>
          <div class="table-button" v-if="false">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="onAddItem">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteBtn">删除</el-button>
          </div>+
          <el-table
            :data="tableData"
            class="no-sticky"
            border="true"
            style="width: 100%"
            :row-class-name="rowClassName"
            @selection-change="handleDetailSelectionChange"
          >
            <!-- <el-table-column type="selection"> </el-table-column> -->
            <!-- <el-table-column label="序号" align="center" prop="xh" width="50" /> -->
            <el-table-column label="品名">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-if="form.saleType == 2"
                    v-model="scope.row.productName"
                    class="w-50 m-2"
                    placeholder
                  />
                  <el-select
                    v-if="form.saleType == 3"
                    v-model="scope.row.bomId"
                    placeholder="请选择bom名称"
                    @change="bomChange"
                    disabled
                  >
                    <el-option
                      v-for="item in selectListOption"
                      :key="item.id"
                      :label="item.bomName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="车型名称" v-if="form.saleType == 3">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.modelName" class="w-50 m-2" disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="详述及技术性能">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.detailTechPerform"
                    class="w-50 m-2"
                    placeholder
                    disabled
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单位">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.unit" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.unitPrice" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.amount" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="是否含税">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-select
                    v-model="scope.row.isIncludeTax"
                    class="m-2"
                    placeholder="Select"
                    disabled
                  >
                    <el-option
                      v-for="item in optionsa"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="汇率">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.exchangeRate" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="税率">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.taxRate" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="销售价格">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.salesPrice" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </basic-container>
      </el-col>
    </el-row>
    <!-- 收款明细 -->
    <el-row v-if="false">
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>收款明细
          </p>
          <div class="table-button">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="onAddItemOne">添加</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteBtnOne"
            >删除</el-button>
          </div>

          <el-table
            class="no-sticky"
            :data="tableDataOne"
            border="true"
            style="width: 100%"
            :row-class-name="rowClassNameOne"
            @selection-change="handleDetailSelectionChangeOne"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="序号" align="center" prop="xh" width="50" />
            <el-table-column label="预计收款日期">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-date-picker
                    v-model="scope.row.expectReceiveDate"
                    type="date"
                    placeholder="Pick a day"
                    size="default"
                    format="yyyy-MM-dd hh:mm:ss"
                    value-format="yyyy-MM-dd hh:mm:ss"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="收款比例">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.receiveProportion" class="w-50 m-2" placeholder />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="收款金额">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.receiveAmount" class="w-50 m-2" placeholder />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.remark" class="w-50 m-2" placeholder />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </basic-container>
      </el-col>
    </el-row>
    <!-- 联系人信息 -->
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>联系人信息
          </p>
          <div class="table-button" v-if="false">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="onAddItemTwo">添加</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteBtnTwo"
            >删除</el-button>
          </div>

          <el-table
            :data="tbCustContactList"
            class="no-sticky"
            border="true"
            style="width: 100%"
            :row-class-name="rowClassNameTwo"
            @selection-change="handleDetailSelectionChangeTwo"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="序号" align="center" prop="xh" width="50" />
            <el-table-column label="客户联系人">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.contactName" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="联系人职位">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.contactPost" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="联系人电话">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.contactTel" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="客户联系人邮箱">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.contactEmail" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </basic-container>
      </el-col>
    </el-row>
    <!-- 其他信息 -->
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>其他信息
          </p>
          <avue-form ref="formc" :option="optionc" v-model="form" @submit="handleSubmit">
            <template slot="attachmentListSlot">
              <Upload
                @handleChange="handleSelect"
                :showFileList="true"
                :fileList="attachmentList"
                btnName="选取文件"
              ></Upload>
            </template>
            <template slot="menuForm">
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  :loading="disabled"
                  plain
                  @click="handleSubmit"
                >提交</el-button>
              </div>
            </template>
          </avue-form>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  SellAdd,
  SellGetDetail,
  upload,
  contractCustomer,
  importSaleContractWord,
} from "@/api/contract/contractSellAdd";
import { selectList } from "@/api/contract/bomMaint";
import { getOptions } from "@/api/base";
import { validateForm } from "@/util/validate";
import Upload from "@/components/upload/";
export default {
  components: {
    Upload,
  },
  name: "contractSellAdd",
  data() {
    return {
      saleTypeList: [],
      queryId: this.$route.query.id,
      contractCustomerOption: [],
      selectListOption: [],
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      form: {},
      option: {
        column: [
          {
            label: "销售类型",
            span: 12,
            formslot: true,
            prop: "saleType",
            value: "3",
            rules: [
              {
                required: true,
                message: "销售类型不能为空",
              },
            ],
          },
        ],
        labelPosition: "left",
        labelWidth: 100,
        gutter: 100,
        menuBtn: false,
        submitBtn: false,
        submitText: "验证文件",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
      },
      optiona: {
        column: [
          {
            type: "input",
            label: "标题",
            span: 12,
            prop: "contractName",
            rules: [
              {
                required: true,
                message: "标题不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "textarea",
            label: "申请说明",
            span: 12,
            prop: "contractApplyDesc",
            // rules: [
            //   {
            //     pattern: /^.{0,255}$/,
            //     message: "不能超过255个字符",
            //   },
            // ],
          },
          // {
          //   type: "select",
          //   label: "申请人",
          //   allowCreate: true,
          //   filterable: true,
          //   span: 12,
          //   prop: "applyPerson",
          //   dicUrl: "/api/oa-user/user-list",
          //   props: {
          //     label: "name",
          //     value: "id",
          //   },
          // },
          // {
          //   type: "select",
          //   label: "申请部门",
          //   allowCreate: true,
          //   filterable: true,
          //   span: 12,
          //   prop: "applyDept",
          //   dicUrl: `/api/oa-system/dept/tree?tenantId=${
          //     JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
          //   }`,
          //   props: {
          //     label: "title",
          //     value: "id",
          //   },
          // },
          // {
          //   type: "input",
          //   label: "申请日期",
          //   disabled: true,
          //   span: 12,
          //   prop: "applyDate",
          //   value: new Date().Format("yyyy-MM-dd"),
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          // {
          //   type: "input",
          //   label: "申请编号",
          //   disabled: true,
          //   span: 12,
          //   prop: "contractNo",
          //   placeholder: " ",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          // {
          //   type: "select",
          //   label: "币种",
          //   dicUrl: "/api/oa-system/dict/dictionary?code=CURRENCY",
          //   props: {
          //     label: "dictValue",
          //     value: "dictKey",
          //   },
          //   dataType: "string",
          //   span: 12,
          //   prop: "currency",
          //   placeholder: "请选择 币种",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       //trigger: "blur"
          //     },
          //   ],
          // },
          // {
          //   type: "input",
          //   label: "税率",
          //   span: 12,
          //   prop: "taxRate",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          // {
          //   type: "input",
          //   label: "合同金额(原币)",
          //   span: 12,
          //   prop: "amountTotalOriginal",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          // {
          //   type: "input",
          //   label: "合同金额(人民币)",
          //   span: 12,
          //   prop: "amountTotalRmb",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
        ],
        labelPosition: "left",
        labelWidth: 100,
        gutter: 100,
        menuBtn: false,
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
          // {
          //   type: "input",
          //   label: "汇率",
          //   span: 12,
          //   prop: "exchangeRate",
          //   slot: true,
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          {
            type: "select",
            label: "客户名称",
            span: 12,
            prop: "custId",
            allowCreate: true,
            filterable: true,
            dicUrl: "/api/oa-portal/contractCustomer/selectList",
            props: {
              label: "custName",
              value: "id",
            },
            rules: [
              {
                required: true,
                message: "不能为空",
                trigger: ["blur", "change"],
              },
            ],
            change: ({ value }) => {
              this.contractCustomerOption.forEach((item) => {
                if (item.id === value) {
                  this.tbCustContactList = item.tbCustContactList;
                }
              });
            },
          },
          // {
          //   type: "select",
          //   label: "收款方式",
          //   dicUrl: "/api/oa-system/dict/dictionary?code=PAY_METHOD",
          //   props: {
          //     label: "dictValue",
          //     value: "dictKey",
          //   },
          //   dataType: "number",
          //   span: 12,
          //   prop: "payMethod",
          //   placeholder: "请选择方式",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       //trigger: "blur"
          //     },
          //   ],
          // },
          // {
          //   type: "input",
          //   label: "合同金额",
          //   span: 12,
          //   prop: "amountTotalOriginal",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          // {
          //   type: "date",
          //   label: "合同开始日期",
          //   span: 12,
          //   prop: "contractBeginTime",
          //   format: "yyyy-MM-dd hh:mm:ss",
          //   valueFormat: "yyyy-MM-dd hh:mm:ss",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          // {
          //   type: "date",
          //   label: "合同结束日期",
          //   span: 12,
          //   prop: "contractEndTime",
          //   format: "yyyy-MM-dd hh:mm:ss",
          //   valueFormat: "yyyy-MM-dd hh:mm:ss",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          {
            type: "daterange",
            label: "合同周期",
            span: 12,
            prop: "contractTime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            // rules: [
            //   {
            //     required: true,
            //     message: "不能为空",
            //     trigger: "blur",
            //   },
            // ],
          },
          {
            type: "date",
            label: "合同实施日期",
            span: 12,
            prop: "implementationTime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          // {
          //   type: "select",
          //   label: "会签部门",
          //   allowCreate: true,
          //   filterable: true,
          //   span: 12,
          //   prop: "counterSignDepartment",
          //   dicUrl: `/api/oa-system/dept/tree?tenantId=${
          //     JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
          //   }`,
          //   props: {
          //     label: "title",
          //     value: "id",
          //   },
          // },
          {
            type: "select",
            label: "相关项目",
            allowCreate: true,
            filterable: true,
            span: 12,
            prop: "projectId",
            dicUrl: `/api/oa-portal/contractProject/selectList`,
            props: {
              label: "projectName",
              value: "id",
            },
          },
          // {
          //   type: "select",
          //   label: "合同类型",
          //   dicUrl: "/api/oa-system/dict/dictionary?code=CONTRACT_CATEGORY",
          //   props: {
          //     label: "dictValue",
          //     value: "dictKey",
          //   },
          //   dataType: "number",
          //   span: 12,
          //   prop: "contractType",
          //   placeholder: "请选择合同",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       //trigger: "blur"
          //     },
          //   ],
          // // },
          // {
          //   type: "select",
          //   label: "合同类别",
          //   dicUrl: "/api/oa-system/dict/dictionary?code=CONTRACT_TYPE",
          //   props: {
          //     label: "dictValue",
          //     value: "dictKey",
          //   },
          //   dataType: "number",
          //   span: 12,
          //   prop: "contractCategory",
          //   placeholder: "请选择合同",
          //   rules: [
          //     {
          //       required: false,
          //       message: "不能为空",
          //       //trigger: "blur"
          //     },
          //   ],
          // },

          {
            type: "input",
            label: "合同履行地点",
            span: 12,
            prop: "contractPerformancePlace",
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
        labelWidth: 100,
        gutter: 100,
        menuBtn: false,
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
            label: "合同文本",
            prop: "attachmentListSlot",
          },
          {
            type: "textarea",
            label: "备注",
            span: 24,
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
      attribute: [],
      tableData: [
        {
          bomId: "",
          productName: "",
          detailTechPerform: "",
          unit: "",
          unitPrice: "",
          amount: "",
          isIncludeTax: "",
          salesPrice: "",
        },
      ], //合同明细
      optionsa: [
        {
          value: 0,
          label: "否",
        },
        {
          value: 1,
          label: "是",
        },
      ],
      checkedDetail: [],
      tableDataOne: [
        {
          expectReceiveDate: "",
          receiveProportion: "",
          receiveAmount: "",
          remark: "",
        },
      ],
      attachmentList: [],
      tbCustContactList: [],
      checkedDetailOne: [],
      checkedDetailTwo: [],
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    ...mapState(["user"]),
  },
  methods: {
    showDetail(data) {
      this.form = data;
      this.form.saleType = data.saleType + "";
      this.form.contractTime = [data.contractBeginTime, data.contractEndTime];
      this.tableData = data.tbSaleContractDetailList;
      this.attachmentList = data.attachmentList || [];
      this.tableDataOne = data.tbSaleContractReceiveDetailList;
      this.tbCustContactList = data.tbSaleContractCustList;
      this.tableData.forEach((item) => {
        item.bomId ? item.bomId + "" : "";
      });
    },
    handleRequest(data) {
      const { link } = data;
      importSaleContractWord({ link }).then((res) => {
        const { data, code } = res.data;
        if (code === 0) {
          this.showDetail(data);
          this.$message(res.message);
        }
      });
    },
    bomChange() {
      this.selectListOption.forEach((option) => {
        this.tableData.forEach((table) => {
          if (option.id === table.bomId) {
            table.modelName = option.modelName;
            table.unitPrice = option.unitPrice;
            table.amount = option.amount;
            table.salesPrice = option.salesPrice;
          }
        });
      });
    },
    handleChange(val) {
      window.console.log(val);
    },
    handleSubmit() {
      validateForm(this, ["form", "forma", "formb", "formc"], () => {
        let form = this.form;
        form["tbSaleContractDetailList"] = this.tableData;
        form["tbSaleContractReceiveDetailList"] = this.tableDataOne;
        form["createUser"] = this.userInfo.content.user_id;
        form["contractBeginTime"] = form.contractTime[0];
        form["contractEndTime"] = form.contractTime[1];

        SellAdd(form).then(
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

    handleSelect(dataList) {
      this.form.attachmentList = dataList;
    },
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    onAddItem() {
      this.tableData.push({
        bomId: "",
        productName: "",
        detailTechPerform: "",
        unit: "",
        unitPrice: "",
        amount: "",
        isIncludeTax: "",
        salesPrice: "",
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
        expectReceiveDate: "",
        receiveProportion: "",
        receiveAmount: "",
        remark: "",
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
      this.tbCustContactList.push({
        custContact: "",
        custPosition: "",
        contactTel: "",
        email: "",
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
                this.tbCustContactList.forEach((v, i) => {
                  if (val.xh === v.xh) {
                    this.tbCustContactList.splice(i, 1);
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
    initData() {
      selectList().then((res) => {
        this.selectListOption = res.data.data;
      });
      contractCustomer().then((res) => {
        this.contractCustomerOption = res.data.data;
      });
      getOptions({ code: "SALE_TYPE" }).then((res) => {
        this.saleTypeList = res.data.data;
      });
    },
  },
  created() {
    this.initData();
    // this.form.Date = new Date().Format("yyyy-MM-dd HH:mm:ss");
  },

  mounted() {
    let url = window.location.href;
    let obj = {};
    if (url.split("?")[1]) {
      url
        .split("?")[1]
        .split("&")
        .forEach((ele, index) => {
          obj[ele.split("=")[0]] = ele.split("=")[1];
        });
      if (obj.id) {
        SellGetDetail(obj.id).then(
          (res) => {
            if (res.data.code == 0) {
              this.showDetail(res.data.data);
            }
          },
          (error) => {
            loading();
            window.console.log(error);
          }
        );
      }
    }
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
