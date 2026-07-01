<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar barName="partsManage" @tab="getTab"></leftBar>
            </el-col>
            <el-col span="22" >
                <infoManagement v-if="curTab==='infoManagement'"></infoManagement>
                <bomManagement v-if="curTab==='bomManagement'"></bomManagement>
                <inventory v-if="curTab==='inventory'"></inventory>
                <inventoryReport v-if="curTab==='inventoryReport'"></inventoryReport>
                <warehouseManagement v-if="curTab==='warehouseManagement'"></warehouseManagement>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index'
import bomManagement from './bomManagement.vue';
import inventory from './inventory'
import infoManagement from './infoManagement.vue';
import warehouseManagement from './warehouseManagement.vue';
import inventoryReport from "./inventoryReport";

export default {
    data(){
        return{
            curTab:"infoManagement"
        }
    },
    components:{
        leftBar,infoManagement,bomManagement,warehouseManagement,inventory, inventoryReport
    },
    methods:{
        getTab(key) {
            this.curTab = key
        },
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
