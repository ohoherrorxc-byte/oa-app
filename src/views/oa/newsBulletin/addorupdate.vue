<template>
  <basic-container>
    <el-page-header @back="goBack" :content="navName">
    </el-page-header>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:20px">
      <el-tab-pane :label="$t('newsBulletin.edit')" name="first">
        <avue-form :option="option" :table-loading="loading" :data="data" v-model="form" @submit="handleSubmit">
          <template slot="fileList">
            <upload :fileList="form.fileList" btnName="上传" @handleRequest="handleRequest" :multiple="true"
              :showFileList="true"></upload>
          </template>
        </avue-form>
      </el-tab-pane>

      <el-tab-pane :label="$t('newsBulletin.fileList')" name="second">
        <el-table :data="fileData" style="width: 100%">
          <el-table-column prop="name" :label="$t('newsBulletin.fileName')">
          </el-table-column>
          <!-- <el-table-column prop="fileSize" label="附件大小">
          </el-table-column> -->
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button type="danger" @click="handleDelete(scope.row)">{{$t('newsBulletin.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
  import newsApi from '@/api/newsBulletin/index'
  import upload from "@/components/upload/index";
  export default {
    components: {
      upload
    },
    data() {
      return {
        Id: "",
        form: {},
        navName: this.$t('newsBulletin.add'),
        documentType: "21312",
        activeName: "first",
        fileData: [],
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        selectionList: [],
        option: {
          column: [{
              label: this.$t('newsBulletin.documentTitle'),
              labelWidth: 100,
              prop: "title",
              span: 12,
              search: true,
              rules: [{
                required: true,
                message: this.$t('newsBulletin.pleaseInputDocumentTitle'),
                trigger: "blur",
              }],
            },
            {
              label: this.$t('newsBulletin.documentType'),
              labelWidth: 100,
              span: 12,
              prop: 'newsType',
              type: 'select',
              dicData: [{
                label: '公司新闻',
                value: '公司新闻'
              }, {
                label: '通知公告',
                value: '通知公告',
              }, {
                label: '公司制度',
                value: '公司制度',
              }, {
                label: '系统帮助',
                value: '系统帮助',
              }],
              value: "",
              rules: [{
                required: true,
                message: this.$t('newsBulletin.pleaseSelectDocumentType'),
                trigger: "blur",
              }],
            },
            {
              label: this.$t('newsBulletin.publisher'),
              labelWidth: 100,
              prop: "userName",
              span: 12,
              rules: [{
                required: true,
                message: this.$t('newsBulletin.pleaseInputPublisher'),
                trigger: "blur",
              }],
            },
            {
              label: this.$t('newsBulletin.publishTime'),
              labelWidth: 100,
              prop: "useTime",
              span: 12,
              type: "datetime",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              rules: [{
                required: true,
                message: this.$t('newsBulletin.pleaseSelectPublishTime'),
                trigger: "blur",
              }],
            },
            {
              label: this.$t('newsBulletin.newsType'),
              labelWidth: 100,
              span: 12,
              prop: "newtype",
              readonly: true,
              value: "文档",
            },
            {
              label: this.$t('newsBulletin.documentDirectory'),
              labelWidth: 100,
              prop: "document",
              readonly: true,
              value: "",
            },
            {
              label: this.$t('newsBulletin.documentStatus'),
              labelWidth: 100,
              span: 12,
              prop: "status",
              value: "正常",
            },
            {
              label: this.$t('newsBulletin.mainDocument'),
              labelWidth: 100,
              span: 12,
              prop: "mainFile",
              readonly: true,
              value: "当前文档",
            },
            {
              label: this.$t('newsBulletin.documentContent'),
              labelWidth: 100,
              prop: "content",
              component: "AvueUeditor",
              options: {
                action: "/api/oa-resource/oss/endpoint/put-file-attach-by-name",
                props: {
                  res: "data",
                  url: "domain",
                },
              },
              hide: true,
              minRows: 6,
              span: 24,
              // rules: [{
              //   required: true,
              //   message: "请输入文档内容",
              //   trigger: "blur",
              // }, ],
            },
            {
              label: this.$t('newsBulletin.attachmentUpload'),
              prop: 'fileList',
              type: 'upload',
              // listType: 'picture-card',
              span: 24,
              propsHttp: {
                res: 'data'
              },
              action: '/api/oa-resource/oss/endpoint/put-file-attach-by-name'
            },
            {
              label: this.$t('newsBulletin.isSaveAsDraft'),
              labelWidth: 100,
              prop: 'newsStatus',
              type: 'radio',
              dicData: [{
                label: '是',
                value: '0'
              }, {
                label: '否',
                value: '1',
              }],
              value: '1',
            },

          ],
        },
        data: [],
        content: "",
      };
    },
    methods: {
      replaceImgSrcIfContains(htmlContent, oldSrcSubstring, newSrc) {
        console.log('new', newSrc);
        console.log('old', oldSrcSubstring);
        let questionMarkIndex = newSrc.indexOf("?"); // 找到"?"的位置
        // 使用substring()方法
        let subStrWithSubstring = newSrc.substring(questionMarkIndex + 1); // 从"?"之后开始截取

        let url = oldSrcSubstring + "?" + subStrWithSubstring;

        // 正则表达式匹配img标签的src属性，并捕获其值
        var imgSrcRegex = /<img\s+[^>]*src=["\']([^"'>]+)["\'][^>]*>/gi;
        var newHtmlContent = htmlContent.replace(imgSrcRegex, function(match, p1) {
          // 如果捕获的src值包含要查询的oldSrcSubstring，则替换为新的src值
          if (p1.includes(oldSrcSubstring)) {
            // 替换整个src属性值，而不仅仅是包含的子字符串
            match = match.replace(new RegExp('src=["\']', 'gi'), 'src="' +
              url + '"');
            return match;
          }
          return match; // 如果没有包含，则保留原始匹配项
        });
        return newHtmlContent;
      },
      extractImages(htmlString) {
        // 创建一个新的 div 元素作为容器
        var tempDiv = document.createElement("div");

        // 设置其innerHTML为传入的htmlString
        tempDiv.innerHTML = htmlString;

        // 使用querySelectorAll选择所有的img元素
        var images = tempDiv.querySelectorAll("img");

        // 创建一个数组来保存提取的src属性值
        var srcs = [];

        // 遍历所有的img元素，并将其src属性值添加到数组中
        for (var i = 0; i < images.length; i++) {
          var index = images[i].src.indexOf('?');
          if (index !== -1) {
            images[i].src = images[i].src.substring(0, index);
          }
          // srcs.push(images[i].src);
          let arr = {
            url: images[i].src,
            originalUrl: images[i].src,
          };

          srcs.push(arr);
        }
        // 返回包含所有img标签HTML的数组
        console.log(srcs);
        this.form.photoList = srcs;
      },
      handleRequest(data,arr) {
        this.form.fileList = arr
      },
      async handleSubmit(formData) {
        // formData 是表单提交的数据
        let dataToSubmit = formData;
        delete dataToSubmit.status;
        delete dataToSubmit.imgUrl;
        delete dataToSubmit.mainFile;
        delete dataToSubmit.document;
        delete dataToSubmit.newtype;

        if (this.Id != "") {
          dataToSubmit.id = this.Id;
        }
        this.extractImages(dataToSubmit.content);
        dataToSubmit.fileList = [...this.form.fileList, ...this.fileData];
        dataToSubmit.photoList = this.form.photoList;
        console.log(dataToSubmit, 888888);
        let result = await newsApi.Save(dataToSubmit);
        console.log(result.data);
        if (result.data.success) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          const name = this.$route.query.name;
          this.$router.push({
            path: '/newsBulletin/list',
            query: {
              newsType: name
            }
          });
        } else {
          this.$message.error('保存失败');
        }
      },
      submitToServer(formData) {
        // 发送 formData 到后端
        // 使用 axios 或其他 HTTP 客户端发送请求
      },
      getData() {
        const row = this.$route.query.row;
        const name = this.$route.query.name;

        this.option.column[1].value = name;

        console.log(row, 9999);
        if (row != undefined) {
          this.navName = this.$t('newsBulletin.edit');
          this.option.column[5].value = "公司新闻/" + this.$route.query.name;
          this.option.column[0].value = row.title;
          this.option.column[1].value = row.newsType;
          this.option.column[2].value = row.userName;
          this.option.column[3].value = row.useTime;
          //this.option.column[8].value = row.content;
          this.option.column[10].value = (row.newsStatus||"").toString();
          this.Id = row.id;
          this.GetFileList(row.id);
        }
      },
      async GetFileList(id) {
        let ArrUrl = [];
        let res = await newsApi.Info({
          id: id
        });
        if (res.data.code === 0) {
          this.fileData = res.data.data.fileList;
          ArrUrl = res.data.data.photoList;
          if (ArrUrl.length > 0) {
            for (var i = 0; i < ArrUrl.length; i++) {
              this.form.content = this.replaceImgSrcIfContains(res.data.data.content, ArrUrl[i]
                .originalUrl,
                ArrUrl[
                  i].url);
            }
          } else {
            this.form.content = res.data.data.content;
          }
        }
      },
      goBack() { //返回上一级菜单
        this.$router.go(-1);
      },
      handleDelete(row) { //删除附件
        console.log(row, "删除附件");
        this.fileData = this.fileData.filter(item => item.id !== row.id);
      }
    },
    mounted() {
      // this.option.column[1].dicData = newTypeList;
      this.option.column[5].value = "公司新闻/" + this.$route.query.name;

      this.getData();

    }
  };
</script>

<style>
  /* .w-e-menu {
    width: 70px !important;
  } */
  ._wangEditor_btn_sourcecode {
    display: none;
  }

  ._wangEditor_btn_fullscreen {
    width: 40px !important;
  }
</style>

<style scoped>
  .el-form-item__label {
    width: 100px !important;
  }

  .el-table .el-button {
    padding: 7px 15px;
  }
</style>
