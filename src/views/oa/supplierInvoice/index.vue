<template>
  <basic-container>
    <el-form :model="form">
      <el-row>
        <el-col span="5">
          <el-form-item label="供应商名称" label-width="120px">
            <el-input
              v-model="queryInfo.supplierName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col span="5">
          <el-form-item label="付款标题" label-width="120px">
            <el-input
              v-model="queryInfo.payApplyName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
          <el-col span="5">
          <el-form-item label="BOM订单编号" label-width="120px">
            <el-input
              v-model="queryInfo.orderCode"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
          <el-col span="5">
          <el-form-item label="供应商发票编号" label-width="120px">
            <el-input
              v-model="queryInfo.supplierInvoiceNo"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col span="5">
          <el-form-item label="供应商发票状态" label-width="120px">
            <!-- 待提交；待开票；审核中；已退回；审核通过； -->
            <el-select v-model="queryInfo.supplierInvoiceStatus">
              <el-option value="待提交" label="待提交"></el-option>
              <el-option value="待开票" label="待开票"></el-option>
              <el-option value="审核中" label="审核中"></el-option>
              <el-option value="已退回" label="已退回"></el-option>
              <el-option value="审核完成" label="审核完成"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8" class="pl20">
          <el-button type="primary" @click="getList" class="mb10"
            >查 询</el-button
          >
          <el-button @click="reflesh">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="addNew" class="mb10">新 建</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="supplierInvoiceNo"
        label="供应商发票编号"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" width="120">
      </el-table-column>
      <el-table-column
        prop="supplierInvoiceStatus"
        label="发票状态"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="120">
      </el-table-column>
      <el-table-column prop="orderName" label="订单标题" width="120">
      </el-table-column>
      <el-table-column prop="orderType" label="订单类型" width="120">
      </el-table-column>
      <el-table-column prop="orderCode" label="订单编号" width="120">
      </el-table-column>
      <el-table-column prop="bomContractName" label="合同标题" width="120">
      </el-table-column>
      <el-table-column prop="payType" label="付款流程类型" width="120">
      </el-table-column>
      <el-table-column prop="payApplyName" label="付款标题" width="120">
      </el-table-column>
      <el-table-column prop="payNo" label="付款编号" width="120">
      </el-table-column>
      <el-table-column prop="payTime" label="付款时间" width="120">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="120">
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
          <el-button type="text" @click="downUrl(scope.row)">下载</el-button>
          <el-button
            type="text"
            @click="detailRow(scope.row)"
            v-if="scope.row.supplierInvoiceStatus !== '审核通过'"
            >审核</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      v-if="!isSwiper"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.current"
      :page-sizes="[2, 5, 10, 20, 50]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog
      :append-to-body="true"
      title="新增供应商发票"
      :visible.sync="dialogFormVisible"
      width="80%"
    >
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :disabled="disabled || userInfo.role_name === '供应链供应商'"
      >
        <el-form-item label="供应商名称" label-width="120px">
          <el-select
            @change="getSupplyRow"
            v-model="form.supplierNo"
            clearable
            filterable
          >
            <el-option
              v-for="item in contractSupplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.supplierNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商编号" label-width="120px">
          <el-input
            v-model="form.supplierNo"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="订单类型" label-width="120px">
          <el-select v-model="form.orderType" @change="getOrderList">
            <el-option
              label="BOM框架合同订单"
              value="BOM框架合同订单"
            ></el-option>
            <el-option label="一般采购合同" value="一般采购合同"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单流程" label-width="120px">
          <el-select
            v-model="form.orderId"
            autocomplete="off"
            clearable
            filterable
          >
            <el-option
              v-for="item in orderList"
              :key="item.id"
              :value="item.id"
              :label="item.titleName"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="BOM订单编号" label-width="120px">
            {{form.orderCode}}
         </el-form-item>
        <el-form-item label="支付流程类型" label-width="120px">
          <el-select v-model="form.payType" @change="getInvoiceList">
            <el-option
              label="BOM框架合同付款"
              value="BOM框架合同付款"
            ></el-option>
            <el-option
              label="一般采购合同付款"
              value="一般采购合同付款"
            ></el-option>
            <el-option label="零星支付" value="零星支付"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付流程" label-width="120px">
          <el-select
            v-model="form.payId"
            autocomplete="off"
            clearable
            filterable
          >
            <el-option
              v-for="item in invoiceList"
              :key="item.id"
              :value="item.id"
              :label="item.titleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="发票编号"
          label-width="120px"
          prop="supplierInvoiceNo"
        >
          <el-input
            v-model="form.supplierInvoiceNo"
            autocomplete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input
            v-model="form.remark"
            autocomplete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
          <div class="fr">
            <span class="add-icon" @click="addDetailRow">+</span>
            <!-- <span class="dec-icon" @click="deleteDetailRow">―</span> -->
          </div>
          <el-table :data="form.detailList" style="width: 100%">
            <el-table-column prop="date" label="产品名称" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.partsNo"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="单价" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unitPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="数量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.quantity"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="金额" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.amount"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="发票详情备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.detailRemark"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              v-if="!disabled && userInfo.role_name !== '供应链供应商'"
              width="50"
            >
              <template slot-scope="scope">
                <el-button
                  @click="deleteRow(scope.row, scope.$index)"
                  type="text"
                  style="color: red"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form>
          <!-- :disabled="userInfo.role_name !== '供应链供应商'||disabled" -->
          <el-form-item label="上传附件" label-width="120px">
            <upload
              btnName="上传"
              :fileList="form.fileList"
              :showFileList="true"
              @handleRequest="handleRequest"
              :multiple="false"
            ></upload>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button @click="check(0)">拒 绝</el-button>
        <el-button type="primary" @click="check(1)">同 意</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import SupplierInvoiceApi from "@/api/supplierInvoice/index";
