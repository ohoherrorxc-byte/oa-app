<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar @tab="getTab" barName="addressBook"></leftBar>
            </el-col>
            <el-col span="22" >
                <myCard v-if="curTab === 'myCard'" @toDetail="toDetail"></myCard>
                <addressBook @toDetail="toDetail" v-else-if="curTab === 'addressBook'"></addressBook>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index.vue'
import myCard from './myCard.vue'
import addressBook from './addressBook'
export default {
    components: {
        leftBar,
        myCard,
        addressBook
    },
    data() {
        return {
            curTab: "addressBook",
            currentId: '',
            isEdit: false,
            isDetail: false
        }
    },
    methods: {
        getTab(key) {
            this.curTab = key
            this.currentId = ''
            this.isEdit = false
            this.isDetail = false
        },
        toDetail(key, currentId, type) {
            this.curTab = key
            this.currentId = currentId
            if (type === 'isEdit') {
                this.isEdit = true
            } else if (type === 'isDetail') {
                this.isDetail = true
            }
            console.log(this.isDetail )
        }
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