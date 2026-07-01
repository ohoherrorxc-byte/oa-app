<template>
    <el-row>
        <el-col :span="24">
            <basic-container>
                <p class="table-titleName">
                    <span></span>{{ $t('dimission.otherHandover') }}
                </p>
                <el-form label-width="140px" class="pt10" ref="ruleForm" :rules="rules" :model="form">
                    <div v-for="item in otherList" :key="item.key">
                        <!-- v-if="showNumber.includes(item.key)" -->
                        <el-row v-if="showNumber.includes(item.key)">                       
                            <div v-for="subItem in item.row">
                                <el-col :span="isMobile ? 22 : (item.span || 11)">
                                    <el-form-item :label="subItem.name" :prop="item.isEdit() ? subItem.prop : ''">
                                        <div v-if="subItem.type === 'checkbox'">
                                           
                                            <el-checkbox-group @change="change($event,subItem.change, subItem, item)" v-model="form[subItem.prop]"
                                            :disabled="!item.isEdit()" >
                                             
                                                <el-checkbox v-for="t in subItem.dicData" :label="t.label"></el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                        <!-- :disabled="!item.isEdit()" -->
                                        <el-input :disabled="!item.isEdit()"  @change="change($event,subItem.change, subItem, item)"  v-else v-model="form[subItem.prop]"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </el-row>
                    </div>
                    <el-row v-if="showNumber.includes(15)">
                        <el-col span="24">
                            <el-form-item :label="$t('dimission.assetReturn')" prop="moneyHandover">
                                <el-checkbox-group @change="changeAsset($event,'moneyHandover')" v-model="form.moneyHandover" :disabled="!step8()">
                                    <el-checkbox label="办公室钥匙"></el-checkbox>
                                    <el-checkbox label="工位"></el-checkbox>
                                    <el-checkbox label="其他"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="showNumber.includes(15)"  >
                        <el-col span="22">
                            <el-form-item :label="$t('dimission.assetCode')"  prop="moneyCode">
                                <el-input @change="changeAsset($event,'moneyCode')" v-model="form.moneyCode" type="textarea" :disabled="!step8()"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="showNumber.includes(15)">
                        <el-col span="22">
                            <el-form-item :label="$t('other.remarks')"  ><el-input :disabled="!step8()"
                                v-model="form.moneyRemark"  @change="changeAsset($event,'moneyRemark')"  type="textarea"></el-input></el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </basic-container>
        </el-col>

    </el-row>
</template>
  
