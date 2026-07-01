<template>
    <div class="tree">
        <div class=" mb10">
            <div class="pb10">{{ this.$t('addressBook.OrganizationalStructure') }}:</div>
            <el-input v-if="showInput" v-model.lazy="title" placeholder="请输入" @input="getlists" />
        </div>
        <el-tree node-key="id" ref="tree" :show-checkbox="multiple" :data="data" :props="defaultProps"
            @node-click="handleNodeClick" :highlight-current="gaoliang" :filter-node-method="filterNode"
            @check-change="handleCheckChange">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <!-- {{ node.data.realName }} -->
                <span v-if="deepPerson">{{ node.data.titleName || node.data.realName }}</span>
                <span v-else v-html="$options.filters.filterReal(node.data, title)"></span>
            </span>
        </el-tree>
    </div>
</template>

<script>
import AddressApi from '@/api/organizationalStructure/address'
import { mapGetters } from 'vuex'
export default {
    props: {
        showInput: {
            type: Boolean,
            default: true
        },
        serachValue: {
            type: String,
            default: ''
        },
        multiple: {
            type: Boolean,
            default: false
        },
        isCheckedList: {
            type: Array,
            default: []
        },
        deepPerson: {
            type: Boolean,
            default: true
        },
        inputTitle: {
            type: String,
            default: ''
        }
    },
    filters: {
        filterReal(data, title) {

            let key = title || this.serachValue || this.serachValueDeal
            let value = data.titleName || data.realName
            const ind = value.indexOf(key);
            if (value.includes(key))
                return (
                    value
                        .split("")
                        .slice(0, ind)
                        .join("") +
                    '<span class="key-word">' +
                    key +
                    "</span>" +
                    value
                        .split("")
                        .slice(ind + key.length)
                        .join("")
                );
            return `<span>${value}</span`;
        },
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'titleName'
            },
            show_checkbox: false,
            title: '',//查询
            serachValueDeal: null,
            openkeys: []
        };
    },
    created() {
        this.getData()
    },
    watch: {
        isCheckedList(val) {
            let ids = this.isCheckedList.map(ele => (ele.id || ele.userId))
            if (ids.length > 0) {
                ids.map(ele => (ele + ""))
                let temp = ids.filter(ele => {
                    return !!ele
                })
                console.log(temp)
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(temp);
                })
            } else {
                if (this.multiple) {
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys([]);
                    })
                }
            }
        }
    },
    methods: {
        async getData(deep) {
            let Api = this.deepPerson || deep ? AddressApi.deptWithUserTree : AddressApi.addressTree
            let res = await Api()
            if (res.data.code === 0 || res.data.code === 200) {

                let arr = [res.data.data]
                console.log(arr)
                // 防御性：后端可能返回 children 或 userList 为 null
                ;(arr[0].children || []).map(ele => {
                    if (ele.titleName === '管理层') {
                        console.log(ele)
                        ele.userList = (ele.userList || []).filter(self => {
                            return self.account !== 'luyong'
                        })
                    }
                })
                this.data = arr
                // console.log('22222222222')
                // this.data  = this.data.map(ele=>{
                //     console.log(ele)
                // })
                this.getChildrenName(this.data)
            }
            let ids = this.isCheckedList.map(ele => (ele.id || ele.userId))
            if (ids.length > 0) {
                ids.map(ele => (ele + ""))
                let temp = ids.filter(ele => {
                    return !!ele
                })
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(temp);
                })

            }
        },
        getChildrenName(data) {
            // 防御性：递归遍历时父/子节点都可能是 null
            ;(data || []).map(ele => {
                if (ele.userList) {
                    ele.children = ele.userList
                }
                if (ele.children) {
                    this.getChildrenName(ele.children)
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.titleName.indexOf(value) !== -1;
        },
        getlists() {
            let value = this.title || this.serachValue

            this.$refs.tree.filter(value);
        },
        handleNodeClick(data) {
            this.getDepartPerson(data.id, data)
        },
        handleCheckChange(data, checked) {
            let checkdata = this.$refs.tree.getCheckedNodes()
            let arr = checkdata.filter(ele => {
                return !ele.children || ele.children.length === 0
            })
            if (!this.multiple) {
                this.$emit('getPerson', arr[0])
            } else {
                // console.log(arr)
                // console.log('arr')
                this.$emit('getPerson', arr)
            }

        },
        getDepartPerson(id, data) {
            if (this.deepPerson) {
                //树结构在没有子集的情况下进行选中
                if (!data.children) {
                    this.$emit('getPerson', data)
                    this.doBurialPoint(data)
                }
            } else {
                this.$emit('getList', id)
            }
        },
        async doBurialPoint(data) {
            let obj = {
                contactedUserId: data.id,
                userId: this.userInfo.user_id
            }
            let res = await AddressApi.recentlyContactedAdd(obj)
        },
    }
}
</script>

<style scoped lang="scss">
.key-word {
    background-color: yellow;
}

.tree {
    font-size: 12px;
}

.text {
    width: 80px;
}
</style>