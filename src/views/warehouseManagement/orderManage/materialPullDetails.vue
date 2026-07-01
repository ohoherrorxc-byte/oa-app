<template>
    <div>
        <table style="width:100%" border>
            <thead>
                <tr>
                    <th rowspan="4">编号</th>
                    <th rowspan="4">零件号</th>
                    <th rowspan="4">零件名称</th>
                    <th rowspan="4">要求到货日期</th>
                    <th rowspan="4">需求数量</th>
                    <th rowspan="4" style="width: 200px;">项目名称</th>
                    <th rowspan="4">阶段</th>
                    <th colspan="2">实际交付</th>
                </tr>
                <tr>
                    <th>实收数量</th>
                    <th>实际到货日期</th>
                    <th>进仓单号</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableData">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.partsNumber }}</td>
                    <td>{{ item.partsName }}</td>
                    <td>{{ item.needDate | filter_date }}</td>
                    <td>{{ item.needNumber }}</td>
                    <td>{{ item.projectName }}</td>
                    <td>{{ item.stage }}</td>
                    <td>
                        <div v-for="subItem in item.storageList" class="pb5 m5  ">
                            <div>{{ subItem.realNumber }}</div>
                        </div>
                    </td>
                    <td>
                        <div v-for="subItem in item.storageList" class="pb5 m5  ">
                            {{ subItem.realInStorageDate | filter_date }}
                        </div>
                    </td>
                    <td>
                        <div v-for="subItem in item.storageList" class="pb5 m5  ">
                            <div class="flex" v-if="!isPlanor">
                                <el-input  v-model="subItem.storageNumber"></el-input>
                                <el-button type="text" class="ml5" @click="updateNumber(subItem)">更新</el-button>
                            </div>
                            <div v-else>{{ subItem.storageNumber }}</div>
                        </div>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
</template>
   
<script>
import substituteOrderManageApi from '@/api/substitute/orderManage'
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            tableData: [
                {
                    partsNumber: '',
                    partsName: '',
                    needDate: null,
                    needNumber: null,
                },
            ],
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
        formData: {
            type: Object,
            default: {}
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
        isPlanor() {
            if (this.userInfo.role_name.includes('计划员')) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        formData() {
            console.log('eeeeeeeformData')
            this.tableData = this.formData.inStorageDtos


        }
    },
    mounted() {

    },
    methods: {
       async updateNumber(subItem){
            let obj = {
                id:subItem.id,
                storageNumber:subItem.storageNumber
            }
            let res = await substituteOrderManageApi.updateInStorage(obj)
            console.log(res)
            if(res.data.code===0||res.data.code===200){
                this.$message.success('进仓单号已更新')
            }
        }
    }
};
</script>

<style scoped lang="scss">
tr {
    text-align: center;
    font-size: 12px;
}

table {
    border: 1px solid #DCDFE6;
    color: #606266;
    font-size: 12px;
}

.border-bottom {
    border-bottom: 1px solid #DCDFE6;
}
</style>