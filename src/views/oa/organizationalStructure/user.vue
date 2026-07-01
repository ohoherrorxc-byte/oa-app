<template>
    <basic-container>
        <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
            :permission="permissionList" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave"
            :before-open="beforeOpen" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
            @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
            @refresh-change="refreshChange" @on-load="onLoad">
            <template slot="menuLeft">
                <el-button type="primary" icon="el-icon-plus" v-if="permission.user_add" @click="handleAdd">新增
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" v-if="permission.user_delete" @click="handleDelete">删 除
                </el-button>
                <el-button type="info" plain v-if="permission.user_role" icon="el-icon-user" @click="handleGrant">角色配置
                </el-button>
                <el-button type="info" plain v-if="permission.user_reset" icon="el-icon-refresh" @click="handleReset">密码重置
                </el-button>
                <el-button type="success" plain v-if="userInfo.role_name.includes('admin')" icon="el-icon-upload2"
                    @click="handleImport">导入
                </el-button>
                <el-button type="warning" plain v-if="userInfo.role_name.includes('admin')" icon="el-icon-download"
                    @click="handleExport">导出
                </el-button>
            </template>
            <template slot-scope="{ row }" slot="tenantName">
                <el-tag>{{ row.tenantName }}</el-tag>
            </template>
            <template slot-scope="{ row }" slot="roleName">
                <el-tag>{{ row.roleName }}</el-tag>
            </template>
            <template slot-scope="{ row }" slot="deptName">
                <el-tag>{{ row.deptName }}</el-tag>
            </template>
            <template slot-scope="{ row }" slot="postName">
                <el-tag>{{ row.postName }}</el-tag>
            </template>
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-edit" v-if="permission.user_edit" :size="size" :type="type" @click="editRow(row)">编辑</el-button>
                <el-button icon="el-icon-view" v-if="permission.user_view" :size="size" :type="type" @click="editRow(row, 'view')">查看</el-button>
            </template>
             
        </avue-crud>
        <el-dialog title="用户角色配置" append-to-body :visible.sync="roleBox" width="345px">
            <el-tree :data="roleGrantList" show-checkbox check-strictly default-expand-all node-key="id" ref="treeRole"
                :default-checked-keys="roleTreeObj" :props="props">
            </el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="roleBox = false">取 消</el-button>
                <el-button type="primary" @click="submitRole">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="用户数据导入" append-to-body :visible.sync="excelBox" width="555px">
            <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
                <template slot="excelTemplate">
                    <el-button type="primary" @click="handleTemplate">
                        点击下载<i class="el-icon-download el-icon--right"></i>
                    </el-button>
                </template>
            </avue-form>
        </el-dialog>
        <addOrUpdate @getReflesh="refreshChange" ref="addOrUpdate"></addOrUpdate>
    </basic-container>
</template>
  
