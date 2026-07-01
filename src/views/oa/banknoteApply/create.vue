<template>
  <basic-container>
    <p class="table-title">
      <span></span>银票贴现业务审批申请
    </p>

    <div class="flex-space mr20">
      <div v-if="!disabled">
        <span class="add-icon" @click="addRow">+</span>
      </div>
    </div>

    <div>
      <el-form :disabled="disabled" ref="form" :model="form">
        <el-table
          ref="multipleTable"
          :data="form.applyList"
          class="mb20 table-now"
        >
          <el-table-column type="index" width="50" label="序号" />

          <!-- 票据原持有银行 -->
          <el-table-column align="center" width="250">
            <template slot="header">
              票据原持有银行 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteBankName'"
                :rules="[{ required: true, message: '票据原持有银行' }]"
              >
                <el-input
                  clearable
                  v-model="scope.row.banknoteBankName"
                  placeholder="票据原持有银行"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 贴现行 -->
          <el-table-column align="center" width="240">
            <template slot="header">
              贴现行 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteNowBank'"
                :rules="[{ required: true, message: '贴现行' }]"
              >
                <el-select
                  v-model="scope.row.banknoteNowBank"
                  placeholder="贴现行"
                  clearable
                >
                  <el-option
                    label="上海汽车集团财务有限责任公司"
                    value="上海汽车集团财务有限责任公司"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 贴现日 -->
          <el-table-column align="center" width="180">
            <template slot="header">
              贴现日 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteDate'"
                :rules="[{ required: true, message: '请选择日期' }]"
              >
                <el-date-picker
                  v-model="scope.row.banknoteDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择贴现日"
                  :picker-options="setDisabled"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 出票行 -->
          <el-table-column align="center" width="250">
            <template slot="header">
              出票行 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteOutBank'"
                :rules="[{ required: true, message: '出票行' }]"
              >
                <el-input
                  clearable
                  v-model="scope.row.banknoteOutBank"
                  placeholder="出票行"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 票据金额 -->
          <el-table-column align="center" width="200">
            <template slot="header">
              票据金额 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteAmount'"
                :rules="[{ required: true, message: '票据金额' }]"
              >
                <el-input
                        clearable
                        v-model="scope.row.banknoteAmount"
                        placeholder="票据金额"
                        @input="recalcAmountReceived(scope.row)"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 到期日 -->
          <el-table-column align="center" width="180">
            <template slot="header">
              到期日 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteEndDate'"
                :rules="[{ required: true, message: '请选择日期' }]"
              >
                <el-date-picker
                  v-model="scope.row.banknoteEndDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择到期日"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 贴现天数 -->
          <el-table-column align="center" width="160">
            <template slot="header">
              贴现天数 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteDay'"
                :rules="[{ required: true, message: '贴现天数' }]"
              >
                <el-input
                  clearable
                  v-model="scope.row.banknoteDay"
                  placeholder="贴现天数"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 贴现利率 -->
          <el-table-column align="center" width="160">
            <template slot="header">
              贴现利率（%） <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteRate'"
                :rules="[{ required: true, message: '贴现利率' }]"
              >
                <el-input
                  clearable
                  v-model="scope.row.banknoteRate"
                  placeholder="贴现利率（%）"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 贴现费用 -->
          <el-table-column align="center" width="160">
            <template slot="header">
              贴现费用 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknotePayAmount'"
                :rules="[{ required: true, message: '贴现费用' }]"
              >
                <el-input
                  clearable
                  v-model="scope.row.banknotePayAmount"
                  placeholder="贴现费用"
                  @input="recalcAmountReceived(scope.row)"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 实收金额 -->
          <el-table-column align="center" width="160">
            <template slot="header">
              实收金额 <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'applyList.' + scope.$index + '.banknoteAmountReceived'"
                :rules="[{ required: true, message: '实收金额' }]"
              >
                <el-input
                  clearable
                  v-model="scope.row.banknoteAmountReceived"
                  placeholder="实收金额"
                  @input="recalcAmountReceived(scope.row)"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column
            label="操作"
            align="center"
            v-if="!disabled"
            width="120"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-button
                  type="text"
                  @click="deleteRow(scope.row)"
                  style="color:red"
                >删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <!-- <MobileForm v-if="isMobile" :option="option" @submit="submit" :applyList="form.applyList" /> -->
  </basic-container>
