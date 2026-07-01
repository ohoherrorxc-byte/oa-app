<template>
  <basic-container class="basic-container">
    <!-- Relay Control Panel -->
    <div class="main-content">
      <h3>灯控面板</h3>
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
      </div>
      <div class="mobile-button-group">
        <el-button
          type="warning"
          size="small"
          plain
          :style="{ backgroundColor: '#419fff', color: 'white', borderColor: '#419fff' }"
          @click="handleConfirmTurnOn"
        >
          <i class="el-icon-sunny"></i>
          {{ '该区域的灯依次全开' }}
        </el-button>
        <el-button
          type="warning"
          size="small"
          plain
          :style="{ backgroundColor: '#8a8a8a', color: 'white', borderColor: 'red' }"
          @click="handleConfirmTurnOff"
        >
          <i class="el-icon-moon"></i>
          {{ '该区域的灯依次全关' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-refresh"
          @click="refreshDevicesWithNotice"
        >立即同步设备状态
        </el-button>
      </div>
      <div class="relay-control-container">
        <!-- Relay Control Panel -->
        <div class="ctrl-box">
          <div v-for="(device, uuid) in devices" :key="uuid" class="device-item">
            <!--          <div>-->
            <!--            <span class="name">{}</span>-->
            <!--          </div>-->
            <div class="device-header">
              <span class="uuid">{{ device.name ? `${device.name} - ${uuid}` : `✍ - ${uuid}` }}</span>
            </div>
            <div class="relays">
              <span
                v-for="(state, index) in device.load"
                :key="index"
                class="onoff"
                @click="toggleRelay(uuid, index, state)"
              >
                <span class="label">S{{ index + 1 }}</span>
                <span
                  class="on"
                  :class="{ active: state === '1', pointer: state === '0' }"
                >
                  ON
                </span>
                <span
                  class="off"
                  :class="{ active: state === '0', pointer: state === '1' }"
                >
                  OFF
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  toTurnOn,
  toTurnOff,
  getDevices,
  setRelay,
} from '@/api/lightctrl/lightCtrlOperationRecords';
import {listAreaGroups} from '@/api/lightctrl/lightCtrlAreaDeviceMap';
import option from '@/option/lightctrl/lightCtrlOperationRecords';
import {mapGetters} from 'vuex';
// import {exportBlob} from '@/api/common';
// import {getToken} from '@/util/auth';
// import {downloadXls} from '@/util/util';
// import {dateNow} from '@/util/date';
// import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import dayjs from 'dayjs';
// import {getUserInfo} from '@/api/system/user';


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
      loadingInstances: [], // 初始化为空数组
      // uuidMap: {
      //   '3254473143092326': '展厅-K1',
      //   '3254473143092440': '展厅-K2',
      //   '3254473143092327': '展厅-K3',
      //   '3254473143092439': '展厅-K4',
      // },
      // selectedArea: 'area1', // 默认选择第一个区域
      // areas: [
      //   {id: 'area1', name: '展厅区域 1'},
      //   {id: 'area2', name: '展厅区域 2'},
      //   {id: 'area3', name: '展厅区域 3'}
      //   // 硬编码区域列表，实际可根据需求调整
      // ],
      uuidMap: {},
      selectedArea: '', // 默认选择第一个区域
      areas: [],
      areaDeviceMap: {},
      // 处理未登记设备排序
      DEFAULT_NAME: 'Unknown',
      isRefreshing: false, // 控制防止重复触发
      loadingDuration: 3000, // ms
    };
  },
  created() {
    // this.handleUserInfo();
    this.fetchAreaGroups().catch(error => {
      console.error('初始化区域数据失败:', error);
    });
    this.initRelayControl();

  },
  // mounted() {
  //   console.log('当前 areas:', this.areas);
  //   console.log('当前 selectedArea:', this.selectedArea);
  // },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.lightCtrlSchedules_add, false),
        viewBtn: this.vaildData(this.permission.lightCtrlSchedules_view, false),
        delBtn: this.vaildData(this.permission.lightCtrlSchedules_delete, false),
        editBtn: this.vaildData(this.permission.lightCtrlSchedules_edit, false),
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
    // 正确清理所有 loading 实例
    this.loadingInstances.forEach(instance => {
      if (typeof instance.close === 'function') {
        instance.close();
      }
    });
    this.loadingInstances = []; // 清空数组

    // 原有定时器清理
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

        if (res && res.success && Array.isArray(res.data)) {
          areaGroups = res.data;

          // 构建区域设备映射
          this.areaDeviceMap = areaGroups.reduce((map, area) => {
            map[area.areaId] = area.deviceUuid || []; // ✅ 确保设备列表存在
            return map;
          }, {});

          // console.log('区域设备映射:', this.areaDeviceMap);
        } else {
          console.warn('接口返回的数据格式不符合预期', res);
          areaGroups = [];
        }

        // 构建 areas 列表
        this.areas = areaGroups.map(area => ({
          id: area.areaId,
          name: area.areaName
        }));
        // console.log('映射后的 areas:', this.areas); // 验证映射结果

        // ...其他代码不变
      } catch (error) {
        console.error('获取区域分组失败:', error);
        this.$message.error('获取区域分组失败');
      }
    },

    initRelayControl() {
      this.devices = {};
      this.names = {};
      this.refreshDevices();

      // 统一管理轮询定时器
      if (!this.pollingInterval) {
        this.pollingInterval = setInterval(() => {
          this.refreshDevices();
        }, 5000);
      }
    },

    getSelectedDeviceUuids() {
      // const areaDeviceMap = {
      //   'area1': ['3254473143092326', '3254473143092440', '3254473143092327', '3254473143092439'], // 展厅-K1, 展厅-K2
      //   'area2': ['3254473143092326', '3254473143092440', '3254473143092327',],                    // 展厅-K3
      //   'area3': ['3254473143092440'],                    // 展厅-K4
      // };
      //
      // return areaDeviceMap[this.selectedArea] || [];
      return this.areaDeviceMap[this.selectedArea] || [];
    },

    beforeOpen(done, type) {
      if (type === 'add') {
        this.form = {
          openTime: '',
          closeTime: '',
          updateUserName: this.userInfo.realName,
          updateUserId: this.userInfo.id,
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

    onLoad(page) {
      this.loading = true;
      let values = {};
      getList(page.currentPage, page.pageSize, values).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();

        const now = dayjs().format('HH:mm');
        const enabledRecords = data.records.filter((record) => record.status === 1);
        this.lightOn = enabledRecords.some((record) => {
          return now > record.openTime && now < record.closeTime;
        });
      });
    },

    async handleConfirmTurnOn() {
      let loadingInstance;
      let countdownInterval;
      try {
        if (!this.selectedArea) {
          this.$message.error('请先选择操作区域');
          return;
        }
        // 获取当前选中的区域（或根据业务逻辑确定要操作的 uuid）
        const targetUuids = this.getSelectedDeviceUuids(); // 自定义方法获取 uuid 列表
        const selectedArea = this.selectedArea;
        // 获取当前选中的区域（或根据业务逻辑确定要操作的 uuid）
        const totalSeconds = (targetUuids.length + 1) * 2; // 总需要秒数

        let confirmed;
        try {
          await this.$confirm(
            `确定要打开该区域所有的灯吗？这些灯将间隔2秒依次打开，总共需要${totalSeconds}秒。`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          );
          confirmed = true;
        } catch {
          confirmed = false;
        }
        if (!confirmed) {
          // 用户点击了“取消”，直接返回
          return;
        }

        // 初始化倒计时
        let countdown = totalSeconds;
        loadingInstance = this.$loading({
          lock: true,
          text: this.getLoadingText(countdown),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)',
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

        // 执行开灯操作（按设备逐个操作）
        if (!targetUuids || targetUuids.length === 0) {
          this.$message.warning('没有可操作的设备');
          return;
        }
        // 执行开灯操作
        this.toTurnOnAll(selectedArea, targetUuids);
        await new Promise(resolve => setTimeout(resolve, totalSeconds * 1000));

        // 清理倒计时并关闭加载
        clearInterval(countdownInterval);
        this.closeLoading(loadingInstance);
        this.refreshDevices();
      } catch (error) {
        // 错误处理
        this.handleError(error);
        if (countdownInterval) clearInterval(countdownInterval);
        if (loadingInstance) this.closeLoading(loadingInstance);
      }
    },

    // 抽取加载状态关闭逻辑，复用代码
    closeLoading(loadingInstance) {
      loadingInstance.close();
      this.loadingInstances = this.loadingInstances.filter(inst => inst !== loadingInstance);
    },

    toTurnOnAll(selectedArea, targetUuids) {
      toTurnOn(selectedArea, targetUuids)
        .then(() => {
          this.lightOn = true;
          //this.$message.success('开灯成功!');
          //this.refreshDevices(); // Refresh device states
        })
        .catch((error) => {
          console.error('开灯失败:', error);
          this.$message.error('开灯失败');
        });
    },

    // 辅助方法
    getLoadingText(seconds) {
      return `剩余 ${seconds} 秒, 正在间隔2秒依次操作各个灯组...`;
    },

    async handleConfirmTurnOff() {
      let loadingInstance;
      let countdownInterval;
      try {
        if (!this.selectedArea) {
          this.$message.error('请先选择操作区域');
          return;
        }

        // 获取当前选中的区域（或根据业务逻辑确定要操作的 uuid）
        const targetUuids = this.getSelectedDeviceUuids(); // 自定义方法获取 uuid 列表
        const selectedArea = this.selectedArea;
        const totalSeconds = (targetUuids.length + 1) * 2; // 总需要秒数

        let confirmed;
        try {
          await this.$confirm(
            `确定要打开该区域所有的灯吗？这些灯将间隔2秒依次打开，总共需要${totalSeconds}秒。`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          );
          confirmed = true;
        } catch {
          confirmed = false;
        }
        if (!confirmed) {
          // 用户点击了“取消”，直接返回
          return;
        }

        // 初始化倒计时
        let countdown = totalSeconds;
        loadingInstance = this.$loading({
          lock: true,
          text: this.getLoadingText(countdown),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)',
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

        // 执行开灯操作（按设备逐个操作）
        if (!targetUuids || targetUuids.length === 0) {
          this.$message.warning('没有可操作的设备');
          return;
        }
        // 执行开灯操作
        this.toTurnOffAll(selectedArea, targetUuids);
        await new Promise(resolve => setTimeout(resolve, totalSeconds * 1000));

        // 清理倒计时并关闭加载
        clearInterval(countdownInterval);
        this.closeLoading(loadingInstance);
        this.refreshDevices();
      } catch (error) {
        // 错误处理
        this.handleError(error);
        if (countdownInterval) clearInterval(countdownInterval);
        if (loadingInstance) this.closeLoading(loadingInstance);
      }
    },

    toTurnOffAll(selectedArea, targetUuids) {
      toTurnOff(selectedArea, targetUuids)
        .then(() => {
          this.lightOn = false;
          // this.$message.success('关灯成功!');
          // this.refreshDevices(); // Refresh device states
        })
        .catch((error) => {
          console.error('关灯失败:', error);
          this.$message.error('关灯失败');
        });
    },
    //
    handleError(err) {
      console.error('请求失败:', err);
      this.$message.error(
        (err.response && err.response.data && err.response.data.msg) || '操作失败'
      );
    },

    // getStatusInfo(status) {
    //   const statusMap = {
    //     1: {text: '已启用', style: {color: 'red', fontWeight: 'bold'}},
    //     0: {text: '已取消', style: {}},
    //   };
    //   return statusMap[status] || {text: '未知状态', style: {}};
    // },
    //

    refreshDevices() {
      // if (this.isLoading) {
      //   return;
      // }
      // this.isLoading = true;

      getDevices()
        .then((res) => {
          this.processDeviceData(res.data.data || []);
        })
        .catch(this.handleError)
        .finally(() => {
          //this.isLoading = false;
        });
    },

    refreshDevicesWithNotice() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      let loadingInstance;
      try {
        loadingInstance = this.$loading({
          lock: true,
          text: '同步设备中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)',
        });

        if (!Array.isArray(this.loadingInstances)) {
          this.loadingInstances = [];
        }
        this.loadingInstances.push(loadingInstance);

        getDevices()
          .then((res) => {
            this.processDeviceData(res.data.data || []);
            setTimeout(() => {
            }, this.loadingDuration);
          })
          .catch(this.handleError);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.closeLoading(loadingInstance);
        this.isLoading = false;
      }
    },

    // 新增数据处理方法
    processDeviceData(rawData) {
      // 获取当前选中区域对应的 UUID 列表
      const targetUuids = this.getSelectedDeviceUuids();

      // 过滤原始数据，只保留目标区域的设备
      const filteredData = rawData.filter(device =>
        targetUuids.includes(device.uuid)
      );

      // 添加输入校验和常量声明
      const validData = Array.isArray(filteredData) ? filteredData : [];
      const DEFAULT_NAME = '继电器';

      const sortedDevices = validData.slice().sort((a, b) => {
        const getName = (device) =>
          (device && Object.prototype.hasOwnProperty.call(this.uuidMap, device.uuid))
            ? this.uuidMap[device.uuid]
            : DEFAULT_NAME;

        const nameA = getName(a);
        const nameB = getName(b);

        // 处理未登记设备排序逻辑
        if (nameA === DEFAULT_NAME && nameB !== DEFAULT_NAME) return 1;
        if (nameB === DEFAULT_NAME && nameA !== DEFAULT_NAME) return -1;

        return nameA.localeCompare(nameB, 'zh-Hans-CN', {
          sensitivity: 'accent',
          numeric: true
        });
      });

      this.devices = sortedDevices.reduce((acc, device, index) => {
        // 修改UUID生成方式
        const safeUUID = (device && device.uuid)
          ? `${device.uuid}`
          : `IND#${index}`;

        if (acc[safeUUID]) {
          console.warn(`发现重复设备UUID: ${safeUUID}`);
          return acc;
        }

        acc[safeUUID] = {
          load: this.parseLoadState(device.load),
          name: this.uuidMap[device.uuid] || DEFAULT_NAME
        };
        return acc;
      }, {});
    },

    // 新增负载状态解析方法
    parseLoadState(load) {
      if (Array.isArray(load)) return load.slice(0, 3);
      if (typeof load === 'string') return load.split('').slice(0, 3);
      return ['0', '0', '0'];
    },

    toggleRelay(uuid, index, currentState) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      let loadingInstance;
      try {
        loadingInstance = this.$loading({
          lock: true,
          text: '同步设备中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)',
        });

        if (!Array.isArray(this.loadingInstances)) {
          this.loadingInstances = [];
        }
        this.loadingInstances.push(loadingInstance);

        const selectedArea = this.selectedArea;
        const newState = currentState === '0' ? '1' : '0';
        setRelay(uuid, index, newState, selectedArea)
          .then(() => {
            // 更简洁的状态更新方式
            this.devices[uuid].load.splice(index, 1, newState);
            this.$forceUpdate(); // 确保视图刷新
          })
          .catch(this.handleError);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.closeLoading(loadingInstance);
        this.isLoading = false;
      }
    },

    getAreaName(areaId) {
      const area = this.areas.find(a => a.id === areaId);
      return area ? area.name : '未知区域';
    },

    handleAreaChange() {
      if (this.isRefreshing) return;
      this.isRefreshing = true;
      // this.isLoading = true;
      //
      // let loadingInstance;
      try {
        //   loadingInstance = this.$loading({
        //     lock: true,
        //     text: '正在同步设备状态...',
        //     spinner: 'el-icon-loading',
        //     background: 'rgba(0, 0, 0, 0.5)',
        //   });
        //
        //   if (!Array.isArray(this.loadingInstances)) {
        //     this.loadingInstances = [];
        //   }
        //   this.loadingInstances.push(loadingInstance);

        this.refreshDevicesWithNotice();

        // this.closeLoading(loadingInstance);
        //this.$message.success(`已选择区域：${this.getAreaName(areaId)}`);
      } catch (error) {
        this.handleError(error);
        // this.closeLoading(loadingInstance);
      } finally {
        this.isRefreshing = false;
        //this.isLoading = false;
      }
    },


    // async saveOrUpdate(row, done, loading, isAdd) {
    //   try {
    //     if (!row.openTime || !row.closeTime) {
    //       await this.showAlert('开灯时间和关灯时间不能为空！');
    //       return;
    //     }
    //
    //     if (row.openTime >= row.closeTime) {
    //       await this.showAlert('关灯时间必须晚于开灯时间！');
    //       return;
    //     }
    //
    //     row.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    //     const api = isAdd ? add : update;
    //
    //     if (row.status === 1) {
    //       const confirmed = await this.showConfirm(
    //         '启用该记录后，其他启用的记录将被标记为已取消，是否继续?'
    //       );
    //
    //       if (!confirmed) {
    //         row.status = 0;
    //         return;
    //       }
    //
    //       const updatedRows = this.data
    //         .filter((item) => item.id !== row.id && item.status === 1)
    //         .map((item) => ({
    //           id: item.id,
    //           status: 0,
    //           updateTime: row.updateTime,
    //         }));
    //
    //       if (updatedRows.length > 0) {
    //         await updateBatch(updatedRows);
    //       }
    //       await api(row);
    //     } else {
    //       await api(row);
    //     }
    //
    //     await this.onLoad(this.page);
    //     this.$message.success('操作成功!');
    //     done();
    //   } catch (error) {
    //     console.error('Save operation failed:', error);
    //     this.$message.error(
    //       (error.response && error.response.data && error.response.data.msg) ||
    //       '操作失败'
    //     );
    //   } finally {
    //     loading(false);
    //   }
    // },

    // showAlert(message) {
    //   return this.$alert(message, '友情提示', {
    //     confirmButtonText: '确定',
    //     type: 'warning',
    //   });
    // },
    //
    // showConfirm(message) {
    //   return this.$confirm(message, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => true)
    //     .catch(() => false);
    // },

    // rowSave(row, done, loading) {
    //   this.saveOrUpdate(row, done, loading, true);
    // },
    //
    // rowUpdate(row, index, done, loading) {
    //   this.saveOrUpdate(row, done, loading, false);
    // },
    //
    // rowDel(row) {
    //   this.$confirm('确定将选择数据删除?', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       return remove(row.id);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message.success('操作成功!');
    //     });
    // },

    // handleDelete() {
    //   if (this.selectionList.length === 0) {
    //     this.$message.warning('请选择至少一条数据');
    //     return;
    //   }
    //   this.$confirm('确定将选择数据删除?', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       return remove(this.ids);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message.success('操作成功!');
    //       this.$refs.crud.toggleSelection();
    //     });
    // },

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

    // handleUserInfo() {
    //   getUserInfo().then((res) => {
    //     const user = res.data.data;
    //     this.userInfo = {
    //       id: user.id,
    //       realName: user.realName,
    //     };
    //   });
    // },
  },
};
</script>

