<template>
    <basic-container class="attendance-container">
        <el-row class="main-content">
            <el-col span="19" class="main-panel">
                <div class="month-selector">
                    <el-date-picker
                        :picker-options="pickerOptionsYearMonth"
                        v-model="form.month"
                        @change="onLoad"
                        value-format="yyyy-MM"
                        type="month"
                        :placeholder="$t('checkingIn.selectMonth')"
                        class="date-picker"
                        :disabled="calendarLoading || statisticsLoading || holidayLoading"
                    >
                    </el-date-picker>
                    <el-autocomplete
                       v-if="hasUserSearchPermission"
                       v-model="userName"
                       :fetch-suggestions="filterUserList"
                       placeholder="姓名"
                       :trigger-on-focus="false"
                       :loading="userListLoading"
                       @select="selectUser"
                       class="user-selector"
                       @focus="getUserList"
                       :disabled="calendarLoading || statisticsLoading || holidayLoading"
                    >
                       <template slot-scope="{ item }">
                          <div>{{ item.realName}}</div>
                       </template>
                    </el-autocomplete>
                </div>
                <el-alert
                    v-if="error"
                    :title="error"
                    type="error"
                    show-icon
                    :closable="false"
                    class="error-alert"
                >
                </el-alert>
                <div class="calendar-section">
                    <el-row class="w100">
                        <el-col span="24">
                            <basic-container class="calendar-card">
                                <div class="calendar-header">
                                   <div class="calendar-title">{{ form.month.split('-')[0] }}年{{ parseInt(form.month.split('-')[1]) }}月</div>
                                </div>
                                <el-skeleton
                                    v-if="calendarLoading"
                                    :loading="calendarLoading"
                                    animated
                                    :rows="8"
                                >
                                    <template slot="template">
                                        <el-skeleton-item variant="p" style="width: 100%; height: 300px;" />
                                    </template>
                                </el-skeleton>
                                <el-empty
                                    v-else-if="checkingList.length === 0"
                                    description="暂无考勤数据"
                                    :image-size="120"
                                >
                                    <el-button type="primary" @click="onLoad">重新加载</el-button>
                                </el-empty>
                                <el-calendar v-else v-model="form.month" class="attendance-calendar">
                                    <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                                    <template slot="dateCell" slot-scope="{date, data}">
                                        <div class="date-cell" :class="{ 'current-month': data.isCurrentMonth }">
                                            <div class="month-label" v-if="!data.isCurrentMonth">{{ parseInt(data.day.split('-')[1]) }}月</div>
                                            <div class="date-number">{{ data.day.split('-').slice(2).toString() }}</div>
                                            <template v-if="calendarDataMap[data.day]">
                                                <div class="clock-status">
                                                    <i v-if="calendarDataMap[data.day].clockInStatus===0"  class="el-icon-circle-check status-normal"></i>
                                                    <img  v-if="calendarDataMap[data.day].clockInStatus===1" src="@/assets/svg/clock.svg" alt="" class="status-warning">
                                                    <i v-if="calendarDataMap[data.day].clockInStatus===2"  class="el-icon-warning status-error"></i>
                                                </div>
                                                <div class="clock-times" v-if="calendarDataMap[data.day].clockInLog && calendarDataMap[data.day].clockInLog.length > 0">
                                                    <div class="time-item" v-if="calendarDataMap[data.day].clockInLog[0]">
                                                        <span class="time-label">到:</span>
                                                        <span class="time-value">{{ calendarDataMap[data.day].clockInLog[0].clockInTime | formatHHMMSS }}</span>
                                                        <span class="time-value-remark">{{ calendarDataMap[data.day].clockInLog[0].remark }}</span>
                                                    </div>
                                                    <div class="time-item" v-if="calendarDataMap[data.day].clockInLog[1]">
                                                        <span class="time-label">退:</span>
                                                        <span class="time-value">{{ calendarDataMap[data.day].clockInLog[1].clockInTime | formatHHMMSS }}</span>
                                                        <span class="time-value-remark">{{ calendarDataMap[data.day].clockInLog[1].remark }}</span>
                                                    </div>
                                                </div>
                                                <div class="clock-leave" v-if="calendarDataMap[data.day].holidayInfo">
                                                     <div class="time-item" v-if="calendarDataMap[data.day].holidayInfo">
                                                       <span class="time-value-remark">{{ calendarDataMap[data.day].holidayInfo }}</span>
                                                     </div>
                                                </div>
                                            </template>
                                        </div>
                                    </template>
                                </el-calendar>
                            </basic-container>
                        </el-col>
                    </el-row>
                </div>
                <div class="statistics-section">
                    <el-row class="w100">
                        <el-col span="8">
                            <basic-container class="stat-card attendance-stat">
                                <h3 class="card-title">{{ $t('checkingIn.attendanceStatistics') }}</h3>
                                <el-skeleton
                                    v-if="statisticsLoading"
                                    :loading="statisticsLoading"
                                    animated
                                    :rows="6"
                                >
                                    <template slot="template">
                                        <el-skeleton-item variant="p" style="width: 100%; height: 200px; margin-bottom: 20px;" />
                                        <el-skeleton-item variant="p" style="width: 45%; height: 80px; display: inline-block; margin-right: 10%;" />
                                        <el-skeleton-item variant="p" style="width: 45%; height: 80px; display: inline-block;" />
                                    </template>
                                </el-skeleton>
                                <el-empty
                                    v-else-if="!checkingInData || Object.keys(checkingInData).length === 0"
                                    description="暂无统计数据"
                                    :image-size="80"
                                >
                                    <el-button type="primary" @click="onLoad">重新加载</el-button>
                                </el-empty>
                                <div v-else>
                                    <div class="cicle" ref="attendancePieChart" id="chart-cicle"></div>
                                    <div class="stat-details">
                                        <div class="stat-details-row stat-details-row--days">
                                            <div class="stat-item">
                                                <p class="stat-value">{{ checkingInData.realityRequired || 0 }}</p>
                                                <div class="stat-label">
                                                    <div class="status-dot normal"></div>
                                                    <span>{{ $t('checkingIn.actualAttendance') }}</span>
                                                </div>
                                            </div>
                                            <div class="stat-item">
                                                <p class="stat-value">{{ Number(checkingInData.neverRequired || 0) }}</p>
                                                <div class="stat-label">
                                                    <div class="status-dot absent"></div>
                                                    <span>{{ $t('checkingIn.absentee') }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="stat-details-row stat-details-row--hours">
                                            <div class="stat-item">
                                                <p class="stat-value">{{ Number(checkingInData.expectedWorkingHours || 0) }}</p>
                                                <div class="stat-label">
                                                    <div class="status-dot hours hours--expected"></div>
                                                    <span>需出勤总工时</span>
                                                </div>
                                            </div>
                                            <div class="stat-item">
                                                <p class="stat-value">{{ Number(checkingInData.totalWorkingHours || 0) }}</p>
                                                <div class="stat-label">
                                                    <div class="status-dot hours hours--total"></div>
                                                    <span>结算总工时</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </basic-container>
                        </el-col>
                        <el-col span="16">
                            <basic-container class="stat-card abnormal-summary">
                                <h3 class="card-title">{{ $t('checkingIn.abnormalAttendanceSummary') }}</h3>
                                <el-skeleton
                                    v-if="statisticsLoading"
                                    :loading="statisticsLoading"
                                    animated
                                    :rows="12"
                                >
                                    <template slot="template">
                                        <el-skeleton-item variant="p" style="width: 100%; height: 150px; margin-bottom: 20px;" />
                                        <el-skeleton-item variant="p" style="width: 100%; height: 120px;" />
                                    </template>
                                </el-skeleton>
                                <el-empty
                                    v-else-if="!checkingInData || Object.keys(checkingInData).length === 0"
                                    description="暂无异常考勤数据"
                                    :image-size="80"
                                >
                                    <el-button type="primary" @click="onLoad">重新加载</el-button>
                                </el-empty>
                                <el-row v-else class="flex pt30">
                                    <el-col span="16">
                                        <div class="abnormal-categories">
                                            <div class="category-item">
                                                <img class="category-icon" src="@/assets/svg/kaoqin/chucha.svg" alt="">
                                                <div class="category-info">
                                                    <p class="category-value">{{ checkingInData.businessTrips }}</p>
                                                    <p class="category-label">{{ $t('checkingIn.businessTrips') }}</p>
                                                </div>
                                            </div>
                                            <div class="category-item">
                                                <img class="category-icon" src="@/assets/svg/kaoqin/chuxing.svg" alt="">
                                                <div class="category-info">
                                                    <p class="category-value">{{ checkingInData.publicity }}</p>
                                                    <p class="category-label">{{ $t('checkingIn.publicity') }}</p>
                                                </div>
                                            </div>
                                            <div class="category-item">
                                                <img class="category-icon" src="@/assets/svg/kaoqin/jiaban.svg" alt="">
                                                <div class="category-info">
                                                    <p class="category-value">{{ checkingInData.workOvertimeTotal }}</p>
                                                    <p class="category-label">{{ $t('checkingIn.overtime') }}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="leave-info">
                                            <h4 class="section-title">{{ $t('checkingIn.leaveInfo') }}</h4>
                                            <div class="leave-items">
                                                <div v-for="item in leaveList" v-if="!!Number(checkingInData[item.prop])"
                                                    class="leave-item">
                                                    <span class="leave-value">{{ checkingInData[item.prop] }}</span>
                                                    <span class="leave-label">{{ item.label }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col span="8" class="abnormal-details">
                                        <div class="detail-item">
                                            <span class="detail-value">{{ checkingInData.arriveLate || 0 }}</span>
                                            <span class="detail-label">{{ $t('checkingIn.arriveLate') }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-value">{{ checkingInData.severeLate || 0 }}</span>
                                            <span class="detail-label">{{ $t('checkingIn.severeLate') }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-value">{{ checkingInData.earlyLeave || 0 }}</span>
                                            <span class="detail-label">{{ $t('checkingIn.earlyLeave') }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-value">{{ checkingInData.severEarlyLeave || 0 }}</span>
                                            <span class="detail-label">{{ $t('checkingIn.severEarlyLeave') }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-value">{{ checkingInData.absenteeism || 0 }}</span>
                                            <span class="detail-label">{{ $t('checkingIn.absenteeism') }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-value">{{ checkingInData.forgetClockIn || 0 }}</span>
                                            <span class="detail-label">{{ $t('checkingIn.forgetClockIn') }}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </basic-container>
                        </el-col>
                    </el-row>
                    <el-row class="leave-cards">
                        <el-col span="8">
                            <basic-container class="stat-card leave-card">
                                <div class="leave-card-header">
                                    <h3 class="card-title">{{ $t('checkingIn.compensatoryLeave') }}</h3>
                                </div>
                                <el-skeleton
                                    v-if="holidayLoading"
                                    :loading="holidayLoading"
                                    animated
                                    :rows="4"
                                >
                                    <template slot="template">
                                        <el-skeleton-item variant="p" style="width: 100%; height: 40px; margin-bottom: 15px;" />
                                        <el-skeleton-item variant="p" style="width: 100%; height: 40px; margin-bottom: 15px;" />
                                        <el-skeleton-item variant="p" style="width: 100%; height: 40px;" />
                                    </template>
                                </el-skeleton>
                                <el-empty
                                    v-else-if="!checkingInData || Object.keys(checkingInData).length === 0"
                                    description="暂无假期数据"
                                    :image-size="60"
                                >
                                    <el-button type="primary" @click="onLoad">重新加载</el-button>
                                </el-empty>
                                <div v-else class="leave-card-body">
                                    <div class="leave-info-item">
                                        <span class="info-label">{{ $t('checkingIn.lastCompensatoryLeave') }}</span>
                                        <span class="info-value">{{ checkingInData.lastCompensatoryLeave }}</span>
                                    </div>
                                    <div class="leave-info-item">
                                        <span class="info-label">{{ $t('checkingIn.nowCompensatoryLeave') }}</span>
                                        <span class="info-value">{{ checkingInData.nowCompensatoryLeave }}</span>
                                    </div>
                                    <div class="leave-info-item">
                                        <span class="info-label">{{ $t('checkingIn.totalCompensatoryLeave') }}</span>
                                        <span class="info-value">{{ checkingInData.compensatoryLeave }}</span>
                                    </div>
                                </div>
                            </basic-container>
                        </el-col>
                        <el-col span="8">
                            <basic-container class="stat-card leave-card">
                                <div class="leave-card-header">
                                    <h3 class="card-title">{{ $t('checkingIn.yearHoliday') }}</h3>
                                </div>
                                <el-skeleton
                                    v-if="holidayLoading"
                                    :loading="holidayLoading"
                                    animated
                                    :rows="4"
                                >
                                    <template slot="template">
                                        <el-skeleton-item variant="p" style="width: 100%; height: 40px; margin-bottom: 15px;" />
                                        <el-skeleton-item variant="p" style="width: 100%; height: 40px; margin-bottom: 15px;" />
                                        <el-skeleton-item variant="p" style="width: 100%; height: 40px;" />
                                    </template>
                                </el-skeleton>
                                <el-empty
                                    v-else-if="!checkingInData || Object.keys(checkingInData).length === 0"
                                    description="暂无假期数据"
                                    :image-size="60"
                                >
                                    <el-button type="primary" @click="onLoad">重新加载</el-button>
                                </el-empty>
                                <div v-else class="leave-card-body">
                                    <div class="leave-info-item">
                                        <span class="info-label">{{ $t('checkingIn.lastYearHoliday') }}</span>
                                        <span class="info-value">{{ checkingInData.lastYearHoliday || 0 }}</span>
                                    </div>
                                    <div class="leave-info-item">
                                        <span class="info-label">{{ $t('checkingIn.nowYearHoliday') }}</span>
                                        <span class="info-value">{{ checkingInData.nowYearHoliday || 0 }}</span>
                                    </div>
                                    <div class="leave-info-item">
                                        <span class="info-label">{{ $t('checkingIn.totalYearHoliday') }}</span>
                                        <span class="info-value">{{ checkingInData.yearHoliday || 0 }}</span>
                                    </div>
                                </div>
                            </basic-container>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-dialog
            :append-to-body="true"
            :title="$t('checkingIn.attendanceDetails')"
            :visible.sync="dialogVisible"
            width="80%"
            :before-close="handleClose"
            class="attendance-dialog"
        >
            <workOvertime></workOvertime>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t('checkingIn.cancel') }}</el-button>
                <el-button type="primary" @click="dialogVisible = false">{{ $t('checkingIn.confirm') }}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
import workOvertime from '../workOvertime/index'
import { yearMonth } from '@/util/util'
import addressTree from './addressTree'
import OriginalStatementApi from '@/api/checkingIn/originalStatement/index'
import { mapGetters } from 'vuex'
import scheduleApi from '@/api/schedule/index'
export default {
    components: { workOvertime, addressTree },
    data() {
        return {
            curId: null,
            form: {
                month: yearMonth(),
                userId: ""
            },
            pickerOptionsYearMonth: this.banTime(),
            userName: '',
            userList: [],
            userListLoading: false,
            option: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} 小时 ({d}%)'
                },
                color: ['#409EFF', '#DCDFE6'],
                series: [
                    {
                        name: '工时',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            position: 'center',
                            formatter: () => '0\n\n需出勤总工时(小时)'
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 1, name: '暂无数据', itemStyle: { color: '#ebeef5' } }
                        ]
                    }
                ]
            },
            leaveList: [
                {
                    label: this.$t('checkingIn.yearLeave'),
                    prop: "yearLeave",
                },
                {
                    label: this.$t('checkingIn.restHour'),
                    prop: "restHour",
                },
                {
                    label: this.$t('checkingIn.absenceLeave'),
                    prop: "absenceLeave",
                },
                {
                    label: this.$t('checkingIn.sickLeave'),
                    prop: "weekLeave",
                },
                {
                    label: this.$t('checkingIn.maternityLeave'),
                    prop: "maternityLeave",
                },
                {
                    label: this.$t('checkingIn.paternityLeave'),
                    prop: "paternityLeave",
                },
                {
                    label: this.$t('checkingIn.marriageLeave'),
                    prop: "marriageLeave",
                },
                {
                    label: this.$t('checkingIn.funeralLeave'),
                    prop: "funeralLeave",
                },
                {
                    label: this.$t('checkingIn.breastfeedingLeave'),
                    prop: "breastfeedingLeave",
                },
                {
                    label: this.$t('checkingIn.paternityChildLeave'),
                    prop: "paternityChildLeave",
                },
                {
                    label: this.$t('checkingIn.minorMaternityLeave'),
                    prop: "minorMaternityLeave",
                },
                {
                    label: this.$t('checkingIn.otherLeave'),
                    prop: "otherLeave",
                }
            ],
            dialogVisible: false,
            checkingInData: {},
            checkingList: [],
            loading: false,
            calendarLoading: false,
            statisticsLoading: false,
            holidayLoading: false,
            error: null,
            chartInstance: null

        }
    },
    filters: {
        formatHHMMSS(value) {
            return value.substring(value.length - 8, value.length)
        }
    },
    created() {
            // 获取URL查询参数
            const query = this.$route.query;
            if (query.userId) {
                this.curId = query.userId;
                this.userName = query.userName
            }
            if (query.month) {
                // 将字符串转换为Date对象
                const [year, month] = query.month.split('-');
                this.form.month = query.month;
            }
   },
    computed: {
        ...mapGetters(["userInfo"]),
        calendarDataMap() {
            const map = {}
            this.checkingList.forEach(item => {
                const dateKey = item.dayTime.split(' ')[0]
                 map[dateKey] = item
            })
            return map
        },
        hasUserSearchPermission() {
          const allowedUsers = ['admin', '范达', '陆珉','胡晓芸','王荀','周向宇','阮博','徐梦婕','闫书磊']
          return this.userInfo && allowedUsers.includes(this.userInfo.user_name)
        }
    },
    mounted() {
        this.loadData()
        window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy() {
        if (this.chartInstance) {
            this.chartInstance.dispose()
            this.chartInstance = null
        }
        window.removeEventListener('resize', this.handleResize)
    },

    methods: {
        async getCalendar() {
            this.calendarLoading = true
            try {
                let res = await OriginalStatementApi.getClockInDetails(this.form.userId, `${this.form.month}-01 00:00:00`)
                if (res.data.code === 200 || res.data.code === 0) {
                    this.checkingList = res.data.data
                }
            } catch (error) {
                console.error('加载日历数据失败:', error)
            } finally {
                this.calendarLoading = false
            }
        },

        getList(data) {
            this.curId = data
            this.onLoad()
        },
        async onLoad() {
            this.loadData()
        },
        async loadData() {
            this.form.userId = this.curId ? this.curId : this.userInfo.user_id
            Promise.all([
              this.loadStatistics(),
              this.getCalendar(),
              this.holiday()
            ])
        },
        async loadStatistics() {
            this.statisticsLoading = true
            this.error = null
            try {
                this.form.userId = this.curId ? this.curId : this.userInfo.user_id
                let obj = {
                    size: 10,
                    current: 1
                }
                let postdata = { ...obj, ...this.form }
                let objForm = {}
                for (let key in postdata) {
                    if (postdata[key]) {
                        objForm[key] = postdata[key]
                    }
                }
                let res = await OriginalStatementApi.totalClockInfoPage(objForm)
                const data = res.data.data
                if (data.records.length > 0) {
                    this.checkingInData = { ...this.checkingInData, ...data.records[0] }
                }
            } catch (error) {
                this.error = this.$t('checkingIn.loadDataError') || '加载数据失败'
                console.error('加载考勤数据失败:', error)
            } finally {
                this.statisticsLoading = false
                // 骨架屏关闭后容器才挂载，需下一帧再 init/resize，否则饼图为 0 尺寸或不渲染
                this.$nextTick(() => {
                    this.refreshAttendanceChart()
                })
            }
        },
        /** 有统计数据时同步工时饼图；无数据时释放实例 */
        refreshAttendanceChart() {
            const hasStats = this.checkingInData && Object.keys(this.checkingInData).length > 0
            if (!hasStats) {
                if (this.chartInstance) {
                    this.chartInstance.dispose()
                    this.chartInstance = null
                }
                return
            }
            this.dealCircle()
        },
        dealCircle() {
            const expected = Number(this.checkingInData.expectedWorkingHours || 0)
            const settled = Number(this.checkingInData.totalWorkingHours || 0)
            const gap = Math.max(0, expected - settled)

            let pieData = []
            if (expected <= 0 && settled <= 0) {
                pieData = [{ value: 1, name: '暂无数据', itemStyle: { color: '#ebeef5' } }]
                this.option.color = ['#ebeef5']
            } else if (expected <= 0 && settled > 0) {
                pieData = [{ value: settled, name: '结算总工时' }]
                this.option.color = ['#409EFF']
            } else {
                pieData = [
                    { value: settled, name: '结算总工时' },
                    {
                        value: gap,
                        name: '未结算差额',
                        itemStyle: gap === 0 ? { color: '#ebeef5' } : { color: '#DCDFE6' }
                    }
                ]
                this.option.color = ['#409EFF', gap === 0 ? '#ebeef5' : '#DCDFE6']
            }

            const centerExpected = expected
            this.option.series[0].data = pieData
            this.option.series[0].label.formatter = () =>
                `${centerExpected}\n\n需出勤总工时(小时)`

            this.applyAttendanceChart()
        },
        async applyAttendanceChart() {
            await this.$nextTick()
            await new Promise((resolve) => requestAnimationFrame(resolve))
            const el = this.$refs.attendancePieChart
            if (!el) {
                return
            }
            try {
                const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
                if (this.chartInstance) {
                    const dom = this.chartInstance.getDom && this.chartInstance.getDom()
                    if (dom && dom !== el) {
                        this.chartInstance.dispose()
                        this.chartInstance = null
                    }
                }
                if (!this.chartInstance) {
                    this.chartInstance = echarts.init(el)
                }
                this.chartInstance.setOption(this.option, { notMerge: true })
                this.chartInstance.resize()
            } catch (e) {
                console.error('工时饼图渲染失败:', e)
            }
        },
        banTime() {
            return {
                disabledDate(time) {
                    const date = new Date()
                    const year = date.getFullYear()
                    let month = date.getMonth() + 1
                    if (month >= 1 && month <= 9) {
                        month = '0' + month
                    }
                    const currentdate = year.toString() + month.toString()
                    const timeyear = time.getFullYear()
                    let timemonth = time.getMonth() + 1
                    if (timemonth >= 1 && timemonth <= 9) {
                        timemonth = '0' + timemonth
                    }
                    const timedate = timeyear.toString() + timemonth.toString()
                    return currentdate < timedate
                }
            }
        },
        async getUserList() {
                    this.userListLoading = true
                    try {
                        let res = await scheduleApi.getUserInfoList()
                        if (res.data.code === 200 || res.data.code === 0) {
                            this.userList = res.data.data
                        }
                    } catch (error) {
                        console.error('获取用户列表失败:', error)
                        this.userList = []
                    } finally {
                        this.userListLoading = false
                    }
                },
        filterUserList(queryString, callback) {
                            const results = queryString ? this.userList.filter(user =>
                                user.realName.includes(queryString)
                            ) : this.userList
                            callback(results)
                },
         selectUser(item) {
                            console.log('选择用户:', item)
                            if (!item) return
                            this.userName = item.realName
                            this.curId = item.id
                            console.log('更新后的状态:', { userName: this.userName, curId: this.curId })
                            this.onLoad()
         },
        async holiday(id) {
          this.holidayLoading = true
            try {
                let curId = this.curId ? this.curId : this.userInfo.user_id
                let res = await OriginalStatementApi.getHolidayInfoByUserId(curId)
                if (res.data.code === 0) {
                    this.checkingInData = { ...this.checkingInData, ...res.data.data }
                }
            } catch (error) {
                console.error('加载假期数据失败:', error)
            } finally {
                this.holidayLoading = false
            }
        },
        handleResize() {
            if (this.chartInstance) {
                this.chartInstance.resize()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
// 主容器样式
.attendance-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

// 主内容区域
.main-content {
    gap: 20px;
}

// 侧边栏
.sidebar {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: fit-content;
}

.sidebar-content {
    width: 100%;
}

.person-selector {
    width: 100%;
}

// 主面板
.main-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

// 月份选择器
.month-selector {
    margin-bottom: 10px;
    display: flex;
    gap: 12px;
    align-items: center;
}

.date-picker {
    width: 200px;
        font-size: 16px;

        ::v-deep ep .el-input__inner {
            height: 48px;
            font-size: 16px;
            padding: 0 35px 0 25px;
        }

        ::v-deep ep .el-input__icon {
            line-height: 48px;
            font-size: 18px;
        }
}
.user-selector {
        width: 220px;
            font-size: 16px;

            ::v-deep ep .el-input__inner {
                height: 48px;
                font-size: 16px;
                padding: 0 15px;
            }

            ::v-deep ep .el-input__icon {
                line-height: 48px;
                font-size: 18px;
            }
    }

// 日历部分
.calendar-section {
    margin-bottom: 20px;
}

.calendar-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
}
.calendar-header {
    padding: 16px 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
}

.calendar-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    text-align: center;
}

.attendance-calendar {
    width: 100%;
}

// 日历头部隐藏
::v-deep ep.el-calendar__header {
    display: none;
}

// 日历单元格
.date-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    min-height: 120px;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
        background-color: #f0f9ff;
    }

    &.current-month {
        background-color: #f9fafb;
    }
}

.date-number {
    font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.month-label {
    position: absolute;
    top: 4px;
    left: 4px;
    font-size: 10px;
    color: #909399;
    font-weight: 500;
}
// 打卡状态
.clock-status {
    margin-bottom: 6px;

    .status-normal {
        color: #67C23A;
        font-size: 16px;
    }

    .status-warning {
        width: 16px;
        height: 16px;
    }

    .status-error {
        color: #F56C6C;
        font-size: 16px;
    }
}

// 打卡时间
.clock-times {
    width: 100%;
    text-align: center;
}

// 日历单元格样式
::v-deep ep.el-calendar-table__cell {
    padding: 0;
    height: auto;
    min-height: 120px;
}

// 日历日期单元格
::v-deep ep.el-calendar-day {
    width: 100%;
    height: 100%;
    min-height: 120px;
}

// 日历表格样式
::v-deep ep.el-calendar-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 8px;
}

// 日历表格行样式
::v-deep ep.el-calendar-table__row {
    height: auto;
}

.time-item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-bottom: 4px;
    line-height: 1.5;

    .time-label {
        color: #606266;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .time-value {
        color: #303133;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .time-value-remark {
         color: #303133;
         font-weight: 600;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
         background-color: #FFFACD;
         padding: 2px 6px;
         border-radius: 4px;
    }
}

