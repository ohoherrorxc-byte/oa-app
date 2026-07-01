<template>
  <div>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('appOnline.onlineInfo')}}
      </p>
      <el-form :disabled="disabled" ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('appOnline.projectName')" prop="project">
          <el-input v-model="form.project"></el-input>
        </el-form-item>
        <el-form-item :label="$t('appOnline.projectCode')" prop="projectCode">
          <el-input v-model="form.projectCode"></el-input>
        </el-form-item>
        <el-form-item :label="$t('appOnline.changeId')" prop="changeId">
          <el-input v-model="form.changeId"></el-input>
        </el-form-item>
        <el-form-item :label="$t('appOnline.changeType')" prop="changeType">
          <el-checkbox-group v-model="form.changeType">
            <el-checkbox label="IOS版本号"></el-checkbox>
            <el-checkbox label="Android版本号"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('appOnline.reason')" prop="reason">
          <el-input type="textarea" v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item :label="$t('appOnline.environment')" prop="environment">
          <el-input v-model="form.environment" type="textarea"></el-input>
        </el-form-item>
        <el-form-item :label="$t('appOnline.planStartTime')" prop="planStartTime">
          <el-date-picker v-model="form.planStartTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('appOnline.planEndTime')" prop="planEndTime">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.planEndTime" type="date" placeholder="选择日期"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('appOnline.affectModel')" prop="affectModel">
          <el-input v-model="form.affectModel"></el-input>
        </el-form-item>
        <el-form-item :label="$t('appOnline.other')" prop="other">
          <el-input v-model="form.other" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </basic-container>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('appOnline.testReport')}}
      </p>
      <el-form :disabled="!disabled||isBack"  :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('appOnline.testConclusion')" prop="testConclusion">
          <el-checkbox-group v-model="form.testConclusion">
            <el-checkbox label="IOS验证结果"></el-checkbox>
            <el-checkbox label="Android验证结果"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('appOnline.testReport')" prop="testReport">
          <el-input v-model="form.testReport"></el-input>
        </el-form-item>
        <el-form-item :label="$t('appOnline.testSummary')" prop="testSummary">
          <el-input v-model="form.testSummary"></el-input>
        </el-form-item>
      </el-form>
    </basic-container>
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('appOnline.appHealthCheck')" name="first">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="title" label="Title">
            </el-table-column>
            <el-table-column prop="owner" label="owner" width="140">
              <template slot-scope="scope">
                <autoAddress placeholder="" ref="autoAddress" class="w-100"
                  @getPerson="getPerson(arguments, scope.row, scope.$index)" valueKey="userId"
                  :initData="scope.row.owner" :disabled="!disabled||isBack" :multiple="false"></autoAddress>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="status" width="180">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.status" :disabled="!disabled||isBack" />
              </template>
            </el-table-column>
            <el-table-column prop="verificationMethod" label="Verification Method">
            </el-table-column>
            <el-table-column prop="solution" label="Solution(Fail)" width="280">
              <template slot-scope="scope">
                <div v-html="scope.row.solution"></div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import { onlineDetail } from "@/api/maintenance/index";
