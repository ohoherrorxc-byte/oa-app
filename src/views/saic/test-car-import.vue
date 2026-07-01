<template>
  <el-card>
    <el-form
      :model="importForm"
      ref="importForm"
      :rules="rules"
      label-width="180px"
    >
      <el-form-item label="要导入的工程车VinList：" prop="vinList">
        <el-col :span="12">
          <!-- required v-model="importForm.vinList" -->
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
        </el-col>
      </el-form-item>
      <el-form-item label="导入工程车数量：" required prop="count">
        <el-col :span="12">
          <el-input v-model.number="importForm.count"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('importForm')"
          >导入</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fixdata, getArrayRepeat } from "@/util/util";
import { check, upload } from "@/api/saic/license-order";
import { updateBatch } from "@/api/saic/license";
import * as _ from "lodash";

export default {
  name: "test-car-import",
  data() {
    return {
      importForm: {
        vinList: "",
        count: "",
      },
      xlsDataList: [],
      vinData: [],
      rules: {
        vinList: [
          /*{ required: true, message: '不能为空', trigger: 'blur' },*/
        ],
        count: [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    vins() {
      return this.xlsDataList
        .map((ele) => {
          return ele.VIN || ele.vin;
        })
        .filter((e) => e)
        .join(",");
    },
  },
  methods: {
    uploadBefore: (file) => {
      debugger;
    },
    beforeRemove(file, fileList) {
      this.importForm.uploadUrl = [];
      this.xlsDataList = [];
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
    handleUpload(params) {
      upload(
        params.file,
        new Date().Format("yyyyMMddHHmmss") + "-" + params.file.name
      ).then((res) => {
        if (res.data.success) {
          this.importForm.uploadUrl = res.data.data.link;
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
      if (this.xlsDataList.length != this.importForm.count) {
        this.$message.warning("填写的数量和导入数据数量不一致！");
        return;
      }

      const res = await check(this.vins);
      this.vinData = res.data.data.list;

      if (!this.validateData()) {
        return;
      }

      //文件暂不上传
      //this.$refs.upload.submit();
      //数据导入
      this.batchUpdateLicense(this.vins, "", "");
    },
    validateData() {
      let repeatedVINs = getArrayRepeat(this.vins.split(","));
      let invalidVINs = _.difference(
        this.vins.split(","),
        this.vinData.map((item) => {
          return item.vin;
        })
      );
      let alreadyCreatedOrderVINs = this.vinData
        .filter((item) => {
          debugger;
          return (
            item.statusTbox > 2 ||
            item.statusVoice > 2 ||
            item.statusWeather > 2 ||
            item.statusMap > 2 ||
            item.statusMapData > 2
          );
        })
        .map((item) => {
          return item.vin;
        });

      if (
        repeatedVINs.length ||
        invalidVINs.length ||
        alreadyCreatedOrderVINs.length
      ) {
        let msg = "";
        if (repeatedVINs.length)
          msg +=
            "<strong>重复的VIN号：</strong>" + repeatedVINs.join(", ") + "<br>";
        if (invalidVINs.length)
          msg +=
            "<strong>系统中不存在的VIN号：</strong>" +
            invalidVINs.join(", ") +
            "<br>";
        if (alreadyCreatedOrderVINs.length)
          msg +=
            "<strong>已经创建订单的VIN号：</strong>" +
            alreadyCreatedOrderVINs.join(", ") +
            "<br>";

        this.$alert(msg, "请检查Excel数据！", {
          dangerouslyUseHTMLString: true,
          customClass: "batch-add-result",
        });
        return false;
      }
      return true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleCheck();
        }
      });
    },
    batchUpdateLicense(vinList, statusTbox, orderIdTbox) {
      updateBatch(vinList, statusTbox, orderIdTbox, "test")
        .then((res) => {
          console.log(res.data);
        })
        .then(() => {
          this.$message.success("导入成功！");
          this.$router.$avueRouter.closeTag();
          this.$router.push({
            path: "/saic/license",
          });
        });
    },
  },
};
</script>

<style scoped></style>
