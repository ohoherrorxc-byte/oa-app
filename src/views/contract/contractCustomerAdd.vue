<template>
  <div>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>{{ $t('contractCustomerAdd.customerManagement') }}</p>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p class="table-title"><span></span>{{ $t('contractCustomer.customerInfo') }}</p>
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
          <p class="table-title"><span></span>{{ $t('contractCustomerAdd.contactInfo') }}</p>
          <div class="table-button">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="onAddItem"
              >{{ $t('commonContent.add') }}</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteBtn"
              >{{ $t('commonContent.delete') }}</el-button
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
            <el-table-column :label="$t('commonContent.serialNumber')" align="center" prop="xh" width="50" />
            <el-table-column :label="$t('contractCustomerAdd.contactName')">
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
            <el-table-column :label="$t('contractCustomerAdd.contactPost')">
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
            <el-table-column :label="$t('contractCustomerAdd.contactTel')">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="scope.row.contactTel"
                    class="w-50 m-2"
                    placeholder=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('contractCustomerAdd.contactEmail')">
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
          <p class="table-title"><span></span>{{ $t('contractCustomerAdd.otherInfo') }}</p>
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
                <el-button slot="trigger" type="primary">{{ $t('commonContent.selectFile') }}</el-button>
              </el-upload>
            </template>
            <template slot="menuForm">
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  :loading="disabled"
                  plain
                  @click="$refs.forma.submit(), $refs.formc.submit()">
                  {{ $t('commonContent.submit') }}
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
import { BOMGetDetail, upload } from "@/api/contract/contractSellAdd";
import constData from "@/config/constData";
import {
  saveOrUpdateCust,
  ContractCustomerDetail,
} from "@/api/contract/contractCustomer";

export default {
  name: "contractBOMAdd",
  data() {
    return {
      activeNames: ["1", "2", "3", "5"],
      logActiveNames: ["28"],
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      form: {},
      optiona: {
        column: [
          {
            type: "input",
            label: this.$t('contractCustomer.customerName'),
            span: 12,
            prop: "custName",
            rules: [
              {
                required: true,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.customerNo'),
            span: 12,
            prop: "custNo",
            slot: true,
            placeholder: " ",
            rules: [
              {
                required: false,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.countryReginCode'),
            placeholder: " ",
            span: 12,
            prop: "region",
            rules: [
              {
                required: false,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.industry'),
            span: 12,
            prop: "industry",
            rules: [
              {
                required: false,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.customerGrade'),
            span: 12,
            prop: "custGrade",
            placeholder: " ",
            rules: [
              {
                required: false,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.openBank'),
            span: 12,
            prop: "openBank",
            placeholder: "",
            rules: [
              {
                required: true,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur"
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.bankAccount'),
            span: 12,
            prop: "bankAccount",
            placeholder: "",
            rules: [
              {
                required: true,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur"
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.customerAddr'),
            span: 12,
            prop: "custAddr",
            placeholder: "",
            rules: [
              {
                required: true,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur"
              },
            ],
          },
          {
            type: "input",
            label: "FAX",
            span: 12,
            prop: "fax",
            placeholder: "",
            rules: [
              {
                required: false,
                message: this.$t('commonContent.cannotBeEmpty'),
                //trigger: "blur"
              },
            ],
          },
          {
            type: "input",
            label: "IEC",
            span: 12,
            prop: "iec",
            placeholder: "",
            rules: [
              {
                required: false,
                message: this.$t('commonContent.cannotBeEmpty'),
                //trigger: "blur"
              },
            ],
          },
          {
            type: "input",
            label: this.$t('contractCustomer.taxpayerIdentityNumber'),
            span: 24,
            prop: "taxpayerIdentityNumber",
            placeholder: "",
            rules: [
              {
                required: true,
                message: this.$t('commonContent.cannotBeEmpty'),
                trigger: "blur"
              },
            ],
          },
        ],
        labelPosition: "left",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        submitText: this.$t('commonContent.verifyFile'),
        emptyBtn: false,
        emptyText: this.$t('commonContent.clear'),
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
      },
      optionc: {
        column: [
          {
            type: "textarea",
            label: this.$t('commonContent.description'),
            span: 24,
            minRows: 9,
            prop: "remark",
            rules: [
              {
                pattern: /^.{0,255}$/,
                message: this.$t('commonContent.cannotExceed255Characters'),
              },
            ],
          },
        ],
        labelPosition: "left",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        submitText: this.$t('commonContent.verifyFile'),
        emptyBtn: false,
        emptyText: this.$t('commonContent.clear'),
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
      },
      attribute: [],
      tableData: [
        {
          contractId: "",
          partsId: "",
          partsNAME: "",
          amount: "",
          remark: "",
        },
      ], //合同明细
      checkedDetail: [],
      supplierList: {},
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    handleChange(val) {
      window.console.log(val);
    },
    handleSubmit(form, done, loading) {
      console.log(done)
      if(!form.custName||!form.openBank||!form.bankAccount||!form.taxpayerIdentityNumber){
        return
      }
      form["tbCustContactList"] = this.tableData;
      form["addType"] = 1;
      form["createUser"] = this.userInfo.content.user_id;
      console.log("val", form);
      saveOrUpdateCust(form).then(
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
        contractId: "",
        partsId: "",
        partsNAME: "",
        amount: "",
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
  },
  created() {},
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
        ContractCustomerDetail(obj.id).then(
          (res) => {
            if (res.data.code == 0) {
              this.form = res.data.data;
              this.form.supplierId = JSON.stringify(this.form.supplierId);
              this.tableData = res.data.data.tbCustContactList;
            }
            done();
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
