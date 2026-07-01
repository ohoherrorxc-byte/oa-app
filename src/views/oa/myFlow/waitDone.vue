<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('myFlow.all')" name="all">
                <list :chooseFlow="chooseFlow" ref="list" type="waitDone" :tabConfig="tabConfig" v-if="activeName==='all'"></list>
            </el-tab-pane>
            <el-tab-pane :label="$t('myFlow.waitDeal')" name="waitDeal">
                <list :chooseFlow="chooseFlow" type="waitDone" :tabConfig="tabConfig" v-if="activeName==='waitDeal'"></list>
            </el-tab-pane>
            <el-tab-pane :label="$t('myFlow.waitRead')" name="waitRead">
                <list :chooseFlow="chooseFlow" type="waitDone" :isRead="true" :tabConfig="tabConfig"  v-if="activeName==='waitRead'"></list>
            </el-tab-pane>
            <el-tab-pane :label="$t('myFlow.returned')" name="returned">
                <list :chooseFlow="chooseFlow" type="waitDone" :tabConfig="tabConfig" v-if="activeName==='returned'"></list>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import list from './components/list.vue'
export default {
    components:{
        list
    },
    props:{
        chooseFlow:{
            type:Object
        }
    },
    data() {
        return {
            activeName:'all',
            tabConfig: {
                type: 'waitDone',
                todoTabList: [0, 1,2]
            },
        }
    },
    methods: {
        handleClick() {
            let config = {
                'all': [0, 1,2],
                'waitDeal': [0],
                'waitRead': [1],
                'returned':[2]
            }
            this.tabConfig.todoTabList = config[this.activeName]
        },
        getList(){
            this.$refs.list.getList()
        },
    }
}
</script>