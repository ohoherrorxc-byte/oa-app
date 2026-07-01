<template>
    <basic-container>
        <avue-form v-model="form" :option="option" @submit="handleSubmit" ref="form">
            <template slot-scope="{ size }" slot="menuForm">
                <el-button type="primary" :size="size" icon="el-icon-refresh" @click="refresh">刷新</el-button>
                <el-button type="primary" :size="size" icon="el-icon-plus" @click="refresh">新建</el-button>
                <el-button type="primary" :size="size" icon="el-icon-download" @click="refresh">下载模板</el-button>
                <el-button type="primary" :size="size" icon="el-icon-download" @click="refresh">导入</el-button>
                <el-button type="primary" :size="size" icon="el-icon-upload2" @click="refresh">导出</el-button>              
            </template>
        </avue-form>
        <el-table  :data="tableData" ref="multipleTable" v-if="!isSwiper" row-key="id"
            style="width: 100%; margin-top: 20px" stripe align="center" border>
            <el-table-column  prop="assetName" label="资产名称" align="center" >
            </el-table-column>
            <el-table-column prop="assetNumber" label="资产编号" align="center" />
            <el-table-column prop="assetCategories" label="资产大类" align="center" />
            <el-table-column prop="brand" label="品牌" align="center" />
            <el-table-column prop="supplierName" label="供应商名称" align="center" />
            <el-table-column prop="specificationAndModel" label="规格型号" align="center" />
            <el-table-column prop="recipient"  label="领用人" align="center" />
            <el-table-column prop="receivingDepartment" label="领用部门" align="center" />
            <el-table-column prop="endTime" label="在库状态" align="center" />
            <el-table-column prop="storageLocation" label="存放地点" align="center" />
            <el-table-column prop="startTime" label="备注" align="center" />
            <el-table-column prop="endTime" label="领用备注" align="center" />
        </el-table>
        <!--分页-->
        <el-pagination v-if="!isSwiper" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"></el-pagination>
    </basic-container>
</template>
  
<script>
export default {
    components: {

    },
    data() {
        return {
            intervalId: null,
            isSwiper: false,
            curRow:null,
            option: {
                size: "mini",
                span: 6,
                menuPosition: "left",
                submitText: "搜索",
                submitIcon: "el-icon-search",
                emptyBtn: false,
                column: [
                    {
                        type: "input",
                        label: "资产名称",
                        allowCreate: true,
                        filterable: true,
                        prop: "conferenceConvener",
                    },
                    {
                        type: "input",
                        label: "资产编号",
                        allowCreate: true,
                        filterable: true,
                        prop: "conferenceName",
                    },
                    {
                        type: "input",
                        label: "资产大类",
                        allowCreate: true,
                        filterable: true,
                        prop: "room",
                    },
                    {
                        type: "input",
                        label: "领用人",               
                        allowCreate: true,
                        filterable: true,
                        prop: "meetingTimer",                     
                    },
                    {
                        type: "input",
                        label: "在库状态",
                        allowCreate: true,
                        filterable: true,
                        prop: "conferenceConvener",
                    },
                    {
                        type: "input",
                        label: "存放地点",
                        allowCreate: true,
                        filterable: true,
                        prop: "conferenceName",
                    },
                    {
                        type: "input",
                        label: "领用部门",
                        allowCreate: true,
                        filterable: true,
                        prop: "room",
                    },
                    {
                        type: "input",
                        label: "领用备注",           
                        allowCreate: true,
                        filterable: true,
                        prop: "meetingTimer",                    
                    },
                ],
            },
            tableData: [],
            queryInfo: {
                query: "",
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            form: {
                conferenceConvener:'',
                conferenceName:"",
                room:"",
                meetingTimer:[],
                endTime:"",
                startTime:""
                
            }
        };
    },
    created() {
        this.getList({});
    },
    mounted() {

    },
    activated() {
        if (this.$route.query.reflesh) {
            this.getList()
        }
    },
    methods: {
        getList() {
            this.form.current = this.queryInfo.pageNum
            this.form.size = this.queryInfo.pageSize
            let obj = {}
            for(let key in this.form){
                if(this.form[key]){
                    obj[key] = this.form[key]
                }
            }
            meetingApi.getList(obj).then(
                (res) => {
                    this.tableData = res.data.data.records;
                    this.queryInfo.total = res.data.data.total;
                }
            );
        },
        getTimer(e){
            // console.log(e)
            // console.log(this.form.meetingTimer)
            if(e.value){
                this.form.startTime = e.value[0]
                this.form.endTime =  e.value[1]
            }else{
                this.form.startTime = ''
                this.form.endTime = ''
            }
            // console.log(this.form)
        },     
        handleCurrentChange(currentPage) {
            this.queryInfo.pageNum = currentPage;
            this.getList({});
        },
        handleSizeChange(pageSize) {
            this.queryInfo.pageSize = pageSize;
            this.getList({});
        },
    
    }
};
</script>
  
<style></style>
  