<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar @tab="getTab" barName="companyNews"></leftBar>
            </el-col>
            <el-col span="22" >
                <newsManage v-if="curTab === 'newsManage'" @toDetail="toDetail"></newsManage>
                <list @toDetail="toDetail" v-else-if="curTab === 'list'"></list>
                <createNews :currentId="currentId" :isEdit="isEdit" :isDetail ="isDetail" v-else-if="curTab === 'add'">
                </createNews>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index.vue'
import createNews from './createNews.vue'
import list from './list.vue'
import newsManage from './newsManage'
export default {
    components: {
        leftBar,
        newsManage,
        list,
        createNews
    },
    data() {
        return {
            curTab: "newsManage",
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