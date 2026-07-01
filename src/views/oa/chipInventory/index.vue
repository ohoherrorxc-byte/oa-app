<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="联成库存" name="first">
                <chipInventory></chipInventory>
            </el-tab-pane>
            <el-tab-pane label="车可讯库存" name="second">
                <chipInventory></chipInventory>
            </el-tab-pane>
            <el-tab-pane label="海外出行库存" name="third">
                <chipInventory></chipInventory>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import chipInventory from './components/chipInventory.vue';
export default {
    components: { chipInventory },
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