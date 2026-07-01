<template>
    <basic-container>
        <div class="table-title-first">
            <div class="titleFirst">
                <span class="spanLine"></span>订单信息
            </div>
            <div class="blue" @click="isFold = !isFold">
                {{ isFold ? "展开" : "折叠" }}
            </div>
        </div>
        <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="120px">
            <el-form-item v-if="form.id" label="当前状态" prop="" style="width: 96%">
                <div>{{ orderStatusName[form.orderStatus] }}</div>
            </el-form-item>
            <basic-container style="width: 100%;" v-if="!isFold">
                <p style="width: 96%" class="mx20 mt0 mb20">订单信息</p>
                <div class="flex flex-wrap">
                    <el-form-item label="订单类型" prop="">
                        <el-select v-model="form.orderType" v-if="!isDetail">
                            <el-option :value="0" label="量产订单"></el-option>
                            <el-option :value="1" label="客户样件订单"></el-option>
                        </el-select>
                        <div v-else="isDetail&&(form.orderType!==null&&form.orderType!==''&&form.orderType!==undefined)">{{
                            form.orderType === 0 ? "量产订单" : "客户样件订单" }}</div>
                    </el-form-item>
                    <el-form-item label="订单名称" prop="">
                        <el-input v-if="!isDetail" v-model="form.orderName"></el-input>
                        <div v-else>{{ form.orderName }}</div>
                    </el-form-item>
                    <el-form-item v-if="form.id" label="订单号" prop="">
                        <div>{{ form.orderNo }}</div>
                    </el-form-item>
                    <el-form-item v-if="form.id" label="订单日期" prop="">
                        <div>{{ form.createTime | filter_date }}</div>
                    </el-form-item>
                </div>
            </basic-container>
            <basic-container style="width: 100%;" v-if="!isFold && !isPlanor">
                <p style="width: 96%" class="mx20 mt0 mb20">客户信息</p>
                <el-form-item label="客户名称" prop="" style="width: 96%">
                    <el-select v-if="!isDetail" v-model="form.customName" clearable @change="contractCustChange" filterable>
                        <el-option v-for="item in custList" :value="item.custName" :key="item.id"
                            :label="item.custName"></el-option>
                    </el-select>
                    <div v-else>{{ form.customName }}</div>
                </el-form-item>
            </basic-container>
            <basic-container style="width: 100%;" v-if="!isFold">
                <p style="width: 96%" class="mx20 mt0 mb20">选择供应商</p>
                <div class="flex flex-wrap">
                    <el-form-item label="供应商" prop="">
                        <el-select v-if="!form.id" v-model="form.supplierNo" filterable @change="changeSupply">
                            <el-option v-for="item in supplyList" :key="item.supplierNo" :label="item.supplierName"
                                :value="item.supplierNo"></el-option>
                        </el-select>
                        <div v-else>{{ form.supplierName }}</div>
                    </el-form-item>
                    <el-form-item label="计划员" prop="">
                        <el-select multiple v-if="!form.id" filterable v-model="form.planUserIds" @change="changePlanUser">
                            <el-option v-for="item in userList" :key="item.id" :label="item.realName"
                                :value="item.id"></el-option>
                        </el-select>
                        <div v-else>{{ form.planUserNames }}</div>
                    </el-form-item>
                    <!-- <el-form-item v-if="isDetail" label="地址" prop="">
                        <div>{{ form.supplierAddress }}</div>
                    </el-form-item> -->
                    <el-form-item v-if="isDetail" label="电话" prop="">
                        <div>{{ form.supplierPhone }}</div>
                    </el-form-item>
                </div>
            </basic-container>
            <basic-container style="width: 100%;" v-if="!isFold">
                <p style="width: 96%" class="mx20 mt0 mb20  pt10">运输方式</p>
                <el-form-item label="运输方式" prop="">
                    <el-select v-if="!isDetail" v-model="form.transportType" clearable>
                        <el-option label="空运" value="空运"></el-option>
                        <el-option label="陆运" value="陆运"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                    <div v-else>{{ form.transportType }}</div>
                </el-form-item>
            </basic-container>
            <basic-container style="width: 100%;" v-if="!isFold">
                <p style="width: 96%" class="mx20 mt0 mb20  pt10">收货信息</p>
                <div class="flex flex-wrap">
                    <el-form-item label="收货仓名称" prop="">
                        <el-select @change="getRow" v-if="!isDetail" style="width: 100%" clearable
                            v-model="form.storageName">
                            <el-option v-for="item in storeList" :label="item.storeName" :value="item.storeName"
                                :key="item.storeName"> </el-option>
                        </el-select>
                        <div v-else>{{ form.storageName }}</div>
                    </el-form-item>
                    <el-form-item label="收货联系人" prop="">
                        <el-input v-if="!isDetail" v-model="form.takeOverConnect" clearable></el-input>
                        <div v-else>{{ form.takeOverConnect }}</div>
                    </el-form-item>
                    <el-form-item label="联系人电话" prop="">
                        <el-input v-if="!isDetail" v-model="form.connectNumber" clearable>
                        </el-input>
                        <div v-else>{{ form.connectNumber }}</div>
                    </el-form-item>
                    <el-form-item prop='' label="收货地址" style="width: 96%">
                        <el-input v-if="!isDetail" type="textarea" v-model="form.address" autosize></el-input>
                        <div v-else>{{ form.address }}</div>
                    </el-form-item>
                    <!-- <el-form-item label="进仓单号" prop="">
                        <el-input v-if="!isDetail" v-model="form.storageNumber"></el-input>
                        <div v-else>{{ form.storageNumber }}</div>
                    </el-form-item> -->
                </div>
            </basic-container>
            <!-- <basic-container style="width: 100%;"> -->
            <p class="table-title" style="width: 96%;">
                <span></span>订单明细
            </p>
            <el-form-item label-width="0" style="width: 100%;">
                <orderDetail v-show="!isDetail" :formData="form" ref="orderDetail"></orderDetail>
                <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" v-show="isDetail">
                    <el-tab-pane label="物料交付计划" name="detailTable" class="mt10">
                        <detailTable @reflesh="getDetail" :formData="form" ref="detailTable"> </detailTable>
                    </el-tab-pane>
                    <el-tab-pane label="物料拉动明细" name="second" class="mt10">
                        <materialPullDetails :formData="form" ref="materialPullDetails"></materialPullDetails>
                    </el-tab-pane>

                </el-tabs>
                <!-- <detailTable></detailTable> -->
            </el-form-item>
            <el-form-item label="订单备注" style="width: 96%">
                <el-input v-if="!isDetail" type="textarea" v-model="form.orderRemark"></el-input>
                <div v-else>{{ form.orderRemark }}</div>
            </el-form-item>
            <!-- </basic-container> -->
            <!-- <el-form-item label="相关附件">
                <upload :fileList="form.fileList" :isHistory="isHistory" btnName="上传" @handleRequest="handleRequest"
                    :multiple="true" :showFileList="true"></upload>
            </el-form-item> -->
            <el-form-item v-if="!isDetail" style="width: 96%;" class="btn-center">
                <el-button type="primary" @click="submit">提 交</el-button>
            </el-form-item>
            <p v-if="isDetail" class="table-title" style="width: 96%;">
                <span></span>操作记录
            </p>
            <el-form-item label-width="0" v-if="isDetail" style="width: 100%;" class="btn-center">
                <operationRecord ref="operationRecord"></operationRecord>
            </el-form-item>
        </el-form>
    </basic-container>
