<template>
  <div>
    <el-row>
      <el-col :span="24" v-if="!isProcurement">
        <basic-container>
          <p>零件申请</p>
        </basic-container>
      </el-col>
    </el-row>
    <baseInfo
      :isUpdateFlow="isUpdateFlow"
      :isProcurementFlow="isProcurement"
      :keyOperate="currentOperate"
      :baseForm="historyFromData"
      @baseinfoForm="getBaseinfoForm"
      ref="baseInfoForm"
    >
    </baseInfo>
    <category
      :isUpdateFlow="isUpdateFlow"
      :isProcurementFlow="isProcurement"
      :keyOperate="currentOperate"
      :categoryForm="historyFromData"
      ref="categoryRef"
      @testForm="testBaseForm"
      @handleSubmit="handleSubmit"
    ></category>
  </div>
</template>

<script>
import baseInfo from "./baseInfo.vue";
import category from "./category";
import { debounce, uniqueArray } from "@/util/util";
import { saveOrUpdateParts, getPartsDetails } from "@/api/contract/partsMaint";
import { mapGetters } from "vuex";

export default {
  components: {
    baseInfo,
    category,
  },
  props: {
    //角色是采购只需要填写价格相关信息
    isProcurement: {
      type: Boolean,
      required: false,
      default: false,
    },
    categoryPriceForm: {
      type: Object,
      required: false,
    },
    isUpdateFlow: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    categoryPriceForm: {
      handler: function (newValue, old) {
        if (this.categoryPriceForm) {
          this.historyFromData = this.categoryPriceForm;
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      timeout: null,
      userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
      form: {
        list: [],
      },
      oldApplyType:null,
      isStart: false,
      currentOperate: "",
      canSubmit: false,
      historyFromData: {
        id: this.$route.query.id,
        tbPartsCategoryList: [],
      },
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetialData(this.$route.query.id);
    }
    if (this.$route.query.key) {
      this.currentOperate = this.$route.query.key;
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    getDetialData(id) {
      getPartsDetails({ id: id }).then((res) => {
        this.isStart = true;
        if (res.data.code === 0) {
          this.form = res.data.data;
          this.form.tbPartsCategoryList.map((ele) => {
            if (ele.validStartDate) {
              ele.validDate = [ele.validStartDate, ele.validEndDate];
            }
          });
          // if(this.form.partsNo==="27162005"){
          //    this.form.modelNo = "10007870B-03-00"
          // }else if(this.form.partsNo==='27159858'){
          //     this.form.modelNo = "10007870B-04-00"
          // }        
          this.historyFromData = JSON.parse(JSON.stringify(this.form));
          this.oldApplyType =  this.historyFromData.applyType
        }
        setTimeout(() => {
          this.isStart = false;
        }, 30000);
      });
    },
    getBaseinfoForm(form) {
      this.form = Object.assign(this.form, form);
      if (!this.isStart) {
        if (this.$refs.categoryRef) {
          this.$refs.categoryRef.changeForm(this.form);
        }
      }
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
            this.$router.push("/contract/partsMaint?reflesh=true");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
        .finally(() => {});
    },
    async handleSubmit(formC1, formC2) {
      let form1 = formC1 ? formC1 : this.$refs.categoryRef.formList;
      let form2 = formC2 ? formC2 : this.$refs.categoryRef.formAmount;
      await this.testBaseForm();
      if (
        this.form.partsType === "样件" &&
        !this.form.partsNo.includes("YJ-")
      ) {
        this.form.partsNo = "YJ-" + this.form.partsNo;
      }
      if (formC1) {
        if (!this.canSubmit) return;
      }
      if(this.form.applyType===1&&this.form.applyType!=this.oldApplyType){
        this.form.applyTypeUpdate = true
      }
      this.form.tbPartsCategoryList = form1.map((ele) => ele.form);
      for (let i = 0; i < this.form.tbPartsCategoryList.length; i++) {
        let ele = this.form.tbPartsCategoryList[i];
        if (ele.haveSubPart === 1 && ele.isProduct === 1) {
          this.$message.error("有子零件的零件不能设置为生产属性");
          return;
        }
      }
      Object.assign(this.form, form2);

      if (this.form.haveSubPart) {
        let haveProductList = this.form.tbPartsCategoryList.filter((ele) => {
          return Number(ele.isProduct) === 1;
        });
        haveProductList = uniqueArray(haveProductList, "partsCategoryId");
        if (haveProductList.length !== 1) {
          this.$message.error(
            `${
              haveProductList.length === 0
                ? "请选择生产属性"
                : "只能选择一个生产属性"
            }`
          );
          return;
        }
      }
      this.form.createUserName = this.form.createUserName
        ? this.form.createUserName
        : this.userInfo.content.user_name;
      this.form.updateUser = this.userInfo.content.user_id;
      this.form.createUser = this.form.createUser
        ? this.form.createUser
        : this.userInfo.content.user_id;
      debounce(this.dealSavePart, this, 1000);
    },
  },
};
</script>