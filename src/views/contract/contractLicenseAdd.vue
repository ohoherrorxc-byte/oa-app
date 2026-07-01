<template>
  <div>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>License付款订单</p>
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
          <p class="table-title"><span></span>合同明细</p>
          <div class="table-button" v-if="pageType != 'detail'">
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
            <el-table-column label="license类型">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    :disabled="pageType == 'detail'"
                    v-model="scope.row.licenseType"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="国家地区">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    :disabled="pageType == 'detail'"
                    v-model="scope.row.region"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="激活数量">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    :disabled="pageType == 'detail'"
                    v-model="scope.row.activedAmount"
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
                    :disabled="pageType == 'detail'"
                    v-model="scope.row.unitPrice"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="付款金额">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    :disabled="pageType == 'detail'"
                    v-model="scope.row.payAmount"
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
          <p class="table-title"><span></span>付款信息</p>
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
            <template slot="menuForm" v-if="pageType != 'detail'">
              <div>
                <!-- <el-button type="primary" icon="el-icon-check" :loading="disabled"  plain @click="$refs.forma.submit(),$refs.formb.submit(),$refs.formc.submit()">
                        提交
                    </el-button> -->
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  :loading="disabled"
                  plain
                  @click="submit"
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
  licensePurchaseOrderAdd,
  upload,
  licensePurchaseOrderDetail,
} from "@/api/contract/contractSellAdd";
import constData from "@/config/constData";

export default {
  name: "contractLicenseAdd",
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
            prop: "contractName",
            disabled: this.$route.query.type == "detail",
            rules: [
              {
                required: true,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "归档号",
            span: 24,
            disabled: this.$route.query.type == "detail",
            dicUrl: "/api/oa-portal/contractLicense/list",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            dataType: "number",
            prop: "contractNUmber",
            placeholder: "请选择方式",
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
            disabled: true,
            placeholder: " ",
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
            type: "input",
            label: "申请金额(原币)",
            span: 12,
            disabled: this.$route.query.type == "detail",
            prop: "sumMoneyOriginal",
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
            disabled: this.$route.query.type == "detail",
            prop: "sumMoneyOriginalUpper",
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
            label: "申请金额(人民币)",
            span: 12,
            disabled: this.$route.query.type == "detail",
            prop: "sumMoneyRmb",
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
            disabled: this.$route.query.type == "detail",
            prop: "sumMoneyRmbUpper",
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
            disabled: this.$route.query.type == "detail",
            prop: "applyDesc",
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
            type: "table",
            label: "供应商名称",
            disabled: this.$route.query.type == "detail",
            span: 24,
            prop: "supplierId",
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
            type: "input",
            label: "银行开户行",
            disabled: this.$route.query.type == "detail",
            span: 12,
            prop: "bankName",
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
            label: "银行账户",
            disabled: this.$route.query.type == "detail",
            span: 12,
            prop: "bankAccount",
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
            label: "相关申请",
            span: 12,
            prop: "meetingSheet",
            disabled: this.$route.query.type == "detail",
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
            prop: "uploadUrl",
            disabled: this.$route.query.type == "detail",
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
            disabled: this.$route.query.type == "detail",
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
      structure: [
        {
          name: "name",
          type: "input",
          label: "品名",
          required: false,
        },
        {
          name: "originalprice",
          type: "input",
          label: "详述及技术性能",
          required: false,
        },
        {
          name: "originalprice",
          type: "input",
          label: "单位",
          required: false,
        },
        {
          name: "originalprice",
          type: "input",
          label: "单价",
          required: false,
        },
        {
          name: "originalprice",
          type: "input",
          label: "数量",
          required: false,
        },
        {
          name: "select",
          type: "slot",
          label: "是否含税",
          required: false,
        },
        {
          name: "originalprice",
          type: "input",
          label: "销售价格",
          required: false,
        },
      ],
      tableData: [
        {
          licenseType: "",
          region: "",
          activedAmount: "",
          unitPrice: "",
          payAmount: "",
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
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
      pageType: "",
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    const { type, id } = this.$route.query;
    this.pageType = type;
    if (type && id) this.getDetail(id);
  },
  methods: {
    getDetail(id) {
      licensePurchaseOrderDetail({ id }).then((res) => {
        const { code, data } = res.data;
        if (code === 0) {
          this.form = data;
        }
      });
    },
    handleChange(val) {
      window.console.log(val);
    },
    submit() {
      const arr = ["a", "b", "c"],
        pArr = [];
      let result = null;
      arr.forEach((item) => {
        result = new Promise((resolve, reject) => {
          this.$refs["form" + item].validate((valid, done, msg) => {
            if (valid) {
              done();
              resolve();
            }
          });
        });
        pArr.push(result);
      });
      Promise.all(pArr).then((res) => this.handleSubmit());
    },
    handleSubmit() {
      const form = this.form;
      const { type, id } = this.$route.query;
      if (id && type) form["id"] = id;
      form["tbPurchaseOrderLicenseInfoList"] = this.tableData;
      form["createUser"] = this.userInfo.content.user_id;
      form["addType"] = 2;

      licensePurchaseOrderAdd(form).then(
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
        licenseType: "",
        region: "",
        activedAmount: "",
        unitPrice: "",
        payAmount: "",
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
