<template>
  <div class="cc-calendar">
    <div class="calendar-title">
      <span>{{ month + 1 }}月</span>
    </div>
    <ul class="calendar-week">
      <li v-for="(item, index) in calendarTitleArr" :key="index" class="week-item">
        {{ item }}
      </li>
    </ul>
    <ul class="calendar-view">
      <!-- 动态设置背景颜色 -->
      <!-- color:
              handleData(item.date) && isCurrentMonth(item.date)
                ? handleData(item.date).color
                : !isCurrentMonth(item.date)
                ? '#fff'
                : '#BFBFBF', -->
      <li v-for="(item, index) in visibleCalendar" :key="index" class="date-view" :style="styleBg(item.date)">
        <span @click="editKaoQin(item)" class="date-day" :class="[{ 'opacity-class': !isCurrentMonth(item.date) }]">
          {{ item.day }}
        </span>
        <span class="calendar-num">
          {{
            handleData(item.date) && isCurrentMonth(item.date)
            ? handleData(item.date).pollution
            : ""
          }}
        </span>
      </li>
    </ul>
  </div>
</template>
  
<script>
import {
  getNewDate,
  getDate,
  formatDate,
  colorList,
  handleAQIColor,
} from "./util.js";
import { getFormatDate } from '@/util/util'
export default {
  name: "date-calendar",
  props: {
    year: {
      type: [String, Number],
      default: new Date().getFullYear(),
    },
    month: {
      type: [String, Number],
      default: 0,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },

    handleClick: Function,
  },
  data() {
    return {
      calendarTitleArr: ["日", "一", "二", "三", "四", "五", "六"],
      colorList,
      personHolidayList: [],
      allocateWorkDayList: [],
      allocateHolidayList: []
    };
  },
  computed: {
    visibleCalendar() {
      let calendatArr = [];
      let { year, month } = getNewDate(getDate(this.year, this.month, 1));
      let currentFirstDay = getDate(year, month, 1);
      // 获取当前月第一天星期几
      let weekDay = currentFirstDay.getDay();
      let startTime = null;
      if (weekDay == 0) {
        // 当月第一天是星期天
        startTime = currentFirstDay - 7 * 24 * 60 * 60 * 1000;
      } else {
        startTime = currentFirstDay - (weekDay) * 24 * 60 * 60 * 1000;
      }
      // 为了页面整齐排列 一并绘制42天
      for (let i = 0; i < 42; i++) {
        calendatArr.push({
          date: new Date(startTime + i * 24 * 60 * 60 * 1000),
          year: new Date(startTime + i * 24 * 60 * 60 * 1000).getFullYear(),
          month: new Date(startTime + i * 24 * 60 * 60 * 1000).getMonth() + 1,
          day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
        });
      }
      return calendatArr;
    },
  },
  watch:{
    list(){
      this.dealData(this.list)
    }
  },
  methods: {
    dealData(list) {
      this.personHolidayList = list.filter(ele => {
        return ele.type === 0
      }).map(ele => ele.day)
      this.allocateWorkDayList = list.filter(ele => {
        return ele.type === 1
      }).map(ele => ele.day)
      this.allocateHolidayList = list.filter(ele => {
        return ele.type === 2
      }).map(ele => ele.day)
    },
    handleData(date) {
      const data = this.list;
      data.forEach((item) => {
        if (item.pollution === "无") item.pollution = "";
        if (!item.value && item.value !== 0) {
          item.color = "#bfbfbf";
          return;
        }
        let list = colorList.filter(
          (itm) => itm.name == handleAQIColor(item.value)
        );
        item.color = list[0].value;
      });
      let { year, month, day } = getNewDate(date);
      let dateTime = year + "-" + formatDate(month + 1) + "-" + formatDate(day);
      let list = null;
      data.forEach((item) => {
        if (item.time == dateTime) {
          list = item;
        }
      });
      return list;
    },
    styleBg(date) {
      let bg,color
      let daysFormat = getFormatDate(date)
      if (this.personHolidayList.includes(daysFormat)&&this.isCurrentMonth(date)) {
        bg = 'green'
        color = '#fff'
      } else if (this.allocateWorkDayList.includes(daysFormat)&&this.isCurrentMonth(date)) {
        bg = 'red'
        color = '#fff'
      } else if(this.allocateHolidayList.includes(daysFormat)&&this.isCurrentMonth(date)) {
        bg = 'blue'
        color = '#fff'
      }else{
        bg = 'transparent'
        color = '#062927'
      }
      return {
        background: bg,
        color:color
      }

    },
    editKaoQin(item){
      let days = this.list.map(ele=>ele.day)
      let daysFormat = getFormatDate(item.date)
      if(days.includes(daysFormat)){
        this.$emit('editDate',item)
      }
    },
    isPublicHoliday(date) {

    },
    // 是否是当前月
    isCurrentMonth(date) {
      let { year: currentYear, month: currentMonth } = getNewDate(
        getDate(this.year, this.month, 1)
      );
      let { year, month } = getNewDate(date);
      return currentYear == year && currentMonth == month;
    },
  },
  created() { },
};
</script>
  
<style lang="scss" scope>
.cc-calendar {
  cursor: pointer;
  width: 25%;
  height: 100%;
  padding-right: 20px;
  box-sizing: border-box;
  // margin-bottom: 29px;

  .calendar-title {
    width: 100%;
    font-size: 16px;
    font-family: "Source Han Sans CN";
    font-weight: 500;
    color: #061a19;
    text-align: center;
    margin-bottom: 19px;
  }

  .calendar-week {
    display: flex;
    height: 28px;
    line-height: 28px;
    opacity: 0.5;
    // border: 1px solid #14c3ba;
    border-right: none;
    border-left: none;
    margin-bottom: 2px;

    .week-item {
      width: calc(100% / 7);
      text-align: center;
      font-size: 14px;
      font-family: "Source Han Sans CN";
      color: #061a19;
      font-weight: 400;
    }
  }

  .calendar-view {
    display: flex;
    flex-wrap: wrap;
    color: #062927;
    // border-top: 2px solid #e4e7ea;

    .date-view {
      width: calc(100% / 7);
      height: 38px;
      text-align: center;
      line-height: 38px;
      // margin: 4px;
      // border-right: 2px solid #e4e7ea;
      // border-bottom: 2px solid #e4e7ea;
      box-sizing: border-box;
      position: relative;

      .date-day {
        padding: 8px;
        font-size: 12px;
        font-family: "Source Han Sans CN";
        font-weight: 400;
        // color: #062927;
      }

      .calendar-num {
        position: absolute;
        left: 14px;
        bottom: 0;
        font-size: 14px;
        font-family: "Source Han Sans CN";
        font-weight: 400;
        // color: #062927;
      }
    }

    .opacity-class {
      display: none;
      // opacity: 0.5;
    }
  }

  .color-box {
    margin-top: 7px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    >div {
      display: flex;
      align-items: center;
      justify-content: center;

      >span:first-child {
        width: 30px;
        height: 14px;
      }

      >span:last-child {
        font-size: 14px;
        font-weight: 500;
        color: #1d2f2e;
      }
    }

    span {
      display: inline-block;
      width: 30px;
      margin-right: 1px;
      text-align: center;
    }
  }
}
</style>
  
  
  
  