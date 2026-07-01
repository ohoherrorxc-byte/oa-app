<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('workOvertime.overtimeInfo') }}
    </p>
    <div>
      <el-form  ref="form" :model="form">
        <el-form-item :label="$t('workOvertime.convertToLeave')"  v-if="businessId&&!isEdit&&showChooseType">
          <el-radio-group v-model="form.timeType" :disabled="form.flow.taskName!=='直接主管'&&form.flow.taskName!=='直接上级'">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>        
          </el-radio-group>
        </el-form-item>
        <div class="text-r mb10" v-if="!disabled">
          <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table  ref="multipleTable" :data="form.applyList" class="mb20 table-now">
          <el-table-column type="index" width="50" :label="$t('commonContent.serialNumber') "></el-table-column>
          <el-table-column align="center" width="180">
            <template slot="header" slot-scope="{row}">
              {{ $t('workOvertime.place') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.overtimePlace'" :rules="{
                required: true, message: '加班地点不能为空'
              }">
                <el-input :disabled="disabled" clearable v-model="scope.row.overtimePlace" placeholder="请输入加班地点"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="166">
            <template slot="header">
              {{ $t('workOvertime.startDate') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.overtimeStartDate'" :rules="{
                required: true, message: '加班开始日期不能为空'
              }">
                <el-date-picker :disabled="disabled" value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;"
                  v-model="scope.row.overtimeStartDate" type="date" placeholder="请选择加班开始日期"
                  @change="changeOvertimeHours(scope)"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150">
            <template slot="header">
              {{ $t('workOvertime.startTime') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.overtimeStartTime'" :rules="{
                required: true, message: '加班开始时间不能为空'
              }">
                <el-time-picker :disabled="disabled" format="HH:mm" value-format="HH:mm" style="width: 100%;"
                  v-model="scope.row.overtimeStartTime" placeholder="请选择加班开始时间"
                  @change="changeOvertimeHours(scope)"></el-time-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="166">
            <template slot="header">
              {{ $t('workOvertime.endDate') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item  :prop="'applyList.' + scope.$index + '.overtimeEndDate'" :rules="{
                required: true, message: '加班结束日期不能为空'
              }">
                <el-date-picker :disabled="disabled" value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;"
                  v-model="scope.row.overtimeEndDate" type="date" placeholder="选择加班结束日期"
                  @change="changeOvertimeHours(scope)"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150">
            <template slot="header">
              {{ $t('workOvertime.endTime') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.overtimeEndTime'" :rules="{
                required: true, message: '加班结束时间不能为空'
              }">
                <el-time-picker :disabled="disabled" format="HH:mm" value-format="HH:mm" style="width: 100%;"
                  v-model="scope.row.overtimeEndTime" placeholder="请选择加班结束时间"
                  @change="changeOvertimeHours(scope)"></el-time-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('workOvertime.duration') " align="center">
            <template slot-scope="{row}">{{ row.overtimeHours }}</template>
          </el-table-column>
          <el-table-column align="center" width="250">
            <template slot="header">
              {{ $t('workOvertime.reason') }}
              <span class="red">*</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'applyList.' + scope.$index + '.overtimeReason'" :rules="{
                required: true, message: '加班事由不能为空'
              }">
                <el-input :disabled="disabled" clearable v-model="scope.row.overtimeReason" placeholder="请输入加班事由"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commonContent.operation')" align="center" v-if="!disabled" width="140">
            <template slot-scope="scope">
              <el-form-item>
                <el-button :disabled="disabled" type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <!-- <MobileForm v-if="isMobile" :option="option" :applyList="form.applyList" @submit="submit" /> -->
  </basic-container>
</template>

<script>
import workOvertimeApi from "@/api/workOvertime/index";
// import MobileForm from "@/components/mobileForm";
import { mapGetters } from "vuex";
export default {
  // components: {
  //   MobileForm,
  // },
  data() {
    return {
      hasShownReminder: false,
      option: [
        {
          labelWidth: 120,
          column: [
            {
              label: "加班地点",
              prop: "overtimePlace",
              rules: [
                {
                  required: true,
                  message: "请输入加班地点",
                },
              ],
            },
            {
              label: "加班开始日期",
              prop: "overtimeStartDate",
              type: "date",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              rules: [
                {
                  required: true,
                  message: "请选择加班开始日期",
                },
              ],
              change: (a) => {
                console.log(a);
              },
            },
            {
              label: "加班开始时间",
              prop: "overtimeStartTime",
              type: "time",
              format: "HH:mm",
              valueFormat: "HH:mm",
              rules: [
                {
                  required: true,
                  message: "请选择加班开始时间",
                },
              ],
            },
            {
              label: "加班结束日期",
              prop: "overtimeEndDate",
              type: "date",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              rules: [
                {
                  required: true,
                  message: "请选择加班结束日期",
                },
              ],
            },
            {
              label: "加班结束时间",
              prop: "overtimeEndTime",
              type: "time",
              format: "HH:mm",
              valueFormat: "HH:mm",
              rules: [
                {
                  required: true,
                  message: "请选择加班结束时间",
                },
              ],
            },
            {
              label: "加班时长",
              prop: "overtimeHours",
              disabled: true,
            },
            {
              label: "加班事由",
              prop: "overtimeReason",
              rules: [
                {
                  required: true,
                  message: "请输入加班事由",
                },
              ],
            },
          ],
        },
      ],

      categoriesList: [],
      placeList: [],
      applyList: [],
      form: {
        timeType:0,
        applyList: [
          {
            overtimeEndDate: "",
            overtimeEndTime: "",
            overtimeHours: "",
            overtimePlace: "",
            overtimeReason: "",
            overtimeStartDate: "",
            overtimeStartTime: "",
          },
        ],
      },
      showChooseType:false,
      businessId: null,
      multipleSelection: [],
      isEdit: false,
    };
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    // this.CalculateHours();

    // this.GetDate("2024-01-01 12:00:00");
    // 添加全局点击事件监听
    this.$nextTick(() => {
      document.addEventListener('click', this.handleDocumentClick);
    });
  },
  beforeDestroy() {
    // 移除全局点击事件监听
    document.removeEventListener('click', this.handleDocumentClick);
  },
  computed: {
    ...mapGetters(["isMobile"]),
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    handleDocumentClick() {
      if (!this.hasShownReminder) {
        this.$message({
          message: '正式员工请前往"北森考勤平台"提交加班申请!!!',
          type: 'warning',
          duration: 3000
        });
        this.hasShownReminder = true;
      }
    },
    changeOvertimeHours(scope) {
      console.log(scope);
      const {
        overtimeEndDate,
        overtimeEndTime,
        overtimeStartDate,
        overtimeStartTime,
      } = scope.row;

      if (
        overtimeEndDate &&
        overtimeStartDate &&
        overtimeEndDate < overtimeStartDate
      ) {
        return this.$message({
          message: "加班开始日期必须小于加班结束日期",
          type: "warning",
        });
      }
      if (
        overtimeEndDate === overtimeStartDate &&
        overtimeEndTime &&
        overtimeStartTime &&
        overtimeEndTime < overtimeStartTime
      ) {
        return this.$message({
          message: "加班开始时间必须小于加班结束时间",
          type: "warning",
        });
      }
      if (
        overtimeEndDate &&
        overtimeEndTime &&
        overtimeStartDate &&
        overtimeStartTime
      ) {
        let StartDate = this.GetDate(overtimeStartDate);
        let EndDate = this.GetDate(overtimeEndDate);
        let start = StartDate + " " + overtimeStartTime;
        let end = EndDate + " " + overtimeEndTime;

        let s = Date.parse(start);
        let e = Date.parse(end);
        let diff = Math.abs(e - s);
        scope.row.overtimeHours = (diff / (1000 * 60 * 60)).toFixed(2) || null;
        this.$set(this.form.applyList, scope.$index, scope.row)
      }
    },
    async getDetail() {
      let res = await workOvertimeApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        if(this.form.timeType===undefined){
          this.$set(this.form,'timeType',0)
        }
        if(this.form.timeType===null){
          this.form.timeType = 0
        }
        this.getTypeCanChoose()
        this.$emit("getFormData", this.form);
      }
    },
    async  getTypeCanChoose(){
      let res = await workOvertimeApi.changeTypeStatus(this.businessId)
      console.log(res)
      if(res.data.code===200||res.data.code===0){
        this.showChooseType = res.data.data
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
      this.applyList = val;
    },
    CalculateHours(startTime, endTime) {
      // 提供的时间范围
      // const startTime = new Date('2024-01-15T18:30:00');
      // const endTime = new Date('2024-01-16T18:30:00');

      // 初始化加班小时数
      let overtimeHours = 0;

      // // 假设这是你的法定节假日列表
      // const holidayList = [
      //   '2024-01-01', // 元旦
      //   '2024-05-01', // 劳动节
      // ];

      // // 获取当前日期，格式为'YYYY-MM-DD'
      // const currentDate = currentTime.toISOString().split('T')[0];

      // // 判断是否是法定节假日
      // const isHoliday = holidayList.includes(currentDate);

      // 循环遍历时间范围内的每一小时
      for (
        let currentTime = new Date(startTime);
        currentTime < endTime;
        currentTime.setHours(currentTime.getHours() + 1)
      ) {
        const currentHour = currentTime.getHours();
        const currentDay = currentTime.getDay();

        // 判断是否在工作日的18点以后至早上9点之间
        const isOvertimeOnWeekday = currentHour >= 18 || currentHour < 9;

        // 判断是否是周末
        const isWeekend = currentDay === 0 || currentDay === 6;

        // 判断是否满足加班条件
        if ((isOvertimeOnWeekday && !isWeekend) || isWeekend) {
          // 如果满足条件，加1小时
          overtimeHours += 1;
        }
      }

      console.log("加班小时数：", overtimeHours);

      return overtimeHours;
    },
    GetDate(overtime) {
      const dateObject = new Date(overtime);
      // 获取日期部分
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");

      // 构建日期字符串 'YYYY-MM-DD'
      return `${year}-${month}-${day}`;
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
}
::v-deep ep.el-radio__input.is-disabled.is-checked .el-radio__inner{
  background-color: #000!important
}
</style>
