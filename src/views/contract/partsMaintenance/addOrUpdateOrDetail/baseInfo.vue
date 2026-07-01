<template>
  <el-row>
    <el-col :span="24">
      <basic-container>
        <p class="table-title"><span></span>基本信息</p>
        <avue-form ref="formBaseInfo" :option="optionBaseInfo" v-model="form">
          <template slot-scope="{ disabled }" slot="childrenFunctionId">
            <div>
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
            </div>
          </template>
          <template slot="projectNo1">
            {{ form.projectNo }}
          </template>
          <template slot="partsNo">
            <el-input
              :disabled="isDisabled"
              placeholder="请输入内容"
              v-model="form.partsNo"
            >
              <template
                v-if="form.partsType == '样件' && (!form.partsNo || !form.id)"
                slot="prepend"
                >YJ-</template
              >
            </el-input>
          </template>
          <template slot-scope="{ disabled }" slot="applyType">
            <div>
              <el-radio-group
                v-model="form.applyType"
                @change="updateApplyType"
              >
                <el-radio :label="0">新申请</el-radio>
                <el-radio :label="1">工程变更</el-radio>
              </el-radio-group>
              <div class="flow_text" v-if="form.partsUpdateApplyNo">
                <span>流程号：{{ form.partsUpdateApplyNo }}</span>
              </div>
            </div>
          </template>
          <template slot="viewsDetail">
            <div>
              <el-button type="text" v-if="form.referPartsId" @click="toDetail"
                >查看详情</el-button
              >
            </div>
          </template>
        </avue-form>
        <el-table
          v-if="form.referPartsId"
          :data="relationDetail"
          style="width: 100%"
        >
          <el-table-column prop="partsName" label="引用零件名称">
          </el-table-column>
          <el-table-column prop="partsNo" label="引用零件号"> </el-table-column>
          <el-table-column prop="parentFunctionName" label="引用零件类型">
          </el-table-column>
          <el-table-column prop="belongPlatform" label="所属平台">
          </el-table-column>
          <el-table-column prop="childrenFunctionName" label="配置">
          </el-table-column>
          <el-table-column prop="externalPartNo" label="外部零件号">
          </el-table-column>
          <el-table-column prop="chineseName" label="中文名称">
          </el-table-column>
          <el-table-column prop="englishName" label="英文名称">
          </el-table-column>
          <el-table-column
            :formatter="formatterOnline"
            prop="onlineType"
            label="能力储备"
          >
          </el-table-column>
          <el-table-column
            :formatter="formatterSub"
            prop="haveSubPart"
            label="是否有子零件"
          >
          </el-table-column>
          <el-table-column prop="partsDesc" label="零件描述"> </el-table-column>
        </el-table>
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
import { saveOrUpdateParts, getPartsDetails } from "@/api/contract/partsMaint";
import { getProjectList } from "@/api/contract/contractProject";
export default {
  data() {
    return {
      isDisabled: false,
      isSuccess: null,
      vehicleDetialList: [],
      dispositionList: [],
      configList: [],
      relationDetail: [],
      form: {
        partsNo: "",
        partsName: "",
        amount: "",
        unitPrice: "",
        partsType: null,
        projectName: null,
        projectNo: null,
        taxTitle:null,
        contractNo: "",
        effectiveTime: "", //生效时间
        failureTime: "", //失效时间
        parentFunctionId: "",
        childrenFunctionId: "",
        supplierNo: "",
        currency: "CNY",
        exchangeRateMethod: 1,
        exchangeRate: "1.00",
        unitPriceCny: "",
        remark: "",
        createTime: "",
        modelNo:null,
        createUserName: "",
        updateTime: "",
        modelName: [],
        partsUpdateApplyNo: "", //生成规则："#BG250001"
        updateUserNameName: "",
        updateUser: "",
        partsVehicleModelVoList: [],
        onlineType: 0,
      },
      projectList: [],
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
          },
          {
            type: "input",
            label: "零件号",
            span: 12,
            prop: "partsNo",
            slot: true,
            disabled: false,
            placeholder: " ",
            rules: [
              {
                required: true,
                message: "零件号不能为空",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "零件类型",
            disabled: false,
            span: 12,
            prop: "parentFunctionId",
            dicUrl: "/api/oa-portal/partsFunction/getListByParentId?parentId=0",
            props: {
              label: "functionName",
              value: "id",

            },
            rules: [
              {
                required: true,
                message: "零件类型不能为空",
                trigger: "change",
              },
            ],
            cascader: ["childrenFunctionId"],
            change: this.changeType,
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
            type: "select",
            label: "配置",
            disabled: false,
            span: 12,
            prop: "childrenFunctionId",
            placeholder: " ",
            slot: true,
            props: {
              label: "functionName",
              value: "id",
            },
            dicUrl: `/api/oa-portal/partsFunction/getListByParentId?parentId={{key}}`,
            rules: [
              {
                required: true,
                message: "配置不能为空",
                trigger: "change",
              },
            ],
          },
          {
            type: "select",
            label: "车型名称",
            span: 12,
            multiple: true,
            prop: "modelId",
            dicUrl: "/api/oa-portal/vehicleModelManage/selectList",
            props: {
              label: "modelName",
              value: "modelId",
            },
            disabled: true,
            placeholder: " ",
            change: this.getVehicleDetialRow,
          },
          {
            type: "input",
            label: "车系",
            disabled: true,
            span: 12,
            prop: "seriesName",
            placeholder: "",
          },
          {
            type: "input",
            label: "外部零件号",
            span: 12,
            prop: "externalPartNo",
            placeholder: "",
            rules: [
              {
                required: true,
                message: "外部零件号不能为空",
                trigger: "blur",
              },
            ],
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
            type: "select",
            filterable: true,
            label: "项目名称",
            span: 12,
            dicUrl: "/api/oa-portal/contractProject/selectList",
            prop: "projectNo",
            placeholder: "",
            props: {
              label: "projectName",
              value: "projectNo",
            },
            rules: [
              {
                required: true,
                message: "项目名称不能为空",
                trigger: "change",
              },
            ],
            change: this.changeProject,
          },
          {
            type: "input",
            label: "项目编号",
            span: 12,
            prop: "projectNo1",
            placeholder: "",
            disabled: true,
          },
          {
            type: "input",
            label: "入库价格(人民币)",
            span: 12,
            prop: "stockInPrice",
            placeholder: "",
          },
          {
            type: "input",
            label: "税目",
            span: 12,
            prop: "taxTitle",
            placeholder: "",
            rules: [
              {
                required: true,
                message: "税目不能为空",
                trigger: "blur",
              },
            ],
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
          },
          {
            type: "textarea",
            label: "零件描述",
            span: 12,
            prop: "partsDesc",
            placeholder: "",
          },
          {
            type: "select",
            label: "零件种类",
            span: 12,
            dicData: [
              {
                label: "样件",
                value: "样件",
              },
              {
                label: "量产件",
                value: "量产件",
              },
            ],
            prop: "partsType",
            placeholder: "",
            rules: [
              {
                required: true,
                message: "零件种类不能为空",
                trigger: "change",
              },
            ],
            // change: this.updatePartType
          },
          {
            type: "input",
            label: "Model",
            span: 12,
            prop: "modelNo",
            placeholder: "",
            display: true
          },
          {
            type: "radio",
            label: "零件申请类型",
            span: 12,
            dicData: [
              {
                label: "新申请",
                value: 0,
              },
              {
                label: "工程变更",
                value: 1,
              },
            ],
            prop: "applyType",
            placeholder: "",
            change: this.updateApplyType,
          },
          {
            type: "select",
            label: "引用零件号",
            display: false,
            dicUrl: "/api/oa-portal/partsMaint/selectlist",
            span: 12,
            prop: "referPartsId",
            filterable: true,
            placeholder: "",
            props: {
              value: "id",
              label: "partsNo",
            },
            change: this.getRelatePartsNo,
          },
          {
            span: 12,
            prop: "viewsDetail",
            labelWidth: 0,
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
        isProcurement: false,
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
    isUpdateFlow: {
      type: Boolean,
      default: false,
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
          if (this.baseForm.createUser) {
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
    const key = this.$route.query.key;
    if (key === "edit") {
      this.dealDataEdit();
    }
    if (key === "edit" || key === "detail") {
      this.isDisabled = true;
    }
    if (this.isUpdateFlow) {
      this.optionBaseInfo.disabled = true;
    }
    this.isProcurement = this.userInfo.account === "shenyanxia";
    // if (this.isProcurement) {
    //   this.optionBaseInfo.disabled = true;
    // }
    this.getProject();
  },
  methods: {
    toDetail() {
      let url = `/partsMaintAdd?id=${this.form.referPartsId}&key=detail`;
      window.open(this.$router.resolve({ path: url }).href, "_blank");
    },
    async getProject() {
      let res = await getProjectList();
      if (res.data.code === 200 || res.data.code === 0) {
        this.projectList = res.data.data;
      }
    },
    changeProject({ value }) {
      let one = this.projectList.find((ele) => {
        return (ele.projectNo = value);
      });
      if (one) {
        this.form.projectName = one.projectName;
        this.form.projectNo = one.projectNo;
      }
    },
    formatterSub(row, column) {
      return row.haveSubPart ? "是" : "否";
    },
    formatterOnline(row) {
      return row.onlineType ? "是" : "否";
    },
    updateApplyType(value) {
      console.log(value);
      let propApplyType = this.findObject(
        this.optionBaseInfo.column,
        "referPartsId"
      );
      propApplyType.display = value === 1 ? true : false;
    },
    // updatePartType({value}) {
    //   let propFormalPartsNo = this.findObject(
    //     this.optionBaseInfo.column,
    //     "formalPartsNo"
    //   );
    //   propFormalPartsNo.display = value ==="样件" ? true : false;
    // },
    async getRelatePartsNo(v) {
      console.log(v);
      if (v.value) {
        let res = await getPartsDetails({ id: v.value });
        if (res.data.code === 200 || res.data.code === 0) {
          this.relationDetail = [res.data.data];
        }
      }
    },
    dealDataEdit() {
      let propPartsNo = this.findObject(this.optionBaseInfo.column, "partsNo");
      propPartsNo.disabled = true;
      // let propApplyType = this.findObject(
      //   this.optionBaseInfo.column,
      //   "applyType"
      // );
      // propApplyType.disabled = true;
      // let propReferPartsId = this.findObject(
      //   this.optionBaseInfo.column,
      //   "referPartsId"
      // );
      // propReferPartsId.disabled = true;
      setTimeout(() => {
        if (!this.baseForm.partsNo) {
          propPartsNo.disabled = false;
        }
      }, 1000);
      let propParentFunction = this.findObject(
        this.optionBaseInfo.column,
        "parentFunctionId"
      );
      propParentFunction.disabled = true;
      let propHaveChild = this.findObject(
        this.optionBaseInfo.column,
        "haveSubPart"
      );
      propHaveChild.disabled = true;
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
      let propApplyType = this.findObject(
        this.optionBaseInfo.column,
        "referPartsId"
      );
      propApplyType.display = this.form.applyType === 1 ? true : false;
      // console.log(this.form)
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

<style scoped>

.flow_text {
  position: absolute;
  left: -96px;
  width: 400px;

}
</style>