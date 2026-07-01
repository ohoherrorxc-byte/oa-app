<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabList" :label="item.label" :key="item.label" :name="item.name">
        <avue-crud v-if="activeName === item.name" :option="option" :search.sync="search" :table-loading="loading"
                   :data="data" ref="crud" v-model="form" :page.sync="page" @search-change="searchChange"
                   @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange"
                   @refresh-change="refreshChange" @on-load="onLoad" @selection-change="handleSelectionChange">
          <!-- <template slot="qrcode" slot-scope="{row}">
              <div @click="toDetail(row)">
                  <QrCodeComponent :text="textQr(row)" ></QrCodeComponent>
              </div>
          </template> -->
          <template slot-scope="{disabled,size}" slot="inventoryPersonSearch">
            <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                         @getPerson="getPerson" @getPersonClear="getPersonClear('inventoryPerson')"
                         :initData="form.inventoryPerson" :disabled="disabled" :multiple="false">
            </autoAddress>
          </template>
          <template slot-scope="{disabled,size}" slot="recipientSearch">
            <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                         @getPerson="getPersonRecipient" @getPersonClear="getPersonClear('recipient')"
                         :initData="form.recipient" :disabled="disabled"
                         :multiple="false">
            </autoAddress>
          </template>
          <template slot="menuLeft">
            <div class="btn">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">新增
              </el-button>
              <!-- <el-button type="primary" size="small" plain icon="el-icon-download" @click="downModel">下载模板
              </el-button> -->
              <el-button type="primary" size="small" plain @click="branchInventory">批量盘点
              </el-button>
              <!-- <div style="margin-top: 7px;">
                  <upload url="/api/oa-portal/partsManagement/importInventory"> </upload>
              </div> -->
              <el-button size="small" type="warning" plain icon="el-icon-download" @click="handleExport">导出
              </el-button>
              <!-- <el-button size="small" type="danger" plain icon="el-icon-delete" @click="handleDelete">删除
              </el-button> -->
            </div>
          </template>
          <template slot-scope="{type,size,row,index}" slot="menu">
            <el-button icon="el-icon-view" :size="size" :type="type"
                       @click="toDetail(row, 'view')">查看
            </el-button>
          </template>
        </avue-crud>
      </el-tab-pane>
    </el-tabs>

    <!-- 弹窗：承载已有的partsDetails页面组件 -->
    <el-dialog title="零件二维码" :visible.sync="detailDialogVisible" width="90%" :close-on-click-modal="false"
               append-to-body="true" style="z-index: 9999;">
      <component :is="detailComponent" :detail-id="currentDetailId " :row="selectedRow"
                 @close-dialog="detailDialogVisible = false"></component>
    </el-dialog>
  </basic-container>
</template>
<script>

import upload from '@/components/upload/index'
import AssetsManageApi from '@/api/assetsManage/index'
import {downBlobFile, getYearMonthNum} from '@/util/util'
import QrCodeComponent from '@/components/qrcodeComponent/index.vue'
import {getDeptTree} from "@/api/organizationalStructure/department";
import autoAddress from '@/components/autoAddress/index'
import PartsManageApi from '@/api/partsManage/index'
import {mapGetters} from 'vuex'
import partsDetailsPop from '@/views/oa/partsManagement/partsDetailsPop'; // 引入已有页面

