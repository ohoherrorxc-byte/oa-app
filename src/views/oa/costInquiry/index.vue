<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar barName="costInquiry" @tab="getTab"></leftBar>
            </el-col>
            <el-col span="22" >
                <financialStatement v-if="curTab==='financialStatement'"></financialStatement>       
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index'
import financialStatement from './financialStatement.vue'

export default {
    data(){
        return{
            curTab:"financialStatement"
        }
    },
    components:{
        leftBar,financialStatement,
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