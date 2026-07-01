<template>
  <basic-container>
    <div class="table-title-first">
      <div class="titleFirst"><span class="spanLine"></span>订单信息</div>
      <div class="blue" @click="isFold = !isFold">
        {{ isFold ? "展开" : "折叠" }}
      </div>
    </div>
    <el-form
      :disabled="disabled"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <!-- <el-form-item v-if="form.id" label="当前状态" prop="" style="width: 96%">
                <div>{{ orderStatusName[form.orderStatus] }}</div>
            </el-form-item> -->
      <basic-container style="width: 100%" v-if="!isFold">
        <p style="width: 96%" class="mx20 mt0 mb20">订单信息</p>
        <div class="flex flex-wrap">
          <el-form-item label="订单类型" prop="orderType">
            <el-select
              v-model="form.orderType"
              v-if="!isDetail && !isDetailFlow"
            >
              <el-option :value="0" label="量产订单"></el-option>
              <el-option :value="1" label="样件订单"></el-option>
            </el-select>
            <div
              v-else-if="
                (isDetail || isDetailFlow) &&
                form.orderType !== null &&
                form.orderType !== '' &&
                form.orderType !== undefined
              "
            >
              {{ form.orderType === 0 ? "量产订单" : "客户样件订单" }}
            </div>
          </el-form-item>
          <el-form-item label="订单名称" prop="">
            <el-input
              v-if="!isDetail && !isDetailFlow"
              v-model="form.orderName"
            ></el-input>
            <div v-else>{{ form.orderName }}</div>
          </el-form-item>
          <el-form-item
            label="需求属性"
            prop="requireAttr"
            :label-width="formLabelWidth"
          >
            <el-select   :disabled="(isDetail || isDetailFlow)" v-model="form.requireAttr" style="width: 100%">
              <el-option value="订单" label="订单"></el-option>
              <el-option value="预测" label="预测"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否是总成" prop="">
            <el-radio-group
              v-model="form.isAssembly"
              :disabled="isDetail"
              @change="changePart"
            >
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.id" label="订单号" prop="">
            <div>{{ form.orderNo }}</div>
          </el-form-item>
          <el-form-item v-if="form.id" label="订单日期" prop="">
            <div>{{ form.createTime | filter_date }}</div>
          </el-form-item>
           <el-form-item v-if="form.requireAttr === '预测'" label="覆盖预测状态" prop="">
            <el-select
              v-if="!isDetail && !isDetailFlow"
              v-model="form.coverPredictStatus"
              placeholder="请选择覆盖预测状态"
              clearable
            >
              <el-option label="不覆盖" :value="0"></el-option>
              <el-option label="覆盖" :value="1"></el-option>
            </el-select>
            <div v-else>{{ form.coverPredictStatus === 1 ? '覆盖' : '不覆盖' }}</div>
          </el-form-item>
        </div>
      </basic-container>
      <!-- <basic-container style="width: 100%" v-if="!isFold && !isPlanor">
        <p style="width: 96%" class="mx20 mt0 mb20">客户信息</p>
        <el-form-item label="客户名称" prop="" style="width: 96%">
          <el-select
            v-if="!isDetail"
            v-model="form.customName"
            clearable
            @change="contractCustChange"
            filterable
          >
            <el-option
              v-for="item in custList"
              :value="item.custName"
              :key="item.id"
              :label="item.custName"
            ></el-option>
          </el-select>
          <div v-else>{{ form.customName }}</div>
        </el-form-item>
      </basic-container> -->
      <basic-container style="width: 100%" v-if="!isFold">
        <p style="width: 96%" class="mx20 mt0 mb20">选择供应商</p>
        <div class="flex flex-wrap">
          <el-form-item label="供应商" prop="supplierNo">
            <el-select
              :disabled="isDetail || isDetailFlow"
              v-model="form.supplierNo"
              filterable
              @change="changeSupply"
            >
              <el-option
                v-for="item in supplyList"
                :key="item.supplierNo"
                :label="item.supplierName"
                :value="item.supplierNo"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划员" prop="planUserIds">
            <el-select
              multiple
              :disabled="isDetail || isDetailFlow"
              v-model="form.planUserIds"
              @change="changePlanUser"
            >
              <el-option
                v-for="self in planList"
                :key="self.id"
                :label="self.planName"
                :value="self.id"
              ></el-option>
            </el-select>
            <!-- <div v-else>{{ form.planUserNames }}</div> -->
          </el-form-item>
          <el-form-item label="抄送人员邮箱" prop="">
            <autoAddress
              placeholder=""
              ref="autoAddress"
              class="w-100"
              :initList="initList"
              @getPerson="getSendEmail"
              :initData="form.sendEmailPersons"
              :disabled="isDetail || isDetailFlow"
              :multiple="true"
              @allUserList="getAllUserList"
            ></autoAddress>
          </el-form-item>
          <el-form-item v-if="isDetail" label="电话" prop="">
            <div>{{ form.supplierPhone }}</div>
          </el-form-item>
          <el-form-item v-if="form.requireAttr === '预测' && form.id" label="覆盖预测状态" prop="coverPredictStatus">
            <el-select
              v-if="!isDetail && !isDetailFlow"
              v-model="form.coverPredictStatus"
              placeholder="请选择覆盖预测状态"
              clearable
            >
              <el-option label="不覆盖" :value="0"></el-option>
              <el-option label="覆盖" :value="1"></el-option>
            </el-select>
            <div v-else>{{ form.coverPredictStatus === 1 ? '覆盖' : '不覆盖' }}</div>
          </el-form-item>
        </div>
      </basic-container>
      <p class="table-title" style="width: 96%"><span></span>订单明细</p>
      <el-form-item label="邮件正文备注" style="width: 96%">
        <el-input
          type="textarea"
          :disabled="isDetail || isDetailFlow"
          v-model="form.emailRemark"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0" style="width: 100%">
        <orderDetail
          :isUpdateFlow="isUpdateFlow"
          v-show="!isDetail"
          :formData="form"
          :isDetailFlow="isDetailFlow"
          ref="orderDetail"
        ></orderDetail>
        <el-tabs
          type="border-card"
          v-model="activeName"
          @tab-click="handleClick"
          v-show="isDetail"
        >
          <el-tab-pane label="物料交付计划" name="detailTable" class="mt10">
            <detailTable
              @reflesh="getDetail"
              :formData="form"
              ref="detailTable"
            >
            </detailTable>
          </el-tab-pane>
          <!-- <el-tab-pane label="物料拉动明细" name="second" class="mt10">
                        <materialPullDetails :formData="form" ref="materialPullDetails"></materialPullDetails>
                    </el-tab-pane> -->
        </el-tabs>
      </el-form-item>
      <el-form-item label="订单备注" style="width: 96%">
        <el-input
          v-if="!isDetail"
          type="textarea"
          v-model="form.orderRemark"
        ></el-input>
        <div v-else>{{ form.orderRemark }}</div>
      </el-form-item>
      <el-form-item label="相关附件">
        <upload
          :fileList="form.fileList"
          :isHistory="isHistory"
          btnName="上传"
          @handleRequest="handleRequest"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
      <el-form-item v-if="!isDetail" style="width: 96%" class="btn-center">
        <!-- <el-button
          type="primary"
          v-if="!isUpdateFlow"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="save"
          >保 存</el-button
        >
        <el-button
          type="primary"
          v-if="!isUpdateFlow"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="submit"
          >发 送</el-button
        > -->
        <el-button
          type="primary"
          v-if="!isUpdateFlow"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="preview"
          >邮件预览</el-button
        >
        <!-- <el-button
          type="primary"
          v-if="!isUpdateFlow"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="preview"
          >邮件预览</el-button
        > -->
        <!-- <el-button
          type="primary"
          v-if="!isUpdateFlow"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="submit"
          >存草稿</el-button
        > -->
      </el-form-item>
      <p v-if="isDetail" class="table-title" style="width: 96%">
        <span></span>操作记录
      </p>
      <el-form-item
        label-width="0"
        v-if="isDetail"
        style="width: 100%"
        class="btn-center"
      >
        <operationRecord ref="operationRecord"></operationRecord>
      </el-form-item>
    </el-form>
    <emailModel :formData="form" ref="emailModel"></emailModel>
  </basic-container>
