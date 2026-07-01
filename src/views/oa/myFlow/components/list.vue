<template>
    <div>
        <el-table :data="tableData" style="width: 100%" height="700" @sort-change="handleSortChange">
            <el-table-column prop="titleName" :label="$t('flow.processTitle')" width="200">
                <template slot-scope="scope" align="center">
                    <div class="flex" @click="toRouter(scope.row)">
                        <div class="title-width">{{ scope.row.titleName }}</div>
                        <svg class="back" v-if="scope.row.redDot">
                            <!--  cx: 中心点的x轴的坐标，cy: 中心点的y轴坐标，r为圆的半径，fill为圆的背景色 -->
                            <circle cx="0.1rem" cy="0.1rem" r="0.05rem" fill="#F56C6C" />
                        </svg>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="processDefinitionName" :label="$t('flow.type')" width="100" align="center">
            </el-table-column>
            <el-table-column prop="createUserName" :label="$t('flow.creator')" align="center">
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('commonContent.createDate')" sortable width="130" align="center">
            </el-table-column>
            <el-table-column prop="endTime" sortable :label="$t('commonContent.ArchivedTime')" width="130" align="center">
            </el-table-column>
            <el-table-column prop="taskName" :label="$t('myFlow.currentNode')" align="center">
            </el-table-column>
            <el-table-column prop="assigneeName" :label="$t('myFlow.pendingOperator')" align="center">
            </el-table-column>
            <el-table-column prop="addAssigneeStatus" :label="$t('myFlow.addAssigneeStatus')" align="center">
            </el-table-column>
            <el-table-column prop="address" :label="$t('commonContent.operation')" width="160" align="center">
                <template slot-scope="scope">
                    <div class="flex">
                        <div class="flex-wrap">
                            <el-button @click="toEdit(scope.row)" type="text" size="small" v-if="isEdit(scope.row)">{{
                                $t('commonContent.edit') }}</el-button>
                            <el-button @click="deleteRow(scope.row)" class=" ml10" type="text" size="small"
                                v-if="canDelete(scope.row)">{{ $t('commonContent.delete') }}</el-button>
                            <el-button v-if="canOperateBtn(scope.row) && !noShowBtn(scope.row)"
                                @click="handleOperation(scope.row, 'agree')" type="text" size="small">{{ $t('flow.approve')
                                }}</el-button>
                            <el-button v-if="canOperateBtn(scope.row) && !noShowBtn(scope.row)"
                                @click="handleOperation(scope.row, 'disAgree')" type="text" size="small">{{
                                    $t('flow.reject') }}</el-button>
                            <!-- <el-button v-if="!isEdit(scope.row) && !isRead" type="text" size="small"
                        @click="transpond(scope.row)">转发</el-button> -->
                            <el-button v-if="canOperateBtn(scope.row) && noShowBtn(scope.row)" @click="toDetail(scope.row)"
                                type="text" size="small">{{ $t('flow.Approval') }}</el-button>
                            <el-button v-if="showDown(scope.row) && scope.row.downStatus === 0" @click="downLoad(scope.row)"
                                type="text" size="small">{{ $t('flow.Downloads') }}</el-button>
                            <el-button icon="el-icon-circle-check" style="color: #67C23A;"
                                v-if="showDown(scope.row) && scope.row.downStatus === 1" @click="downLoad(scope.row)"
                                type="text" size="small">{{ $t('flow.downloaded') }}</el-button>
                            <el-button icon="el-icon-circle-check" style="color: #67C23A;"
                                v-if="showDown(scope.row) && scope.row.uploadStatus === 1" type="text" size="small">{{
                                    $t('flow.uploaded') }}</el-button>

                            <upload btnType="text" @handleRequest="handleRequestExport(...arguments, scope.row)"
                                :showTip="false" v-if="showDown(scope.row) && scope.row.status === 'finished'" class="mx10"
                                :btnName="$t('flow.UploadScan')"></upload>
                            <el-button v-if="showDown(scope.row) && scope.row.uploadStatus === 1" type="text" size="small"
                                @click="viewScanFile(scope.row)">{{ $t('flow.ViewScan') }}</el-button>
                        </div>
                        <!-- <el-button icon="el-icon-circle-check" style="color: #67C23A;"
                            v-if="scope.row.processDefinitionName === 'BOM及框架采购合同订单' && scope.row.downStatus === 1"
                            @click="downLoad(scope.row)" type="text" size="small">已下载</el-button> -->
                        <el-dropdown v-if="!isEdit(scope.row) && !isRead" class="auto-right"
                            @command="transpond($event, scope.row)">
                            <span class="el-dropdown-link">
                                <img src="@/assets/svg/more.svg" width="20" alt="">
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="transpond">转发</el-dropdown-item>
                                <el-dropdown-item v-if="type === 'waitDone'" command="countersign">加签</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background class="fr" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="current" :page-sizes="[10, 20, 30, 100]" :page-size="size"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog :title="titleDialog" :append-to-body='true' :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="120px">
                <p class="textHint">{{ textHint }}</p>
                <el-form-item :label="labelDialog">
                    <autoAddress placeholder="请选择人员" ref="autoAddress" class="w-100" @getPerson="getUser"
                        :initData="form.userIds" :initList="userList" :multiple="true">
                    </autoAddress>
                </el-form-item>
                <!-- <el-form-item label="意见" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark">
                    </el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{ $t('commonContent.cancel') }}</el-button>
                <el-button type="primary" @click="confirm">{{ $t('commonContent.confirm') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="$t('flow.ViewScan')" :append-to-body="true" :visible.sync="dialogVisibleScan" width="30%"
            :before-close="handleClose">
            <div>
                <div v-for="item in stampList" class="flex-space mb10">
                    <div class="w70">{{ item.name }}</div>
                    <el-button type="danger" @click="deleteFile(item)">删除</el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleScan = false">取 消</el-button>
                <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
            </span>
        </el-dialog>
        <el-dialog title="退回流程" :visible.sync="dialogVisibleRefuse" :append-to-body="true" width="30%"
            :before-close="handleClose">
            <el-form :model="formFlow" ref="formFlow" :rules="rules">
                <el-form-item label="退回原因" label-width="120px" prop="comment">
                    <el-input type="textarea" v-model="formFlow.comment"> </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleRefuse = false">取 消</el-button>
                <el-button type="primary" @click="confirmRefuse">确 定</el-button>
            </span>
        </el-dialog>
        <wordModelHardware v-show="false" :downModelTitle="downModelTitle()"
            :bomPurchaseContractForm="bomPurchaseContractForm" ref="wordModelRefHardware"></wordModelHardware>
        <wordModelLicense v-show="false" :downModelTitle="downModelTitle()"
            :bomPurchaseContractForm="bomPurchaseContractForm" ref="wordModelRefLicense"></wordModelLicense>
        <wordModelOther v-show="false" :downModelTitle="downModelTitle()" :bomPurchaseContractForm="bomPurchaseContractForm"
            ref="wordModelRefOther"></wordModelOther>
        <acceptService v-show="false" ref="acceptService"></acceptService>
    </div>
</template>

<script>
import wordModelHardware from "@/components/flow/wordModel/hardware.vue";
import wordModelOther from "@/components/flow/wordModel/other.vue";
import wordModelLicense from '@/components/flow/wordModel/license'
import acceptService from '@/components/flow/wordModel/acceptService'
import autoAddress from '@/components/autoAddress/index'
import BomPurchaseOrderApplyApi from "@/api/bomPurchaseOrderApply/index";
import { completeTask, retransmission, getList, deleteRowFlow, forwardTask } from '@/api/myFlow/index'
import { mapGetters } from 'vuex'
import upload from '@/components/upload/index'
import MyFlowApi from '@/api/myFlow/index'
import UploadApi from '@/api/upload'
export default {
    components: { autoAddress, wordModelHardware, wordModelOther, wordModelLicense, upload, acceptService },
    data() {
        return {
            refuseItem: {},
            dialogFormVisible: false,
            dialogVisibleRefuse: false,
            tableData: [],
            form: {
                userIds: [],
                remark: ''
            },
            formFlow: {
                comment: null
            },
            dialogVisibleScan: false,
            rowForm: {
                supplierName: null
            },
            comment: null,
            curRow: {},
            current: 1,
            size: 30,
            total: 30,
            transformType: null,
            titleDialog: null,
            labelDialog: null,
            textHint: '',
            userList: [],
            stampList: [],
            rules: {
                comment: [
                    { message: "请填写退回原因", required: true, trigger: 'blur' }
                ]
            },
        }
    },

    props: {
        type: {
            type: String
        },
        tabConfig: {
            type: Array
        },
        isRead: {
            type: Boolean,
            default: false
        },
        chooseFlow: {
            type: Object,
            default: false
        }
    },
    mounted() {
        let self = this
        window.addEventListener("storage", function (e) {
            if (e.key === "reloadPage") {
                self.refresh();
            }
        });
        this.getList()
    },
    watch: {
        chooseFlow() {
            this.getList()
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),

    },
    methods: {
        showDown(row) {
            return row.processDefinitionName === 'BOM及框架采购合同订单' || row.processDefinitionName === '验收申请单'
        },
        noShowBtn(row) {
            if (row.processDefinitionKey === "personJoinCompany" || row.processDefinitionKey === 'personLeaveCompany' || row.processDefinitionKey === 'acceptApply' || row.processDefinitionKey === 'subscriptionApply'
                || row.processDefinitionKey === 'purchaseCommissionDecisionApply') {
                return true
            }
        },
        handleSortChange({ column, prop, order }) {
            console.log(column)
            console.log(prop)
            console.log(order)
        },
        confirmRefuse() {
            this.$refs.formFlow.validate((valid) => {
                if (valid) {
                    this.dialogVisibleRefuse = false
                    this.doOperate(this.refuseItem, 'disAgree')
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        deleteFile(row) {
            // console.log(row)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await MyFlowApi.deleteFile(row.id)
                let res1 = await MyFlowApi.getFileStampList(row.businessId, this.userInfo.user_id, row.businessName)
                this.stampList = res1.data.data
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async viewScanFile(row) {
            console.log(row)
            let key = row.processDefinitionName === '验收申请单' ? 'acceptFinished' : 'BomOrderFinished'
            let res = await MyFlowApi.getFileStampList(row.businessId, this.userInfo.user_id, key)
            this.stampList = res.data.data
            this.dialogVisibleScan = true
        },
        sum(arr) {
            return arr.reduce((acc, curr) => acc + curr, 0);
        },
        downModelTitle() {
            if (!this.rowForm.bomPurchaseOrderDetailList) return
            let arr = this.rowForm.bomPurchaseOrderDetailList.map(ele => ele.cycle)
            arr = Array.from(new Set(arr))
            let arrQuantity = this.rowForm.bomPurchaseOrderDetailList.map(ele => Number(ele.quantity))
            let sumNum = this.sum(arrQuantity)
            if (this.rowForm.purchaseOrderType === 'License') {
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                return `${year}年${arr.toString()}License采购订单`
            }
            return `上汽海外出行科技有限公司和${this.rowForm.supplierName}<br/>${this.rowForm.purchaseOrderType === '硬件PO订单' ? `订单_${sumNum}台` : `${arr.toString()}`}_${this.rowForm.applyDate}`
        },
        async handleRequestExport(data, arr, file, row) {
            arr = arr.filter(ele => {
                return ele.url
            })
            let obj = {
                fileList: arr,
                id: row.businessId
            }
            let res = row.processDefinitionName === 'BOM及框架采购合同订单' ? await UploadApi.saveFileUrl(obj) : await UploadApi.saveFileUrlAccept(obj)
            // console.log(res)
            MyFlowApi.updateFlowUserStatus(row.processInstanceId, this.userInfo.user_id, row.processDefinitionName === 'BOM及框架采购合同订单' ? "BomOrderFinished" : "acceptFinished")
            this.getList()
        },
        async bomDetailDown(row) {
            let res = await BomPurchaseOrderApplyApi.details(row.businessId)
            this.rowForm = res.data.data
            this.$nextTick(() => {
                if (this.rowForm.purchaseOrderType === '硬件PO订单') {
                    this.$refs.wordModelRefHardware.downModel(this.rowForm.id)
                } else if (this.rowForm.purchaseOrderType === 'License') {
                    this.$refs.wordModelRefLicense.downModel(this.rowForm.id)
                } else if (this.rowForm.purchaseOrderType === '服务类' || !this.rowForm.purchaseOrderType) {
                    this.$refs.wordModelRefOther.downModel(this.rowForm.id)
                }

            })
        },
        async acceptDetailDown(row) {
            this.$nextTick(() => {
                this.$refs.acceptService.downModel(row.businessId)
            })
        },
        async downLoad(row) {
            if (row.processDefinitionName === 'BOM及框架采购合同订单') {
                this.bomDetailDown(row)
            } else if (row.processDefinitionName === '验收申请单') {
                this.acceptDetailDown(row)
            }
            MyFlowApi.updateFlowUserStatus(row.processInstanceId, this.userInfo.user_id)
            this.getList()
        },
        refresh() {
            // 执行刷新操作
            this.getList()
            localStorage.removeItem("reloadPage");
        },
        //可操作审批和退回的按钮条件，当前人和未操作人是同一个人。非已阅读，已退回状态
        canOperateBtn(row) {
            return (row.assignee === this.userInfo.user_id || row.otherAssignee === this.userInfo.user_id) && !this.isRead && row.processIsFinished !== 'back' && this.type === 'waitDone'
        },
        //可编辑的是待提交的或是已被退回的
        isEdit(row) {
            return (row.status === 'waitSubmit' || row.processIsFinished === 'back') && this.tabConfig.type === 'waitDone'
        },
        canDelete(row) {
            // console.log(this.tabConfig.type)
            return (row.status === 'waitSubmit' || row.processIsFinished === 'back') && this.tabConfig.type !== 'haveDone'
        },
        deleteRow(row) {
            this.$confirm('确定将选择数据删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let obj = {
                    businessId: row.businessId,
                    processInstanceId: row.processInstanceId
                }
                let res = await deleteRowFlow(obj)
                if (res.data.code === 200) {
                    this.getList()
                }
            })
        },
        async getList() {
            let obj = {
                current: this.current,
                size: this.size
            }
            if (this.tabConfig.type === 'waitDone') {
                obj.todoTabList = this.tabConfig.todoTabList
            } else if (this.tabConfig.type === 'haveDone') {
                obj.doneTabList = this.tabConfig.doneTabList
            } else if (this.tabConfig.type === 'myRequest') {
                obj.mineTabList = this.tabConfig.mineTabList
            }
            obj.processDefinitionName = this.chooseFlow.categoryName
            let res = await getList(obj)
            if (res.data.code === 200 || res.data.code === 0) {
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            }
        },
        toRouter(row) {
            if (row.status === 'finished') {
                this.setRead(row)
            }
            let url = `${row.path}?businessId=${row.businessId}&taskId=${row.taskId}&type=${this.type}&processIsFinished=${row.processIsFinished}&status=${row.status}`
            if(row.processDefinitionName==='零件价格维护'){
                url = `${url}&titleName=${row.titleName}`
            }
            window.open(this.$router.resolve({ path: url }).href, '_blank')
        },
        async setRead(row) {
            let res = MyFlowApi.deleteRedDot(row.processInstanceId, this.userInfo.user_id)
            this.getList()
        },
        toDetail(row) {
            let url = `${row.path}?businessId=${row.businessId}&taskId=${row.taskId}&type=${this.type}&processIsFinished=${row.processIsFinished}&status=${row.status}`
            window.open(this.$router.resolve({ path: url }).href, '_blank')
        },
        toEdit(row) {
            this.$router.push(`${row.path}?businessId=${row.businessId}&taskId=${row.taskId}&type=${this.type}&isEdit=true`)
        },
        handleOperation(row, key) {
            if (key === 'disAgree') {
                this.refuseItem = row
                this.formFlow.comment = null
                this.dialogVisibleRefuse = true
                return
            }
            this.$confirm(`确定${key == 'agree' ? '批准' : "退回"}此流程吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.doOperate(row, key)
            }).catch(() => {

            });
        },
        cancel() {
            this.dialogFormVisible = false
        },
        async confirm() {
            let obj = {
                "businessId": this.curRow.businessId,
                "processDefinitionId": this.curRow.processDefinitionId,
                "processInstanceId": this.curRow.processInstanceId,
                "remark": this.form.remark,
                "userIdList": this.form.userIds
            }
            let Api = this.transformType === 'transpond' ? retransmission : forwardTask
            console.log(Api)
            let res = await Api(obj)
            if (res.data.code === 200) {
                this.dialogFormVisible = false
            }
        },
        doOperate(row, key) {
            const params = {
                taskId: row.taskId,
                processInstanceId: row.processInstanceId,
                flag: 'ok',
            };
            if (key === 'disAgree') {
                delete params.flag
                params.comment = this.formFlow.comment
            }
            completeTask(params).then(res => {
                const data = res.data;
                if (data.success) {
                    this.getList()
                    this.$message.success(data.msg);
                } else {
                    this.$message.error(data.msg);
                }
            })
        },
        getUser(data, arr) {
            this.form.userIds = []
            this.userList = arr
            arr.map(ele => {
                this.form.userIds.push(ele.id)
            })
        },
        transpond(e, row) {
            this.transformType = e
            this.labelDialog = e === 'transpond' ? '转发人员' : "加签人员"
            this.titleDialog = e === 'transpond' ? '我的转发' : "我的加签"
            this.textHint = e === 'transpond' ? '注：转发人员不参与审批过程' : "注：加签人员参与审批过程"
            this.curRow = row
            this.form.userIds = []
            this.userList = []
            this.dialogFormVisible = true
        },
        handleSizeChange(val) {
            this.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.current = val
            this.getList()
        }
    }
}
</script>

<style>
.title:hover {
    color: #409eff;
    display: flex;
    align-items: center;
}

.red {
    color: red;
}

/* .title-width {
    width: 180px;
} */
.back {
    margin-top: 4px;
}

.textHint {
    padding: 10px 50px;
    color: red
}

.dot {
    width: 5px;
    /* 红点的宽度 */
    height: 5px;
    /* 红点的高度 */
    background-color: red;
    /* 红点的背景颜色 */
    border-radius: 50%;
    margin: 10px 5px;
    /* 红点是圆形 */
    /* position: absolute;
  top: 12px;
  right: 0px;  */
}

.auto-right {
    margin-left: auto;
}

.w70 {
    width: 70%;
}
</style>
