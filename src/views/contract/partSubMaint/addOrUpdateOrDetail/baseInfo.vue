<template>
  <el-row>
    <el-col :span="24">
      <basic-container>
        <p class="table-title"><span></span>基本信息</p>
        <avue-form ref="formBaseInfo" :option="optionBaseInfo" v-model="form">
          <template  slot="partsSubExternalList">
            <div v-for="(item,index) in form.partsSubExternalList" :key="item">
              <div class="flex">
                <el-input :disabled="isDetail" v-model="item.externalPartsNo"></el-input>
                <el-button class="mx5" type="success" @click="addRowExternal(form)" v-if="index===0&&!isDetail">添 加</el-button>
                <el-button class="mx5" type="danger" @click="deleteRowExternal(index)" v-if="index!==0&&!isDetail">删 除</el-button>
              </div>
            </div>
            <!-- <div>
              <el-select
                :disabled="disabled"
                :size="size"
                v-model="form.childrenFunctionId"
              >
                <el-option
                  v-for="item in configList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.functionName"
                ></el-option>
              </el-select>
            </div> -->
          </template>
        </avue-form>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
import {
  getVehicleDetialList,
  getListByParentId,
} from "@/api/contract/partsMaint";
import { validateForm } from "@/util/validate";
import { deepClone } from "@/util/util";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isProcurement: false,
      isSuccess: null,
      vehicleDetialList: [],
      dispositionList: [],
      configList: [],
      form: {
        partsNo: "",
        partsName: "",
        amount: "",
        unitPrice: "",
        contractNo: "",
        effectiveTime: "", //生效时间
        failureTime: "", //失效时间
        parentFunction: "",
        childrenFunction: "",
        supplierNo: "",
        currency: "CNY",
        exchangeRateMethod: 1,
        exchangeRate: "1.00",
        unitPriceCny: "",
        remark: "",
        createTime: "",
        createUserName: "",
        updateTime: "",
        modelName: [],
        partsSubExternalList: [{ externalPartsNo: null }],
        updateUserNameName: "",
        updateUser: "",
        partsVehicleModelVoList: [],
        onlineType: 0,
        haveSubPart: null,
      },
      optionBaseInfo: {
        column: [
          {
            type: "input",
            label: "零件名称",
            span: 12,
            prop: "partsName",
            rules: [
              {
                required: true,
                message: "零件名称不能为空",
                trigger: "blur",
              },
            ],
            blur: this.changePartName,
          },
          {
            type: "input",
            label: "零件号",
            span: 12,
            prop: "partsNo",
            slot: true,
            disabled: true,
            placeholder: " ",
          },
          {
            type: "select",
            label: "零件类型",
            disabled: false,
            span: 12,
            prop: "parentFunction",
            allowCreate: true,
            filterable: true,
            dicData: [
              {
                label: "模具",
                value: "模具",
              },
              {
                label: "芯片",
                value: "芯片",
              },
              {
                label: "生产及代购",
                value: "生产及代购",
              },
            ],
            // dicUrl: '/api/oa-portal/partsFunction/getListByParentId?parentId=0',
            props: {
              label: "label",
              value: "value",
            },
            rules: [
              {
                required: true,
                message: "零件类型不能为空",
                trigger: "change",
              },
            ],
          },
          {
            type: "input",
            label: "所属平台",
            disabled: false,
            span: 12,
            prop: "belongPlatform",
            placeholder: " ",
            rules: [
              {
                required: false,
                message: "不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "配置",
            disabled: false,
            span: 12,
            prop: "childrenFunction",
            placeholder: " ",
            slot: true,
            // props: {
            //     label: "functionName",
            //     value: "id",
            // },
            // dicUrl: `/api/oa-portal/partsFunction/getListByParentId?parentId={{key}}`,
            // rules: [
            //     {
            //         required: true,
            //         message: "配置不能为空",
            //         trigger: "change",
            //     },
            // ],
          },
          // {
          //     type: "select",
          //     label: "车型名称",
          //     span: 12,
          //     multiple: true,
          //     prop: "modelId",
          //     dicUrl: "/api/oa-portal/vehicleModelManage/selectList",
          //     props: {
          //         label: "modelName",
          //         value: "modelId",
          //     },
          //     disabled: true,
          //     placeholder: " ",
          //     change: this.getVehicleDetialRow
          // },
          // {
          //     type: "input",
          //     label: "车系",
          //     disabled: true,
          //     span: 12,
          //     prop: "seriesName",
          //     placeholder: "",
          // },     
          //  {
          //   type: "input",
          //   label: "外部零件号",
          //   span: 12,
          //   prop:"partsSubExternalList",
          //   // prop: "partsSubExternalList",
          //   placeholder: "",
          // },
          {
            type: "input",
            label: "外部零件号",
            span: 12,
            // prop:"externalPartNo",
            prop: "partsSubExternalList",
            placeholder: "",
          },
          {
            type: "input",
            label: "中文名称",
            span: 12,
            prop: "chineseName",
            placeholder: "",
          },
          {
            type: "input",
            label: "英文名称",
            span: 12,
            prop: "englishName",
            placeholder: "",
          },
          {
            type: "radio",
            label: "能力储备",
            span: 12,
            dicData: [
              {
                label: "是",
                value: 1,
              },
              {
                label: "否",
                value: 0,
              },
            ],
            prop: "onlineType",
            placeholder: "",
          },
          {
            type: "radio",
            label: "是否有子零件",
            span: 12,
            value: 0,
            dicData: [
              {
                label: "是",
                value: 1,
              },
              {
                label: "否",
                value: 0,
              },
            ],
            prop: "haveSubPart",
            placeholder: "",
            change: this.changePart,
          },
          {
            type: "input",
            label: "制造商",
            span: 12,
            prop: "manufacturer",
            placeholder: "",
          },
          {
            type: "select",
            label: "零件种类",
            disabled: false,
            span: 12,
            prop: "partsType",
            allowCreate: true,
            filterable: true,
            dicData: [
              {
                label: "BOM",
                value: "BOM",
              },
              {
                label: "半成品",
                value: "半成品",
              },
              {
                label: "子零件",
                value: "子零件",
              },
            ],
            // dicUrl: '/api/oa-portal/partsFunction/getListByParentId?parentId=0',
            props: {
              label: "label",
              value: "value",
            },
            rules: [
              {
                required: true,
                message: "零件类型不能为空",
                trigger: "change",
              },
            ],
          },
        ],
        labelPosition: "right",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        submitText: "验证文件",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        detail: false,
        tabs: false,
        disabled: false,
        labelSuffix: " ",
      },
    };
  },
  props: {
    baseForm: {
      type: Object,
    },
    keyOperate: {
      type: String,
    },
    //角色是采购只需要填写价格相关信息
    isProcurementFlow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    form: {
      handler() {
        this.$emit("baseinfoForm", this.form);
      },
      immediate: true,
      // 开启深度监听 deep
      deep: true,
    },
    baseForm: {
      handler() {
        if (this.baseForm.id) {
          if (this.baseForm.createTime) {
            this.form = this.baseForm;
            this.dealFormData();
          }
        }
      },
      immediate: true,
      // 开启深度监听 deep
      deep: true,
    },
    keyOperate: {
      handler() {
        if (this.keyOperate === "detail") {
          this.optionBaseInfo.disabled = true;
        }
      },
    },
  },
  mounted() {
    this.getVehicleList();
    const isEdit = this.$route.query.key;
    if (isEdit === "edit") {
      this.dealDataEdit();
    }
    this.isProcurement = this.userInfo.account === "shenyanxia";
    if (this.isProcurement) {
      this.optionBaseInfo.disabled = true;
    }
  },
  methods: {
    addRowExternal(){
      this.form.partsSubExternalList.push({externalPartsNo:null})
    },
    deleteRowExternal(index){
      this.form.partsSubExternalList.splice(index,1)
    },
    dealDataEdit() {
      let propPartsNo = this.findObject(this.optionBaseInfo.column, "partsNo");
      propPartsNo.disabled = true;
      let propParentFunction = this.findObject(
        this.optionBaseInfo.column,
        "parentFunction"
      );
      propParentFunction.disabled = true;
      let propHaveChild = this.findObject(
        this.optionBaseInfo.column,
        "haveSubPart"
      );
      propHaveChild.disabled = true;
    },
    changePartName() {
      this.$emit("changePartName");
    },
    changePart() {
      this.$emit("changePart");
    },
    async changeType(e) {
      if (e.value) {
        let res = await getListByParentId(e.value);
        this.configList = res.data.data;
      }
    },
    dealFormData() {
      this.form.timer = [this.form.effectiveTime, this.form.failureTime];
      let arr = deepClone(this.form.partsVehicleModelVoList) || [];
      this.form.modelId = arr.map((ele) => ele.modelId);
    },
    getVehicleList() {
      getVehicleDetialList().then((res) => {
        if (res.data.code === 0) {
          this.vehicleDetialList = res.data.data;
          if (this.form.modelId && this.form.modelId.length > 0) {
            this.getVehicleDetialRow({ value: this.form.modelId });
          }
        }
      });
    },
    async getVehicleDetialRow({ value }) {
      this.form.seriesName = "";
      this.form.modelName = [];
      this.form.partsVehicleModelVoList = [];
      this.vehicleDetialList.map((ele) => {
        if (value.includes(ele.id)) {
          this.form.seriesName += ele.seriesName + ",";
          this.form.modelName.push(ele.modelName);
        }
      });
      this.form.seriesName = this.form.seriesName.slice(0, -1);
      value.map((ele) => {
        this.form.partsVehicleModelVoList.push({ modelId: ele });
      });
    },
    handleEffectiveTimer({ value }) {
      if (value) {
        this.form.effectiveTime = value[0];
        this.form.failureTime = value[1];
      } else {
        this.form.effectiveTime = "";
        this.form.failureTime = "";
      }
    },
    //form表格校验
    testForm() {
      validateForm(this, ["formBaseInfo"], () => {
        this.isSuccess = true;
      });
    },
  },
};
</script>
