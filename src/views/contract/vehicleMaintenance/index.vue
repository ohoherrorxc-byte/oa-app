<template>
    <basic-container>
        <avue-form :option="option" @submit="handleSubmit" ref="form">
            <template slot-scope="{ size }" slot="menuForm">
                <el-button type="primary" :size="size" icon="el-icon-refresh" @click="refresh">{{$t('commonContent.refresh')}}</el-button>
                <el-button type="primary" :size="size" icon="el-icon-plus"
                    @click="handleOpenDialog({}, 'create')">{{$t('commonContent.add')}}</el-button>
                <!-- <el-button type="primary" :size="size" icon="el-icon-download" @click="handleExport">导出</el-button>
                <el-button type="primary" :size="size" icon="el-icon-refresh" @click="handleModel">同步车型</el-button>
                <el-button :size="size" @click="handleDeleteData" icon="el-icon-delete" type="danger" plain>删除</el-button> -->
            </template>
        </avue-form>
        <el-table v-sticky="{ top: 0, parent: '#avue-view' }" :data="tableData" style="width: 100%; margin-top: 20px" stripe
            align="center" border @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" />
            <el-table-column prop="modelName" :label="$t('vehicleMaintenance.modelName')" align="left" width="150" show-overflow-tooltip />
            <el-table-column prop="countryReginCode" :label="$t('vehicleMaintenance.countryReginCode')" align="center" :formatter="regionFormatter" />
            <el-table-column prop="seriesName" :label="$t('vehicleMaintenance.seriesName')" align="center" />
            <!--
            <el-table-column prop="modelTypeName" label="网联车类型" align="center" />
            <el-table-column prop="statusName" label="状态" align="center" /> -->
            <!-- <el-table-column prop="sopTime" label="SOP时间" align="center" />
            <el-table-column prop="eopTime" label="EOP时间" align="center" /> -->
            <el-table-column prop="bomName" :label="$t('vehicleMaintenance.relatedBom')" align="center" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.vehicleMaterialBomList">
                        {{ item.bomName }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="bomName" :label="$t('vehicleMaintenance.bomType')" align="center" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.vehicleMaterialBomList">
                        {{ item.bomType }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="materialNo" :label="$t('vehicleMaintenance.materialNo')" align="center" />
            <!-- <el-table-column prop="offenders" label="责任人" align="center" /> -->
            <el-table-column fixed="right" :label="$t('commonContent.operation')" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleOpenDialog(scope.row, 'detail')" type="text" icon="el-icon-view">{{$t('commonContent.view')}}</el-button>
                    <el-button @click="handleOpenDialog(scope.row, 'edit')" type="text" icon="el-icon-edit">{{$t('commonContent.edit')}}</el-button>
                    <!-- <el-button @click="(rowId = scope.row.id), (maintainRecords = true)" type="text"
                        icon="el-icon-view">维护记录</el-button> -->
                    <!-- <el-button
              @click="handleDeleteData(scope.row, 'delete')"
              type="text"
              icon="el-icon-delete"
            >删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"></el-pagination>
        <addDialog ref="addDialog" @getList="getVehicleModelManageList"></addDialog>
        <MaintainRecords v-if="maintainRecords" :params="{ id: rowId, type: 'VEHICLE_MODEL' }"
            @close="maintainRecords = false" />
    </basic-container>
</template>

<script>
import {
    getList,
    delVehicleModel,
    saveOrUpdateVehicleModel,
    selectLists,
    exportList, syncModelType
} from "@/api/contract/vehicleModelManage";
import VehicleMaintenanceApi from '@/api/contract/vehicleMaintenance'
import { selectList } from "@/api/contract/bomMaint";
import { getOptions } from "@/api/base";
import { countryReginCode, modelId, bomId } from "@/util/formSelectList";
import { download } from "@/util/excel";
import MaintainRecords from "@/components/maintainRecords";
import addDialog from './addDialog'
export default {
    components: {
        MaintainRecords, addDialog
    },
    data() {
        return {
            maintainRecords: false,
            areaList: [],
            option: {
                size: "mini",
                span: 6,
                menuPosition: "left",
                submitText: this.$t('commonContent.search'),
                submitIcon: "el-icon-search",
                emptyBtn: false,
                column: [
                    countryReginCode,
                    modelId,
                    bomId,
                    // {
                    //     type: "select",
                    //     label: "责任人",
                    //     allowCreate: true,
                    //     filterable: true,
                    //     prop: "offenders",
                    //     dicUrl: `/api/oa-user/user-list?tenantId=${JSON.parse(localStorage["saber-userInfo"]).content.tenant_id
                    //         }`,
                    //     props: {
                    //         label: "name",
                    //         value: "id",
                    //     },
                    // },
                ],
            },
            tableData: [],
            queryInfo: {
                query: "",
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            dialogTitle: "",
            isShowDetail: false,
            editForm: {},
            isEdit: false,
            selectItems: [],
            bomList: [],
            platformList: [],
            modelNameList: [],
        };
    },
    methods: {
        // 导出
        handleExport() {
            this.$confirm("确定导出数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    return exportList();
                })
                .then((res) => {
                    download(res);
                });
        },
        async handleModel() {
            let res = await syncModelType()
            if (res.data.code === 200 || res.data.code === 0) {
                this.$message.success('已同步')
                this.getVehicleModelManageList({});
            }
        },
        regionFormatter(val) {
            let data = this.areaList.find((item) => {
                if (item.dictKey === val.countryReginCode) {
                    return item;
                }
            });
            return data ? data.dictValue : "";
        },
        handleSubmit(form, done) {
            this.form = form;
            this.queryInfo.pageNum = 1;
            this.getVehicleModelManageList(form);
            done();
        },
        getVehicleModelManageList() {
            let obj = {
                current: this.queryInfo.pageNum,
                size: this.queryInfo.pageSize,
                ... this.form
            }
            VehicleMaintenanceApi.selectPage(obj).then(
                (res) => {
                    this.tableData = res.data.data.records;
                    this.tableData.map(ele => {
                        ele.vehicleMaterialBomList = ele.vehicleMaterialBomList || []
                        // this.$set(ele,'bomName','')
                        // this.$set(ele,'eopTime','')
                        // this.$set(ele,'sopTime','')
                        // ele.bomName = ele.vehicleMaterialBomList.map(ele=>ele.bomName).toString()
                        // ele.eopTime = ele.vehicleMaterialBomList.map(ele=>ele.eopTime).toString()
                        // ele.sopTime = ele.vehicleMaterialBomList.map(ele=>ele.sopTime).toString()
                    })
                    this.queryInfo.total = res.data.data.total;
                }
            );
        },
        handleDeleteData(row, type) {
            if (type === "delete") {
                this.$confirm("确定将该条数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    delVehicleModel(row.id)
                        .then((res) => {
                            if (res.data.code == 0) {
                                this.$message.success("删除成功");
                            } else {
                                this.$message.error(`删除失败,${res.data.msg}`);
                            }
                        })
                        .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
                        .finally(() => {
                            this.getVehicleModelManageList({});
                        });
                });
            } else {
                if (!this.selectItems.length) {
                    this.$message.error("至少选择一条数据!");
                    return;
                }
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    let ids = this.selectItems.map((vehicleModel) => vehicleModel.id);
                    ids = ids.join(",");
                    delVehicleModel(ids)
                        .then((res) => {
                            if (res.data.code == 0) {
                                this.$message.success("删除成功");
                            } else {
                                this.$message.error(`删除失败,${res.data.msg}`);
                            }
                        })
                        .catch((err) => this.$message.error(`删除失败,${err.data.msg}`))
                        .finally(() => {
                            this.selectItems = [];
                            this.getVehicleModelManageList({});
                        });
                });
            }
        },
        editDialogClose() {
        },
        handleOpenDialog(row, type) {
            this.$refs.addDialog.vehicleModelDialogFormVisible = true
            this.$refs.addDialog.setTitle(type, row)
            // this.isShowDetail = false;
            // this.vehicleModelDialogFormVisible = true;
            // this.$refs.editFormRef && this.$refs.editFormRef.resetFields();
            // switch (type) {
            //     case "detail":
            //         this.isShowDetail = true;
            //         this.dialogTitle = "车型查看";
            //         this.setRowValue(row);
            //         break;
            //     case "edit":
            //         this.dialogTitle = "车型编辑";
            //         this.isEdit = true
            //         this.isAdd = false;
            //         this.setRowValue(row);
            //         break;
            //     case "create":
            //         this.dialogTitle = "车型新增";
            //         this.isAdd = true;
            //         this.isEdit = false
            //         this.setRowValue({});
            //         break;
            // }
        },
        setRowValue(row) {
            // console.log(row)
            this.editForm = row;
        },

        refresh() {
            this.$refs.form.resetForm();
            this.queryInfo.pageNum = 1;
            this.getVehicleModelManageList({});
        },
        // 表格多选
        handleSelectionChange(val) {
            this.selectItems = val;
        },
        handleCurrentChange(currentPage) {
            this.queryInfo.pageNum = currentPage;
            this.getVehicleModelManageList({});
        },
        handleSizeChange(pageSize) {
            this.queryInfo.pageSize = pageSize;
            this.getVehicleModelManageList({});
        },
        initData(params) {
            selectList(params).then((res) => {
                // 防御性：后端可能返回 data: null
                this.bomList = res.data.data || [];
                this.bomList.forEach((item) => {
                    item.id = +item.id;
                });
            });
            selectLists().then((res) => {
                // 防御性：后端可能返回 data: null
                this.modelNameList = res.data.data || [];
                this.modelNameList.forEach((item) => {
                    item.id = +item.id;
                });
            });
            getOptions({ code: "COUNTRY_REGIN" }).then((res) => {
                this.areaList = res.data.data;
            });
            getOptions({ code: "PLATFORM" }).then((res) => {
                this.platformList = res.data.data;
            });
        },
    },
    created() {
        this.getVehicleModelManageList({});
        this.initData({});
    },
};
</script>

<style></style>
