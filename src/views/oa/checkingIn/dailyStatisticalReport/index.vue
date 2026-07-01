<template>
    <basic-container>
        <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
            :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
            @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot="menuLeft">
                <div class="btn ">
                    <el-button size="small" type="primary" icon="el-icon-download" @click="handleExport">导出
                    </el-button>
                </div>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>

import OriginalStatementApi from '@/api/checkingIn/originalStatement/index'
import { downBlobFile,yearMonth } from '@/util/util'
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
            form: {
                "day": "",
                "month": yearMonth(),
                "realName": "",      
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
                //dialogType: 'drawer',
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                    {
                        label: "姓名",
                        prop: "realName",
                        searchSpan: 8,
                        search: true,
                    },
                    {
                        label: "月份",
                        prop: "month",
                        type: "month",
                        searchSpan: 8,
                        search: true,
                        hide: true,
                        valueFormat:'yyyy-MM',
                        change:this.getTimer
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
                        display: false,
                    },
                    {
                        label: "日期",
                        prop: "attendanceRequired",
                        display: false,
                    },
                    {
                        label: "班次",
                        prop: "expectedWorkingHours",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: "上班",
                        prop: "clockInDevice",
                        children: [
                            {
                                label: "打卡时间",
                                prop: "yearLeave",
                            },
                            {
                                label: "考勤结果",
                                prop: "restDayOvertime",
                            },
                            
                        ]
                    },
                    {
                        label: "下班",
                        prop: "clockInDevice",
                        children: [
                            {
                                label: "打卡时间",
                                prop: "yearLeave",
                            },
                            {
                                label: "考勤结果",
                                prop: "restDayOvertime",
                            },
                            
                        ]
                    },
                    {
                        label: "应出勤天数(天)",
                        prop: "realityRequired",
                        search: false,
                        display: false,
                    },
                    {
                        label: "应工作时长(小时)",
                        prop: "realityRequired",
                        search: false,
                        display: false,
                    },
                    {
                        label: "实际出勤天数(天)",
                        prop: "realityRequired",
                        search: false,
                        display: false,
                    },
                    {
                        label: "实际工作时长(小时)",
                        prop: "realityWorkingHours",
                        search: false,
                        display: false,
                    },
                    {
                        label: "迟到Arrive late(次)",
                        prop: "arriveLate",
                        display: false,
                        search: false,
                    },
                    {
                        label: "迟到时长(小时)",
                        prop: "arriveLateTime",
                        // display: false,
                        search: false,
                    },
                    {
                        label: "严重迟到(次)",
                        prop: "severeLate",
                        search: false,
                        display: false,
                    },
                    {
                        label: "严重迟到时长(小时)",
                        prop: "severeLateTime",
                        search: false,
                        display: false,
                    },
                    {
                        label: "早退（次）",
                        prop: "earlyLeave",
                        search: false,
                        display: false,
                    },
                    {
                        label: "早退时长（小时）",
                        prop: "earlyLeaveTime",
                        search: false,
                        display: false,
                    },
                    {
                        label: "严重早退（次）",
                        prop: "severEarlyLeave",
                        search: false,
                        display: false,
                    },
                    {
                        label: "严重早退时长（小时）",
                        prop: "severEarlyLeaveTime",
                        search: false,
                        display: false,
                    },
                    {
                        label: "旷工",
                        prop: "absenteeism",
                        search: false,
                        display: false,
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
                                prop: "restDay",
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
                ],
            },
        }
    },
    components: {

    },
    methods: {
        async onLoad(page, params = {}) {   
            let obj = {
                size: page.pageSize,
                current: page.currentPage
            }
            let postdata = { ...obj,  ...this.query, ...this.form }
            let objForm = {}
            for(let key in postdata){
                if(postdata[key]){
                    objForm[key] = postdata[key]
                }
            }
            this.loading = true;
            await OriginalStatementApi.dayClockInfoPage(
                objForm
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records||[];
                this.loading = false;
            });
        }, 
        getTimer(v){
            this.form.month = v.value||yearMonth()
        },
        async handleExport() {
            let res = await OriginalStatementApi.originalStatementExport()
            downBlobFile(res.data, '每日统计报表')
        },
        searchReset() {
            this.query = {};
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
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
        },
        refreshChange() {
            this.onLoad(this.page, this.query);
        },
    }
}
</script>