<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
            <el-tab-pane :label="$t('seatManage.sevenFloor')" name="first">
               <list></list>
            </el-tab-pane>
            <el-tab-pane :label="$t('seatManage.threeFloor')" name="second">
                <div class="h90">{{ $t('seatManage.planning') }}</div>
            </el-tab-pane>
            <el-tab-pane :label="$t('seatManage.fourFloor')" name="third">
                <div class="h90">{{ $t('seatManage.planning') }}</div>
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
    data() {
        return {
            activeName:'first',
            dialogVisible: false
        }
    },
    methods: {
        preview() {
            this.dialogVisible = true
        }
    }
}
</script>

<style scoped lang="scss">
.h90{
    height: 90vh;
    text-align: center;
    padding-top: 10px;
}
</style>
