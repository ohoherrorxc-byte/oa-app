<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.name">
                <avue-crud v-if="activeName===item.name" :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud"
                    v-model="form" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
                    @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange"
                    @on-load="onLoad" @selection-change="handleSelectionChange">
                    <template slot-scope="{disabled,size}" slot="inventoryPersonSearch">
                        <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                            @getPerson="getPerson" :initData="form.inventoryPerson" 
                            :disabled="disabled" :multiple="false">
                        </autoAddress>
                    </template>
                    <template slot-scope="{disabled,size}" slot="recipientSearch">
                        <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                            @getPerson="getPersonRecipient" :initData="form.recipient" 
                            :disabled="disabled" :multiple="false">
                        </autoAddress>
                    </template>
                    <template slot="menuLeft">
                        <div class="btn">
                            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">新增
                            </el-button>
                            <el-button type="primary" size="small" plain icon="el-icon-download" @click="downModel">下载模板
                            </el-button>
                            <div style="margin-top: 7px;">
                                <upload url="/api/oa-portal/assetManagement/importInventory"> </upload>
                            </div>            
                            <el-button size="small" type="warning" plain icon="el-icon-download" @click="handleExport">导出
                            </el-button>
                            <el-button size="small" type="danger" plain icon="el-icon-delete" @click="handleDelete">删除
                            </el-button>
                            <el-button size="small" type="primary" plain  @click="handleBranch">批量盘点
                            </el-button>
                        </div>
                    </template>
                    <template slot-scope="{type,size,row,index}" slot="menu">
                        <el-button icon="el-icon-view"  :size="size" :type="type"
                            @click="toDetail(row, 'view')">查看</el-button>
                    </template>
                </avue-crud>
            </el-tab-pane>
        </el-tabs>
        <createInventory ref="createInventory"></createInventory>
    </basic-container>
</template>

