<template>
    <div>
        <el-form ref="form" :model="form" :disabled="isDetail" :rules="rules" label-width="0px">
            <el-form-item prop="conferenceType">
                <div class="flex-center">
                    <img class="icon-left-title" src="@/assets/svg/meeting/list.svg" alt="">
                    <el-select :disabled="isEdit" v-model="form.conferenceType" placeholder="请选择会议类型" clearable>
                        <el-option v-for="item in meetingTypeList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item prop="conferenceName">
                <div class="flex-center">
                    <img class="icon-left-title" src="@/assets/svg/meeting/title.svg" alt="">
                    <el-input :disabled="isEdit" placeholder="请输入会议标题" v-model="form.conferenceName" clearable></el-input>
                </div>
            </el-form-item>
            <el-form-item prop="conferenceConvenerId">
                <div class="flex-center">
                    <el-tooltip class="item" effect="dark" content="召集人" placement="top-start">
                        <div class="icon-left-title">
                            <img width="16" src="@/assets/svg/meeting/people.svg" alt="">
                        </div>
                    </el-tooltip>

                    <autoAddress ref="autoAddress" :initList="initList" class="w-100" @getPerson="getConferenceConvener"
                        placeholder="召集人" :initData="form.conferenceConvenerId" :disabled="isEdit" :multiple="false">
                    </autoAddress>
                </div>
            </el-form-item>
            <el-form-item prop="conferenceContactsId">
                <div class="flex-center">
                    <el-tooltip class="item" effect="dark" content="联系人" placement="top-start">
                        <img class="icon-left-title" src="@/assets/svg/meeting/more_people.svg" alt="">
                    </el-tooltip>
                    <autoAddress placeholder="联系人" ref="autoAddress" :initList="initList" class="w-100"
                        @getPerson="getConferenceContacts" :initData="form.conferenceContactsId" :disabled="isEdit"
                        :multiple="false"></autoAddress>
                    <!-- <el-select @change='getConferenceContacts' :disabled="isEdit" v-model="form.conferenceContactsId"
                        placeholder="联系人" clearable>
                        <el-option v-for="item in personList" :key="item.userId" :value="item.userId"
                            :label="item.userName"></el-option>
                    </el-select> -->
                </div>
            </el-form-item>
            <el-form-item prop="conferenceContent">
                <div class="flex">
                    <div class="icon-left-title">
                        <img width="22" src="@/assets/svg/meeting/content.svg" alt="">
                    </div>
                    <el-input type="textarea" :rows="2" placeholder="请输入会议内容" clearable v-model="form.conferenceContent">
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item prop="meetingTimer">
                <div class="flex-center">
                    <div class="icon-left-title">
                        <img width="17" src="@/assets/svg/meeting/clock.svg" alt="">
                    </div>
                    <el-date-picker   @change="getTimer" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"
                        v-model="form.meetingTimer" clearable type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item prop="room">
                <div class="flex-center">
                    <img class="icon-left-title" src="@/assets/svg/meeting/place.svg" alt="">
                    <el-select v-model="form.room" placeholder="会议室" clearable>
                        <el-option v-for="item in roomList" :label="item.label" :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item prop="customRoom">
                <div class="flex-center">
                    <img class="icon-left-title" src="@/assets/svg/meeting/place.svg" alt="">
                    <el-input placeholder="自定义会议地点" v-model="form.customRoom" clearable></el-input>
                </div>
            </el-form-item>
            <el-form-item prop="reminderTime">
                <div class="flex-center">
                    <img class="icon-left-title" src="@/assets/svg/meeting/mention.svg" alt="">
                    <el-select v-model="form.reminderTime" placeholder="开始前15分钟提醒" clearable>
                        <el-option v-for="item in reminderList " :label="item.label" :value="item.value"
                            :key="item.key"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item prop="userIds">
                <div class="flex-center">
                    <el-tooltip class="item" effect="dark" content="参会人员" placement="top-start">
                        <img class="icon-left-title" src="@/assets/svg/meeting/more_people.svg" alt="">
                    </el-tooltip>
                    <autoAddress placeholder="请选择参会人员" ref="autoAddress" :initList="initList" class="w-100"
                        @getPerson="getUserMeeting" :initData="form.userIds" :disabled="isEdit" :multiple="true">
                    </autoAddress>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button class="mt10" @click="submit" type="primary">提交</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import autoAddress from '@/components/autoAddress/index'
