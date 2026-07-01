<template>
  <basic-container class="basic-container">
    <!-- Relay Control Panel -->
    <div class="main-content">
      <div class="crud-list">
        <h3>设定自动开关灯时间</h3>
        <div class="light-ctrl-container">
          <el-select v-if="areas.length > 0" v-model="selectedArea" placeholder="请选择操作区域" class="area-select"
                     @change="handleAreaChange">
            <el-option v-for="area in areas" :key="area.id" :label="area.name" :value="area.id"/>
          </el-select>
          <div v-else>正在加载灯控区域信息...</div>
          <!-- 新增：全屏加载提示 -->
          <div v-if="isLoading" class="loading-overlay">
            <i class="el-icon-loading"></i>
            <span></span>
          </div>
          <!-- 新增：全屏加载提示 -->
          <div v-if="isLoading" class="loading-overlay">
            <i class="el-icon-loading"></i>
            <span></span>
          </div>
        </div>
        <avue-crud
          :option="option"
          :search.sync="search"
          :table-loading="loading"
          :data="data"
          :page.sync="page"
          :permission="permissionList"
          :before-open="beforeOpen"
          v-model="form"
          ref="crud"
          @row-update="rowUpdate"
          @row-save="rowSave"
          @row-del="rowDel"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <template slot="menuLeft">
            <div class="mobile-button-group">
              <el-button type="primary"
                         icon="el-icon-plus"
                         size="small"
                         @click="handleAdd">新 建
              </el-button>
              <el-button type="danger"
                         size="small"
                         icon="el-icon-delete"
                         plain
                         @click="handleDelete">删 除
              </el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                plain
                v-if="permission.lightCtrlSchedules_delete"
                @click="handleDelete"
              >
                批量删除
              </el-button>
              <!--              <el-button-->
              <!--                type="warning"-->
              <!--                size="small"-->
              <!--                plain-->
              <!--                icon="el-icon-download"-->
              <!--                @click="handleExport"-->
              <!--              >-->
              <!--                导出-->
              <!--              </el-button>-->
            </div>
          </template>
          <template slot="empty">
            <div v-if="selectedArea" class="no-data-tip">
              {{ data.length === 0 ? '当前区域暂无定时任务' : '' }}
            </div>
            <div v-else class="no-data-tip">
              请先选择操作区域
            </div>
          </template>
          <template slot="status" slot-scope="{ row }">
        <span :style="getStatusInfo(row.status).style">
          {{ getStatusInfo(row.status).text }}
        </span>
          </template>
        </avue-crud>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  updateBatch,
  remove,
} from '@/api/lightctrl/lightCtrlSchedules';
import option from '@/option/lightctrl/lightCtrlSchedules';
import {listAreaGroups} from '@/api/lightctrl/lightCtrlAreaDeviceMap';
import {mapGetters} from 'vuex';
// import {exportBlob} from '@/api/common';
// import {getToken} from '@/util/auth';
// import {downloadXls} from '@/util/util';
// import {dateNow} from '@/util/date';
// import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import dayjs from 'dayjs';
import {getUserInfo} from '@/api/system/user';