<script>
import createInventory from './components/createInventory.vue'
import upload from '@/components/upload/index'
import AssetsManageApi from '@/api/assetsManage/index'
import {downBlobFile} from '@/util/util'
import QrCodeComponent from '@/components/qrcodeComponent/index.vue'
import { getDeptTree } from "@/api/organizationalStructure/department";
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            multipleSelection:[],
            activeName: "all",
            tabList: [
                {
                    name: 'all',
                    label: "全部"
                },
                {
                    name: 'unDone',
                    label: "未盘点"
                },
                {
                    name: 'done',
                    label: "已盘点"
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
                inventoryStatus:null
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
                delBtn:false,
                menuWidth:80,
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                    {
                        label: "盘点年份",
                        prop: "inventoryYear",
                        display: false,
                        search: true,
                    },
                    {
                        label: "资产名称",
                        prop: "assetName",
                        searchLabelWidth: 80,
                        searchSpan: 8,
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
                        label: "资产类别",
                        prop: "assetCategory",
                        display: false,
                    },
                    {
                        label: "资产大类",
                        prop: "assetCategories",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        display: false,
                        dicUrl: '/api/oa-system/dict-biz/dictionary?code=assetCategories',
                        type: 'select',
                        props: {
                            label: 'dictValue',
                            value: 'dictValue'
                        }
                    },
                    {
                        label: "相关项目",
                        prop: "relatedProjects",
                        display: false,
                    },
                    {
                        label: "存放地点",
                        prop: "storageLocation",
                        display: false,
                        type: 'select',
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
                        label: "资产级别",
                        prop: "assetLevel",
                        display: false,
                    },
                    {
                        label: "品牌",
                        prop: "brand",
                        display: false,
                    },
                    {
                        label: "价格（含税）",
                        prop: "unitPrice",
                        display: false,
                    },
                    {
                        label: "数量",
                        prop: "quantity",
                        display: false,
                    },
                    {
                        label: "供应商名称",
                        prop: "supplierName",
                        search: false,
                        display: false,
                    },
                    {
                        label: "规格型号",
                        prop: "specificationAndModel",
                        display: false,
                    },
                    {
                        label: "盘点状态",
                        prop: "inventoryStatus",
                        display: false,
                        formatter:(row, value)=>{
                            let obj = {
                                0:"未盘点",
                                1:"已盘点"
                            }
                            return obj[value]
                        }
                    },              
                    {
                        label: "是否配有钥匙",
                        prop: "haveKey",
                        display: false,
                        search: false,
                    },
                    {
                        label: "设备SN号",
                        prop: "serialNumber",
                        display: false,
                        search: false,
                    },
                    {
                        label: "盘点人",
                        prop: "inventoryPerson",
                        display: false,
                        search: true,
                    },
                    {
                        label: "盘点部门",
                        prop: "inventoryDept",
                        display: false,
                        search: true,
                        type: "tree",
                        multiple: false,
                        dicData: [],
                        props: {
                            label: "title",
                            value:'title'
                        },
                        checkStrictly: true,
                        slot: true,
                    },
                    {
                        label: "盘点日期",
                        prop: "inventoryDate",
                        display: false,
                        // propRange: ["inventoryStartTime", "inventoryEndTime"],
                        type: "date",
                        search: true,
                        searchRange:true,
                        format: "yyyy-MM-dd HH:mm:ss",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        change:this.getTimer,
                        formatter:function(val){
                            if(val.inventoryDate){
                                return val.inventoryDate.substring(0, 10)
                            }
                        }
                    },
                    {
                        label: "领用人",
                        prop: "recipient",
                        search: true,
                        display: false,
                    },
                    {
                        label: "领用部门",
                        prop: "receivingDepartment",
                        display: false,
                    },
                    {
                        label: "采购日期",
                        prop: "purchaseDate",
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
                        display: false,
                    },
                    {
                        label: "是否配有钥匙",
                        prop: "haveKey",
                        display: false,
                    },
                    {
                        label: "设备SN号",
                        prop: "serialNumber",
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

                ],
            },
        }
    },
    components: {
        createInventory, upload, autoAddress,QrCodeComponent
    },
    mounted() {
        getDeptTree(629965).then((res) => {
            const column = this.findObject(this.option.column, "inventoryDept");
            column.dicData = res.data.data;
        });
    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size:this.page.pageSize,
                current:this.page.currentPage         
            }
            let postdata = {...obj,...params,...this.query,...this.form}
            this.loading = true;
            await AssetsManageApi.getInventoryList(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
        },
        textQr(row){
            return `key=asset&id=${row.assetId}`
        },
        toDetail(row){            
            this.$router.push(`/assetsDetail?id=${row.assetId}`)
        },
        async handleDelete(){
            console.log( this.$refs.crud)     
            let ids = this.multipleSelection.map(ele=>ele.id)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(async () => {
            let res = await AssetsManageApi.deleteInventory(ids)
            if (res.data.code === 0) {
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
        async handleBranch(){
            let haveInventory = this.multipleSelection.filter(ele=>{return ele.inventoryStatus===1})
            if(haveInventory.length>0){
                this.$message.error('请选择未盘点的资产')
                return
            }
            let ids = this.multipleSelection.map(ele=>ele.assetId)
            if(ids.length===0){
                this.$message.error('请先选择需要盘点的资产')
                return
            }
            let res = await AssetsManageApi.updateInventoryStatusByIds(ids)
            if(res.data.code===0||res.data.code===200){
                this.$message.success("已盘点")
                this.onLoad()
            }
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        getPerson(data){
            this.form.inventoryPerson = data.name
        },
        getPersonRecipient(data){
            console.log(data)
            this.form.recipient = data.name
        },
        async downModel(){
            let res = await AssetsManageApi.exportAssetInventoryTemplate()
            downBlobFile(res.data,'资产盘点模板')
        },
        getTimer(v){
            if(v&&v.value&&v.value.length>0){
                this.form.inventoryStartTime = v.value[0]
                this.form.inventoryEndTime = v.value[1]
            }else{
                this.form.inventoryStartTime = null
                this.form.inventoryEndTime = null
            }
        },
        handleAdd() {
            this.$refs.createInventory.dialogVisible = true
            this.$refs.createInventory.resetForm()
        },
        async handleExport(){
            let obj = {...this.form,...this.query}
            let res = await AssetsManageApi.exportInventoryAsset(obj)
            console.log(res)
            downBlobFile(res.data,'资产盘点')
        },
        handleClick(){
            let obj = {
                'all':null,
                'unDone':0,
                'done':1
            }
            this.form.inventoryStatus = obj[this.activeName]
            this.onLoad(this.page)
        },
        searchReset() {
            this.getTimer()
            this.query = {};
            this.form.recipient = null
            this.form.inventoryPerson = null
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            if (this.query.account != undefined && this.query.account != "") {
                this.search.account = this.query.account.trim();
            }
            if (this.query.realName != undefined && this.query.realName != "") {
                this.search.realName = this.query.realName.trim();
            }
            this.page.currentPage = 1;
            this.onLoad(this.page, params);
            done();
        },

        currentChange(currentPage) {
            console.log(currentPage)
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

<style>
.btn{
    display: flex;
    align-items: center;
}
</style>