<script>
import { mapGetters } from "vuex";
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            values: [],
            form: {
                partyWorkHandover:[],
                partyWorkHandoverRemark:null,
                financialHandover:[],
                financialHandoverRemark:null,
                peopleHandover:[],
                peopleHandoverRemark:null,
                testHandover:[],
                testHandoverRemark:null,
                adminHandover:[],
                adminHandoverRemark:null,
                doorAccessControl:[],
                moneyHandover:[],
                moneyCode:null,
                moneyRemark:null,
                flow:null
            },
            otherForm:{},
            otherList: [
                {
                    key: 13,
                    isEdit: this.step6,
                    row: [
                        {
                            name: this.$t('dimission.partyWorkHandover'),
                            prop: "partyWorkHandover",
                            type: 'checkbox',
                            dicData: [
                                {
                                    label: '组织关系',
                                    value: '组织关系'
                                },
                                {
                                    label: '工会关系',
                                    value: '工会关系'
                                },
                                {
                                    label: '其他',
                                    value: '其他'
                                }
                            ]
                        },
                        {
                            name: this.$t('other.remarks'),
                            prop: "partyWorkHandoverRemark",
                            type: "input"
                        }
                    ]
                },
                {
                    key: 12,
                    isEdit: this.step5,
                    row: [
                        {
                            name: this.$t('dimission.financialHandover'),
                            prop: "financialHandover",
                            type: 'checkbox',
                            dicData: [
                                {
                                    label: '借支费用',
                                    value: '借支费用'
                                },
                                {
                                    label: '其他',
                                    value: '其他'
                                },

                            ]
                        },
                        {
                           name:this.$t('other.remarks'),
                            prop: "financialHandoverRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 17,
                    isEdit: this.step10,
                    row: [
                        {
                            name:this.$t('dimission.financialHandover'), 
                            prop: "peopleHandover",
                            type: 'checkbox',
                            dicData: [
                                {
                                    label: '离职证明/退工单',
                                    value: '离职证明/退工单'
                                },
                                {
                                    label: '劳动手册',
                                    value: '劳动手册'
                                },
                                {
                                    label: '各类保险及公积金',
                                    value: '各类保险及公积金'
                                },
                                {
                                    label: '网上大学',
                                    value: '网上大学'
                                },
                                {
                                    label: '其他',
                                    value: '其他'
                                }
                            ]
                        },
                        {
                           name:this.$t('other.remarks'),
                            prop: "peopleHandoverRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 14,
                    isEdit: this.step7,
                    row: [
                        {
                            name: this.$t('dimission.testHandover'),
                            prop: "testHandover",
                            type: 'checkbox',
                            dicData: [
                                {
                                    label: '测试资源',
                                    value: '测试资源'
                                },
                                {
                                    label: '物料归还',
                                    value: '物料归还'
                                },

                            ]
                        },
                        {
                           name:this.$t('other.remarks'),
                            prop: "testHandoverRemark",
                            type: 'input'
                        }
                    ]
                },
                {
                    key: 16,
                    isEdit: this.step9,
                    row: [
                        {
                            name: this.$t('dimission.adminHandover'),
                            prop: "adminHandover",
                            type: 'checkbox',
                            dicData: [
                                {
                                    label: '办公钥匙',
                                    value: '办公钥匙'
                                },
                                {
                                    label: '办公电脑',
                                    value: '办公电脑'
                                },
                                {
                                    label: '显示器',
                                    value: '显示器'
                                },
                                {
                                    label: '出入证门禁卡',
                                    value: '出入证门禁卡'
                                },
                                {
                                    label: '办公用品',
                                    value: '办公用品'
                                },
                                {
                                    label: '其他',
                                    value: '其他'
                                },

                            ],


                        },
                        {
                           name:this.$t('other.remarks'),
                            prop: "adminHandoverRemark",
                            type: 'input'
                        }
                    ],

                },
                {
                    key: 16,
                    span: 24,
                    isEdit: this.step9,
                    row: [
                        {
                            name: this.$t('dimission.doorAccessControl'),
                            prop: "doorAccessControl",
                            type: 'checkbox',
                            dicData: [
                                {
                                    label: "4楼玻璃门",
                                    value: "4楼玻璃门",
                                },
                                {
                                    label: "7楼玻璃门",
                                    value: "7楼玻璃门",
                                },
                                {
                                    label: "7楼综管办公室",
                                    value: "7楼综管办公室",
                                },
                                {
                                    label: "智能网联在环实验室",
                                    value: "智能网联在环实验室",
                                },
                                {
                                    label: "4楼自动化测试实验室",
                                    value: "4楼自动化测试实验室",
                                },
                                {
                                    label: "零件管理室",
                                    value: "零件管理室",
                                },
                                {
                                    label: "数字广播测试实验室",
                                    value: "数字广播测试实验室",
                                },
                                {
                                    label: "4楼HMI",
                                    value: "4楼HMI",
                                },
                                {
                                    label: "4楼智能硬件PPO",
                                    value: "4楼智能硬件PPO",
                                },
                                {
                                    label: "4楼智能硬件PPO仓库",
                                    value: "4楼智能硬件PPO仓库",
                                },
                                {
                                    label: "7楼副总办公室",
                                    value: "7楼副总办公室",
                                },
                                {
                                    label: "3楼VIP ROOM",
                                    value: "3楼VIP ROOM",
                                },
                                {
                                    label: "3楼玻璃门",
                                    value: "3楼玻璃门",
                                },
                                {
                                    label: "7楼会议室E",
                                    value: "7楼会议室E",
                                },
                                {
                                    label: "4楼库房",
                                    value: "4楼库房",
                                }, {
                                    label: '无',
                                    value: '无'
                                }
                            ],
                            change: 'doorAccessChange'
                        },
                        // {
                        //     name: "备注",
                        //     prop: "",
                        //     type: 'input'
                        // }
                    ]
                }
            ],
            rules: {
                partyWorkHandover: [
                    { required: true, message: '请选择党群工作人员交接情况', trigger: 'change' }
                ],
                financialHandover: [
                    { required: true, message: '请选择财务交接情况', trigger: 'change' }
                ],
                peopleHandover: [
                    { required: true, message: '请选择人力资源交接情况', trigger: 'change' }
                ],
                testHandover: [
                    { required: true, message: '请选择测试资产交接情况', trigger: 'change' }
                ],
                adminHandover: [
                    { required: true, message: '请选择行政资产交接情况', trigger: 'change' }
                ],
                doorAccessControl: [
                    { required: true, message: '请选择门禁类型', trigger: 'change' }
                ],
                moneyHandover: [
                    { required: true, message: '请选择资产归还', trigger: 'change' }
                ],
                moneyCode: [
                    { required: true, message: '请输入资产编号', trigger: 'blur' }
                ],
                moneyRemark: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            showNumber: []
        };
    },
    watch: {
        formData() {
            console.log(this.formData.showNumber)
            this.showNumber = this.formData.showNumber||[]
            if(this.formData.flow&&this.formData.flow.status==='finished'){
                this.showNumber =  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
            }
            this.form.partyWorkHandover = this.formData.partyWorkHandover||[]
            this.form.partyWorkHandoverRemark = this.formData.partyWorkHandoverRemark
            this.form.financialHandover = this.formData.financialHandover||[]
            this.form.financialHandoverRemark = this.formData.financialHandoverRemark
            this.form.peopleHandover = this.formData.peopleHandover||[]
            this.form.peopleHandoverRemark = this.formData.peopleHandoverRemark
            this.form.testHandover = this.formData.testHandover||[]
            this.form.testHandoverRemark = this.formData.testHandoverRemark
            this.form.adminHandover = this.formData.adminHandover||[]
            this.form.adminHandoverRemark = this.formData.adminHandoverRemark
            this.form.doorAccessControl = this.formData.doorAccessControl||[]
            this.form.moneyHandover = this.formData.moneyHandover||[]
            this.form.moneyCode = this.formData.moneyCode
            this.form.moneyRemark = this.formData.moneyRemark
            this.form.flow = this.formData.flow
        },
    },
    props: {
        detailId: {
            type: String,
        },
        formData: {
            type: Object,
        },
        disabled: {
            type: Boolean,
            default: true
        },
        isApproveUser: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(["userInfo", "isMobile"]),
    },
    components: {
        autoAddress
    },
    mounted() {
        console.log(this.formData)
    },
    methods: {
        change(e,key,subItem,item) {
            this.form[subItem.prop] = e
            this.otherForm[subItem.prop] = e
            console.log(this.form)
            if(key==='doorAccessChange'){
                if(e.includes('无')){
                    this.otherForm[subItem.prop] =['无']
                    this.form[subItem.prop] = ['无']
                }
            }
        },
        changeAsset(e,key){
            console.log(e)
            this.otherForm[key] = e
        },
        //财务工作交接人
        step5() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'finance';
        },
        //党建工作交接人
        step6() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'party';
        },
        //测试资产
        step7() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'testProperty';
        },
        //资产管理员
        step8() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'property';
        },
        //行政资产
        step9() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'admin';
        },
        //人力资产
        step10() {
            return this.form && this.form.flow && this.form.flow.taskDefinitionKey === 'people';
        },
        testOther() {
            // console.log(this.rules)
            // console.log(this.form)
            this.otherForm = {...this.form,...this.otherForm}
            // console.log(this.otherForm)
            return new Promise((resolve) => {
                this.$refs.ruleForm.validate((valid,msg,done) => {
                    // console.log(valid)
                    // console.log(msg)
                    msg && Object.values(msg)[0]&&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    resolve(valid);
                    // done();
                });
            });
        }
    },
};
</script>
  
<style scoped>
.avue-form__menu {
    display: none;
}

.checkbox-class {
    width: 100%;
    text-align: center;
}
</style>