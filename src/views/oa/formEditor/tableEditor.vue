<template>
    <div>
        <el-button class="mb10" type="primary" @click="addRow">添加</el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label=" 字段名">
            </el-table-column>
            <el-table-column prop="nameKey" label="字段名key">
            </el-table-column>
            <el-table-column prop="type" label="字段类型">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editRow(scope.row)"> 编辑</el-button>
                    <el-button type="text" @click="deleteRow(scope.row)"> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加" :visible.sync="dialogFormVisible" :append-to-body="true">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="字段名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="字段Key" :label-width="formLabelWidth" prop="nameKey">
                    <el-input v-model="form.nameKey" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="字段类型" :label-width="formLabelWidth" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" @change="typeChange">
                        <el-option v-for="item in typeList" :key="item.value" :value="item.value"
                            :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否必填" :label-width="formLabelWidth" prop="type">
                    <el-radio  v-model="form.required" :label="true">是</el-radio>
                    <el-radio  v-model="form.required" :label="false">否</el-radio>
                </el-form-item>
                <el-form-item v-if="form.type === 'select'" label="选项数据" :label-width="formLabelWidth">
                    <el-select @change="changeChooseData" v-model="form.chooseData" placeholder="请选择">
                        <el-option v-for="item in typeData" :key="item.value" :value="item.value"
                            :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.type === 'date'" label="显示类型" :label-width="formLabelWidth">
                    <el-select v-model="form.dateType" placeholder="请选择">
                        <el-option v-for="item in dateList" :key="item.value" :value="item.value"
                            :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.chooseData === '1'">
                    <el-table :data="form.optionList" style="width: 100%">
                        <el-table-column prop="label" label="label">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.label" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="value">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="addOption" v-if="scope.$index === 0" type="text"
                                    icon="el-icon-plus">添加</el-button>
                                <el-button v-else type="text" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item v-if="form.chooseData === '2'" label="接口URL" :label-width="formLabelWidth">
                    <el-input v-model="form.apiUrl"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="remark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            formLabelWidth: '120px',
            dialogFormVisible: false,
            typeList: [
                { label: '输入框', value: 'input' },
                { label: '下拉框', value: 'select' },
                { label: '时间选择器', value: 'date' }
            ],
            typeData: [
                { label: '静态数据', value: '1' },
                { label: '接口', value: '2' }
            ],
            dateList: [
                { label: 'year', value: 'year' },
                { label: 'month', value: 'month' },
                { label: 'date', value: 'date' },
                { label: 'week', value: 'week' },
                { label: 'datetimerange', value: 'datetimerange' },
                { label: 'daterange', value: 'daterange' },
                { label: 'monthrange', value: 'monthrange' },
            ],
            form: {
                name: '',
                nameKey: '',
                type: '',
                chooseData: "",
                optionList: [],
                apiUrl: '',
                key: null,
                dateType: null,
                required:null
            },
            rules: {
                name: [
                    { required: true, message: '请输入字段名', trigger: 'blur' },
                ],
                nameKey: [
                    { required: true, message: '请输入字段Key', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'change' },
                ]
            }
        }
    },
    props: {
        initData: {
            type: Array,
            default: []
        }
    },
    watch: {
        initData(newValue, oldValue) {
            this.tableData = this.initData
        },
    },
    methods: {
        addRow() {
            this.dialogFormVisible = true
            this.$refs.form.resetFields()
            this.form.key = null
            this.form.optionList = [{}]
        },
        typeChange() {
            if (this.form.type === 'input') {
                this.form.chooseData = null
            }
        },
        addOption() {
            this.form.optionList.push({})
        },
        changeChooseData() {
            if (this.form.chooseData === '1') {
                this.form.apiUrl = ''
                this.form.optionList = [{}]
            } else {
                this.form.optionList = []
            }
        },
        editRow(row) {
            this.dialogFormVisible = true
            this.form = row
        },
        deleteRow(row) {
            this.tableData = this.tableData.filter(ele => {
                return ele !== row
            })
        },
        remark() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (!this.form.key) {
                        this.form.key = new Date().getTime()
                        let obj = JSON.parse(JSON.stringify(this.form))
                        this.tableData.push(obj)
                    } else {
                        for (let i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].key === this.form.key) {
                                let obj = JSON.parse(JSON.stringify(this.form))
                                // this.tableData[i] = obj
                                this.$set(this.tableData, i, obj)
                            }
                        }
                    }
                    this.dialogFormVisible = false
                }
            })
        }
    }
}
</script>