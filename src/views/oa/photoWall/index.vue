<template>
   <basic-container>
      <swiperPhoto ref="swiperPhotoRef" @hideSwiper="hideSwiper" :albumList="albumList" v-show="isSwiper"></swiperPhoto>
      <avue-form :option="option" @submit="handleSubmit" ref="form" v-if="!isSwiper">
         <template slot-scope="{ size }" slot="menuForm">
            <el-button type="primary" :size="size" icon="el-icon-refresh" @click="refresh">{{ $t('commonContent.refresh')
            }}</el-button>
            <el-button type="primary" :size="size" icon="el-icon-plus" @click="createPhoto({}, 'create')">{{
               $t('commonContent.add') }}</el-button>
            <el-button :size="size" @click="handleDeleteData('', 'branchDelete')" icon="el-icon-delete" type="danger"
               plain>
               {{ $t('commonContent.delete') }}
            </el-button>
         </template>
      </avue-form>
      <el-table :data="tableData" ref="multipleTable" v-if="!isSwiper" row-key="id" style="width: 100%; margin-top: 20px"
         stripe align="center" border @selection-change="handleSelectionChange">
         <el-table-column fixed type="selection" :reserve-selection="true" />
         <el-table-column prop="albumName" :label="$t('photoWall.albumName')" align="center" />
         <el-table-column prop="photoNum" :label="$t('photoWall.photoNum')" align="center" />
         <el-table-column prop="createUserName" :label="$t('photoWall.creator')" align="center" />
         <el-table-column prop="createTime" :label="$t('photoWall.createTime')" align="center" />
         <el-table-column fixed="right" :label="$t('commonContent.operation')" width="260" align="center">
            <template slot-scope="scope">
               <el-button @click="toDetail(scope.row, 'edit')" type="text" icon="el-icon-edit">{{ $t('commonContent.edit')
               }}</el-button>
               <el-button @click="handleDeleteData(scope.row, 'delete')" type="text" icon="el-icon-delete">{{
                  $t('commonContent.delete') }}</el-button>
               <el-button @click="scheduleNextUpdate(scope.row, 1)" type="text" icon="el-icon-money">{{
                  $t('photoWall.slideshow') }}</el-button>
               <el-button @click="toDetail(scope.row, 'detail')" type="text" icon="el-icon-view">{{ $t('commonContent.view')
               }}</el-button>
            </template>
         </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination v-if="!isSwiper" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
         :current-page="queryInfo.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize"
         layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"></el-pagination>
   </basic-container>
</template>
 
<script>
import watermark from '@/util/watermark'
import photoWallApi from '@/api/photoWall/index'
import constData from "@/config/constData";
import swiperPhoto from './swiperPhoto'
export default {
   components: { swiperPhoto },
   data() {
      return {
         intervalId: null,
         isSwiper: false,
         constData,
         option: {
            size: "mini",
            span: 6,
            menuPosition: "left",
            submitText: this.$t('commonContent.search'),
            submitIcon: "el-icon-search",
            emptyBtn: false,
            column: [
               {
                  type: "input",
                  label: this.$t('photoWall.albumName'),
                  allowCreate: true,
                  filterable: true,
                  prop: "albumName",
               },
               {
                  type: "input",
                  label: this.$t('photoWall.creator'),
                  allowCreate: true,
                  filterable: true,
                  prop: "createUserName",
               },
            ],
         },
         multipleSelection: [],
         tableData: [],
         albumList: [],
         queryInfo: {
            query: "",
            pageNum: 1,
            pageSize: 10,
            total: 0,
         },
         form: {},
         timerId: null
      };
   },
   created() {
      this.getList({});
      watermark.set('remove')
   },
   mounted() {

   },
   beforeDestroy() {

      console.log('beforedddd')
      clearInterval(this.intervalId);
   },
   destroyed() {

   },
   activated() {

      if (this.$route.query.reflesh) {
         this.getList()
      }
   },
   methods: {
      hideSwiper(data) {
         clearTimeout(this.timerId);
         console.log(data)
         this.isSwiper = false
      },
      handleSubmit(form, done) {
         this.form = form;
         this.queryInfo.pageNum = 1;
         this.getList(form);
         done();
      },
      getList() {
         this.form.current = this.queryInfo.pageNum
         this.form.size = this.queryInfo.pageSize
         photoWallApi.getList(this.form).then(
            (res) => {
               this.tableData = res.data.data.records;
               this.queryInfo.total = res.data.data.total;
            }
         );
      },
      handleDeleteData(row, type) {
         let branchIds = this.multipleSelection.map(ele => ele.id)
         let ids = type === 'branchDelete' ? branchIds : [row.id]
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(async () => {
            let res = await photoWallApi.deleteRow(ids)
            if (res.data.code === 0) {
               this.$refs.multipleTable.clearSelection()
               this.$message({
                  type: 'success',
                  message: '删除成功!'
               });
               this.getList()
            }
         }).catch(() => {
            this.$message({
               type: 'info',
               message: '已取消删除'
            });
         });

      },
      createPhoto() {
         this.$router.push('/photoWallAdd')
      },
      toDetail(row, type) {
         this.$router.push(`/photoWallAdd?id=${row.id}&type=${type}`)
      },
      resetEditForm() {

      },
      refresh() {
         this.$refs.form.resetForm();
         this.form.albumName = ''
         this.form.createUserName = ''
         this.queryInfo.pageNum = 1;
         this.queryInfo.pageSize = 10
         this.$refs.multipleTable.clearSelection()
         this.getList({});
      },
      // 表格多选
      handleSelectionChange(val) {
         this.multipleSelection = val;
         // console.log(this.multipleSelection)
      },
      handleCurrentChange(currentPage) {
         // console.log("currentPage-->" + currentPage);
         this.queryInfo.pageNum = currentPage;
         this.getList({});
      },
      handleSizeChange(pageSize) {
         this.queryInfo.pageSize = pageSize;
         this.getList({});
      },
      scheduleNextUpdate(row, immiate) {
         // 计算当前时间距离明天9点的时间差
         var now = new Date();
         var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 30, 0);
         // console.log(tomorrow)
         var timeToNextUpdate = tomorrow - now;
         // console.log(timeToNextUpdate)
         let that = this
         // 设置新的定时器，在每天9点再次执行更新操作
         this.timerId = setTimeout(function () {
            that.updateFunction(row); // 执行更新逻辑
            clearTimeout(that.timerId);
            watermark.set('remove')
            that.scheduleNextUpdate(row); // 递归调用，以便设置下一次更新
         }, immiate || timeToNextUpdate);

      },
      updateFunction(row) {
         this.handleSwiper(row)
      },
      async handleSwiper(row) {
         let res = await photoWallApi.detail({ id: row.id })
         // console.log(res)
         if (res.data.code === 0) {
            this.albumList = res.data.data.photoInfoList
         }
         this.isSwiper = true
         // console.log(this.$refs.swiperPhotoRef.isFullscreen)
         this.$refs.swiperPhotoRef.isFullscreen = true
         // console.log(uni)
      }
   }
};
</script>
 
<style></style>
 