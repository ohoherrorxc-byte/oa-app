<template>
    <div>
        <div class="top-button">
            <el-button type="success" icon="el-icon-plus" @click="addPerson" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteBranch"></el-button>
        </div>
        <el-table ref="multipleTable" @selection-change="handleSelectionChange" height="500" :data="personTableList"
            style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="deptName" label="对象类型">
            </el-table-column>
            <el-table-column prop="userName" label="对象">
            </el-table-column>
            <el-table-column prop="address" label="安全级别">
            </el-table-column>
        </el-table>
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination> -->
        <el-dialog title="添加成员" :append-to-body="true" :visible.sync="dialogVisiblePerson" width="60%"
            :before-close="handleClose">
            <avue-tree ref="tree" :show-checkbox="true" :option="option" :multiple="true" :data="personData" v-model="form"
                @getCheckedNodes="getCheckedNodes" @getCheckedKeys="getCheckedKeys" node-key="id"
                @check-change="checkChange">
            </avue-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisiblePerson = false">取 消</el-button>
                <el-button type="primary" @click="remarkPerson">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AddressApi from '@/api/organizationalStructure/address'
// import { mapGetters } from 'vuex'
export default {
    props:{
        detailData:{
            type:Object
        }
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 100,
            dialogVisiblePerson: false,
            personData: [],
            form: {},
            option: {
                defaultExpandAll: false,
                multiple: true,
                props: {
                    label: "titleName",
                    value: "id",
                    children: "children",
                },
                addBtn: false
            },
            personCheckList: [],
            personTableList: [],
            multipleSelection: []
        }
    },
    mounted() {
        this.getPerson()
    },
    watch: {
        detailData() {
            console.log(this.detailData);
            console.log("----detailData----");
            if(this.detailData){
                this.personTableList = this.detailData.groupWithUserList
            }
        },
    },
    methods: {
        handleSizeChange() { },
        handleCurrentChange() { },
        handleClose() {
            this.dialogVisiblePerson = false
        },
        async getPerson() {
            let res = await AddressApi.deptWithUserTree()
            if (res.data.code === 0 || res.data.code === 200) {       
                let arr = [res.data.data]
                // console.log(arr)
                arr[0].children.map(ele=>{
                    if(ele.titleName==='管理层'){
                        // console.log(ele)
                        ele.userList = ele.userList.filter(self=>{
                            return self.account!=='luyong'
                        })
                    }
                }) 
                this.personData = arr
                this.getChildrenName(this.personData)
            }
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
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
        addPerson() {
            this.dialogVisiblePerson = true
            let ids = this.personTableList.map(ele=>ele.userId)
            console.log(ids)
            //树形结构复选框回显
            this.$nextTick(()=>{
                this.$refs.tree.setCheckedKeys(ids,true)
            })
            
        },
        deleteBranch() {
            let ids = this.multipleSelection.map(ele => ele.id)
            this.personTableList = this.personTableList.filter(ele => {
                return !ids.includes(ele.id)
            })
        },
        checkChange(data, checked, indeterminate) {
            let checkData = this.$refs.tree.getCheckedNodes()
            let childrenList = checkData.filter(ele => {
                return !ele.children
            })
            this.personCheckList = childrenList
            // console.log(childrenList)
            // console.log(data)
            // console.log(checked)
            // console.log(indeterminate)
            // console.log(this.personData)
        },
        remarkPerson() {
            console.log(this.personCheckList)
            this.personTableList = this.personCheckList
            this.personTableList.map(ele=>{
               ele.userId = ele.id
               ele.userName = ele.realName
            })
            this.dialogVisiblePerson = false
        },
        getCheckedNodes(a, b) {
            console.log('djdjjdjdjddj')
            console.log(a)
            console.log(b)
        },
        getCheckedKeys(keys) {
            console.log(keys)
        }
    }
}
</script>

<style lang="scss" scoped>
.top-button {
    margin-bottom: 10px;
    float: right;
}
</style>