<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.name">
                <avue-crud v-if="activeName === item.name" :option="option" :search.sync="search" :table-loading="loading"
                    :data="data" ref="crud" v-model="form" :page.sync="page" @search-change="searchChange"
                    @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange"
                    @refresh-change="refreshChange" @on-load="onLoad" @selection-change="handleSelectionChange">
                    <!-- <template slot="qrcode" slot-scope="{row}">
                        <div @click="toDetail(row)">
                            <QrCodeComponent :text="textQr(row)" ></QrCodeComponent>
                        </div>
                    </template> -->
                    <template slot-scope="{disabled,size}" slot="recipientSearch">
                        <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                            @getPerson="getPerson" :initData="form.recipient" v-model="search.recipient"
                            :disabled="disabled" :multiple="false">
                        </autoAddress>
                    </template>
                    <template slot="menuLeft">
                        <div class="btn ">
                            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">新增
                            </el-button>
                            <el-button type="primary" size="small" plain icon="el-icon-download" @click="downModel">下载模板
                            </el-button>
                            <div style="margin-top: 7px;">
                                <upload url="/api/oa-portal/assetManagement/import"> </upload>
                            </div>
                            <el-button size="small" type="warning" plain icon="el-icon-download" @click="handleExport">导出
                            </el-button>
                            <el-button size="small" type="danger" plain icon="el-icon-delete" @click="handleDelete">删除
                            </el-button>
                            <el-button size="small" type="primary" icon="el-icon-printer" @click="batchPrint">批量打印
                            </el-button>
                        </div>
                    </template>
                    <template slot-scope="{type,size,row,index}" slot="menu">
                        <el-button icon="el-icon-edit" :size="size" :type="type" @click="editRow(row)">编辑</el-button>
                        <el-button icon="el-icon-view" :size="size" :type="type"
                            @click="toDetail(row, 'view')">查看</el-button>
                    </template>
                </avue-crud>
            </el-tab-pane>
        </el-tabs>
        <printDetail v-if="printPage" :multipleSelection="multipleSelection" ref="printDetail"></printDetail>
        <createLedger :isAssetPerson="isAssetPerson" @getReflesh="onLoad(page)" ref="createLedger"></createLedger>
    </basic-container>
</template>

