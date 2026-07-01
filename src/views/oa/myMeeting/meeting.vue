<template>
    <basic-container class="container">
        <el-tabs type="border-card" @tab-click="changeTab">
            <el-tab-pane :label="$t('meeting.currentMeeting')" >
                <div v-if="listMeeting.length===0">{{ $t('commonContent.noData') }}</div>
                <meetingCard :list="listMeeting" @toDetail="toDetail">
                    <template v-slot:myButton={row}>
                        <div @click="stopEvent">
                            <el-tooltip class="pr10" v-if="isDoingAndCreate(row)"  effect="dark" :content="$t('meeting.endMeeting')" placement="top-end">
                                <img @click="endMeeting(row)" src="@/assets/png/btn_close.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" v-if="isDoingAndCreate(row)"  effect="dark" :content="$t('meeting.delayMeeting')" placement="top-end">
                                <img @click="delayMeetingDo(row)" src="@/assets/png/btn_delayed.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" effect="dark" :content="$t('meeting.meetingRecord')" placement="top-end">
                                <img @click="meetingWrite(row)" src="@/assets/png/btn_meetingminutes.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip  v-if="isUnDoingAndCreate(row)" class="pr10" effect="dark" :content="$t('meeting.cancelMeeting')" placement="top-end">
                                <img @click="cancelMeeting(row)" src="@/assets/png/btn_revoke.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" v-if="isUnDoingAndCreate(row)" effect="dark" :content="$t('meeting.updateMeeting')" placement="top-end">
                                <img @click="updateMeeting(row)" src="@/assets/png/btn_change.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" effect="dark" :content="$t('meeting.meetingFiles')" placement="top-end">
                            <img @click="meetingFiles(row)" src="@/assets/svg/meeting/file.svg" width="24" alt="">
                        </el-tooltip>
                        </div>
                    </template>
                </meetingCard>
            </el-tab-pane>
            <el-tab-pane :label="$t('meeting.myMeeting')">
                <div v-if="listMeeting.length===0">{{ $t('commonContent.noData') }}</div>
                  <meetingCard :list="listMeeting"  @toDetail="toDetail">
                    <template v-slot:myButton={row}>
                        <div @click="stopEvent">
                            <el-tooltip v-if="isDoingAndCreate(row)"  class="pr10" effect="dark" :content="$t('meeting.endMeeting')" placement="top-end">
                                <img @click="endMeeting(row)" src="@/assets/png/btn_close.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip v-if="isDoingAndCreate(row)"  class="pr10" effect="dark" :content="$t('meeting.delayMeeting')" placement="top-end">
                                <img @click="delayMeetingDo(row)" src="@/assets/png/btn_delayed.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" effect="dark" :content="$t('meeting.meetingRecord')" placement="top-end">
                                <img @click="meetingWrite(row)" src="@/assets/png/btn_meetingminutes.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" v-if="isUnDoingAndCreate(row)" effect="dark" :content="$t('meeting.cancelMeeting')" placement="top-end">
                                <img @click="cancelMeeting(row)" src="@/assets/png/btn_revoke.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" v-if="isUnDoingAndCreate(row)" effect="dark" :content="$t('meeting.updateMeeting')" placement="top-end">
                                <img @click="updateMeeting(row)" src="@/assets/png/btn_change.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" effect="dark" :content="$t('meeting.meetingFiles')" placement="top-end">
                            <img @click="meetingFiles(row)" src="@/assets/svg/meeting/file.svg" width="24" alt="">
                        </el-tooltip>
                        </div>
                    </template>
                </meetingCard>
            </el-tab-pane>
            <el-tab-pane :label="$t('meeting.historyMeeting')">
                <div v-if="listMeeting.length===0">{{ $t('commonContent.noData') }}</div>
                <meetingCard :list="listMeeting" @toDetail="toDetail">
                    <template v-slot:myButton={row}>
                        <div @click="stopEvent">
                            <el-tooltip class="pr10" effect="dark" :content="$t('meeting.meetingRecord')" placement="top-end">
                                <img @click="meetingWrite(row)" src="@/assets/png/btn_meetingminutes.png" width="24" alt="">
                            </el-tooltip>
                            <el-tooltip class="pr10" effect="dark" content="会议文档" placement="top-end">
                            <img @click="meetingFiles(row)" src="@/assets/svg/meeting/file.svg" width="24" alt="">
                        </el-tooltip>
                        </div>
                    </template>
                </meetingCard>
            </el-tab-pane>
        </el-tabs>
        <delayMeeting ref="delayMeeting" :row="curRow"></delayMeeting>
        <meetingSummary :row="curRow" ref="meetingSummary"></meetingSummary>
        <fileAdd ref="meetingFiles" :row="curRow"></fileAdd>
   </basic-container>
</template>

<script>

import meetingSummary from './components/meetingSummary'
import meetingCard from './components/meetingCard'
import Operate from './operate'
import delayMeeting from './components/delayMeeting'
import meetingApi from '@/api/meeting/index'
import { mapGetters } from "vuex";
import fileAdd from './components/fileAdd'
export default {
    components: {

        meetingSummary,
        meetingCard,
        delayMeeting,
        fileAdd
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    data() {
        return {
            curRow: {},
            listMeeting: [],
            form: {
                current: 1,
                size: 100
            },
            curMeetingObj: { "isJoin": true, "statusList": [0, 1] },
            myCreateObj: {
                "statusList": [0, 1],
                "createUser": ''
            },
            historyObj: {
                "isJoin": true,
                "statusList": [2]
            }
        }
    },
    created() {
        this.getList(this.curMeetingObj);
    },
    methods: {
        getList(obj) {
            meetingApi.getTabList(obj).then(
                (res) => {
                    this.listMeeting = res.data.data;
                }
            );
        },
        stopEvent(event) {
            event.stopPropagation();
        },
        changeTab(v) {
            this.myCreateObj.createUser = this.userInfo.user_id
            let obj = {
                "0": this.curMeetingObj,
                "1": this.myCreateObj,
                "2": this.historyObj
            }
            this.getList(obj[v.index])
        },
        isDoingAndCreate(row) {
            return row.conferenceStatus === 1 && row.isCreateUser
        },
        isUnDoingAndCreate(row) {
            return row.conferenceStatus === 0 && row.isCreateUser
        },
        meetingFiles(row){
            this.curRow = row
            Operate.meetingFiles(this, row)
        },
        endMeeting(row) {
            Operate.endMeeting(this, row)
        },
        delayMeetingDo(row) {
            this.curRow = row
            Operate.delayMeeting(this, row)
        },
        delaySubmit(row) {
            this.curRow = row
            Operate.delaySubmit(this, row)
        },
        async meetingWrite(row) {
            this.curRow = await row
            Operate.meetingWrite(this, row)
        },
        cancelMeeting(row) {
            Operate.cancelMeeting(this, row)
        },
        updateMeeting(row) {
            Operate.updateMeeting(this, row.id, 'isEdit')
        },
        toDetail(add, id, type) {
            this.$emit('toDetail', add, id, 'isDetail','isMyMeeting')
        }
    }
}
</script>

<style>
.container {
    height: 80vh;
}

.row-card {
    display: flex;
}

.button-right {
    margin-left: auto;
}
</style>
