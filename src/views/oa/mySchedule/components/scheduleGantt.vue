<template>
    <div>
        <div id="app">
            <div class="calendar">
                <div class="arrow">
                    <i class="el-icon-arrow-left" @click="arrow('left')"></i>
                    <span class="pl50">{{ getYearMonth() }} </span>
                    <span class="pr50 pl10">{{ getWeek() }}</span>
                    <i class="el-icon-arrow-right" @click="arrow('right')"></i>
                </div>
                <el-calendar id="calendar" ref="calendar" v-model="value" :range="dateRange">
                    <template slot="dateCell" slot-scope="{ date, data }">
                        <div class="flex">
                            <p style="padding-right:3px;font-size:18px" :class={today:isToday(data)}>
                                {{ getDay(date) }}
                            </p>
                            <p style="margin-top: 5px;font-size: 10px;color: #6B6B6B;">
                                {{ getLunarDay(date) }}
                            </p>
                        </div>
                    </template></el-calendar>
                <div class="task-row" id="task">
                    <div class="line line1"></div>
                    <div class="line line2"></div>
                    <div class="line line3"></div>
                    <div class="line line4"></div>
                    <div class="line line5"></div>
                    <div class="line line6"></div>
                    <div class="taskAll">
                        <div v-for="(item, index) in taskList" :key="index" :style=[style(item)] class="task-item">
                            {{ item.schedule }}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getLunar } from 'chinese-lunar-calendar'
import { getFormatDate, getWeek, diffDays } from '@/util/util'
import scheduleApi from '../../../../api/schedule';
export default {
    data() {
        return {
            value: "",
            endDate: "",
            startDate: "",
            dateRange: [],
            dateNum: 0,
            taskList: [],
            bgList: ['rgba(255, 153, 0, 0.30)', 'rgba(104, 33, 255, 0.30)', 'rgba(82, 255, 0, 0.30)',
                'rgba(255, 104, 186, 0.30)', 'rgba(0,163,255,0.3)', 'rgba(183, 183, 183, 0.30)'],
            calendarInterRowWidth: 0
        }
    },
    created() {
        this.dateList(this.dateNum);
    },
    mounted() {
        this.getTaskList()
        let calendarCurr = document.querySelector('.current')
        this.calendarInterRowWidth = calendarCurr.clientWidth    
    },
    methods: {
        async  getTaskList(){
            let obj = {
                gateStartTime:`${this.startDate} 00:00:00`,
                gateEndTime:`${this.endDate} 00:00:00`
            }
            let res = await scheduleApi.gateTabulationList(obj)
            if(res.data.code===0){
                this.taskList = res.data.data
                this.initList()
            }        
            console.log(res)
        },
        initList() {
            const background = (a) => a[Math.floor(Math.random() * this.bgList.length)]
            this.taskList.map((ele,index) => {
                let startDateNow = `${this.startDate} 00:00:00`
                let endDateNow  = `${this.endDate} 00:00:00`
                let startL = new Date(ele.startTime) < new Date(startDateNow) ? new Date(startDateNow) : new Date(ele.startTime)
                let endL = new Date(ele.endTime) > new Date(endDateNow) ? new Date(endDateNow) : new Date(ele.endTime)
                this.$set(ele, 'startIndex', diffDays(startL, startDateNow))
                this.$set(ele, 'during', diffDays(startL, endL) + 1)
                this.$set(ele,'background', this.bgList[index%this.bgList.length])
            })
            console.log(this.taskList)
        },
        getYearMonth() {
            var currentDate = new Date(this.startDate);
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth() + 1; // 注意月份是从0开始计数，需加1来获得正确的月份
            month = month > 9 ? month : `0${month}`
            return `${year}年${month}月`
        },
        getWeek() {
            var currentDate = new Date(this.startDate);
            // 获取当前的月份和星期几
            var month = currentDate.getMonth();
            // 获取当前的日期和年份
            var date = currentDate.getDate();
            var year = currentDate.getFullYear();
            // 创建一个新的Date对象设置为当月的1号
            var firstDayOfMonth = new Date(year, month, 1);
            // 获取1号是星期几
            var firstDayOfWeek = firstDayOfMonth.getDay();
            // 计算当前日期是第几个星期
            var weekNumber = Math.ceil((date + firstDayOfWeek) / 7);
            // console.log(weekNumber)
            return `第${weekNumber}周`
        },
        isToday(data) {
            return getFormatDate() === data.day
        },
        style(item) {
            let remainRow = 7 - item.startIndex - item.during
            const background = (a) => a[Math.floor(Math.random() * this.bgList.length)]
            let obj = {
                "margin-left": `calc(100% / 7*${item.startIndex})`,
                "margin-right": `calc(100% / 7*${remainRow})`,
                background:item.background
            }
            return obj
        },
        // 上面的日历
        // 获取当前时间的周一
        getMonday(date) {
            var day = date.getDay();
            var deltaDay;
            if (day == 0) {
                deltaDay = 6;
            } else {
                deltaDay = day - 1;
            }
            var monday = new Date(date.getTime() - deltaDay * 24 * 60 * 60 * 1000);
            monday.setHours(0);
            monday.setMinutes(0);
            monday.setSeconds(0);
            return monday; //返回选定时间的周一的0时0分0秒
        },
        getDay(date) {
            let time = new Date(date)
            let day = time.getDate()
            return day
        },
        getLunarDay(date) {
            let time = new Date(date)
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            let day = time.getDate()
            let lanarInfo = getLunar(year, month, day)
            let dayLanar = lanarInfo.dateStr.substring(2, 5)
            return dayLanar
        },
        getDateNew(time) {
            let times = new Date(time);
            let year = times.getFullYear();
            let month = times.getMonth() + 1 < 10 ? "0" + (times.getMonth() * 1 + 1) : times.getMonth() * 1 + 1;
            let day = times.getDate() < 10 ? "0" + times.getDate() * 1 : times.getDate() * 1;
            return year + "-" + month + "-" + day;
        },
        dateList(delta) {
            //将时间对象转换为时间戳并加几天后转换为时间对象
            var DateNews = this.getMonday(
                new Date((new Date().getTime() / 1000 + 86400 * 7 * delta) * 1000)
            );
            this.startDate = this.getDateNew(DateNews, delta);
            this.endDate = this.getDateNew(
                new Date((DateNews.getTime() / 1000 + 6 * 86400) * 1000)
            );
            // console.log(getWeek( this.startDate))
            this.dateRange = [this.startDate, this.endDate];
        },
       async arrow(arrow) {
            if (arrow == "left") {
                this.dateNum--;
                this.dateList(this.dateNum);
              this.getTaskList()
            } else if (arrow == "right") {
                this.dateNum++;
                this.dateList(this.dateNum);
                this.getTaskList()
            }
        },
    },

}
</script>

