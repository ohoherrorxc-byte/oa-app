<template>
  <!-- 主要容器，包含在线信息、项目信息和测试报告三个部分 -->
  <basic-container class="basicContainer">
    <el-form
      :disabled="disabled"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <!-- 在线信息部分 -->
      <p class="table-title">
        <span></span>{{ $t('doorAccessControl.doorInfo') }}
      </p>
      <br><br>
      <!-- 表单，用于收集申请门禁的相关信息 -->
      <!-- 变更类型选择 -->
      <el-form-item :label="$t('doorAccessControl.changeType')" prop="isLongTerm" class="full-width-item">
        <el-radio-group v-model="form.isLongTerm">
          <el-radio :label="1">{{ $t('doorAccessControl.longTerm') }}</el-radio>
          <el-radio :label="0">{{ $t('doorAccessControl.shortTerm') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 短期计划开始时间选择 -->
      <el-form-item v-if="form.isLongTerm === 0" :label="$t('doorAccessControl.planStartTime')"
                    prop="planStartTime" class="full-width-item">
        <el-date-picker
          v-model="form.planStartTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('doorAccessControl.pleaseSelect') + $t('appOnline.planStartTime')"
        />
      </el-form-item>
      <!-- 短期计划结束时间选择 -->
      <el-form-item v-if="form.isLongTerm === 0" :label="$t('doorAccessControl.planEndTime')"
                    prop="planEndTime" class="full-width-item">
        <el-date-picker
          v-model="form.planEndTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('doorAccessControl.pleaseSelect') + $t('appOnline.planEndTime')"
        />
      </el-form-item>
      <!-- 选择申请区域 -->
      <el-form-item :label="$t('doorAccessControl.pleaseSelect') + $t('doorAccessControl.doorArea')"
                    class="full-width-item" v-if="!disabled">
        <el-radio-group v-model="form.changeArea" @change="handleRegionChange" prop="changeArea">
          <el-radio :label="0">{{ $t('doorAccessControl.publicArea') }}</el-radio>
          <el-radio :label="6">{{ $t('doorAccessControl.intelligentHardware') }}</el-radio>
          <el-radio :label="7">{{ $t('doorAccessControl.intelligentTesting') }}</el-radio>
          <el-radio :label="8">{{ $t('doorAccessControl.comprehensiveManagement') }}</el-radio>
          <el-radio :label="9">{{ $t('doorAccessControl.deputyGeneralManager') }}</el-radio>
          <el-radio :label="10">{{ $t('doorAccessControl.generalManager') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!disabled" :label="$t('doorAccessControl.pleaseSelect') + $t('doorAccessControl.doorName')" prop="doorNames">
        <el-select v-model="form.doorNames" multiple
                   :placeholder="$t('doorAccessControl.pleaseSelect') + $t('doorAccessControl.doorName')">
          <el-option v-for="door in filteredDoors" :key="door.dictValue" :label="door.dictValue"
                     :value="door.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 遍历 doorNames 数组，逐个显示 -->
      <el-form-item :label="$t('doorAccessControl.selectedDoorName')" prop="doorNames"
                    class="full-width-item">
        <div
          v-for="(name, index) in form.doorNames"
          :key="index"
          class="door-name-item"
        >
          {{ name }}
        </div>
        <!-- 空状态兜底 -->
        <div
          v-if="form.doorNames.length === 0"
          class="door-name-empty"
        >
          {{ $t('doorAccessControl.noDoorNames') }}
        </div>
      </el-form-item>
      <!-- 变更原因输入 -->
      <el-form-item :label="$t('doorAccessControl.changeReason')" prop="changeReason" class="full-width-item">
        <el-input v-model="form.changeReason" type="textarea"/>
      </el-form-item>
<!--      <el-form-item :label="$t('doorAccessControl.remark')" prop="remark" class="full-width-item">-->
<!--        <el-input v-model="form.remark" type="textarea"/>-->
<!--      </el-form-item>-->
    </el-form>
  </basic-container>
</template>

<script>
import {getDetail, getDoorList} from "@/api/doorAccessControlApply/index";

export default {
  // 数据定义
  data() {
    return {
      // 表单数据模型
      form: {
        doorNames: [], // '门禁名称',
        changeArea: 0, // '更改类型',
        changeReason: '', // '更改原因',
        isLongTerm: 1, //'是否长期',
        planStartTime: '', // '开始时间',
        planEndTime: '', // '结束日期',
        remark: '', // '备注',
      },
      businessId: null, // 业务ID
      taskId: null,
      isEdit: false, // 是否编辑模式
      isHistory: false, // 是否显示历史记录
      // doorIds: [],
      doorList: [],
      // 表单验证规则
      rules: {
        doorNames: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.doorNames.length <= 0) {
                if (!value) {
                  callback(new Error(this.$t('doorAccessControl.pleaseSelect') + this.$t('doorAccessControl.doorName')));
                } else {
                  callback();
                }
              } else {
                // 不满足条件时直接校验通过
                callback();
              }
            },
            trigger: ['change']
          }
        ],
        changeReason: [{
          required: true,
          message: this.$t('doorAccessControl.pleaseSelect') + this.$t('doorAccessControl.changeReason'),
          trigger: ['blur', 'change']
        }],
        planStartTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.isLongTerm === "1") {
                if (!value) {
                  callback(new Error(this.$t('doorAccessControl.pleaseInput') + this.$t('doorAccessControl.planStartTimeRequired')));
                } else {
                  callback();
                }
              } else {
                // 不满足条件时直接校验通过
                callback();
              }
            },
            trigger: ['change']
          }
        ],
        planEndTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.isLongTerm === "1") {
                if (!value) {
                  callback(new Error(this.$t('doorAccessControl.pleaseInput') + this.$t('doorAccessControl.planEndTimeRequired')));
                } else {
                  callback();
                }
              } else {
                // 不满足条件时直接校验通过
                callback();
              }
            },
            trigger: ['change']
          }
        ],
      },
    };
  },
  // 组件创建时执行
  created() {
    // 从路由获取业务ID和编辑状态
    this.businessId = this.$route.query.businessId;
    // this.taskId = this.$route.query.taskId;
    this.isEdit = this.$route.query.isEdit;
    // 如果有业务ID，获取详细信息
    if (this.businessId) {
      this.getDetail();
    }
    // 获取项目列表
    if(!this.businessId || this.isEdit){
      this.fetchDoorList();
    }
  },
  // 计算属性
  computed: {
    // 表单是否禁用
    disabled() {
      // 存在业务ID且不是编辑状态
      return this.businessId && !this.isEdit;
    },
    filteredDoors() {
      if (this.form.changeArea === null) return [];
      return this.doorList.filter(door => {
        const dictKey = parseInt(door.dictKey, 10);
        const region = dictKey !== null ? Math.floor(dictKey / 100) : 0;
        return region === this.form.changeArea;
      });
    },
  },
  // 方法定义
  methods: {
    // 获取详细信息
    async getDetail() {
      try {
        const res = await getDetail(this.businessId);
        if (res.data.code === 200) {
          this.form = {
            ...this.form,
            ...res.data.data,
          };
          // 触发获取表单数据事件
          this.$emit("getFormData", this.form);
        }
      } catch (error) {
        console.error("获取详情失败:", error);
      }
    },
    // 获取门禁列表
    async fetchDoorList() {
      try {
        const res = await getDoorList();
        this.doorList = res.data.data;
        // this.doors = [...new Set(this.doorList.map(item => item.dictValue))];
      } catch (error) {
        console.error("获取项目列表失败:", error);
      }
    },
    //
    handleRegionChange() {
      this.form.doorNames = [];
    },
    // 验证表单
    async testForm() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) {
          this.$message.error(this.$t('doorAccessControl.pleaseFillInRequiredFields'));
        }
        return valid;
      } catch (error) {
        this.$message.error(this.$t('doorAccessControl.pleaseFillInRequiredFields'));
        return false;
      }
    },
  }
};
</script>

