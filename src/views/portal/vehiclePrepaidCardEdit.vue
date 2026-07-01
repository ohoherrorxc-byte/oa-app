<template>
  <basic-container>
    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
            <el-button
              type="primary"
              style="width: 80px"
              @click="bindCardFormVisible = true"
            >
              Add
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-table border v-loading="loading" :data="data" style="width: 100%">
          <el-table-column label="ID" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column
            prop="chargingCardNo"
            label="Card Number"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="chargingCardType"
            align="center"
            label="Card Type"
          >
          </el-table-column>
          <el-table-column prop="vin" align="center" label="VIN">
          </el-table-column>
          <el-table-column prop="balance" label="Balance (THB)" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.balance }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="Binding Time"
            :formatter="dateFormat"
            width="130px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="creator" align="center" label="Creater">
          </el-table-column>
          <el-table-column label="Operator" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                @click="handleUnbindCard(scope.index, scope.row)"
                size="mini"
                type="primary"
                >Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          background
          :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="page.total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <h3>Bulk Add</h3>
        </div>
        <label style="color: #1e9fff" @click="handleBatchBindCardTemplateExport"
          >Click to download the excel template</label
        >
        <el-upload
          action=""
          style="margin-top: 1%"
          accept=".xls,.xlsx"
          drag
          :limit="1"
          :http-request="importBatchBindCard"
        >
          <i class="el-icon-upload" style="margin-top: 8%"></i>
          <div class="el-upload__text">
            Drag files here,or <em>Click upload</em>
          </div>
        </el-upload>

        <el-row style="margin-top: 1%">
          <el-table
            border
            stripe
            :data="vehiclePrepaidCards"
            style="width: 60%"
          >
            <el-table-column
              align="center"
              prop="chargingCardNo"
              label="Card number"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="chargingCardType"
              label="Card Type"
            >
            </el-table-column>
            <el-table-column align="center" prop="vin" label="VIN">
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top: 1%">
          <el-button @click="handleBatchBindCard" type="primary">
            Confirm
          </el-button>
        </el-row>
      </el-card>
    </el-card>

    <!--绑卡-->
    <el-dialog
      title="Bind a card"
      :visible.sync="bindCardFormVisible"
      @open="beforeBindCard"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="500px"
      @close="resetForm('vehiclePrepaidCardForm')"
      center
    >
      <el-form
        :model="vehiclePrepaidCard"
        :rules="rules"
        ref="vehiclePrepaidCardForm"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="Card Number :" prop="chargingCardNo">
          <el-input
            v-model="vehiclePrepaidCard.chargingCardNo"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-form-item label="Card Type :" prop="chargingCardType">
          <el-input
            v-model="vehiclePrepaidCard.chargingCardType"
            style="width: 300px"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="VIN :" prop="vin">
          <el-input
            v-model.number="vehiclePrepaidCard.vin"
            oninput="value=value.replace(/[^A-Za-z\d]*/g,'')"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindCardFormVisible = false">Cancel</el-button>
        <el-button
          @click="handleBindCard('vehiclePrepaidCardForm')"
          type="primary"
          >Save</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import {
  list,
  getUserCardByNo,
  batchBindCard,
  exportBatchBindCardTemplateExcel,
  readBatchBindCardData,
  unbindCard,
} from "@/api/portal/vehiclePrepaidCard";
import { download } from "@/util/excel";

