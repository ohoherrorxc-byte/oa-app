<template>
    <basic-container>
        <el-row>
            <el-col span="8">
                <formSchedule @getList="getList" ></formSchedule>
            </el-col>
            <el-col span="16" class="pl20">    
                <scheduleGantt ref="scheduleGantt" ></scheduleGantt>
            </el-col>
        </el-row>

    </basic-container>
</template>

<script>
import scheduleGantt from './components/scheduleGantt'
import formSchedule from './components/formSchedule'
export default {
    components: {
        scheduleGantt,
        formSchedule
    },
    props:{
    },
    
    data() {
        return {

        }
    },
    methods: {
        getList(){
           this.$refs.scheduleGantt.getTaskList() 
        }
    }
}
</script>