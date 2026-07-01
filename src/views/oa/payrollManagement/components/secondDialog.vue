<template>
    <div>
        <el-dialog :append-to-body="true" title="" :visible.sync="dialogVisible" :show-close="false" width="30%">
            <el-form v-if="hasPwd" label-width="120px" :model="form" :rules="rules" ref="ruleForm" autocomplete="off">
                <el-form-item label-width="140px" :label="$t('payrollManagement.secondDialog.secondPassword')"
                    prop="password">
                    <input type="text" style="display:none;">
                    <el-input x-autocomplete="disabled" :name="randomName" ref="passwordInput" data-form-type="other"
                        :attrs="{ autocomplete: 'new-password' }"
                        :placeholder="$t('payrollManagement.secondDialog.password')" v-model="form.password" type="text"
                        autocomplete="new-password" readonly
                        onfocus="this.removeAttribute('readonly');"  @keydown.enter.native.prevent></el-input>
                </el-form-item>
            </el-form>
            <div v-else>
                <p>{{ $t('payrollManagement.secondDialog.noSet') }}</p>
                <p class="flex-center py10 ">{{ $t('payrollManagement.secondDialog.click') }} <img class="mx5" width="25"
                        height="25" src="@/assets/png/down.png" />
                    {{ $t('payrollManagement.secondDialog.select') }}
                    【{{ $t('payrollManagement.secondDialog.personalCenter') }}】{{ $t('payrollManagement.secondDialog.set')
                    }}
                    【{{ $t('payrollManagement.secondDialog.secondPassword') }}】</p>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="btnOperate">{{ btnText }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getSecondPasswordStatus, checkSecondPassword } from '@/api/system/user.js'
import md5 from 'js-md5';
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            dialogVisible: true,
            form: {
                password: ''
            },
            hasPwd: true,
            randomName: 'password' + Math.random().toString(36).substr(2, 9),
            btnText: this.$t('payrollManagement.secondDialog.confirm'),
            rules: {
                password: { required: true, message: this.$t('payrollManagement.secondDialog.password'), trigger: 'blur' },
            }
        };
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    mounted() {
        this.init()
        setTimeout(() => {
            this.$refs.passwordInput.$el.querySelector('input').type = 'password';
        }, 2000);
    },
    methods: {
        async init() {
            let res = await getSecondPasswordStatus(this.userInfo.user_id)
            if (res.data.code === 0 || res.data.code === 200) {
                this.hasPwd = res.data.data
            }
            if (this.hasPwd) {
                this.btnText = this.$t('payrollManagement.secondDialog.confirm')
            } else {
                this.btnText = this.$t('payrollManagement.secondDialog.go')
            }
        },
        
        setPwdPage() {
            this.dialogVisible = false
            this.$router.push('/info/index')
        },
        btnOperate() {
            if (this.hasPwd) {
                this.remark()
            } else {
                this.setPwdPage()
            }
        },
        remark() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res = await checkSecondPassword(md5(this.form.password))
                    if (res.data.data) {
                        this.$emit('canGetList', true)
                        this.dialogVisible = false
                    } else {
                        this.$message.error(this.$t('payrollManagement.secondDialog.passwordError'))
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

    }
};
</script>

<style>
input[type="password"] {
    -moz-appearance: none;
    /* 隐藏 Firefox 的下拉箭头 */
}</style>
