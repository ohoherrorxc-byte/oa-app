<script>
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import meetingApi from '@/api/meeting/index'
import { getFormatDate, debounce } from '@/util/util'
export default {
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    props: {
        currentId: {
            type: String,
            default: ''
        },
    },
    watch: {
        currentId: {
            handler() {
                if (!this.currentId) {
                    this.meetingDate = getFormatDate()
                    this.getDayMeeting()
                }
            },
            immediate: true,
            // 开启深度监听 deep
            deep: true,
        },

    },
    data() {
        return {
            calendarOptions: {
                plugins: [
                    resourceTimelinePlugin // needed for dateClick
                ],
                resourceAreaHeaderContent: '会议室',
                // schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                initialView: 'resourceTimelineDay',
                // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
                // editable: true,
                selectable: true,
                // initialDate:this.meetingDate,
                // selectMirror: true,
                // dayMaxEvents: true,
                // weekends: true,
                // select: this.handleDateSelect,
                // eventClick: this.handleEventClick,
                // eventsSet: this.handleEvents,
                eventMouseEnter: this.handleMouseover,
                eventMouseLeave: this.handleMouseLeave,
                slotDuration: '01:00',
                slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
                resources: this.resources,
                events: [],
                /* you can update a remote database when these fire:
                eventAdd:
                eventChange:
                eventRemove:
                */
            },
            mouseX: 0,
            mouseY: 0,
            timeout: null,
            currentEvents: [],
            tooltipContent: null,
            resources: [{ id: '0', title: '总经理会议室' },
            { id: '1', title: '大会议室AB' },
            { id: '2', title: '大会议室C' },
            { id: '3', title: '大会议室D' },
            { id: '4', title: '会议室E' },
            { id: '5', title: 'WAR ROOM会议室(4F)' },
         
            { id: '6', title: '综管会议室' },
            { id: '7', title: 'VIP会议室（3F）' },
        ],
            
            meetingDate: '',
            events: [],
            showFull: true
        }
    },
    mounted() {
        this.meetingDate = getFormatDate()
        this.getDayMeeting()
    },
    beforeDestroy() {
        this.destroyCalendar()
    },
    deactivated() {
        this.destroyCalendar()
    },
    methods: {
        destroyCalendar() {
            try {
                const ref = this.$refs.fullCalendar
                if (ref) {
                    const api = typeof ref.getApi === 'function' ? ref.getApi() : ref
                    api && typeof api.destroy === 'function' && api.destroy()
                }
            } catch (e) {
                console.warn('[meetingGantt] destroy calendar error:', e)
            }
        },
        async getDayMeeting() {
            // console.log(getFormatDate() + 'getFormatDate')
            let res = await meetingApi.meeingUse({ date: this.meetingDate })
            this.event = []
            let data = res.data.data
            data.map(ele => {
                ele.timeList.map(item => {
                    item.resourceId = this.getResourceId(ele)
                    item.title = this.getResourceTitle(item)
                    item.start = item.startTime
                    item.end = item.endTime
                })
            })
            let arr = []
            data.map(ele => {
                ele.timeList.map(self => {
                    if (self.startTime && self.endTime) {
                        arr.push(self)
                    }
                })

            })
            this.events = arr
            this.calendarOptions.initialDate = this.meetingDate
            this.calendarOptions.events = arr
            this.calendarOptions.resources = this.resources
            // console.log(this.calendarOptions)
            this.showFull = true
            // this.$refs.fullCalendar.options.initialDate = this.meetingDate
            // this.$refs.fullCalendar.options.resources = this.resources
            // this.$refs.fullCalendar.options.events = arr
            // console.log(this.$refs.fullCalendar.options)
        },
        getResourceId(ele) {
            let itemOne = this.resources.find(self => {
                return ele.room === self.title
            })
            return itemOne.id
        },
        getResourceTitle(item) {
            if (item.endTime && item.startTime) {
                let startL = item.startTime.length
                let endL = item.endTime.length
                return item.startTime.substring(11, 16) + "-" + item.endTime.substring(endL - 8, endL - 3)
            }
        },
        chooseDate() {
            if (this.meetingDate) {
                this.tooltipContent = null
                this.showFull = false
                this.getDayMeeting()
            }
        },
        mouseOver(e) {
            this.mouseX = e.jsEvent.clientX
            this.mouseY = e.jsEvent.clientY
            let id = e.event.id
            this.tooltipContent = this.events.find(ele => {
                return ele.id === id
            })
            console.log(this.tooltipContent)
        },
        handleMouseover(e) {
            debounce(this.mouseOver.bind(null, e), this, 50)
        },
        handleMouseLeave(e) {
            debounce(() => { this.tooltipContent = null }, this, 10)
        },
        backPage() {
            this.$emit('backPage')
        }
    }
}
</script>

<template>
    <div class='demo-app'>
        <div class="flex-space">
            <el-date-picker size="medium" type="date" :clearable="false" @change="chooseDate" value-format="yyyy-MM-dd" class="mb10"
                v-model="meetingDate" placeholder="选择日期">
            </el-date-picker>
            <i class="el-icon-close" @click="backPage" v-if="this.currentId"></i>
            <!-- <img class="back" src="@/assets/svg/meeting/back.svg" alt=""> -->
        </div>
        <div v-if="tooltipContent" :style="{ top: mouseY + 'px', left: mouseX + 'px' }" class="tooltip">
            <div>会议名称：{{ tooltipContent.conferenceName }}</div>
            <div>应到人数：{{ tooltipContent.peopleNumber }}</div>
            <div>召集人：{{ tooltipContent.conferenceConvener }}</div>
            <div>联系人：{{ tooltipContent.conferenceContacts }}</div>
            <div>开始时间：{{ tooltipContent.startTime }} </div>
            <div>结束时间：{{ tooltipContent.endTime }}</div>
        </div>
        <div class='demo-app-main'>
            <FullCalendar v-if="showFull" class='demo-app-calendar' ref="fullCalendar" :options='calendarOptions'>
            </FullCalendar>
        </div>
    </div>
</template>

<style lang='css'>
.fc-header-toolbar {
    display: none !important;
}

.demo-app {
    height: 80vh;
}

.demo-app-calendar {
    height: 460px !important;
}

.fc-datagrid-cell {
    height: 50px !important;
}

.fc-timeline-lane {
    height: 50px !important;
}

.fc-scrollgrid-sync-inner {
    color: #676767;
}

.fc-license-message {
    display: none;
}

.back {
    width: 30px;
    height: 30px;
}

.el-icon-close {
    font-size: 20px;
}

.tooltip {
    position: fixed;
    z-index: 9999;
    color: #FFF;
    padding: 12px 10px;
    display: flex;
    border-radius: 3px 3px 3px 3px;
    background: linear-gradient(332deg, #000000 0%, rgba(0, 0, 0, 0.5) 100%);
    width: 230px;
    flex-direction: column;
}

.fc-event-main {
    background-image: url('http://10.30.4.68:9000/license/bladex/vehicle/service/282035c007410dcbfbe864ac802ef120.png');
    border: 0;
    background-size: cover;
    border-radius: 10px;
    background-repeat: repeat;
    height: 50px !important;
    color: #000000 !important;
}

title {
    padding: 2px;
}

.fc-timeline-event {
    padding: 0;
}

.fc-h-event {
    border: 1px solid #2BC557;
    background-color: transparent;
    border-radius: 11px 11px 11px 11px;
}

.fc-scrollgrid-sync-table {
    height: 50px !important;
}</style>
