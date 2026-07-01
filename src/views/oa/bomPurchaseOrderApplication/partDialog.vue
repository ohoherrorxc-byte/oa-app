<template>
    <el-dialog title="零件" :visible.sync="dialogTableVisible" :append-to-body="true" width="90%">
        <el-table :data="gridData" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column property="partsNo" label="零件号" ></el-table-column>
            <el-table-column property="partsName" label="零件名称" ></el-table-column>
            <el-table-column property="stockInNo" label="入库单号"></el-table-column>
            <el-table-column property="intoTime" label="入库日期" ></el-table-column>
            <el-table-column property="stockOutNumber" label="出库数量" ></el-table-column>
            <el-table-column property="countryRegin" label="国家"></el-table-column>
            <el-table-column property="stockOutNo" label="出库单号" ></el-table-column>
            <el-table-column property="stockOutDate" label="出库日期" ></el-table-column>
            <el-table-column property="batchNo" label="批次号"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="remark">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import BomPurchaseOrderApplyApi from "@/api/bomPurchaseOrderApply/index";
export default {
    data() {
        return {
            gridData: [{
                date: '2016-05-02',
            }],
            dialogTableVisible: false,
            multipleSelection:[],
            curIndex:null
        }
    },
    methods: {
       async getList(row,index){
            let res = await BomPurchaseOrderApplyApi.selectListByPartsNo({partsNo:row.partsNo})
            console.log(res)
            this.gridData = res.data.data
            this.curIndex = index
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        remark(){
            this.$emit('getChooseList',this.multipleSelection, this.curIndex )
            this.dialogTableVisible = false
        }
    }
}
</script>
