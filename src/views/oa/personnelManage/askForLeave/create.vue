<template>
  <div>
    <basic-container>
      <span>{{ $t('leave.leaveInfo') }}</span>
      <avue-form ref="formBaseInfo" :defaults.sync="defaults" :option="option" v-model="form"></avue-form>
    </basic-container>
  </div>
</template>

<script>
import askForLeaveApi from "@/api/askForLeave/index";
import { mapGetters } from "vuex";
export default {
  props: {
    disabled: {
      default: false,
    },
  },
  data() {
    return {
      defaults: {},
      form: {
        leaveType: null
      },
      holidayInfo: {},
      deepForm: {
        leaveType: null
      },
      option: {
        column: [
          {
            label: this.$t('leave.leaveType'),
            span: 12,
            prop: "leaveType",
            type: "select",
            dicUrl: "/api/oa-system/dict-biz/dictionary?code=leaveType",
            props: {
              label: "dictValue",
              value: "dictKey",
            },
            rules: [
              {
                required: true,
                message: this.$t('leave.pleaseSelectLeaveType'),
              },
            ],
            change: this.changeType
          },
          {
            label: this.$t('leave.leaveBalance'),
            span: 12,
            prop: "leaveDays",
            disabled: true,
          },
          {
            type: "date",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            label: this.$t('leave.startDate'),
            span: 12,
            prop: "startDate",
            rules: [
              {
                required: true,
                message: this.$t('leave.selectStartDate'),
              },
            ],
          },

          {
            label:  this.$t('leave.startTime'),
            prop: "startTime",
            type: "time",
            format: "HH:mm",
            valueFormat: "HH:mm",
            rules: [
              {
                required: true,
                message:this.$t('leave.selectStartTime'),
              },
            ],
          },
          {
            type: "date",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            label: this.$t('leave.endDate'),
            span: 12,
            prop: "endDate",
            rules: [
              {
                required: true,
                message:  this.$t('leave.selectEndDate'),
              },
            ],
          },
          {
            label: this.$t('leave.endTime'),
            prop: "endTime",
            type: "time",
            format: "HH:mm",
            valueFormat: "HH:mm",
            rules: [
              {
                required: true,
                message: this.$t('leave.selectEndTime'),
              },
            ],
          },
          {
            label:this.$t('leave.leaveHours'),
            span: 12,
            prop: "leaveHoursNum",
            disabled: true,
          },
          {
            label:this.$t('leave.leaveDays'),
            span: 12,
            prop: "leaveDaysNum",
            disabled: true,
          },

          {
            type: "textarea",
            label: this.$t('leave.reason'),
            span: 12,
            prop: "leaveReason",
            minRows: 2,
            maxRows: 3,
            rules: [
              {
                required: true,
                message:this.$t('leave.enterReason'),
              },
            ],
          },
        ],

        labelPosition: "right",
        labelWidth: 120,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        disabled: this.disabled,
        labelSuffix: " ",
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    form: {
      handler(newVal) {
        const { endDate, endTime, startDate, startTime } = newVal;
        if (endDate && startDate && endDate < startDate) {
          return this.$message({
            message: "开始时间必须小于结束时间",
            type: "warning",
          });
        }
        if (endDate && endTime && startDate && startTime) {
          this.getHourAndDay(newVal)
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getDayLeave()
    this.deepForm = JSON.parse(JSON.stringify(this.form))
    this.businessId = this.$route.query.businessId;
    if (this.businessId) {
      this.getDetail();
    }

  },
  methods: {
    async getHourAndDay(newVal) {
      let obj = {
        ...newVal,
        userId: this.userInfo.id || this.userInfo.user_id
      }
      let res = await askForLeaveApi.countRestTime(obj)
      if (res.data.code === 0 || res.data.code === 200) {
        if(!this.form.processInstanceId){
           this.form.leaveHoursNum = res.data.data.leaveHoursNum
        }
        this.form.leaveDaysNum = Number(res.data.data.leaveDaysNum)
      }
    },
    changeType(e) {
      console.log(e)
      if (!this.form.leaveDays) {
        this.$set(this.form, 'leaveDays', null)
      }
      if (this.deepForm.leaveType) {
        this.form.leaveHoursNum = null
        this.form.leaveDaysNum = null
        this.form.endTime = null
        this.form.startTime = null
      }
      if(!e.value)return
      this.form.leaveType = e.value
      this.$emit('isAskForLeaveType',this.form.leaveType)
      const column = this.findObject(this.option.column, "startTime")
      const column1 = this.findObject(this.option.column, "endTime")
      const columnLeaveHoursNum = this.findObject(this.option.column, "leaveHoursNum")
      const columnLeaveDaysNum = this.findObject(this.option.column, "leaveDaysNum")
      this.deepForm = JSON.parse(JSON.stringify(this.form))
      const column3 = this.findObject(this.option.column, "leaveDays")
      this.updateTimerType(column, e)
      this.updateTimerType(column1, e)
      if (e.value !== '调休') {
        columnLeaveHoursNum.display = false
        columnLeaveDaysNum.display = true
        if (e.value === '年假') {
          column3.label = '年假余额'
          column3.display = true
          this.form.leaveDays = `${this.holidayInfo.yearHoliday}天`
        } else {
          column3.label = '假期余额'
          this.form.leaveDays = null
          column3.display = false
        }
      } else {
        columnLeaveHoursNum.display = true
        columnLeaveDaysNum.display = false
        column3.display = true
        column3.label = '调休余额'
        this.form.leaveDays = `${this.holidayInfo.compensatoryLeave}小时`
      }
      if (this.businessId && !this.$route.query.isEdit) {
        column3.display = false
      }
    },
    updateTimerType(column, e) {
        column.type = 'select'
        column.dicData = [
          {
            label: '上午',
            value: '上午'
          }, {
            label: '下午',
            value: '下午'
          }
        ]

    },
    async getDayLeave() {
      let res = await askForLeaveApi.getHolidayInfoByUserId(this.userInfo.user_id)
      if (res.data.code === 0) {
        this.holidayInfo = res.data.data
      }
    },
    GetDate(overtime) {
      const dateObject = new Date(overtime);
      // 获取日期部分
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, '0');
      const day = String(dateObject.getDate()).padStart(2, '0');

      // 构建日期字符串 'YYYY-MM-DD'
      return `${year}-${month}-${day}`;
    },
    async getDetail() {
      let res = await askForLeaveApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        if (!this.form.leaveDays) {
          this.$set(this.form, 'leaveDays', null)
        }
        console.log(12344)
        console.log(this.form)
        this.$emit("getFormData", this.form);
      }
    },
    // getDiffByHour(startDate, startTime, endDate, endTime) {
    //   /****
    //    * start:请假开始时间
    //    * end:请假结束时间
    //    * 计算小时数(1位小数)
    //    * ***/
    //   let start = startDate + " " + startTime;
    //   let startT = startDate + " " + "17:30";
    //   let end = endDate + " " + endTime;
    //   let endT = endDate + " " + "09:30";
    //   let s = Date.parse(start);
    //   let st = Date.parse(startT);
    //   let e = Date.parse(end);
    //   let et = Date.parse(endT);
    //   let diff;
    //   // 在同一天
    //   if (startDate === endDate) {
    //     diff = Math.abs(e - s);
    //   } else {
    //     // 不在同一天
    //     // 当天时间
    //     let startDiff = Math.abs(st - s);
    //     //  结束时间
    //     let endDiff = Math.abs(e - et);
    //     // 中间时间
    //     let centreDiff = 0;
    //     let centre = Math.abs(new Date(endDate) - new Date(startDate));
    //     if (centre > 86400000) {
    //       centreDiff = (centre / 24) * 8;
    //     }
    //     diff = startDiff + centreDiff + endDiff;
    //   }

    //   //取绝对值
    //   return (diff / (1000 * 60 * 60)).toFixed(2);
    // },
    testForm() {
      console.log(this.form.leaveHoursNum)
      console.log(this.form.leaveType)
      console.log(this.form)
      if(this.form.leaveType ==='调休'){
        let valueRemain = this.form.leaveDays.replace('小时',"")
        console.log(valueRemain)
        let canRelex = Number(valueRemain) - Number(this.form.leaveHoursNum)
        if(Number(valueRemain)<0||canRelex<0){
          this.$message.error('假期余额不足')
          return
        }
      }
      if(this.form.leaveType ==='调休'&&Number(this.form.leaveHoursNum)<=0){

        this.$message.error('本次请假小时数必须大于零,请重新提交')
        return
      }
      return new Promise((resolve) => {
        this.$refs.formBaseInfo.validate((valid, done, msg) => {
          msg &&
            this.$message({
              message: Object.values(msg)[0][0].message,
              type: "warning",
            });
          resolve(valid);
          done();
        });
      });
    },
  },
};
</script>

<style>
.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.w100 {
  width: 100%;
}
</style>
