<template>
  <basic-container>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">{{$t('newsBulletin.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t(tabs)}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="nav">
      <el-col :span="17">
        <el-button class="add" @click="add(tabs)" v-if="visableEdit">{{$t('newsBulletin.add')}}</el-button>
      </el-col>
      <el-col :span="7">
        <rl-row>
          <el-col :span="6">
              {{$t('newsBulletin.advancedSearch')}}
          </el-col>
          <el-col :span="16">
            <el-input placeholder="请输入内容" v-model="searchTitle" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="SearchTitle"></el-button>
            </el-input>
          </el-col>
        </rl-row>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%;margin-top:20px">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column :label="$t('newsBulletin.document')" prop="title" width="550">
        <template slot-scope="scope">
          <span @click="handleTitleClick(scope.row)" style="color:#0055ff">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('newsBulletin.owner')" prop="userName">
      </el-table-column>
      <el-table-column :label="$t('newsBulletin.createDate')" prop="useTime">
      </el-table-column>
      <el-table-column align="right" v-if="visableEdit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">{{$t('newsBulletin.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('newsBulletin.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination> -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </basic-container>
</template>

<script>
  import newsApi from '@/api/newsBulletin/index'
  import {
    mapGetters
  } from "vuex";
  export default {
    data() {
      return {
        visableEdit: false,
        list: [],
        deleteVisible: false,
        searchTitle: "",
        tabs: "",
        // 默认显示第几页
        currentPage: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        pageSizes: [20, 30, 40, 50],
        // 默认每页显示的条数（可修改）
        PageSize: 20,
        tableData: [],
      };
    },
    created() {
    },
    mounted() {
      this.GetTabs();
      this.getList();
      this.GetUser();
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    methods: {
      async GetUser() {
        let res = await newsApi.getUserDetail({
          id: this.userInfo.user_id
        });
        console.log(res.data.data);
        if (res.data.data.name == "徐梦婕" || res.data.data.name == "admin"|| res.data.data.name == "汪金华"|| res.data.data.name == "陈强") {
          this.visableEdit = true;
        }
      },
      SearchTitle() {
        //搜索
        this.getList();
      },
      add(item) {
        this.$router.push({
          path: '/newsBulletin/addorupdate',
          query: {
            name: item
          }
        });
      },
      GetTabs() {
        const newsType = this.$route.query.newsType;
        this.tabs = newsType;
      },
      handleTitleClick(row) {
        this.$router.push({
          path: '/newsBulletin/details',
          query: {
            id: row.id
          }
        });
      },
      async getList() {
        const newsType = this.$route.query.newsType;
        let obj = {
          current: this.currentPage,
          size: this.PageSize,
          newsType: newsType,
        }
        if (this.searchTitle != "") {
          obj = {
            current: this.currentPage,
            size: this.PageSize,
            newsType: newsType,
            title: this.searchTitle,
          };
        }

        let res = await newsApi.List(obj);

        if (res.data.code === 200 || res.data.code === 0) {
          this.tableData = res.data.data.records
          this.totalCount = res.data.data.total
        }
      },
      handleEdit(row) { //编辑
        const newsType = this.$route.query.newsType;
        this.$router.push({
          path: '/newsBulletin/addorupdate',
          query: {
            row: row,
            name: newsType,
          }
        });
      },
      async handleDelete(row) { //删除
        this.$confirm(this.$t('newsBulletin.deleteConfirm'), this.$t('newsBulletin.delete'), {
          confirmButtonText: this.$t('newsBulletin.confirm'),
          cancelButtonText: this.$t('newsBulletin.cancel'),
          type: 'warning'
        }).then(async () => {
          let res = await newsApi.Delete({
            id: row.id
          });
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: this.$t('newsBulletin.deleteSuccess')
            });
            this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('newsBulletin.cancelDelete')
          });
        });
      },
      // 每页显示的条数
      handleSizeChange(val) {
        // 改变每页显示的条数
        this.PageSize = val
        this.getList()
      },
      // 显示第几页
      handleCurrentChange(val) {
        // 改变默认的页数
        this.currentPage = val
        // 切换页码时，要获取每页显示的条数
        this.getList()
      },
    }
  };
</script>

<style scoped>
  .el-table .el-button {
    padding: 7px 15px;
  }

  .el-button--primary {
    color: #FFFFFF;
    background-color: #999a9c;
    border-color: #fff;
  }

  .add {
    background-color: #409eff;
    border-color: #409eff;
    color: #FFFFFF;
  }

  .nav {
    margin-top: 20px;
  }
</style>