<script>
import createLedger from './components/createLedger'
import upload from '@/components/upload/index'
import AssetsManageApi from '@/api/assetsManage/index'
import { assetStatus } from './config'
import { downBlobFile } from '@/util/util'
import autoAddress from '@/components/autoAddress/index'
import QrCodeComponent from '@/components/qrcodeComponent/index.vue'
import printDetail from './printDetail'
export default {
    data() {
        return {
            activeName: "all",
            printPage: false,
            tabList: [
                {
                    name: 'all',
                    label: "全部"
                },
                {
                    name: 'inReceipt',
                    label: "领用中"
                },
                {
                    name: 'scrapped',
                    label: "已报废"
                },
                {
                    name: 'inIdle',
                    label: "闲置中"
                },

                {
                    name: 'isReturn',
                    label: "已归还"
                },
                {
                    name: 'isRepair',
                    label: "维修中"
                },
                {
                    name: 'isDoing',
                    label: "进行中"
                },
            ],
            search: {},
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            data: [],
            form: {
                assetStatusList: [0, 1, 2, 3, 5]
            },
            option: {
                height: "auto",
                calcHeight: 80,
                tip: false,
                searchShow: true,
                searchMenuSpan: 100,
                border: true,
                index: true,
                selection: true,
                viewBtn: false,
                addBtn: false,
                editBtn: false,
                delBtn: false,
                menuWidth: 80,
                // menu: false,
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                    // {
                    //     label: "二维码",
                    //     prop: "qrcode",
                    //     width: 140,

                    //     search: false,
                    //     display: false,
                    // },
                    {
                        label: "资产名称",
                        prop: "assetName",
                        searchLabelWidth: 80,
                        searchSpan: 8,
                        search: true,
                        display: false,
                    },
                    {
                        label: "资产编号",
                        prop: "assetNumber",
                        slot: true,
                        search: true,
                        display: false,
                    },
                    {
                        label: "资产大类",
                        prop: "assetCategories",
                        searchSpan: 8,
                        dicUrl: '/api/oa-system/dict-biz/dictionary?code=assetCategories',
                        searchLabelWidth: 80,
                        search: true,
                        display: false,
                        type: 'select',
                        props: {
                            label: 'dictValue',
                            value: 'dictValue'
                        }
                    },
                    {
                        label: "规格型号",
                        prop: "specificationAndModel",
                        display: false,
                    },
                    {
                        label: "资产简称",
                        prop: "assetAbbreviation",
                        display: false,
                    },
                    {
                        label: "品牌",
                        prop: "brand",
                        display: false,
                    },
                    {
                        label: "资产级别",
                        prop: "assetLevel",
                        display: false,
                    },
                    {
                        label: "供应商名称",
                        prop: "supplierName",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: "数量",
                        prop: "quantity",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: "采购日期",
                        prop: "purchaseDate",
                        width: 100,
                        search: false,
                        display: false,
                        formatter:function(val){
                            if(val.purchaseDate){
                                return val.purchaseDate.substring(0, 10)
                            }
                        }
                    },
                    {
                        label: "使用年限",
                        prop: "serviceLife",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: "领用人",
                        prop: "recipient",
                        search: true,
                        display: false,
                        slot: true
                    },
                    {
                        label: "领用部门",
                        prop: "receivingDepartment",
                        display: false,
                    },
                    {
                        label: "领用时间",
                        prop: "requisitionDate",
                        display: false,
                        formatter:function(val){
                            if(val.requisitionDate){
                                return val.requisitionDate.substring(0, 10)
                            }
                        }
                    },
                    {
                        label: "在库状态",
                        prop: "assetStatus",
                        display: false,
                        formatter: (row, value) => {
                            return assetStatus[value]
                        }
                    },
                    {
                        label: "存放地点",
                        prop: "storageLocation",
                        type: 'select',
                        search: true,
                        display: false,
                        dicUrl: '/api/oa-system/dict-biz/dictionary?code=storageLocation',
                        props: {
                            label: 'dictValue',
                            value: 'dictKey'
                        }
                    },
                    {
                        label: "资产说明",
                        prop: "assetDescription",
                        display: false,
                    },
                    {
                        label: "是否配有钥匙",
                        prop: "haveKey",
                        display: false,
                    },
                    {
                        label: "钥匙数量",
                        prop: "keyNum",
                        display: false,
                    },
                    {
                        label: "设备SN号",
                        prop: "serialNumber",
                        display: false,
                    },
                    {
                        label: "电脑是否入域",
                        prop: "computerDomainEntry",
                        display: false,
                    },
                    {
                        label: "实际使用人",
                        prop: "actualUser",
                        display: false,
                    },
                    {
                        label: "备注",
                        prop: "remark",
                        display: false,
                    },
                    {
                        label: "领用备注",
                        prop: "receivingRemark",
                        display: false,
                    },
                    {
                        label: "是否需要重新打印",
                        prop: "needPrint",
                        display: false,
                        search: true,
                        type: "select",
                        dicData: [
                                    {
                                      label: "否",
                                      value: "否",
                                    },
                                    {
                                      label: "是",
                                      value: "是",
                                    }],
                    },

                ],
            },
            multipleSelection: []
        }
    },
    components: {
        createLedger, upload, autoAddress, QrCodeComponent, printDetail
    },
    props:{
        isAssetPerson:{
            type:Array,
            default:[]
        }
    },
    watch:{
        isAssetPerson(){
            if(this.isAssetPerson){
                this.option.column = this.option.column.filter(ele=>{
                    return ele.label!=='备注'
                })
            }
        }
    },
    mounted(){

    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size: page.pageSize,
                current: page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            this.loading = true;
            await AssetsManageApi.getList(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
        },
        textQr(row) {
            return `key=asset&id=${row.id}`
        },
        toDetail(row) {
            this.$router.push(`/assetsDetail?id=${row.id}`)
        },
        handleClick() {
            //0：进行中；1：闲置中；2：领用中；3：维修中；4：已报废;5:已归还
            let obj = {
                'all': [0, 1, 2, 3, 5],
                "inReceipt": [2],
                "scrapped": [4],
                "inIdle": [1],
                "isDoing": [0],
                "isReturn": [5],
                "isRepair": [3]
            }
            this.form.assetStatusList = obj[this.activeName]
            this.onLoad(this.page)
        },
        handleAdd() {
            this.$refs.createLedger.dialogVisible = true
            this.$refs.createLedger.resetForm()
        },
        editRow(row) {
            this.$refs.createLedger.dialogVisible = true
            this.$refs.createLedger.getDetails(row.id)
        },
        getPerson(data) {
            console.log(data)
            this.form.recipient = data.name
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async downModel() {
            let res = await AssetsManageApi.exportAssetTemplate()
            downBlobFile(res.data, '资产台账模板')
        },
        async handleExport() {
            let obj = { ...this.form, ...this.query }

            let res = await AssetsManageApi.exportAsset(obj)
            downBlobFile(res.data, '资产台账')
        },
        async handleDelete() {
            let ids = this.multipleSelection.map(ele => ele.id)
            // console.log(ids)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await AssetsManageApi.deleteLedger(ids)
                console.log(res.data.code === 0)
                if (res.data.code === 0) {
                    // console.log( this.$refs.crud)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.onLoad(this.page)
                    this.$refs.crud[0].$refs.table.clearSelection()

                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        batchPrint() {
            this.printPage = true
            console.log()
            setTimeout(() => {
                this.$refs.printDetail.handlePrint()
            }, 100)
            setTimeout(() => {
                this.printPage = false
            }, 1000)
        },
        searchReset() {
            this.query = {};
            this.form.recipient = null
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            // console.log(this.query)
            this.page.currentPage = 1;
            this.onLoad(this.page, params);
            done();
        },

        currentChange(currentPage) {
            this.page.currentPage = currentPage;
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
        },
        refreshChange() {
            this.onLoad(this.page, this.query);
        },
    }
}
</script>
