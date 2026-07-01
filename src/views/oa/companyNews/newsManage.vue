<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="轮播块" name="first">
                <list></list>
            </el-tab-pane>
            <el-tab-pane label="公司新闻" name="second"><list></list></el-tab-pane>
            <el-tab-pane label="通知公告" name="third"><list></list></el-tab-pane>
            <el-tab-pane label="公司制度" name="fourth"><list></list></el-tab-pane>
            <el-tab-pane label="系统帮助" name="fifth"><list></list></el-tab-pane>
        </el-tabs>
    </basic-container>
</template>
<script> 
import list from './components/list.vue'
export default {
    components:{list},
    data() {
        return {
            activeName: 'second'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>