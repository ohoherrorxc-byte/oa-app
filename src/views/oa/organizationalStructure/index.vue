<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar barName="organizationalStructure" @tab="getTab"></leftBar>
            </el-col>
            <el-col span="22" >
                <user v-if="curTab === 'user'" @toDetail="toDetail"></user>
                <role @toDetail="toDetail" v-else-if="curTab === 'role'"></role>
                <department v-if="curTab==='department'"></department>
                <jobPost v-if="curTab==='jobPost'"></jobPost>
                <other v-if="curTab==='other'"></other>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index.vue'
import department from './department.vue'
import jobPost from './jobPost'
import  role from './role'
import user from './user'
import other from './other'
export default {
    components: {
        leftBar,
        department,
        jobPost,
        role,
        user,
        other
    },
    data() {
        return {
            curTab: "user",
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