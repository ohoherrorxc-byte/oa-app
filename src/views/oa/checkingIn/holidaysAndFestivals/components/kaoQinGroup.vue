<template>
    <div class="flex container">
        <div class="left-container">
            <!-- <div class="flex pb20" v-if="!collapse">
                <span class="w100">考勤组</span>
                <el-input></el-input>
            </div> -->
            <el-collapse v-if="!collapse" v-model="activeNames" @change="handleChange">
                <el-collapse-item title="考勤组" name="1" class="kaoqin">
                    <div @click="changeKaoQin(item)" v-for="item in  groupList" class="pb3 font16" :class={isChoose:isChoose(item)}>
                        {{ item.groupName }}
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <img v-if="!collapse" src="@/assets/svg/kaoqin/close.svg" @click='changeState(true)' class="icon-set" alt="">
        <img v-else src="@/assets/svg/kaoqin/open.svg" @click='changeState(false)' class="icon-set" alt="">
    </div>
</template>

<script>
import HolidaysAndFestivalsApi from '@/api/checkingIn/holidaysAndFestivals/index'
export default {
    data() {
        return {
            activeNames: ['1'],
            collapse: false,
            groupList: [],
            currKaoQin:'',
            currRow:{}
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async getList() {
            let res = await HolidaysAndFestivalsApi.attendanceGroup()
            // console.log(res)
            if (res.data.code === 0) {
                this.groupList = res.data.data.records 
                if(this.groupList.length>0){
                    this.currKaoQin = this.groupList[0].id
                    this.currRow = this.groupList[0]
                    this.$emit('currRow',this.currRow)
                }           
            }
        },
        changeKaoQin(item){
            this.currKaoQin = item.id
            this.currRow = item
            this.$emit('currRow',this.currRow)
        },
        isChoose(item){
            return item.id===this.currKaoQin
        },
        changeState(value) {
            this.collapse = value
            this.$emit('collapse', this.collapse)
        }

    }
}
</script>

<style lang="scss" scoped>
.w100 {
    width: 100px;
}
.isChoose{
    color: #409eff;
}
.kaoqin {
    font-size: 16px;

    ::v-deep ep .el-collapse-item__header {
        font-size: 16px;
    }
}

.left-container {
    border-right: 1px solid #EBEEF5;
    height: 100%;
    width: 100%;
    /* height: 100vh; */
}
.font16{
    font-size: 16px;
}
.icon-set {
    width: 15px;
    height: 15px;
    margin-top: 30vh;
}

.container {
    position: relative;
    width: 100%;
}
</style>