<style lang="scss" scoped>
#app {
    // width: 40%;
    margin: auto;
}


/* 上面的日历 */
.calendar {
    position: relative;
    width: 100%;
    background: #fff;
}

::v-deep ep .el-calendar__header {
    display: none !important;
    ;
}

::v-deep ep .el-calendar-table .el-calendar-day {
    height: auto;
    text-align: center;
}

::v-deep ep .el-calendar-table {
    border-bottom: 1px solid #e4e4e4;
}

::v-deep ep .el-calendar-table .next {
    color: rgb(143, 143, 143);
}

::v-deep ep .el-calendar__title,
.el-calendar__button-group {
    text-align: center;
}

.today {
    background-color: #000;
    width: 20px;
    // height: 16px;
    border-radius: 100%;
    padding: 1px 3px;
    color: #fff;
}


.item {
    height: 100px;
    /* 设置每个子元素的高度 */
    border: 1px solid #ccc;
    /* 设置子元素的边框样式 */
}

.arrow {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep ep .el-calendar__body {
    padding: 12px 20px 0px !important;
}

.task-row {
    position: relative;
    height: 60vh;
    overflow-y: scroll;
    overflow-x: hidden;
    margin: 0px 20px 0px;
    margin-top: -1px;

    border: 1px solid #EBEEF5;
}

.line {
    height: 100%;
    position: absolute;
    border-right: 1px solid #EBEEF5;
}

.line1 {
    position: absolute;
    left: calc(100% / 7);
}

.line2 {
    position: absolute;
    left: calc(100% / 7*2);
}
.line3 {
    position: absolute;
    left: calc(100% / 7*3);
}

.line4 {
    position: absolute;
    left: calc(100% / 7*4);
}
.line5 {
    position: absolute;
    left: calc(100% / 7*5);
}

.line6 {
    position: absolute;
    left: calc(100% / 7*6);
}
.taskAll {
    padding-top: 10px;
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.task-item {

    // top: 0;
    background-color: rgba(255, 153, 0, 0.30);
    margin-bottom: 5px;
    padding: 5px;
    font-size: 14px;
}

::-webkit-scrollbar {
    width: 0px !important;
}</style>