export default {
  data() {
    return {
      detailDialogVisible: false, // 弹窗显隐
      currentDetailId: '', // 详情ID
      selectedRow: null,
      detailComponent: 'partsDetailsPop', // 动态组件名称
      activeName: "all",
      tabList: [
        {
          name: 'all',
          label: "全部"
        },
        {
          name: 'unDone',
          label: "未盘点"
        },
        {
          name: 'done',
          label: "已盘点"
        },
      ],
      search: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      data: [],
      form: {
        inventoryStatus: null,
      },
      option: {
        //height: "auto",
        calcHeight: 80,
        tip: false,
        searchShow: true,
        searchMenuSpan: 100,
        border: true,
        index: true,
        selection: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 80,
        dialogClickModal: false,
        searchShowBtn: false,
        column: [
          {
            label: "零件名称",
            prop: "partName",
            slot: true,
            search: true,
            display: false,
          },
          {
            label: "零件编号",
            prop: "partNumber",
            slot: true,
            search: true,
            display: false
          },
          {
            label: "零件简称",
            prop: "partAbbreviation",
            display: false,
          },
          {
            label: "采购零件号",
            prop: "purchasePartNumber",
            width: 100,
            search: false,
            display: false,
          },
          {
            label: "规格型号",
            prop: "specificationAndModel",
            search: false,
            searchSpan: 6,
            display: false,
          },
          {
            label: "适用项目",
            prop: "partsProject",
            display: false,
            //searchSpan: 4,
            search: true,
          },
          {
            label: "零件大类",
            prop: "partsCategory",
            search: true,
            display: false,
            props: {
              value: 'dictValue',
              label: 'dictValue'
            },
            type: 'select',
            dicUrl: "/api/oa-system/dict-biz/dictionary?code=partCategories"
          },
          {
            label: "零件中类",
            prop: "middlePart",
            search: true,
            display: false,
          },
          {
            label: "零件小类",
            prop: "partsSubcategory",
            search: true,
            display: false,
          },
          {
            label: "盘点状态",
            prop: "inventoryStatus",
            display: false,
            formatter: (row, value) => {
              let obj = {
                0: "未盘点",
                1: "已盘点"
              }
              return obj[value]
            },
            search: false
          },
          {
            label: "盘点日期",
            prop: "inventoryDate",
            display: false,
            // propRange: ["inventoryStartTime", "inventoryEndTime"],
            type: "date",
            search: true,
            searchRange: true,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            change: this.getTimer,
            formatter: function (val) {
              if (val.inventoryDate) {
                return val.inventoryDate.substring(0, 10)
              }
            }
          },
          {
            label: "盘点年份",
            prop: "inventoryYear",
            display: false,
            search: true,
            type: "year",
            format: 'yyyy',
            valueFormat: 'yyyy',
          },
          {
            label: "当前状态",
            prop: "currentState",
            display: false,
            search: true,
            searchType: "select",
            dicData: [
              {
                label: '在库中',
                value: '在库中'
              },
              {
                label: '已领用',
                value: '已领用'
              }
            ]
          },
          {
            label: "入库时间",
            prop: "warehousingTime",
            display: false,
          },
          {
            label: "存放地点",
            prop: "storageLocation",
            search: true,
            searchType: "input",
            // searchSpan: 5,
            // props: {
            //     label: "dictValue",
            //     value: "dictKey",
            // },
            // dicUrl: "/api/oa-system/dict-biz/dictionary?code=storageLocation",
            display: false,
          },
          {
            label: "盘点人",
            prop: "inventoryPerson",
            display: false,
            search: true,
          },
          {
            label: "盘点部门",
            prop: "inventoryDept",
            display: false,
            search: false,
            type: "tree",
            multiple: false,
            dicData: [],
            props: {
              label: "title",
              value: 'title'
            },
            checkStrictly: true,
            slot: true,
          },
          {
            label: "领用人",
            prop: "recipient",
            display: false,
            search: true,
            //searchSpan:5,
          },
          {
            label: "领用部门",
            prop: "recipientDept",
            display: false,
            search: false,
            searchSpan: 5,
          },
          {
            label: "领用时间",
            prop: "usageTime",
            display: false,
          },
          {
            label: "领用说明",
            prop: "usageDescription",
            display: false,
          },
        ],
        //
        isLoading: false, // 控制加载状态显示
        loading: true,
        loadingInstances: [], // 初始化为空数组
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),

  },
  components: {
    upload, autoAddress, QrCodeComponent, partsDetailsPop
  },
  mounted() {
    getDeptTree(629965).then((res) => {
      const column = this.findObject(this.option.column, "inventoryDept");
      column.dicData = res.data.data;
    });
  },
  methods: {
    async onLoad(page, params = {}) {
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      // console.log(params)
      let postdata = {...obj, ...params, ...this.query, ...this.form}
      this.loading = true;
      await PartsManageApi.getInventoryList(
        postdata
      ).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.page.total = data.total;
        this.data = data.records || [];
      });
    },
    async branchInventory() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择盘点数据')
        return
      }
      let ids = this.multipleSelection.map(ele => ele.inventoryId)
      let partIds = this.multipleSelection.map(ele => ele.id)

      //let res = await PartsManageApi.branchInventory(this.userInfo.user_id, ids)
      let res = await PartsManageApi.getInventoryCheck(ids, partIds, this.userInfo.user_id)
      if (res.data.code === 200 || res.data.code === 0) {
        this.$message.success('已批量盘点')
        this.onLoad()
      }
    },
    // toDetail(row) {
    //   this.$router.push(`/partsDetails?id=${row.id}`)
    // },
    toDetail(row) {
      this.currentDetailId = row.id;
      this.selectedRow = row;
      this.detailDialogVisible = true;
    },
    async handleDelete() {
      console.log(this.$refs.crud)
      let ids = this.multipleSelection.map(ele => ele.id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await AssetsManageApi.deleteInventory(ids)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.onLoad(this.page)
          this.$refs.crud[0].$refs.table.clearSelection()

        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getPerson(data) {
      // console.log(data)
      // console.log('11111')
      this.form.inventoryPerson = data.name
    },
    getPersonClear(key) {
      // console.log('wwwwwwwww')
      this.form[key] = null
    },
    getPersonRecipient(data) {
      // console.log(data)
      this.form.recipient = data.realName
    },
    async downModel() {
      let res = await PartsManageApi.exportPartsInventoryTemplate()
      console.log(res)
      downBlobFile(res.data, '零件盘点模板.xlsx')
    },
    getTimer(v) {
      if (v && v.value && v.value.length > 0) {
        this.form.inventoryStartTime = v.value[0]
        this.form.inventoryEndTime = v.value[1]
      } else {
        this.form.inventoryStartTime = null
        this.form.inventoryEndTime = null
      }
    },
    handleAdd() {

    },

    // async handleExport() {
    //     let obj = { ...this.form, ...this.query }
    //     // let res = await AssetsManageApi.exportInventoryAsset(obj)
    //     let res = await PartsManageApi.exportInventorPart(obj)
    //     // console.log(res)
    //     downBlobFile(res.data, '零件盘点.xlsx')
    // },

    async handleExport() {
      const totalSeconds = 12; // 总需要秒数

      // let confirmed;
      // try {
      //   await this.$confirm(
      //     `导出盘点记录耗时较长，总共需要${totalSeconds}秒左右，确定需要导出么？`,
      //     '提示',
      //     {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }
      //   );
      //   confirmed = true;
      // } catch {
      //   confirmed = false;
      // }
      // if (!confirmed) {
      //   // 用户点击了“取消”，直接返回
      //   return;
      // }

      // 初始化倒计时
      let countdown = totalSeconds;
      let loadingInstance;
      let countdownInterval;
      try {
        loadingInstance = this.$loading({
          lock: true,
          text: this.getLoadingText(countdown),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)',
        });
        // 确保 loadingInstances 是数组
        if (!Array.isArray(this.loadingInstances)) {
          this.loadingInstances = [];
        }
        this.loadingInstances.push(loadingInstance);
        // 启动倒计时更新
        countdownInterval = setInterval(() => {
          countdown -= 1;
          if (countdown >= 0) {
            loadingInstance.text = this.getLoadingText(
              countdown
            );
          }
        }, 1000);

        try {
          // 执行导出操作
          let obj = {...this.form, ...this.query}
          let res = await PartsManageApi.exportInventorPart(obj)

          // console.log(res)
          downBlobFile(res.data, '零件盘点.xlsx')

          // 清理倒计时并关闭加载
          clearInterval(countdownInterval);
          this.closeLoading(loadingInstance);
          this.$message.success('导出成功!');

        } catch (error) {
          // 接口报错时进入这里，可提示用户
          console.error('导出失败:', error);
          this.$message.error('导出出错了，请稍后重试~');
        }

      } catch (error) {
        // 错误处理
        this.handleError(error);
        if (countdownInterval) clearInterval(countdownInterval);
        if (loadingInstance) this.closeLoading(loadingInstance);
      }
    },

    // 辅助方法
    getLoadingText(seconds) {
      return `剩余 ${seconds} 秒...`;
    },
    // 辅助方法, 关闭逻辑
    closeLoading(loadingInstance) {
      loadingInstance.close();
      this.loadingInstances = this.loadingInstances.filter(inst => inst !== loadingInstance);
    },
    handleClick() {
      let obj = {
        'all': null,
        'unDone': 0,
        'done': 1
      }
      this.form.inventoryStatus = obj[this.activeName]
      this.page.current = 1; // 切换标签重置页码
      this.onLoad(this.page)
    },
    searchReset() {
      this.getTimer()
      this.query = {};
      this.form.recipient = null
      this.form.inventoryPerson = null
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      if (this.query.account != undefined && this.query.account != "") {
        this.search.account = this.query.account.trim();
      }
      if (this.query.realName != undefined && this.query.realName != "") {
        this.search.realName = this.query.realName.trim();
      }
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    currentChange(currentPage) {
      console.log(currentPage)
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    //
    handleError(err) {
      console.error('请求失败:', err);
      this.$message.error(
        (err.response && err.response.data && err.response.data.msg) || '操作失败'
      );
    },
    //
    beforeDestroy() {
      // 正确清理所有 loading 实例
      this.loadingInstances.forEach(instance => {
        if (typeof instance.close === 'function') {
          instance.close();
        }
      });
      this.loadingInstances = []; // 清空数组
    },
  }
}
</script>

<style>
.btn {
  display: flex;
  align-items: center;
}
</style>
