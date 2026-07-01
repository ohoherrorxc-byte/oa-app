<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.name">
                <avue-crud v-if="activeName === item.name" :option="option" :search.sync="search" :table-loading="loading"
                    :data="data" ref="crud" v-model="form" :page.sync="page" @search-change="searchChange"
                    @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange"
                    @refresh-change="refreshChange" @on-load="onLoad" @selection-change="handleSelectionChange">
                    <template slot-scope="{disabled,size}" slot="createUserNameSearch">
                        <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                            @getPerson="getPerson" :initData="form.createUserName" :disabled="disabled" :multiple="false">
                        </autoAddress>
                    </template>
                    <template slot="menuLeft">
                        <el-button type="warning" plain icon="el-icon-download" @click="handleExport">导出
                        </el-button>
                    </template>
                    <template slot-scope="{type,size,row,index}" slot="menu">
                         <el-button icon="el-icon-view"  :size="size" :type="type"
                          @click="toDetail(row, 'view')">查看</el-button>
                     </template>
                </avue-crud>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import list from './components/list.vue'
import AssetsManageApi from '@/api/assetsManage/index'
import { downBlobFile } from '@/util/util'
import { getDeptTree } from "@/api/organizationalStructure/department";
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            activeName: "inReceipt",
            tabList: [
                {
                    name: 'inReceipt',
                    label: "资产领用统计表"
                },
                {
                    name: 'isReturn',
                    label: "资产归还统计表"
                },
                {
                    name: 'scrapped',
                    label: "资产报废统计表"
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
                assetStatusList: [2]
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
                dialogClickModal: false,
                searchShowBtn: false,
                menu: true,
                column: [
                    {
                        label: "申请人",
                        prop: "createUserName",
                        search: true,
                        display: false,
                    },
                    {
                        label: "申请部门",
                        prop: "createDeptName",
                        search: true,
                        display: false,
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
                        label: "申请编号",
                        prop: "approvalCode",
                        display: false,
                    },
                    {
                        label: "申请日期",
                        prop: "applyTime",
                        type: "date",
                        search: true,
                        searchRange: true,
                        format: "yyyy-MM-dd HH:mm:ss",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        formatter(row,value){
                            return value.slice(0,10)
                        },
                        change: this.getTimer
                    },
                    {
                        label: "资产大类",
                        prop: "assetCategories",
                        dicUrl: '/api/oa-system/dict-biz/dictionary?code=assetCategories',
                        searchSpan: 8,
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
                        search: true,
                        display: false,
                    },
                    {
                        label: "存放地点",
                        prop: "storageLocation",
                        display: false,
                    },
                    {
                        label: "规格型号",
                        prop: "specificationAndModel",
                        display: false,
                    },
                    {
                        label: "品牌",
                        prop: "brand",
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
                        label: "报废说明",
                        prop: "scrapInstructions",
                        display: false,
                    },
                    {
                        label: "报废时间",
                        prop: "scrapDate",
                        display: false,
                    },
                    {
                        label: "流程结束时间",
                        prop: "flowEndTime",
                        display: false,
                    },
                ],
            },
            multipleSelection: []
        }
    },
    components: {
        list, autoAddress
    },
    mounted() {
        getDeptTree(629965).then((res) => {
            const column = this.findObject(this.option.column, "createDeptName");
            column.dicData = res.data.data;
        });
    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size:  page.pageSize,
                current:page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            // delete postdata.createTime
            this.loading = true;
            await AssetsManageApi.getListReport(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
        },
        handleClick() {
            //0：进行中；1：闲置中；2：领用中；3：维修中；4：已报废;5:已归还
            let obj = {
                "inReceipt": [2],
                "scrapped": [5],
                "isReturn": [3],
            }
            this.form.assetStatusList = obj[this.activeName]
            this.onLoad(this.page)
        },
        getPerson(data) {
            this.form.createUserName = data.name
        },
        toDetail(row){
             if(row.applyType==5){
                this.$router.push(`/scrappingApplication?businessId=${row.approvalId}`)
             }
             if(row.applyType==3){
                this.$router.push(`/returnApplication?businessId=${row.approvalId}`)
             }
             if(row.applyType==2){
                 this.$router.push(`/receiveApplication?businessId=${row.approvalId}`)
             }
        },
        handleSelectionChange(val){
             this.multipleSelection = val;
        },
        getTimer(v) {
            if (v && v.value && v.value.length > 0) {
                this.form.applyStartTime = v.value[0]
                this.form.applyEndTime = v.value[1]
            } else {
                this.form.applyStartTime = null
                this.form.applyEndTime = null
            }
        },
        async handleExport() {
            let obj = {...this.form,...this.query}
            obj.assetStatusList = obj.assetStatusList?obj.assetStatusList.toString():null
            let res = await AssetsManageApi.exportReport(obj)
            // console.log(res)
            downBlobFile(res.data, '资产报表')
        },
        searchReset() {
            this.query = {};
            this.getTimer()
            this.form.createUserName = null
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
