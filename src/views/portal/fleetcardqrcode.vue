<template>
  <div>
    <el-card style="margin-bottom: 10px">
      <div slot="header">
        <span class="card-title">Single Add</span>
      </div>

      <el-form :model="formSingle" ref="formSingle">
        <el-col :span="12">
          <el-form-item
            label="Card Number"
            label-width="120px"
            prop="cardNo"
            :rules="[
              { required: true, message: 'Card number cannot be blank.' },
              { validator: checkCardNoExists },
            ]"
          >
            <!--<el-input v-model="formSingle.cardNo"></el-input>-->
            <el-autocomplete
              style="width: 100%"
              v-model="formSingle.cardNo"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              :validate-event="false"
              debounce="1000"
              :highlight-first-item="false"
              :hide-loading="false"
              value-key="cardNo"
              placeholder="Please input card number."
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="10px">
            <el-button type="primary" @click="singleGenerate">Generate QR Code</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <div id="singlePrint" ref="singlePrint" style="margin-bottom: 20px">
        <el-card class="box-card" v-show="singleShow" style="background-color: white">
          <div style="text-align: center; width: 200px; margin-bottom: 10px" ref="singleTitle"></div>
          <div ref="qrcode"></div>
          <div style="text-align: center; width: 200px; margin-top: 10px">
            Scan to check the balance
            <br />MG Supercharge Call Centre: 02-114-7638
          </div>
        </el-card>
      </div>

      <el-button
        type="info"
        icon="el-icon-printer"
        @click="handlePrint('#singlePrint')"
        v-show="singleShow"
      >Print</el-button>
      <el-button
        type="info"
        icon="el-icon-download"
        @click="handleDownload($refs.singlePrint, 'singlePrint', true)"
        v-show="singleShow"
      >Download</el-button>
    </el-card>

    <el-card style="margin-bottom: 10px">
      <div slot="header">
        <span class="card-title">Batch Add</span>
      </div>

      <el-upload
        class="file-uploader"
        :auto-upload="false"
        :show-file-list="false"
        action="action"
        :on-change="handleChange"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      >
        <i class="el-icon-plus file-uploader-icon"></i>
      </el-upload>

      <el-row class="btn-row">
        <el-button type="primary" @click="handleGet" icon="el-icon-download">Template</el-button>
      </el-row>

      <avue-crud
        :option="option"
        :data="batchCardList"
        v-show="batchCardList.length > 0"
        style="width: 50%; margin-left: 0"
      ></avue-crud>

      <el-row class="btn-row">
        <el-button
          type="primary"
          @click="batchGenerate"
          v-show="batchCardNo.length > 0"
        >Generate QR Code</el-button>
      </el-row>

      <div
        id="batchPrint"
        ref="batchPrint"
        style="margin-bottom: 20px; display: flex; flex-wrap: wrap"
        v-show="batchShow"
      >
        <!--<el-col>-->
        <el-card class="box-card" style="margin: 5px" v-for="code in batchCardNo" :key="code">
          <div
            style="text-align: center; width: 200px; margin-bottom: 10px"
            ref="batchTitle"
          >{{ code }}</div>
          <div :ref="`qrcode${code}`"></div>
          <div style="text-align: center; width: 200px; margin-top: 10px">
            Scan to check the balance
            <br />MG Supercharge Call Centre: 02-114-7638
          </div>
        </el-card>
        <!--</el-col>-->
      </div>

      <el-row class="btn-row">
        <el-button
          type="info"
          icon="el-icon-printer"
          @click="handlePrint('#batchPrint')"
          v-show="batchShow"
        >Print</el-button>
        <el-button
          type="info"
          icon="el-icon-download"
          @click="handleDownload($refs.batchPrint, 'batchPrint')"
          v-show="batchShow"
        >Download</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getArrayRepeat, getItemNotInclude, getTopUrl } from "@/util/util";
import { mapGetters } from "vuex";
import { checkCardStatus, list } from "@/api/portal/vehiclePrepaidCard";
import html2canvas from "html2canvas";