<!--</style>-->
<style lang="scss" scoped>

.el-form {
  display: flex;
  flex-wrap: wrap;
}

.el-form-item {
  width: 100%;
}

@media (min-width: 768px) {
  /* 除了标记为full-width-item的项目外，其他项目都设置为48%宽度 */
  .el-form-item:not(.full-width-item) {
    width: calc(50% - 5px);
  }

  /* 全宽项目 */
  .el-form-item.full-width-item {
    flex-basis: calc(100% - 10px); /* 宽度占满整行 */
    margin-right: 0;
  }

  /* 特殊处理包含textarea的项目 */
  .el-form-item:has(textarea) {
    width: calc(100% - 10px) !important;
  }
}

@media (max-width: 767px) {
  .el-radio {
    margin-top: 4px; /* 增加下外边距，可根据需要调整数值（如 15px、20px 等） */
    margin-bottom: 4px; /* 增加下外边距，可根据需要调整数值（如 15px、20px 等） */
  }
}

.door-name-item {
  margin-bottom: 4px; /* 每个元素之间留间距 */
  //color: #606266; /* 文字灰色，与表单风格统一 */
  //font-weight: bold;
  color: blue;
  margin-left: 10px;
}



.table-title {
  width: calc(100% - 10px)
}

.button-bottom {
  width: 100%;
  text-align: center;
}

</style>
