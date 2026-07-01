<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar barName="flowManger" @tab="getTab"></leftBar>
            </el-col>
            <el-col span="22" >
              <model v-if="curTab==='model'"></model>
              <deploy v-if="curTab==='deploy'"></deploy>
              <manager v-if="curTab==='manager'"></manager>
              <follow v-if="curTab==='follow'"></follow>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index'
import deploy from './deploy.vue'
import follow from './follow.vue'
import manager from './manager.vue'
import model from './model.vue'

export default {
    data(){
        return{
            curTab:"model"
        }
    },
    components:{
        leftBar,deploy,follow,manager,model
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