<template>
    <basic-container>
        <div class="flex-center pb10">
            <p class="width30">{{ $t('historyFiles.processCode') }}</p>
            <el-input v-model="approvalCode"></el-input>
            <el-button class="ml20" type="primary" @click="getList">{{ $t('commonContent.search') }}</el-button>
            <el-button @click="clear">{{ $t('commonContent.clear') }}</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column 
                prop="imagefilename" 
                :label="$t('historyFiles.fileName')">
            </el-table-column>
            <el-table-column :label="$t('commonContent.operation')">
                <template slot-scope="scope">
                    <el-button type="text" @click="downLoad(scope.row)">{{ $t('commonContent.download') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </basic-container>
</template>

<script>
import HistoryFilesApi from '@/api/historyFiles/index'
import { downloadFileBlob } from '@/util/util'
export default {
    data() {
        return {
            tableData: [],
            approvalCode: null
        }
    },
    created() {
        this.getList()
        // this.getLogin()
    },
    methods: {
        async getList() {
            let res = await HistoryFilesApi.getOldFile(this.approvalCode)
            if (res.data.code === 0) {
                this.tableData = res.data.data
            }
            console.log(res)
        },
        downLoad(row) {
            // console.log(row.imagefileurl)
            window.open(row.imagefileurl)
            // downloadFileBlob(row.imagefileurl, row.imagefilename)
        },
        clear(){
            this.approvalCode = null
            this.getList()
        }
    },

}
</script>

<style>
.width30 {
    font-size: 14px;
    width: 100px;
}
</style>