</template>
  
<script>
import upload from "@/components/upload/index";
import detailTable from './detailTable.vue'
import { mapGetters } from "vuex";
import orderDetail from './orderDetail'
import materialPullDetails from './materialPullDetails'
import { getCustList } from "@/api/contract/contractCustomer";
import substituteOrderManageApi from '@/api/substitute/orderManage'
import operationRecord from './operationRecord'
import { getProjectList } from "@/api/contract/contractProject";
export default {
    components: {
        upload, detailTable, orderDetail, materialPullDetails, operationRecord
    },
    data() {
        return {
            storeList: [],
            custList: [],
            supplyList: [],
            userList: [],
            isFold: false,
            isDetail: false,
            isEdit: false,
            activeName: 'detailTable',
            form: {
                custId: null,
                supplierName: null,
                planUserNames: [],
                planUserIds: [],
                planUserList: [],
                transportType: null,
                takeOverConnect: null,
                connectNumber: null,
                address: null,
                storageName: null,
                storageNumber: null,
                orderRemark: null,
                detailList: []
            },
            planUserList: [],
            orderStatusName: {
                0: '未交付',
                1: "部分交付",
                2: "全部交付",
                5: "已取消"
            },
            projectList: [],
            rules: {
                titleName: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ]
            }
        };
    },
    filters: {
        filter_date(value) {
            if (value) {
                return value.substring(0, 11)
            }
            return " "
        }
    },
    props: {

    },
    mounted() {
        if (this.$route.query.id) {
            this.getDetail(this.$route.query.id)
        }
        if (this.$route.query.isDetail) {
            this.isDetail = true
        }
        this.getCustListL()
        this.getSupplyList()
        this.getStoreList()
        this.getPlanUser()
        this.getContractProjectList()
    },
    computed: {
        ...mapGetters(["userInfo"]),
        disabled() {

        },
        isPlanor() {
            if (this.userInfo.role_name.includes('计划员')) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        async getDetail(id) {
            let res = await substituteOrderManageApi.detail(id || this.$route.query.id)
            console.log(res)
            if (res.data.code === 0 || res.data.code === 200) {
                this.form = res.data.data
                this.form.planUserList = this.form.planUserList || []
                this.form.planUserNames = this.form.planUserList.map(ele => ele.userName).toString()
                this.form.planUserIds = this.form.planUserList.map(ele => ele.userId.toString())
                this.$refs.operationRecord.getList()
            }
        },
        getContractProjectList() {
            getProjectList().then((res) => {
                this.projectList = res.data.data;
            });
        },
        getRow(name) {
            // console.log(name)
            let row = this.storeList.find(ele => {
                return ele.storeName === name
            })
            // console.log(row)
            this.form.address = row.storeAddress
            this.form.connectNumber = row.phone
            this.form.takeOverConnect = row.principal

        },
        async getCustListL() {
            let res = await getCustList({})
            this.custList = res.data.data;
        },
        contractCustChange() { },
        async getSupplyList() {
            let res = await substituteOrderManageApi.getContractSupplier()
            this.supplyList = res.data.data;
        },
        async getStoreList() {
            let res = await substituteOrderManageApi.storeList()
            this.storeList = res.data.data.records
        },
        async getPlanUser() {
            let res = await substituteOrderManageApi.planUser()
            this.userList = res.data.data
        },
        changeSupply(v) {
            let row = this.supplyList.find(ele => {
                return ele.supplierNo === v
            })
            // console.log(row)
            this.form.supplierName = row.supplierName
            this.form.supplierPhone = row.contactNumber
            this.form.supplierAddress = row.address
        },
        changePlanUser(v) {
            this.form.planUserList = []
            this.userList.map(ele => {
                if (this.form.planUserIds.includes(ele.id)) {
                    this.form.planUserList.push({
                        userId: ele.id,
                        userName: ele.realName
                    })
                }
            })
        },
        async submit() {
            this.form.deliverDtos = this.$refs.orderDetail.tableData
            this.form.detailList = this.$refs.orderDetail.tableData
            let Api = this.form.id ? substituteOrderManageApi.update : substituteOrderManageApi.insert
            let res = await Api(this.form)
            // console.log(res)
            if (res.data.code == 0) {
                this.$router.push('/substitute/orderManage/index?reflesh=true')
            }
        }
    }
};
</script>
  
