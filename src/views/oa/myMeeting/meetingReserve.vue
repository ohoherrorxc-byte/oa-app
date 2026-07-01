<template>
    <basic-container>
        <el-row>
            <el-col span="8">
                <formMeeting @updateMeetingList="updateMeetingList" :isEdit="isEdit" :isDetail="isDetail" :currentId="currentId"></formMeeting>
            </el-col>
            <el-col span="16" class="pl20">    
                <meetingGantt @backPage="backPage" :entry="entry" ref="meetingGantt" :currentId="currentId"></meetingGantt>
            </el-col>
        </el-row>

    </basic-container>
</template>

<script>
import meetingGantt from './components/meetingGantt'
import formMeeting from './components/formMeeting'
export default {
    components: {
        meetingGantt,
        formMeeting
    },
    props:{
        currentId:{
            type:String,
            default:''
        },
        isEdit:{
            type:Boolean,
            default:false
        },
        isDetail:{
            type:Boolean,
            default:false
        },
    },
    
    data() {
        return {

        }
    },
    methods: {
        updateMeetingList(){
            this.$refs.meetingGantt.getDayMeeting()
        },
        backPage(){
            console.log('reseve')
            this.$emit('backPage')
        }
    }
}
</script>