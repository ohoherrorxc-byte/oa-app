<template>
  <div>
    <SearchForm
      v-if="searchForm"
      :multipleSelection="multipleSelection"
      :searchForm="searchForm"
      @handleSubmit="handleSubmit"
      @refresh="refresh"
      :btnName="btnName"
    >
      <template #menuForm>
        <slot name="menuForm"></slot>
      </template>
      <!-- 自定义 表单 -->
      <template
        v-for="item in formSlot"
        slot-scope="{ size, disabled }"
        :slot="item.prop"
      >
        <slot :name="item.prop" :size="size" :disabled="disabled"></slot>
      </template>
    </SearchForm>
    <slot name="other" :data="tableData"></slot>
    <!-- 表格 -->
    <!--
       * 表格列项数据 (必传)
       * label 表格列项名称
       * prop: ''
       * width 列项宽度
       * align       内容对齐方式 (默认居中)
       * headerAlign 表头对齐方式 (默认居中)
       * soltName    插槽名
    -->
    <el-table
      ref="table"
      v-loading="loading"
      v-sticky="sticky && { top: 0, parent: '#avue-view' }"
      @selection-change="selectionChange"
      class="table"
      :data="tableData"
      :border="hasBorder"
      :row-class-name="tableRowClassName"
      :row-key="rowKey"
      :height="height"
    >
      <el-table-column
        type="selection"
        width="50"
        v-if="selectionShow"
        :reserve-selection="reserveSelection"
      ></el-table-column>
      <!-- 序号 -->
      <el-table-column
        v-if="hasIndex"
        type="index"
        :label="$t('commonContent.serialNumber')"
        header-align="center"
        align="center"
        width="50"
      ></el-table-column>
      <!-- 其他 -->
      <template v-for="item in tableColumn.column">
        <el-table-column
          :fixed="item.fixed"
          :key="item.label"
          :sortable="item.sortable"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :header-align="item.headerAlign || 'center'"
          :align="item.align || 'center'"
          :show-overflow-tooltip="showOverflowTooltip"
          :formatter="item.formatter"
        >
          <template slot-scope="{ row, $index }">
            <!-- 维护记录 -->
            <el-button
              v-if="item.slotName === 'operation' && item.maintainRecordsType"
              @click="showMaintainRecords(row.id, item.maintainRecordsType)"
              type="text"
              icon="el-icon-view"
              >{{ $t("commonContent.maintainRecords") }}</el-button
            >
            <!-- 插槽列 -->
            <slot
              v-if="item.slotName"
              :name="item.slotName"
              :row="row"
              :index="$index"
            ></slot>
            <!-- 非插槽列  数据需处理-->
            <template v-else-if="item.formatter">
              {{ item.formatter(row) }}
            </template>
            <template v-else-if="item.click">
              <div @click="item.click(row)">
                {{ row[item.prop] }}
              </div>
            </template>
            <!-- 非插槽列  数据无需处理-->
            <template v-else>{{ row[item.prop.trim()] }}</template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination" v-if="paginationShow">
      <el-pagination
        background
        :hide-on-single-page="isShowPagination"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="current"
        :page-size="size"
        :total="tableDataTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 维护记录组件 -->
    <MaintainRecords
      v-if="maintainRecords"
      :params="maintainRecordsParams"
      @close="maintainRecords = false"
    >
    </MaintainRecords>
  </div>
</template>
<script>
import MaintainRecords from "@/components/maintainRecords";
import SearchForm from "@/components/searchForm";
import request from "@/router/axios";

export default {
  components: {
    MaintainRecords,
    SearchForm,
  },
  name: "BaseTable",
  props: {
    // 筛选 内容配置
    searchForm: {
      type: Object,
      default() {
        return () => {};
      },
    },
    canShowList: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
    },
    btnName: {
      type: String,
    },
    // 表格列项
    tableColumn: {
      type: Object,
      required: true,
      default: () => {},
    },
    showOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    // 获取数据 data 方法
    onLoad: {
      type: Function,
      default: null,
    },
    // 是否具有索引
    hasIndex: {
      type: Boolean,
      default: true,
    },
    // 是否显示边框
    hasBorder: {
      type: Boolean,
      default: true,
    },
    // 是否显示选择框
    selectionShow: {
      type: Boolean,
      default: false,
    },
    // 在数据更新之后保留之前选中的数据
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: Function,
      default: (row) => {
        return row.id;
      },
    },
    // 是否显示选分页器
    paginationShow: {
      type: Boolean,
      default: true,
    },
    // 是否设置表头吸顶
    sticky: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      form: {},
      // 表格数据
      tableData: [],
      // 多选 数组
      multipleSelection: [],
      // 表格当前页数
      current: 1,
      // 表格每页数量
      size: 10,
      //   表格总数
      tableDataTotal: 0,
      maintainRecordsParams: null,
      maintainRecords: false,
    };
  },
  async created() {
    // 如果 没有传入 onLoad 或者dicUrl 则不请求
    (this.onLoad || this.tableColumn.dicUrl) && this.getList();
  },
  computed: {
    // 计算是否显示分页器
    isShowPagination() {
      const isShow = this.tableDataTotal === 0;
      return isShow;
    },
    formSlot() {
      const column = this.searchForm.column || [];
      return column.filter((item) => item.formSlot);
    },
  },

  methods: {
    // 搜索
    handleSubmit(form, done) {
      done();
      this.form = form;
      this.current = 1;
      this.getList(form);
      this.$emit("handleSubmit", form);
    },
    // 重置
    refresh() {
      this.form = {};
      this.current = 1;
      this.getList();
    },
    request(params) {
      let data = params;
      if (this.tableColumn.type) {
        return request({
          url: this.tableColumn.dicUrl,
          method: this.tableColumn.type,
          data,
        });
      }
      return request({
        url: this.tableColumn.dicUrl,
        method: "get",
        params,
      });
    },
    // 获取列表
    async getList(params) {
      if (!this.canShowList) return;
      this.loading = true;
      const Fn = this.tableColumn.dicUrl ? this.request : this.onLoad;
      // 子组件会传入 分页
      if (params) {
        const { current, size } = params;
        if (current || size) {
          this.current = current || 1;
          this.size = size || 10;
        }
      }
      const { current, size } = this;
      this.form = { ...this.form, ...this.tableColumn.params, ...params };
      const searchForm = {
        ...this.form,
        current,
        size,
      };
      const {
        data: { data },
      } = await Fn(searchForm);
      // 是否有分页
      if (this.paginationShow) {
        this.tableData = data.records || data || [];
        this.tableDataTotal = data.total;
        this.current = data.current;
        this.size = data.size;
      } else {
        this.tableData = data;
      }
      this.loading = false;

      this.$emit("data", data);
      this.$emit("searchForm", searchForm);
    },
    // 表格变色
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "color-row";
      }
    },
    clickFn(event, item) {
      console.log(event);
      console.log(item);
    },
    // 修改当前页
    handleCurrentChange(val) {
      (this.current = val), this.getList(this.form);
    },
    // 修改每页数量
    handleSizeChange(val) {
      this.current = 1;
      this.size = val;
      this.getList(this.form);
    },
    // 选择框改变
    selectionChange(val) {
      this.$emit("selectionChange", val);
      this.multipleSelection = val;
    },
    // 用于多选表格，清空用户的选择
    clearSelection() {
      this.$refs.table.clearSelection();
    },
    // 维护记录
    showMaintainRecords(id, type) {
      this.maintainRecordsParams = { id, type };
      this.maintainRecords = true;
    },
  },
};
</script>
