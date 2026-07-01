<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.name">
                <avue-crud v-if="activeName === item.name" :option="option" :search.sync="search" :table-loading="loading"
                    :data="data" ref="crud" v-model="form" :page.sync="page" @search-change="searchChange"
                    @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange"
                    @select="selectChoose" @refresh-change="refreshChange" @on-load="onLoad">
                    <template slot-scope="{disabled,size}" slot="recipientSearch">
                        <autoAddress placeholder="" @getPersonClear="getPersonClear" ref="autoAddress" :initList="initList"
                            class="w-100" @getPerson="getPerson" :initData="form.recipient" v-model="search.recipient"
                            :disabled="disabled" :multiple="false">
                        </autoAddress>
                    </template>
                    <template slot="menuLeft">
                        <div class="btn">
                            <el-button size="small" type="warning" plain icon="el-icon-download" @click="handleExport">导出
                            </el-button>
                            <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteRow">删除
                            </el-button>
                        </div>
                    </template>
                </avue-crud>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import upload from '@/components/upload/index'
import PartsManageApi from '@/api/partsManage/index'
import { downBlobFile, dealTimerSecond } from '@/util/util'
import { inReceiptColumn, scrapColumn, returnColumn } from './config/warehouseOption'
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            activeName: "inReceipt",
            tabList: [
                {
                    name: 'inReceipt',
                    label: "领用统计"
                },
                {
                    name: 'isReturn',
                    label: "归还统计"
                },
                {
                    name: 'scrapped',
                    label: "报废统计"
                }
            ],
            search: {},
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            data: [],
            form: {
                usageStartTime: null,
                usageEndTime: null
            },
            tabName: "领用统计",
            option: {
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
                searchBtn: true,
                emptyBtn: true,
                column: inReceiptColumn(this),
            },
            multipleSelection: []
        }
    },
    components: {
        upload, autoAddress
    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size: page.pageSize,
                current: page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            delete postdata.usageTime
            this.loading = true;
            let apiObj = {
                "inReceipt": 'useInfoList',
                "scrapped": 'scrapList',
                "isReturn": 'returnList',
            }
            await PartsManageApi[apiObj[this.activeName]](
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
        },
        getTimer(v) {
            if (v.value) {
                this.form.usageEndTime = v.value[1]
                this.form.usageStartTime = v.value[0]
            } else {
                this.form.usageEndTime = null
                this.form.usageStartTime = null
            }
        },
        handleClick(e) {
            this.tabName = e.label
            // this.option.searchBtn = e.label === '领用统计' ? true : false
            // this.option.emptyBtn = e.label === '领用统计' ? true : false
            let obj = {
                "inReceipt": inReceiptColumn(this),
                "scrapped": scrapColumn(this),
                "isReturn": returnColumn(this),
            }
            this.option.column = obj[this.activeName]
            this.onLoad(this.page)
        },
        getTimerReturn(v) {
            if (v.value) {
                this.form.returnEndTime = v.value[1]
                this.form.returnStartTime = v.value[0]
            } else {
                this.form.returnEndTime = null
                this.form.returnEndTime = null
            }
        },
        getTimerScrap(v){
            if (v.value) {
                this.form.scrapEndTime = v.value[1]
                this.form.scrapStartTime = v.value[0]
            } else {
                this.form.scrapEndTime = null
                this.form.scrapEndTime = null
            }
        },
        selectChoose(selection, row) {
            this.multipleSelection = selection
        },
        getPersonClear() {
            this.form.recipient = ''
        },
        getPerson(data) {
            this.form.recipient = data.realName
        },
        async handleExport() {
            let obj = {
                'inReceipt': PartsManageApi.useInfoExport,
                'isReturn': PartsManageApi.returnExport,
                "scrapped": PartsManageApi.scrapExport
            }
            let postdata = {  ...this.query, ...this.form }
            let fn = obj[this.activeName]
            console.log(postdata)
            let res = await fn(postdata)
            downBlobFile(res.data, `${this.tabName}.xlsx`)
        },
        async deleteRow() {
            let obj = {
                "inReceipt": 'useInfoDelete',
                "scrapped": 'scrapDelete',
                "isReturn": 'returnDelete',
            }
            let ids = this.multipleSelection.map(ele => ele.id)
            this.$confirm('确认批量删除文件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await PartsManageApi[obj[this.activeName]](ids)
                if (res.data.code === 0) {
                    this.$message.error('删除成功')
                    this.onLoad(this.page)
                }
            }).catch(() => {

            });
        },
        searchReset() {
            this.query = {};
            this.form.recipient = ''
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