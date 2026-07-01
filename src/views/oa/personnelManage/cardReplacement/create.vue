<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('cardReplacement.title') }}
    </p>
    <div  class="flex-space mr20">
      <p class="red">
        {{ $t('cardReplacement.Instructions') }}
      </p>
      <div class="" v-if="!disabled">
        <span class="add-icon" @click="addRow">+</span>
      </div>
    </div>
    <div>
      <el-form :disabled="disabled" ref="form" :model="form">
        <el-table ref="multipleTable" :data="form.applyList" class="mb20 table-now">
          <el-table-column type="index" width="50" :label="$t('commonContent.serialNumber')"></el-table-column>
          <el-table-column align="center" width="166">
            <template slot="header" slot-scope="scope">
              {{ $t('cardReplacement.date') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.correctionDate'" :rules="{
                required: true, message: $t('cardReplacement.dateRequired')
              }">
                <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;" v-model="scope.row.correctionDate"
                  type="date" :placeholder="$t('cardReplacement.datePlaceholder')" :picker-options="setDisabled"
                  @change="dealTimer(scope.row, scope.$index)"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150">
            <template slot="header" slot-scope="scope">
              {{ $t('cardReplacement.type') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.correctionType'" :rules="{
                required: true, message: $t('cardReplacement.typePlaceholder')
              }">
                <el-select v-model="scope.row.correctionType" :placeholder="$t('cardReplacement.typePlaceholder')">
                  <el-option value="签到" />
                  <el-option value="签退" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150">
            <template slot="header" slot-scope="scope">
              {{ $t('cardReplacement.time') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.correctionTime'" :rules="{
                required: true, message: $t('cardReplacement.timePlaceholder')
              }">
                <el-time-picker format="HH:mm" value-format="HH:mm" style="width: 100%;"
                  v-model="scope.row.correctionTime" :picker-options="{ selectableRange: selectableRange(scope) }"
                  :placeholder="$t('cardReplacement.timePlaceholder')"></el-time-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="250">
            <template slot="header" slot-scope="scope">
              {{ $t('cardReplacement.cardTypes') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.correctionKind'" :rules="{
                required: true, message: $t('cardReplacement.cardTypesReason')
              }">
                <el-select clearable v-model="scope.row.correctionKind"
                  :placeholder="$t('cardReplacement.cardTypesPlaceholder')">
                  <el-option label="正常补卡" value="正常补卡"> </el-option>
                  <el-option label="出差补卡" value="出差补卡"> </el-option>
                  <el-option label="跨天加班补卡" value="跨天加班补卡"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="250">
            <template slot="header" slot-scope="scope">
              {{ $t('cardReplacement.reason') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.correctionReason'" :rules="{
                required: true, message: $t('cardReplacement.reasonPlaceholder')
              }">
                <el-input clearable v-model="scope.row.correctionReason"
                  :placeholder="$t('cardReplacement.reasonPlaceholder')"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commonContent.operation')" align="center" v-if="!disabled" width="150">
            <template slot-scope="scope">
              <el-form-item>
                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
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
import CardReplacementApi from "@/api/cardReplacement/index";
// import MobileForm from "@/components/mobileForm";
import { mapGetters } from "vuex";
import { getFormatDate, HHMMSS } from '@/util/util'
export default {
  // components: {
  //   MobileForm,
  // },
  data() {
    return {
   
      option: [
        {
          column: [
            {
              label: "补卡日期",
              prop: "correctionDate",
              type: "date",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              rules: [
                {
                  required: true,
                  message: "请选择补卡日期",
                },
              ],
            },
            {
              label: "补卡类型 ",
              prop: "correctionType",
              type: "select",
              rules: [
                {
                  required: true,
                  message: "请选择补卡类型",
                },
              ],
              dicData: [
                {
                  label: "签到",
                  value: "签到",
                },
                {
                  label: "签退",
                  value: "签退",
                },
              ],
            },
            {
              label: "补卡时间",
              prop: "correctionTime",
              type: "time",
              format: "HH:mm",
              valueFormat: "HH:mm",
              rules: [
                {
                  required: true,
                  message: "请选择补卡时间",
                },
              ],
            },
            {
              label: "补卡原因",
              prop: "correctionReason",
              rules: [
                {
                  required: true,
                  message: "请输入补卡原因",
                },
              ],
            },
          ],
        },
      ],
      categoriesList: [],
      placeList: [],
      form: {
        applyList: [
          {
            correctionDate: "",
            correctionReason: "",
            correctionTime: "",
            correctionType: "",
          },
        ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
      setDisabled: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // 可选历史天、可选当前天、不可选未来天
        },
      },
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
    },
  },
  methods: {
    async getDetail() {
      let res = await CardReplacementApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    dealTimer(row, index) {
      if (row.correctionDate === `${getFormatDate()} 12:00:00`) {
        row.correctionTime = null
        this.$set(this.form.applyList, index, row)
      }
    },
    selectableRange(scope) {
      if (scope.row.correctionDate === `${getFormatDate()} 12:00:00`) {
        return `00:00:00-${HHMMSS()}`
      } else {
        return `00:00:00-23:59:59`
      }
    },
    addRow() {
      this.form.applyList.push({
        key: Date.now(),
      });
    },
    deleteRow(row) {
      this.form.applyList = this.form.applyList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
        });
      });
    },
    submit(val) {
      this.form.applyList = val;
    },
  },
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
}</style>
