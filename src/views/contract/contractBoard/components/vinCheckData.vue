<template>
    <div>
        <basic-container class="line-height">
            <div style="color: red;">{{$t('salesAmountWaterfullBoard.vinCheckData.statisticsDescription')}}</div>
            <div style="color: red;" class="flex">
                <div style="width: 110px;">{{$t('salesAmountWaterfullBoard.vinCheckData.country')}}：</div>{{$t('salesAmountWaterfullBoard.vinCheckData.mesData')}}
            </div>
            <div style="color: red;" class="flex">
                <div style="width: 110px;">{{$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount')}}：</div>{{$t('salesAmountWaterfullBoard.vinCheckData.tboxActivationData')}}
            </div>
            <div style="color: red;" class="flex">
                <div style="width: 110px;">{{$t('salesAmountWaterfullBoard.vinCheckData.cumulativeInvoiceCount')}}：</div>{{$t('salesAmountWaterfullBoard.vinCheckData.erpSystem')}}
            </div>
            <div style="color: red;" class="flex">
                <div style="width: 110px;">{{$t('salesAmountWaterfullBoard.vinCheckData.yearInvoiceCount')}}：</div>{{$t('salesAmountWaterfullBoard.vinCheckData.licenseInvoiceData')}}
            </div>
            <div style="color: red;" class="flex">
                <div style="width: 110px;">{{$t('salesAmountWaterfullBoard.vinCheckData.tbd')}}:</div> {{$t('salesAmountWaterfullBoard.vinCheckData.otherSituation')}}
            </div>
        </basic-container>
        <el-table :data="vinList" style="width: 100%" :cell-style="columnStyle"
            :header-cell-style="{ background: '#909399', color: '#fff' }" v-loading="showLoad">
            <el-table-column prop="countryRegion" :label="$t('salesAmountWaterfullBoard.vinCheckData.country')" width="180">
            </el-table-column>
            <el-table-column prop="allLicenseNum" :label="$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount')" width="180" :formatter="formatterNumber">
            </el-table-column>
            <el-table-column prop="invoicedNum" :label="$t('salesAmountWaterfullBoard.vinCheckData.cumulativeInvoiceCount')" :formatter="formatterNumber">
            </el-table-column>
            <el-table-column prop="yearInvoicedNum" :label="$t('salesAmountWaterfullBoard.vinCheckData.yearInvoiceCount')" :formatter="formatterNumber">
            </el-table-column>
            <el-table-column prop="toBeDetermined" :label="$t('salesAmountWaterfullBoard.vinCheckData.tbd')" :formatter="formatterNumber">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import VinCheckApi from '@/api/contract/vinCheck'
export default {
    data() {
        return {
            vinList: [],
            showLoad:false
        }
    },
    mounted() {
        // this.init()
    },
    methods: {
        async init() {
            this.showLoad = true
            let res = await VinCheckApi.getList()
            this.showLoad = false
            if (res.data.code === 200 || res.data.code === 0) {
                this.vinList = res.data.data || []
                this.showLoad = false
            }

        },
        formatterNumber(row, column, cellValue, index) {
            return this.$formatAmt(cellValue,0)
        },
        columnStyle({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 0 || columnIndex == 1 || columnIndex == 2 || columnIndex == 3 || columnIndex == 4) {
                let style = {
                    background: '#D9ECFF',
                }
                if (rowIndex === this.vinList.length - 1) {
                    style = {
                        background: 'RGB(156,107,48,0.5)',
                    }
                }
                return style;
            } else {
                if (rowIndex === this.vinList.length - 1) {
                    return 'background:RGB(156,107,48,0.5)'
                }
                return "background:#E9E9EB";
            }

        }
    }
}
</script>

<style scoped lang="scss">
.el-table .yellow {
    background-color: yellow;
}

.pl120 {
    padding-left: 125px;
}

.line-height {
    line-height: 30px;
}
</style>