</template>

<script>
import BanknoteApply from "@/api/banknoteApply/index";
// import MobileForm from "@/components/mobileForm";
import { mapGetters } from "vuex";
import { getFormatDate, HHMMSS } from "@/util/util";

export default {
  // components: {
  //   MobileForm,
  // },
  data() {
    return {
      option: [
        {
          column: [
            { label: "票据原持有银行", prop: "banknoteBankName", rules: [{ required: true, message: "票据原持有银行" }] },
            { label: "贴现行", prop: "banknoteNowBank", rules: [{ required: true, message: "贴现行" }] },
            { label: "贴现日", prop: "banknoteDate", type: "date", valueFormat: "yyyy-MM-dd HH:mm:ss", rules: [{ required: true, message: "请选择日期" }] },
            { label: "出票行", prop: "banknoteOutBank", rules: [{ required: true, message: "出票行" }] },
            { label: "票据金额", prop: "banknoteAmount", rules: [{ required: true, message: "票据金额" }] },
            { label: "到期日", prop: "banknoteEndDate", type: "date", valueFormat: "yyyy-MM-dd HH:mm:ss", rules: [{ required: true, message: "请选择日期" }] },
            { label: "贴现天数", prop: "banknoteDay", rules: [{ required: true, message: "贴现天数" }] },
            { label: "贴现利率", prop: "banknoteRate", rules: [{ required: true, message: "贴现利率" }] },
            { label: "贴现费用", prop: "banknotePayAmount", rules: [{ required: true, message: "贴现费用" }] },
            { label: "实收金额", prop: "banknoteAmountReceived", rules: [{ required: true, message: "实收金额" }] }
          ]
        }
      ],
      categoriesList: [],
      placeList: [],
      form: {
        applyList: [
          {
            key: Date.now(),
            banknoteBankName: "",
            banknoteNowBank: "",
            banknoteDate: "",
            banknoteOutBank: "",
            banknoteAmount: "",
            banknoteEndDate: "",
            banknoteDay: "",
            banknoteRate: "",
            banknotePayAmount: "",
            banknoteAmountReceived: ""
          }
        ]
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
      setDisabled: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // 禁选未来日期
        }
      }
    };
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
  },
  computed: {
    ...mapGetters(["isMobile"]),
    disabled() {
      return this.businessId && !this.isEdit;
    }
  },
  methods: {
    async getDetail() {
      const res = await BanknoteApply.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    dealTimer(row, index) {
      if (row.correctionDate === `${getFormatDate()} 12:00:00`) {
        row.correctionTime = null;
        this.$set(this.form.applyList, index, row);
      }
    },
    selectableRange(scope) {
      if (scope.row.correctionDate === `${getFormatDate()} 12:00:00`) {
        return `00:00:00-${HHMMSS()}`;
      } else {
        return `00:00:00-23:59:59`;
      }
    },
    addRow() {
      this.form.applyList.push({
        key: Date.now(),
        banknoteBankName: "",
        banknoteNowBank: "",
        banknoteDate: "",
        banknoteOutBank: "",
        banknoteAmount: "",
        banknoteEndDate: "",
        banknoteDay: "",
        banknoteRate: "",
        banknotePayAmount: "",
        banknoteAmountReceived: ""
      });
    },
    deleteRow(row) {
      this.form.applyList = this.form.applyList.filter((ele) => ele !== row);
    },
    testForm() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
        });
      });
    },
    recalcAmountReceived(row) {
        const amount = this.toNumber(row.banknoteAmount);
        const fee = this.toNumber(row.banknotePayAmount);
        if (amount == null && fee == null) {
          row.banknoteAmountReceived = "";
          return;
        }
        const received = (amount || 0) - (fee || 0);
        row.banknoteAmountReceived = Number.isFinite(received) ? String(received) : "";
      },
      toNumber(val) {
        if (val === null || val === undefined || val === "") return null;
        const n = Number(String(val).replace(/,/g, "").trim());
        return Number.isFinite(n) ? n : null;
      },
    submit(val) {
      this.form.applyList = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
  cursor: pointer;
}
</style>