<style scoped>
/* Existing Styles */
.avue-crud .el-table__body-wrapper table td,
.avue-crud .el-table__header-wrapper table th {
  text-align: center;
}

basic-container {
  display: flex;
  flex-direction: column;
}

/* 主要内容容器 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Relay Control Styles (Updated for Horizontal Layout) */
.relay-control-container {
  margin-top: 20px;
}

.relay-control-container h3 {
  font-size: 16px;
  margin: 0 0 10px;
}

.ctrl-box {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding-top: 10px;
  padding-bottom: 20px; /* 底部留白 */
}

.device-item {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
  padding: 5px;
}

.device-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
  width: 280px;
}

.device-header .uuid {
  font-size: 14px;
  font-weight: normal;
  border: 1px solid #999;
  padding: 5px 8px;
  border-radius: 3px;
  background: #fff;
  text-align: center;
  word-break: break-all;
  max-width: 280px;
}

.relays {
  display: flex;
  gap: 10px;
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
  font-size: 12px;
}

.onoff > span.on,
.onoff > span.off {
  width: 40px;
  text-align: center;
  user-select: none;
  color: white;
  font-size: 12px;
}

.onoff > span.active {
  background: #0c0;
}

.onoff > span.pointer {
  background: #aaa;
  cursor: pointer;
}