import autoAddress from '@/components/autoAddress/index'
export default {
  data() {
    return {
      form: {
        testConclusion: [],
        changeType: [],
        tbHealthChecks: []
      },
      activeName: 'first',
      checkList: [],
      tableData: [
        {
          id: 1,
          title: this.$t('appOnline.searchNewVersion'),
          owner: "",
          status: "",
          verificationMethod: this.$t('appOnline.checkGoogleCache'),
          solution: this.$t('appOnline.googleLog')
        },
        {
          id: 2,
          title: this.$t('appOnline.download'),
          owner: "",
          status: "",
          verificationMethod: this.$t('appOnline.clickDownload'),
          solution: this.$t('appOnline.checkNetwork')
        },
        {
          id: 3,
          title: this.$t('appOnline.install'),
          owner: "",
          status: "",
          verificationMethod: this.$t('appOnline.waitInstall'),
          solution: this.$t('appOnline.checkSignature')
        },
        {
          id: 4,
          title: this.$t('appOnline.open'),
          owner: "",
          status: "",
          verificationMethod: this.$t('appOnline.clickApp'),
          solution: this.$t('appOnline.checkCrashLog')+"<br/>"+this.$t('appOnline.checkSignature2')
        },
        {
          id: 5,
            title: this.$t('appOnline.crash'),
          owner: "",
          status: "",
          verificationMethod: this.$t('appOnline.clickAppCheckCrash'),
          solution: this.$t('appOnline.checkCrashLog')
        },
        {
          id: 6,
          title: this.$t('appOnline.mapKey'),
          owner: "",
          status: "",
          verificationMethod: this.$t('appOnline.clickMap'),
          solution: this.$t('appOnline.mapKeySolution')
        },
        {
          id: 7,
          title: this.$t('appOnline.isEnvironmentCorrect'),
          owner: "",
          status: "",
          verificationMethod: this.$t('appOnline.useProductionEnvironment'),
          solution: this.$t('appOnline.productionEnvironmentSolution')
        }
      ],
      rules: {
        project: [
            { required: true, message: this.$t('appOnline.projectNameRequired'), trigger: "blur" },
        ],
        changeId: [{ required: true, message: this.$t('appOnline.changeIdRequired'), trigger: "blur" }],
        changeType: [{ required: true, message: this.$t('appOnline.changeTypeRequired'), trigger: "change" }],
        reason: [
          {
            required: true,
            message: this.$t('appOnline.reasonRequired'),
            trigger: "blur",
          },
        ],
        environment: [
            { required: true, message: this.$t('appOnline.environmentRequired'), trigger: "blur" },
        ],
        planStartTime: [{ required: true, message: this.$t('appOnline.planStartTimeRequired'), trigger: "change" }],
        planEndTime: [{ required: true, message: this.$t('appOnline.planEndTimeRequired'), trigger: "change" }],
      },
      rowSum: [],
      projectList: [],
      businessId: null,
      isEdit: false,
    };
  },
  components: { autoAddress },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
  },
  computed: {
    disabled() {
      return this.businessId && !this.isEdit;
    },
    isBack(){
      console.log('isBack')
      console.log(this.form)
      console.log(this.form.flow&&this.form.flow.processIsFinished==='back')
      return this.form.flow&&this.form.flow.processIsFinished==='back'
    }
  },
  methods: {
    async getDetail() {
      let res = await onlineDetail(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.testConclusion = this.form.testConclusion || []
        this.form.changeType = this.form.changeType || []
        // this.form.tbHealthChecks
        if (this.form.tbHealthChecks) {
          console.log(this.form.tbHealthChecks)
          console.log('dddd')
          this.tableData.map((ele,index)=>{
            console.log(ele)
            ele.owner = this.form.tbHealthChecks[index].owner
            ele.status = this.form.tbHealthChecks[index].checkStatus
          })
        }
        console.log(this.tableData)
        this.$emit("getFormData", this.form);
      }
    },
    getPerson(data, row, index) {
      row.owner = data[0].realName
      this.$set(this.tableData, index, row)
    },

    getValue(row, value, key) {
      this.form.subjectList.map((ele) => {
        if (ele.name === row.name) {
          if (isNaN(value)) {
            this.$message.error(this.$t('appOnline.pleaseInputNumber'));
            ele[key] = null;
          } else {
            ele[key] = Number(ele[key]).toFixed(2);
          }
        }
      });
    },
    testForm() {
      this.form.tbHealthChecks = []
      this.tableData.map(ele => {
        this.form.tbHealthChecks.push({
          owner: ele.owner,
          checkStatus: ele.status
        })
      })
      console.log(this.form.tbHealthChecks)
      // this.form.changeType = this.form.changeType.toString()
      // this.form.testConclusion = this.form.testConclusion.toString()
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          console.log(valid)
          resolve(valid);
          if (valid) {
          } else {
            this.$message.error(this.$t('appOnline.pleaseFillInRequiredFields'));
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
}

@media (min-width: 768px) {
  .el-form-item {
    width: 48%;
  }
}

.button-bottom {
  width: 100%;
  text-align: center;
}
</style>
