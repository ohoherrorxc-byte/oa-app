<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="办公地点" name="office">
                <el-button icon="el-icon-plus" class="mb10" type="primary" @click="addRowOffice">新增</el-button>
                <el-table :data="officeList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="city" label="名称" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.city"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="地址" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.address"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button @click="handleDeleteOffice(scope.row, scope.$index)" type="text"
                                icon="el-icon-delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-center">
                    <el-button class="mt20 px20" type="primary" @click="remarkOffice">确 定</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="学历" name="educational">
                <el-button class="mb10" icon="el-icon-plus" type="primary" @click="addRowEducational">新增</el-button>
                <el-table :data="educationalList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="education" label="名称" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.education"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button @click="handleDeleteEducation(scope.row, scope.$index)" type="text"
                                icon="el-icon-delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-center">
                    <el-button class="mt20 px20" @click="remarkEducational" type="primary">确 定</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="职称" name="professional">
                <el-button class="mb10" icon="el-icon-plus" type="primary" @click="addRowProfessional">新增</el-button>
                <el-table :data="professionalList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="title" label="名称" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.title"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button @click="handleDeleteProfessional(scope.row, scope.$index)" type="text"
                                icon="el-icon-delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-center">
                    <el-button class="mt20 px20" type="primary" @click="remarkProfessional">确 定</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="领域" name="domain">
                <el-button class="mb10" icon="el-icon-plus" type="primary" @click="addRowDomain">新增</el-button>
                <el-table :data="domainList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="field" label="名称" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.field"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button @click="handleDeleteDomain(scope.row, scope.$index)" type="text"
                                icon="el-icon-delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-center">
                    <el-button class="mt20 px20" type="primary" @click="remarkDomain">确 定</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import OtherApi from '@/api/organizationalStructure/other'
export default {
    data() {
        return {
            activeName: "office",
            officeList: [{}],
            educationalList: [{}],
            professionalList: [{}],
            domainList: [{}],
        }
    },
    created() {
        this.getOfficeList()
    },
    methods: {
        handleClick() {
            let obj = {
                'office': this.getOfficeList,
                'educational': this.getEducationalList,
                'professional': this.getProfessionalList,
                'domain': this.getDomainList
            }
            let fn = obj[this.activeName]
            fn()
        },
        async getOfficeList() {
            let res = await OtherApi.addressList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.officeList = res.data.data
            }

        },
        async getEducationalList() {
            let res = await OtherApi.educationList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.educationalList = res.data.data
            }
        },
        async getProfessionalList() {
            let res = await OtherApi.titleList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.professionalList = res.data.data
            }

        },
        async getDomainList() {
            let res = await OtherApi.fieldList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.domainList = res.data.data
            }
        },
        addRowOffice() {
            this.officeList.push({})
        },
        handleDeleteOffice(row, index) {
            this.officeList.splice(index, 1)
        },
        async remarkOffice() {
            let res = await OtherApi.addressAdd(this.officeList)
            if(res.data.code===0){
                this.$message.success('操作成功')
            }else{}

        },
        addRowEducational() {
            this.educationalList.push({})
        },
        handleDeleteEducation(row, index) {
            this.educationalList.splice(index, 1)
        },
        async remarkEducational() {
            let res = await OtherApi.educationAdd(this.educationalList)
            if(res.data.code===0){
                this.$message.success('操作成功')
            }else{}
        },
        addRowProfessional() {
            this.professionalList.push({})
        },
        handleDeleteProfessional(row, index) {
            this.professionalList.splice(index, 1)
        },
        async remarkProfessional() {
            let res = await OtherApi.titleAdd(this.professionalList)
            if(res.data.code===0){
                this.$message.success('操作成功')
            }else{}
        },
        addRowDomain() {
            this.domainList.push({})
        },
        handleDeleteDomain(row, index) {
            this.domainList.splice(index, 1)
        },
        async remarkDomain() {
            // console.log(this.domainList)
            let arr = []
            this.domainList.map(ele => {
                arr.push({ field: ele.field })
            })
            let res = await OtherApi.fieldAdd(arr)
            if (res.data.code === 0) {
                this.$message.success('操作成功')
            }else{
                this.$message.error(res.data.message)
            }
            this.getDomainList()
        }
    }
}
</script>

<style scoped lang="scss">
.text-center {
    text-align: center;
}
</style>