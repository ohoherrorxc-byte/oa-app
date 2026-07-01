<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar @tab="getTab" barName="mySchedule"></leftBar>
            </el-col>
            <el-col span="22" >
                <mySchedule v-if="curTab === 'mySchedule'" @toDetail="toDetail"></mySchedule>
                <list @toDetail="toDetail" v-else-if="curTab === 'list'"></list>
                <createSchedule :currentId="currentId" :isEdit="isEdit" :isDetail ="isDetail" v-else-if="curTab === 'add'">
                </createSchedule>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index.vue'
import createSchedule from './createSchedule.vue'
import list from './list.vue'
import mySchedule from './mySchedule'
export default {
    components: {
        leftBar,
        mySchedule,
        list,
        createSchedule
    },
    data() {
        return {
            curTab: "mySchedule",
            currentId: '',
            isEdit: false,
            isDetail: false
        }
    },
    methods: {
        getTab(key) {
            this.curTab = key
            this.currentId = ''
            this.isEdit = false
            this.isDetail = false
        },
        toDetail(key, currentId, type) {
            this.curTab = key
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