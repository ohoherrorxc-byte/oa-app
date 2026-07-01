<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar barName="myMeeting" @tab="getTab"></leftBar>
            </el-col>
            <el-col span="22" >
                <meeting v-if="curTab === 'myMeeting'" @toDetail="toDetail"></meeting>
                <list @toDetail="toDetail" v-else-if="curTab === 'list'"></list>
                <meetingReserve @backPage="backPage" :entry="entry" :currentId="currentId" :isEdit="isEdit" :isDetail ="isDetail" v-else-if="curTab === 'add'">
                </meetingReserve>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index.vue'
import meeting from './meeting.vue'
import list from './list.vue'
import meetingReserve from './meetingReserve'
export default {
    components: {
        leftBar,
        meeting,
        list,
        meetingReserve
    },
    data() {
        return {
            curTab: "myMeeting",
            currentId: '',
            isEdit: false,
            isDetail: false,
            entry:null
        }
    },

    methods: {
        getTab(key) {
            this.curTab = key
            this.currentId = ''
            this.isEdit = false
            this.isDetail = false
        },
        backPage(){
            if(this.entry==='isList'){
                this.curTab = 'list'
            }else if(this.entry==='isMyMeeting'){
                this.curTab = 'myMeeting'
            }
        },
        toDetail(key, currentId, type,entry) {
            this.curTab = key
            console.log('ner',entry)
            this.entry = entry
            this.currentId = currentId
            if (type === 'isEdit') {
                this.isEdit = true
            } else if (type === 'isDetail') {
                this.isDetail = true
            }
            console.log(this.isDetail )
        }
    }
}
</script>

<style>
.container {
    height: 90vh;
    overflow-y:scroll ;
    overflow-x: hidden;
}

.row-card {
    display: flex;
}

.button-right {
    margin-left: auto;
}
</style>