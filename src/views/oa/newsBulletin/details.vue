<template>
  <basic-container>
    <div>
      <el-page-header @back="goBack" :content="$t('newsBulletin.newsDetails')">
      </el-page-header>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <h2>{{ form.title }}</h2>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">{{ $t('newsBulletin.publisher') }}:{{ form.userName }}</div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">{{ $t('newsBulletin.publishTime') }}:{{ form.useTime }}</div>
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('newsBulletin.newsDetails')" name="first">
        <div v-html="form.content">

        </div>
        <footer>
          <div>{{ $t('newsBulletin.lastModifiedTime') }}:{{ form.updateTime }}</div>
        </footer>
      </el-tab-pane>
      <el-tab-pane :label="$t('newsBulletin.attachmentList')" name="second">
        <el-table :data="form.fileList" style="width: 100%">
          <el-table-column prop="name" :label="$t('newsBulletin.fileName')">
            <template slot-scope="scope">
              <a href="#" @click="downloadFile(scope.row)" style="color:blue">{{ scope.row.name }}</a> &nbsp;&nbsp;
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- <div v-if="VisibleSystem">
      <span v-for="item in form.fileList">
        <a href="#" @click="downloadFile(item)" style="color:blue">{{item.name}}</a> &nbsp;&nbsp;
      </span>
    </div> -->
  </basic-container>
</template>

<script>
import newsApi from '@/api/newsBulletin/index'
import {
  downloadFileBlob
} from '@/util/util'
export default {
  data() {
    return {
      activeName: "first",
      fileData: [],
      form: {
        title: "",
        userName: "",
        useTime: "",
        content: "",
        updateTime: "",
        fileList: [],
      },
      VisibleSystem: true,
    };
  },
  created() {

  },
  mounted() {
    const id = this.$route.query.id;
    console.log(id);
    this.GetInfo(id);
  },
  methods: {
    downloadFile(item) {
      try {
        console.log("file.url-->" + item.url);
        downloadFileBlob(item.url, item.name)
      } catch (error) {
        this.$message.error('解析路径失败！');
      }
    },
    goBack() { //返回上一级菜单
      this.$router.go(-1);
    },
    replaceImgSrcIfContains(htmlContent, newListImg) {
      var imgSrcRegex = /<img\s+[^>]*src=["\']([^"'>]+)["\'][^>]*>/gi;
      let arr = []
      htmlContent.replace(imgSrcRegex, function (match, p1) {
        arr.push(p1)
      });
      var newHtmlContent = htmlContent.replace(imgSrcRegex, function (match, p1) {
        arr.map((ele, index) => {
          if (ele === p1) {
            match = match.replace(p1, newListImg[index].url)
          }
        })
        return match
      });
      // console.log(arr)
      return newHtmlContent;
    },
    // replaceImgSrcIfContains(htmlContent, oldSrcSubstring, newSrc) {
    //   console.log('new', newSrc);
    //   console.log('old', oldSrcSubstring);
    //   if(!newSrc)return
    //   let questionMarkIndex = newSrc.indexOf("?"); // 找到"?"的位置
    //   // 使用substring()方法
    //   let subStrWithSubstring = newSrc.substring(questionMarkIndex + 1); // 从"?"之后开始截取

    //   let url = oldSrcSubstring + "?" + subStrWithSubstring;

    //   // 正则表达式匹配img标签的src属性，并捕获其值
    //   var imgSrcRegex = /<img\s+[^>]*src=["\']([^"'>]+)["\'][^>]*>/gi;
    //   var newHtmlContent = htmlContent.replace(imgSrcRegex, function(match, p1) {
    //     // 如果捕获的src值包含要查询的oldSrcSubstring，则替换为新的src值
    //     match = match.replace(new RegExp('src=["\']', 'gi'), 'src="' +
    //         url + '"');
    //       return match;
    //     // if (p1.includes(oldSrcSubstring)) {
    //     //   // 替换整个src属性值，而不仅仅是包含的子字符串

    //     // }
    //     // return match; // 如果没有包含，则保留原始匹配项
    //   });
    //   return newHtmlContent;
    // },
    async GetInfo(id) {
      let res = await newsApi.Info({
        id: id
      });
      if (res.data.code === 0) {

        this.form = res.data.data;
        if (this.form.updateTime == null) {
          this.form.updateTime = this.form.createTime;
        }
        if (this.form.content != null) {
          for (var i = 0; i < this.form.photoList.length; i++) {
            this.form.content = this.replaceImgSrcIfContains(this.form.content, this.form.photoList);
            console.log(this.form.content);
          }

        }

      }

    }

  }
};
</script>

<style></style>

<style scoped>
.el-col {
  line-height: 50px;
}

footer {
  width: 100%;
  text-align: right;
  display: grid;
  place-items: end;
  height: 100px;
}
</style>
