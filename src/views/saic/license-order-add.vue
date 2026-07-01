<template>
  <basic-container>
    <avue-form
      ref="form"
      :defaults.sync="defaults"
      :option="option"
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
      <template slot="summary">
        <el-table
          :data="tableData"
          height="192"
          border
          style="width: 100%"
          v-show="showCheckResult"
        >
          <el-table-column prop="series" align="center" label="车系">
          </el-table-column>
          <el-table-column prop="model" align="center" label="车型">
          </el-table-column>
          <el-table-column prop="count" align="center" label="数量">
          </el-table-column>
          <el-table-column align="center" label="单价">
            <template slot-scope="scope">
              {{ showPrice(scope) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="合计">
            <template slot-scope="scope">
              {{ showTotal(scope) }}
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template slot-scope="{ disabled, type }" slot="menuForm">
        <div>
          <el-button
            type="primary"
            :disabled="typeof form.uploadUrl === 'string'"
            icon="el-icon-plus"
            :loading="disabled"
            plain
            @click="handleCheck"
          >
            验证文件
          </el-button>
          <el-button
            type="primary"
            :disabled="typeof form.uploadUrl === 'object'"
            icon="el-icon-check"
            :loading="disabled"
            plain
            @click="$refs.form.submit()"
          >
            申请开票
          </el-button>
        </div>
      </template>

      <template slot="amountExpected" slot-scope="scope">
        <strong v-show="showCheckResult">{{
          (form.currencySymbol || "") + scope.value
        }}</strong>
      </template>
    </avue-form>
  </basic-container>
</template>

<script>
import { add, check, upload, getList } from "@/api/saic/license-order";
import { mapGetters } from "vuex";
import { updateBatch } from "@/api/saic/license";
import constData from "@/config/constData";
import { findByvalue, fixdata, getArrayRepeat } from "@/util/util";
import * as _ from "lodash";

export default {
  name: "license-order-add",
  data() {
    let checkOrderNoExists = (rule, value, callback) => {
      getList(1, 10, { orderNumber: value }).then((res) => {
        if (res.data.success) {
          if (res.data.data.records.length > 0) {
            callback(new Error("该收款订单号已存在"));
          } else {
            callback();
          }
        } else {
          callback(new Error("网络错误"));
        }
      });
    };
    let checkLicenseCount = (rule, value, callback) => {
      if (parseInt(value) !== this.xlsDataList.length) {
        callback(new Error("导入数量和填写的收票数不一致"));
      } else {
        callback();
      }
    };

    return {
      form: {},
      defaults: {},
      xlsDataList: [],
      option: {
        column: [
          {
            type: "input",
            label: "收款订单号（唯一）",
            span: 24,
            prop: "orderNumber",
            labelTip: "唯一的订单号（PO/PR号）",
            rules: [
              {
                required: true,
                message: "不能为空",
                trigger: "blur",
              },
              {
                pattern: /^.{1,50}$/,
                message: "不能超过50位字符",
              },
              {
                validator: checkOrderNoExists,
                trigger: "blur",
              },
            ],
          },
          {
            type: "upload",
            label: "导入开票数据VinList",
            span: 24,
            showFileList: true,
            prop: "uploadUrl",
            labelTip:
              "需要统计的VinList的Excel列表，可以从状态查询页面直接导出",
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
            type: "input",
            label: "开票License数量",
            span: 24,
            prop: "licenseNumber",
            rules: [
              {
                required: true,
                message: "不能为空",
                trigger: "blur",
              },
              {
                pattern: /^\d+$/,
                message: "只能输入数字",
              },
              {
                validator: checkLicenseCount,
                trigger: "blur",
              },
            ],
          },
          /*{
            type: 'input',
            label: '订单总金额',
            span: 8,
            prop: 'amountReal',
            showWordLimit: false,
            rules: [{
              required: true,
              message: "不能为空",
              trigger: "blur"
            }/!*,{
              pattern: /^\d+$/,
              message: '只能输入数字'
            }*!/,{
              pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
              message: '错误的金额格式'
            }]
          },*/
          /*{
            type: 'select',
            dicData: [
              {
                label: 'RMB',
                value: '0'
              },
              {
                label: 'USD',
                value: '1'
              },
            ],
            span: 4,
            prop: 'currency',
            placeholder: "请选择 币种",
            labelWidth: 0,
            rules: [{
              required: true,
              message: "不能为空",
              //trigger: "blur"
            }]
          },*/
          /*{
            type: 'input',
            label: '收款金额',
            labelWidth: 90,
            span: 12,
            prop: 'amountExpected',
            rules: [{
              required: true,
              message: "不能为空",
              trigger: "blur"
            }],
            detail: true,
            formslot: true,
            //display: this.showCheckResult,
          },*/
          {
            label: "国家地区",
            span: 12,
            prop: "countryReginCode",
            type: "select",
            dicData: constData.countryList,
            rules: [
              {
                required: true,
                message: "请选择",
                trigger: "blur",
              },
            ],
            row: true,
          },
          {
            type: "textarea",
            label: "备注",
            span: 12,
            minRows: 9,
            prop: "description",
            rules: [
              {
                pattern: /^.{0,255}$/,
                message: "不能超过255个字符",
              },
            ],
          },
          //统计结果table列
          /*{
            labelWidth: 0,
            span: 12,
            prop: 'summary',
            slot: true,
          }*/
        ],
        labelPosition: "left",
        labelWidth: 170,
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
      tableData: [],
      vinData: [],
      multiPriceModels: [],
      showCheckResult: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    vins() {
      return this.xlsDataList
        .map((ele) => {
          return ele.VIN || ele.vin;
        })
        .filter((e) => e)
        .join(",");
    },
    counts() {
      let num = 0;
      this.tableData.forEach((item) => {
        num += item.count;
      });
      return num;
    },
  },
  methods: {
    uploadBefore: (file) => {
      debugger;
    },
    beforeRemove(file, fileList) {
      this.form.uploadUrl = [];
      this.xlsDataList = [];
      this.defaults.countryReginCode.disabled = false;
    },
    showPrice(scope) {
      return (
        findByvalue(constData.currency, scope.row.currency, "symbol") +
        scope.row.price
      );
    },
    showTotal(scope) {
      return (
        findByvalue(constData.currency, scope.row.currency, "symbol") +
        scope.row.total
      );
    },
    handleSelect(file) {
      //读取excel的方式从Avue内置的改为直接使用js-xlsx，这样就支持没有Header的Sheet
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(btoa(fixdata(e.target.result)));
        this.xlsDataList = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );
      };
      reader.readAsArrayBuffer(file.raw);

      /*this.$Export.xlsx(file.raw).then(data => {
        this.xlsDataList = data.results;
      })*/
    },
    async handleCheck() {
      //如果xls中没有数据也会报错
      if (this.xlsDataList.length === 0) {
        this.$message.warning("请先选取文件！");
        return;
      }
      if (this.vins.length === 0) {
        this.$message.warning("excel中数据为空或没有vin表头！");
        return;
      }
      //国家地区要先选择
      if (!this.form.countryReginCode) {
        this.$message.warning("请先选择国家地区！");
        return;
      }

      const res = await check(this.vins);
      //check(this.vins).then(res => {
      this.tableData = res.data.data.res;
      this.vinData = res.data.data.list;
      this.multiPriceModels = res.data.data.price;
      /*let amountExpected = 0;
        let currencySymbol = '';
        let currencyValue = '';
        let countryRegin = '';
        let countryReginCode = '';
        this.tableData.forEach(item => {
          amountExpected += parseFloat(item.total);
          currencySymbol || (currencySymbol = findByvalue(constData.currency, item.currency, 'symbol'))
          currencyValue || (currencyValue = item.currency)
          countryRegin || (countryRegin = item.countryRegin)
          countryReginCode || (countryReginCode = item.countryReginCode)
        })
        this.form.currencySymbol = currencySymbol;
        this.form.currencyValue = currencyValue;
        this.form.amountExpected = amountExpected.toFixed(2);
        this.form.countryRegin = countryRegin;*/
      //新增了国家地区下拉框，这里不用赋值了
      //this.form.countryReginCode = countryReginCode;
      //});

      if (!this.validateData()) {
        this.showCheckResult = false;
        return;
      }

      this.showCheckResult = true;
      this.defaults.countryReginCode.disabled = true;

      this.$refs.upload.submit();
    },
    validateData() {
      /*let priceInvalidModels = this.tableData.filter(item => {
        return !parseFloat(item.price);
      }).map(item => {
        return `${item.series} / ${item.model}`;
      });
      let multiPriceModels = this.multiPriceModels.map(item => {
        return `${item.series} / ${item.model}`;
      });*/
      let repeatedVINs = getArrayRepeat(this.vins.split(","));
      let invalidVINs = _.difference(
        this.vins.split(","),
        this.vinData.map((item) => {
          return item.vin;
        })
      );
      let statusInvalidVINs = this.vinData
        .filter((item) => {
          return item.statusTbox !== 2;
        })
        .map((item) => {
          return item.vin;
        });
      let noStatisticsVINs = this.vinData
        .filter((item) => {
          return item.needStatisticsTbox !== 1;
        })
        .map((item) => {
          return item.vin;
        });
      let modelNoStatisticsVINs = this.vinData
        .filter((item) => {
          return item.modelNeedStatisticsTbox !== 1;
        })
        .map((item) => {
          return item.vin;
        });
      let noMatchCountryVINs = this.vinData
        .filter((item) => {
          return item.countryReginCode != this.form.countryReginCode;
        })
        .map((item) => {
          return item.vin;
        });

      if (
        /*priceInvalidModels.length || multiPriceModels.length ||*/ repeatedVINs.length ||
        invalidVINs.length ||
        statusInvalidVINs.length ||
        noStatisticsVINs.length ||
        modelNoStatisticsVINs.length ||
        noMatchCountryVINs.length
      ) {
        let msg = "";
        /*if (priceInvalidModels.length)
          msg += "<strong>单价为0的车型：</strong>" + priceInvalidModels.join(', ') + "<br>";
        if (multiPriceModels.length)
          msg += "<strong>有多个价格区间的车型：</strong>" + multiPriceModels.join(', ') + "<br>";*/
        if (repeatedVINs.length)
          msg +=
            "<strong>重复的VIN号：</strong>" + repeatedVINs.join(", ") + "<br>";
        if (invalidVINs.length)
          msg +=
            "<strong>系统中不存在的VIN号：</strong>" +
            invalidVINs.join(", ") +
            "<br>";
        if (statusInvalidVINs.length)
          msg +=
            "<strong>非待开票的VIN号：</strong>" +
            statusInvalidVINs.join(", ") +
            "<br>";
        if (noStatisticsVINs.length)
          msg +=
            "<strong>不需要统计的VIN号：</strong>" +
            noStatisticsVINs.join(", ") +
            "<br>";
        if (modelNoStatisticsVINs.length)
          msg +=
            "<strong>车型不需要统计的VIN号：</strong>" +
            modelNoStatisticsVINs.join(", ") +
            "<br>";
        if (noMatchCountryVINs.length)
          msg +=
            "<strong>国家地区不匹配的VIN号：</strong>" +
            noMatchCountryVINs.join(", ") +
            "<br>";

        this.$alert(msg, "请检查Excel数据！", {
          dangerouslyUseHTMLString: true,
          customClass: "batch-add-result",
        });
        return false;
      }
      return true;
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
    handleSubmit(form, done, loading) {
      /*if (parseFloat(form.amountReal) !== parseFloat(form.amountExpected) || this.form.currency != this.form.currencyValue) {
        this.$confirm("订单和收款的金额或币种不一致，是否继续创建订单？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.addOrder(form, done, loading)
        }).catch(() => {
          done();
        })
      } else {*/
      this.$confirm("是否申请开票？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.addOrder(form, done, loading);
        })
        .catch(() => {
          done();
        });
      //}
    },
    addOrder(form, done, loading) {
      form.orderStatus = 3; //3:开票中
      form.orderType = 0; //0:Tbox收款
      add(form).then(
        (res) => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "创建成功！",
            });
            this.batchUpdateLicense(
              this.vins,
              form.orderStatus,
              form.orderNumber
            ); //是否要将这里的orderNumber换成返回的id？
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
    batchUpdateLicense(vinList, statusTbox, orderIdTbox) {
      updateBatch(vinList, statusTbox, orderIdTbox, "tbox")
        .then((res) => {
          console.log(res.data);
        })
        .then(() => {
          this.$router.$avueRouter.closeTag();
          this.$router.push({
            path: "/saic/tboxOrder",
          });
        });
    },
  },
};
</script>

<style scoped></style>
