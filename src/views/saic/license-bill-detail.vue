<template>
  <basic-container>
    <avue-form
      :defaults.sync="defaults"
      ref="form"
      :option="option"
      v-model="form"
      @submit="handleSubmit"
    >
      <template
        v-for="(item, index) in ['uploadUrl', 'invoiceUrl']"
        :slot="item"
        slot-scope="{ value }"
      >
        <el-link :href="value" type="primary" target="_blank">{{
          value ? value.substr(value.lastIndexOf("/") + 1) : ""
        }}</el-link>
      </template>

      <template slot="invoiceUrlUpload">
        <el-upload
          accept=".jpg,.zip"
          ref="upload"
          action=""
          multiple="false"
          limit="1"
          :before-upload="uploadBefore"
          :before-remove="beforeRemove"
          :http-request="handleUpload"
          :auto-upload="true"
        >
          <el-button slot="trigger" type="primary">选取文件</el-button>
        </el-upload>
      </template>

      <template slot="payment">
        <el-table :data.sync="tableData" border>
          <el-table-column align="center" type="index" width="100" label="No.">
          </el-table-column>
          <!--<el-table-column
            prop="id"
            label="No.">
          </el-table-column>-->
          <el-table-column align="center" label="付款金额">
            <template slot-scope="scope">
              {{
                scope.row.amount +
                " " +
                findByvalue(constData.currency, form.currency, "label")
              }}
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template slot="status">
        <!--收票中-->
        <el-checkbox
          v-model="checked4"
          @change="changeStatus"
          v-if="form.orderStatus === 3"
          >设置为已收票状态</el-checkbox
        >
        <!--已收票、付款中-->
        <el-checkbox
          v-model="checked6"
          @change="changeStatus"
          v-if="form.orderStatus === 4 || form.orderStatus === 6"
          :disabled="form.orderStatus === 6"
          >设置为已付款</el-checkbox
        >
        <!--已付款-->
        <dev v-else></dev>
      </template>

      <template slot-scope="{ disabled, type }" slot="menuForm">
        <div>
          <el-button
            type="primary"
            icon="el-icon-check"
            v-if="[4, 3].includes(form.orderStatus)"
            :disabled="
              (form.orderStatus === 3 && !checked4) ||
              (form.orderStatus === 4 && !checked6)
            "
            :loading="disabled"
            plain
            @click="$refs.form.submit()"
          >
            确定
          </el-button>
          <el-button
            icon="el-icon-check"
            :loading="disabled"
            plain
            @click="backToList"
          >
            返回
          </el-button>
          <el-button
            icon="el-icon-check"
            :loading="disabled"
            plain
            @click="handleAbandon"
            v-if="form.orderStatus === 3"
          >
            撤回到待收票
          </el-button>
        </div>
      </template>

      <template slot="waitforpayment">
        （剩余待付款金额：{{
          remainAmount +
          " " +
          findByvalue(constData.currency, form.currency, "label")
        }}）
      </template>

      <template slot="amountReal" slot-scope="{ value }">
        {{
          parseInt(value) +
          " " +
          findByvalue(constData.currency, form.currency, "label")
        }}
      </template>

      <template slot="receiptAmount" slot-scope="{ value }">
        {{
          value +
          " " +
          (value ? findByvalue(constData.currency, form.currency, "label") : "")
        }}
      </template>
    </avue-form>
  </basic-container>
</template>

<script>
import { getDetail, update, remove, upload } from "@/api/saic/license-order";
import { updateBatch } from "@/api/saic/license";
import { add, getList } from "@/api/saic/license-payment";
import constData from "@/config/constData";
import { findByvalue } from "@/util/util";

