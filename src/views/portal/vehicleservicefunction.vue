<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               :before-close="beforeClose"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad"
               @tree-load="treeLoad">
      <div slot="menu" slot-scope="{size,type,row,index}">
        <el-button :type="type" icon="el-icon-view" :size="size" :hidden="row.id !== row.funcCodeNum" @click="$refs.crud.rowView(row,index)">View</el-button>
        <el-button :type="type" icon="el-icon-edit" :size="size" :hidden="row.id !== row.funcCodeNum" @click="$refs.crud.rowEdit(row,index)">Edit</el-button>
        <el-button :type="type" icon="el-icon-delete" :size="size" :hidden="row.id !== row.funcCodeNum" @click="$refs.crud.rowDel(row,index)">Delete</el-button>
      </div>
      <template slot="menuLeft">
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   v-if="userInfo.role_name.includes('admin')"
                   plain
                   @click="handleDelete">Delete
        </el-button>
        <el-button type="warning"
                   size="mini"
                   plain
                   v-if="userInfo.role_name.includes('admin')"
                   icon="el-icon-download"
                   @click="handleExport">Export
        </el-button>
      </template>
      <template slot-scope="scope" slot="imageUrlForm">
        <el-upload
          class="upload-demo"
          action="fakeaction"
          :file-list="form.imageUrls"
          :limit="1"
          :disabled="scope.type === 'view' "
          :on-exceed="uploadExceed"
          :http-request="uploadAppFile"
          :before-upload="checkFileType"
          list-type="picture">
          <el-button v-show="UploadShowFlag" size="mini" type="primary">Click Upload</el-button>
<!--          <i v-show="UploadShowFlag" style="margin-left: 20px" slot="tip" class="el-upload__tip">(Only png/tiff files can be uploaded, and it does not exceed 5M)</i>-->
        </el-upload>
      </template>
      <template slot-scope="scope" slot="funImageUrlForm">
        <el-upload
          class="upload-demo"
          action="fakeaction"
          :file-list="scope.row.funImageUrls"
          :limit="1"
          :disabled="scope.type === 'view' "
          :on-exceed="uploadExceed"
          :before-upload="checkFileType"
          :http-request="(file)=>{return uploadFunctionFile(file ,scope.row)}"
          list-type="picture">
          <el-button v-show="UploadShowFlag" size="mini" type="primary">Click Upload</el-button>
