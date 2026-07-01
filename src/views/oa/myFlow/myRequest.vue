<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('myFlow.all')" name="all">
                <list :chooseFlow="chooseFlow" type="myRequest" :tabConfig="tabConfig"  v-if="activeName==='all'"></list>
            </el-tab-pane>
            <el-tab-pane  :label="$t('myFlow.waitFile')" name="waitFlie">
                <list :chooseFlow="chooseFlow" type="myRequest" :tabConfig="tabConfig"  v-if="activeName==='waitFlie'"></list>
            </el-tab-pane>
            <el-tab-pane :label="$t('myFlow.haveFile')" name="haveFile">
                <list :chooseFlow="chooseFlow" type="myRequest" :tabConfig="tabConfig"  v-if="activeName==='haveFile'"></list>
            </el-tab-pane>
          
        </el-tabs>
    </basic-container>
</template>

<script>
import list from './components/list.vue'
export default {
    components: {
        list
    },
    props:{
        chooseFlow:{
            type:Object
        }
    },
    data() {
        return {
            tabConfig: {
                type: 'myRequest',
                mineTabList: [0,1]
            },
            activeName: 'all'
        }
    },
    methods: {
        handleClick() {
            let config = {
                'all': [0, 1],
                'waitFlie': [0],
                'haveFile': [1]
            }
            this.tabConfig.mineTabList = config[this.activeName]
        },
    }
}
</script>