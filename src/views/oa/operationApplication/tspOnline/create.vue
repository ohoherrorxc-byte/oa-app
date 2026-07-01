<template>
  <div>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('tspOnline.onlineInfo')}}
      </p>
      <el-form :disabled="disabled" ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item :label="$t('tspOnline.title')" prop="titleName">
          {{getName()}}
        </el-form-item>
        <el-form-item :label="$t('tspOnline.projectName')" prop="project">
          <el-input v-model="form.project"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.changeId')" prop="changeId">
          <el-input v-model="form.changeId"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.changeType')" prop="changeType">
          <el-input v-model="form.changeType"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.changeReason')" prop="reason">
          <el-input type="textarea" v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.environment')" prop="environment">
          <el-input v-model="form.environment"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.planStartTime')" prop="planStartTime">
          <el-date-picker class="w-100" v-model="form.planStartTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
            :placeholder="$t('tspOnline.chooseDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.planEndTime')" prop="planEndTime">
          <el-date-picker class="w-100" v-model="form.planEndTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
            :placeholder="$t('tspOnline.chooseDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.other')" prop="other">
          <el-input v-model="form.other" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </basic-container>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('tspOnline.testReport')}}
      </p>
      <el-form :disabled="!disabled" :model="form" label-width="100px" :rules="rules">
        <el-form-item :label="$t('tspOnline.testConclusion')" prop="testConclusion">
          <el-input v-model="form.testConclusion"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.testReport')" prop="testReport">
          <el-input v-model="form.testReport"></el-input>
        </el-form-item>
      </el-form>
    </basic-container>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('tspOnline.calendarInfo')}}
      </p>
      <el-form :disabled="!disabled"  :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('tspOnline.launchInstruction')" prop="launchInstruction">
          <el-input type="textarea" v-model="form.launchInstruction"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.calendarAttachment')">
          <upload :fileList="form.fileList" @handleRequest="handleRequest"
              :multiple="true" :showFileList="true" :btnName="$t('tspOnline.uploadFile')"></upload>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.changeInstruction')" prop="changeInstruction">
          <el-input v-model="form.changeInstruction"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.affectModel')" prop="affectModel">
          <el-input v-model="form.affectModel"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.userAffect')" prop="userAffect">
          <el-input v-model="form.userAffect"></el-input>
        </el-form-item>
      </el-form>
    </basic-container>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('tspOnline.deployInfo')}}
      </p>
      <el-form :disabled="!disabled" :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('tspOnline.deployInstruction')" prop="deployInstruction">
          <el-input v-model="form.deployInstruction"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.deployStatus')" prop="deployStatus">
          <el-input v-model="form.deployStatus"></el-input>
        </el-form-item>
      </el-form>
    </basic-container>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('tspOnline.checkOnline')}}
      </p>
      <el-form :disabled="!disabled"  :model="form" label-width="100px" :rules="rules">
        <el-form-item :label="$t('tspOnline.checkOnline')" prop="checkOnline">
          <el-input v-model="form.checkOnline"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspOnline.remark')" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </basic-container>

  </div>
</template>

<script>
import { tspOnlineDetail } from "@/api/maintenance/index";
import upload from '@/components/upload/index'
import { mapGetters } from "vuex";
import { getFormatDate } from '@/util/util'
export default {
  data() {
    return {
      form: {
        fileList:[]
      },
      rules: {
        project: [
          { required: true, message: this.$t('tspOnline.pleaseInputProjectName'), trigger: "change" },
        ],
        changeId: [{ required: true, message: this.$t('tspOnline.pleaseInputChangeId'), trigger: "blur" }],
        changeType: [{ required: true, message: this.$t('tspOnline.pleaseInputChangeType'), trigger: "blur" }],
        reason: [
          {
            required: true,
            message: this.$t('tspOnline.pleaseInputChangeReason'),
            trigger: "blur",
          },
        ],
        environment: [
          { required: true, message: this.$t('tspOnline.pleaseInputEnvironment'), trigger: "blur" },
        ],
        planStartTime: [
          { required: true, message: this.$t('tspOnline.pleaseChoosePlanStartTime'), trigger: "change" },
        ],
        planEndTime: [
          { required: true, message: this.$t('tspOnline.pleaseChoosePlanEndTime'), trigger: "change" },
        ],
      },
      rowSum: [],
      projectList: [],
      businessId: null,
      isEdit: false,
    };
  },
  components: { upload },
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
    ...mapGetters(['userInfo'])
  },
  methods: {
    getName(){
      console.log(this.userInfo)
      this.form.titleName = 'TSP/FOTA上线 - ' +  this.userInfo.user_name +
      " - " +
      getFormatDate();
      return   this.form.titleName
    },
    async getDetail() {
      let res = await tspOnlineDetail(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
  handleRequest(data, list) {
      this.form.fileList = list;
      this.form.fileList.forEach((file) => {
        delete file.status
      });
    },
    testAmount() {
      if (isNaN(this.form.totalAmount)) {
        this.$message.error(this.$t('tspOnline.pleaseInputNumber'));
        this.form.totalAmount = null;
      } else {
        this.form.totalAmount = Number(
          Number(this.form.totalAmount).toFixed(2)
        );
      }
    },
    getValue(row, value, key) {
      this.form.subjectList.map((ele) => {
        if (ele.name === row.name) {
          if (isNaN(value)) {
            this.$message.error(this.$t('tspOnline.pleaseInputNumber'));
            ele[key] = null;
          } else {
            ele[key] = Number(ele[key]).toFixed(2);
          }
        }
      });
    },
    testForm() {
      let arr = this.rowSum.slice(1, 9);
      var sum = arr.reduce(function (total, currentValue) {
        return total + currentValue;
      }, 0);
      return new Promise((resolve) => {
        if (Number(this.form.totalAmount) < Number(sum)) {
          this.$message.error(this.$t('tspOnline.projectAmountTotalCannotBeGreaterThanTotalAmount'));
          resolve(false);
        } else {
          this.$refs.form.validate((valid) => {
            resolve(valid);
            if (valid) {
            } else {
              this.$message.error(this.$t('tspOnline.pleaseFillInRequiredFields'));
            }
          });
        }
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

.w-100 {
  width: 100%;
}

.button-bottom {
  width: 100%;
  text-align: center;
}</style>