<!--          <i v-show="UploadShowFlag" slot="tip" style="margin-left: 20px" class="el-upload__tip">(only png/tiff files can be uploaded, and it does not exceed 5M)</i>-->
        </el-upload>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {functionList ,save,remove,removeFunction ,update ,serviceFunupload  } from "@/api/portal/vehicleservicefunction";
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        UploadShowFlag: false,
        functionCodeNumFlag: false,
        option: {
          dialogDrag:false, //点击新增或则编辑即可拖动表单
          title:'',
          titleSize:'h2',
          // dateBtn:true, //日期组件
          stripe:true, //边框 默认情况下，是不具有行彩色条纹的，如果需要，可以使用stripe属性，它接受一个Boolean，设置为true即可启用。
          card:true,
          size:"mini",
          lazy: true,
          rowKey:'id',
          tip: false,
          simplePage: false, //赋值page的total总条数即可,如果total为0的话，或者simplePage为true只有1页的时候，分页选择器会隐藏
          searchShow: true,
          searchMenuSpan: 6,
          searchSpan:6,
          addBtn: true,
          // tree: true,
          border: true,
          index: false,
          selection: true,
          menuWidth: 300,
          menuTitle: "Operation",
          dialogWidth:880,
          dialogClickModal: false,
          emptyText: "No data",
          column: [
            {
              searchLabelWidth:130,
              label: "FuncCodeNum", //应用为id,功能为funcCodeNum
              prop: 'funcCodeNum',
              id:'funcCodeNum',
              search: true,
              display: false,
              placeholder:' ',
              size: 'mini'
            },
            {
              label: "Function Name", //应用为applicationName,功能为functionName
              prop: "functionName",
              display: false
            },
            {
              label: "DisplayName", //应用为displayName , 功能为description
              prop: "description",
              display: false
            }
          ],
          group: [
            {
              label: 'Service Application Info',
              prop: 'applicationInfo',
              icon: 'el-icon-s-order',
              column: [
                {
                  label: "Application Number",
                  prop: "id",
                  display: false,
                  labelWidth: 150,
                },
                {
                  label: "Application Name",
                  prop: "applicationName",
                  disabled: false,
                  rules: [{
                    required: true,
                    message: "Please input application Name",
                    trigger: "blur"
                  },
                    {
                      max: 50,
                      message: 'Length exceeds the limit of 50'
                    }],
                  span: 24,
                  labelWidth: 150,
                },
                {
                  label: "Apk Name",
                  prop: "packageName",
                  disabled: false,
                  labelWidth: 150,
                  span: 24,
                  rules: [
                    {
                      max: 50,
                      message: 'Length exceeds the limit of 50'
                    }],
                },
                {
                  label: "Display Name",
                  prop: "description",
                  disabled: false,
                  labelWidth: 150,
                  span: 24,
                  rules: [
                    {
                      max: 50,
                      message: 'Length exceeds the limit of 50'
                    }],
                },
                {
                  label: "Application Type",
                  prop: "type",
                  disabled: false,
                  labelWidth: 150,
                  span: 24,
                  type: 'select',
                  dicData:[{
                    label:'AVN',
                    value:1
                  },{
                    label:'APP',
                    value:2
                  },{
                    label:'ALL',
                    value:3
                  }],
                },
                {
                  label: 'Icon Image',
                  prop: 'imageUrl',
                  disabled: false,
                  span: 24,
                  formslot: true,
                  labelWidth: 150,
                }
              ]
            },
            {
              label: 'Service Function Info',
              prop: 'form',
              icon: 'el-icon-s-tools',
              column: [
                {
                  label: '',
                  prop: 'functionList',
                  type: 'dynamic',
                  gutter: 0,
                  span:24,
                  children:{
                    index: false, //配置type为form类型即可转化为表单格式，配置index为false即可隐藏序号
                    type:'form',
                    rowAddBtnText:'add function',
                    rowAdd:(done)=>{
                      // this.$message.success('新增回调');
                      done({
                        input:'The default value'
                      });
                    },
                    rowDel:(row,done)=>{
                      //功能ID不为空时,调用后台逻辑删除接口
                      if(row.id !== ''){
                        this.$confirm("Are you sure you'll delete this function?", {
                          confirmButtonText: "Confirm", cancelButtonText: "Cancel", type: "warning"
                        })
                          .then(() => {
                            if(removeFunction(row.id)){
                              this.$message({ type: "success", message: "This function deleted succeeded!"});
                              done();
                            }
                          });
                      }else{
                        done();
                      }

                    },
                    column:[

                      {
                        label: "Function Number",
                        prop: "id",
                        display: false
                      },
                      {
                        label: "Function CodeNum",
                        prop: "functionCodeNum",
                        span: 24,
                        placeholder: 'The system generates automatically',
                        disabled: true,
                        labelWidth: 140,
                      },
                      {
                        label: "Function Code",
                        prop: "functionCode",
                        span: 24,
                        labelWidth: 140,
                        rules: [{
                          required: true,
                          message: "Please input function code",
                          trigger: "blur"
                        },{
                          max: 50,
                          message: 'Length exceeds the limit of 50'
                        }],
                      },
                      {
                        label: "Function Name",
                        prop: "functionName",
                        labelWidth: 140,
                        span: 24,
                        rules: [{
                          required: true,
                          message: "Please input function name",
                          trigger: "blur"
                        },
                          {
                            max: 50,
                            message: 'Length exceeds the limit of 50'
                          }],
                      },
                      {
                        label: "Local Name ",
                        prop: "functionNameLocal",
                        labelWidth: 140,
                        span: 24,
                        rules: [{
                          required: true,
                          message: "Please input local name ",
                          trigger: "blur"
                        },
                          {
                            max: 50,
                            message: 'Length exceeds the limit of 50'
                          }],
                      },

                      {
                        label: "Display Name",
                        prop: "description",
                        span: 24,
                        labelWidth: 140,
                        rules: [
                          {
                            max: 50,
                            message: 'Length exceeds the limit of 50'
                          }],
                      },
                      {
                        label: "Function Type",
                        prop: "type",
                        disabled: false,
                        labelWidth: 140,
                        span: 24,
                        type: 'select',
                        dicData:[{
                          label:'AVN',
                          value:1
                        },{
                          label:'APP',
                          value:2
                        },{
                          label:'ALL',
                          value:3
                        }],
                      },
                      {
                          label: 'Icon Image',
                          prop: 'funImageUrl',
                          span: 24,
                          labelWidth: 140,
                          formslot: true,
                      }
                    ]
                  }
                }
              ]
            }
          ]
        },
        data: [],
      };
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["userInfo", "permission"]),
      permissionList() {
        return {
          addBtn: true,
          viewBtn: false,
          delBtn: false,
          editBtn: false,
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      initData() {
      },
      handleAdd() {
      },
      rowSave(row, done,loading) {
        save(row).then((res) => {
          if(res.data.success){
            this.$message({type: "success", message: "The new service was successfully applied!"});
            done();
            this.onLoad(this.page, this.query);
          }else{
            this.$message({type: "error", message: res.data.msg});
          }
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowUpdate(row, index, done,loading) {
        update(row).then(() => {
          this.$message({type: "success", message: "The operation succeeded!"});
          // 数据回调进行刷新
          done();
          this.onLoad(this.page, this.query);
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowDel(row, index, done) {
        this.$confirm("Are you sure you'll choose data deletion?", {
          confirmButtonText: "Confirm", cancelButtonText: "Cancel", type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.$message({ type: "success", message: "The operation succeeded!"});
            // 数据回调进行刷新
            done();
            this.onLoad(this.page, this.query);
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("Please select at least one piece of data");
          return;
        }
        this.$confirm("Are you sure you'll choose data deletion?", {confirmButtonText: "Confirm", cancelButtonText: "Cancel", type: "warning"})
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            // 刷新表格数据并重载
            this.$message({type: "success", message: "The operation succeeded!"});
            this.onLoad(this.page);
          });
      },
      handleExport() {
        var obj= document.getElementById("funcCodeNum").getElementsByTagName('input');
        this.query.funcCodeNum =obj[0].value;
        this.$confirm("Do you want to export Service Function ?", "tip", {confirmButtonText: "Confirm", cancelButtonText: "Cancel", type: "warning"
        }).then(() => {
          let funcCodeNum = this.query.funcCodeNum ===undefined ? '' : this.query.funcCodeNum;

          window.open(`/api/oa-portal/vehicle/service/application/export-applicationInfo?${this.website.tokenHeader}=${getToken()}&funcCodeNum=${funcCodeNum}`);
        });
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      beforeOpen(done, type) {
        if (["add", "edit"].includes(type)) {
          this.UploadShowFlag =true;
        }
        if (["edit", "view"].includes(type)) {
          // getDept(this.form.id).then(res => {
          //   this.form = res.data.data;
          // });
        }
        done();
      },
      beforeClose(done) {
        this.UploadShowFlag =false;
        done();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        functionList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const  data  =res.data.data;
          this.page.total = data.total;
          this.data=data.records;
          //应用列表显示
          this.data=data.records.map(app =>{
            app.funcCodeNum=app.id;
            app.functionName=app.applicationName;
            app.description=app.description;

            //处理图片回显
            //1. applicationInfo
            if(app.imageUrl !== ''){
              const appImageUrl =app.imageUrl;
              const appImageName=app.imageUrl.substring(app.imageUrl.lastIndexOf("/")+1,app.imageUrl.length);
              app.imageUrls=[{ name: appImageName, url: appImageUrl }];
            }
            //2. functionInfo
            if(app.functionList !==undefined){
              app.functionList.map(functionInfo => {
                const funImageUrl =functionInfo.funImageUrl;
                const funImageName=functionInfo.funImageUrl.substring(functionInfo.funImageUrl.lastIndexOf("/")+1,functionInfo.funImageUrl.length);
                functionInfo.funImageUrls=[{ name: funImageName, url: funImageUrl }];
                return  functionInfo;
              });
            }

            return app;
          });
          this.loading = false;
          this.selectionClear();
        });
      },
      treeLoad(tree, treeNode, resolve) {

        if(tree.functionList !== undefined){
          let newList= tree.functionList.map(functionInfo => {
            let funObj ={}
            funObj.id=functionInfo.id;
            funObj.funcCodeNum=functionInfo.functionCodeNum;
            funObj.functionName=functionInfo.functionName;
            funObj.description=functionInfo.description;
            funObj.hasChildren =false;
            return funObj;
          });
          resolve(newList);
        }
      },
      uploadExceed() {
        this.$message.error("You can only upload one file at a time, so please remove it before uploading!");
      },
      checkFileType (file) {
        const isImage = file.type.indexOf("image") != -1;
        if (!isImage) {
          this.$message.error("Please upload the correct image type!");
          return false;
        }
      },
      uploadAppFile(params) {
        const  file =params.file;
        const prefix='app_';
        const  applicationId=this.form.id;
        const  fileName = applicationId === '' ? prefix+file.name : prefix+applicationId+'_1'+".png";
        // const isImage = file.type.indexOf("image") != -1;
        // const  isLt5M = file.size / 1024 / 1024 < 5;
        // if (!isImage) {
        //   this.$message.error("Please upload the correct image type!");
        //   return;
        // }
        // if (!isLt5M) {
        //   this.$message.error("Only images with a size of less than 5M can be uploaded");
        //   return;
        // }
        // 根据后台需求数据格式
        serviceFunupload(fileName , file).then(res => {
          if(res.data.success){
            this.$message.success("The image upload was successful！");
            const appImageUrl=res.data.data.link;
            const appImageName=appImageUrl.substring(appImageUrl.lastIndexOf("/")+1,appImageUrl.length);
            this.form.imageUrl=appImageUrl;
            this.form.imageUrls= [{ name: appImageName, url: appImageUrl }];
          }else {
            this.$message.error(res.data.msg);
          }
        });
      },
      uploadFunctionFile(params, row) {
        const  file =params.file;
        const prefix='fun_';
        const  fileName = row.id === '' ? prefix+file.name : prefix+row.id+'_1'+".png";
        // const isImage = file.type.indexOf("image") != -1;
        // const  isLt5M = file.size / 1024 / 1024 < 5;
        // if (!isImage) {
        //   this.$message.error("Please upload the correct image type!");
        //   return;
        // }
        // if (!isLt5M) {
        //   this.$message.error("Only images with a size of less than 5M can be uploaded");
        //   return;
        // }
        // 根据后台需求数据格式
        serviceFunupload(fileName , file).then(res => {
          if(res.data.success){
            this.$message.success("The image upload was successful！");
            const funImageUrl=res.data.data.link;
            const funImageName=funImageUrl.substring(funImageUrl.lastIndexOf("/")+1,funImageUrl.length);
            row.funImageUrl= res.data.data.link;
            row.funImageUrls= [{ name: funImageName, url: funImageUrl }];
          }else {
            this.$message.error(res.data.msg);
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
 .el-form-item__content {
  margin-left: 0;
}
</style>