export default {
  data() {
    return {
      isLoading: false, // 控制加载状态显示
      userInfo: {},
      form: {},
      query: {},
      search: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: option,
      data: [],
      lightOn: false,
      devices: {}, // { uuid: { load: ['0', '1', ...] } }
      names: {}, // { uuid: name }
      // 处理未登记设备排序
      DEFAULT_NAME: 'Unknown',
      loadingInstances: [], // 初始化为空数组
      uuidMap: {},
      selectedArea: '', // 默认选择第一个区域
      selectedAreaName: '',
      areas: [],
      isRefreshing: false, // 控制防止重复触发
      loadingDuration: 3000, // ms
    };
  },
  created() {
    this.handleUserInfo();
    this.fetchAreaGroups().then(() => {
      if (this.areas.length > 0) {
        this.selectedArea = this.areas[0].id;
        this.onLoad(this.page); // ✅ 初始化加载数据
      }
    });
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.lightCtrlSchedules_add, false),
        viewBtn: this.vaildData(this.permission.lightCtrlSchedules_view, true),
        delBtn: this.vaildData(this.permission.lightCtrlSchedules_delete, true),
        editBtn: this.vaildData(this.permission.lightCtrlSchedules_edit, true),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(',');
    },
  },

  beforeDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  },

  methods: {
    async fetchAreaGroups() {
      try {
        const response = await listAreaGroups();
        // console.log('完整接口响应:', response);

        // 解构业务数据（根据实际接口结构调整）
        const res = response.data;

        let areaGroups = [];

        // 正确判断逻辑
        if (res && res.code === 200 && Array.isArray(res.data)) {
          areaGroups = res.data;
          // console.log('有效区域数据:', areaGroups);
        } else {
          console.warn('接口格式异常:', res);
          return;
        }

        // 构建区域列表
        this.areas = areaGroups.map(area => ({
          id: area.areaId,
          name: area.areaName
        }));

        // 构建设备映射
        this.uuidMap = areaGroups.reduce((map, area) => {
          area.deviceUuid.forEach((uuid, index) => {
            const order = area.sortOrder[index] || index + 1;
            map[uuid] = `${area.areaName}-${order}`;
          });
          return map;
        }, {});

        // 构建区域设备映射
        this.areaDeviceMap = areaGroups.reduce((map, area) => {
          map[area.areaId] = area.deviceUuid;
          return map;
        }, {});

        // 默认选中第一个区域
        if (this.areas.length > 0) {
          this.selectedArea = this.areas[0].id;
          this.selectedAreaName = this.areas[0].name;
          console.log('默认选中区域:', this.selectedArea);
        }
      } catch (error) {
        console.error('获取区域失败:', error);
        this.$message.error('区域数据加载失败');
      }
    },
    //
    handleError(err) {
      console.error('请求失败:', err);
      this.$message.error(
        (err.response && err.response.data && err.response.data.msg) || '操作失败'
      );
    },

    async saveOrUpdate(row, done, loading, isAdd) {
      try {
        if (!row.openTime && !row.closeTime) {
          await this.showAlert('开灯时间和关灯时间不能同时为空！');
          return;
        }
        if (row.openTime === row.closeTime) {
          await this.showAlert('开灯时间和关灯时间不能为相同的时间！');
          return;
        }

        // if (row.openTime >= row.closeTime) {
        //   await this.showAlert('关灯时间必须晚于开灯时间！');
        //   return;
        // }

        // if (row.openTime === row.closeTime) {
        //   await this.showAlert('将只设定关灯时间');
        // }

        row.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const api = isAdd ? add : update;

        if (row.status === 1) {
          const confirmed = await this.showConfirm(
            '启用该记录后，其他启用的记录将被标记为已取消，是否继续?'
          );

          if (!confirmed) {
            row.status = 0;
            return;
          }

          const updatedRows = this.data
            .filter((item) => item.id !== row.id && item.status === 1)
            .map((item) => ({
              id: item.id,
              areaId: item.areaId,
              status: 0,
              updateTime: row.updateTime,
            }));

          if (updatedRows.length > 0) {
            await updateBatch(updatedRows);
          }
          await api(row);
        } else {
          await api(row);
        }

        this.onLoad(this.page);
        this.$message.success('操作成功!');
        done();
      } catch (error) {
        console.error('Save operation failed:', error);
        this.$message.error(
          (error.response && error.response.data && error.response.data.msg) ||
          '操作失败'
        );
      } finally {
        loading(false);
      }
    },

    showAlert(message) {
      return this.$alert(message, '友情提示', {
        confirmButtonText: '确定',
        type: 'warning',
      });
    },

    showConfirm(message) {
      return this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => true)
        .catch(() => false);
    },

    rowSave(row, done, loading) {
      this.saveOrUpdate(row, done, loading, true).then(() => {
        this.onLoad(this.page); // ✅ 提交成功后刷新列表
      });
    },

    rowUpdate(row, index, done, loading) {
      this.saveOrUpdate(row, done, loading, false);
    },

    rowDel(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message.success('操作成功!');
        });
    },

    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message.success('操作成功!');
          this.$refs.crud.toggleSelection();
        });
    },

    handleAdd() {
      this.$refs.crud.rowAdd();
    },

    // handleExport() {
    //   let downloadUrl = `/api/blade-lightctrlschedules/lightCtrlSchedules/export-lightCtrlSchedules?${this.website.tokenHeader}=${getToken()}`;
    //   let values = {};
    //   this.$confirm('是否导出数据?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(() => {
    //     NProgress.start();
    //     exportBlob(downloadUrl, values).then((res) => {
    //       downloadXls(res.data, `灯控${dateNow()}.xlsx`);
    //       NProgress.done();
    //     });
    //   });
    // },

    handleUserInfo() {
      getUserInfo().then((res) => {
        const user = res.data.data;
        this.userInfo = {
          id: user.id,
          realName: user.realName,
        };
      });
    },

    beforeOpen(done, type) {
      if (type === 'add') {
        this.form = {
          openTime: null,
          closeTime: null,
          userName: this.userInfo.realName,
          userId: this.userInfo.id,
          areaId: this.selectedArea,
          areaName: this.selectedAreaName,
          status: 1,
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          isDeleted: 0,
        };
      } else if (['edit', 'view'].includes(type)) {
        getDetail(this.form.id).then((res) => {
          this.form = res.data.data;
        });
      }
      done();
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

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },

    // onLoad(page) {
    //   this.loading = true;
    //   let values = {};
    //   getList(page.currentPage, page.pageSize, values).then((res) => {
    //     const data = res.data.data;
    //     this.page.total = data.total;
    //     this.data = data.records;
    //     this.loading = false;
    //     this.selectionClear();
    //
    //     const now = dayjs().format('HH:mm');
    //     const enabledRecords = data.records.filter((record) => record.status === 1);
    //     this.lightOn = enabledRecords.some((record) => {
    //       return now > record.openTime && now < record.closeTime;
    //     });
    //   });
    // },

    onLoad(page) {
      this.loading = true;

      // 添加区域过滤参数
      const params = {
        areaId: this.selectedArea // ✅ 关键修改：传递当前选中区域
      };

      getList(page.currentPage, page.pageSize, params).then((res) => { // 👈 传入params
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records.filter(item =>
          item.areaId === this.selectedArea // ✅ 前端二次过滤（可选）
        );
        this.loading = false;
        this.selectionClear();
      });
    },

    getStatusInfo(status) {
      const statusMap = {
        1: {text: '已启用', style: {color: 'red', fontWeight: 'bold'}},
        0: {text: '已取消', style: {}},
      };
      return statusMap[status] || {text: '未知状态', style: {}};
    },

    handleAreaChange() {
      if (this.isRefreshing || !this.selectedArea) return;
      this.isRefreshing = true;
      // 清空旧数据
      this.data = [];
      // 重新加载数据
      this.onLoad(this.page);
      this.isRefreshing = false;
    },
  },
};
</script>

