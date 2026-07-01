<template>
    <basic-container class="container">
        <el-row>
            <el-col span="2">
                <leftBar barName="assetsManage" @tab="getTab"></leftBar>
            </el-col>
            <el-col span="22">
                <assetsLedger v-if="curTab === 'assetsLedger'" :isAssetPerson="isAssetPerson"></assetsLedger>
                <assetsInventory v-if="curTab === 'assetsInventory'"></assetsInventory>
                <assetsStatement v-if="curTab === 'assetsStatement'"></assetsStatement>
                <myAsset v-if="curTab === 'myAsset'"></myAsset>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import leftBar from '@/components/oa/leftBar/index'
import assetsLedger from './assetsLedger.vue';
import assetsInventory from './assetsInventory.vue';
import assetsStatement from './assetsStatement.vue';
import myAsset from './myAsset.vue';
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            curTab: "assetsLedger",
            isAssetPerson:false,
            showPerson: ["胡晓芸", "胡晓陈", "张民", "汪金华", "许晨曦", "许云婷", "乔莎", '徐梦婕', "admin","黄子恩"],
            assetPersonList:["胡晓陈", "张民", "汪金华", "许晨曦", "许云婷", "乔莎"]
        }
    },
    components: {
        leftBar, assetsLedger, assetsInventory, assetsStatement, myAsset
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        if(!this.showPerson.includes(this.userInfo.nick_name)){
            this.curTab = 'myAsset'
        }
        if(this.assetPersonList.includes(this.userInfo.nick_name)){
            this.isAssetPerson = true
        }
     },
    methods: {
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
</style>
