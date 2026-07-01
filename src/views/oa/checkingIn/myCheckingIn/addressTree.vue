<template>
    <div class="tree">
        <div class="flex-center mb10">
            <span class="text">{{ inputTitle }}</span>
            <el-input v-if="showInput" v-model.lazy="title" placeholder="请输入" 
                @input="getlists" />
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="gaoliang" ref="tree2"
            :filter-node-method="filterNode">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <!-- {{ node.data.realName }} -->
                <span v-if="deepPerson">{{ node.data.userName || node.data.realName }}</span>
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
        deepPerson: {
            type: Boolean,
            default: true
        },
        inputTitle:{
            type:String,
            default:"组织结构"
        }
    },
    filters: {
        filterReal(data, title) {
            console.log(title)
            let key = title || this.serachValue || this.serachValueDeal
            let value = data.userName || data.realName
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
                children: 'userInfoDtos',
                label: 'userName'
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
            let res = await AddressApi.getSubordinateInfo(this.userInfo.user_id)
            if (res.data.code === 0 || res.data.code === 200) {
                this.data = [res.data.data]
                this.getChildrenName(this.data)
            }
        },
        getChildrenName(data) {
            // data.map(ele => {
            //     if (ele.userList) {
            //         ele.children = ele.userList
            //     }
            //     if (ele.children) {
            //         this.getChildrenName(ele.children)
            //     }
            // })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.userName.indexOf(value) !== -1;
        },
        getlists() {
            let value = this.title || this.serachValue
            this.$refs.tree2.filter(value);
        },
        handleNodeClick(data) {
            console.log(data)
            this.getDepartPerson(data.userId, data)
        },
        getDepartPerson(id, data) {
            this.$emit('getList', id)
            // if (this.deepPerson) {
            //     //树结构在没有子集的情况下进行选中
            //     if (!data.children) {
            //         this.$emit('getPerson', data)
            //         this.doBurialPoint(data)
            //     }
            // } else {
                
            // }
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