<template>
  <div>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>一般通用采购合同评审</p>
        </basic-container>
      </el-col>
    </el-row>
    <basic-container v-if="!queryId">
      <el-row>
        <el-col :span="6">
          <Upload @handleRequest="handleRequest" btnName="选取文件"> </Upload>
        </el-col>
      </el-row>
    </basic-container>
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
          <p class="table-title"><span></span>合同明细</p>
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
            <el-table-column label="相关项目">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.name"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="成本中心">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.costCenter"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="预算科目">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.budgetItems"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="预算信息">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.budgetInfo"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="品名">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.productName"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="详述及技术性能">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.detailTechPerform"
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
            <el-table-column label="数量">
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
            <el-table-column label="采购价格(原币)">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.purchasePriceOriginal"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="采购价格(人民币)">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.purchasePriceRmb"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实际价格(原币)">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.actualPriceOriginal"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实际价格(人民币)">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.actualPriceRmb"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="价格差异(原币)">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.priceDiffOriginal"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="价格差异(人民币)">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.priceDiffRmb"
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
  generalAdd,
  GeneralGetDetail,
  getList,
  getAllList,
  upload,
  importPurchaseContractWord,
} from "@/api/contract/contractSellAdd";
import constData from "@/config/constData";
import Upload from "@/components/upload/";

