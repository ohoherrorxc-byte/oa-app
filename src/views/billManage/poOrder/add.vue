<template>
  <div>
    <basic-container>
      <el-row>
        <el-col>PO订单申请</el-col>
      </el-row>
    </basic-container>
    <!-- 基本信息 -->
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
    <!--  订单明细-->
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>订单明细
          </p>
          <div class="table-button" v-if="false">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="onAddItem">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteBtn">删除</el-button>
          </div>
          <el-table
            :data="tableData"
            class="no-sticky"
            border="true"
            style="width: 100%"
            :row-class-name="rowClassName"
            @selection-change="handleDetailSelectionChange"
          >
            <!-- <el-table-column type="selection"> </el-table-column> -->
            <el-table-column label="序号" align="center" prop="xh" width="50" />
            <el-table-column label="零件名称">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.partsName" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零件编号">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.partsNo" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="车系">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.seriesName" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="销售币种" v-if="form.saleType == 3">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.currency" class="w-50 m-2" disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="销售价格">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.unitPrice" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="是否含税">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-select
                    v-model="scope.row.includeTax"
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
            <el-table-column label="税率">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.taxRate" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="税费">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.taxAmount" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="销售总单价">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.unitPriceTax" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="激活数">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.licenseNum" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="销售总价">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input v-model="scope.row.totalPrice" class="w-50 m-2" placeholder disabled />
                </div>
              </template>
            </el-table-column>
          </el-table>
<!--          <p class="text-r mt20">销售总额 ： {{ $formatAmt(form.orderTotalAmount)}}</p>-->
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
    <!-- 客户信息 -->
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title">
            <span></span>客户信息
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
<!--    <el-row>-->
<!--      <el-col :span="24">-->
<!--        <basic-container>-->
<!--          <p class="table-title">-->
<!--            <span></span>其他信息-->
<!--          </p>-->
<!--          <avue-form ref="formc" :option="optionc" v-model="form" @submit="handleSubmit">-->
<!--            <template slot="attachmentListSlot">-->
<!--              <Upload-->
<!--                @handleChange="handleSelect"-->
<!--                :showFileList="true"-->
<!--                :fileList="attachmentList"-->
<!--                btnName="选取文件"-->
<!--              ></Upload>-->
<!--            </template>-->
<!--            <template slot="menuForm">-->
<!--              <div>-->
<!--                &lt;!&ndash; <el-button-->
<!--                  type="primary"-->
<!--                  icon="el-icon-check"-->
<!--                  :loading="disabled"-->
<!--                  plain-->
<!--                  @click="handleSubmit"-->
<!--                >提交</el-button>&ndash;&gt;-->
<!--              </div>-->
<!--            </template>-->
<!--          </avue-form>-->
<!--        </basic-container>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  SellAdd,
  contractCustomer,
  importSaleContractWord,
} from "@/api/contract/contractSellAdd";
import { ContractCustomerDetail } from "@/api/contract/contractCustomer";
import { detail } from "@/api/billManage/poOrder";
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
            span: 24,
            prop: "orderName",
            disabled: true,
            placeholder: " ",
            rules: [
              {
                required: true,
                message: "标题不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            label: "月份",
            prop: "order",
            type: "monthrange",
            span: 24,
            format: "yyyy-MM",
            valueFormat: "yyyy-MM",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "申请人",
            span: 12,
            prop: "applyPersonName",
            dicUrl: "/api/oa-user/user-list",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "申请部门",
            span: 12,
            prop: "applyDeptName",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "申请日期",
            span: 12,
            prop: "applyDate",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "申请编号",
            span: 12,
            prop: "orderNo",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "textarea",
            label: "订单说明",
            span: 24,
            prop: "orderDetail",
            disabled: true,
            placeholder: " ",
            rules: [
              {
                pattern: /^.{0,255}$/,
                message: "不能超过255个字符",
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
      optionb: {
        column: [
          {
            type: "select",
            label: "销售类型",
            span: 24,
            prop: "saleType",
            allowCreate: true,
            filterable: true,
            // dicUrl: "/api/oa-portal/contractCustomer/selectList",
            disabled: true,
            placeholder: " ",
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
          },
          {
            type: "select",
            label: "相关销售合同",
            disabled: true,
            placeholder: " ",
            dicUrl: "/api/oa-portal/salesContractNew/selectList",
            props: {
              label: "titleName",
              value: "id",
            },
            span: 12,
            prop: "salesContractId",
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
            label: "销售合同编号",
            span: 12,
            prop: "salesContractNo",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "销售合同金额",
            span: 12,
            prop: "salesContractAmount",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "汇率",
            span: 12,
            prop: "exchangeRate",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "币种",
            span: 12,
            prop: "currency",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "税率",
            span: 12,
            prop: "taxRate",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "PO订单金额(原币)",
            span: 12,
            prop: "orderTotalAmount",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "input",
            label: "PO订单金额(人民币)",
            span: 12,
            prop: "orderTotalAmountRmb",
            disabled: true,
            placeholder: " ",
          },
          {
            type: "select",
            label: "客户名称",
            disabled: true,
            placeholder: " ",
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
          {
            type: "select",
            label: "相关项目",
            disabled: true,
            placeholder: " ",
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
      this.tableData = data.salesOrderDetailList;
      this.form.order = [data.orderStartMonth, data.orderEndMonth];
      if (this.form.custId) {
        ContractCustomerDetail(this.form.custId).then((res) => {
          if (res.data.code == 0) {
            this.tbCustContactList = res.data.data.tbCustContactList;
          }
        });
      }

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
      const { id } = this.$route.query;
      selectList().then((res) => {
        this.selectListOption = res.data.data;
      });
      contractCustomer().then((res) => {
        this.contractCustomerOption = res.data.data;
      });
      getOptions({ code: "SALE_TYPE" }).then((res) => {
        this.saleTypeList = res.data.data;
      });
      detail({ id }).then((res) => {
        this.showDetail(res.data.data);
      });
    },
  },
  created() {
    this.initData();
    // this.form.Date = new Date().Format("yyyy-MM-dd HH:mm:ss");
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
