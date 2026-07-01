<template>
    <el-dialog title="提示" :append-to-body="true" :visible.sync="dialogVisible" width="90%" :before-close="handleClose">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                <formCreate :detailData="detailData" ref="formCreate"></formCreate>
            </el-tab-pane>
            <el-tab-pane label="考勤组成员" name="second">
                <personList :detailData="detailData" ref="personList"></personList>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="remark">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import formCreate from './components/formCreate'
import personList from './components/personList'
import AttendanceManageApi from '@/api/checkingIn/attendanceManage/index'
export default {
    data() {
        return {
            dialogVisible: false,
            activeName: 'first',
            spaceTimer: '',
            form: {
            },
            detailData: {}
        }
    },
    components: {
        formCreate, personList
    },
    mounted() {
    },
    methods: {
        handleClose() {
            this.dialogVisible = false
        },

        async getDetails(id) {
            this.activeName = 'first'
            let res = await AttendanceManageApi.detail(id)
            if (res.data.code === 0) {
                this.detailData = res.data.data
            }
        },
        //新建重置页面
        resetForm() {
            this.activeName = 'first'
            this.detailData = {
                groupWithUserList: [],
                outWorkStatus: 0,
                groupName: "",
                rankId: "",
                clockInAddress: "智能网联新能源汽车创新孵化中心",
                longitude: "121.18158",
                latitude: "31.280245",
                radius: "300"
            }
        },
        async remark() {
            let form1 = this.$refs.formCreate.form
            let form2 = this.$refs.personList.personTableList
            let obj = {
                ...form1,
                groupWithUserList: form2
            }
            console.log(obj)
            let res = await AttendanceManageApi.save(obj)
            console.log(res)
            if (res.data.code === 0) {
                this.dialogVisible = false
                this.$emit('getReflesh')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.set-timer {
    display: flex;
    flex-wrap: wrap;
    line-height: 40px;


}

.w100 {
    width: 100px !important;
}

.mx10 {
    margin: 0 10px;
}

.mr5 {
    margin-right: 5px;
}

.ml20 {
    margin-right: 20px;
}

.font-gery {
    font-size: #666;
}

.items-center {
    align-items: center;
}
</style>