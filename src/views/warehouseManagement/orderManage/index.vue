<template>
    <basic-container >
        <avue-crud :option="option" :search.sync="search" :table-loading="loading" row-key="id" :data="data" ref="crud"
            v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" :before-open="beforeOpen"
            :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
            @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad" :default-expand-all="true">
            <template slot-scope="{ row }" slot="orderNo">
                <div class="blue" @click="toDetail(row)">{{ row.orderNo }}</div>
            </template>
            <template slot="menuLeft">
                <div class="flex-center">
                    <el-button v-if="!isPlanor" type="primary" icon="el-icon-plus" @click="handleAdd">{{$t('orderManage.add')}}
                    </el-button>
                    <!-- <upload  @handleRequest="handleRequest" :showTip="false" url="/api/oa-portal/store/importOrder"></upload> -->
                    <!-- <el-button type="success" plain icon="el-icon-upload2" @click="handleImport">导入
                </el-button> -->
                    <el-button type="warning" plain icon="el-icon-download" @click="handleExport">{{$t('orderManage.export')}}
                    </el-button>
                    <!-- <div class="flex m20">
                    <div class="mr30">{{$t('orderManage.totalNumber')}}:{{ totalData.totalNumber }}</div>
                    <div class="mr30">{{$t('orderManage.hadNumber')}}:{{ totalData.realNumber }}</div>
                    <div class="mr30">{{$t('orderManage.unconnectedNumber')}}: {{ totalData.unconnectedNumber }}</div> -->
                </div>
                </div>

                <!-- <avue-data-display style="width:100% ;" :option="optionData"></avue-data-display> -->
            </template>
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button v-if="!isFinish(row) && !isCancel(row) && !isPlanor && row.orderNo" icon="el-icon-circle-close"
                    :size="size" :type="type" @click="rowDel(row)">{{$t('orderManage.cancel')}}</el-button>
                <el-button v-if="!isFinish(row) && !isPlanor && row.orderNo" icon="el-icon-view" :size="size" :type="type"
                    @click="editRow(row, 'view')">{{$t('orderManage.change')}}</el-button>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import substituteOrderManageApi from '@/api/substitute/orderManage'
