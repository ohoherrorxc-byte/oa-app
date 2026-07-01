<template>
  <div>
    <basic-container>
      <div class="table-title-first">
        <div class="titleFirst"><span class="spanLine"></span>基本信息</div>
        <el-row class="pt20">
          <el-form label-width="120px">
            <el-col :span="12">
              <el-form-item label="原始订单名称">
                <el-select
                  v-model="form.originalSupplierOrderNo"
                  filterable
                  :disabled="isDetail"
                  @change="changeOrderRow"
                >
                  <el-option
                    v-for="item in orderList"
                    :key="item.orderNo"
                    :label="item.orderName"
                    :value="item.orderNo"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原始订单号">
                <el-select
                  v-model="form.originalSupplierOrderNo"
                  filterable
                  :disabled="isDetail"
                  @change="changeOrderRow"
                >
                  <el-option
                    v-for="item in orderList"
                    :key="item.orderNo"
                    :label="item.orderNo"
                    :value="item.orderNo"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </basic-container>
    <orderManage
      ref="supplierOrderChangeRef"
      :formData="formData"
      :isUpdateFlow="true"
      :isDetailFlow="isDetail"
    ></orderManage>
  </div>
</template>

<script>
import orderManage from "@/views/substitute/orderManage/addOrUpdate.vue";
import PartsUpdateApi from "@/api/partsUpdate/index";
import substituteOrderManageApi from "@/api/substitute/orderManage";
import supplierOrderChangeApi from "@/api/supplierOrderChange/index";
export default {
  data() {
    return {
      businessId: null,
      categoryForm: null,
      form: null,
      orderList: [],
      currentId: null,
      form: {
        originalSupplierOrderNo: null,
        originalSupplierOrderId: null,
      },
      formData: {},
      isDetail: false,
    };
  },
  components: { orderManage },
  created() {},
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.getOrderList();
    this.isDetail = this.businessId && !this.isEdit;
  },
  methods: {
    async getDetail() {
      let res = await supplierOrderChangeApi.detail(this.businessId);
      if (res.data.code === 200) {
        let data = res.data.data;
        this.formData.orderType = data.orderType;
        this.formData.orderName = data.orderName;
        this.formData.orderNo = data.orderNo;
        this.formData.createTime = data.orderCreateTime;
        this.formData.supplierNo = data.supplierNo;
        this.formData.planUserIds = data.planUserIds;
        this.formData.sendEmailPersons = data.sendEmailPersons;
        this.formData.supplierPhone = data.supplierPhone;
        this.formData.emailRemark = data.emailRemark;
        this.formData.detailDtoList = data.detailDtoList;
        this.formData.planUserList = data.planUserList || [];
        this.$set(this.formData, "planUserIds", []);
        if (this.formData.planUserList.length > 0) {
          this.formData.planUserNames = data.planUserList
            .map((ele) => ele.userName)
            .toString();
          let arr = this.formData.planUserList.map((ele) => ele.userId);
          this.formData.planUserIds = [...arr];
        }
        this.formData.sendEmailList = data.sendEmailList
          ? data.sendEmailList.split(",")
          : [];
        this.formData.sendEmailPersons = data.sendEmailPersons
          ? data.sendEmailPersons.split(",")
          : [];
        this.formData.deliverDtos = data.deliverDtos;
        this.$refs.supplierOrderChangeRef.getFormData(this.formData);
        this.form.titleName = data.titleName;
        this.form.applyTime = data.applyTime;
        this.form.createDept = data.createDept;
        this.form.createDeptName = data.createDeptName;
        this.form.createTime = data.createTime;
        this.form.createUser = data.createUser;
        this.form.createUserName = data.createUserName;
        this.form.originalSupplierOrderId = data.originalSupplierOrderId;
        this.form.originalSupplierOrderNo = data.originalSupplierOrderNo;
        this.currentId = data.originalSupplierOrderId;
        this.form.flow = data.flow;
        this.form.processDefinitionId = data.processDefinitionId;
        this.form.processInstanceId = data.processInstanceId;
        this.form.fileList = this.form.fileList || [];
        this.form.processDefinitionId = data.processDefinitionId;
        this.$emit("getFormData", this.form);
      }
    },
    changeOrderRow() {
      let row = this.orderList.find((ele) => {
        return ele.orderNo === this.form.originalSupplierOrderNo;
      });
      if (row) {
        this.formData = JSON.parse(JSON.stringify(row));
        this.formData.orderId = row.id;
        this.form.originalSupplierOrderId = row.id;
        this.form.originalSupplierOrderNo = row.orderNo;
        this.currentId = row.id;
        this.formData.id = null;
        this.$refs.supplierOrderChangeRef.getFormData(this.formData);
      }
    },
    async getOrderList() {
      let res = await substituteOrderManageApi.selectList();
      if (res.data.code === 0 || res.data.code === 200) {
        this.orderList = res.data.data;
      }
    },
    getFormData() {
      this.dealData();
      return this.form;
    },
    async dealData() {
      let formData = this.$refs.supplierOrderChangeRef.getFromCur();
        console.log(formData)
        console.log(this.form)
      formData.id = null;
      this.form = { ...this.form, ...formData };
      this.form.orderCreateTime = formData.createTime;
      this.form.sendEmailList = this.form.sendEmailList.toString();
      this.form.sendEmailPersons = this.form.sendEmailPersons.toString();
      this.form.planUserIds = this.form.planUserIds.toString()
      this.form.originalSupplierOrderId = this.currentId;
      this.form.detailList = this.form.deliverDtos;
      this.form.sendEmailList = this.form.sendEmailList.toString()
      console.log(this.form);
    },
    // submit(){
    //     if( this.isSubMaint){
    //         this.$refs.partSubMaintRef.handleSubmit()
    //     }else{
    //         this.$refs.partsMaintenanceRef.handleSubmit()
    //     }
    // },
    testForm() {
      return true;
    },
  },
};
</script>