<style lang="scss" scoped>
.el-form {
    display: flex;
    flex-wrap: wrap;
}

.table-title-first {
    height: 30px;
    line-height: 30px;
    padding: 8px;
    display: flex;
    justify-content: space-between;

    .titleFirst {
        .spanLine {
            display: inline-block;
            width: 3px;
            height: 16px;
            background: #000;
            margin-right: 10px;
        }
    }

    .blue {
        color: #409EFF;
    }
}


@media (min-width: 768px) {
    .el-form-item {
        width: 48%;
    }
}

.fullscreenL {
    overflow: scroll;
}

.btn-center {
    text-align: center;
}

.add-icon {
    color: #1d76ff;
    background-color: #deebff;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.w-100 {
    width: 100%;
}

.dec-icon {
    color: #979797;
    background-color: #eaeaea;
    padding: 3px 6px;
    border-radius: 2px;
    margin-right: 5px;
}

.exitFull {
    position: absolute;
    padding: 20px;
    color: transparent;
    z-index: 1000;
}

.exitFull:hover {
    color: #fff;
    background-color: #000;
}

.botton-row {
    margin-top: 50px;
    display: flex;
    justify-content: center;
}

.table-now {}

.bt1 {
    border-top: 1px solid #DCDFE6;
}
</style>
  