export default {
  data() {
    var checkCardNoRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Card Number cannot be empty!"));
      }
      setTimeout(() => {
        if (value.length !== 14) {
          callback(
            new Error("The prepaid card number Length must be 14 digits!")
          );
        }

        if (!value.startsWith("MG1")) {
          callback(
            new Error("The prepaid card number must begin with `MG1` !")
          );
        }

        getUserCardByNo(value).then((res) => {
          if (res.data.success) {
            if (
              res.data.data.chargingCardNo &&
              res.data.data.userId !== -1 &&
              res.data.data.userId !== ""
            ) {
              callback(
                new Error("The prepaid card: " + value + " is already exist!")
              );
            } else {
              callback();
            }
          } else {
            callback(new Error("Query The prepaid card: " + value + " error!"));
          }
        });
      }, 1000);
    };

    return {
      userId: "",
      query: {
        userId: "",
      },
      loading: true,
      data: [],
      page: {
        pageSize: 5,
        currentPage: 1,
        total: 0,
      },
      vehiclePrepaidCards: [],

      bindCardFormVisible: false,

      vehiclePrepaidCard: { chargingCardType: "Prepaid Card" },
      // 校验规则
      rules: {
        chargingCardNo: [
          {
            required: true,
            message: "Card Number can not be empty",
            trigger: "blur",
          },
          { validator: checkCardNoRule, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loadQueryUserId();
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
  },
  methods: {
    loadQueryUserId() {
      this.userId = this.$route.query.userId;
      if (this.$route.query.userId) {
        this.query.userId = this.$route.query.userId;
      } else {
        if (this.userInfo.role_name.includes("fleet")) {
          this.query.userId = this.userInfo.user_id;
        } else {
          this.$message({ type: "error", message: "The User Not Found !" });
          return;
        }
      }
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      list(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        if (page.currentPage > 1 && res.data.data.records.length === 0) {
          this.onLoad(1, params);
        }
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;
        this.loading = false;
      });
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },
    dateFormat(row, column) {
      const daterc = row[column.property];
      if (daterc) {
        const dateMat = new Date(daterc);
        const year = dateMat.getFullYear();
        let month = dateMat.getMonth() + 1;
        let day = dateMat.getDate();
        let hh = dateMat.getHours();
        let mm = dateMat.getMinutes();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        // const ss = dateMat.getSeconds();
        const timeFormat = hh + ":" + mm + " " + day + "/" + month + "/" + year;
        return timeFormat;
      }
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.vehiclePrepaidCard = {
        chargingCardType: "Prepaid Card",
      };
      // this.vehiclePrepaidCards=[];
    },
    handleBatchBindCardTemplateExport() {
      this.$confirm(
        "Do you want  to download the Batch Binding Card template ?",
        "Tip",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          return exportBatchBindCardTemplateExcel();
        })
        .then((res) => {
          download(res);
        });
    },
    importBatchBindCard(params) {
      const file = params.file;
      readBatchBindCardData(file).then((res) => {
        if (res.data.success) {
          this.vehiclePrepaidCards = res.data.data;
          this.vehiclePrepaidCards.forEach((card) => {
            card.chargingCardType = "Prepaid Card";
            card.userId = this.userId;
          });
          // this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    beforeBindCard() {
      this.vehiclePrepaidCard.userId = this.userId;
    },
    handleBindCard(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let vehiclePrepaidCards = [];
          vehiclePrepaidCards.push(this.vehiclePrepaidCard);
          this.batchBindCard(vehiclePrepaidCards);
        }
      });
    },
    handleBatchBindCard() {
      this.batchBindCard(this.vehiclePrepaidCards);
    },
    batchBindCard(vehiclePrepaidCards) {
      if (vehiclePrepaidCards.length === 0) {
        this.$message({
          type: "error",
          message: "The bind card data can not empty ！",
        });
        return;
      }

      batchBindCard(vehiclePrepaidCards).then((res) => {
        if (res.data.success) {
          this.$message({ type: "success", message: "Bind Card successful!" });
          this.bindCardFormVisible = false;
          this.vehiclePrepaidCard = {
            chargingCardType: "Prepaid Card",
          };
          this.onLoad(this.page, this.query);
        } else {
          this.$message({ type: "error", message: res.data.msg });
        }
      });
    },
    handleUnbindCard(index, row) {
      this.$confirm(
        "Are you sure to delete the prepaid card of " +
          row.chargingCardNo +
          "?",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        unbindCard(row).then((res) => {
          if (res.data.success) {
            this.onLoad(this.page, this.query);
            this.$message({ type: "success", message: "operate succeeded！" });
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-pagination {
  position: relative;
  text-align: right;
  padding: 25px 0 20px 20px;
}
</style>
<style>
.el-upload-dragger {
  height: 150px;
  width: 300px;
}
.el-card__header {
  height: 50px;
}
</style>
