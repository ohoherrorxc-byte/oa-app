<template>
  <div>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('tspInterface.applyInfo')}}
      </p>
      <el-form :disabled="disabled" ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('tspInterface.expectedOnlineDate')" prop="onlineDate">
          <el-date-picker class="w-100" v-model="form.onlineDate" type="date" value-format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('tspInterface.chooseDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('tspInterface.interfaceType')" prop="interfaceType">
          <el-select v-model="form.interfaceType">
            <el-option value="TSP" label="TSP"></el-option>
            <el-option value="OTA" label="OTA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tspInterface.applyType')" prop="type">
          <el-select v-model="form.type">
            <el-option value="新增" label="新增"></el-option>
            <el-option value="变更" label="变更"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tspInterface.projectName')" prop="project">
          <el-input v-model="form.project"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspInterface.applyReason')" prop="reason">
          <el-input v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspInterface.interfaceDescription')" prop="interfaceDescription">
          <el-input v-model="form.interfaceDescription" type="textarea"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tspInterface.otherDesc')" prop="otherDesc">
          <upload :btnName="$t('tspInterface.uploadFile')" :fileList="form.fileList" @handleRequest="handleRequest" :showFileList="true"></upload>
        </el-form-item>
      </el-form>
    </basic-container>
    <basic-container>
      <p class="table-title">
        <span></span>{{$t('tspInterface.applyEvaluation')}}
      </p>
        <p class="pb10">{{$t('tspInterface.developmentEvaluation')}}</p>
      <el-form :disabled="!disabled" :model="form" label-width="0px" :rules="rules">

        <el-form-item class="w-100">
          <div class="fr" v-if="disabled">
            <span class="add-icon" @click="addRow">+</span>
          </div>
          <el-table :data="form.developInfoList" style="width: 100%">
            <el-table-column type="index" :label="$t('tspInterface.serialNumber')" width="55"></el-table-column>
            <el-table-column prop="date" :label="$t('tspInterface.developmentPerson')" width="180">
              <template slot-scope="scope">
                <el-form-item style="width: 100%;">
                  <autoAddress placeholder="" ref="autoAddress" class="w-100"
                    @getPerson="getPerson(arguments, scope.row, scope.$index)" valueKey="userId"
                    :initData="scope.row.developName" :disabled="isEdit" :multiple="false"></autoAddress>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('tspInterface.developmentDateStart')" width="180">
              <template slot-scope="scope">
                <el-form-item style="width: 100%;">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.startTime" type="date"
                    :placeholder="$t('tspInterface.chooseDate')">
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="owner" :label="$t('tspInterface.developmentDateEnd')">
              <template slot-scope="scope">
                <el-form-item style="width: 100%;">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.endTime" type="date"
                    :placeholder="$t('tspInterface.chooseDate')">
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('tspInterface.debugStartTime')" width="180">
              <template slot-scope="scope">
                <el-form-item style="width: 100%;">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.debugStartTime" type="date"
                    :placeholder="$t('tspInterface.chooseDate')">
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('tspInterface.debugEndTime')">
              <template slot-scope="scope">
                <el-form-item style="width: 100%;">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.debugEndTime" type="date"
                    :placeholder="$t('tspInterface.chooseDate')">
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </basic-container>
  </div>
</template>

<script>
import { tspInterfaceDetail } from "@/api/maintenance/index";
import upload from '@/components/upload/index'
import autoAddress from '@/components/autoAddress/index'
export default {
  components: { upload, autoAddress },
  data() {
    return {
      form: {
        developInfoList: []
      },
      rules: {

        interfaceType: [
          { required: true, message: this.$t('tspInterface.pleaseSelectInterfaceType'), trigger: "blur" },
        ],
      },
      rowSum: [],
      projectList: [],
      businessId: null,
      isEdit: false,
    };
  },
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
  },
  methods: {
    async getDetail() {
      let res = await tspInterfaceDetail(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.form.developInfoList = this.form.developInfoList||[]
        this.$emit("getFormData", this.form);
      }
    },
    handleRequest(data, arr) {

      this.form.fileList = arr

    },
    getPerson(data, row, index) {
      row.developName = data[0].realName
      this.$set(this.form.developInfoList, index, row)
    },
    addRow() {
      this.form.developInfoList.push({})
    },
    testAmount() {
      if (isNaN(this.form.totalAmount)) {
        this.$message.error(this.$t('tspInterface.pleaseInputNumber'));
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
            this.$message.error(this.$t('tspInterface.pleaseInputNumber'));
            ele[key] = null;
          } else {
            ele[key] = Number(ele[key]).toFixed(2);
          }
        }
      });
    },
    testForm() {

      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
          if (valid) {
          } else {
            this.$message.error(this.$t('tspInterface.pleaseFillInRequiredFields'));
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

.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
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