// 统计部分
.statistics-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

// 统计卡片
.stat-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    background-color: #fff;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
    }
}

// 卡片标题
.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
}

// 圆形图表
.cicle {
    height: 210px;
    margin-bottom: 20px;
}

// 统计详情：第一行出勤天数，第二行工时（窄栏内避免四列挤在一行）
.stat-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
}

.stat-details-row {
    display: flex;
    justify-content: space-around;
    align-items: stretch;

    &--hours {
        padding: 12px 8px;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
    }
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-value {
        font-size: 28px;
                    font-weight: 700;
                    color: #303133;
                    margin-bottom: 8px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .stat-label {
        display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #606266;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
}

// 状态点
.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;

    &.normal {
        background-color: #67C23A;
    }

    &.absent {
        background-color: #F56C6C;
    }

    &.hours {
        &.hours--expected {
            background-color: #909399;
        }

        &.hours--total {
            background-color: #409eff;
        }
    }
}

// 异常考勤摘要
.abnormal-summary {
    height: 100%;
}

// 异常分类
.abnormal-categories {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .category-icon {
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.1);
        }
    }

    .category-info {
        text-align: center;

        .category-value {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
        }

        .category-label {
            font-size: 14px;
            color: #606266;
        }
    }
}

// 请假信息
.leave-info {
    margin-top: 30px;

    .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 16px;
    }

    .leave-items {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }

    .leave-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background-color: #f5f7fa;
        border-radius: 6px;

        .leave-value {
            font-weight: 600;
            color: #303133;
            margin-right: 8px;
        }

        .leave-label {
            color: #606266;
            font-size: 14px;
        }
    }
}

