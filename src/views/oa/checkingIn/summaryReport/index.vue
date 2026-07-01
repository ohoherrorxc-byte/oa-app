<template>
    <basic-container>
        <el-form label-width="100px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="姓名">
                        <el-input v-model="form.realName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="月份">
                        <el-date-picker v-model="form.month" value-format="yyyy-MM" type="month" placeholder="选择月">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="部门">
                        <el-select v-model="form.deptName">
                            <el-option v-for="item in deptList" :key="item.id" :label="item.deptName"
                                :value="item.deptName"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="">
                        <el-button type="primary" @click="onLoad">查 询</el-button>
                        <el-button @click="searchReset">清 空</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="pb10">
                <el-button size="small" type="primary" icon="el-icon-download" @click="handleExport">导 出</el-button>
            </el-row>
        </el-form>
        <el-table :data="data" v-loading="loading">
            <el-table-column v-if="item.display !== false" align='center' v-for="item in option.column" :label="item.label" :key='item'>
                            <template slot-scope="scope">
                                <div v-if="item.prop === 'realName'">{{ scope.row[item.prop] }}</div>
                                <div v-else-if="!item.children" :style="item.cellStyle">{{ scope.row[item.prop] }}</div>
                            </template>
                <el-table-column align='center' v-if="item.children" v-for="subItem in item.children" :label="subItem.label"
                    :prop="subItem.prop"> </el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination class="fr" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage"
            :page-sizes="[10, 100, 200, 300, 400]" :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
    </basic-container>
</template>

