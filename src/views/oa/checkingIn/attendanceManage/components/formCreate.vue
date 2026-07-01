<template>
    <div>
        <el-form ref="form" label-width="140px" v-model="form">
            <el-form-item label="考勤组名称">
                <el-input v-model="form.groupName"></el-input>
            </el-form-item>
            <el-form-item label="选择班次">
                <el-select v-model="form.rankId">
                    <el-option v-for="item in banCiList" :key="item.id" :value="item.id" :label="item.rankName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="允许外勤打卡">
                <el-switch v-model="outWorkStatus" @change="changeDaKa" active-color="#13ce66" >
                </el-switch>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="flex-between">
                    <span>办公地点列表</span>
                    <!-- <span class="add-icon" @click="addRow">+</span> -->
                </div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="clockInAddress" label="考勤地址" width="180">
                    </el-table-column>
                    <el-table-column prop="longitude" label="经度" width="180">
                    </el-table-column>
                    <el-table-column prop="latitude" label="纬度">
                    </el-table-column>
                    <el-table-column prop="radius" label="有效识别半径">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <el-dialog title="编辑办公地点" :append-to-body="true" :visible.sync="dialogVisiblePlace" width="80%"
            :before-close="handleClose">
            <mapContainer :pointCenter="pointCenter" @getPoint="getPoint" ref="mapContainer"></mapContainer>
            <el-form :model="formPostion" label-width="120px" class="form-postion">
                <el-form-item label="考勤地址">
                    <el-input v-model="formPostion.clockInAddress" placeholder="审批人"></el-input>
                </el-form-item>
                <el-form-item label="有效识别半径">
                    <el-input v-model="formPostion.radius" placeholder="有效识别半径"></el-input>
                </el-form-item>
                <el-form-item label="">

                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="formPostion.addressDetail" placeholder="详细地址"></el-input>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input v-model="formPostion.longitude" placeholder="经度"></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input v-model="formPostion.latitude" placeholder="纬度"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="remarkAddr">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AttendanceManageApi from '@/api/checkingIn/attendanceManage'
import mapContainer from '../../components/mapContainer.vue'
export default {
    components: {
        mapContainer
    },
    props: {
        detailData: {
            type: Object
        }
    },
    watch: {
        detailData() {
            if (this.detailData) {
                this.form = this.detailData
                this.outWorkStatus = this.form.outWorkStatus ? true : false
                this.tableData = [this.detailData]
                this.pointCenter = {
                    latitude: this.detailData.latitude,
                    longitude: this.detailData.longitude
                }
            }
        },
    },
    data() {
        return {
            dialogVisiblePlace: false,
            form: {
                outWorkStatus: 0,
                groupName: "",
                rankId: ""
            },
            tableData: [
                {
                    clockInAddress: "智能网联新能源汽车创新孵化中心",
                    longitude: "121.18158",
                    latitude: "31.280245",
                    radius: "300",
                    addressDetail: ""
                }
            ],
            outWorkStatus: false,
            formPostion: {
                clockInAddress: "",
                longitude: "",
                latitude: "",
                radius: "",
                addressDetail: ""
            },
            banCiList:[]
        }
    },
    mounted() {
        this.getBanCi()
        this.form = { ...this.form, ...this.tableData[0] }
    },
    methods: {
        async getBanCi() {
            let res = await AttendanceManageApi.banciList()
            console.log(res)
            if(res.data.code===0){
                this.banCiList = res.data.data
            }
        },
        addRow() {
            this.dialogVisiblePlace = true
        },
        changeDaKa() {
            console.log(this.outWorkStatus)
            this.form.outWorkStatus = this.outWorkStatus ? 1 : 0
        },
        editRow(row) {
            this.dialogVisiblePlace = true
            this.$nextTick(()=>{
                this.$refs.mapContainer.initMap()
            })
          
            this.formPostion = row
        },
        getPoint(point, addr) {
            this.formPostion.clockInAddress = addr
            this.formPostion.longitude = point[0]
            this.formPostion.latitude = point[1]
        },
        remarkAddr() {
            this.tableData[0] = this.formPostion
            this.form = { ...this.form, ...this.tableData[0] }
            this.dialogVisiblePlace = false

        }

    }
}
</script>

<style scoped lang="scss">
.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.form-postion {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
        width: 30%;
    }
}

.flex-between {
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
}
</style>