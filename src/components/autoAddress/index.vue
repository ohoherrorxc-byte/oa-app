<template>
    <div class="content">
        <div class="flex ">
            <el-select class="w-100" :allow-create="allowCreate" :disabled="disabled" @change="getPersonChange"
                v-model="valueKeys" :multiple="multiple" filterable remote clearable :placeholder="placeholder"
                :remote-method="remoteMethod" :loading="loading">
                <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item[valueKey]">
                </el-option>
            </el-select>
            <el-button :disabled="disabled" icon="el-icon-search" @click="openAddress()"></el-button>
        </div>
        <addressBookDialog :checkedList="checkedList" :multiple="multiple" @getPerson="getPerson" ref="addressBookDialog">
        </addressBookDialog>
    </div>
</template>

<script>
import UserApi from '@/api/organizationalStructure/user.js'
import addressBookDialog from '@/components/addressBookDialog/index'
export default {
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        initData: {
            type: String || Array
        },
        valueKey: {
            type: String,
            default: 'id'
        },
        initList: {
            type: Array,
            default: []
        },
        placeholder: {
            type: String,
            default: '请输入关键词'
        },
        allowCreate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showDialog: false,
            valueKeys: [],
            userList: [],
            selectArr: [],
            checkedList: [],
            allList: []
        }
    },
    components: {
        addressBookDialog
    },
    watch: {
        initData: {
            handler() {
                this.valueKeys = this.initData
                console.log(this.valueKeys)
                console.log('valueKeys')
            },
            deep: true
        },
        initList: {
            handler(newVal) {
                // console.log('newValinitList')
                // console.log(newVal)
                this.userList = newVal
                this.selectArr = newVal
                this.checkedList = newVal
            },
            deep: true
        }
    },
    mounted() {
        this.init()
        if (this.initList.length > 0) {
            this.userList = this.initList
        }
    },
    methods: {
        async init() {
            let res = await UserApi.userAllList()
            console.log(res)
            this.allList = res.data.data
            this.$emit('allUserList',this.allList)
        },
        getInitData(initList,id){
            this.userList = initList
            this.valueKeys = id
        },
        openAddress() {
            this.$refs.addressBookDialog.dialogVisibleAddress = true
            this.$refs.addressBookDialog.dealCheck()
        },
        async remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                let res = await UserApi.userAllList({ realName: query })
                this.loading = false
                this.userList = res.data.data
            } else {
                this.userList = [];
            }
        },
        getPersonChange() {
            console.log('eeee')
            if (this.multiple) {
                // console.log(this.valueKeys)
                this.selectArr = []
                this.selectArr = this.allList.filter(ele => {
                    return this.valueKeys.includes(ele[this.valueKey])
                })
                console.log(this.selectArr)
                console.log(this.valueKeys)
                console.log('33333333333')
                this.$emit('getPerson', this.valueKeys, this.selectArr)
            } else {

                let row = this.userList.find(ele => {
                    return ele[this.valueKey] === this.valueKeys
                })

                if (this.allowCreate && !row) {
                    this.$emit('getPersonCreate', this.valueKeys)
                }
                if (row) {
                    this.$emit('getPerson', row)
                }
                if (!this.valueKeys) {
                    this.$emit('getPersonClear', null)
                }
            }
            this.checkedList = this.userList.filter(ele => {
                return this.valueKeys.includes(ele[this.valueKey])
            })
        },
        getPerson(data) {
            if (this.multiple) {
                this.valueKeys = data.map(ele => ele[this.valueKey])
                this.userList = data
                this.$emit('getPerson', data, data)
            } else {

                this.userList = [data]
                this.valueKeys = data[this.valueKey]
                this.$emit('getPerson', data)
            }
        },
        // getInitData(row) {
        //     this.valueKeys = row.userName
        // }
    }
}
</script>

<style scoped lang="scss" >
.w-100 {
    width: 100%;
}

.content {
    ::v-deep ep.el-button {
        border-radius: 0px 5px 5px 0px !important;
        /* margin-left: -2px; */
        z-index: 8;
        background-color: #DCDFE6 !important;
    }

    ::v-deep ep.el-input .el-input__inner {
        border-radius: 4px 0 0 4px;
    }
}
</style>