.onoff > span.pointer:hover {
  color: #090;
}

/*!* 表格容器调整 *!*/
/*avue-crud {*/
/*  margin-top: 20px;*/
/*  min-height: 400px; !* 保证表格区域最小高度 *!*/
/*}*/

/*.mobile-button-group {*/
/*  gap: 10px !important;*/
/*  margin-top: 10px;*/
/*  margin-bottom: 10px;*/
/*}*/
.mobile-button-group {
  display: flex;
  gap: 10px !important;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* 响应式按钮宽度 */
.mobile-button-group button {
  width: 200px;
}

/* 移动端最小宽度 */

/* 继电器开关 */
.relays {
  flex-wrap: wrap;
  gap: 5px;
}

.onoff {
  flex: 1;
  min-width: 80px; /* 最小宽度保证可点击性 */
}

/*  > span {*/
/*    height: 28px;*/
/*    line-height: 28px;*/
/*    font-size: 11px;*/

/*    &.label {*/
/*      width: 25px;*/
/*    }*/

/*    &.on, &.off {*/
/*      width: 35px;*/
/*    }*/
/*  }*/
/*}*/

.loading-overlay {
  position: fixed !important; /* 强制固定定位 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: white;
  font-size: 16px;
  flex-direction: column;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-overlay i.el-icon-loading {
  font-size: 24px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.light-ctrl-container {
  display: flex;
  align-items: center;
  gap: 15px 30px;
  flex-wrap: wrap; /* 可选：支持小屏幕自动换行 */
}

.area-select {
  max-width: 200px;
}

/* 全局字号调整 */
h3 {
  font-size: 18px !important;
  margin: 0 0 15px !important;
}

/*::v-deep .avue-crud {*/
/*  width: 120vw !important;*/
/*  margin-left: -10px;*/
/*  .el-table {*/
/*    min-width: 90%; !* 保证表格内容完整显示 *!*/
/*  }*/

/*  .el-table__body-wrapper {*/
/*    overflow-x: auto !important;*/
/*    -webkit-overflow-scrolling: touch;*/
/*  }*/

/*  .el-table td,*/
/*  .el-table th {*/
/*    padding: 8px 4px !important;*/
/*    min-width: 80px !important; !* 列最小宽度 *!*/
/*  }*/

/*  .el-button--small {*/
/*    padding: 6px 8px !important;*/
/*  }*/
/*}*/


/* 在原有样式基础上增加以下内容 */
@media (max-width: 768px) {
  /* 基础容器调整 */
  /* .basic-container {
    padding: 10px;
  } */

  .mobile-button-group {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    margin-top: 10px;
  }

  .area-select {
    width: 100%;
  }

  .el-button {
    width: 100%;
    margin-left: 0; /* 移除按钮间隔 */
  }

  /* 响应式按钮宽度 */
  .mobile-button-group button {
    width: 100%;
  }

  /* 设备控制面板 */
  .relay-control-container {
    margin-top: 10px;
  }


  /* 设备项布局 */
  .device-item {
    flex-direction: column;
    padding: 8px;
    margin-top: 8px;
  }

  .device-header {
    margin-right: 0;
    margin-bottom: 5px;
  }

  .uuid {
    font-size: 12px;
    max-width: 100%;
    padding: 3px 5px;
  }
}

</style>