// 异常详情
.abnormal-details {
    padding-left: 20px;
    border-left: 1px solid #e4e7ed;

    .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 6px 0;

        .detail-value {
            font-weight: 600;
            color: #F56C6C;
            margin-right: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .detail-label {
            color: #606266;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
    }
}

// 请假卡片
.leave-cards {
    display: flex;
    gap: 20px;
}

.leave-card {
    height: 100%;

    .leave-card-header {
        margin-bottom: 16px;
    }

    .leave-card-body {
        .leave-info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding: 8px 0;

            .info-label {
                color: #606266;
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }

            .info-value {
                font-weight: 600;
                color: #303133;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
        }
    }
}

// 对话框
.attendance-dialog {
    border-radius: 12px;
    overflow: hidden;

    ::v-deep ep .el-dialog__header {
        background-color: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
    }

    ::v-deep ep .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
    }

    ::v-deep ep .el-dialog__body {
        padding: 24px;
    }

    ::v-deep ep .el-dialog__footer {
        padding: 16px 24px;
        border-top: 1px solid #e4e7ed;
        background-color: #fafafa;
    }
}

// 错误提示样式
.error-alert {
    margin-bottom: 20px;
    border-radius: 8px;
}

// 响应式设计
@media (max-width: 1200px) {
    .main-content {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
    }

    .abnormal-categories {
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .category-item {
        flex-direction: row;
        gap: 12px;
        width: 100%;
        justify-content: flex-start;
    }

    .leave-cards {
        flex-direction: column;
    }
}

@media (max-width: 992px) {
    .attendance-container {
        padding: 15px;
    }

    .main-content {
        gap: 15px;
    }

    .date-picker {
        width: 200px;

        ::v-deep ep .el-input__inner {
            height: 40px;
            font-size: 14px;
        }

        ::v-deep ep .el-input__icon {
            line-height: 40px;
            font-size: 16px;
        }
    }

    .stat-card {
        padding: 15px;
    }

    .card-title {
        font-size: 15px;
        margin-bottom: 15px;
        padding-bottom: 8px;
    }
}

@media (max-width: 768px) {
    .attendance-container {
        padding: 10px;
    }

    .main-content {
        gap: 10px;
    }

    .date-picker {
        width: 100%;
    }

    .user-selector {
        width: 100%;
    }

    .calendar-section {
        margin-bottom: 15px;
    }

    .statistics-section {
        gap: 15px;
    }

    .abnormal-details {
        padding-left: 15px;
        border-left: none;
        border-top: 1px solid #e4e7ed;
        padding-top: 15px;
        margin-top: 15px;
    }

    .leave-items {
        gap: 12px;
    }

    .leave-item {
        padding: 6px 10px;
        font-size: 13px;
    }

    .cicle {
        height: 180px;
    }

    .stat-value {
        font-size: 20px;
    }

    .category-icon {
        width: 40px;
        height: 40px;
    }

    .category-value {
        font-size: 16px;
    }

    .category-label {
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .attendance-container {
        padding: 8px;
    }

    .date-number {
        font-size: 13px;
    }

    .time-item {
        font-size: 11px;
    }

    .cicle {
        height: 150px;
    }

    .stat-value {
        font-size: 18px;
    }

    .stat-label {
        font-size: 12px;
    }

    .category-icon {
        width: 32px;
        height: 32px;
    }

    .leave-info-item {
        padding: 6px 0;
    }

    .info-label,
    .info-value {
        font-size: 13px;
    }
}
</style>