export default {
  name: "license-bill-detail",
  data() {
    let checkReceiptAmount = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error("只能输入数字"));
      } else if (parseFloat(value) <= 0) {
        callback(new Error("金额错误"));
      } else if (parseFloat(value) > this.remainAmount) {
        callback(new Error("本次付款金额不能大于剩余待付款金额"));
      } else {
        callback();
      }
    };

    let temp = true;
    return {
      constData,
      form: {},
      defaults: {},
      checked4: false,
      checked5: false,
      checked6: false,
      tableData: [],
      remainAmount: 0,
      option: {
        column: [],
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 160,
        gutter: 10,

        menuBtn: true,
        submitBtn: false,
        submitText: "提交",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "left",

        group: [
          {
            label: "订单信息",
            arrow: true,
            collapse: true,
            column: [
              {
                type: "input",
                label: "付款订单号（唯一）",
                span: 14,
                display: true,
                prop: "orderNumber",
                detail: true,
              },
              {
                type: "input",
                label: "发票附件",
                span: 14,
                detail: true,
                prop: "invoiceUrl",
              },
              {
                type: "input",
                label: "收票数据VinList",
                span: 14,
                detail: true,
                prop: "uploadUrl",
              },
              {
                type: "input",
                label: "收票License数量",
                span: 14,
                detail: true,
                prop: "licenseNumber",
              },
              /*{
                type: 'input',
                label: '订单总金额',
                span: 14,
                detail: true,
                prop: 'amountReal'
              },
              {
                type: 'input',
                label: '已付款金额',
                span: 14,
                detail: true,
                prop: 'receiptAmount'
              },*/
              {
                type: "select",
                label: "供应商类型",
                span: 14,
                detail: true,
                prop: "orderType",
                props: {
                  label: "name",
                  value: "value",
                },
                dicData: constData.orderType,
              },
              {
                type: "input",
                label: "供应商",
                span: 14,
                detail: true,
                prop: "supplierName",
              },
              {
                type: "select",
                label: "订单当前状态",
                span: 14,
                detail: true,
                prop: "orderStatus",
                dicData: constData.billStatus,
              },
              {
                type: "input",
                label: "备注",
                span: 14,
                detail: true,
                prop: "description",
              },
            ],
          },
          /*{
            label: '付款明细',
            arrow: true,
            collapse: true,
            column: [
              {
                labelWidth: 0,
                span: 6,
                prop: 'payment'
              }
            ]
          },*/
          {
            label: "操作",
            arrow: true,
            collapse: true,
            column: [
              {
                type: "input",
                label: "发票号",
                span: 14,
                prop: "invoiceNo",
                labelPosition: "left",
                labelWidth: 100,
                rules: [
                  {
                    required: true,
                    message: "不能为空",
                    trigger: "blur",
                  },
                  {
                    pattern: /^.{1,10}$/,
                    message: "不能超过10位字符",
                  },
                ],
              },
              {
                type: "upload",
                label: "发票附件",
                span: 14,
                showFileList: true,
                prop: "invoiceUrlUpload",
                labelPosition: "left",
                labelWidth: 100,
                slot: true,
                rules: [
                  {
                    required: true,
                    message: "不能为空",
                    trigger: "blur",
                  },
                ],
              },
              {
                labelWidth: 0,
                span: 15,
                prop: "status",
              },
              /*{
                type: 'input',
                label: '本次付款',
                span: 10,
                //display: temp,
                display: false,
                prop: 'amount',
                labelPosition: "left",
                labelWidth: 100,
                rules: [{
                  required: true,
                  message: "不能为空",
                  trigger: "blur"
                },{
                  pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
                  message: '错误的金额格式'
                }, {validator: checkReceiptAmount}]
              },
              {
                type: 'select',
                dicData: constData.currency,
                span: 4,
                display: false,
                prop: 'currency',
                placeholder: "请选择 币种",
                disabled: true,
                labelWidth: 0,
                rules: [{
                  required: true,
                  message: "不能为空",
                  trigger: "blur"
                }]
              },
              {
                prop: 'waitforpayment',
                labelWidth: 0,
                display: false,
              },*/
            ],
          },
        ],
      },
    };
  },
  mounted() {
    this.reloadFormAndTable();
  },
  computed: {
    newOrderStatus() {
      //后面的状态判断在前
      /*let currentAmount = parseFloat(this.form.amount || 0);
      if (this.remainAmount - currentAmount <= 0) return 6;*/
      if (this.checked6) return 6;
      if (this.checked4) return 4;
    },
  },
  watch: {
    "tableData.length": {
      handler() {
        this.computeRemainAmount();
      },
    },
  },
  methods: {
    findByvalue,
    uploadBefore(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error("图片大小不能超过 1MB!");
      }
      return isLt1M;
    },
    beforeRemove(file, fileList) {
      this.form.invoiceUrlUpload = [];
    },
    handleUpload(params) {
      upload(
        params.file,
        new Date().Format("yyyyMMddHHmmss") + "-" + params.file.name
      ).then((res) => {
        if (res.data.success) {
          this.form.invoiceUrlUpload = res.data.data.link;
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
    computeRemainAmount() {
      /*let receiptAmount = 0;
      this.tableData.forEach(item => {
        receiptAmount += parseFloat(item.amount);
      })
      this.form.receiptAmount = receiptAmount;
      this.remainAmount = parseFloat((parseFloat(this.form.amountReal) - receiptAmount).toFixed(2));*/
    },
    reloadFormAndTable() {
      let orderNumber = this.$route.query.orderId;

      getDetail(orderNumber).then((res) => {
        this.form = res.data.data;
        this.checked6 = this.form.orderStatus === 6;
        this.changeStatus();
        getList(1, 100, { orderId: this.form.id }).then((res) => {
          this.tableData = res.data.data.records;
          this.computeRemainAmount();
        });
      });
    },
    changeStatus() {
      /*this.defaults.amount.display = this.checked5
      this.defaults.currency.display = this.checked5
      this.defaults.waitforpayment.display = this.checked5*/
      this.defaults.invoiceNo.display = this.form.orderStatus === 3;
      this.defaults.invoiceUrlUpload.display = this.form.orderStatus === 3;
    },
    updateLicense(form, done, value) {
      let licenseForm = {};
      licenseForm.vinList = "";
      licenseForm.orderId = form.orderNumber;
      licenseForm.status = (() => {
        if (value) return value;
        return this.newOrderStatus;
      })();

      let { vinList, orderId, status } = licenseForm;
      updateBatch(
        vinList,
        status,
        orderId,
        findByvalue(constData.orderType, parseInt(this.form.orderType), "type")
      ).then(
        (res) => {
          if (res.data.success) {
            /*this.$message({
            type: "success",
            message: "License修改成功！"
          });*/
          } else {
            this.$message({
              type: "error",
              message: "License修改失败" + res.data.msg,
            });
          }
          done();
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    addPayment(form, done) {
      let paymentForm = {};
      paymentForm.orderId = form.id;
      paymentForm.amount = form.amount;
      paymentForm.orderType = form.orderType;

      if (paymentForm.amount !== "") {
        add(paymentForm).then(
          (res) => {
            if (res.data.success) {
              /*this.$message({
              type: "success",
              message: "Payment创建成功！"
            });*/
              this.reloadFormAndTable();
            } else {
              this.$message({
                type: "error",
                message: "Payment创建失败" + res.data.msg,
              });
            }
            done();
          },
          (error) => {
            window.console.log(error);
          }
        );
      } else {
        this.reloadFormAndTable();
      }
    },
    updateOrder(form, done, value) {
      this.computeRemainAmount();

      let orderForm = {};
      orderForm.id = form.id;
      orderForm.rowVersion = form.rowVersion;
      orderForm.invoiceNo = form.invoiceNo;
      if (form.invoiceUrlUpload.length > 0) {
        orderForm.invoiceUrl = form.invoiceUrlUpload;
      }

      orderForm.orderStatus = (() => {
        if (value) return value;
        return this.newOrderStatus;
      })();

      update(orderForm).then(
        (res) => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "Order修改成功！",
            });
            this.updateLicense(form, done, value);
            //去掉金额相关
            //if ([4,5,6].includes(orderForm.orderStatus)) this.addPayment(form, done);
            //每个状态改变都重新加载数据
            this.reloadFormAndTable();
            //撤回的订单作逻辑删除
            if (value === 2) {
              remove(form.id).then((res) => {
                this.backToList();
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "Order修改失败" + res.data.msg,
            });
          }
          done();
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    handleSubmit(form, done) {
      this.$confirm("是否改变订单状态？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //改成自动上传，不然会有问题，更新订单的时候可能获取不到url
          //this.$refs.upload.submit();
          //先更新订单，后添加付款记录
          this.updateOrder(form, done);
        })
        .catch(() => {
          done();
        });
    },
    handleAbandon() {
      this.$confirm("是否撤回？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.updateOrder(this.form, () => {}, 2);
        })
        .catch(() => {});
    },
    backToList() {
      this.$router.$avueRouter.closeTag();
      this.$router.push({ path: "/saic/paymentOrder" });
    },
  },
};
</script>

<style scoped></style>
