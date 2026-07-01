<template>
  <basic-container>
    <el-form label-width="120px">
      <el-row>
        <el-col span="12">
          <el-form-item label="发送人" prop="">
            <autoAddress
              placeholder=""
              ref="autoAddress"
              class="w-100"
              :initList="initList"
              @getPerson="getSendEmail"
              :initData="form.sendPersons"
              :disabled="isDetail"
              :multiple="true"
            ></autoAddress>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item label="抄送人员邮箱" prop="">
            <autoAddress
              placeholder=""
              ref="autoAddress"
              class="w-100"
              :initList="initListCC"
              @getPerson="getSendEmailCC"
              :initData="form.sendPersonsCC"
              :disabled="isDetail"
              :multiple="true"
            ></autoAddress>
          </el-form-item>
        </el-col>
        <el-col span="24">
          <el-form-item label="邮件正文">
            <el-input type="textarea"  :disabled="isDetail" v-model="form.emailRemark"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col span="12">
          <el-form-item label="供应商名称">
            <el-select v-model="form.supplierId" clearable filterable @change="getSupplierRow">
              <el-option
                v-for="item in supplyList"
                :key="item.id"
                :label="item.supplierName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item label="供应商编号">
            <div>{{ form.supplierNo }}</div>
          </el-form-item>
        </el-col> -->
        <el-col></el-col>
      </el-row>
    </el-form>
    <threeMonthVue
      ref="threeMonthRef"
      :isFlow="true"
      :formData="form"
    ></threeMonthVue>
  </basic-container>
</template>

<script>
import threeMonthVue from "@/views/substitute/supplierOrderTable/threeMonth.vue";
import UserApi from "@/api/organizationalStructure/user.js";
import autoAddress from "@/components/autoAddress/index";
import SupplierOrderStatusApi from "@/api/supplierOrderStatus/index";
export default {
  components: {
    threeMonthVue,
    autoAddress,
  },
  data() {
    return {
      initListCC: [],
      isDetail: false,
      initList: [],
      supplyList: [],
      planUserNames: [{ planEmail: "1458251589@qq.com" }],
      planUserList: [
        {
          userId: 1144,
          userName: "徐畅",
          planEmail: "xuchang2@saicmotor.com",
        },
      ],

      form: {
        supplierId: null,
        supplierNo: null,
        supplierOrderList: [],
        sendPersons: null,
        sendPersonsCC: null,
        sendPersonsCCList: [],
        sendPersonsList: [],
        emailRemark: null,
      },
    };
  },
  mounted() {
    this.getSupplier();
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.isDetail = this.businessId && !this.isEdit;
  },
  methods: {
    async getSupplier() {
      let res = await UserApi.contractSupplier("");
      if (res.data.code === 0 || res.data.code === 200) {
        this.supplyList = res.data.data;
      }
    },
    async getDetail() {
      let res = await SupplierOrderStatusApi.detail(this.businessId);
      if (res.data.code === 200 || res.data.code === 0) {
        this.form = res.data.data;
        this.form.sendPersons = this.form.sendPersons
          ? this.form.sendPersons.split(",")
          : [];
        this.form.sendPersonsCC = this.form.sendPersonsCC
          ? this.form.sendPersonsCC.split(",")
          : [];
        this.initList = this.form.sendPersonsList || [];
        this.initList.map((ele) => {
          ele.id = ele.userId.toString();
          ele.realName = ele.userName;
        });
        this.initListCC = this.form.sendPersonsCCList || [];
        this.initListCC.map((ele) => {
          ele.id = ele.userId.toString();
          ele.realName = ele.userName;
        });

        this.$emit("getFormData", this.form);
      }
    },
    getFormData() {
      delete this.form.planUserNames;
      delete this.form.planUserList;
      this.form.supplierOrderList = this.$refs.threeMonthRef.supplierOrderList;
      return this.form;
    },
    dealSendEmailCC(list) {
      console.log(list);
      // this.form.sendEmailListCC = list.map((ele) => ele.email);
      this.form.sendPersonsCC = list.map((ele) => ele.id);
      this.form.sendPersonsCCList = list;
      this.form.sendPersonsCCList.map((ele) => {
        ele.userId = ele.id;
        ele.userName = ele.realName;
        ele.planEmail = ele.email;
      });
      // this.form.sendEmailNames = list.map((ele) => ele.realName).toString();
      this.initListCC = list;
    },
    dealSendEmail(list) {
      // this.form.sendEmailList = list.map((ele) => ele.email);
      this.form.sendPersons = list.map((ele) => ele.id);
      this.form.sendPersonsList = list;
      this.form.sendPersonsList.map((ele) => {
        ele.userId = ele.id;
        ele.userName = ele.realName;
        ele.planEmail = ele.email;
      });
      // this.form.sendEmailNames = list.map((ele) => ele.realName).toString();
      this.initList = list;
    },
    getSendEmail(data, list) {
      this.dealSendEmail(list);
    },
    getSendEmailCC(data, list) {
      this.dealSendEmailCC(list);
    },
    getSendFormData() {
      this.form.planUserNames = this.planUserNames.toString();
      this.form.planUserList = this.planUserList;
      this.form.supplierOrderList = this.$refs.threeMonthRef.supplierOrderList;
      return this.form;
    },
    getSupplierRow() {
      let row = this.supplyList.find((ele) => {
        return ele.id === this.form.supplierId;
      });
      if (row) {
        this.form.supplierNo = row.supplierNo;
        this.$refs.threeMonthRef.getList();
      }
    },
    dealData() {
      this.form.sendPersons = this.form.sendPersons
        ? this.form.sendPersons.toString()
        : null;
      this.form.sendPersonsCC = this.form.sendPersonsCC
        ? this.form.sendPersonsCC.toString()
        : null;
    },
    testForm() {
      return true;
    },
  },
};
</script>

<style scoped>
</style>