</template>
  
<script>
import autoAddress from "@/components/autoAddress/index";
import upload from "@/components/upload/index";
import detailTable from "./detailTable.vue";
import { mapGetters } from "vuex";
import orderDetail from "./orderDetail";
import materialPullDetails from "./materialPullDetails";
import { getCustList } from "@/api/contract/contractCustomer";
import substituteOrderManageApi from "@/api/substitute/orderManage";
import operationRecord from "./operationRecord";
import { getProjectList } from "@/api/contract/contractProject";
import { getFormatDate } from "@/util/util";
import emailModel from "./emailModel.vue";

export default {
  components: {
    upload,
    detailTable,
    orderDetail,
    materialPullDetails,
    operationRecord,
    autoAddress,
    emailModel,
  },
  data() {
    return {
      planList: [],
      storeList: [],
      custList: [],
      supplyList: [],
      isFold: false,
      isDetail: false,
      fullscreenLoading: false,
      isEdit: false,
      activeName: "detailTable",
      form: {
        isAssembly: "是",
        emailRemark: null,
        custId: null,
        requireAttr:'',
        supplierName: null,
        supplierId: null,
        planUserNames: [],
        planUserIds: [],
        sendEmailPersons: [],
        sendEmailPersonsName: [],
        sendEmailNames: "",
        sendEmailList: [],
        planUserList: [],
        transportType: null,
        takeOverConnect: null,
        connectNumber: null,
        address: null,
        storageName: null,
        storageNumber: null,
        orderRemark: null,
        detailList: [],
        orderName: null,
        coverPredictStatus: null,
      },
      planUserList: [],
      orderStatusName: {
        0: "未交付",
        1: "部分交付",
        2: "全部交付",
        5: "已取消",
      },
      projectList: [],
      initList: [],
      subPartList: [],
      rules: {
        titleName: [{ required: true, message: "请输入标题", trigger: "blur" }],
        supplierNo: [
          { required: true, message: "请选择供应商", trigger: "change" },
        ],
        requireAttr:[
            { required: true, message: "请选择需求属性", trigger: "change" },
        ],
        orderType: [
          { required: true, message: "请选择订单类型", trigger: "change" },
        ],
        coverPredictStatus:[ { required: true, message: "请选择覆盖预测状态", trigger: "change" },], 
        storageName: [
          { required: true, message: "请选择收货仓名称", trigger: "change" },
        ],
        planUserIds: [
          { required: true, message: "请选择计划员", trigger: "change" },
        ],
      },
    };
  },
  filters: {
    filter_date(value) {
      if (value) {
        return value.substring(0, 11);
      }
      return " ";
    },
  },
  props: {
    formData: {
      default: {},
      type: Object,
    },
    isUpdateFlow: {
      default: false,
      type: Boolean,
    },
    isDetailFlow: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    formData: {
      handler(val) {
        this.changePart();
        // this.form = val
        // if(val.orderId){
        //   this.getDetail(this.form.orderId)
        // }
      },
      deep: true,
    },
  },
  mounted() {
    this.getSupplyList();

    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id);
    }
    if (this.$route.query.isDetail) {
      this.isDetail = true;
    }
    this.form.orderName = `供应商订单 -  ${getFormatDate()}`;
    this.getCustListL();
    this.getStoreList();
    this.getContractProjectList();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    disabled() {},
    isPlanor() {
      if (this.userInfo.role_name.includes("计划员")) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    preview() {
      this.form.deliverDtos = this.$refs.orderDetail.tableData;
      this.$refs.emailModel.dialogVisibleEmail = true;
      console.log(this.form.deliverDtos);
    },

    changePart() {
      this.$refs.orderDetail.setPartList(this.form.isAssembly);
    },
    getFromCur() {
      this.form.deliverDtos = this.$refs.orderDetail.tableData;
      console.log(this.form);
      console.log(JSON.stringify(this.form));
      return this.form;
    },
    getFormData(data) {
      this.form = data;
      this.changeSupply(this.form.supplierNo, "isStart");
      if (this.form.orderId) {
        this.getDetail(this.form.orderId, true);
      }
    },
    async getDetail(id, isInit) {
      let res = await substituteOrderManageApi.detail(
        id || this.$route.query.id
      );
      if (res.data.code === 0 || res.data.code === 200) {
        this.form = res.data.data;
        this.form.planUserList = this.form.planUserList || [];
        this.$set(this.form, "planUserIds", []);
        if (this.form.planUserList.length > 0) {
          this.form.planUserNames = this.form.planUserList
            .map((ele) => ele.userName)
            .toString();
          let arr = this.form.planUserList.map((ele) => ele.userId);
          this.form.planUserIds = [...arr];
        }
        this.form.sendEmailList = this.form.sendEmailList
          ? this.form.sendEmailList.split(",")
          : [];
        this.form.sendEmailPersons = this.form.sendEmailPersons
          ? this.form.sendEmailPersons.split(",")
          : [];
        this.form.rowEmailList = this.form.rowEmailList || [];
        this.form.sendEmailNames = this.form.rowEmailList
          .map((ele) => ele.realName)
          .toString();
        this.form.rowEmailList.map((ele) => {
          ele.userId = ele.id;
          ele.userName = ele.realName;
        });
        this.initList = this.form.rowEmailList;
        this.$nextTick(() => {
          if (this.$refs.operationRecord) {
            this.$refs.operationRecord.getList();
          }
        });
        this.changeSupply(this.form.supplierNo, "isStart");
        if (isInit) {
          this.form.deliverDtos.map((ele) => {
            ele.partsNameRemark = null;
            ele.partsNumberRemark = null;
            ele.needDateRemark = null;
            ele.storageNameRemark = null;
            ele.remarkUpdate = null;
            ele.needNumberRemark = null;
          });
        }
      }
    },
    getAllUserList(list) {
      if (this.form.id) return;
      let arr = list.filter((ele) => {
        return ele.account === "niuyinuo" || ele.account === "gaoyu";
      });
      this.dealSendEmailCC(arr);
    },
    dealSendEmailCC(list) {
      this.form.sendEmailList = list.map((ele) => ele.email);
      this.form.sendEmailPersons = list.map((ele) => ele.id);
      this.form.sendEmailNames = list.map((ele) => ele.realName).toString();
      this.initList = list;
    },
    getSendEmail(data, list) {
      this.dealSendEmailCC(list);
    },
    getContractProjectList() {
      getProjectList().then((res) => {
        this.projectList = res.data.data;
      });
    },
    getRow(name) {
      let row = this.storeList.find((ele) => {
        return ele.storeName === name;
      });
      this.form.address = row.storeAddress;
      this.form.connectNumber = row.phone;
      this.form.takeOverConnect = row.principal;
    },
    async getCustListL() {
      let res = await getCustList({});
      this.custList = res.data.data;
    },
    contractCustChange() {},
    async getSupplyList() {
      let res = await substituteOrderManageApi.getContractSupplier();
      this.supplyList = res.data.data;
    },
    async getStoreList() {
      let res = await substituteOrderManageApi.storeList();
      this.storeList = res.data.data.records;
    },
    async changeSupply(v, isStart) {
      if (this.supplyList.length === 0) {
        await this.getSupplyList();
      }
      let row = this.supplyList.find((ele) => {
        return ele.supplierNo === v;
      });
      if (!row) return;
      this.form.supplierName = row.supplierName;
      this.form.supplierPhone = row.contactNumber;
      this.form.supplierAddress = row.address;
      this.form.supplierId = row.id;
      this.planList = JSON.parse(JSON.stringify(row.planUserList)) || [];

      if (isStart) return;

      this.form.planUserIds = this.form.planUserIds || [];
      this.form.planUserList = [];
      this.form.planUserIds = new Array();
      this.planList.map((ele) => {
        this.form.planUserList.push({
          userId: ele.id,
          userName: ele.planName,
          planEmail: ele.planEmail,
        });
        this.form.planUserIds.push(ele.id);
      });
      console.log(this.form.supplierId + " this.form.supplierId");
      this.form.planUserNames = this.form.planUserList
        .map((ele) => ele.userName)
        .toString();
      this.changePart();
    },
    changePlanUser() {
      this.form.planUserList = [];
      this.planList.map((ele) => {
        if (this.form.planUserIds.includes(ele.id)) {
          this.form.planUserList.push({
            userId: ele.id,
            userName: ele.planName,
            planEmail: ele.planEmail,
          });
        }
      });
      this.form.planUserNames = this.form.planUserList
        .map((ele) => ele.userName)
        .toString();
    },
    async save() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      this.form.deliverDtos = this.$refs.orderDetail.tableData;
      this.form.detailList = this.$refs.orderDetail.tableData;
      this.form.planUserIds = this.form.planUserIds.toString();
      this.form.sendEmailList = this.form.sendEmailList.toString();
      this.form.sendEmailPersons = this.form.sendEmailPersons.toString();
      let res = await substituteOrderManageApi.save(this.form);
      if (res.data.code == 0) {
        this.$message.success("订单已提交，请勿重复点击");
        this.$router.push("/substitute/orderManage/index?reflesh=true");
      }
    },
    testForm() {
      return this.$refs.orderDetail.test();
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (!this.$refs.orderDetail.test()) {
            return false;
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          setTimeout(() => {
            loading.close();
          }, 2000);
          this.form.deliverDtos = this.$refs.orderDetail.tableData;
          this.form.detailList = this.$refs.orderDetail.tableData;
          this.form.planUserIds = this.form.planUserIds.toString();
          this.form.sendEmailList = this.form.sendEmailList.toString();
          this.form.sendEmailPersons = this.form.sendEmailPersons.toString();
          let Api = substituteOrderManageApi.insert;
          //  this.form.id
          //   ? substituteOrderManageApi.update
          //   : substituteOrderManageApi.insert;
          let res = await Api(this.form);
          if (res.data.code == 0) {
            this.$message.success("订单已提交，请勿重复点击");
            this.$router.push("/substitute/orderManage/index?reflesh=true");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
}

.table-title-first {
  height: 30px;
  line-height: 30px;
  padding: 8px;
  display: flex;
  justify-content: space-between;

  .titleFirst {
    .spanLine {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: #000;
      margin-right: 10px;
    }
  }

  .blue {
    color: #409eff;
  }
}

@media (min-width: 768px) {
  .el-form-item {
    width: 48%;
  }
}

.fullscreenL {
  overflow: scroll;
}

.btn-center {
  text-align: center;
}

.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.w-100 {
  width: 100%;
}

.dec-icon {
  color: #979797;
  background-color: #eaeaea;
  padding: 3px 6px;
  border-radius: 2px;
  margin-right: 5px;
}

.exitFull {
  position: absolute;
  padding: 20px;
  color: transparent;
  z-index: 1000;
}

.exitFull:hover {
  color: #fff;
  background-color: #000;
}

.botton-row {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.bt1 {
  border-top: 1px solid #dcdfe6;
}
</style>
  