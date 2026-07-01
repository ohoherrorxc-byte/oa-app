<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-06-20 10:03:53
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-11-14 09:58:08
 * @FilePath: \icarx-ui\src\components\searchForm\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 筛选 -->
  <!--
       * 非必填
       * delBtn 删除按钮
       * refreshBtn: 重置按钮
       * column  筛选框
       * btnList 按钮列表
       * type       按钮类型
       * name 按钮名称
       * icon    图标
       * onClick   按钮方法
  -->
  <avue-form
    v-if="searchForm"
    ref="form"
    v-model="form"
    :option="searchOption"
    @submit="handleSubmit"
  >
    <!-- 自定义 表单 -->
    <template
      v-for="item in formSlot"
      slot-scope="{ size, disabled }"
      :slot="item.prop"
    >
      <slot :name="item.prop" :size="size" :disabled="disabled"></slot>
    </template>
    <!-- 按钮列表 -->
    <template slot-scope="{ size }" slot="menuForm">
      <el-button
        v-if="searchOption.column && searchOption.refreshBtn"
        type="primary"
        :size="size"
        icon="el-icon-refresh"
        @click="refresh"
        >{{ $t("table.refresh") }}</el-button
      >
      <Upload
        v-if="searchOption.uploadBtn"
        :url="searchOption.uploadBtn"
        @handleRequest="handleSubmit"
        :size="size"
        :btnName="btnName"
        class="ml10 i-block"
      ></Upload>
      <el-button
        v-if="searchOption.downloadBtn"
        type="primary"
        :size="size"
        icon="el-icon-download"
        @click="downloadFn"
        >{{ $t("table.export") }}</el-button
      >
      <el-button
        v-for="item in searchForm.btnList"
        :key="item.name"
        :class="item.class"
        :type="item.type || 'primary'"
        :size="size"
        :icon="item.icon"
        @click="item.onClick(item)"
        >{{ item.name }}</el-button
      >
      <el-button
        v-if="searchOption.delBtn"
        :size="size"
        @click="handleDeleteData"
        icon="el-icon-delete"
        type="danger"
        plain
        >{{ $t("table.delete") }}</el-button
      >
      <slot name="menuForm" :size="size"></slot>
    </template>
  </avue-form>
</template>
<script>
import { download } from "@/util/excel";
import Upload from "@/components/upload";
import * as formSelectList from "@/util/formSelectList";
import request from "@/router/axios";
export default {
  components: {
    Upload,
  },
  props: {
    // 筛选 内容配置
    searchForm: {
      type: Object,
      default() {
        return null;
      },
    },
    btnName: {
      type: String,
    },
    // 多选数组
    multipleSelection: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      form: {},
      searchConfiguration: {
        size: "mini",
        span: 6,
        menuPosition: "left",
        submitText: this.$t("table.search"),
        submitIcon: "el-icon-search",
        emptyBtn: false,
        refreshBtn: true,
      },
    };
  },
  computed: {
    column() {
      const list = Object.keys(formSelectList);
      const column = this.searchForm.column || [];
      column.map((item, index) => {
        if (list.includes(item)) {
          column[index] = formSelectList[item];
        } else if (typeof item === "string") {
          column.splice(index, 1);
        }
      });
      return column;
    },
    searchOption() {
      return {
        submitBtn: !!this.searchForm.column,
        ...this.searchConfiguration,
        ...this.searchForm,
      };
    },
    formSlot() {
      const column = this.column || [];
      return column.filter((item) => {
        if (item) {
          return item.formSlot;
        }
      });
    },
  },
  methods: {
    getRange(form) {
      const column = this.searchForm.column || [];
      column.forEach((item) => {
        // 处理时间段
        if (
          (item.type === "datetimerange" ||
            item.type === "daterange" ||
            item.type === "monthrange") &&
          item.propRange instanceof Array
        ) {
          form[item.propRange[0]] = form[item.prop][0];
          form[item.propRange[1]] = form[item.prop][1];
        }
      });
    },
    isFunction(value) {
      return value instanceof Function;
    },
    // 搜索
    handleSubmit(form, done) {
      this.getRange(form);
      if (done && this.isFunction(done)) {
        done && done();
        this.$emit("input", form);
        this.$emit("handleSubmit", form, done);
      } else {
        this.$emit("input", form);
        this.$emit("handleSubmit", form);
      }
    },
    // 重置
    refresh() {
      this.$refs.form.resetForm();
      this.$emit("refresh", {});
    },
    // 删除
    handleDeleteData() {
      if (!this.multipleSelection.length) {
        this.$message.error(this.$t("table.atLeastOneData"));
        return;
      }

      this.$confirm(this.$t("table.confirmDelete"), {
        confirmButtonText: this.$t("table.confirm"),
        cancelButtonText: this.$t("table.cancel"),
        type: "warning",
      }).then(() => {
        let ids = this.multipleSelection.map((vehicleModel) => vehicleModel.id);
        ids = ids.join(",");

        request({
          url: this.searchOption.delBtn.url,
          method: "get",
          params: {
            ids,
          },
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.$message.success(this.$t("table.deleteSuccess"));
            } else {
              this.$message.error(
                `${this.$t("table.deleteFailed")},${res.data.msg}`
              );
            }
          })
          .catch((err) =>
            this.$message.error(
              `${this.$t("table.deleteFailed")},${err.data.msg}`
            )
          )
          .finally(() => {
            this.$refs.form.submit();
            this.$emit("handleDeleteData");
          });
      });
    },
    // 导出
    downloadFn() {
      this.$confirm(this.$t("table.confirmExport"), {
        confirmButtonText: this.$t("table.confirm"),
        cancelButtonText: this.$t("table.cancel"),
        type: "warning",
      })
        .then(() => {
          return request({
            url: this.searchOption.downloadBtn.url,
            method: "get",
            params: { ...this.searchOption.downloadBtn.params, ...this.form },
            responseType: "blob",
          });
        })
        .then((rsp) => {
          download(rsp);
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
