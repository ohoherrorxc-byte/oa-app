<template>
  <div>
    <basic-container>
      <div class="table-title-first">
        <div class="titleFirst"><span class="spanLine"></span>基本信息</div>
      </div>
    </basic-container>
    <orderManage
      ref="supplierOrderChangeRef"
      :formData="formData"
      :isUpdateFlow="false"
      :isDetailFlow="isDetail"
    ></orderManage>
  </div>
</template>

<script>
import orderManage from "@/views/substitute/orderManage/addOrUpdate.vue";
import PartsUpdateApi from "@/api/partsUpdate/index";
import substituteOrderManageApi from "@/api/substitute/orderManage";
import supplierOrderSendApi from "@/api/supplierOrderSend/index";
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
    this.isDetail = this.businessId && !this.isEdit;
  },
  methods: {
    async getDetail() {
      let res = await supplierOrderSendApi.detail(this.businessId);
      if (res.data.code === 200) {
        let data = res.data.data;
        this.formData.orderType = data.orderType;
        this.formData.id = data.id;
        this.formData.orderName = data.orderName;
        this.formData.orderNo = data.orderNo;
        this.formData.createTime = data.orderCreateTime;
        this.formData.supplierNo = data.supplierNo;
        this.formData.planUserIds = data.planUserIds;
        this.formData.sendEmailPersons = data.sendEmailPersons;
        this.formData.supplierPhone = data.supplierPhone;
        this.formData.emailRemark = data.emailRemark;
        this.formData.detailDtoList = data.detailDtoList;
        this.formData.isAssembly = data.isAssembly
        this.formData.requireAttr = data.requireAttr
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
        this.formData.rowEmailList = data.rowEmailList || [];
        this.formData.sendEmailNames = (data.rowEmailList || [])
          .map((ele) => ele.realName)
          .toString();
        this.formData.rowEmailList.map((ele) => {
          ele.userId = ele.id;
          ele.userName = ele.realName;
        });
        this.formData.initList = this.formData.rowEmailList;
        this.formData.deliverDtos = data.deliverDtos;
        this.$refs.supplierOrderChangeRef.getFormData(this.formData);
        this.form.titleName = data.titleName;
        this.form.applyTime = data.applyTime;
        this.form.id = data.id
        this.form.approvalCode = data.approvalCode
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
    getFormData() {
      this.dealData();
      return this.form;
    },
    async dealData() {
      let formData = this.$refs.supplierOrderChangeRef.getFromCur();
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
      this.dealData();
      if(this.form.orderType===undefined||this.form.orderType==null||this.form.orderType===""){
        this.$message.error('请选择订单类型')
        return false
      }else if(!this.form.supplierNo){
        this.$message.error('请选择供应商')
        return false
      }else if(!this.form.planUserList){
        this.$message.error('请选择计划员')
        return false
      }
       // 提交时在标题上加上供应商名称
      if(this.form.supplierName){
        this.form.titleName = this.form.titleName + ' - ' + this.form.supplierName
      }
      return this.$refs.supplierOrderChangeRef.testForm()
    },
  },
};
</script>