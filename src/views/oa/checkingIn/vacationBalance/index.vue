<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="年休" name="first">
                <yearHoliday></yearHoliday>
            </el-tab-pane>
            <el-tab-pane label="调休" name="second">
                <restHoliday></restHoliday>
            </el-tab-pane>
            <el-tab-pane label="育儿假" name="third">
                <childrenHoliday></childrenHoliday>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import restHoliday from './components/restHoliday.vue';
import yearHoliday from './components/yearHoliday.vue';
import childrenHoliday from './components/childrenHoliday.vue';
export default {
    components: { restHoliday, yearHoliday,childrenHoliday},
    data() {
        return {
            activeName: 'first'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>