<template>
    <basic-container>
        <div class="fr pb10" v-if="!disabled">
            <span class="add-icon" @click="addRow">+</span>
        </div>
        <el-table :data="tableList">
            <el-table-column v-for="item in myList" :label="$t(item.name)" align="center">
                <template slot="header">
                    {{ $t(item.name) }}
                    <span class="red" v-if="item.required">*</span>
                </template>
                <template slot-scope="scope">
                    <el-input :disabled="disabled" v-if="item.type === 'input'"
                        v-model="scope.row[item.nameKey]"></el-input>
                    <el-select :disabled="disabled" v-else-if="item.type === 'select'" v-model="scope.row[item.nameKey]">
                        <el-option v-for="(self) in item.optionList" :key="self[item.valueKey || 'value']"
                            :label="self[item.labelKey || 'label']" :value="self[item.valueKey || 'value']"></el-option>
                    </el-select>
                    <el-date-picker style="width: 100%;" v-else-if="item.type === 'date'" v-model="scope.row[item.nameKey]"
                        :type="item.dateType || 'date'" placeholder="选择日期">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="!disabled">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteRow(scope.row)"> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </basic-container>
</template>

<script>
import CustomFlowApi from '@/api/customFlow/index'
export default {
    data() {
        return {
            myList: [],
            tableList: []
        }
    },
    props: {
        list: {
            type: Array,
            default: []
        },
        initTableList: {
            type: Array,
            default: []
        },
        detailId: {
            type: String
        }
    },
    computed: {
        disabled() {
            return this.detailId && !this.$route.query.isEdit
        }
    },
    watch: {
        initTableList() {
            this.tableList = this.initTableList
        },
        list() {
            this.myList = JSON.parse(JSON.stringify(this.list))
            this.dealList()
        }
    },
    mounted() {

    },
    methods: {
        deleteRow(row) {
            this.tableList = this.tableList.filter(ele => {
                return ele !== row
            })
        },
        addRow() {
            this.tableList.push({})
        },
        dealList() {
            console.log('-----dealList')
            this.myList.map(async ele => {
                if (ele.type === 'select' && ele.chooseData === '2' && ele.apiUrl) {
                    let res = await CustomFlowApi.getDictData(ele.apiUrl)
                    if (res.data.code === 200) {
                        ele.optionList = res.data.data
                    }
                    ele.valueKey = 'dictKey'
                    ele.labelKey = 'dictValue'
                }
            })
            console.log(this.myList)
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
</style>