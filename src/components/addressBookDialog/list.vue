<template>
    <div>
        <div v-for="(item, index) in list" class="flex-center  row" @click="chooseRow(item, index)">
            <div v-if="multiple" class="pr20">
                <!-- {{ item.checked }} -->
                <img v-if="!item.checked" src="@/assets/svg/common/check.svg" alt="" width="20" height="20">
                <img v-else src="@/assets/svg/common/checked.svg" alt="" width="20" height="20" />
            </div>
            <img :src="item.showPhoto || avatarImg" alt="" width="40" height="40" class="avatar">
            <div class="pl20">
                <div>
                    <span class="pr10">{{ item.realName }}</span>
                    <span>{{ item.postName }}</span>
                </div>
                <div>
                    <span class="pr10">{{ item.companyName || '上汽海外出行科技有限公司' }}</span>
                    <span>{{ item.deptName }}</span>
                </div>
            </div>
        </div>
        <el-pagination background class="page-row" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
        </el-pagination>

    </div>
</template>

<script>
import AddressApi from '@/api/organizationalStructure/address'
export default {
    data() {
        return {
            avatarImg: "http://10.30.4.68:9000/license/upload/20231010/374463e89dbbb1059427a3e04b71774d.png",
            list: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            realName: ""
        }
    },
    props: {
        departmentId: {
            type: String,
            default: ''
        },
        directSuperiorId: {
            type: String,
            default: ''
        },
        isRecent: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        isCheckedList: {
            type: Array,
            default: []
        }
    },
    created() {
        this.getList('', true)
    },
    watch:{
        isCheckedList(){
            this.dealCheck()
        }
    },
    methods: {
        async getList(realName, recent, reset) {
            if (reset) {
                this.resetPage()
            }
            this.realName = realName
            if (recent || this.isRecent) {
                this.getRecentList()
                return
            }
            let obj = {
                current: this.currentPage,
                size: this.pageSize,
                deptId: this.departmentId,
                realName: this.realName,
                directSuperiorId: this.directSuperiorId
            }
            let res = await AddressApi.addressPerson(obj)
            if (res.data.code === 200 || res.data.code === 0) {
                this.list = res.data.data.records
                this.list = this.list.filter(ele=>{
                    return ele.account!=='luyong'
                })
                this.total = res.data.data.total
                this.dealCheck()
            }
        },
        dealCheck() {
            let ids = this.isCheckedList.map(ele => ele.id || ele.userId)
            this.list.map(ele => {
                if (ids.includes(ele.id)) {
                    ele.checked = true
                } else {
                    ele.checked = false
                }

            })
            this.$forceUpdate()
        },
        async getRecentList() {
            let obj = {
                current: this.currentPage,
                size: this.pageSize,
                realName: this.realName
            }
            let res = await AddressApi.recentPerson(obj)
            if (res.data.code === 200 || res.data.code === 0) {
                this.list = res.data.data.records
                this.total = res.data.data.total
                this.dealCheck()
            }
        },
        resetPage() {
            this.pageSize = 10
            this.currentPage = 1
        },
        chooseRow(item, index) {
            if (!this.multiple) {
                this.$emit('getPerson', item)
            } else {
                item.checked = !item.checked
                this.$set(this.list, index, item)
            }
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList('', this.deptId)
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList('', this.deptId)
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
    border-bottom: 1px solid #D9D9D9;
    height: 70px;
    position: relative;
}

.row::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
}

.row:hover {
    background-color: aliceblue;
    //   opacity: 0.5; /* 可选：改变透明度 */
}

.row:last-child {
    border: none;
}

.page-row {
    text-align: center;
    padding-top: 20px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 100%;
}
</style>