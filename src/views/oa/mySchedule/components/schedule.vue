<template>
    <div>
        <scheduleCard ref="scheduleCard"></scheduleCard>
        <el-button type="primary" class="bgcolor" size="medium" @click="addList"><i class="el-icon-plus el-icon--left"></i>添加列表</el-button>
        <addListDialog  @getList="getList" ref="addListDialog" title="添加列表"></addListDialog>
    </div>
</template>

<script>
import scheduleCard from './scheduleCard'
import addListDialog from './addListDialog'
export default {
    components: { scheduleCard, addListDialog },
    data() {
        return {
       
        }
    },
    methods: {
        getList(){
            this.$refs.scheduleCard.getList()
        },
        addList() {
            this.$refs.addListDialog.dialogVisibleAddList = true
        },
        deleteRow(item) {
            this.scheduleList = this.scheduleList.filter(ele => {
                return ele !== item
            })
            console.log(this.scheduleList)
        }
    }
}
</script>

<style scoped>
.bgcolor{
    background-color: #5699FF!important;
    border-color:#5699FF;
}
</style>