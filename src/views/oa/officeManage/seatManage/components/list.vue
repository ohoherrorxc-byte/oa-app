<template>
    <div>
        <div class="imgHead">
            <img @click="preview" class="tablePng" mode="widthFix" src="@/assets/png/seat.jpg" alt="">
        </div>
        <el-row class="pt10">
            <el-col :span="8" class="flex-center">
                <p class="w60">{{ $t('seatManage.name') }}</p>
                <el-input v-model="searchForm.name" @change="getList"></el-input>
            </el-col>
        </el-row>
        <el-row class="pt10 flex-center">
            <Upload v-if="this.permissRow&&this.permissRow.region === 'all'" @handleRequest="handleRequest" :showTip="false" class="mx10 " url="/api/oa-portal/workSeat/import">
            </Upload>
            <el-button v-if="this.permissRow" @click="downLoad" size="mini" type="primary">{{ $t('seatManage.downloadTemplate') }}</el-button>
        </el-row>
        <div class="table my10 mr10">
            <div class="row row1 mr10 mb10" v-for="item in tableList" :key='item.label'> 
                <div class="flexCenter">
                    <p class="pb10">{{ item.label }}</p>
                    <div>
                        <el-button type="primary" v-if="canEditRow(item)" @click="addSeat(item)">{{ $t('seatManage.add') }}</el-button>
                        <el-button type="danger" v-if="canEditRow(item)" @click="deleteRow(item)">{{ $t('seatManage.batchDelete') }}</el-button>
                    </div>
                </div>
                <el-table ref="multipleTable" @selection-change="handleSelectionChange($event, item)" :data="item.children"
                    style="width: 100%" height="300" @row-click="rowClick">
                    <el-table-column v-if="canEditRow(item)" type="selection" width="55">
                    </el-table-column>
                      <el-table-column :sort-method="sortMethod" prop="seatCode" sortable :label="$t('seatManage.seatCode')" width="80"
                        align="center">
                    </el-table-column>
                    <el-table-column prop="userName" :label="$t('seatManage.name')" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.canEdit && canEditRow(item)" class="flex-center">
                                <autoAddress :allowCreate="true" ref="autoAddress" :disabled="disabled" :multiple="false"
                                    :initData="scope.row.userName"
                                    :initList="[{ userName: scope.row.userName, realName: scope.row.userName }]"
                                    class="w-100" @getPerson="getPerson($event, scope.row)"
                                    @getPersonCreate="getPersonCreate($event, scope.row)"></autoAddress>
                                <!-- <el-input v-model="scope.row.userName"></el-input> -->
                                <i @click="closeEdit(scope.row)" class="el-icon-check"></i>
                            </div>
                            <div v-else>{{ scope.row.userName }}</div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="操作" width="60" v-if="canEditRow(item)">
                        <template  slot-scope="scope">
                            <i class="el-icon-delete" @click.stop="deleteRow(scope.row,item)"></i>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true" width="95%">
            <img width="100%" src="@/assets/png/seat.jpg" alt="">
        </el-dialog>
        <el-dialog :title="$t('seatManage.add')" :append-to-body="true" :visible.sync="dialogVisibleSeat" width="30%"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item :label="$t('seatManage.region')">
                    <el-input disabled v-model="form.region"></el-input>
                </el-form-item>
                <el-form-item :label="$t('seatManage.seatCode')">
                    <el-input v-model="form.seatCode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('seatManage.name')">
                    <autoAddress :allowCreate="true" ref="autoAddress" :disabled="disabled" :multiple="false"
                        class="w-100" :initData="form.userName"
                        @getPerson="getPersonForm" @getPersonCreate="getPersonCreateForm"></autoAddress>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleSeat = false">{{ $t('seatManage.cancel') }}</el-button>
                <el-button type="primary" @click="confirm">{{ $t('seatManage.confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import seatManageApi from '@/api/seatManage/index'
import Upload from '@/components/upload/index'
import { downBlobFile } from '@/util/util'
import autoAddress from '@/components/autoAddress/index'
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(["userInfo"]),

    },
    data() {
        return {
            dialogVisible: false,
            dialogVisibleSeat: false,
            tableList: [
                {
                    label: this.$t('seatManage.projectGroup'),
                    children: [
                        {

                        }
                    ],
                    multipleSelection: [],
                },
                {
                    label: this.$t('seatManage.integrationAndSystemCertificationGroup'),
                    children: [
                        {

                        }
                    ],
                    multipleSelection: [],
                },
                {
                    label: this.$t('seatManage.productMiddleAndDevelopmentGroup'),
                    children: [
                        {

                        }
                    ],
                    multipleSelection: [],
                },
                {
                    label: this.$t('seatManage.testGroup'),
                    children: [
                        {

                        }
                    ],
                    multipleSelection: [],
                },
                {
                    label: this.$t('seatManage.productGroup'),
                    children: [
                        {

                        }
                    ],
                    multipleSelection: [],
                }
            ],
            searchForm: {
                name: null,
                // seatCode: null
            },
            form: {
                userName: null,
                seatCode: null,
                region: null,
                floor: '7'
            },
            curRow: {},
            permission: [
                {
                    name: '胡晓芸',
                    region: 'all'
                },
                {
                    name: '黄子恩',
                    region: 'all'
                },
                {
                    name: '胡晓陈',
                    region: '测试组'
                },
                {
                    name: '汪金华',
                    region: '项目组'
                },
                {
                    name: '许晨曦',
                    region: '产品组（APP组）'
                },
                {
                    name: '张民',
                    region: '产品中台及开发组'
                },
                // {
                //     name:'许云婷' ,
                //     region:'集成及体系认证组'
                // },
                {
                    name: '乔莎',
                    region: '集成及体系认证组'
                },
                {
                    name: 'admin',
                    region: 'all'
                }
            ],
            permissRow: null
        }
    },
    components: { Upload, autoAddress },
    mounted() {
        this.getList()
        this.getPremission()
    },
    methods: {
        canEditRow(item) {
            return this.permissRow && (this.permissRow.region === 'all' || this.permissRow.region === item.label)
        },
        getPremission() {
            let obj = this.permission.find(ele => {
                return ele.name === this.userInfo.nick_name
            })
            console.log(obj)
            if (obj) {
                this.permissRow = obj
            }
        },
        async getList() {
            let res = await seatManageApi.getList({ floor: '7', name: this.searchForm.name })
            if (res.data.code === 0 || res.data.code === 200) {
                let allData = res.data.data
                allData.map(ele => {
                    this.$set(ele, 'canEdit', false)
                })
                let arrA = allData.filter(ele => {
                    return ele.region === '项目组'
                })
                let arrB = allData.filter(ele => {
                    return ele.region === '集成及体系认证组'
                })
                let arrC = allData.filter(ele => {
                    return ele.region === '产品中台及开发组'
                })
                let arrD = allData.filter(ele => {
                    return ele.region === '测试组'
                })
                let arrE = allData.filter(ele => {
                    return ele.region === '产品组（APP组）'
                })
                this.tableList[0].children = arrA
                this.tableList[1].children = arrB
                this.tableList[2].children = arrC
                this.tableList[3].children = arrD
                this.tableList[4].children = arrE
            }
        },
        getPersonForm(data){
            this.form.userName = data.realName
        },
        getPersonCreateForm(data){
            this.form.userName = data
        },
        deleteRow(item) {
            let ids = item.multipleSelection.map(ele => ele.id)
            if (ids.length === 0) {
                this.$message.error('请先选择座位')
                return
            }
            this.$confirm(this.$t('seatManage.deleteSeat'), this.$t('seatManage.tip'), {
                confirmButtonText: this.$t('seatManage.confirm'),
                cancelButtonText: this.$t('seatManage.cancel'),
                type: 'warning'
            }).then(async () => {

                let res = await seatManageApi.deleteById(ids)
                if (res.data.code === 200 || res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('seatManage.deleteSuccess')
                    });
                    this.getList()
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('seatManage.cancelDelete')
                });
            });
        },
        handleSelectionChange(val, item) {
            // console.log(val)
            // console.log(item)
            item.multipleSelection = val
        },
        async downLoad() {
            let res = await seatManageApi.downFile()
            downBlobFile(res.data, this.$t('seatManage.seatTable'))
        },
        addSeat(item) {
            this.dialogVisibleSeat = true
            this.form.region = item.label
            this.form.userName = null
            this.form.seatCode = null
            this.form.id = null
        },
        sortMethod(a, b) {
            const number1 = a.seatCode.match(/\d+/g);
            const number2 = b.seatCode.match(/\d+/g);
            let num1, num2
            if (number1) {
                num1 = number1.join("")
                if (num1.length < 3) {
                    num1 = num1.slice(0, 1) + "0" + num1.slice(1)
                }
            }
            if (number2) {
                num2 = number2.join("")
                if (num2.length < 3) {
                    num2 = num2.slice(0, 1) + "0" + num2.slice(1)
                }
            }
            return num1 - num2

            // console.log(number2.toString())
        },
        getPerson(data, row) {
            row.userName = data ? data.realName : null
        },
        getPersonCreate(data, row) {
            row.userName = data
        },
        rowClick(row) {
            // console.log(this.userInfo)
            let arrName = ['胡晓芸', '胡晓陈', '汪金华', '许晨曦', '张民', '许云婷', '乔莎', 'admin']
            if (arrName.includes(this.userInfo.nick_name) || arrName.includes(this.userInfo.user_name)) {
                row.canEdit = true
                this.$nextTick(() => {
                    this.$refs.autoAddress[0].getInitData(row)
                })
            }
        },
        closeEdit(row) {
            this.form = row
            this.confirm()
        },
        openUpdate(row) {
            row.canEdit = true
        },
        async confirm() {
            let res = await seatManageApi.save(this.form)
            if (res.data.code === 0 || res.data.code === 200) {
                this.dialogVisibleSeat = false
                this.getList()
            }
        },
        preview() {
            this.dialogVisible = true
        }
    }
}
</script>

<style lang="scss" scoped>
.imgHead {
    overflow: scroll;
    margin-top: -30px;
}

.tablePng {
    width: 130%;
}

.table {
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;

    // grid-template-rows: 33.33% 33.33% 33.33%
}

.el-icon-delete {
    color: red;
}

.flexCenter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
}

.el-icon-check {
    font-size: 20px;
}
</style>
