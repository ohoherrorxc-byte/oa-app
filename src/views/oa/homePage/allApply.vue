<template>
  <div class="all-apply mtr25 mbr15">
    <p class="title-apply">全部应用</p>
    <el-row :gutter="22" class="plr25 prr25 pbr20">
      <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center">
          <img class="icon-svg mrr15" src="./svg/ico_ kaoqin.svg" />考勤管理
        </p>
      </el-col>
      <el-col :span="6" class="pointer" >
        <p class="list-apply flex flex-center" @click="toApprove">
          <img class="icon-svg mrr15" src="./svg/ico_ oasp.svg" />OA审批
        </p>
      </el-col>
      <!-- <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center">
          <img class="icon-svg mrr15" src="./svg/ico_ sbgl.svg" />设备管理
        </p>
      </el-col> -->
      <!-- <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center" @click="toPerson">
          <img class="icon-svg mrr15" src="./svg/ico_ rygl.svg" />人员管理
        </p>
      </el-col> -->
      <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center" @click="toSetCenter">
          <img class="icon-svg mrr15" src="./svg/ico_ settings.svg" />设置中心
        </p>
      </el-col>
      <!-- <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center">
          <img class="icon-svg mrr15" src="./svg/ico_ qxgl.svg" />权限管理
        </p>
      </el-col> -->
      <!-- <el-col :span="6">
        <p class="list-apply flex flex-center">
          <img class="icon-svg mrr15" src="./svg/ico_ kaoqin.svg" />审计管理
        </p>
      </el-col> -->
      <!-- <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center">
          <img class="icon-svg mrr15" src="./svg/ico_ htqz.svg" />合同签章
        </p>
      </el-col> -->
      <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center" @click="toPhotoWall">
          <img class="icon-svg mrr15" src="./svg/ico_zpq.svg" />照片墙
        </p>
      </el-col>
      <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center" @click="toMyMeeting">
          <img class="icon-svg mrr15" src="./svg/ico_huiyi.svg" />我的会议
        </p>
      </el-col>
      <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center" @click="toSchedule">
          <img class="icon-svg mrr15" src="./svg/ico_wdxc.svg" />我的日程
        </p>
      </el-col>
      <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center" @click="toAddress">
          <img class="icon-svg mrr15" src="./svg/ico_txl.svg" />通讯录
        </p>
      </el-col>
      <el-col :span="6" class="pointer">
        <p class="list-apply flex flex-center" @click="toOrganizationalStructure">
          <img class="icon-svg mrr15" src="./svg/ico_zzjg.svg" />组织架构
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toPerson(){
      this.$router.push("/oa/addressBook/index");
    },
    toSetCenter(){
      this.$router.push("/info/index");
    },
    toApprove(){
      this.$router.push("/oa/myFlow/index");
    },
    toPhotoWall() {
      this.$router.push("/oa/photoWall/index");
    },
    toMyMeeting(){
      this.$router.push("/oa/myMeeting/index");
    },
    toSchedule(){
      this.$router.push("/oa/mySchedule/index");
    },
    toAddress(){
      this.$router.push('/oa/addressBook/index')
    },
    toOrganizationalStructure(){
      this.$router.push('/oa/organizationalStructure/index')
    }
  },
};
</script>

<style scoped lang="scss">
.all-apply {
  background: #fff;

  .title-apply {
    padding: 0.15rem 0.27rem;
    color: #222b45;
    font-size: 0.26rem;
    font-weight: 600;
  }

  .list-apply {
    border: 1px solid #ced3de;
    border-radius: 4px;
    padding: 0.15rem 0.2rem;
    margin-bottom: 0.18rem;

    .icon-svg {
      width: 0.42rem;
      height: 0.42rem;
    }
  }
}
</style>