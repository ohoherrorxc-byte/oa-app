<template>
  <div class="all-apply mr25 mbr15">
    <p class="title-apply">{{ $t('homePage.allApplications') }}</p>
    <el-carousel height="5.5rem">
      <el-carousel-item>
        <el-row :gutter="22" class="plr25 prr25 pbr20 flex-wrap">
          <el-col v-for="item in localizedList" style="width: 25%;" class="pointer">
            <p class="list-apply " @click="toCheck(item)">
              <img class="icon-svg mrr15" :src="item.icon" />
              <div class="title" v-html="item.name"></div>
            </p>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item>
        <el-row :gutter="22" class="plr25 prr25 pbr20 flex-wrap">
          <el-col v-for="item in localizedListTwo" style="width: 25%;" class="pointer">
            <p class="list-apply " @click="toCheck(item)">
              <img class="icon-svg mrr15" :src="item.icon" />
              <div class="title" v-html="item.name"></div>
            </p>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: "PMS",
          icon: require("@/assets/svg/apply/pms.svg"),
          url: 'https://pms.soimt.cn/KPMS/login.aspx',
          imgUrl: null
        },
        {
          name: "Devops",
          icon: require("@/assets/svg/apply/devops.svg"),
          url: 'https://dev.azure.com/saic-iov',
          imgUrl: null
        },
        {
          name: "Jfrog",
          icon: require("@/assets/svg/apply/Jfrog.svg"),
          url: 'https://jfrog.soimt.intra/artifactory/',
          imgUrl: null
        },
        {
          name: "测试平台",
          icon: require("@/assets/svg/apply/test.svg"),
          // url: 'https://test-monitor.soimt.intra/backend/avn',
          url: "https://test-monitor.soimt.cn:3001/backend/avn",
          imgUrl: null
        },
        {
          name: "蓝湖",
          icon: require("@/assets/svg/apply/lanhu.svg"),
          url: 'https://lanhuapp.com/sso/?source=official&utm_msg=%7B%7D&redirect_to=https%3A%2F%2Flanhuapp.com%2Fdashboard%2F%3Ffrom%3Dofficial%26isPhone%3D0%26to%3D#/main/home',
          imgUrl: null
        },
        {
          name: "gitlab",
          icon: require("@/assets/svg/apply/gitee.svg"),
          url: 'https://www.soimt.intra/users/sign_in',
          imgUrl: null
        },
        {
          name: "统一身份认证",
          icon: require("@/assets/png/anthor.png"),
          url: 'https://idm-pv.saicmotor.com/apphub/',
          imgUrl: null
        },
        {
          name: "上汽同行",
          icon: require("@/assets/png/saic_tongxin.png"),
          url: 'http://tongxing-pv.saicmotor.com/',
          imgUrl: null
        },
        {
          name: "文言库",
          icon: require("@/assets/svg/apply/book.svg"),
          url: 'https://tiov-terminology.soimt.com/',
          imgUrl: null
        },
        {
          name: "华为云",
          icon: require("@/assets/png/huaweiyun.png"),
          url: 'https://cn.myhuaweicloud-koodrive.com/cloudfile/index.html#/home',
          imgUrl: null
        },
        {
          name: "运营平台海外",
          icon: require("@/assets/png/guoji.png"),
          url: 'https://web-operations-ui.soimt.com/',
          imgUrl: null
        }, {
          name: "运营平台国内",
          icon: require("@/assets/png/yunwei.png"),
          url: 'https://web-operations-ui.soimt.intra',
          imgUrl: null
        },
        {
          name: "车型图资平台",
          icon: require("@/assets/svg/MG.svg"),
          url: 'https://store-ttpp.mgthai.com/gallery/manager',
          imgUrl: null
        },
        {
          name: "mobile_app",
          icon: require("@/assets/png/mobile_app.png"),
          url: '/oa/#/app_download',
          imgUrl: null
        },
      ],
      list2: [
        {
          name: "用户手册库",
          icon: require("@/assets/svg/apply/contacts.svg"),
          url: 'http://10.30.4.61:31434/#/login',
          imgUrl: null
        },
        {
          name: "Nextcloud",
          icon: require("@/assets/svg/apply/nextcloud.svg"),
          url: 'http://nextcloud.soimt.intra:8090/index.php/login',
          imgUrl: null
        }, {
          name: "海外出行wiki",
          icon: require("@/assets/svg/apply/wiki.svg"),
          url: 'https://wiki.soimt.intra/',
          imgUrl: null
        },
        {
          name: "Jenkins_Sl(VDI)",
          icon: require("@/assets/svg/apply/jenkins.svg"),
          url: 'https://jenkins-si.soimt.intra',
          imgUrl: null
        },
        {
          name: "Gerrit(VDI)",
          icon: require("@/assets/png/gerrit.png"),
          url: 'https://gerrit.soimt.intra',
          imgUrl: null
        },
      ]
    };
  },
  computed: {
    localizedList() {
      return this.list.map(item => ({
        ...item,
        name: this.$t(`homePage.applications.${item.name}`)
      }))
    },
    localizedListTwo() {
      return this.list2.map(item => ({
        ...item,
        name: this.$t(`homePage.applications.${item.name}`)
      }))
    }
  },
  mounted() {
    this.list.map(ele => {
      ele.imgUrl = require(ele.icon)
    })
  },
  methods: {
    toCheck(item) {
      if (item.url) {
        window.open(item.url)
      }
    }
  },
};
</script>

<style scoped lang="scss">
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

.all-apply {
  background: #fff;
  height: 6rem;
}

.title-apply {
  padding: 0.27rem 0.27rem;
  color: #222b45;
  font-size: 0.26rem;
  font-weight: 600;
}

.pointer {
  text-align: center;
  padding-bottom: 0.2rem;
}

.title {
  font-size: 0.15rem;
  margin-top: 0.1rem
}

.list-apply {
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 0.7rem;
  height: 0.7rem;
  text-align: center;
  margin-left: 0.15rem;
}
</style>
