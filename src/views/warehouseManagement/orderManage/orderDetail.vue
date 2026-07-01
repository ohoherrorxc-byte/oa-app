<template>
    <div>
        <div class="fr" v-if="!disabled">
            <span class="add-icon" @click="addRow">+</span>
            <!-- <span class="dec-icon" @click="deleteChooseRow">―</span> -->
            <!-- <img @click="copyChoose" class="mt3" src="@/assets/svg/copy.svg" width="24" alt=""> -->
        </div>
        <table style="width:100%" border>
            <thead>
                <tr>

                    <th rowspan="4">零件名称</th>
                    <th rowspan="4">零件号</th>
                    <th rowspan="4">要求到货日期</th>
                    <th rowspan="4">需求数量</th>
                    <th rowspan="4">项目名称</th>
                    <th rowspan="4">阶段</th>
                    <th rowspan="2">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableData">
                    <td>
                        <el-select @change="changePart(item)" v-model="item.partsNumber" filterable clearable>
                            <el-option v-for="part in partList" :key="part.id" :label="part.partsName"
                                :value="part.partsNo"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.partsNumber"></el-input>
                    </td>

                    <td>
                        <el-date-picker style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" clearable
                            v-model="item.needDate" type="date"></el-date-picker>
                    </td>
                    <td> <el-input v-model="item.needNumber"></el-input>
                    </td>
                    <td> <el-select v-model="item.projectNo" clearable filterable @change="projectRow(item)">
                            <el-option v-for="project in projectList" :key="project.id" :label="project.projectName"
                                :value="project.projectNo"></el-option>
                        </el-select>
                    </td>
                    <td> <el-input v-model="item.stage"></el-input>
                    </td>
                    <td @click="delRow(index)">
                        <i class="el-icon-remove-outline"></i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
   
<script>
import { getProjectList } from "@/api/contract/contractProject";
import substituteOrderManageApi from "../../../api/substitute/orderManage";
export default {
    data() {
        return {
            projectList: [],
            tableData: [
                {
                    partsNumber: '',
                    partsName: '',
                    needDate: null,
                    needNumber: null,
                },
            ],
            partList: []
        };
    },
    props: {
        formData: {
            type: Object,
            default: {}
        }
    },
    watch: {
        'formData.deliverDtos'() {
            console.log(this.formData)
            this.tableData = this.formData.deliverDtos

        }
    },
    mounted() {
        this.getContractProjectList()
        this.getPartList()
    },
    methods: {
        async getPartList() {
            let res = await substituteOrderManageApi.partsMaintList()
            console.log(res)
            this.partList = res.data.data
        },
        changePart(item){
            let row = this.partList.find(ele=>{
                return ele.partsNo ===item.partsNumber

            })
            item.partsName = row.partsName
        },
        addRow() {
            this.tableData.push({})
        },
        delRow(index) {
            this.tableData.splice(index, 1)
        },
        getContractProjectList() {
            getProjectList().then((res) => {
                this.projectList = res.data.data;
            });
        },
        projectRow(item) {
            let row = this.projectList.find(ele => {
                return ele.projectNo === item.projectNo
            })
            if (row) {
                item.projectName = row.projectName
            }
        }
    }
};
</script>

<style scoped lang="scss">
tr {
    text-align: center;
}

table {
    border: 1px solid #DCDFE6;
    color: #606266;
}
</style>