<script>
import {
    getList,
    getUser,
    remove,
    update,
    add,
    grant,
    resetPassword,
} from "@/api/organizationalStructure/user";
import { getDeptTree, getDeptLazyTree } from "@/api/organizationalStructure/department";
import { getRoleTree } from "@/api/organizationalStructure/role";
import { getPostList } from "@/api/organizationalStructure/post";
import { mapGetters } from "vuex";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import addOrUpdate from "./components/user/addOrUpdate.vue"
export default {
    components: { addOrUpdate },
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        const validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.form.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            form: {},
            search: {},
            platformSearch: {},
            roleBox: false,
            excelBox: false,
            platformBox: false,
            initFlag: true,
            selectionList: [],
            query: {},
            loading: true,
            platformLoading: false,
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            init: {
                roleTree: [],
                deptTree: [],
            },
            props: {
                label: "title",
                value: "key",
            },
            roleGrantList: [],
            roleTreeObj: [],
            treeDeptId: "",
            treeData: [],
            treeOption: {
                nodeKey: "id",
                lazy: true,
                treeLoad: function (node, resolve) {
                    const parentId = node.level === 0 ? 0 : node.data.id;
                    getDeptLazyTree(parentId).then((res) => {
                        resolve(
                            res.data.data.map((item) => {
                                return {
                                    ...item,
                                    leaf: !item.hasChildren,
                                };
                            })
                        );
                    });
                },
                addBtn: false,
                menu: false,
                size: "small",
                props: {
                    labelText: "标题",
                    label: "title",
                    value: "value",
                    children: "children",
                },
            },
            option: {
                height: "auto",
                calcHeight: 80,
                tip: false,
                searchShow: true,
                searchMenuSpan: 100,
                border: true,
                index: true,
                selection: true,
                viewBtn: false,
                addBtn: false,
                editBtn: false,
                //dialogType: 'drawer',
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                    {
                        label: "登录账号",
                        prop: "account",
                        searchLabelWidth: 80,
                        searchSpan: 8,
                        search: true,
                        display: false,
                    },                
                    {
                        label: "用户姓名",
                        prop: "realName",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: true,
                        display: false,
                    },
                    {
                        label: "直接上级",
                        prop: "directSuperior",
                        slot: true,
                        search: false,
                        display: false,
                    },
                    {
                        label: "所属角色",
                        prop: "roleName",
                        slot: true,
                        display: false,
                    },
                    {
                        label: "所属部门",
                        prop: "deptName",
                        slot: true,
                        search: true,
                        display: false,
                    },
                    {
                        label: "所属岗位",
                        prop: "postName",
                        slot: true,
                        display: false,
                    },
                ],
            },
            data: [],
            excelForm: {},
            excelOption: {
                submitBtn: false,
                emptyBtn: false,
                column: [
                    {
                        label: "模板上传",
                        prop: "excelFile",
                        type: "upload",
                        drag: true,
                        loadText: "模板上传中，请稍等",
                        span: 24,
                        propsHttp: {
                            res: "data",
                        },
                        tip: "请上传 .xls,.xlsx 标准格式文件",
                        action: "/api/oa-user/import-user",
                    },
                    {
                        label: "数据覆盖",
                        prop: "isCovered",
                        type: "switch",
                        align: "center",
                        width: 80,
                        dicData: [
                            {
                                label: "否",
                                value: 0,
                            },
                            {
                                label: "是",
                                value: 1,
                            },
                        ],
                        value: 0,
                        slot: true,
                        rules: [
                            {
                                required: true,
                                message: "请选择是否覆盖",
                                trigger: "blur",
                            },
                        ],
                    },
                    {
                        label: "模板下载",
                        prop: "excelTemplate",
                        formslot: true,
                        span: 24,
                    },
                ],
            },
        };
    },
    watch: {
        "form.tenantId"() {
            if (this.form.tenantId !== "" && this.initFlag) {
                this.initData(this.form.tenantId);
            }
        },
        "excelForm.isCovered"() {
            if (this.excelForm.isCovered !== "") {
                const column = this.findObject(this.excelOption.column, "excelFile");
                column.action = `/api/oa-user/import-user?isCovered=${this.excelForm.isCovered}`;
            }
        },
    },
    computed: {
        ...mapGetters(["userInfo", "permission"]),
        permissionList() {
            return {
                addBtn: this.vaildData(this.permission.user_add, false),
                viewBtn: this.vaildData(this.permission.user_view, false),
                delBtn: this.vaildData(this.permission.user_delete, false),
                editBtn: this.vaildData(this.permission.user_edit, false),
            };
        },
        ids() {
            let ids = [];
            this.selectionList.forEach((ele) => {
                ids.push(ele.id);
            });
            return ids.join(",");
        },
    },
    mounted() {
        // 非租户模式默认加载管理组数据
        if (!website.tenantMode) {
            this.initData(website.tenantId);
        }
    },
    methods: {
        nodeClick(data) {
            this.treeDeptId = data.id;
            this.page.currentPage = 1;
            this.onLoad(this.page);
        },
        handleAdd() {
            this.$refs.addOrUpdate.dialogVisible = true
            this.$refs.addOrUpdate.resetForm()
            this.$refs.addOrUpdate.updateImage()
            this.$refs.addOrUpdate.isDetail = false
        },
        initData(tenantId) {
            getRoleTree(tenantId).then((res) => {
                const column = this.findObject(this.option.group, "roleId");
                column.dicData = res.data.data;
            });
            getDeptTree(tenantId).then((res) => {
                const column = this.findObject(this.option.group, "deptId");
                column.dicData = res.data.data;
            });
            getPostList(tenantId).then((res) => {
                const column = this.findObject(this.option.group, "postId");
                column.dicData = res.data.data;
            });
        },
        editRow(row,type){
            console.log(row)
            this.$refs.addOrUpdate.dialogVisible = true
            this.$refs.addOrUpdate.getDetails(row.id,type)
        },
        submitRole() {
            const roleList = this.$refs.treeRole.getCheckedKeys().join(",");
            grant(this.ids, roleList).then(() => {
                this.roleBox = false;
                this.$message({
                    type: "success",
                    message: "操作成功!",
                });
                this.onLoad(this.page);
            });
        },
        rowSave(row, done, loading) {
            row.deptId = row.deptId.join(",");
            row.roleId = row.roleId.join(",");
            row.postId = row.postId.join(",");
            add(row).then(
                () => {
                    this.initFlag = false;
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                    done();
                },
                (error) => {
                    window.console.log(error);
                    loading();
                }
            );
        },
        rowUpdate(row, index, done, loading) {
            row.deptId = row.deptId.join(",");
            row.roleId = row.roleId.join(",");
            row.postId = row.postId.join(",");
            update(row).then(
                () => {
                    this.initFlag = false;
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                    done();
                },
                (error) => {
                    window.console.log(error);
                    loading();
                }
            );
        },
        rowDel(row) {
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    return remove(row.id);
                })
                .then(() => {
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                });
        },
        searchReset() {
            this.query = {};
            this.treeDeptId = "";
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            if (this.query.account != undefined && this.query.account != "") {
                this.search.account = this.query.account.trim();
            }
            if (this.query.realName != undefined && this.query.realName != "") {
                this.search.realName = this.query.realName.trim();
            }
            this.page.currentPage = 1;
            this.onLoad(this.page, params);
            done();
        },
        selectionChange(list) {
            this.selectionList = list;
        },
        selectionClear() {
            this.selectionList = [];
            this.$refs.crud.toggleSelection();
        },
        handleDelete() {
            if (this.selectionList.length === 0) {
                this.$message.warning("请选择至少一条数据");
                return;
            }
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    return remove(this.ids);
                })
                .then(() => {
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                    this.$refs.crud.toggleSelection();
                });
        },
        handleReset() {
            if (this.selectionList.length === 0) {
                this.$message.warning("请选择至少一条数据");
                return;
            }
            this.$confirm("确定将选择账号密码重置为123456?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    return resetPassword(this.ids);
                })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                    this.$refs.crud.toggleSelection();
                });
        },
        handleGrant() {
            if (this.selectionList.length === 0) {
                this.$message.warning("请选择至少一条数据");
                return;
            }
            this.roleTreeObj = [];
            if (this.selectionList.length === 1) {
                this.roleTreeObj = this.selectionList[0].roleId.split(",");
            }
            getRoleTree().then((res) => {
                this.roleGrantList = res.data.data;
                this.roleBox = true;
            });
        },
        handleImport() {
            this.excelBox = true;
        },
        uploadAfter(res, done, loading, column) {
            window.console.log(column);
            this.excelBox = false;
            this.refreshChange();
            done();
        },
        handleExport() {
            this.$confirm("是否导出用户数据?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                window.open(
                    `/api/oa-user/export-user?${this.website.tokenHeader
                    }=${getToken()}&account=${this.search.account}&realName=${this.search.realName
                    }`
                );
            });
        },
        handleTemplate() {
            window.open(
                `/api/oa-user/export-template?${this.website.tokenHeader
                }=${getToken()}`
            );
        },
        beforeOpen(done, type) {
            if (["edit", "view"].includes(type)) {
                getUser(this.form.id).then((res) => {
                    this.form = res.data.data;
                    if (this.form.hasOwnProperty("deptId")) {
                        this.form.deptId = this.form.deptId.split(",");
                    }
                    if (this.form.hasOwnProperty("roleId")) {
                        this.form.roleId = this.form.roleId.split(",");
                    }
                    if (this.form.hasOwnProperty("postId")) {
                        this.form.postId = this.form.postId.split(",");
                    }
                });
            }
            this.initFlag = true;
            done();
        },
        currentChange(currentPage) {
            this.page.currentPage = currentPage;
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
        },
        refreshChange() {
            this.onLoad(this.page, this.query);
        },
        onLoad(page, params = {}) {
            this.loading = true;
            getList(
                page.currentPage,
                page.pageSize,
                Object.assign(params, this.query),
                this.treeDeptId
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
                this.selectionClear();
            });
        },
    }
};
</script>
  
<style>
.box {
    height: 800px;
}

.el-scrollbar {
    height: 100%;
}

.box .el-scrollbar__wrap {
    overflow: scroll;
}
</style>
  