<script>
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import OriginalStatementApi from '@/api/checkingIn/originalStatement/index'
import { downBlobFile, getDatesInCurrentMonth, deepClone, yearMonth } from '@/util/util'
export default {
    data() {
        return {
            activeName: "all",
            search: {},
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            data: [],
            deptList: [],
            form: {
                "day": "",
                "endTime": "",
                "month": yearMonth(),
                "realName": "",
                "deptName": "",
                "startTime": "",
            },
            option: {
                height: 600,
                calcHeight: 80,
                tip: false,
                searchShow: true,
                searchMenuSpan: 100,
                border: true,
                index: true,
                align: 'center',
                selection: true,
                viewBtn: false,
                addBtn: false,
                editBtn: false,
                delBtn: false,
                menu: false,
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                    {
                        label: "姓名",
                        prop: "realName",
                        searchSpan: 8,
                        search: true,
                        change: this.getName
                    },
                    {
                        label: "月份",
                        prop: "month",
                        type: "month",
                        format: 'yyyy-MM',
                        valueFormat: 'yyyy-MM',
                        searchSpan: 8,
                        search: true,
                        hide: true,
                        display: false,
                        // searchValue:yearMonth(),
                        change: this.getTimer
                    },
                    {
                        label: "分部",
                        prop: "company",
                        search: false,

                    },
                    {
                        label: "部门",
                        prop: "deptName",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: true,
                    },
                    {
                        label: "应出勤天数(天)",
                        prop: "attendanceRequired",
                        display: true,
                    },
                    {
                        label: "应工作时长(小时)",
                        prop: "expectedWorkingHours",
                        width: 100,
                        search: false,
                        display: true,
                        cellStyle: {
                           'font-size': '16px',
                           'font-weight': 'bold'
                        }
                    },
                    {
                        label: "实际出勤天数(天)",
                        prop: "realityRequired",
                        search: false,
                        display: true,
                    },
                    {
                        label: "实际工作时长(小时)",
                        prop: "realityWorkingHours",
                        search: false,
                        display: true,
                    },
                    {
                        label: "结算总工时(小时)",
                        prop: "workingHoursTotal",
                        search: false,
                        display: true,
                        cellStyle: {
                              'font-size': '16px',
                              'font-weight': 'bold'
                        }
                    },
                    {
                        label: "迟到Arrive late(次)",
                        prop: "arriveLate",
                        display: true,
                        search: false,
                    },
                    {
                        label: "迟到时长(小时)",
                        prop: "arriveLateTime",
                        search: false,
                    },
                    {
                        label: "严重迟到(次)",
                        prop: "severeLate",
                        search: false,
                        display: true,
                    },
                    {
                        label: "严重迟到时长(小时)",
                        prop: "severeLateTime",
                        search: false,
                        display: true,
                    },
                    {
                        label: "早退（次）",
                        prop: "earlyLeave",
                        search: false,
                        display: true,
                    },
                    {
                        label: "早退时长（小时）",
                        prop: "earlyLeaveTime",
                        search: false,
                        display: true,
                    },
                    {
                        label: "严重早退（次）",
                        prop: "severEarlyLeave",
                        search: false,
                        display: true,
                    },
                    {
                        label: "严重早退时长（小时）",
                        prop: "severEarlyLeaveTime",
                        search: false,
                        display: true,
                    },
                    {
                        label: "旷工",
                        prop: "absenteeism",
                        search: false,
                        display: true,
                    },
                    {
                        label: "旷工时长",
                        prop: "absenteeismTime",
                        search: false,
                        display: true,
                    },
                    {
                        label: "漏签",
                        prop: "forgetClockIn",
                        search: false,
                        display: true,
                    },
                    {
                        label: "请假",
                        prop: "clockInDevice",
                        children: [
                            {
                                label: "年假（天）",
                                prop: "yearLeave",
                            },
                            {
                                label: "调休（小时）",
                                prop: "restHour",
                            },
                            {
                                label: "事假（天）",
                                prop: "absenceLeave",
                            },
                            {
                                label: "病假（天）",
                                prop: "weekLeave",
                            },
                            {
                                label: "产假（天）",
                                prop: "maternityLeave",
                            },
                            {
                                label: "陪产假（天）",
                                prop: "paternityLeave",
                            },
                            {
                                label: "婚假（天）",
                                prop: "marriageLeave",
                            },
                            {
                                label: "丧假（天）",
                                prop: "funeralLeave",
                            },
                            {
                                label: "哺乳假（小时）",
                                prop: "breastfeedingLeave",
                            },
                            {
                                label: "育儿假（天）",
                                prop: "paternityChildLeave",
                            },
                            {
                                label: "小产假（天）",
                                prop: "minorMaternityLeave",
                            },
                            {
                                label: "其他假期（小时）",
                                prop: "otherLeave",
                            }
                        ]
                    },
                    {
                        label: "加班",
                        prop: "clockInDevice",
                        children: [
                            {
                                label: "关联调休",
                                children: [
                                    {
                                        label: "工作日加班（小时）",
                                        prop: "workDayOvertime",
                                    },
                                    {
                                        label: "休息日加班（天）",
                                        prop: "restDayOvertime",
                                    },
                                    {
                                        label: "节假日加班（天）",
                                        prop: "holidayWorkOvertime",
                                    },
                                ]
                            },
                            {
                                label: "总计（小时）",
                                prop: "workOvertimeTotal",
                            }

                        ]
                    },
                    {
                        label: "出差（天）",
                        prop: "businessTrips",
                        search: false,
                        display: true,
                    },
                    {
                        label: "公出(天)",
                        prop: "publicity",
                        search: false,
                        display: true,
                    },

                    {
                        label: "工作总时长(小时)",
                        prop: "totalWorkingHours",
                        search: false,
                        display: true,
                    }, {
                        label: '考勤日历',
                        prop: 'kaoqinrili',
                        children: [{}]
                    }
                ],
            },
            loading:false
        }
    },
    components: {

    },
    mounted() {
        // this.dealHeadList()
        this.onLoad()
        this.getDeptList()
    },
    methods: {
        async onLoad() {
            let obj = {
                size: this.page.pageSize,
                current: this.page.currentPage
            }
            let postdata = { ...obj, ...this.query, ...this.form }
            let objForm = {}
            for (let key in postdata) {
                if (postdata[key]) {
                    objForm[key] = postdata[key]
                }
            }
            this.loading = true;
            await OriginalStatementApi.totalClockInfoPage(
                objForm
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records || [];
                this.data.map(ele => {
                    if (ele.monthDay) {
                        for (let key in ele.monthDay) {
                            ele[key] = ele.monthDay[key]
                        }
                    }
                })
                this.dealHeadList()
                this.loading = false;

            });
        },
        dealHeadList() {
            let list = getDatesInCurrentMonth(`${this.form.month}-01`)
            // const column = this.findObject(this.option.column, "kaoqinrili")
            let header = []
            list.map(ele => {
                header.push({
                    label: `${ele}`,
                    prop: ele,
                })
            })
            let newValue = {
                label: '考勤日历',
                prop: 'kaoqinrili',
                children: header,
                index: ""
            }
            this.option.column.splice(25, 1)
            this.$set(this.option.column, 25, newValue)
        },
        getName(v) {
            this.form.realName = v.value
        },
        getTimer(v) {
            this.form.month = v.value || yearMonth()
        },
        async handleExport() {
            let res = await OriginalStatementApi.totalClockInfoExport(this.form)
            downBlobFile(res.data, '考勤汇总报表')
        },
        getDeptList() {
            getLazyList('', 629965).then((res) => {
                this.deptList = res.data.data;
            });
        },
        searchReset() {
            this.query = {};
            this.page = {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            }
            this.form.month = yearMonth()
            this.form.realName = ''
            this.form.deptName = ''
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            this.page.currentPage = 1;
            this.onLoad(this.page, params);
            done();
        },

        currentChange(currentPage) {
            this.page.currentPage = currentPage;
            this.onLoad();
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.onLoad();
        },
        refreshChange() {
            this.onLoad(this.page, this.query)
        },
    }
}
</script>