import { downloadFileBlob } from "@/util/util";
import upload from "@/components/upload";
import { getContractSupplierList } from "@/api/contract/contractSupplier";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      invoiceList: [],
      orderList: [],
      dialogFormVisible: false,
      queryInfo: {
        current: 1,
        size: 10,
        supplierName: null,
        payApplyName: null,
      },
      contractSupplierList: [],
      fileList: [],
      total: null,
      form: {
        detailList: [],
        fileList: [],
      },
      disabled: false,
      rules: {
        supplierInvoiceNo: [
          { required: true, message: "请输入发票编号", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: { upload },
  created() {
    this.getList();

    this.getContractSupplierList();
  },
  methods: {
    addNew() {
      this.dialogFormVisible = true;
      this.form = {
        supplierName: null,
        supplierNo: null,
        payType: null,
        invoiceNumbers: null,
        remark: null,
        supplierInvoiceNo: null,
        orderType: null,
        detailList: [{}],
        payType: null,
        fileList: [],
      };
      console.log(this.form);
      this.fileList = [];
      this.disabled = false;
    },
    deleteRow(row, index) {
      this.form.detailList.splice(index, 1);
    },
    async check(type) {
      let obj = {
        id: this.form.id,
        approvalStatus: type,
      };
      let res = await SupplierInvoiceApi.approvalSupplierInvoice(obj);
      if (res.data.code === 0 || res.data.code === 200) {
        this.dialogFormVisible = false;
        type === 0
          ? this.$message.warning("已拒绝")
          : this.$message.success("已同意");
        this.getList();
      }
    },
    addDetailRow() {
      // console.log(this.form)
      this.form.detailList.push({});
    },
    deleteDetailRow() {},
    async getContractSupplierList() {
      let res = await getContractSupplierList({});
      this.contractSupplierList = res.data.data;
    },
    async getInvoiceList() {
      let res = await SupplierInvoiceApi.listInvoice(this.form.payType);
      this.invoiceList = res.data.data;
    },
    async getOrderList() {
      let res = await SupplierInvoiceApi.listOrder(this.form.orderType);
      this.orderList = res.data.data;
    },
    async getList() {
      SupplierInvoiceApi.getList(this.queryInfo).then((res) => {
        this.tableData = res.data.data.records;
        this.total = res.data.data.total;
      });
    },
    getSupplyRow() {
      let row = this.contractSupplierList.find((ele) => {
        return ele.supplierNo === this.form.supplierNo;
      });
      this.form.supplierName = row.supplierName;
    },
    reflesh() {
      this.queryInfo.current = 1;
      this.queryInfo.size = 10;
      this.queryInfo.supplierName = null;
      this.queryInfo.payApplyName = null;
      this.queryInfo.supplierInvoiceStatus = null;
       this.queryInfo.orderCode = null;
      this.queryInfo.supplierInvoiceNo = null;
      this.getList();
    },
    async save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await SupplierInvoiceApi.add(this.form);
          if (res.data.code === 0 || res.data.code === 200) {
            this.$message.success("保存成功");
            this.dialogFormVisible = false;
            this.getList();
          }
        } else {
        }
      });
    },
    handleRequest(data, list) {
      console.log(list);
      this.form.fileList = list;
      this.form.fileList.forEach((file) => {
        delete file.status;
      });
      // this.form.url = data1[0].url
      // this.form.name = data1[0].name
      // this.form.downUrl = data1[0].temUrl
    },
    handleCurrentChange(val) {
      this.queryInfo.current = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.queryInfo.size = val;
      this.getList();
    },
    async editRow(row) {
      this.disabled = false;
      this.dialogFormVisible = true;
      let res = await SupplierInvoiceApi.detail(row.id);
      this.form = res.data.data;
      this.getInvoiceList();
      this.getOrderList();

      //  if (this.form.url) {
      //    this.fileList = [{ url: this.form.url, name: this.form.name, temUrl: this.form.downUrl }]
      // }

      this.fileList = this.form.fileList;
    },
    async detailRow(row) {
      this.dialogFormVisible = true;
      let res = await SupplierInvoiceApi.detail(row.id);
      this.form = res.data.data;
      this.getInvoiceList();
      this.fileList = this.form.fileList;

      this.disabled = true;
    },
    downUrl(row) {
      downloadFileBlob(row.downUrl, row.name);
    },
  },
};
</script>
