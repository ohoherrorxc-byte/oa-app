<template>
  <basic-container>
  
    <el-timeline :reverse="reverse" >
      <el-timeline-item :key="flow.id" :timestamp="flow.createTime" v-for="flow in flowList" placement="top">
        <el-card shadow="hover">
          <p>{{ $t('flow.timeline.startProcess', { name: flow.assigneeName, time: flow.createTime, activity: flow.historyActivityName }) }}</p>
          <p v-if="flow.historyActivityDurationTime !== ''">{{ $t('flow.timeline.duration', { time: flow.historyActivityDurationTime }) }}</p>
          <p v-if="flow.comment !== ''">{{ $t('flow.timeline.comment', { comment: flow.comment }) }}</p>
          <p v-if="flow.endTime !== ''">{{ $t('flow.timeline.endTime', { time: flow.endTime }) }}</p>
          <p v-if="flow.addApproval">{{ $t('flow.timeline.additionalApprover', { name: flow.addApproval }) }}</p>   
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </basic-container>
</template>

<script>
import { historyFlowList } from '@/api/myFlow/index'
export default {
  data() {
    return {
      reverse: true,
      flowList: []
    };
  },
  mounted() {
    this.getData()
  },
  props: {
    componentTag: {
      type: String
    },
    formData: {
      type: Object,
      default: {}
    },
  },
  watch: {
    formData: {
      handler(newVal, oldVal) {
        // 在user对象发生变化时执行操作
        console.log("formData", newVal, oldVal);
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    async getData() {
      // console.log(this.formData)
      if (this.formData.processInstanceId) {
        let res = await historyFlowList(this.formData.processInstanceId)
        this.flowList = res.data.data
      }
    }
  }
};
</script>

<style lang="scss"></style>