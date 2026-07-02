<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogVisible" width="90%"
        :before-close="handleClose" :append-to-body="true" :lock-scroll="false">
        <el-form :disabled="isDetail" ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
            <div class="w100 sub-title">基本信息</div>
            <el-form-item label="编号">
                <el-input v-model="form.code" clearable></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
                <el-input v-model="form.realName" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="form.sex" clearable>
                    <el-option :value="1" label='男'></el-option>
                    <el-option :value="2" label='女'></el-option>
                    <el-option :value="3" label='未知'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="deptId">
                <avue-input-tree :check-strictly="true" ref="deptTree" node-key="id" multiple v-model="form.deptId"
                    placeholder="请选择内容" :dic="departmentList" :props="deptProps"></avue-input-tree>
                <!-- <elSelectTree :multiple="true" :valueMultiple="form.deptId" :options="departmentList" :props="deptProps"></elSelectTree> -->
            </el-form-item>
            <el-form-item label="岗位" prop="postId">
                <el-select v-model="form.postId" clearable multiple filterable>
                    <el-option v-for="item in postList" :key="item.id" :label="item.postName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职称">
                <el-select v-model="form.title" clearable>
                    <el-option v-for="item in professionalList" :key="item.title" :label="item.title"
                        :value="item.title"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职级">
                <el-input v-model="form.rank" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="form.workStatus" clearable>
                    <el-option :value="0" label='试用'></el-option>
                    <el-option :value="1" label='正式'></el-option>
                    <el-option :value="2" label='临时'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="照片">
                <upload v-if="!form.showPhoto" btnName="上传" @handleRequest="handleRequest"></upload>
                <div v-else class="pr">
                    <img class="borad-cicle" width="80" height="80" :src="form.showPhoto" alt="">
                    <i @click="deleteImg" class="el-icon-error delete-img"></i>
                </div>
                <!-- <el-input v-model="form.name"></el-input> -->
            </el-form-item>
            <el-form-item label="角色">
                <avue-input-tree multiple ref="roleTree" :check-strictly="true" node-key="id" v-model="form.roleId"
                    placeholder="请选择内容" :dic="roleList" :props="roleProps"></avue-input-tree>
            </el-form-item>
            <el-form-item label="租户">
                <el-input disabled v-model="form.tenantName" clearable></el-input>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker class="w100" v-model="form.birthday" clearable value-format="yyyy-MM-dd"
                    type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.name" clearable></el-input>
            </el-form-item>
            <div class="w100 sub-title">入职申请</div>
            <el-form-item label="入职日期">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.employmentDate" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="参加工作日期">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.dateInWork" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="办公地点">
                <el-select v-model="form.officeLocation" clearable>
                    <el-option v-for="item in locationList" :key="item.id" :label="item.address"
                        :value="item.city"></el-option>
                </el-select>
            </el-form-item>
            <div class="w100 sub-title">通讯信息</div>
            <el-form-item label="移动电话">
                <el-input v-model="form.phone" clearable></el-input>
            </el-form-item>
            <el-form-item label="办公室电话">
                <el-input v-model="form.officePhone" clearable></el-input>
            </el-form-item>
            <el-form-item label="其他电话">
                <el-input v-model="form.otherPhone" clearable></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱">
                <el-input v-model="form.email" clearable></el-input>
            </el-form-item>
            <div class="w100 sub-title">上下级关系</div>
            <el-form-item label="直接上级">
                <el-autocomplete class="w100" v-model="form.directSuperior" clearable
                    :fetch-suggestions="querySearchAsyncSuperior" @select="handleSelectSuperior">
                    <el-button slot="append" @click="openAddress('isDirect')"
                        icon="el-icon-search"></el-button></el-autocomplete>
            </el-form-item>
            <el-form-item label="助理">
                <el-autocomplete class="w100" v-model="form.assistant" clearable
                    :fetch-suggestions="querySearchAsyncAssistant" @select="handleSelectAssistant">
                    <el-button slot="append" @click="openAddress('isAssistant')"
                        icon="el-icon-search"></el-button></el-autocomplete>
            </el-form-item>
            <div class="w100 sub-title">个人信息</div>
            <el-form-item label="民族">
                <el-input v-model="form.ethnicGroup" clearable></el-input>
            </el-form-item>
            <el-form-item label="籍贯">
                <el-input v-model="form.nativePlace" clearable></el-input>
            </el-form-item>
            <el-form-item label="婚姻状况">
                <el-select v-model="form.marriage" clearable>
                    <el-option value="已婚" label='已婚'></el-option>
                    <el-option value="未婚" label='未婚'></el-option>
                    <el-option value="离异" label='离异'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学历">
                <el-select v-model="form.education" clearable>
                    <el-option v-for="item in educationalList" :key="item.id" :label="item.education"
                        :value="item.education"></el-option>
                </el-select>
            </el-form-item>
            <div class="w100 sub-title">供应商信息</div>
            <el-form-item label="类别">
                <el-select v-model="form.category" clearable>
                    <el-option value="任务类" label='任务类'></el-option>
                    <el-option value="非任务类" label='非任务类'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="供应商公司">
                <el-select v-model="form.supplierCompanyId" clearable filterable>
                    <el-option v-for="item in supplyList" :key="item.id" :label="item.supplierName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="负责人">
                <el-autocomplete class="w100" v-model="form.responsiblePerson" clearable @select="handleSelectPerson"
                    :fetch-suggestions="querySearchAsyncPerson">
                    <el-button slot="append" @click="openAddress('isResponsible')"
                        icon="el-icon-search"></el-button></el-autocomplete>
            </el-form-item>
            <el-form-item label="领域">
                <el-select v-model="form.field" clearable>
                    <el-option v-for="item in areaList" :key="item.id" :label="item.field" :value="item.field"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="细分领域">
                <el-input v-model="form.segmentedAreas" clearable></el-input>
            </el-form-item>
            <el-form-item label="级别">
                <el-select v-model="form.level" clearable>
                    <el-option value="A" label='A'></el-option>
                    <el-option value="B" label='B'></el-option>
                    <el-option value="C" label='C'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人天">
                <el-input v-model="form.personDay" clearable></el-input>
            </el-form-item>
            <el-form-item label="是否为供应商">
                <el-select v-model="form.isSupplier" clearable>
                    <el-option value="是" label='是'></el-option>
                    <el-option value="否" label='否'></el-option>
                </el-select>
            </el-form-item>
              <el-form-item label="是否为供应商客户" v-if='userInfo.account!="huxiaoyun"'>
                <el-select v-model="form.supplierClient" clearable>
                    <el-option value="是" label='是'></el-option>
                    <el-option value="否" label='否'></el-option>
                </el-select>
            </el-form-item>
            <div class="w100 sub-title flex-center between">
                <div>工作经历</div>
                <div>
                    <span class="add-icon" @click="addRow">+</span>
                    <span class="dec-icon" @click="deleteChooseRow">―</span>
                </div>
            </div>
            <el-table ref="multipleTable" :data="form.workExpList" @selection-change="handleSelectionChange" class="mb20">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column property="companyName" label="公司名称" align="center">
                    <template slot-scope="scope">
                        <el-input clearable v-model="scope.row.companyName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column property="startTime" label="开始时间" align="center">
                    <template slot-scope="scope">
                        <el-date-picker value-format="yyyy-MM-dd" :clearable="false" type="date"
                            v-model="scope.row.startTime" class="w100"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column property="endTime" label="结束时间" align="center">
                    <template slot-scope="scope">
                        <el-date-picker value-format="yyyy-MM-dd" :clearable="false" type="date" v-model="scope.row.endTime"
                            class="w100"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column property="title" label="职务" align="center">
                    <template slot-scope="scope">
                        <el-input clearable v-model="scope.row.title"></el-input>
                    </template>
                </el-table-column>
                <el-table-column property="jobOverview" label="工作描述" align="center">
                    <template slot-scope="scope">
                        <el-input clearable v-model="scope.row.jobOverview"></el-input>
                    </template>
                </el-table-column>
                <el-table-column property="reasonForDeparture" label="离开原因" align="center">
                    <template slot-scope="scope">
                        <el-input clearable v-model="scope.row.reasonForDeparture"></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-if="row && row.isCreateUser" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleDeleteData(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="w100 sub-title">系统信息</div>
            <el-form-item label="登录名" prop="account">
                <el-input :disabled="form.id" clearable v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <div class="flex-center">
                    <el-input :disabled="form.id" class="w-55" type="password" clearable v-model="form.password"></el-input>
                    <span class="font10 ml3">字母、数字、特殊字符组合</span>
                </div>
            </el-form-item>
            <el-form-item label="确认密码" prop="remarkPassword">
                <el-input :disabled="form.id" clearable type="password" v-model="form.remarkPassword"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verificationCode">
                <div class="flex-center">
                    <el-input clearable class="mr10" v-model="form.verificationCode"></el-input>
                    <img class="" @click="updateImage" width="70" :src="imageData" alt="">
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer text-center">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="!isDetail" type="primary" @click="remark">确 定</el-button>
        </span>
        <addressBookDialog @getPerson="getPerson" ref="addressBookDialog"></addressBookDialog>
    </el-dialog>
</template>

<script>
import upload from '@/components/upload/index'
import website from "@/config/website";
import { getDeptTree, getDeptLazyTree } from "@/api/organizationalStructure/department";
import { getRoleTree } from "@/api/organizationalStructure/role";
import elSelectTree from '@/components/elSelectTree'
import addressBookDialog from '@/components/addressBookDialog/index'
import OtherApi from '@/api/organizationalStructure/other.js'
import UserApi from '@/api/organizationalStructure/user.js'
import AddressApi from '../../../../../api/organizationalStructure/address';
import { mapGetters } from 'vuex';
export default {
    components: {
        upload, addressBookDialog, elSelectTree
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (value) {
                const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
                if (!pattern.test(this.form.password)) {
                    callback(new Error('请输入正确的密码格式'));
                }
            } else {
                callback(new Error('请输入密码'));
            }
            if (this.form.remarkPassword !== '') {
                this.$refs.form.validateField('remarkPassword');
            }
            callback();

        };
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else if (!value) {
                callback(new Error("请输入确认密码!"));
            } else {
                callback();
            }
        };
        return {
            isDetail: false,
            deptProps: {
                label: "title",
                value: "id",
                children: "children",
            },
            roleProps: {
                label: "title",
                value: "id",
                children: "children",
            },
            title: '新增用户',
            assistantList: [],//助理
            superiorList: [],//上级
            dialogVisible: false,
            imageData: '/api/oa-user/v2.0/checkCode',
            form: {},
            rules: {
                realName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                deptId: [
                    { required: true, message: '请选择部门', trigger: 'change' },
                ],
                postId: [
                    { required: true, message: '请选择岗位', trigger: 'change' },
                ],
                employmentDate: [
                    { required: true, message: '请选择入职日期', trigger: 'change' },
                ],
                dateInWork: [
                    { required: true, message: '请选择参加工作日期', trigger: 'change' },
                ],
                officeLocation: [
                    { required: true, message: '请选择办公地点', trigger: 'change' },
                ],
                account: [
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                remarkPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ],
                verificationCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ]
            },
            choosePersonKey: "",
            departmentList: [],
            postList: [],
            professionalList: [],
            roleList: [],
            locationList: [],
            educationalList: [],
            supplyList: [],
            areaList: [],
            multipleSelection: []
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    watch: {
        form(val) {
            console.log(val)
        }
    },
    created() {
        console.log(this.userInfo)
        this.initData()
        this.init()
    },
    methods: {
        init() {
            this.getDepartment()
            this.getPost()
            this.getTitle()
            this.getRole()
            this.getPlace()
            this.getEducation()
            this.getArea()
            this.getSupplier()
        },
        async getDetails(id, type) {
            if (type) {
                this.isDetail = true
            } else {
                this.isDetail = false
                this.updateImage()
            }
            if (id) {
                this.rules.password = []
                this.rules.remarkPassword = []
            }
            let res = await UserApi.getDetails(id)
            if (res.data.code === 0 || res.data.code === 200) {
                console.log()
                this.$refs.deptTree.clearHandle()
                this.$refs.roleTree.clearHandle()
                this.form = res.data.data
                this.title = '编辑用户'
                this.form.postId = this.form.postId.split(',')
                console.log(this.form)
            }
        },
        async getDepartment() {
            let res = await getDeptTree(629965)
            if (res.data.code === 0 || res.data.code === 200) {
                this.departmentList = res.data.data
            }
        },
        initData() {
            this.form = {
                "account": "",
                "assistant": "",
                "assistantId": null,
                "avatar": "",
                "birthday": "",
                "category": "",
                "code": "",
                "createDept": null,
                "createTime": "",
                "createUser": null,
                "dateInWork": "",
                "deptId": [],
                "directSuperior": "",
                "directSuperiorId": null,
                "education": "",
                "email": "",
                "employmentDate": "",
                "ethnicGroup": "",
                "field": "",
                "isSupplier": "",
                supplierClient:"否",
                "level": "",
                "marriage": "",
                "name": "",
                "nativePlace": "",
                "officeLocation": "",
                "officePhone": "",
                "otherPhone": "",
                "password": "",
                remarkPassword: "",
                "personDay": "",
                "phone": "",
                "photo": "",
                showPhoto:'',
                "postId": [],
                "rank": "",
                "realName": "",
                "responsiblePerson": "",
                "responsiblePersonId": null,
                "roleId": "",
                "segmentedAreas": "",
                "sex": null,
                "status": null,
                "supplierCompany": "",
                "supplierCompanyId": null,
                "title": "",
                "updateTime": "",
                "updateUser": null,
                "userType": null,
                tenantId: 629965,
                tenantName: 'OA管理系统',
                "workExpList": [
                    {
                        key: Date.now()
                    }
                ],
                "workStatus": null
            }
        },
        resetForm() {
            this.initData()
            this.$nextTick(() => {
                this.$refs.form.clearValidate(); // 清除表单校验
            });
        },
        async getRole() {
            let res = await UserApi.getRole()
            if (res.data.code === 0 || res.data.code === 200) {
                this.roleList = res.data.data
            }
        },
        async querySearchAsyncSuperior(queryString, cb) {
            if (!queryString && !this.form.directSuperior) return cb([])
            let personList = await this.getPersonList({ realName: queryString || this.form.directSuperior })
            cb(personList);
        },
        async getPersonList(name) {
            // 走 vuex 缓存的全量用户列表，前端按 realName 模糊匹配；
            // 与其它页面的 5 个 autoAddress / acceptApply 共享同一个缓存，避免重复请求
            const all = await this.$store.dispatch('GetUserAllList')
            const query = (name && name.realName) ? String(name.realName).toLowerCase() : ''
            const arr = query
                ? all.filter(ele => ele.realName && String(ele.realName).toLowerCase().includes(query))
                : all
            arr.forEach(ele => { ele.value = ele.realName })
            return arr
        },
        async querySearchAsyncAssistant(queryString, cb) {
            if (!queryString && !this.form.assistant) return cb([])
            let personList = await this.getPersonList({ realName: queryString || this.form.assistant })
            cb(personList);
        },
        handleSelectAssistant(data) {
            this.form.assistant = data.realName || data.name
            this.form.assistantId = data.id
        },
        handleSelectSuperior(data) {
            this.form.directSuperior = data.realName || data.name
            this.form.directSuperiorId = data.id
        },
        async querySearchAsyncPerson(queryString, cb) {
            if (!queryString && !this.form.responsiblePerson) return cb([])
            let personList = await this.getPersonList({ realName: queryString || this.form.responsiblePerson })
            cb(personList);
        },
        handleSelectPerson(data) {
            this.form.responsiblePerson = data.realName || data.name
            this.form.responsiblePersonId = data.id
        },
        getPerson(data) {
            if (this.choosePersonKey === 'isDirect') {
                this.handleSelectSuperior(data)
            } else if (this.choosePersonKey === 'isAssistant') {
                this.handleSelectAssistant(data)
            } else if (this.choosePersonKey === 'isResponsible') {
                this.handleSelectPerson(data)
            }
            this.doBurialPoint(data)
        },
        async doBurialPoint(data) {
            let obj = {
                contactedUserId: data.id,
                userId: this.userInfo.user_id
            }
            let res = await AddressApi.recentlyContactedAdd(obj)
        },
        updateImage() {
            var rad = Math.floor(Math.random() * Math.pow(10, 8));
            //uuuy是随便写的一个参数名称，后端不会做处理，作用是避免浏览器读取缓存的链接
            this.imageData = `${'/api/oa-user/v2.0/checkCode'}?uuuy=${rad}`
        },
        async getSupplier() {
            let res = await UserApi.contractSupplierAll('')
            if (res.data.code === 0 || res.data.code === 200) {
                this.supplyList = res.data.data
            }
        },
        async getPost() {
            let res = await UserApi.getPost()
            if (res.data.code === 0 || res.data.code === 200) {
                this.postList = res.data.data
            }
        },
        async getTitle() {
            let res = await OtherApi.titleList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.professionalList = res.data.data
            }
        },
        async getPlace() {
            let res = await OtherApi.addressList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.locationList = res.data.data
            }
        },
        async getEducation() {
            let res = await OtherApi.educationList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.educationalList = res.data.data
            }
        },
        async getArea() {
            let res = await OtherApi.fieldList()
            if (res.data.code === 0 || res.data.code === 200) {
                this.areaList = res.data.data
            }
        },
        openAddress(key) {
            this.choosePersonKey = key
            this.$refs.addressBookDialog.dialogVisibleAddress = true
        },
        deleteImg() {
            this.form.photo = ''
            this.form.showPhoto = ''
        },
        addRow() {
            this.form.workExpList.push({
                key: Date.now()
            })
        },
        deleteChooseRow() {
            if (this.multipleSelection.length === 0) {
                this.$message.error('请先选择工作经历')
                return
            }
            let keys = this.multipleSelection.map(ele => ele.key)
            let ids = this.multipleSelection.map(ele => ele.id)
            this.form.workExpList = this.form.workExpList.filter((ele) => {
                return !keys.includes(ele.key) || !ids.includes(ele.id)
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleRequest(data) {
            // console.log(data)
            this.form.photo = data.link
            this.form.showPhoto = data.domain
        },
        dealTimerSecond(v) {
            if (!v || (v && v.length > 13)) {
                return v
            } else {
                return `${v} 00:00:00`
            }
        },
        remark() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let obj = JSON.parse(JSON.stringify(this.form))
                    obj.birthday = this.dealTimerSecond(obj.birthday)
                    obj.employmentDate = this.dealTimerSecond(obj.employmentDate)
                    obj.dateInWork = this.dealTimerSecond(obj.dateInWork)
                    obj.postId = (obj.postId||"").toString()
                    obj.deptId = (obj.deptId||"").toString()
                    obj.workExpList.map(ele => {
                        ele.startTime = this.dealTimerSecond(ele.startTime)
                        ele.endTime = this.dealTimerSecond(ele.endTime)
                    })
                    let Api = this.form.id ? UserApi.update : UserApi.add
                    let res = await Api(obj)
                    if (res.data.code === 0 || res.data.code === 200) {
                        this.$message.success('提交成功')
                        this.$emit('getReflesh')
                        this.dialogVisible = false
                    } else {
                        this.updateImage()
                    }
                } else {
                    this.$message.error('请填写必填项')
                    return false;
                }
                // this.dialogVisible = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form {
    display: flex;
    flex-wrap: wrap;

}

.text-center {
    text-align: center;
}

.sub-title {
    margin-left: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: black;
}

.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.dec-icon {
    color: #979797;
    background-color: #EAEAEA;
    padding: 3px 6px;
    border-radius: 2px;
    margin-right: 20px;
}

.between {
    justify-content: space-between;
}

.w100 {
    width: 100%;
}

.el-form-item {
    width: 30%;
}

.ml3 {
    margin-left: 3px;
}

.font22 {
    font-size: 22px;
}

.color666 {
    color: #666666
}

.font10 {
    font-size: 10px;
}

.delete-img {
    color: red;
    position: absolute;
    font-size: 16px;
    margin-left: -10px;
    margin-top: -5px;
}

.borad-cicle {
    border-radius: 5px;
}

.w-55 {
    width: 55%;
}
</style>