import upload from '@/components/upload/index'
import { downBlobFile } from '@/util/util'
export default {
    components: { upload },
    data() {
        return {
            form: {},
            search: {},
            query: {},
            loading: false,
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            option: {
                // height: 350,
                // maxHeight:['200px'],
                defaultExpandAll:true,
                calcHeight: 80,
                tip: false,
                searchShow: true,
                searchMenuSpan: 140,
                border: true,
                menuWidth: 150,
                // index: true,
                selection: true,
                viewBtn: false,
                addBtn: false,
                editBtn: false,
                dialogClickModal: false,
                searchShowBtn: false,
                delBtn: false,
                column: [
                    {
                        label: this.$t('orderManage.orderNo'),
                        prop: "orderNo",
                        searchLabelWidth: 80,
                        searchSpan: 8,
                        search: true,
                        display: false,
                        width: 200
                    },
                    {
                        label: this.$t('orderManage.orderName'),
                        prop: "orderName",
                        searchLabelWidth: 80,
                        searchSpan: 8,
                        search: true,
                        display: false,
                    },
                    {
                        label: this.$t('orderManage.orderStatus'),
                        prop: "orderStatus",
                        slot: true,
                        search: true,
                        display: false,
                        searchType: "select",
                        dicData: [
                            {
                                label: '未交付',
                                value: 0
                            },
                            {
                                label: '部分交付',
                                value: 1
                            },
                            {
                                label: '全部交付',
                                value: 2
                            }, {
                                label: '已取消',
                                value: 5
                            }
                        ],
                        formatter: ((data) => {
                            let obj = {
                                0: '未交付',
                                1: "部分交付",
                                2: "全部交付",
                                5: "已取消"
                            }
                            if (data.orderStatus !== undefined && data.orderStatus !== '' && data.orderStatus !== null) {
                                return `${obj[data.orderStatus]}`
                            } else {
                                return ''
                            }

                        })
                    },
                    {
                        label: this.$t('orderManage.partsName'),
                        prop: "partsName",

                        display: false,
                    },
                    {
                        label: this.$t('orderManage.partsNumber'),
                        prop: "partsNumber",
                        search: true,

                    },
                    {
                        label: this.$t('orderManage.projectName'),
                        prop: "projectName",
                        search: true,

                    },
                    {
                        label: this.$t('orderManage.realNumber'),
                        prop: "realNumber",

                    },
                    {
                        label: this.$t('orderManage.needNumber'),
                        prop: "needNumber",

                    },
                    {
                        label: this.$t('orderManage.uncollectedNumber'),
                        prop: "uncollectedNumber",

                    },
                    {
                        label: this.$t('orderManage.projectNo'),
                        prop: "projectNo",

                    },
                    {
                        label: this.$t('orderManage.supplierName'),
                        prop: "supplierName",
                        slot: true,
                        search: true,
                        dicUrl: '/api/oa-portal/contractSupplier/list',
                        type: 'select',
                        props: {
                            label: 'supplierName',
                            value: 'supplierName'
                        },
                        display: false,
                    },
                    {
                        label: this.$t('orderManage.planUserName'),
                        prop: "planUserName",
                        slot: true,
                        search: true,
                        dicUrl: '/api/oa-portal/purchasePartsOrder/planUser',
                        type: 'select',
                        props: {
                            label: 'realName',
                            value: 'realName'
                        },
                        display: false,
                        formatter: ((data) => {
                            data.planUserList = data.planUserList || []
                            let names = data.planUserList.map(ele => ele.userName)
                            return names.toString()
                        })
                    },
                    {
                        label: this.$t('orderManage.storageName'),
                        prop: "storageName",
                        slot: true,
                        display: false,
                    },
                    {
                        label: this.$t('orderManage.orderRemark'),
                        prop: "orderRemark",
                        slot: true,
                        display: false,
                    },
                ],
            },
            data: [],
            totalData: {}
        };
    },
    props: {

    },
    activated() {
        if (this.$route.query.reflesh) {
            this.onLoad(this.page);
        }
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["userInfo"]),
        isPlanor() {
            if (this.userInfo.role_name.includes('计划员')) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        searchReset() {
            this.query = {};
            this.onLoad(this.page);
        },
        handleAdd() {
            this.$router.push('/orderManageAdd')
        },
        toDetail(row) {
            this.$router.push(`/orderManageAdd?id=${row.id}&isDetail=true`)
        },
        isFinish(row) {
            return row.orderStatus === 2
        },
        isCancel(row) {
            return row.orderStatus === 5
        },
        async rowDel(row) {
            console.log(row)
            this.$confirm(this.$t('orderManage.cancelConfirm'), {
                confirmButtonText: this.$t('orderManage.confirm'),
                cancelButtonText: this.$t('orderManage.cancel'),
                type: "warning",
            })
                .then(() => {
                    return substituteOrderManageApi.remove(row.id)
                })
                .then(() => {
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: this.$t('orderManage.operationSuccess'),
                    });
                    this.$refs.crud.toggleSelection();
                });

        },
        editRow(row) {
            this.$router.push(`/orderManageAdd?id=${row.id}`)
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
        selectionChange(list) {
            this.selectionList = list;
        },
        selectionClear() {
            this.selectionList = [];
            this.$refs.crud.toggleSelection();
        },
        handleImport() {
            this.excelBox = true;
        },
        uploadAfter(res, done, loading, column) {
            window.console.log(column);
            this.excelBox = false;
            this.refreshChange();
            done();
        },
        handleExport() {
            this.$confirm(this.$t('orderManage.exportConfirm'), this.$t('orderManage.exportConfirm'), {
                confirmButtonText: this.$t('orderManage.confirm'),
                cancelButtonText: this.$t('orderManage.cancel'),
                type: "warning",
            }).then(async () => {
                let res = await substituteOrderManageApi.exportOrder()
                downBlobFile(res.data, this.$t('orderManage.orderManage'))
            });
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
        async getTotal(params) {
            let res = await substituteOrderManageApi.selectPageTotalNumber(params)
            console.log(res)
            if (res.data.code === 200 || res.data.code === 0) {
                this.totalData = res.data.data
            }
        },
        onLoad(page, params = {}) {

            this.loading = true;
            let obj = {
                current: page.currentPage,
                size: page.pageSize
            }
            let params1 = Object.assign(params, this.query, obj)
            this.getTotal(params1)
            substituteOrderManageApi.selectPage(
                params
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                data.records.map(ele => {
                    ele.children = ele.detailDtoList
                })
                this.loading = false;
                this.selectionClear();
            });
        },
    }
};
</script>

<style scoped lang="scss">
::v-deep ep.avue-crud__left {
    width: 100%;
}
.setHeight{
    height: 90vh;
}
.box {
    height: 800px;
}

.blue {
    color: #409EFF;
}
::v-deep ep.el-card{
    height: 100%;
}

.el-scrollbar {
    height: 100%;
}

.box .el-scrollbar__wrap {
    overflow: scroll;
}

::v-deep ep .cell {
    display: flex;
}
</style>
