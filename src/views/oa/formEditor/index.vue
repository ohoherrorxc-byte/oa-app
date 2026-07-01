<template>
    <basic-container>
        <el-form label-width="80px">
            <el-form-item label="流程名称">
                <el-select v-model="flowId" @change="getFlowInfo" filterable >
                    <el-option v-for="item in flowList" :label="item.name" :key="item.id" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="表单设计器" name="form">
                <fc-designer ref="designer" />
            </el-collapse-item>
            <el-collapse-item title="表格设计器" name="table">
                <tableEditor ref="tableEditor" :initData="tableList" />
            </el-collapse-item>
        </el-collapse>
        <div class="btn">
            <el-button @click="handleClick" type="primary">提 交</el-button>
        </div>
    </basic-container>
</template>

<script>
import tableEditor from './tableEditor'
import FormEditorApi from '@/api/formEditor/index'
export default {
    data() {
        return {
            tableList: [],
            flowList: [],
            flowId: '',
            flowName: '',
            formInit: {
                form: {
                    hideRequiredAsterisk: false,
                    inlineMessage: false,
                    labelPosition: "right",
                    labelWidth: "125px",
                    showMessage: true,
                    size: "mini",
                },
                resetBtn: false,
                submitBtn: false
            }
        }
    },
    async mounted() {
        // 小屏直接拦截,form-create designer 1.46MB 不下到手机
        if (window.$isMobile) {
            this.$message.warning('表单设计器请使用电脑端访问')
            this.$router.back()
            return
        }
        // 按需加载 designer,正常打包下它会进独立 chunk,只有真正进入这个页面才下载
        const { default: FcDesigner } = await import('@form-create/designer')
        Vue.use(FcDesigner)
        this.getFlow()
        this.$refs.designer.setOption(this.formInit)
    },
    components: { tableEditor },
    methods: {
        getFlowInfo() {
            let o = this.flowList.find(ele => {
                return ele.id === this.flowId
            })
            if (o) {
                this.flowName = o.name
            }
            this.getDetail()
        },
        async getFlow() {
            let res = await FormEditorApi.getFlowList()
            console.log(res)
            if (res.data.code === 0) {
                this.flowList = res.data.data
            }
        },
        async getDetail() {
            let res = await FormEditorApi.detail(this.flowId)
            if (res.data.code === 0) {
                let data = res.data.data
                this.$refs.designer.setRule(formCreate.parseJson(data.formConfigList) || [])
                this.$refs.designer.setOption(data.formConfig || {})
                this.tableList = data.tableConfigList || []
            }
        },
        async handleClick() {
            let value = this.$refs.designer.getRule();
            let option = this.$refs.designer.getOption()
            // console.log(encodeURIComponent(value)​)
            // console.log(`${formCreate.toJson(value).replaceAll('\\','\\\\')}`)
            let ruleA = formCreate.toJson(value)
            console.log(formCreate.parseJson(ruleA))
            console.log(option)
            // console.log(this.$refs.tableEditor.tableData)
            let data = this.$refs.tableEditor.tableData
            let obj = {
                formConfigList: `${formCreate.toJson(value)}`,
                formConfig: option,
                tableConfigList: data,
                flowId: this.flowId,
                flowName: this.flowName
            }
            let res = await FormEditorApi.formSave(obj)
            console.log(res)
            if (res.data.code === 0) {
                this.$message.success('提交成功，请勿重复提交')
            }
        }
    }
}
</script>

<style lang="scss">
.btn {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}
</style>