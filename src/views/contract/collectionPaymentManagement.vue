<template>
  <basic-container>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>
            <span>收付款管理</span>
            <span style="float: right">
              <el-button
                icon="el-icon-plus"
                size="mini"
                type="primary"
                style="margin-left: 10px"
                @click="handleOpenDialog('', 'create')"
              >新增收付款记录</el-button>
            </span>
          </p>
        </basic-container>
      </el-col>
    </el-row>
    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="财务类型：">
          <el-checkbox-group v-model="query.countryReginCode">
            <el-checkbox label="回款"></el-checkbox>
            <el-checkbox label="付款"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="合同名称：">
          <template>
            <series-model v-model="query.seriesModels" :region="regionCode" :supplierType="1"></series-model>
          </template>
        </el-form-item>

        <el-form-item label="合同类型：">
          <el-select
            v-model="query.needStatisticsWeather"
            placeholder="请选择"
            style="width: 90%"
            clearable
          >
            <el-option
              v-for="item in statisticals"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成状态：">
          <el-select v-model="query.statusWeather" style="width: 90%" clearable>
            <el-option
              v-for="item in paymentStatuss"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人：">
          <el-input v-model.trim="query.vin" size="mini" />
        </el-form-item>

        <el-form-item label="预计时间：">
          <el-date-picker
            v-model="query.startActivationDate"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="执行时间：">
          <el-date-picker
            v-model="query.endActivationDate"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="我方：">
          <el-input v-model.trim="query.orderIdWeather" size="mini" />
        </el-form-item>
        <el-form-item label="对方：">
          <el-input v-model.trim="query.modelType" size="mini" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-on:click="searchChange" size="mini" icon="el-icon-search">查询</el-button>
          <el-button type="primary" v-on:click="searchChange" size="mini" icon="el-icon-search">重置</el-button>
          <el-button type="primary" icon="el-icon-download" size="mini" v-on:click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <!-- table 列表 -->
      <el-row>
        <el-table border :data="data" @selection-change="selectChange" style="width: 100%">
          <el-table-column prop="payReceiveName" align="center" label="收付款名称"></el-table-column>
          <el-table-column prop="seriesName" align="center" label="类型"></el-table-column>
          <el-table-column prop="payReceiveExpectAmount" align="center" label="收付款金额" width="130"></el-table-column>
          <el-table-column prop="payReceiveExpectTime" align="center" label="收付款时间" width="150" />
          <el-table-column prop="remark" align="center" label="备注" width="150" />
          <el-table-column prop="isDeleted" align="center" label="状态"></el-table-column>
          <el-table-column prop="statusTboxName" align="center" label="订单类型">
            <template slot-scope="scope">{{ scope.row.orderType | orderType }}</template>
          </el-table-column>
          <el-table-column prop="orderName" align="center" label="订单名称" />
          <el-table-column prop="statusTboxName" align="center" label="截图"></el-table-column>
          <el-table-column fixed="right" label="操作" width="170" align="center">
            <template slot-scope="scope">
              <el-button
                @click="handleOpenDialog(scope.row, 'edit')"
                type="text"
                icon="el-icon-edit"
              >编辑</el-button>
              <el-button
                @click="handleOpenDialog(scope.row, 'detail')"
                type="text"
                icon="el-icon-view"
              >关联订单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
            <p style="color: red" v-show="isShow">* 查询结果中车型存在多个预设供应商，请确认查询结果是否正确</p>
          </div>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-row>
        <el-pagination
          background
          :key="page.elementuiKey"
          :current-page.sync="page.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="page.total"
        ></el-pagination>
      </el-row>
    </el-card>

    <!-- 弹框2 -->
    <el-dialog :visible.sync="supplierDialogFormVisible" append-to-body @close="editDialogClose">
      <template slot="title">
        <div style="font-size: 15px" v-if="!isRelevance">收付款设置</div>
        <div style="font-size: 15px" v-if="isRelevance">关联订单</div>
      </template>
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        class="demo-ruleForm"
        v-if="!isRelevance"
      >
        <el-row>
          <el-form-item prop="status">
            <label slot="label">状态:</label>
            <el-radio-group v-model="editForm.status" :disabled="isShowDetail">
              <el-radio :label="0">未完成</el-radio>
              <el-radio :label="1">已完成</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="payReceiveName">
            <label slot="label">收付款名称：</label>
            <br />
            <el-input
              v-model="editForm.payReceiveName"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '收付款名称'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="payReceiveExpectAmount">
              <label slot="label">预计收付款金额：</label>
              <br />
              <el-input
                v-model="editForm.payReceiveExpectAmount"
                autocomplete="off"
                :placeholder="isShowDetail ? '' : '预计收付款金额'"
                style="width: 90%"
                :disabled="isShowDetail"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="payReceiveExpectTime">
              <label slot="label">预计收付款时间：</label>
              <br />
              <el-date-picker
                v-model="editForm.payReceiveExpectTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="isShowDetail"
                :placeholder="isShowDetail ? '' : '预计收付款时间'"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="payReceiveActualAmount">
              <label slot="label">实际收付款金额：</label>
              <br />
              <el-input
                v-model="editForm.payReceiveActualAmount"
                autocomplete="off"
                :placeholder="isShowDetail ? '' : '实际收付款金额'"
                style="width: 90%"
                :disabled="isShowDetail"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="payReceiveActualTime">
              <label slot="label">实际收付款时间：</label>
              <br />
              <el-date-picker
                v-model="editForm.payReceiveActualTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="isShowDetail"
                :placeholder="isShowDetail ? '' : '实际收付款时间'"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="remark">
            <label slot="label">详情：</label>
            <br />
            <el-input
              type="textarea"
              :rows="2"
              v-model="editForm.remark"
              autocomplete="off"
              :placeholder="isShowDetail ? '' : '详情'"
              style="width: 90%"
              :disabled="isShowDetail"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="openBank">
            <label slot="label">上传附件:</label>
            <br />
            <el-upload
              style="float: left"
              action="#"
              :placeholder="isShowDetail ? '' : '上传附件'"
              :disabled="isShowDetail"
              :before-upload="beforeUpload"
              :limit="1"
            >
              <el-button icon="el-icon-plus" size="mini" type="primary">上传附件</el-button>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <el-form
        :model="related"
        :rules="relatedRules"
        ref="relatedRef"
        class="demo-ruleForm"
        v-if="isRelevance"
      >
        <el-row>
          <el-form-item prop="orderType">
            <label slot="label">订单类型:</label>
            <br />
            <el-select v-model="related.orderType" style="width: 90%" clearable>
              <el-option
                v-for="item in paymentStatussa"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="relatedName">
            <label slot="label">订单名称:</label>
            <br />
            <el-select v-model="related.relatedName" style="width: 90%" filterable clearable>
              <el-option
                v-for="item in contractSupplierList"
                :key="item.id"
                :label="item.purchaseOrderName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="supplierDialogFormVisible = false"
            size="mini"
            icon="el-icon-circle-close"
          >取消</el-button>
          <el-button
            v-if="!isRelevance"
            type="primary"
            @click="addSupplier"
            size="mini"
            icon="el-icon-circle-check"
          >保存</el-button>
          <el-button
            v-if="isRelevance"
            type="primary"
            @click="addRelated"
            size="mini"
            icon="el-icon-circle-check"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  update,
  getVoiceSupplier,
  exportList,
} from "@/api/saic/weatherState.js";
import {
  payReceiveRecordList,
  payReceiveRecordAdd,
  bomPurchaseOrderList,
  purchaseOrderList,
  licensePurchaseOrderList,
} from "@/api/contract/contractSellAdd";
import { download } from "@/util/excel";
import { mapGetters } from "vuex";
import SeriesModel from "@/views/saic/series-model";
import constData from "@/config/constData";
import { getListAllP } from "@/api/contract/purchaseContractManage";
import { getListAllS } from "@/api/contract/saleContractManage";

