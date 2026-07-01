<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar barName="myFlow" @tab="getTab"></leftBar>
            </el-col>
            <el-col :span="spanFlow" v-if="false">
                <div class="flex h90">
                    <searchMode class="w-90" v-if="showSearch" @getFlow="getFlow"></searchMode>
                    <div class="flow-choose">
                        <img @click="chooseClose(false)" width="20" v-if="!openChoose" src="@/assets/svg/open.svg" />
                        <img @click="chooseClose(true)" width="20" v-else src="@/assets/svg/close.svg" />
                   </div>
                </div>
            </el-col>
            <el-col :span="showSearch && showFlow() ? 16 : 22">
                <waitDone :chooseFlow="chooseFlow" ref="waitDone" v-if="curTab === 'waitDone'"></waitDone>
                <haveDone :chooseFlow="chooseFlow" v-if="curTab === 'haveDone'"></haveDone>
                <myRequest :chooseFlow="chooseFlow" v-if="curTab === 'myRequest'"></myRequest>
                <newProcess :chooseFlow="chooseFlow" v-if="curTab === 'newProcess'"></newProcess>
                <queryProcess :chooseFlow="chooseFlow" v-if="curTab === 'queryProcess'"></queryProcess>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index'
import haveDone from './haveDone.vue';
import myRequest from './myRequest.vue';
import newProcess from './newProcess.vue';
import queryProcess from './queryProcess.vue';
import waitDone from './waitDone.vue';
import searchMode from './components/searchMode.vue'
export default {
    data() {
        return {
            curTab: "waitDone",
            showSearch: false,
            chooseFlow: '',
            spanFlow: 6,
            openChoose: true
        }
    },
    components: {
        leftBar, haveDone, myRequest, newProcess, queryProcess, waitDone,
        searchMode
    },
    activated() {
        if (this.$route.query.reflesh) {
            this.curTab = 'waitDone'
            this.$refs.waitDone.getList()
        }
    },
    mounted() {
    },
    methods: {
        chooseClose(key) {
            this.openChoose = !key
            this.showSearch = !this.showSearch
            this.spanFlow = key ? 1 : 6
        },
        getFlow(data) {
            // console.log(data)
            this.chooseFlow = data
        },
        showFlow() {
            return this.curTab === 'waitDone' || this.curTab === 'haveDone' || this.curTab === 'myRequest'
        },
        getTab(key) {
            this.curTab = key
        },
    }
}
</script>

<style>
.container {
    height: 90vh;
    overflow-y: scroll;
    overflow-x: hidden;
}

.row-card {
    display: flex;
}

.button-right {
    margin-left: auto;
}

.h90 {
    height: 90vh
}
.w-90{
    width:90%
}
.flow-choose{
    height:100%;
    margin-top:200px;
    width:15px
}
</style>