<style scoped>
/* CSS Variables for reusability */
:root {
  --primary-padding: 20px;
  --secondary-padding: 10px;
  --border-radius: 4px;
  --border-color: #ddd;
  --background-light: #f5f5f5;
  --text-color: #333;
  --active-color: #0c0;
  --hover-color: #090;
  --font-size-base: 14px;
  --font-size-small: 12px;
  --button-margin: 10px; /* Added for button spacing */
}

/* Base container styles */
.basic-container {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: var(--secondary-padding);
}

/* Main content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--primary-padding);
}

/* Light control container */
.light-ctrl-container {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.area-select {
  max-width: 200px;
}

/* Relay control styles */
.relay-control-container {
  margin-top: var(--primary-padding);
}

.relay-control-container h3 {
  font-size: 16px;
  margin: 0 0 var(--secondary-padding);
}

.ctrl-box {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--primary-padding);
}

.device-item {
  display: flex;
  align-items: center;
  background: var(--background-light);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-top: var(--secondary-padding);
  padding: 5px;
}

.device-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
  width: 180px;
}

.device-header .uuid {
  font-size: var(--font-size-base);
  border: 1px solid #999;
  padding: 5px 8px;
  border-radius: 3px;
  background: #fff;
  text-align: center;
  max-width: 180px;
  word-break: break-all;
}

.relays {
  display: flex;
  gap: var(--secondary-padding);
}

.onoff {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #999;
  border-radius: 3px;
  padding: 3px;
}

.onoff > span {
  height: 25px;
  line-height: 25px;
}

.onoff > span.label {
  width: 30px;
  text-align: center;
  font-size: var(--font-size-small);
}

.onoff > span.on,
.onoff > span.off {
  width: 40px;
  text-align: center;
  color: white;
  font-size: var(--font-size-small);
  user-select: none;
}

.onoff > span.active {
  background: var(--active-color);
}

.onoff > span.pointer {
  background: #aaa;
  cursor: pointer;
}

.onoff > span.pointer:hover {
  color: var(--hover-color);
}

/* Table styles */
.avue-crud {
  margin-top: var(--primary-padding);
  min-height: 300px;
}

.avue-crud .el-table__body-wrapper table td,
.avue-crud .el-table__header-wrapper table th {
  text-align: center;
}

.avue-crud .el-button--small {
  padding: 6px 8px;
  min-width: 200px !important;
}

.mobile-button-group {
  display: flex;
  flex-direction: column;
  gap: 10px !important;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* Button styles for spacing */
.el-button {
  margin-bottom: var(--button-margin); /* Add spacing between buttons */
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  /* .basic-container {
    padding: 5px;
  } */

  .main-content {
    padding: var(--secondary-padding);
  }

  .relay-control-container {
    margin-top: var(--secondary-padding);
  }

  .relay-control-container .el-button {
    margin-bottom: 8px;
    width: 100%;
  }

  .device-item {
    flex-direction: column;
    padding: 8px;
    margin-top: 8px;
  }

  .device-header {
    margin-right: 0;
    margin-bottom: 5px;
  }

  .device-header .uuid {
    font-size: var(--font-size-small);
    max-width: 100%;
    padding: 3px 5px;
  }

  .relays {
    flex-wrap: wrap;
    gap: 5px;
  }

  .onoff {
    flex: 1;
    min-width: 80px;
  }

  .onoff > span {
    height: 28px;
    line-height: 28px;
    font-size: 11px;
  }

  .onoff > span.label {
    width: 25px;
  }

  .onoff > span.on,
  .onoff > span.off {
    width: 35px;
  }

  .avue-crud {
    width: 100%;
    margin-left: 0;
  }

  .avue-crud .el-table {
    min-width: 90%;
  }

  .avue-crud .el-table__body-wrapper {
    overflow-x: auto;
  }

  .avue-crud .el-table td,
  .avue-crud .el-table th {
    padding: 8px 4px;
    min-width: 80px;
  }

  .avue-crud .el-button--small {
    padding: 6px 8px;
    min-width: 120px;
  }

  h3 {
    font-size: 18px;
    margin: 0 0 15px;
  }

  .el-button {
    margin-bottom: 5px; /* Reduced spacing for mobile */
  }
}

</style>
