<template>
    <div @click="closeZDY">
        <el-form ref="form" :model="form" :rules="rules" label-width="0px">
            <el-form-item prop="schedule">
                <div class="flex-center title">
                    <img v-if="false" @click="changeChoose" :src="chooseImg" class="chooseImg mr5" alt="">
                    <el-input v-model="form.schedule" placeholder="行程名称"></el-input>
                    <svg   @click="changeCollect"  t="1695015485595" class="icon ml10" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5502" width="20" height="20"><path d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z"
                            :fill="fillCollect()" p-id="5503"></path></svg>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="flex-center" @click="changeToday">
                    <svg width="24" height="24" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="oa&#229;&#136;&#135;&#229;&#155;&#190;" clip-path="url(#clip0_1867_15603)">
                            <path id="Vector"
                                d="M35.3601 44.2792C35.2097 44.2795 35.0598 44.2979 34.914 44.3343L24.4239 46.9604C23.6269 47.14 23.1088 47.8877 23.2379 48.6722C23.3335 49.4043 23.9212 50.1502 24.8523 50.1502C25.0041 50.1492 25.1552 50.1296 25.3019 50.0918L35.7885 47.4691C36.5855 47.2894 37.1036 46.5417 36.9745 45.7572C36.8789 45.0217 36.2948 44.2792 35.3601 44.2792ZM32.8535 49.7721C32.5334 49.7781 32.223 49.8801 31.9649 50.0643C31.2675 50.5283 30.5983 50.7861 29.9788 50.8205H29.8974C29.4742 50.7977 29.0621 50.68 28.6936 50.4768C28.6582 50.4596 28.5201 50.3702 28.4281 50.3118C28.1731 50.1468 28.1024 50.1021 28.0174 50.0918C27.7768 49.9702 27.5097 49.9066 27.2385 49.9062C26.8611 49.91 26.4936 50.0242 26.1842 50.234C25.8747 50.4437 25.6375 50.7391 25.5037 51.0818C25.3019 51.6489 25.4931 52.223 26.0135 52.6251C27.1889 53.5222 28.5625 54 29.9787 54C31.2745 54 32.5596 53.5978 33.6925 52.8382C34.0004 52.639 34.2319 52.3467 34.3509 52.0067C34.47 51.6667 34.47 51.298 34.351 50.9579C34.1244 50.2498 33.5225 49.7755 32.8534 49.7755V49.7721H32.8535ZM41.8284 21.1047C40.6949 19.0374 38.9683 17.3336 36.8577 16.1996C34.8274 15.1248 32.5498 14.5666 30.2373 14.5772C28.2335 14.5772 26.219 14.9897 24.4063 15.77C22.5157 16.5768 20.8434 17.7981 19.5206 19.3379C17.0494 22.2149 16.005 26.381 16.7343 30.4748C17.4318 34.4106 19.6516 37.7139 22.8237 39.5391C23.0775 39.6898 23.3688 39.7706 23.6663 39.7728C24.0378 39.7602 24.3948 39.6296 24.6825 39.4012C24.9703 39.1727 25.1729 38.8589 25.2594 38.5079C25.4709 37.8207 25.1598 37.0833 24.5124 36.7377C20.2711 34.2972 19.0638 28.4193 20.3808 24.3701C21.6589 20.4447 25.571 17.8048 30.1168 17.8048C32.0322 17.8048 33.8979 18.286 35.5088 19.1969C37.6896 20.4275 39.2474 22.4796 39.8988 24.9751C40.2485 26.2965 40.3254 27.6721 40.1249 29.0225C39.9243 30.3729 39.4504 31.6714 38.7305 32.8432C38.1534 33.7609 37.4064 34.6099 36.6841 35.428C36.2203 35.9505 35.7388 36.4936 35.3034 37.0539C34.5599 38.0164 34.3333 39.0476 34.1102 40.041L33.9899 40.5738L24.4238 43.0452C23.6235 43.2311 23.1073 43.9859 23.2413 44.7741C23.3404 45.4994 23.921 46.2384 24.8451 46.2384C25.0006 46.2373 25.1553 46.2165 25.3054 46.1766L32.7684 44.2482C33.0445 44.176 33.3172 44.1108 33.5757 44.0489C35.6184 43.5608 37.2293 43.1724 37.4169 40.3091C37.4842 39.2985 38.3764 38.3498 39.1659 37.5214C39.3677 37.3048 39.5589 37.1054 39.7323 36.9026C40.6812 35.8267 41.8601 34.3624 42.6071 32.6335C44.1862 28.983 43.9064 24.8892 41.8282 21.1081L41.8284 21.1047ZM13.5763 28.0241C13.5763 27.1304 12.8328 26.4017 11.9123 26.4017H8.66931C7.74738 26.4017 7 27.1273 7 28.0224C7 28.9175 7.74738 29.6431 8.66931 29.6431H11.9052C12.8257 29.6431 13.5692 28.9179 13.5692 28.0242H13.5763V28.0241ZM51.3307 26.4017H48.0983C47.1764 26.4017 46.429 27.1273 46.429 28.0224C46.429 28.9175 47.1764 29.6431 48.0983 29.6431H51.3307C52.2526 29.6431 53 28.9175 53 28.0224C52.9999 27.1273 52.2526 26.4017 51.3307 26.4017ZM16.0899 16.7324C16.7849 17.322 17.8406 17.253 18.4478 16.5782C18.9981 15.9668 18.9981 15.0546 18.4478 14.4431L16.1607 12.2157C15.4657 11.6261 14.4101 11.6952 13.8029 12.3699C13.2526 12.9813 13.2526 13.8936 13.8029 14.505L16.0899 16.7324ZM44.0375 39.3158C43.3426 38.7262 42.2869 38.7952 41.6797 39.47C41.1294 40.0814 41.1294 40.9936 41.6797 41.6051L43.9668 43.829C44.6617 44.4186 45.7174 44.3496 46.3246 43.6748C46.8749 43.0634 46.8749 42.1512 46.3246 41.5397L44.0375 39.3158ZM30.0637 12.3086C30.9842 12.3086 31.7277 11.5833 31.7277 10.6896V7.54445C31.6853 6.65127 30.9051 5.96055 29.9852 6.00175C29.1246 6.04027 28.4359 6.7089 28.3962 7.54445V10.6896C28.3962 11.5833 29.1397 12.3086 30.0602 12.3086H30.0637ZM18.4478 39.3158C17.7993 38.6836 16.7457 38.6816 16.0946 39.3112L16.0899 39.3158L13.8029 41.5397C13.1518 42.1719 13.1518 43.1968 13.8029 43.829C14.454 44.4611 15.5096 44.4611 16.1607 43.829L18.4478 41.6084C19.0992 40.9751 19.0992 39.9491 18.4478 39.3158ZM41.6797 16.7324C42.3282 17.3646 43.3818 17.3666 44.0329 16.737L44.0375 16.7324L46.3246 14.5085C46.9757 13.8763 46.9757 12.8514 46.3246 12.2192C45.6735 11.5871 44.6179 11.5871 43.9668 12.2192L41.6797 14.4397C41.0283 15.0732 41.0283 16.0991 41.6797 16.7324Z"
                                :fill="fillIdea" />
                        </g>
                    </svg>
                    <span :class={choose_today:form.todayStatus,no_choose_today:!form.todayStatus} class="pl10"><span
                            v-if="form.todayStatus">{{$t('mySchedule.had')}}</span>{{$t('mySchedule.addToday')}}</span>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="flex-center">
                    <div class="icon-left-title">
                        <img width="17" src="@/assets/svg/meeting/clock.svg" alt="">
                    </div>
                    <div class="pr5 font12 w50">{{$t('mySchedule.remindMe')}}</div>
                    <el-date-picker class="w-100" :clearable="false" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.remindTime"
                        type="datetime" placeholder="提醒时间">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item prop="scheduleTimer">
                <div class="flex-center">
                    <div class="icon-left-title">
                        <img width="17" src="@/assets/svg/meeting/clock.svg" alt="">
                    </div>
                    <el-date-picker @change="getTimer" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"
                        v-model="form.scheduleTimer" clearable type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="flex-center">
                    <div class="icon-left-title">
                        <img width="16" src="@/assets/svg/meeting/mention.svg" alt="">
                    </div>
                    <el-popover placement="bottom-start" class="w-100" v-model="visiblePopover" trigger="manual">
                        <div class="flex pb10 w200 ">
                            <el-input v-model="form.repeatNumber" @change="handleChange" :min="1" class="mr5"
                                label="描述文字"></el-input>
                            <el-select v-model="form.repeatType" placeholder="请选择" @change="dealWeek">
                                <el-option v-for=" item  in  typeUnit " :key="item.key" :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="flex week" v-if="form.repeatType === 1">
                            <div :class={choose:item.isChecked,no_choose:!item.isChecked} v-for=" item  in  weekList "
                                @click="changeCheck(item)" class="p6 week-item">
                                {{ item.value }}
                            </div>
                        </div>
                        <el-button type="primary" @click="remarkRepate" class="mt10">{{$t('common.confirm')}}</el-button>
                        <el-select filterable allow-create slot="reference" class="w-100" @change="getRepeatType"
                            v-model="form.workDay" placeholder="重复" clearable>
                            <el-option v-for=" item  in  repeatList " :key="item.key" :value="item.key"
                                :label="item.value"></el-option>
                        </el-select>
                    </el-popover>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="flex-center">
                    <img class="icon-left-title" src="@/assets/png/schedule/icon_zx.png" alt="">
                    <div v-if='!form.scheduleType' class="pr5 font12 w50">{{$t('mySchedule.assignTo')}}</div>
                    <autoAddress :multiple="true" :initData="form.userIds" :initList="form.userList"  class="w-100" @getPerson="getPerson" v-if='form.scheduleType!==1'></autoAddress>
                    <!-- <el-select v-if='form.scheduleType!==1' multiple @change='changeUser' v-model="form.userIds"
                        placeholder="指派人" clearable>
                        <el-option v-for=" item  in  personList " :key="item.userId" :value="item.userId"
                            :label="item.userName"></el-option>
                    </el-select> -->
                    <div v-else>
                        {{$t('mySchedule.assignSelf')}}<span>{{ form.superiorName }}</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="flex-center">
                    <img class="icon-left-title" src="@/assets/svg/schedule/ico_yd.svg" alt="">
                    <div class="pr5 font12 w50">{{$t('mySchedule.move')}}</div>
                    <el-select v-model="form.tabulationId" placeholder="列表" clearable>
                        <el-option v-for=" item  in  tabulationList " :key="item.id" :value="item.id"
                            :label="item.tabulationName"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="flex">
                    <div class="icon-left-title">
                        <img width="22" src="@/assets/svg/meeting/content.svg" alt="">
                    </div>
                    <el-input type="textarea" :rows="2" :placeholder="$t('mySchedule.remark')" clearable v-model="form.remark">
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button class="mt10" @click="submit" type="primary">{{$t('mySchedule.submit')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import scheduleApi from '@/api/schedule/index'
import { getUserList } from '@/api/common/index'
import {yearMonthDayWeek} from '@/util/util'
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            chooseImg: require("@/assets/svg/schedule/no_choose.svg"),
            collectImg: require('@/assets/svg/schedule/no_collect.svg'),
            form: {
                schedule: "",
                remindTime: "",
                scheduleTimer: "",
                startTime: "",
                endTime: "",
                workDay: "",
                repeatType: '',
                repeatNumber: "",
                weekDay: [],
                scheduleStatus: 0,
                importantStatus: 0,
                todayStatus: 0,
                scheduleType: "",
                remark: "",
                superiorId: "",
                createUser: "",
                tabulationId: "1",
                userList: [],
                userIds: []
            },
            isChooseToday: false,
            visiblePopover: false,
            fillIdea: "#6B6B6B",
            personList: [],
            weekList: [{
                value: "一",
                isChecked: false,
                key: 1
            },
            {
                value: "二",
                isChecked: false,
                key: 2
            },
            {
                value: "三",
                isChecked: false,
                key: 3
            }, {
                value: "四",
                isChecked: false,
                key: 4
            }, {
                value: "五",
                isChecked: false,
                key: 5
            }, {
                value: "六",
                isChecked: false,
                key: 6
            }, {
                value: "日",
                isChecked: false,
                key: 7
            }
            ],
            typeUnit: [
                {
                    key: 0,
                    value: "天"
                },
                {
                    key: 1,
                    value: '周',
                },
                {
                    key: 2,
                    value: "月"
                },
                {
                    key: 3,
                    value: '年',
                }
            ],
            repeatList: [
                {
                    key: 0,
                    value: '每日'
                },
                {
                    key: 1,
                    value: '每周'
                },
                {
                    key: 2,
                    value: '每月'
                },
                {
                    key: 3,
                    value: '每年'
                },
                {
                    key: 4,
                    value: '每工作日'
                },
                {
                    key: 5,
                    value: '自定义重复'
                },
            ],
            tabulationList: [],
            rules: {
                schedule: [
                    { required: true, message: '请输入行程名称', trigger: 'blur' },

                ],
                scheduleTimer: [
                    { required: true, message: '请选择行程时间', trigger: 'change' }
                ],
            }
        }
    },
    components:{autoAddress},
    props: {
        row: {
            type: String
        },
        formDetail: {
            type: Object
        }
    },
    watch: {
        row: {
            handler() {
                console.log(this.row)
                if (this.row && this.row.id) {
                    this.getDetail()
                }
            },
            immediate: true,
            // 开启深度监听 deep
            deep: true,
        },
        formDetail: {
            handler() {
                if (this.formDetail&&this.formDetail.id) {
                    this.form = this.formDetail
                }
            },
            immediate: true,
            // 开启深度监听 deep
            deep: true,
        }

    },
    mounted() {
        this.getUserInfo()
        this.getTabulationList()
        if(this.row&&this.row.id){
            this.getDetail()
        }

    },
    methods: {
        async getUserInfo() {
            let res = await getUserList()
            this.personList = res.data.data
        },
        closeZDY(){
            this.visiblePopover = false
        },
        getRepeatType() {
            if (this.form.workDay === 5) {
                this.visiblePopover = true
            } else if(!this.form.workDay){
                this.form.repeatNumber = null
                this.form.repeatType = null
                this.form.weekDay = []
            } else {
                this.visiblePopover = false
                this.form.repeatType = this.form.workDay === 4 ? 1 : this.form.workDay
                this.form.repeatNumber = 1
                if (this.form.workDay === 4) {
                    this.form.weekDay = [1, 2, 3, 4, 5]
                }
            }
        },
        async getDetail() {
            let res = await scheduleApi.detail({ id: this.row.id })
            // console.log(res)
            if (res.data.code === 0) {
                this.form = res.data.data
                this.form.userList = this.form.userList||[]
                if(this.form.repeatType===undefined){
                    this.$set(this.form,'repeatType','')
                }
                this.form.userList.map(ele=>{
                    ele.realName = ele.userName
                    ele.id = ele.userId
                })
                this.form.workDay =this.form.workDay&& this.form.workDay.length===1?Number(this.form.workDay):this.form.workDay
                this.$set(this.form,'scheduleTimer',[this.form.startTime,this.form.endTime])
                this.$set(this.form,'userIds',this.form.userList.map(ele=>ele.userId))
                this.$set(this.form,'createTimeFormat',yearMonthDayWeek(this.form.createTime))
                this.form.tabulationId  = (this.form.tabulationId||"").toString()
                this.fillIdea = this.form.todayStatus?"#5E91DE":"#E9E9E9"
            }
        },
        async getTabulationList() {
            let res = await scheduleApi.tabulationList()
            // console.log(res)
            if(res.data.code===0){
                this.tabulationList = res.data.data
            }
        },
        changeCheck(item) {
            this.weekList.map(self => {
                if (self === item) {
                    self.isChecked = !self.isChecked
                }
            })
        },
        fillCollect(){
            return this.form.importantStatus?"#FFC076":"#E9E9E9"
        },
        changeCollect() {
            this.form.importantStatus = this.form.importantStatus === 0 ? 1 : 0
            this.collectImg = this.form.importantStatus ? require("@/assets/svg/schedule/collect.svg") : require("@/assets/svg/schedule/no_collect.svg")
        },
        dealWeek(v){
            //清空非周时候的周数组
            if(v!==1){
                this.form.weekDay = []
            }
        },
        getPerson(data,arr){

            this.form.userList = []
            arr.map(ele=>{
                this.form.userList.push({userName:ele.realName,userId:ele.id,id:ele.id,realName:ele.realName})
            })
        },
        // changeUser() {
        //     this.form.userList = this.personList.filter(ele => {
        //         return this.form.userIds.includes(ele.userId)
        //     })
        // },
        changeChoose() {
            this.form.scheduleStatus = this.form.scheduleStatus === 0 ? 1 : 0
            this.chooseImg = this.form.scheduleStatus ? require("@/assets/svg/schedule/choose.svg") : require("@/assets/svg/schedule/no_choose.svg")
        },
        changeToday() {
            this.form.todayStatus = this.form.todayStatus === 0 ? 1 : 0
            this.fillIdea = this.form.todayStatus ? "#5699FF" : "#6B6B6B"
        },
        remarkRepate() {
            if (this.form.repeatType === 1) {
                this.chooseWeek = this.weekList.filter(ele => {
                    return ele.isChecked
                })
                let stringName = ''
                this.chooseWeek.map(ele => {
                    stringName += `周${ele.value}`
                })
                this.form.weekDay = this.chooseWeek.map(ele => ele.key)
                this.form.workDay = `每${this.form.repeatNumber}周${stringName}重复`
            } else {
                this.form.weekDay = []
                this.form.workDay = `每${this.form.repeatNumber}${this.typeUnit[this.form.repeatType].value}重复`
            }
            this.visiblePopover = false
        },
        getTimer(v) {
            if (v) {
                this.form.startTime = v[0]
                this.form.endTime = v[1]
            } else {
                this.form.startTime = ''
                this.form.endTime = ''
            }
        },
        async submit() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let deepForm = JSON.parse(JSON.stringify(this.form))
                    deepForm.workDay =deepForm.workDay===undefined?'': deepForm.workDay.toString()
                    deepForm.repeatNumber = deepForm.repeatNumber? Number(deepForm.repeatNumber):null
                    let Api = !this.form.id?scheduleApi.add:scheduleApi.update
                    let res = await Api(deepForm)
                    console.log(res)
                    if(res.data.code===0){
                        this.$emit('getList')
                        this.$message.success('已提交')
                    }
                }
            })

        },
    }
}
</script>

<style scoped lang="scss">
.icon-left-title {
    font-size: 20px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.icon-left-today {
    width: 25px;
    height: 25px;
    margin-left: -5px;
}

.chooseImg {
    widows: 20px;
    height: 20px;
}

.choose_today {
    color: #5699FF;
}

.no_choose_today {
    color: #000;
}

.w-100 {
    width: 100% !important;
}

.w200 {
    width: 200px;
}

.week {
    width: fit-content;
    color: #C2C2C2;
    border: 1px solid #C2C2C2;
}

.choose {
    color: #fff;
    background-color: #5699FF;
}

.no_choose {
    background-color: #fff;
    color: #C2C2C2;
}

.w50 {
    width: 50px;
}

.font12 {
    font-size: 12px;
}

.title {
    border: 1px solid #C2C2C2;
    padding: 10px 5px 10px 0;
    border-radius: 13px 13px 13px 13px;

    ::v-deep ep .el-input__inner {
        border: 0 !important;
    }
}
</style>