export default {
  components: { SeriesModel },
  data() {
    return {
      related: {
        orderType: "",
        relatedName: "",
      },
      // 是否显示
      formVisible: false,
      // 是否查看
      viewMode: false,
      // dialog标题
      dialogTitle: "",
      // 列表查询数据
      query: {
        needStatisticsWeather: 1,
        supplierNameWeather: "",
        startActivationDate: "",
        endActivationDate: "",
        countryReginCode: "",
        orderIdWeather: "",
        statusWeather: "",
        orderIdTbox: "",
        statusTbox: "",
        vin: "",
        seriesModels: { model: "" },
        modelType: "",
        seriesModel: "",
        avnActive: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      loading: true,
      //table中数据
      data: [],
      multiSelection: [],
      contractSupplierList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        elementuiKey: 0,
      },
      // 校验规则
      rules: {
        supplierName: [
          { required: true, message: "供应商不能为空 ", trigger: ["blur"] },
        ],
      },
      // 表单映射模型
      supplierModel: {
        id: "",
        supplierName: "",
        carSeries: "",
        vehicleModel: "",
        snatched: "",
        price: "",
        currencyType: "",
        validity: "",
      },
      voiceState: {
        vin: "",
        needStatisticsWeather: "",
      },
      modelTypes: [
        {
          name: "网联",
          value: 0,
        },
        {
          name: "Color Radio Lite",
          value: 1,
        },
        {
          name: "Color Radio",
          value: 2,
        },
      ],
      //收款状态
      collectionStatuss: [
        // {
        //     name:'请选择',
        //     value:''
        // },
        {
          name: "出口确认",
          value: "1",
        },
        {
          name: "待开票",
          value: "2",
        },
        {
          name: "开票中",
          value: "3",
        },
        {
          name: "已开票",
          value: "4",
        },
        {
          name: "收款中",
          value: "5",
        },
        {
          name: "已收款",
          value: "6",
        },
      ],
      //付款状态
      paymentStatuss: [
        // {
        //   name:'请选择',
        //   value:''
        // },
        {
          name: "出口确认",
          value: 1,
        },
        {
          name: "待收票",
          value: 2,
        },
        {
          name: "收票中",
          value: 3,
        },
        {
          name: "已收票",
          value: 4,
        },
        {
          name: "付款中",
          value: 5,
        },
        {
          name: "已付款",
          value: 6,
        },
      ],
      statisticals: [
        // {
        //     name: '全部',
        //     value: ''
        // },
        {
          name: "是",
          value: 1,
        },
        {
          name: "否",
          value: 0,
        },
      ],
      avnActive: [
        {
          name: "否",
          value: 0,
        },
        {
          name: "是",
          value: 1,
        },
      ],
      countryCodes: [
        // {
        //     name: '全部',
        //     value: ''
        // },
        // {
        //     name: '欧盟',
        //     value: '3G02'
        // },
        // {
        //     name: '英国',
        //     value: '3G08'
        // },
        // {
        //     name: '泰国',
        //     value: '3G05'
        // },
        // {
        //     name: '印度',
        //     value: '3G07'
        // },
        // {
        //     name: '印尼',
        //     value: '3G16'
        // },
        // {
        //     name: '澳洲设计标准',
        //     value: '3F02'
        // }
      ],
      licenseSupplier: 1,
      voiceOptions: [],
      needStatisticsDialogVisible: false,
      promptWords: "",
      isShow: false,
      regionCode: "",
      supplierDialogFormVisible: false,
      isShowDetail: false,
      editForm: {
        id: "",
        status: 0,
        payReceiveName: "",
        payReceiveType: "",
        payReceiveExpectTime: "",
        payReceiveExpectAmount: "",
        payReceiveActualTime: "",
        payReceiveActualAmount: "",
        remark: "",
        contractType: null,
        contractName: "",
      },
      isRelevance: false,
      paymentStatussa: [
        {
          name: "一般合同付款订单",
          value: 1,
        },
        {
          name: "BOM合同付款订单",
          value: 2,
        },
        {
          name: "License付款订单",
          value: 3,
        },
      ],
      PList: [],
      SList: [],
      rows: {},
    };
  },
  filters: {
    orderType(val) {
      return ["一般合同付款订单", "BOM合同付款订单", "License付款订单"][
        val + 1
      ];
    },
  },
  created() {
    this.countryCodes = constData.countryList;
    this.query.orderIdWeather = this.$route.query.orderNumber;
    this.onLoad(this.page, this.query);
    // this.getPList();
    // this.getSList();
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    ids() {
      let ids = [];
      this.multiSelection.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  watch: {
    "related.orderType": {
      handler(newVal, oldVal) {
        this.related.relatedName = "";
        newVal && this.getContractSupplierList();
      },
    },
  },
  methods: {
    getContractSupplierList(url) {
      const objOrder = {
        1: purchaseOrderList,
        2: bomPurchaseOrderList,
        3: licensePurchaseOrderList,
      };
      objOrder[this.related.orderType]().then((res) => {
        const { data, code } = res.data;
        if (code == 0) {
          this.contractSupplierList = data;
        }
      });
    },
    onLoad(page, params = {}) {
      this.loading = true;
      this.isShow = false;
      // !this.seriesModel.model || (values.seriesModel = this.seriesModel.model)
      payReceiveRecordList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        // debugger
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;
      });
      this.loading = false;
    },
    getPList(params) {
      console.log(this.queryInfo);
      getListAllP(this.queryInfo.pageNum, this.queryInfo.pageSize, params).then(
        (res) => {
          this.PList = res.data.data;
        }
      );
    },
    getSList(params) {
      getListAllS(this.queryInfo.pageNum, this.queryInfo.pageSize, params).then(
        (res) => {
          this.SList = res.data.data;
        }
      );
    },
    searchChange() {
      this.query.seriesModel = this.query.seriesModels.model;
      if (
        (this.query.countryReginCode == null ||
          this.query.countryReginCode.length == 0) &&
        (this.query.vin == null || this.query.vin.length == 0) &&
        (this.query.orderIdWeather == null ||
          this.query.orderIdWeather.length == 0)
      ) {
        this.$message({
          type: "warning",
          message: "国家地区 / VIN / 付款订单号 必须选择其中一项",
        });
        return;
      }
      this.page.currentPage = 1;
      this.page.elementuiKey = 1;
      this.onLoad(this.page, this.query);
    },
    reSet() {
      debugger;
      this.query = {};
      // this.regionCode = "";
      this.query.seriesModels = { model: "" };
    },
    selectChange(val) {
      this.multiSelection = val;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },
    // scope.row.needStatisticsVoice
    countryCodesFormat(row, column) {
      const daterc = row[column.property];
      if (daterc) {
        // if(daterc == '3G02'){
        //     return "欧盟";
        // }else if(daterc == '3G08'){
        //     return "英国";
        // }else if(daterc == '3G05'){
        //     return "泰国";
        // }else if(daterc == '3G07'){
        //     return "印度";
        // }else if(daterc == '3G16'){
        //     return "印尼";
        // }else if(daterc == '3F02'){
        //     return "澳洲设计标准";
        // }
        for (let i = 0; i < this.countryCodes.length; i++) {
          if (daterc == this.countryCodes[i].value) {
            return this.countryCodes[i].label;
          }
        }
      }
    },
    formatterData(row, column) {
      const daterc = row[column.property];
      const statusWeather = row["statusWeather"];
      debugger;
      // if(daterc == '-1') {
      //     return '';
      // }else
      if (
        !(
          statusWeather == 3 ||
          statusWeather == 4 ||
          statusWeather == 5 ||
          statusWeather == 6
        )
      ) {
        return "";
      } else {
        return daterc;
      }
    },
    changSwitchState($event, row, index) {
      debugger;
      this.voiceState.vin = row.vin;
      this.voiceState.needStatisticsWeather = row.needStatisticsWeather;
      let tips = "车辆：" + this.voiceState.vin;
      if (
        this.voiceState.needStatisticsWeather == -1 ||
        this.voiceState.needStatisticsWeather == 0
      ) {
        tips += "是否加入统计";
      } else {
        tips += "是否取消统计";
      }
      this.$confirm(tips, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          debugger;
          if (
            this.voiceState.needStatisticsWeather == -1 ||
            this.voiceState.needStatisticsWeather == 0
          ) {
            this.voiceState.needStatisticsWeather = 1;
          } else {
            this.voiceState.needStatisticsWeather = 0;
          }
          update(this.voiceState).then((res) => {
            if (res.data.success) {
              this.$message({ type: "success", message: "提交成功!" });
              this.resetForm();
            } else {
              this.$message({ type: "error", message: res.data.msg });
            }
            // debugger
            this.onLoad(this.page, this.query);
          });
        })
        .then((res) => {
          this.onLoad(this.page, this.query);
        });
    },
    handleShow(row) {
      // this.needStatisticsdialogTitle ="提示";
      this.needStatisticsDialogVisible = true;
      this.voiceState.vin = row.vin;
      this.voiceState.needStatisticsWeather = row.needStatisticsWeather;
    },
    needStatisticsCancel() {
      this.needStatisticsDialogVisible = false;
      this.voiceState = {};
    },
    needStatisticsClick() {
      // debugger
      this.needStatisticsDialogVisible = false;
      if (
        this.voiceState.needStatisticsWeather == -1 ||
        this.voiceState.needStatisticsWeather == 0
      ) {
        this.voiceState.needStatisticsWeather = 1;
      } else {
        this.voiceState.needStatisticsWeather = 0;
      }
      update(this.voiceState).then((res) => {
        if (res.data.success) {
          this.$message({ type: "success", message: "提交成功!" });
          this.resetForm();
        } else {
          this.$message({ type: "error", message: res.data.msg });
        }
        // debugger
        this.onLoad(this.page, this.query);
      });
    },
    resetForm(formName) {
      // this.$refs[formName].clearValidate();
      this.voiceState = {};
    },
    handleExport() {
      debugger;
      if (
        (this.query.countryReginCode == null ||
          this.query.countryReginCode.length == 0) &&
        (this.query.vin == null || this.query.vin.length == 0) &&
        (this.query.orderIdVoice == null || this.query.orderIdVoice.length == 0)
      ) {
        this.$message({
          type: "warning",
          message: "国家地区 / VIN / 付款订单号 必须选择其中一项",
        });
        return;
      }
      this.$confirm("是否确定导出数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.query.seriesModel = this.query.seriesModels.model;
          return exportList(this.query);
        })
        .then((res) => {
          download(res);
        });
    },
    handleOpenDialog(row, type) {
      this.isShowDetail = false;
      switch (type) {
        case "detail":
          //this.isShowDetail = true;
          this.rows = row;
          this.isRelevance = true;
          break;
        case "edit":
          this.setRowValue(row);
          this.isRelevance = false;
          break;
        case "create":
          this.resetEditForm();
          this.isRelevance = false;
          break;
      }
      this.supplierDialogFormVisible = true;
    },
    resetEditForm() {
      this.editForm.id = "";
      this.editForm.payReceiveName = "";
      this.editForm.payReceiveType = "";
      this.editForm.payReceiveExpectTime = "";
      this.editForm.payReceiveExpectAmount = "";
      this.editForm.payReceiveActualTime = "";
      this.editForm.payReceiveActualAmount = "";
      this.editForm.remark = "";
      this.editForm.status = 0;
    },
    setRowValue(row) {
      console.log("row-->" + JSON.stringify(row));
      this.editForm.id = row.id;
      this.editForm.payReceiveName = row.payReceiveName;
      this.editForm.payReceiveType = row.payReceiveType;
      this.editForm.payReceiveExpectTime = row.payReceiveExpectTime;
      this.editForm.payReceiveExpectAmount = row.payReceiveExpectAmount;
      this.editForm.payReceiveActualTime = row.payReceiveActualTime;
      this.editForm.payReceiveActualAmount = row.payReceiveActualAmount;
      this.editForm.remark = row.remark;
      this.editForm.status = row.status;
    },
    beforeUpload(file) {
      console.log("res--->" + JSON.stringify(res));
    },
    addSupplier() {
      console.log("add");
      payReceiveRecordAdd(this.editForm)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
        .finally(() => {
          this.page.currentPage = 1;
          this.page.elementuiKey = 1;
          this.onLoad(this.page, this.query);
          this.supplierDialogFormVisible = false;
        });
    },
    // 关联订单
    addRelated() {
      this.rows.orderType = this.related.orderType;
      this.rows.orderId = this.related.relatedName;
      // const related = this.contractSupplierList.find(item=> this.related.relatedName == item.id )
      // related.orderType = this.related.orderType
      payReceiveRecordAdd(this.rows)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "关联成功",
              type: "success",
            });
            this.related = {
              relatedName: "",
              orderType: "",
            };
            this.contractSupplierList = [];
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => this.$message.error(`关联失败,${err.data.msg}`))
        .finally(() => {
          this.supplierDialogFormVisible = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-pagination {
  position: relative;
  text-align: right;
  padding: 25px 0 20px 20px;
}
.el-form .el-select {
  width: 100%;
}
</style>
