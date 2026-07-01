<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.name">
                <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud"
                    v-model="form" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
                    @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange"
                    @on-load="onLoad">
                    <template slot="menuLeft">
                        <el-button type="warning" plain icon="el-icon-download" @click="handleExport">导出
                        </el-button>
                    </template>
                    <!-- <template slot-scope="{type,size,row,index}" slot="menu">
                        <el-button icon="el-icon-edit" v-if="permission.user_edit" :size="size" :type="type"
                            @click="editRow(row)">编辑</el-button>
                        <el-button icon="el-icon-view" v-if="permission.user_view" :size="size" :type="type"
                            @click="editRow(row, 'view')">查看</el-button>
                    </template> -->
                </avue-crud>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import list from './components/list.vue'
import AssetsManageApi from '@/api/assetsManage/index'
import { downBlobFile } from '@/util/util'
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            activeName: "all",
            tabList: [
                {
                    name: 'all',
                    label: "全部"
                },
            ],
            search: {},
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            data: [],
            form: {},
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
                menu: false,
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
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
                        searchLabelWidth: 80,
                        search: true,
                        display: false,
                        dicUrl: '/api/oa-system/dict-biz/dictionary?code=assetCategories',
                        type: 'select',
                        props: {
                            label: 'dictValue',
                            value: 'dictValue'
                        }
                    },
                    {
                        label: "品牌",
                        prop: "brand",
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
                        label: "领用人",
                        prop: "recipient",
                        search: false,
                        // display: false,
                        searchValue: ''
                        // searchValue:this.userInfo.user_name

                    },
                    {
                        label: "领用部门",
                        prop: "receivingDepartment",

                        display: false,
                    },
                    {
                        label: "存放地点",
                        prop: "storageLocation",
                        search: true,
                        display: false,
                        type: 'select',
                        dicUrl: '/api/oa-system/dict-biz/dictionary?code=storageLocation',
                        props: {
                            label: 'dictValue',
                            value: 'dictKey'
                        }
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
                        label: "领用备注",
                        prop: "receivingRemark",
                        display: false,
                    },
                ],
            },
        }
    },
    components: {
        list
    },

    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        this.init()
    },
    methods: {
        async onLoad(page, params = {}) {
            console.log(this.userInfo)
            let obj = {
                size: page.pageSize ,
                current:page.currentPage,
                recipient:this.userInfo.user_name
            }
            let postdata = { ...obj, ...params, ...this.query }
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
        init() {
            this.option.column.map(ele => {
                //初始化领用人
                if (ele.label === '领用人') {
                    ele.searchValue = this.userInfo.user_name
                }
            })
        },
        async handleExport() {
            let obj = {...this.form,...this.query}
            let res = await AssetsManageApi.exportMyAsset(obj)
            console.log(res)
            downBlobFile(res.data, '我的资产')
        },
        searchReset() {
            this.query = {};
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
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