export default {
  name: "fleetcardqrcode",
  data() {
    return {
      urlPrefix: "",
      formSingle: {
        cardNo: "",
      },
      singleShow: false,
      batchShow: false,
      batchValid: false,
      batchCardNo: [],
      batchCardList: [],
      option: {
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        menu: false,
        border: true,
        column: [
          /*{
          label: 'ID',
          prop: 'ID'
        }, */ {
            label: "Card Number",
            prop: "Card_Number",
            html: true,
          },
        ],
      },
    };
  },
  created() {
    //debugger;
    this.urlPrefix = `${getTopUrl()}/#/balance?t=${this.userInfo.tenant_id}&c=`;
  },
  computed: {
    ...mapGetters(["userInfo"]),
    numbers() {
      return this.batchCardList
        .map((ele) => {
          return ele.Card_Number;
        })
        .join(",");
    },
  },
  methods: {
    checkCardNoExists(rule, value, callback) {
      list(1, 10, { chargingCardNo: value }).then((res) => {
        if (res.data.success) {
          if (res.data.data.records.length !== 1) {
            callback(
              new Error(
                "The card number is incorrect,  QR code generating failed."
              )
            );
          } else if (res.data.data.records[0].state === 0) {
            callback(
              new Error(
                "The card number is disabled,  QR code generating failed."
              )
            );
          } else {
            callback();
          }
        } else {
          callback(new Error("Network error!"));
        }
      });
    },
    handleGet() {
      window.open("./cdn/template/QR.xlsx");
    },
    singleGenerate() {
      this.$refs.formSingle.validate((valid) => {
        if (valid) {
          const domSingle = this.$refs.qrcode;
          const cardNoSingle = this.formSingle.cardNo;
          const titleSingle = this.$refs.singleTitle;

          domSingle.innerHTML = "";
          titleSingle.innerHTML = cardNoSingle;
          this.singleShow = true;

          this.makeQR(domSingle, cardNoSingle);
        }
      });
    },
    handlePrint(dom) {
      // eslint-disable-next-line
      Print(dom);
    },
    handleDownload(dom, fileName, single) {
      html2canvas(
        dom,
        single ? { width: 250, height: 500 } : { width: 1600, height: 800 }
      ).then(function (canvas) {
        canvas.toBlob(
          (blob) => {
            const anchor = document.createElement("a");
            anchor.download = `${fileName}.png`;
            /*let binaryData = [];
            binaryData.push(blob);*/
            anchor.href = URL.createObjectURL(blob);
            anchor.click();
            URL.revokeObjectURL(anchor.href);
          },
          "image/png",
          1
        );
      });
    },
    handleChange(file) {
      this.$Export.xlsx(file.raw).then((data) => {
        this.batchCardList = data.results;
        this.batchShow = false;

        checkCardStatus(this.numbers).then((res) => {
          if (res.data.success) {
            let existNumbers = res.data.data.map((item) => {
              return item.chargingCardNo;
            });
            let invalidNumbers = res.data.data
              .filter((item) => {
                return item.state === "disable";
              })
              .map((item) => {
                return item.chargingCardNo;
              });
            let notExistNumbers = getItemNotInclude(
              this.numbers.split(","),
              existNumbers
            );
            let repeatNumbers = getArrayRepeat(this.numbers.split(","));

            if (
              notExistNumbers.length ||
              invalidNumbers.length ||
              repeatNumbers.length
            ) {
              let msg = "";

              if (invalidNumbers.length)
                msg +=
                  "<strong>Disabled cards: </strong>" +
                  invalidNumbers.join(", ") +
                  "<br>";
              if (notExistNumbers.length)
                msg +=
                  "<strong>Nonexistent cards: </strong>" +
                  notExistNumbers.join(", ") +
                  "<br>";
              if (repeatNumbers.length)
                msg +=
                  "<strong>Repeated cards: </strong>" +
                  repeatNumbers.join(", ") +
                  "<br>";

              this.batchCardList.forEach((item) => {
                if (invalidNumbers.includes(item.Card_Number.toString()))
                  item.Card_Number +=
                    "<span style='color:#ff0000;float:right;'>invalid</span>";
                if (notExistNumbers.includes(item.Card_Number.toString()))
                  item.Card_Number +=
                    "<span style='color:#de04b9;float:right;'>non-exist</span>";
                if (repeatNumbers.includes(item.Card_Number.toString()))
                  item.Card_Number +=
                    "<span style='color:#e8dd04;float:right;'>repeated</span>";
              });

              this.batchValid = false;
              this.$alert(
                msg,
                "QR code generating failed, please check and upload again.",
                {
                  dangerouslyUseHTMLString: true,
                  customClass: "batch-add-result",
                }
              );
            } else {
              this.batchCardNo = [];
              this.batchValid = true;

              data.results.forEach((ele) => {
                this.batchCardNo.push(ele.Card_Number);
              });
            }
          } else {
            this.$message.error("Network error!");
          }
        });
      });

      console.log(this.batchCardNo);
    },
    batchGenerate() {
      if (!this.batchValid) return;

      this.batchShow = true;
      this.batchCardNo.forEach((no) => {
        let dom = this.$refs[`qrcode` + no][0];
        dom.innerHTML = "";
        this.makeQR(dom, no);
      });
    },
    makeQR(dom, val) {
      // eslint-disable-next-line
      let qrcode = new QRCode(dom, {
        width: 200,
        height: 200,
      });

      qrcode.makeCode(this.urlPrefix + val);
    },
    querySearchAsync(queryString, callback) {
      //if (queryString && queryString.length >= 3) {
      var cardList = [];
      list(1, 200, { chargingCardNo: queryString, state: 1 }).then((res) => {
        if (res.data.success) {
          cardList = res.data.data.records.map((item) => {
            return { cardNo: item.chargingCardNo };
          });

          var results = queryString
            ? cardList.filter(this.createListFilter(queryString))
            : list;
          callback(results);
        } else {
          this.$message.error("Network error!");
        }
      });
      //}
    },
    createListFilter(queryString) {
      return (list) => {
        return (
          list.cardNo.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
  },
  watch: {
    "formSingle.cardNo"(val) {
      if (val === "") this.singleShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/*.el-message-box {
  width: auto;
}*/
.batch-add-result {
  width: 50%;
  word-break: break-all;
}

.file-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.file-uploader .el-upload:hover {
  border-color: #203b71;
}

.file-uploader .file-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.box-card {
  width: 240px;
}

.card-title {
  font-weight: bold;
}

.btn-row {
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
