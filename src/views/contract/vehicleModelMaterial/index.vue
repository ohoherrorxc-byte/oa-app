<template>
    <basic-container>
        <avue-form :option="option" @submit="handleSubmit" ref="form" class="search-form">
            <template slot-scope="{ size }" slot="menuForm">
                <div class="flex-center">
                    <el-button class="ml10" type="primary" :size="size" icon="el-icon-refresh"
                        @click="refresh">{{ $t("commonContent.refresh") }}</el-button>
                    <el-button type="primary" :size="size" icon="el-icon-plus"
                        @click="handleOpenDialog({}, 'create')">{{ $t("commonContent.add") }}</el-button>
                    <upload class="ml10" url="/api/oa-portal/vehicleModelManage/materialImport" :showTip="false"> </upload>
                </div>
                <!-- <el-button type="primary" :size="size" icon="el-icon-download" @click="handleExport">导入</el-button> -->
            </template>
        </avue-form>
        <el-table v-sticky="{ top: 0, parent: '#avue-view' }" :data="tableData" style="width: 100%; margin-top: 20px" stripe
            align="center" border @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" />
            <el-table-column prop="modelName" :label="$t('vehicleModelMaterial.modelName')" align="left" width="150" show-overflow-tooltip />
            <el-table-column prop="countryReginCode" :label="$t('vehicleModelMaterial.countryRegion')" align="center" :formatter="regionFormatter" />
            <el-table-column prop="seriesName" :label="$t('vehicleModelMaterial.series')" align="center" />
            <el-table-column prop="materialNumberString" :label="$t('vehicleModelMaterial.materialNumber')" align="center" width="260" :formatter="codeFormatter">
                <template slot-scope="scope">
                    <div>
                        <div v-if="scope.row.materialNumber.length > 20" class="flex-wrap">
                            <div v-if="scope.row.isClose" v-for="item in scope.row.materialNumberShow">{{ item }}</div>
                            <div v-if="!scope.row.isClose" v-for="item in scope.row.materialNumber">{{ item }}</div>
                            <div class="colorBlue" @click="changeClose(scope.row)">
                                {{ scope.row.isClose ? `剩余（${scope.row.materialNumber.length - 20}）展开` : "折叠" }}</div>
                        </div>
                        <div v-else class="flex-wrap">
                            <div v-for="item in scope.row.materialNumber">{{ item }}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="bomName" :label="$t('vehicleModelMaterial.relevanceBom')" align="center" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.vehicleMaterialBomList">
                        {{ item.bomName }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('commonContent.operation')" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleOpenDialog(scope.row, 'detail')" type="text" icon="el-icon-view">{{ $t('commonContent.view') }}</el-button>
                    <el-button @click="handleOpenDialog(scope.row, 'edit')" type="text" icon="el-icon-edit">{{ $t('commonContent.edit') }}</el-button>
                    <!-- <el-button @click="(rowId = scope.row.id), (maintainRecords = true)" type="text"
                        icon="el-icon-view">维护记录</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"></el-pagination>
        <el-dialog :visible.sync="vehicleModelDialogFormVisible" append-to-body width="90%">
            <template slot="title">
                <div style="font-size: 15px">{{ dialogTitle }}</div>
            </template>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="countryReginCode">
                            <label slot="label">{{ $t("vehicleModelMaterial.countryRegion") }}:</label>
                            <el-select v-model="editForm.countryReginCode" clearable filterable
                                :disabled="isShowDetail || isEdit" @change="getCarList()">
                                <el-option v-for="item in areaList" :key="item.dictKey" :label="item.dictValue"
                                    :value="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="modelId">
                            <label slot="label">{{ $t("vehicleModelMaterial.modelName") }}:</label>
                            <el-select v-model="editForm.modelId" clearable filterable @change="selectModel"
                                :disabled="isShowDetail || isEdit">
                                <el-option v-for="item in modelNameList" :key="item.id" :label="item.modelName"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <label slot="label">{{ $t("vehicleModelMaterial.series") }}:</label>
                            <el-input v-model="editForm.seriesName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="type">
                            <label slot="label">{{ $t("vehicleModelMaterial.type") }}:</label>
                            <el-input v-model="editForm.modelTypeName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('vehicleModelMaterial.relevanceBom')">
                            <el-radio-group v-model="editForm.relevanceBom" :disabled="isShowDetail"
                                @change="changeBomStatus">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('vehicleModelMaterial.useHistoryBom')" v-if="!isShowDetail && editForm.relevanceBom">
                            <el-radio-group v-model="editForm.isFollow" :disabled="isShowDetail" @change="changeFollow">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="editForm.relevanceBom">
                    <div class="fr" v-if="!isShowDetail">
                        <span class="add-icon" @click="addBomList">+</span>
                    </div>
                    <el-col :span="24" class="pt10">
                        <el-table :data="editForm.vehicleMaterialBomList" style="width: 100%">
                            <el-table-column prop="date" :label="$t('vehicleModelMaterial.relevanceBom')" align="center" width="320">
                                <template slot="header">
                                    {{ $t("vehicleModelMaterial.relevanceBom") }}
                                    <span class="red">*</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'vehicleMaterialBomList.' + scope.$index + '.bomId'"
                                        :rules="editFormRules.bomId" style="width: 100%;" label-width="0px">
                                        <div class="flex">
                                            <el-select :disabled="isShowDetail" style="width: 100%"
                                                v-model="scope.row.bomId" clearable filterable
                                                @change="selectBom(scope.row.bomId, scope)">
                                                <el-option v-for="item in bomList" :key="item.id" :label="item.bomName"
                                                    :value="item.id"></el-option>
                                            </el-select>
                                            <div class="detailLink" @click="openBom(scope.row.bomId)">{{ $t("commonContent.viewDetails") }}</div>
                                        </div>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bomType" :label="$t('vehicleModelMaterial.bomType')" align="center" width="80">
                            </el-table-column>
                            <el-table-column prop="costCny" :label="$t('vehicleModelMaterial.costPrice')" align="center" width="80">
                            </el-table-column>
                            <el-table-column prop="offenders" :label="$t('vehicleModelMaterial.offenders')" align="center" width="80">
                            </el-table-column>
                            <el-table-column prop="contractPrice" :label="$t('vehicleModelMaterial.contractPrice')" align="center" width="80">
                            </el-table-column>
                            <el-table-column prop="name" :label="$t('vehicleModelMaterial.sopTime')" align="center">
                                <template slot="header">
                                    {{ $t("vehicleModelMaterial.sopTime") }}
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'vehicleMaterialBomList.' + scope.$index + '.sopTime'"
                                        style="width: 100%;" label-width="0px">
                                        <el-date-picker style="width: 100%" v-model="scope.row.sopTime" type="date"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                            :disabled="isShowDetail"></el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="eop有效期" align="center">
                                <template slot="header">
                                    {{ $t("vehicleModelMaterial.eopTime") }}
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'vehicleMaterialBomList.' + scope.$index + '.eopTime'"
                                        style="width: 100%;" label-width="0px">
                                        <el-date-picker style="width: 100%" v-model="scope.row.eopTime" type="date"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                            :disabled="isShowDetail"></el-date-picker>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" :label="$t('vehicleModelMaterial.platform')" align="center">
                                <template slot-scope="scope">
                                    <el-form-item label-width="0px">
                                        <el-select :disabled="isShowDetail" style="width: 100%" v-model="scope.row.platform"
                                            clearable filterable>
                                            <el-option v-for="item in platformList" :key="item.dictKey"
                                                :label="item.dictValue" :value="item.dictKey"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column width="50">
                                <template slot-scope="scope">
                                    <el-button v-if="!isShowDetail" type="text" style="color: red;"
                                        @click="delRowBom(scope.row)">{{ $t("commonContent.delete") }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="fl mt20 flex" v-if="!isShowDetail">
                        <upload @handleRequest="handleRequest" class="ml10" :btnName="$t('vehicleModelMaterial.batchImportMaterialNumber')"
                            url="/api/oa-portal/vehicleModelManage/materialNumberImport" :showTip="false"> </upload>
                        <div class="ml10">
                            <el-button type="primary" @click="downloadFile">{{ $t("vehicleModelMaterial.downloadMaterialNumberTemplate") }}</el-button>
                        </div>
                    </div>
                    <div class="fr mt20" v-if="!isShowDetail">
                        <span class="add-icon" @click="addMaterial">+</span>
                    </div>
                    <el-col :span="24" class="pt10">
                        <el-table :data="editForm.materialList" style="width: 100%">
                            <el-table-column :label="$t('commonContent.serialNumber')" type="index" width="50"></el-table-column>
                            <el-table-column prop="date" :label="$t('vehicleModelMaterial.materialNumber')">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.materialNo" :disabled="isShowDetail"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column width="100" v-if="!isShowDetail">
                                <template slot-scope="scope">
                                    <el-button type="text" style="color: red;" @click="delRow(scope.row)">{{ $t("commonContent.delete") }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer v-if="!isShowDetail">
                <span class="dialog-footer">
                    <el-button @click="vehicleModelDialogFormVisible = false" size="mini"
                        icon="el-icon-circle-close">{{ $t("commonContent.cancel") }}</el-button>
                    <el-button type="primary" @click="addMaterialDetail('editFormRef')" size="mini"
                        icon="el-icon-circle-check">{{ $t("commonContent.save") }}</el-button>
                </span>
            </template>
        </el-dialog>
        <MaintainRecords v-if="maintainRecords" :params="{ id: rowId, type: 'VEHICLE_MODEL' }"
            @close="maintainRecords = false" />
        <bomMaintDialog ref="bomMaintDialog"></bomMaintDialog>
    </basic-container>
</template>

<script>
import {
    delVehicleModel,
    selectLists,
    exportList, syncModelType, getBomByModelIdAndCountryCode
} from "@/api/contract/vehicleModelManage";
import bomMaintDialog from './bomMaintDialog.vue'
import upload from '@/components/upload/index'
import { saveOrUpdateVehicleModelMaterial, vehicleModelWithMaterialDetail, getList } from "@/api/contract/vehicleModelMaterial"
import { selectList } from "@/api/contract/bomMaint";
import { getOptions } from "@/api/base";
import { countryReginCode, modelId, bomId } from "@/util/formSelectList";
import { download } from "@/util/excel";
import MaintainRecords from "@/components/maintainRecords";
import { dealTimerSecond } from '@/util/util'
import UploadApi from "@/api/upload";
import { fileDownload, downloadFileBlob } from '@/util/util'
export default {
    components: {
        MaintainRecords, upload, bomMaintDialog
    },
    data() {
        return {
            maintainRecords: false,
            areaList: [],
            option: {
                size: "mini",
                span: 6,
                menuPosition: "left",
                submitText: this.$t("commonContent.search"),
                submitIcon: "el-icon-search",
                emptyBtn: false,
                column: [
                    countryReginCode,
                    modelId,
                    {
                        label: this.$t("vehicleModelMaterial.materialNumber"),
                        prop: 'materialNo'
                    }
                ],
            },
            queryInfo: {
                query: "",
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            editFormRules: {
                modelId: [{ required: true, message: this.$t("vehicleModelMaterial.modelNameRequired") }],
                bomId: [{ required: true, message: this.$t("vehicleModelMaterial.relevanceBomRequired") }],
                eopTime: [{ required: true, message: this.$t("vehicleModelMaterial.eopTimeRequired") }],
                sopTime: [{ required: true, message: this.$t("vehicleModelMaterial.sopTimeRequired") }],
                countryReginCode: [{ required: true, message: this.$t("vehicleModelMaterial.countryRegionRequired") }]
            },
            vehicleModelDialogFormVisible: false,
            dialogTitle: "",
            isShowDetail: false,
            editForm: {
                materialList: [
                ],
                vehicleMaterialBomList: []
            },
            isEdit: false,
            selectItems: [],
            bomList: [],
            platformList: [],
            modelNameList: [],
        };
    },
    methods: {
        addMaterial() {
            this.editForm.materialList.push({
                materialNo: null
            })
        },
        changeClose(row) {
            row.isClose = !row.isClose
        },
        changeBomStatus() {
            if (this.editForm.relevanceBom === 0) {
                this.editForm.vehicleMaterialBomList = []
            }
        },
        openBom(id) {
            let row = {
                id: id
            }
            this.$refs.bomMaintDialog.handleOpenDialog(row, 'detail')
        },
        async changeFollow() {
            if (!this.editForm.countryReginCode || !this.editForm.modelId) {
                this.$message.error(this.$t("vehicleModelMaterial.countryRegionRequired") + '或' + this.$t("vehicleModelMaterial.modelNameRequired"))
                return
            }
            if (this.editForm.isFollow === 1) {
                let res = await getBomByModelIdAndCountryCode({ countryReginCode: this.editForm.countryReginCode, modelId: this.editForm.modelId })
                console.log(res)
                if (res.data.code === 0 || res.data.code === 200) {
                    this.editForm.vehicleMaterialBomList = res.data.data || []

                }
            }
        },
        // 导出
        handleExport() {
            this.$confirm(this.$t("commonContent.confirmExport"), this.$t("commonContent.tip"), {
                confirmButtonText: this.$t("commonContent.confirm"),
                cancelButtonText: this.$t("commonContent.cancel"),
                type: "warning",
            })
                .then(() => {
                    return exportList();
                })
                .then((res) => {
                    download(res);
                });
        },
        addBomList() {
            this.editForm.vehicleMaterialBomList.push({

            })
        },
        selectBom(val, scope) {
            //选中的数据和options进行匹配
            this.bomList.find((item) => {
                if (item.id === val) {
                    scope.row.costCny = item.costCny;
                    scope.row.offenders = item.offenders;
                    scope.row.contractPrice = item.contractPrice;
                    scope.row.bomName = item.bomName
                    scope.row.bomType = item.bomType
                    return false;
                }
            });
        },
        async handleModel() {
            let res = await syncModelType()
            if (res.data.code === 200 || res.data.code === 0) {
                this.$message.success(this.$t("commonContent.syncSuccess"))
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
        handleRequest(data) {
            data.map(ele => {
                this.editForm.materialList.push({
                    materialNo: ele
                })
            })
        },
        delRowBom(row) {
            this.editForm.vehicleMaterialBomList = this.editForm.vehicleMaterialBomList.filter(ele => {
                return ele !== row
            })
        },
        delRow(row) {
            this.editForm.materialList = this.editForm.materialList.filter(ele => {
                return ele !== row
            })
        },
        async downloadFile() {
            let obj = {
                url: 'http://10.30.4.68:9000/license-prd/upload/20241024/492b1893aba77a8d71b7c6d4523fe9d0.xlsx'
            }
            let res = await UploadApi.getUrl(obj)
            console.log(this.isGoogleChrome() + 'isGoogle')
            if (this.isGoogleChrome()) {
                downloadFileBlob(res.data.data, '物料号模板.xlsx')
            } else {
                window.open(res.data.data)
            }
        },
        isGoogleChrome() {
            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            return isChrome;
        },
        handleSubmit(form, done) {
            this.form = form;
            this.queryInfo.pageNum = 1;
            this.getVehicleModelManageList(form);
            done();
        },
        getVehicleModelManageList() {
            getList(this.queryInfo.pageNum, this.queryInfo.pageSize, this.form).then(
                (res) => {
                    this.tableData = res.data.data.records;
                    this.tableData.map(ele => {
                        this.$set(ele, 'materialNumberString', null)
                        this.$set(ele, 'isClose', true)
                        this.$set(ele, 'materialNumberShow', [])
                        ele.materialNumber = ele.materialNumber || []
                        if (ele.materialNumber.length > 20) {
                            ele.materialNumberShow = JSON.parse(JSON.stringify(ele.materialNumber.slice(0, 20)))
                            console.log(ele.materialNumberShow)
                        } else {
                            ele.materialNumberShow = JSON.parse(JSON.stringify(ele.materialNumber))
                        }

                    })
                    this.$forceUpdate()
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
            this.isShowDetail = false;
            this.vehicleModelDialogFormVisible = true;
            this.$refs.editFormRef && this.$refs.editFormRef.resetFields();
            switch (type) {
                case "detail":
                    this.isShowDetail = true;
                    this.dialogTitle = this.$t("vehicleModelMaterial.viewVehicleMaterial");
                    this.setRowValue(row);
                    break;
                case "edit":
                    this.dialogTitle = this.$t("vehicleModelMaterial.editVehicleMaterial");
                    this.isEdit = true
                    this.isAdd = false;
                    this.setRowValue(row);
                    break;
                case "create":
                    this.dialogTitle = this.$t("vehicleModelMaterial.addVehicleMaterial");
                    this.isAdd = true;
                    this.isEdit = false
                    this.setRowValue({
                        materialList: [
                        ],
                        modelId: null,
                        seriesName: null,
                        relevanceBom: 1,
                        isFollow: null,
                        vehicleMaterialBomList: []
                    });
                    break;
            }
        },
        async setRowValue(row) {
            if (row.id) {
                let res = await vehicleModelWithMaterialDetail({ id: row.id })
                this.editForm = res.data.data
                this.$set(this.editForm, 'relevanceBom', null)
                this.editForm.materialNumber = this.editForm.materialNumber || []
                this.editForm.vehicleMaterialBomList = this.editForm.vehicleMaterialBomList || []
                this.editForm.relevanceBom = this.editForm.vehicleMaterialBomList.length > 0 ? 1 : 0
                this.$set(this.editForm, 'materialList', [])
                this.getCarList('isStart')
                this.editForm.materialNumber.map(ele => {
                    if (ele) {
                        this.editForm.materialList.push({ materialNo: ele })
                    }

                })
            } else {
                this.editForm = row
            }

        },
        addMaterialDetail(formName) {
            this.editForm.materialNumber = []
            this.editForm.materialList.map(ele => {
                if (ele.materialNo) {
                    this.editForm.materialNumber.push(ele.materialNo)
                }
            })
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editForm.vehicleMaterialBomList.map(ele => {
                        ele.eopTime = dealTimerSecond(ele.eopTime)
                        ele.sopTime = dealTimerSecond(ele.sopTime)
                    })
                    const message = this.isAdd ? this.$t("commonContent.addSuccess") : this.$t("commonContent.editSuccess");
                    saveOrUpdateVehicleModelMaterial(this.editForm)
                        .then((res) => {
                            if (res.data.code == 0) {
                                this.$message({
                                    message,
                                    type: "success",
                                });
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch((err) => this.$message.error(`${this.$t("commonContent.addFail")},${err.data.msg}`))
                        .finally(() => {
                            this.getVehicleModelManageList({});
                            this.vehicleModelDialogFormVisible = false;
                        });
                }
            });
        },
        refresh() {
            this.$refs.form.resetForm();
            this.form = {}
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
                this.bomList = res.data.data;
                this.bomList.forEach((item) => {
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
        getCarList(isStart) {
            console.log('12345678' + isStart)
            if (!isStart) {
                this.editForm.modelId = null
                this.editForm.seriesName = null
                this.editForm.vehicleMaterialBomList = []
            }
            selectLists({ countryReginCode: this.editForm.countryReginCode }).then((res) => {
                this.modelNameList = res.data.data;
                this.modelNameList.forEach((item) => {
                    item.id = +item.id;
                });
            });
        },
        selectModel(val) {
            //选中的数据和options进行匹配
            this.modelNameList.find((item) => {
                if (item.id === val) {
                    this.editForm.countryReginCode = item.countryReginCode;
                    this.editForm.seriesName = item.seriesName;
                    this.editForm.modelTypeName = item.modelTypeName;
                    return false;
                }
            });
        },
    },
    created() {
        this.getVehicleModelManageList({});
        this.initData({});
    },
};
</script>

<style lang="scss" scoped>
.search-form {
    ::v-deep ep.el-form-item__content {
        display: flex;
        align-items: center;
    }
}

.colorBlue {
    color: #409EFF
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>
