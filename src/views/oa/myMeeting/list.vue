<template>
    <basic-container>
        <avue-form v-model="form" :option="option" @submit="handleSubmit" ref="form">
            <template slot-scope="{ size }" slot="menuForm">
                <el-button type="primary" :size="size" icon="el-icon-refresh" @click="refresh">{{ $t('commonContent.refresh') }}</el-button>
            </template>
        </avue-form>
        <el-table  :data="tableData" ref="multipleTable" v-if="!isSwiper" row-key="id"
            style="width: 100%; margin-top: 20px" stripe align="center" border>
            <el-table-column  prop="conferenceName" :label="$t('meeting.conferenceName')" align="center" >
                <template slot-scope="scope">
                    <div @click="cellClick(scope.row)">{{scope.row.conferenceName  }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="room" :label="$t('meeting.room')" align="center" />
            <el-table-column prop="conferenceConvener" :label="$t('meeting.conferenceConvener')" align="center" />
            <el-table-column prop="conferenceContacts" :label="$t('meeting.conferenceContacts')" align="center" />
            <el-table-column prop="createUserName" :label="$t('commonContent.createUserName')" align="center" />
            <el-table-column prop="createTime" :label="$t('meeting.createTime')" align="center" />
            <el-table-column prop="conferenceStatus" :formatter="statusFormatter" :label="$t('meeting.conferenceStatus')" align="center" />
            <el-table-column prop="startTime" :label="$t('meeting.startTime')" align="center" />
            <el-table-column prop="endTime" :label="$t('meeting.endTime')" align="center" />
                <el-table-column fixed="right" :label="$t('meeting.operate')" width="220" align="center">
                <template slot-scope="scope">
                    <div @click="stopEvent">
                        <el-tooltip v-if="isDoingAndCreate(scope.row)" class="pr10" effect="dark" :content="$t('meeting.endMeeting')"
                            placement="top-end">
                            <img @click="endMeeting(scope.row)" src="@/assets/png/btn_close.png" width="24" alt="">
                        </el-tooltip>
                        <el-tooltip v-if="isDoingAndCreate(scope.row)" class="pr10" effect="dark" :content="$t('meeting.delayMeeting')"
                            placement="top-end">
                            <img @click="delayMeetingDo(scope.row)" src="@/assets/png/btn_delayed.png" width="24" alt="">
                        </el-tooltip>
                        <el-tooltip class="pr10" effect="dark" :content="$t('meeting.meetingWrite')" placement="top-end">
                            <img @click="meetingWrite(scope.row)" src="@/assets/png/btn_meetingminutes.png" width="24" alt="">
                        </el-tooltip>
                        <el-tooltip v-if="isUnDoingAndCreate(scope.row)" class="pr10" effect="dark" :content="$t('meeting.cancelMeeting')"
                            placement="top-end">
                            <img @click="cancelMeeting(scope.row)" src="@/assets/png/btn_revoke.png" width="24" alt="">
                        </el-tooltip>
                        <el-tooltip v-if="isUnDoingAndCreate(scope.row)" class="pr10" effect="dark" :content="$t('meeting.updateMeeting')"
                            placement="top-end">
                            <img @click="updateMeeting(scope.row)" src="@/assets/png/btn_change.png" width="24" alt="">
                        </el-tooltip>
                        <el-tooltip class="pr10" effect="dark" :content="$t('meeting.meetingFiles')" placement="top-end">
                            <img @click="meetingFiles(scope.row)" src="@/assets/svg/meeting/file.svg" width="24" alt="">
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <!--分页-->
        <el-pagination v-if="!isSwiper" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"></el-pagination>
        <delayMeeting ref="delayMeeting" :row="curRow"></delayMeeting>
        <meetingSummary ref="meetingSummary" :row="curRow"></meetingSummary>
        <fileAdd ref="meetingFiles" :row="curRow"></fileAdd>
    </basic-container>
</template>

<script>
import meetingSummary from './components/meetingSummary'
import fileAdd from './components/fileAdd'
import meetingApi from '@/api/meeting/index'
import Operate from './operate'
import delayMeeting from './components/delayMeeting'
export default {
    components: {
        meetingSummary,
        delayMeeting,
        fileAdd
    },
    data() {
        return {
            intervalId: null,
            isSwiper: false,
            curRow:null,
            option: {
                size: "mini",
                span: 6,
                menuPosition: "left",
                submitText: this.$t('commonContent.search'),
                submitIcon: "el-icon-search",
                emptyBtn: false,
                column: [
                    {
                        type: "input",
                        label: this.$t('meeting.conferenceConvener'),
                        allowCreate: true,
                        filterable: true,
                        prop: "conferenceConvener",
                    },
                    {
                        type: "input",
                        label: this.$t('meeting.conferenceName'),
                        allowCreate: true,
                        filterable: true,
                        prop: "conferenceName",
                    },
                    {
                        type: "input",
                        label: this.$t('meeting.room'),
                        allowCreate: true,
                        filterable: true,
                        prop: "room",
                    },
                    {
                        type: "daterange",
                        label: this.$t('meeting.meetingTime'),
                        format: 'yyyy-MM-dd',
                        valueFormat: 'yyyy-MM-dd',
                        allowCreate: true,
                        filterable: true,
                        prop: "meetingTimer",
                        change:this.getTimer
                    },
                ],
            },
            tableData: [],
            queryInfo: {
                query: "",
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            form: {
                conferenceConvener:'',
                conferenceName:"",
                room:"",
                meetingTimer:[],
                endTime:"",
                startTime:""

            }
        };
    },
    created() {
        this.getList({});
    },
    mounted() {

    },
    activated() {
        if (this.$route.query.reflesh) {
            this.getList()
        }
    },
    methods: {
        getList() {
            this.form.current = this.queryInfo.pageNum
            this.form.size = this.queryInfo.pageSize
            let obj = {}
            for(let key in this.form){
                if(this.form[key]){
                    obj[key] = this.form[key]
                }
            }
            meetingApi.getList(obj).then(
                (res) => {
                    this.tableData = res.data.data.records;
                    this.queryInfo.total = res.data.data.total;
                }
            );
        },
        getTimer(e){
            // console.log(e)
            // console.log(this.form.meetingTimer)
            if(e.value){
                this.form.startTime = e.value[0]
                this.form.endTime =  e.value[1]
            }else{
                this.form.startTime = ''
                this.form.endTime = ''
            }
            // console.log(this.form)
        },
        isDoingAndCreate(row) {
            return row.conferenceStatus === 1 && row.isCreateUser
        },
        isUnDoingAndCreate(row) {
            return row.conferenceStatus === 0 && row.isCreateUser
        },
        stopEvent(event) {
            event.stopPropagation();
        },
        endMeeting(row) {
            Operate.endMeeting(this, row)
        },
        delayMeetingDo(row) {
            Operate.delayMeeting(this,row)
        },
        delaySubmit(row) {
            this.curRow = row
            Operate.delaySubmit(this, row)
        },
        meetingWrite(row) {
            this.curRow = row
            Operate.meetingWrite(this, row)
        },
        cancelMeeting(row) {
            Operate.cancelMeeting(this, row)
        },
        updateMeeting(row) {
            Operate.updateMeeting(this, row.id, 'isEdit')
        },

        cellClick(row) {
            console.log('rouw')
            Operate.updateMeeting(this, row.id, 'isDetail','isList')
        },
        meetingFiles(row){
            this.curRow = row
            Operate.meetingFiles(this, row)
        },
        statusFormatter(row, column, cellValue) {
            let statusKeyValue = {
                0: '未开始',
                1: '进行中',
                2: '结束',
                3: '已取消'
            }
            return statusKeyValue[cellValue]
        },
        handleSubmit(form, done) {
            this.form = form;
            this.queryInfo.pageNum = 1;
            this.getList(form);
            done();
        },

        toDetail(row) {
            this.$router.push(`/photoWallAdd?id=${row.id}`)
        },
        resetEditForm() {

        },
        refresh() {
            this.$refs.form.resetForm();
            this.queryInfo.pageNum = 1;
            this.queryInfo.pageSize = 10
            this.getList({});
        },
        handleCurrentChange(currentPage) {
            // console.log("currentPage-->" + currentPage);
            this.queryInfo.pageNum = currentPage;
            this.getList({});
        },
        handleSizeChange(pageSize) {
            this.queryInfo.pageSize = pageSize;
            this.getList({});
        },

    }
};
</script>

<style></style>