export default {
  components: {
    Upload,
  },
  name: "contractGeneralAdd",
  data() {
    return {
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      form: {},
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      optiona: {
        column: [
          {
            type: "input",
            label: "标题",
            span: 24,
            prop: "contractName",
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
            placeholder: " ",
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
            label: "申请日期",
            span: 12,
            prop: "Date",
            disabled: true,
            value: JSON.stringify(new Date().Format("yyyy-MM-dd HH:mm:ss")),
            placeholder: "",
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
            prop: "DateNumber",
            disabled: true,
            placeholder: " ",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "timestamp",
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
            label: "汇率",
            span: 12,
            prop: "taxRate",
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
            label: "合同金额(原币)",
            span: 12,
            prop: "cumulativeAcceptAmountOriginal",
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
            label: "金额大写(原币)",
            span: 12,
            prop: "cumulativeAcceptAmountOriginalUpper",
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
            label: "合同金额(人民币)",
            span: 12,
            prop: "cumulativeAcceptAmountRmb",
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
            label: "金额大写(人民币)",
            span: 12,
            prop: "cumulativeAcceptAmountRmbUpper",
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
            label: "申请事由",
            span: 24,
            minRows: 9,
            prop: "contractApplyDesc",
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
            type: "date",
            label: "合同开始日期",
            span: 12,
            prop: "contractBeginTime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "date",
            label: "合同结束日期",
            span: 12,
            prop: "contractEndTime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
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
            label: "采购申请单",
            span: 12,
            prop: "purchaseRequisition",
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
            type: "input",
            label: "采购申请编号",
            span: 12,
            prop: "purchaseApplyNo",
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
            label: "采购申请金额(原币)",
            span: 12,
            prop: "purchaseApplyAmountOriginal",
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
            label: "采购申请金额(RMB)",
            span: 12,
            prop: "purchaseApplyAmountRmb",
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
            label: "会签部门",
            span: 24,
            prop: "counterSignDepartment",
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
            label: "合同类型",
            dicUrl: "/api/oa-system/dict/dictionary?code=CONTRACT_CATEGORY",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            span: 12,
            prop: "contractType",
            placeholder: "请选择合同",
            rules: [
              {
                required: false,
                message: "不能为空",
                //trigger: "blur"
              },
            ],
          },
          {
            type: "select",
            label: "合同类别",
            dicUrl: "/api/oa-system/dict/dictionary?code=CONTRACT_TYPE",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            span: 12,
            prop: "contractCategory",
            placeholder: "请选择合同",
            rules: [
              {
                required: false,
                message: "不能为空",
                //trigger: "blur"
              },
            ],
          },
          {
            type: "table",
            label: "供应商名称",
            span: 24,
            prop: "supplierId",
            value: this.supplierNum,
            children: {
              border: true,
              column: [
                {
                  label: "申请日期",
                  prop: "applyTime",
                },
                {
                  label: "供应商说明",
                  prop: "supplierDesc",
                },
                {
                  label: "供应商名称",
                  prop: "supplierName",
                },
                {
                  label: "供应商编号",
                  prop: "supplierNo",
                },
                {
                  label: "供应商类型",
                  prop: "supplierType",
                },
                {
                  label: "联系人",
                  prop: "contactPerson",
                },
                {
                  label: "联系电话",
                  prop: "contactNumber",
                },
                {
                  label: "开户行",
                  prop: "openBank",
                },
                {
                  label: "银行账号",
                  prop: "bankAccount",
                },
                {
                  label: "状态",
                  prop: "status",
                },
              ],
            },
            onLoad: ({ page, value, data }, callback) => {
              //首次加载去查询对应的值
              if (value) {
                let newList = [];
                this.supplierList.data.map((item, index) => {
                  if (item.id == value) {
                    newList.push(item);
                  }
                });
                callback(newList[0]);
                return;
              }
              if (data) {
              }
              if (page) {
                getList(page.currentPage, page.pageSize).then((res) => {
                  this.supplierList["data"] = res.data.data.records;
                  this.supplierList["total"] = res.data.data.total;
                  callback(this.supplierList);
                });
                return;
              }
              //分页查询信息
              //callback(this.supplierList)
            },
            props: {
              label: "supplierName",
              value: "id",
            },
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
            label: "支付方式",
            dicUrl: "/api/oa-system/dict/dictionary?code=PAY_METHOD",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            span: 12,
            prop: "payMethod",
            placeholder: "请选择方式",
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
            type: "input",
            label: "采购委员会决议单",
            span: 12,
            prop: "procurementCommitteeResolution",
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
            type: "upload",
            label: "相关附件",
            span: 24,
            showFileList: true,
            prop: "attachUrl",
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
          costCenter: "",
          budgetItems: "",
          budgetInfo: "",
          productName: "",
          detailTechPerform: "",
          unit: "",
          amount: "",
          purchasePriceOriginal: "",
          purchasePriceRmb: "",
          actualPriceOriginal: "",
          actualPriceRmb: "",
          priceDiffOriginal: "",
          priceDiffRmb: "",
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
      supplierList: {},
      supplierNum: "",
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    showDetail(data) {
      this.form = data;
      this.form.supplierId = JSON.stringify(this.form.supplierId);
      this.tableData = data.tbPurchaseContractDetailList;
    },
    handleRequest(data) {
      const { link } = data;
      importPurchaseContractWord({ link }).then((res) => {
        const { data, message, code } = res.data;
        if (code === 0) {
          console.log(data);
          this.showDetail(data);
          this.$message(res.message);
        }
      });
    },
    handleChange(val) {
      window.console.log(val);
    },
    getContractSupplierList(params) {
      getAllList(this.queryInfo.pageNum, this.queryInfo.pageSize, params).then(
        (res) => {
          this.supplierList["data"] = res.data.data;
          this.supplierList["total"] = res.data.data.length;
        }
      );
    },
    handleSubmit(form, done, loading) {
      form["tbPurchaseContractDetailList"] = this.tableData;
      form["addType"] = 0;
      form["createUser"] = this.userInfo.content.user_id;
      console.log("val", form);
      generalAdd(form).then(
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
          done();
        },
        (error) => {
          loading();
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
        costCenter: "",
        budgetItems: "",
        budgetInfo: "",
        productName: "",
        detailTechPerform: "",
        unit: "",
        amount: "",
        purchasePriceOriginal: "",
        purchasePriceRmb: "",
        actualPriceOriginal: "",
        actualPriceRmb: "",
        priceDiffOriginal: "",
        priceDiffRmb: "",
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
  },
  created() {
    this.getContractSupplierList({});
    this.form.Date = new Date().Format("yyyy-MM-dd HH:mm:ss");
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
        GeneralGetDetail(obj.id).then(
          (res) => {
            if (res.data.code == 0) {
              this.showDetail(res.data.data);
            }
          },
          (error) => {
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
