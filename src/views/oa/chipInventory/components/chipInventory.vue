<template>
    <div class="container">
        <el-form label-width="60px">
            <el-row :gutter="20">
            <el-col :span="6">
                 <el-form-item label="库存地址">
                       <el-select v-model="form.inventoryAddress">
                           <el-option value="联成库存" label="联成库存"></el-option>
                           <el-option value="车可讯" label="车可讯"></el-option>
                           <el-option value="海外出行四楼仓库" label="海外出行四楼仓库"></el-option>
                           <el-option value="上汽检仓库" label="上汽检仓库"></el-option>
                       </el-select>
                  </el-form-item>
           </el-col>
           <el-col :span="6">
                 <el-form-item label="平台">
                       <el-input v-model="form.projectName">
                       </el-input>
                 </el-form-item>
           </el-col>
           <el-col :span="6">
                  <el-form-item label="零件号">
                        <el-input v-model="form.partsNo">
                         </el-input>
                  </el-form-item>
            </el-col>
            <el-col :span="6">
                                <el-button @click="getList('isQuery')" type="primary">查 询</el-button>
                                <el-button @click="clean">清 空</el-button>
                            </el-col>
                <el-col :span="6">
                    <div class="fr btn-row">
                        <upload :showTip="false" @handleRequest="handleRequest" class="mx10 "
                          url="/api/oa-portal/chipInventory/importChipInventory"></upload>
                        <el-button type="primary" @click="exportFile">导 出</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="projectName" label="平台" align="center">
            </el-table-column>
            <el-table-column prop="configuration" label="所属配置" align="center">
            </el-table-column>
            <el-table-column prop="partsNo" label="零件号" align="center">
            </el-table-column>
            <el-table-column prop="chipInventoryNum" label="芯片库存数量" align="center">
            </el-table-column>
            <el-table-column prop="price" label="单价（人民币含税）" align="center">
            </el-table-column>
            <el-table-column prop="totalPrice" label="金额合计" align="center">
            </el-table-column>
            <el-table-column prop="inventoryTime" label="库龄" align="center">
            </el-table-column>
            <el-table-column prop="manufactureDate" label="最久生产日期" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center">
            </el-table-column>
            <el-table-column prop="dataTime" label="数据统计截至时间" align="center">
            </el-table-column>
            <el-table-column prop="inventoryAddress" label="库存地址" align="center">
            </el-table-column>
        </el-table>
        <el-pagination class="fr" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="form.current" :page-sizes="[10,100, 200, 300, 400]" :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import ChipInventoryApi from '@/api/chipInventory/index'
import upload from '@/components/upload/index'
import { downBlobFile } from '@/util/util'
export default {
    components:{upload},
    data() {
        return {
            tableData: [],
            form: {
                size: 100,
                current: 1,
                projectName: null,
                configuration: null,
                partsNo: null,
                chipInventoryNum: null,
                price: null,
                totalPrice: null,
                inventoryTime: null,
                manufactureDate: null,
                remark: null,
                nowInventoryNum: null,
                dataTime: null,
                inventoryAddress: null,
            },
            total: 100
        }
    },
    mounted() {

        this.getList()

    },
    methods: {
        async getList() {
            let res = await ChipInventoryApi.selectChipInventoryPage(this.form)
            // console.log(res)
            if (res.data.code === 0) {
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            }
        },
        async exportFile(){
            let res = await ChipInventoryApi.exportChipInventory()
            downBlobFile(res.data, '芯片库存表')
        },
        handleSizeChange(val) {
            this.form.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.form.current = val
            this.getList()
        },
        clean() {
            this.form = {
                size: 100,
                page: 1,
                projectName: null,
                configuration: null,
                partsNo: null,
                chipInventoryNum: null,
                price: null,
                totalPrice: null,
                inventoryTime: null,
                manufactureDate: null,
                remark: null,
                nowInventoryNum: null,
                dataTime: null,
                inventoryAddress: null,
            }
            this.getList()
        },
    }
}
</script>

<style lang="scss" scoped>
.w100{
    width: 100%;
}
.btn-row{
    display: flex;
    align-items: center;
}

</style>