import meetingApi from '@/api/meeting/index.js'
import { mapGetters } from "vuex";
export default {
    components: { autoAddress },
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);  // 将时间设置为零点
                    return time.getTime() < today.getTime();  // 禁用早于今
                }
            },
            form: {
                conferenceType: '',
                conferenceName: "",
                conferenceConvener: '',
                conferenceConvenerId: "",
                conferenceContacts: '',
                conferenceContactsId: '',
                conferenceContent: [],
                startTime: '',
                endTime: '',
                room: "",
                customRoom: "",
                reminderTime: 5,
                meetingTimer: null,
                conferenceStatus: "",
                userList: [],
                userIds: []
            },
            initList: [],
            rules: {
                conferenceType: [
                    { required: true, message: '请选择会议类型', trigger: 'change' }
                ],
                conferenceName: [
                    { required: true, message: '请输入会议名称', trigger: 'change' }
                ],
                conferenceConvenerId: [
                    { required: true, message: '请选择召集人', trigger: 'change' }
                ],
                conferenceContactsId: [
                    { required: true, message: '请选择联系人', trigger: 'change' }
                ],
                conferenceContent: [
                    { required: true, message: '请输入会议内容', trigger: 'change' }
                ],
                meetingTimer: [
                    { required: true, message: '请输入会议时间', trigger: 'change' }
                ],
                reminderTime: [
                    { required: true, message: '请选择会议提前提醒时间', trigger: 'change' }
                ],
                userIds: [
                    { required: true, message: '请选择参会人员', trigger: 'change' }
                ]
            },
            meetingTypeList: [
                {
                    value: 0,
                    label: '外审'
                },
                {
                    value: 1,
                    label: '总经理办公会议'
                },
                {
                    value: 2,
                    label: '公司会议'
                },
                {
                    value: 3,
                    label: '部门会议'
                },
                {
                    value: 4,
                    label: '外部会议'
                },
                {
                    value: 5,
                    label: '教学培训'
                },
                {
                    value: 6,
                    label: '招聘面试'
                },
            ],
            roomList: [
                {
                    label: '总经理会议室',
                    value: '总经理会议室'
                },
                {
                    label: '大会议室AB',
                    value: '大会议室AB'
                },
                {
                    label: '大会议室C',
                    value: '大会议室C'
                },
                {
                    label: '大会议室D',
                    value: '大会议室D'
                },
                {
                    label: '会议室E',
                    value: '会议室E'
                }, {
                    label: "WAR ROOM会议室(4F)",
                    value: 'WAR ROOM会议室(4F)'
                },             
                {
                    label: "综管会议室",
                    value: '综管会议室'
                },
                {
                    label: "VIP会议室（3F）",
                    value: 'VIP会议室（3F）'
                },
            ],
            reminderList: [
                {
                    label: '提前5分钟',
                    value: 5
                },
                {
                    label: '提前10分钟',
                    value: 10
                },
                {
                    label: '提前15分钟',
                    value: 15
                }, {
                    label: '提前30分钟',
                    value: 30
                }, {
                    label: '提前60分钟',
                    value: 60
                }
            ],
            personList: [

            ]

        }
    },
    props: {
        currentId: {
            type: String,
            default: ''
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        isDetail: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        this.initList = [
            {
                realName: this.userInfo.user_name,
                id: this.userInfo.user_id
            }
        ]
        // console.log(this.form)
        if (this.currentId) {
            this.getDetails()
        } else {
            this.$refs.form.resetFields()
            this.form.conferenceContactsId = this.userInfo.user_id
            this.form.conferenceConvenerId = this.userInfo.user_id
            this.form.userIds.push(this.userInfo.user_id)
        }
        this.getUserList()
    },
    watch: {
        currentId: {
            handler() {
                if (!this.currentId) {
                    console.log(this.$refs.form)
                    if (this.$refs.form) {
                        this.$refs.form.resetFields()
                    }
                }
                console.log(this.currentId + "currentId")
            },
            immediate: true,
            // 开启深度监听 deep
            deep: true,
        },

    },
    methods: {
        async getUserList() {
            let res = await meetingApi.getUserList()
            let { data } = res
            if (data.code === 0) {
                this.personList = data.data
            }
        },
        getConferenceConvener(data) {
            this.form.conferenceConvenerId = data.id
            this.form.conferenceConvener = data.realName
        },
        getConferenceContacts(data) {
            this.form.conferenceContactsId = data.id
            this.form.conferenceContacts = data.realName
        },
        getUserMeeting(data, arr) {     
            this.form.userList = []
            arr.map(ele => {
                this.form.userList.push({ userId: ele.id, userName: ele.realName })
            })
        },
        async getDetails() {
            let res = await meetingApi.detail({ id: this.currentId })
            if (res.data.code === 0) {
                this.initList = []
                this.form = res.data.data
                this.form.userList.map(ele => {
                    this.initList.push({ realName: ele.userName, id: ele.userId })
                })
                let userIds = this.form.userList.map(ele => ele.userId)
                this.$set(this.form, 'meetingTimer', [this.form.startTime, this.form.endTime])
                this.$set(this.form, 'userIds', userIds)
            }
        },
        getPersonOne(id) {
            let oneItem = this.personList.find(ele => {
                return ele.userId === id
            })
            console.log(oneItem)
            if (oneItem) {
                return oneItem
            }
        },
        getTimer() {
            if (this.form.meetingTimer) {
                this.form.startTime = this.form.meetingTimer[0]
                this.form.endTime = this.form.meetingTimer[1]
            } else {
                this.form.startTime = null
                this.form.endTime = null
            }
        },
        submit() {
            let arr = []
            this.form.userList.map(ele => {
                arr.push({ userId: ele.userId, userName: ele.userName })
            })
            this.form.userList = arr
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    if (!this.form.room && !this.form.customRoom) {
                        this.$message.error('会议室和自定义会议地点至少选填一项')
                        return
                    }
                    let Api = this.form.id ? meetingApi.update : meetingApi.add
                    let res = await Api(this.form)
                    if (res.data.code === 0) {
                        this.$message.success(this.form.id ? '会议已更新' : "会议已创建")
                        this.$emit('updateMeetingList')
                        this.$refs.form.resetFields()
                    } else {
                        // this.$message.error(res.data.message)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.icon-left-title {
    font-size: 20px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.back {
    width: 30px;
    height: 30px;
}

::v-deep ep.el-form-item__error {
    padding-left: 30px;
}
</style>