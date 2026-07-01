<!--
 * 下拉树形选择
-->
<template>
    <el-select class="contentSelect" :disabled="disabled" ref="treeSelect"  :value="value" v-model="valueName"
        :multiple="multiple" :clearable="clearable" @clear="clearHandle" @change="changeValue" @remove-tag="removeTag">
        <el-input class="ml20" style="width: 90%;" placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-option :value="valueName" class="options">
            <el-tree id="tree-option" :default-expand-all="false" :filter-node-method="filterNode" :show-checkbox="multiple"
                ref="tree" :accordion="accordion" :data="options" @check-change="getCheckedNodes" :props="props"
                @node-click.self="handleNodeClick">
                <span slot-scope="{ data }">
                    {{ data[props.label] }}
                    <!-- <i :class="[data.color != null ? 'ification_col' : '']"
                        :style="{ 'background-color': data.color }"></i>&nbsp;&nbsp; -->
                </span>
            </el-tree>
        </el-option>
    </el-select>
</template>
<script>
export default {
    name: "el-tree-select",
    props: {
        // 配置项
        props: {
            type: Object,
            default: () => {
                return {
                    label: "title",
                    value: "id",
                    children: "children",
                }
            }
        },

        disabled: {
            type: Boolean,
            default: false
        },
        // 选项列表数据(树形结构的对象数组)
        options: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 初始值（单选）
        value: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 初始值（多选）
        valueMultiple: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 可清空选项
        clearable: {
            type: Boolean,
            default: true
        },
        // 自动收起
        accordion: {
            type: Boolean,
            default: false
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: false
        },
        
    },
    data() {
        return {
            filterText: null,
            valueIds: [],
            resultValue: [], // 传给父组件的数组对象值
            valueName: this.multiple ? [] : '', // 输入框显示值
        }
    },
    watch: {
        value() {
            this.resultValue = this.multiple ? this.valueMultiple : this.value;   // 初始值
            this.initHandle()
        },
        options(){
       
        },
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.resultValue = this.multiple ? this.valueMultiple : this.value;   // 初始值
        this.initHandle();

    },
    methods: {

        // 初始化显示
        initHandle() {
            if (this.resultValue) {
                if (this.multiple) {
                    // 多选 
                    this.resultValue.forEach(item => this.valueName.push(item.name));
                } else {
                    // 单选
                    this.valueName = this.resultValue.name;
                }
            }
            this.initScroll()
        },
        // 初始化滚动条
        initScroll() {
            this.$nextTick(() => {
                let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
                let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
                scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
                scrollBar.forEach(ele => ele.style.width = 0)
            })
        },
        filterNode(value, data, node) {
            if (!value) return true;
            if (data[this.props.label]) {
                return this.chooseNode(value, data, node);
            }
        },
        // 过滤父节点 / 子节点 (如果输入的参数是父节点且能匹配，则返回该节点以及其下的所有子节点；如果参数是子节点，则返回该节点的父节点。name是中文字符，enName是英文字符.
        chooseNode(value, data, node) {
            if (data[this.props.label].indexOf(value) !== -1) {
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
                if (parentData.data[this.props.label].indexOf(value) !== -1) {
                    return true
                }
                // 否则的话再往上一层做匹配
                parentData = parentData.parent
                index++
            }
            // 没匹配到返回false
            return false
        },
        getCheckedNodes(node, key) {
            console.log(node)
            console.log(key)
            console.log(this.$refs.tree.getCheckedNodes())
            let arr = this.$refs.tree.getCheckedNodes()
            let value = arr.filter(ele => !ele.childList)
            console.log(value)
            this.valueName = value.map(ele => ele[this.props.label])
            this.valueIds = value.map(ele => ele[this.props.value])
            console.log(this.valueIds)
            this.$emit('getValue', value);
        },
        doClean() {
            this.valueName = []
        },
        // 切换选项
        handleNodeClick(node) {
            console.log(node)
            // 设置点击叶子节点后被选中 可以更改为点击父节点也生效
            if (node[this.props.children] == null || node[this.props.children] == undefined) {
                if (this.multiple) {
                    // 多选（判重后添加）
                    // let num = 0;
                    // this.valueName.forEach(item => {
                    //     item == node[this.props.label] ? num++ : num;
                    // })
                    // if (num == 0) {
                    //     this.valueName.push(node[this.props.label]); // 输入框显示值
                    //     this.resultValue.push(node);
                    // }
                    // console.log( this.valueName)
                    // console.log(this.resultValue)
                    // this.$emit('getValue', this.resultValue);
                } else {
                    // 单选
                    this.$refs.treeSelect.blur();
                    this.valueName = node[this.props.label];
                    this.resultValue = node;
                }

                this.$emit('getValue', this.resultValue);
            }
        },
        // 从输入框中直接删除某个值时
        changeValue(val, index) {
            console.log(index)
            console.log(val)
            if (this.multiple) {
                // 多选（同时删掉传给父组件中多余的值，再传给父组件）
                this.resultValue.map((item, index) => {
                    let i = val.indexOf(item.name)
                    if (i == -1) {
                        this.resultValue.splice(index, 1)
                    }
                })
                console.log(this.resultValue)
                this.$emit('getValue', this.resultValue);
            } else {
                // 单选
                this.$emit('getValue', val);
            }
        },
        removeTag(a, v) {
            // console.log(a)
            // console.log(v)
        },
        // 清除选中
        clearHandle() {
            this.valueName = this.multiple ? [] : ''
            this.resultValue = []
            this.clearSelected()
            this.$emit('getValue', this.resultValue)
        },
        // 清空选中样式
        clearSelected() {
            let allNode = document.querySelectorAll('#tree-option .el-tree-node')
            allNode.forEach((element) => element.classList.remove('is-current'))
        }
    }
}
</script>
<style scoped lang="scss">
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 300px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
}

.el-select-dropdown__item.selected {
    font-weight: normal;
}

ul li::v-deep .el-tree .el-tree-node__content {
    height: auto;
    padding: 0 20px;
}

.el-tree-node__label {
    font-weight: normal;
}

.contentSelect {
    ::v-deep ep.el-tag .el-icon-close {
        display: none;
    }
    ::v-deep ep.el-tag__close.el-icon-close::before{
        display: none;
    }
}


.el-tree::v-deep .is-current .el-tree-node__label {
    color: #409EFF;
    font-weight: 700;
}

.el-tree::v-deep .is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
}

.el-popper {
    z-index: 9999;
}

.ification_col {
    width: 20px;
    height: 10px;
    display: inline-block;
}
</style>
