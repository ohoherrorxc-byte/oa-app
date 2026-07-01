<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('mySchedule.today')" name="today">
                <today v-if="activeName==='today'"></today>
            </el-tab-pane>
            <el-tab-pane :label="$t('mySchedule.schedule')" name="schedule">
                <schedule v-if="activeName==='schedule'"></schedule>
            </el-tab-pane>
            <el-tab-pane :label="$t('mySchedule.important')" name="third">
                <importPage v-if="activeName==='third'"></importPage>
            </el-tab-pane>
            <el-tab-pane :label="$t('mySchedule.assign')" name="fourth">
                <assignPage v-if="activeName==='fourth'"></assignPage>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import today from './components/today.vue'
import schedule from './components/schedule.vue'
import importPage from './components/importPage.vue'
import assignPage from './components/assignPage.vue'
export default {
    components: {
        today, schedule,assignPage,importPage
    },
    data() {
        return {
            activeName:"today"
        }
    },
    methods: {
        handleClick() {

        }
    }
}
</script>
