<template>
    <el-drawer :visible.sync="drawer" :append-to-body="true" :direction="direction" :before-close="beforeClose">
        <div class="px20">
            <formSchedule @getList='getList' ref="formSchedule" :row="row" :formDetail='form'></formSchedule>
        </div>
        <div class="bottom-row">
            <div class="text-row">创建于 {{ this.form.createTimeFormat }}</div>
            <i class="el-icon-delete" @click="deleteRow" v-if="form.scheduleStatus"></i>
        </div>
    </el-drawer>
</template>

<script>
import formSchedule from './formSchedule'
import scheduleApi from '@/api/schedule/index'
import { yearMonthDayWeek } from '@/util/util'
export default {
    props: {
        row: {
            type: String
        }
    },
    components: {
        formSchedule
    },
    data() {
        return {
            drawer: false,
            direction: 'rtl',
            form: {
                scheduleStatus: null
            }
        }
    },
    watch: {
        row: {
            handler() {
                console.log(this.row)
                if (this.row && this.row.id) {
                    this.$set(this.form, 'createTimeFormat', yearMonthDayWeek(this.row.createTime))
                    this.form.scheduleStatus = this.row.scheduleStatus
                }
            },
            immediate: true,
            // 开启深度监听 deep
            deep: true,
        },
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        getList() {
            this.$emit('getList')
        },
        beforeClose(){
            this.$refs.formSchedule.closeZDY()
            console.log('beforeClose')
            this.row = null
            this.drawer = false
        },
        async getDetail() {
            if (!this.row || !this.row.id) return
            let res = await scheduleApi.detail({ id: this.row.id })
            if (res.data.code === 0) {
                this.form = res.data.data
                this.form.userList = this.form.userList || []
                this.$set(this.form, 'scheduleTimer', [this.form.startTime, this.form.endTime])
                this.$set(this.form, 'userIds', this.form.userList.map(ele => ele.userId))
                this.$set(this.form, 'createTimeFormat', yearMonthDayWeek(this.form.createTime))
                this.form.tabulationId  = (this.form.tabulationId||"").toString()
            }
        },
        async deleteRow() {
            console.log('dddddee')
            this.$confirm('此操作将永久删除该列表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await scheduleApi.deleteRow(this.row.id)
                console.log(res)
                if (res.data.code === 0) {
                    this.$message.success('列表已删除')
                    this.$emit('getList')
                    this.drawer = false
                }
            }).catch(() => {
                console.log('quxiao')
            });

        }
    },


}
</script>

<style scoped lang="scss">
.bottom-row {
    position: absolute;
    bottom: 10px;
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
}

.el-icon-delete {
    margin-left: auto;
    color: #FF0000;
    margin-right: 30px;
}

.text-row {
    width: 100%;
    text-align: center;
}
::v-deep ep .el-drawer__header{
    margin-bottom: 10px!important;
}
</style>