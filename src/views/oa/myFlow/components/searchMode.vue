<template>
    <basic-container class="tree">
        <div class="flex-center mb10">
            <p class="text">{{ inputTitle }}</p>
            <el-input v-if="showInput" v-model.lazy="title" placeholder="请输入" clearable @input="getlists" />
            <!-- <p  class="text" @click="clear">全部</p> -->
        </div>
        <!-- :filter-node-method="filterNode" -->
        <el-tree node-key="id" ref="tree" default-expand-all :show-checkbox="multiple" :data="data" :props="defaultProps"
            @node-click="handleNodeClick" :highlight-current="gaoliang" 
            @check-change="handleCheckChange">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <!-- {{ node.data }} -->
                <span >{{ node.data.categoryName }}</span>
                <!-- <span v-else v-html="$options.filters.filterReal(node.data, title)"></span> -->
            </span>
        </el-tree>
    </basic-container>
</template>

<script>
import AddressApi from '@/api/organizationalStructure/address'
import MyFlowApi from '@/api/myFlow/index'

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
            default: "类型"
        }
    },
    watch: {
        title(val) {
            // this.$refs.tree.filter(val);
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'flowTreeDtoList',
                label: 'categoryName'
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
    methods: {
        async getData(deep) {
            let res = await  MyFlowApi.getFlowTree(this.title)
            if (res.data.code === 0 || res.data.code === 200) {
                this.data = res.data.data
            }
            // let ids = this.isCheckedList.map(ele => (ele.id || ele.userId))
            // ids.map(ele => (ele).toString())
            // this.$refs.tree.setCheckedKeys(ids);
        },
        getChildrenName(data) {
            data.map(ele => {
                if (ele.userList) {
                    ele.children = ele.userList
                }
                if (ele.children) {
                    this.getChildrenName(ele.children)
                }
            })
        },
        // filterNode(value, data, node) {
        //     if (!value) return true;
        //     if (data['titleName']) {
        //         return this.chooseNode(value, data, node);
        //     }
        // },
        clear(){
            this.$emit('getFlow', {categoryName:null})
        },
        // 过滤父节点 / 子节点 (如果输入的参数是父节点且能匹配，则返回该节点以及其下的所有子节点；如果参数是子节点，则返回该节点的父节点。name是中文字符，enName是英文字符.
        chooseNode(value, data, node) {
            if (data['titleName'].indexOf(value) !== -1) {
                return true
            }
            const level = node.level
            // 如果传入的节点本身就是一级节点就不用校验了
            if (level === 1) {
                return false
            }
            // 先取当前节点的父节点
            let parentData = node.parent
            // 遍历当前节点的父节点
            let index = 0
            while (index < level - 1) {
                // 如果匹配到直接返回，此处name值是中文字符，enName是英文字符。判断匹配中英文过滤
                if (parentData.data['titleName'].indexOf(value) !== -1) {
                    return true
                }
                // 否则的话再往上一层做匹配
                parentData = parentData.parent
                index++
            }
            // 没匹配到返回false
            return false
        },
        getlists() {
            if(!this.title){
                this.clear()
            }
           this.getData()
        },
        handleNodeClick(data) {
            this.getDepartPerson(data.id, data)
        },
        handleCheckChange(data, checked) {
            let checkdata = this.$refs.tree.getCheckedNodes()
            this.$emit('getFlow', checkdata)
        },
        getDepartPerson(id, data) {
            if (this.deepPerson) {
                //树结构在没有子集的情况下进行选中
                if (!data.children) {
                    this.$emit('getFlow', data)
                    this.title = data.categoryName
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
    height: 80vh;
    overflow: scroll;
    padding-bottom: 20px;
}

.text {
    width: 60px;
    font-size: 12px;
}
</style>