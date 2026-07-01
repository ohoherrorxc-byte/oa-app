<template>
  <div>
    <el-row v-if="!isProcurementFlow">
      <el-col :span="24">
        <basic-container>
          <p class="text-center">半成品/子零件申请</p>
        </basic-container>
      </el-col>
    </el-row>
    <baseInfo :keyOperate="currentOperate" :baseForm="historyFromData" @baseinfoForm="getBaseinfoForm"
      @changePart="changePart" @changePartName="changePartName" :isProcurementFlow="isProcurementFlow" ref="baseInfoForm">
    </baseInfo>
    <category :keyOperate="currentOperate" :categoryForm="historyFromData" ref="categoryRef" @testForm="testBaseForm"
      @handleSubmit="handleSubmit" :isProcurementFlow="isProcurementFlow"></category>
  </div>
</template>

<script>
import baseInfo from "./baseInfo.vue";
import category from "./category";
import { debounce } from "@/util/util";
import { saveOrUpdateParts, getPartsDetails } from "@/api/contract/partsSubMaint";

export default {
  components: {
    baseInfo,
    category,
  },
  props: {
    //角色是采购只需要填写价格相关信息
    isProcurementFlow: {
      type: Boolean,
      required: false,
      default: false
    },
    categoryPriceForm: {
      type: Object,
      required: false,
    }
  },
  data() {
    return {
      timeout: null,
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
      form: {
        list: [],
      },
      currentOperate: "",
      canSubmit: false,
      historyFromData: {
        id: this.$route.query.id,
        tbPartsCategoryList: [],
      },
    };
  },
  watch:{
    //采购价格数据同步
    categoryPriceForm:{
      handler:function(newValue,old){
        if(this.categoryPriceForm){
          this.historyFromData = this.categoryPriceForm
        }
      },
      deep:true
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetialData(this.$route.query.id);
    }
    if (this.$route.query.key) {
      this.currentOperate = this.$route.query.key;
    }
  },
  methods: {
    getDetialData(id) {
      getPartsDetails({ id: id }).then((res) => {
        if (res.data.code === 0) {
          this.form = res.data.data;
          this.form.tbPartsCategoryList.map(ele => {
            if (ele.validStartDate) {
              ele.validDate = [ele.validStartDate, ele.validEndDate]
            }
          })
          this.historyFromData = JSON.parse(JSON.stringify(this.form));
          setTimeout(() => {
            this.$refs.categoryRef && this.$refs.categoryRef.changeForm && this.$refs.categoryRef.changeForm(this.form, true)
          }, 1000);
        }
      });
    },
    changePart() {
      this.$refs.categoryRef && this.$refs.categoryRef.changeForm && this.$refs.categoryRef.changeForm(this.form)
    },
    changePartName() {
      this.$refs.categoryRef.changePartName(this.form)
    },
    getBaseinfoForm(form) {
      this.form = Object.assign(this.form, form);
    },
    async testBaseForm() {
      await this.$refs.baseInfoForm.testForm();
      this.canSubmit = this.$refs.baseInfoForm.isSuccess;
    },
    dealSavePart() {
      saveOrUpdateParts(this.form)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: this.form.id ? "修改成功" : "新增成功",
              type: "success",
            });
            this.$router.push("/contract/partSubMaint?reflesh=true");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
        .finally(() => { });
    },
    async handleSubmit(formC1, formC2) {
      let form1 = formC1 ? formC1 : this.$refs.categoryRef.formList
      let form2 = formC2 ? formC2 : this.$refs.categoryRef.formAmount
      await this.testBaseForm();
      if (!this.canSubmit&&formC1) return;
      this.form.tbPartsCategoryList = form1.map((ele) => ele.form);
      Object.assign(this.form, form2);
      console.log(this.form)
      this.form.createUserName = this.form.createUserName|| this.userInfo.content.user_name;
      this.form.updateUser = this.userInfo.content.user_id;
      this.form.createUser =  this.form.createUser||this.userInfo.content.user_id;
      debounce(this.dealSavePart, this, 1000);
    },
  },
};
</script>