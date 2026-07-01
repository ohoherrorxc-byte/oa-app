<template>
    <div class="">
        <div class="isEmpty" v-if="isEmpty">
            <img width="228" height="224" src="@/assets/png/img_hdhb.png" alt="">
            <div @click="addToday" class="button-inner">
                <img width="22" class="mr4" src="@/assets/svg/schedule/ico_idea.svg" alt="">
                <div>{{ $t('mySchedule.addSchedule') }}</div>
            </div>
        </div>
        <div>
            <subScheduleCard @dealNotEmpty="dealNotEmpty" ref="subScheduleCard" listType="today"></subScheduleCard>
            <div v-if="!isEmpty" @click="addToday" class="button-inner">
                <img width="22" class="mr4" src="@/assets/svg/schedule/ico_idea.svg" alt="">
                <div> {{ $t('mySchedule.addSchedule') }}</div>
            </div>
        </div>
        <el-drawer title="建议" class="content" :visible.sync="drawer" :modal="false" :direction="direction"
        :append-to-body="true" :before-close="handleClose">
            <div class="px30 content">
                <scheduleCard :isToday="true" @deleteRow="deleteRow" @addItemToday="addItemToday"></scheduleCard>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import scheduleCard from './scheduleCard.vue'
import subScheduleCard from './subScheduleCard'
import Cookies from 'js-cookie'
import {getFormatDate} from '@/util/util'
export default {
    components: { scheduleCard, subScheduleCard },
    data() {
        return {
            drawer: false,
            direction: 'rtl',
            isEmpty: true
        }
    },
    mounted(){
        let getNotFirstEnter = Cookies.get(`today${getFormatDate()}`)
        if(getNotFirstEnter){
            this.drawer = false
        }else{
            this.drawer = true
            Cookies.set(`today${getFormatDate()}`, true, { expires: 1 })
        }   
    },
    methods: {
        handleClose() {
            this.drawer = false
        },
        addToday() {
            this.drawer = true
        },
        addItemToday() {
            this.$refs.subScheduleCard.getList()
        },
        dealNotEmpty() {
            this.isEmpty = false
        }
    }
}
</script>

<style lang="scss" scoped>
.isEmpty {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #5699FF;
    width: 140px;
    color: #fff;
    padding: 10px 15px;
    border-radius: 3px 3px 3px 3px;
}

 ::v-deep ep.el-drawer__open .el-drawer.rtl {
    overflow: scroll;
}
</style>