<template>
  <basic-container>
    <SearchForm :searchForm="searchForm" @handleSubmit="handleSubmit">
      <template #operation="{ row }">
        <!-- <el-button @click="handleOpenDialog(row, 'see')" type="text" icon="el-icon-view">{{ $t('commonContent.see')
        }}</el-button>
        <el-button v-if="row.status === 1" @click="handleOpenDialog(row, 'edit')" type="text" icon="el-icon-edit">{{
          $t('commonContent.edit') }}</el-button> -->
        <!-- <el-button @click="downModel" type="text" icon="el-icon-download">下载模板</el-button> -->
      </template>
    </SearchForm>
    <el-table :data="tableData" border style="width: 100%">
      <!-- 字符串字段 -->
      <el-table-column prop="partsNumber" label="零件号" min-width="120" />
       <el-table-column prop="partsName" label="零件名称" min-width="120" />
      <el-table-column prop="projectName" label="项目名称" min-width="120" />
      <el-table-column prop="customName" label="客户名称" min-width="120" />
      <el-table-column prop="requireAttr" label="需求属性" min-width="120" />
      <el-table-column prop="po" label="PO" min-width="100" />
      <el-table-column
        prop="oldPartsNumber"
        label="历史零件号"
        min-width="140"
      />
      <el-table-column prop="englishName" label="英文名称" min-width="120" />
      <el-table-column prop="payPlace" label="交付地点" min-width="120" />
      <!-- 整数字段（右对齐） -->
      <el-table-column
        prop="customNeedNumber"
        label="客户要求数量"
        width="100"
        align="right"
      />
      <!-- <el-table-column
        prop="planPayNumber"
        label="计划交付数量"
        width="100"
        align="right"
      /> -->
      <el-table-column
        prop="supplierOrderQty"
        label="要求供应商数量"
        width="140"
        align="right"
      />
      <!-- 日期字段（居中，固定宽度，格式化） -->
      <!-- <el-table-column prop="etaLcb" label="ETA LCB" width="160" align="center">
        <template slot-scope="scope">{{
          scope.row.etaLcb | formatDateTime
        }}</template>
      </el-table-column>
      <el-table-column prop="etdSh" label="ETD SH" width="160" align="center">
        <template slot-scope="scope">{{
          scope.row.etdSh | formatDateTime
        }}</template>
      </el-table-column> -->
      <el-table-column
        prop="arrivalSomitWarehouseDate"
        label="到SOIMT仓库时间"
        width="160"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.arrivalSomitWarehouseDate | formatDateTime
        }}</template>
      </el-table-column>
      <el-table-column
        prop="forecastReleaseTime"
        label="预测释放时间"
        width="170"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.forecastReleaseTime | formatDateTime
        }}</template>
      </el-table-column>
      <el-table-column
        prop="orderReleaseTime"
        label="订单释放时间"
        width="160"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.orderReleaseTime | formatDateTime
        }}</template>
      </el-table-column>

      <!-- 布尔字段（居中，显示“是/否”） -->
      <el-table-column
        prop="isOrderOverdue"
        label="订单释放是否超交期"
        width="130"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.isOrderOverdue }}</template>
      </el-table-column>
      <el-table-column
        prop="isOrderReleasedToSupplier"
        label="订单是否释放给供应商"
        width="180"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.isOrderReleasedToSupplier
        }}</template>
      </el-table-column>
      <!-- 长文本字段 -->
      <el-table-column prop="remarks" label="备注" min-width="200" />
       <el-table-column
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text"  icon="el-icon-view" @click="viewDetail(scope.row)" >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="[10, 20, 50, 100]"
        :current-page="form.current"
        :page-size="form.size"
        :total="form.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <addOrderVue @getList="getList" ref="addOrderVueRef"></addOrderVue>
  </basic-container>
</template>

<script>
import { downBlobFile, isGoogleChrome, downloadFileBlob } from "@/util/util";
import CustomerOrderApi from "@/api/customerOrder/index";
import UploadApi from "@/api/upload";
import addOrderVue from './compontent/addOrder.vue';

export default {
  components: {addOrderVue},
  data() {
    return {
      stockStatus: null,
      type: null,
      partsNos: null,
      outStock: false,
      form: {
        current: 1,
        size: 10,
        total: 0,
      },
      searchForm: {
        uploadBtn: "/api/oa-portal/customPartsOrderInfo/importCustomPartFile",
        column: [
          {
            label: this.$t("stock.partsNo"),
            prop: "partsNumber",
          },
          // partsName,
        ],
        btnList: [
          {
            name: this.$t("orderManage.export"),
            icon: "el-icon-setting",
            onClick: () => {
              this.exportPageData();
            },
          },
          {
            name: "下载模板",
            icon: "el-icon-download",
            onClick: () => {
              this.downModel();
            },
          },
          {
            name: "新建",
            icon: "el-icon-circle-plus-outline",
            onClick: () => {
              this.addOrder();
            },
          },
        ],
      },
      tableData: [],
    };
  },

  activated() {
    this.init();
  },
  mounted() {
    this.init();
  },
  methods: {
    async downModel() {
      let obj = {
        url: "http://10.30.4.68:9000/license-prd/upload/20260326/ac02b550f481d9e4eacc1b656f3b1dde.xlsx",
      };
      let res = await UploadApi.getUrl(obj);
      if (isGoogleChrome()) {
        downloadFileBlob(res.data.data, "客户订单模板.xlsx");
      } else {
        window.open(res.data.data);
      }
    },
    viewDetail(row){
      this.$refs.addOrderVueRef.dialogFormVisible = true
      this.$refs.addOrderVueRef.getDetail(row)
      this.$refs.addOrderVueRef.isDetail = true
    },
    addOrder() {  
      this.$refs.addOrderVueRef.dialogFormVisible = true
      this.$refs.addOrderVueRef.getClean()
      this.$refs.addOrderVueRef.isDetail = false
    },
    handleSubmit(from) {
      this.getList(from);
    },
    async exportPageData() {
      let res = await CustomerOrderApi.exportCustomerOrder(this.form);
      // console.log(res);
      if (res.status === 200) {
        downBlobFile(res.data, "客户订单表.xlsx");
      }
    },
    handleSizeChange(val) {
      this.form.current = 1;
      this.form.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.current = val;
      this.getList();
    },
    initialization(table) {
      this.tableData = table;
    },
    init() {
      this.getList();
    },
    getList(form) {
      console.log(this.form);
      console.log(form);
      let obj = { ...this.form, ...form };
      console.log(obj);
      CustomerOrderApi.selectPage(obj).then((res) => {
        this.initialization(res.data.data.records);
        this.form.total = res.data.data.total;
      });
    },
    handleSelectionChange(val) {
      this.partsNos = val.map((item) => item.partsNo).join(",");
    },
    close(val) {
      this.outStock = false;
      if (val) {
        this.getList();
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
