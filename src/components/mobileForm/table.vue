<template>
  <el-table ref="multipleTable" :data="data" class="mb20 table-now" @row-click="rowClick">
    <el-table-column type="index" width="50" label="序号"></el-table-column>
    <el-table-column
      v-for="item in option[0].column"
      :key="item.prop"
      align="center"
      :label="item.label"
      :prop="item.prop"
    />
    <el-table-column label="操作" align="center" v-if="!disabled">
      <template slot-scope="scope">
        <el-form-item>
          <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
        </el-form-item>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    data: {
      default: [],
    },
    option: {
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    rowClick(row, column, event) {
      console.log(row, column, event);
      this.$emit("show");
    },
  },
};
</script>