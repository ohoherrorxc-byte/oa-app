<template>
  <div>
    <basic-container>
      <div class="flex">
        <el-button
          class="mb10"
          type="success"
          icon="el-icon-plus"
          size="mini"
          v-if="!isDetail && haveChildPart && !isProcurement"
          @click="onAddItemCategory"
          >添加</el-button
        >
        <upload
          v-if="!isDetail && haveChildPart && !isProcurement"
          @handleRequest="onExportCategory"
          :showTip="false"
          class="mx10"
          url="/api/oa-portal/partsSubMaint/getCategoryByFile"
        ></upload>
        <!-- <el-button
        class="mb10"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        v-if="!isDetail && haveChildPart && !isProcurement"
        @click="onExportCategory"
        >导入品类</el-button
      > -->
        <el-button
          class="mb10"
          type="primary"
          icon="el-icon-download"
          size="mini"
          v-if="!isDetail && haveChildPart && !isProcurement"
          @click="downModel"
          >导入模板</el-button
        >
      </div>

      <el-col :span="24" v-for="(item, index) in formList" :key="item.key">
        <basic-container>
          <!-- status 0:失效，1： -->
          <div class="relative">
            <img
              src="@/assets/svg/lose.svg"
              class="lose"
              v-if="item.form.status === 0 && isProcurement"
              width="300"
              alt=""
            />
          </div>
          <p class="table-title">
            <span></span>品类{{ item.form.partsCategoryId || " " }}
            <img
              src="@/assets/svg/action.svg"
              width="50"
              v-if="item.form.status === 1"
              alt=""
            />
            <img
              src="@/assets/svg/wait.svg"
              width="50"
              v-if="item.form.status === 2"
              alt=""
            />
          </p>
          <div class="table-button mt20">
            <el-button
              type="text"
              v-if="haveChildPart"
              @click="toChildDetail(item)"
              >查看详情</el-button
            >
            <!-- && item.form.status === 1 -->
            <el-button
              v-if="!isDetail && !!item.form.isHistory"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="exchangeCategory(item, index)"
              >替换</el-button
            >
            <el-button
              v-if="canDelete && !isDetail && !item.form.isHistory"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteBtnCategory(item)"
              >删除</el-button
            >
          </div>
          <avue-form
            :ref="item.refForm"
            :option="item.optionCategory"
            v-model="item.form"
          >
            <template slot="categoryName">
              <el-select
                v-if="haveChildPart"
                :disabled="isDetail || item.form.isHistory || !isProcurement"
                v-model="item.form['categoryName']"
                clearable
                filterable
                @change="getCategoryName(item.form, item, index)"
              >
                <el-option
                  v-for="self in subMaintList"
                  :key="self.id"
                  :label="self.partsName"
                  :value="self.partsName"
                ></el-option>
              </el-select>
              <el-input
                disabled
                v-else
                v-model="item.form['categoryName']"
              ></el-input>
            </template>
            <template slot="categoryNo">
              <el-select
                v-if="haveChildPart"
                :disabled="isDetail || item.form.isHistory||isProcurement"
                v-model="item.form['categoryNo']"
                clearable
                filterable
                @change="getCategoryNo(item.form, item, index)"
              >
                <el-option
                  v-for="self in subMaintList"
                  :key="self.id"
                  :label="self.partsNo"
                  :value="self.partsNo"
                ></el-option>
              </el-select>
              <el-input
                disabled
                v-else
                v-model="item.form['categoryNo']"
              ></el-input>
            </template>
            <template slot="purchaseContractNo">
              <el-select
                :disabled="isDetail || item.form.isHistory || haveChildPart"
                v-model="item.form['purchaseContractNo']"
                clearable
                filterable
                @change="getPurchaseRow(item.form, item)"
              >
                <el-option
                  v-for="self in item.purchaseContractList"
                  :key="self.id"
                  :label="self.titleName"
                  :value="self.applyNo"
                ></el-option>
              </el-select>
              <div class="red font12" v-if="item.form['purchaseContractNo']==='-1'">采购合同未完成，请尽快签署采购合同，并修改此项信息，方可发起BOM采购订单</div>
            </template>
          </avue-form>
        </basic-container>
      </el-col>
    </basic-container>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <avue-form
            v-if="isProcurement"
            :option="optionAmount"
            v-model="formAmount"
          ></avue-form>
          <div class="btn-submit" v-if="!isDetail">
            <el-button type="primary" icon="el-icon-check" @click="handleSubmit"
              >提交</el-button
            >
          </div>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { deepClone, findUniqueDuplicates,getCurrentDateTime } from "@/util/util";
import { validateFormArr } from "@/util/validate";
import { categoryConfig } from "./formConfig";
import PurchaseContractApplyApi from "@/api/purchaseContractApply/index";
import BomPurchaseContractApplyApi from "@/api/bomPurchaseContractApply/index";
import { getAllList, exchangeRate } from "@/api/contract/partsMaint";
import { subList } from "@/api/contract/partsSubMaint";
import { getDetail } from "@/api/contract/contractSupplier";
import { mapGetters } from "vuex";
import { downloadFileBlob, isGoogleChrome } from "@/util/util";
import UploadApi from "@/api/upload";
import upload from "@/components/upload/index";
export default {
  data() {
    return {
      isProcurement: false,
      subMaintList: [],
      haveChildPart: false,
      purchaseContractList: [],
      purchaseContractListBom: [],
      purchaseApplyList: [],
      formAmount: {
        unitPriceCny: null,
        taxAmount: null,
        unitPriceCnyNoTax: null,
      },
      currencyList: [],
      optionAmount: {
        column: [
          {
            type: "input",
            label: "总金额单价",
            disabled: true,
            span: 24,
            prop: "unitPriceCny",
            append: "CNY",
            placeholder: " ",
          },
          {
            type: "input",
            label: "税费",
            disabled: true,
            span: 24,
            prop: "taxAmount",
            append: "CNY",
            placeholder: " ",
          },
          {
            type: "input",
            label: "总金额",
            disabled: true,
            append: "CNY",
            span: 24,
            prop: "unitPriceCnyNoTax",
            placeholder: " ",
          },
        ],
        labelPosition: "left",
        labelWidth: 160,
        gutter: 0,
        menuBtn: true,
        submitBtn: false,
        emptyBtn: false,
        menuPosition: "center",
        detail: false,
        tabs: false,
        labelSuffix: " ",
        disabled: false,
      },
      isFirstLoad: false,
      formItem: {
        form: {
          categoryName: "",
          categoryDetail: "",
          supplierId: "",
          remark: "",
          unitPrice: "",
          isHistory: false,
          exchangeRateMethod: null,
          exchangeRate: "",
          unitPriceCny: "",
          includeTax: "",
          taxRate: "",
          purchaseType: null,
        },
        key: Date.parse(new Date()),
        optionCategory: {},
        refForm: "form1",
      },
      formList: [],
      isDetail: false,
    };
  },
  components: {
    upload,
  },
  props: {
    categoryForm: {
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
    canDelete() {
      return this.formList.length > 1;
    },
    ...mapGetters(["userInfo"]),
  },
  watch: {
    categoryForm: {
      handler() {
        //编辑或详情页面初始化
        if (this.categoryForm.id) {
          this.formAmount.unitPriceCny = this.categoryForm.unitPriceCny;
          this.formAmount.taxAmount = this.categoryForm.taxAmount;
          this.formAmount.unitPriceCnyNoTax =
            this.categoryForm.unitPriceCnyNoTax;
          if (this.categoryForm.createTime) {
            this.dealFormData();
          }
        } else {
          //新建页面初始化
          if (this.formList.length === 0) {
            this.addFromItem();
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
          this.isDetail = true;
          //控制页面是否可编辑
          this.formItem.optionCategory.disabled = true;
          this.formList.map((ele) => {
            ele.optionCategory.disabled = true;
          });
        }
      },
      immediate: true,
      // 开启深度监听 deep
      deep: true,
    },
  },
  mounted() {
    this.getPurchaseContractList();
    this.getPurchaseApplyList();
    this.getSubList();
    this.havePriceInfo();
    // this.isProcurementFlow ||
    this.isProcurement = this.userInfo.account === "shenyanxia";
  },
  // 失焦事件和change时间在formConfig目录下，通过bind修改this指向和传递不同的参数
  methods: {
    onExportCategory(arr, list) {
      this.formList = []
      arr.map((ele,index) => {
        this.formList.push({
          form: ele,
          key: Date.parse(new Date()) + index,
          optionCategory: this.getOption(ele),
          refForm: `form${index + 1}`,
        });
      });
    },
   async downModel() {
      let obj = {
        url: "http://10.30.4.68:9000/license-prd/upload/20251204/2e51fb6cd1458e2be2a70b5cebf98c5d.xlsx",
      };
      let res = await UploadApi.getUrl(obj);
      if (isGoogleChrome()) {
        downloadFileBlob(res.data.data, "品类导入模板.xlsx");
      } else {
        window.open(res.data.data);
      }
    },
    async getPurchaseContractList() {
      let res = await BomPurchaseContractApplyApi.selectList();
      if (res.data.code === 0) {
        this.purchaseContractListBom = res.data.data;
        this.purchaseContractListBom.unshift({
          titleName: "无",
          applyNo: "-1",
        });
      }
    },
    async getSubList() {
      let res = await subList();
      if (res.data.code === 200 || res.data.code === 0) {
        this.subMaintList = JSON.parse(JSON.stringify(res.data.data));
      }
    },
    toChildDetail(item) {
      console.log(item);
      let id =
        item.form.curId || item.form.partsMaintOriginalId || item.form.id;
      let url = `/partsMaintSubAdd?id=${id}&key=detail`;
      window.open(this.$router.resolve({ path: url }).href, "_blank");
    },
    subFormStyle(column, haveChildPart, includeTax) {
      if (!column) return;
      let columnCategoryNo = this.findObject(column, "categoryNo");
      let columnCategoryName = this.findObject(column, "categoryName");
      let columnCategoryType = this.findObject(column, "categoryType");
      let columnRemark = this.findObject(column, "remark");
      let columnNeedUseNumber = this.findObject(column, "needUseNumber");
      if (haveChildPart) {
        columnCategoryName.type = "select";
        columnCategoryName.disabled = false;
        columnCategoryNo.type = "select";
        if (columnCategoryName.rules && columnCategoryName.rules.length > 0) {
          columnCategoryName.rules[0].trigger = "change";
        }
        if (columnCategoryNo.rules && columnCategoryNo.rules.length > 0) {
          columnCategoryNo.rules[0].trigger = "change";
        }
        columnNeedUseNumber.display = true;
        columnCategoryNo.disabled = false;
        columnCategoryType.disabled = true;
        columnRemark.disabled = true;
      } else {
        if (columnCategoryName.rules && columnCategoryName.rules.length > 0) {
          columnCategoryName.rules[0].trigger = "blur";
        }
        if (columnCategoryNo.rules && columnCategoryNo.rules.length > 0) {
          columnCategoryNo.rules[0].trigger = "blur";
        }
        columnNeedUseNumber.display = false;
        columnCategoryName.disabled = true;
        columnCategoryName.type = "input";
        columnCategoryNo.disabled = true;
        columnCategoryNo.type = "input";
        columnCategoryType.disabled = false;
        columnRemark.disabled = false;
      }
      return column;
    },
    havePriceInfo() {
      this.formList.map(async (ele) => {
        let column = ele.optionCategory.column;
        column.map((item) => {
          if (item.disabledKeys) {
            item.disabled =
              item.disabledKeys.includes("isProcurement") && this.isProcurement;
          }
          if (item.displayKeys) {
            if ((!ele.form.supplierId || item.label !== "供应商")&&!this.isDetail) {
              item.display =
                item.displayKeys.includes("isProcurement") &&
                this.isProcurement;
            } else {
              if (this.isDetail || this.isProcurement) {
                item.display = true;
              }
            }
          }
          if (
            ele.form.includeTax &&
            (item.label === "税率" || item.label === "税费")
          ) {
            item.display = false;
          }
        });
      });
    },
    changePartName(form) {
      this.haveChildPart = form.haveSubPart === 1;
      this.formList.map(async (ele) => {
        if (!this.haveChildPart) {
          ele.form.categoryName = form.partsName;
        }
      });
    },
    changeForm(form, isDetail) {
      this.haveChildPart = form.haveSubPart === 1;
      this.formList.map(async (ele) => {
        this.subFormStyle(ele.optionCategory.column, this.haveChildPart);
        if (!this.haveChildPart) {
          ele.form.categoryName = form.partsName;
          ele.form.categoryNo = form.partsNo;
        } else if (!isDetail) {
          ele.form.categoryName = null;
        }
        if (this.$refs[ele.refForm] && this.$refs[ele.refForm].length > 0) {
          this.$refs[ele.refForm][0].clearValidate();
        }
      });
    },
    async getPurchaseApplyList() {
      let res = await PurchaseContractApplyApi.selectList();
      if (res.data.code === 200 || res.data.code === 0) {
        this.purchaseApplyList = res.data.data;
        this.purchaseApplyList.unshift({ titleName: "无", applyNo: "-1" });
      }
    },
    isLastOne(index) {
      return index === this.formList.length - 1;
    },
    async dealFormData() {
      this.isFirstLoad = true;
      this.formList = [];
      await this.categoryForm.tbPartsCategoryList.map((ele, index) => {
        if (ele.supplierId) {
          ele.isHistory = true;
        }
        this.formList.push({
          form: ele,
          key: Date.parse(new Date()) + index,
          optionCategory: this.getOption(ele),
          refForm: `form${index + 1}`,
        });
      });
      //等每个formList都会去对应的值后再去获取配置项目
      this.formList.map((ele) => {
        ele.optionCategory = this.getOption(ele);
      });
      this.formList.map(async (ele) => {
        if (ele.form.supplierId) {
          let res = await getDetail({ supplierId: ele.form.supplierId });
          let columnCurreny = this.findObject(
            ele.optionCategory.column,
            "originalCurrency"
          );
          if (res.data.data && res.data.data.supplierSettlementList) {
            columnCurreny.dicData = res.data.data.supplierSettlementList;
          }
        }
      });
      if (this.isDetail) {
        await this.formList.map((ele) => {
          ele.optionCategory.disabled = true;
        });
      }
      this.$nextTick(() => {
        this.isFirstLoad = false;
      });
      this.havePriceInfo();
    },
    getPurchaseRow(form, item) {
      let row = item.purchaseContractList.find((ele) => {
        return ele.applyNo === form.purchaseContractNo;
      });
      form.purchaseContractName = row.titleName;
      form.validDate =
        form.purchaseType === "2"
          ? [row.beginTime, row.endTime]
          : [row.startDate, row.endDate];
      form.validStartDate =
        form.purchaseType === "2" ? row.beginTime : row.startDate;
      form.validEndDate = form.purchaseType === "2" ? row.endTime : row.endDate;
    },
    getOption(ele) {
      let fn = categoryConfig.bind(this, { currencyKey: ele.key });
      let option = fn().optionCategory;
      if (ele.includeTax === 0) {
        let taxAmount = this.findObject(option.column, "taxAmount");
        let taxRate = this.findObject(option.column, "taxRate");
        taxAmount.display = true;
        taxRate.display = true;
      }
      if (this.keyOperate === "detail" || (ele.form && ele.form.isHistory)) {
        option.disabled = true;
      }
      return option;
    },
    async addFromItem(item, index) {
      let dealItem = deepClone(this.formItem);
      //使用深拷贝避免list混淆
      dealItem.refForm = `form${this.formList.length + 1}`;
      dealItem.key =
        Date.parse(new Date()) + "_" + Math.random().toString(36).substr(2, 9);
      let fn = categoryConfig.bind(
        this,
        deepClone({ currencyKey: dealItem.key })
      );
      dealItem.optionCategory = fn().optionCategory;
      dealItem.optionCategory.column[0].type = "select"; //零件号下拉
      dealItem.optionCategory.column[1].type = "select"; //零件名称下拉
      if (index !== undefined || item) {
        dealItem.form = deepClone(item.form);
        dealItem.form.id = null;
        dealItem.form.isStart = true;
        dealItem.form.createTime = getCurrentDateTime()
        dealItem.form.isHistory = false;
        let res = await getDetail({ supplierId: dealItem.form.supplierId });
        let columnCurreny = this.findObject(
          dealItem.optionCategory.column,
          "originalCurrency"
        );
        columnCurreny.dicData = res.data.data.supplierSettlementList;
        let deepList = deepClone(this.formList);
        deepList.splice(index, 0, deepClone(dealItem));
        this.formList = deepList;
      } else {
        let deepItem = deepClone(dealItem);
        deepItem.optionCategory.column = this.subFormStyle(
          deepItem.optionCategory.column,
          this.haveChildPart
        );
        this.formList.push(deepItem);
      }
      this.havePriceInfo();
    },
    onAddItemCategory() {
      this.addFromItem();
    },
    async getContractType({ currencyKey }, e) {
      this.formList.map(async (ele) => {
        if (ele.key === currencyKey) {
          if (e.value == "2") {
            if (this.purchaseContractListBom.length === 0) {
              await this.getPurchaseContractList();
            }
            if (ele.purchaseContractList) {
              ele.purchaseContractList = this.purchaseContractListBom;
            } else {
              this.$set(
                ele,
                "purchaseContractList",
                this.purchaseContractListBom
              );
            }
          } else if (e.value === "1") {
            if (this.purchaseApplyList.length === 0) {
              await this.getPurchaseApplyList();
            }
            if (ele.purchaseContractList) {
              ele.purchaseContractList = this.purchaseApplyList;
            } else {
              this.$set(ele, "purchaseContractList", this.purchaseApplyList);
            }
          }
        }
      });
    },

    dealFormPart(ele, obj, index) {
      if (this.isFirstLoad) return;
      ele.form.categoryName = obj.partsName;
      ele.form.categoryNo = obj.partsNo;
      ele.form.partsMaintOriginalId = obj.id;
      ele.form.id = null;
      ele.form.needUseNumber = null;
      // ele.form.needNumber = initNeedNumber;
      // let initFormId = ele.form && ele.form.id ? JSON.parse(JSON.stringify(ele.form.id)) : null
      // let hisForm = JSON.parse(JSON.stringify(ele.form))
      // let initNeedNumber = ele.form && ele.form.needNumber ? JSON.parse(JSON.stringify(ele.form.needNumber)) : null
      // if (obj&&!obj.haveSubPart) {
      //   //获取生效中的,如果没有生效的就取第一个
      //   let one = obj.tbPartsCategoryList.find((ele) => {
      //     return ele.status === 1;
      //   });
      //   console.log(one);
      //   if (one) {
      //     ele.form = one;
      //   } else {
      //     ele.form = obj.tbPartsCategoryList[0];
      //   }

      //   if (!ele.form) return
      //   let deepValue = JSON.parse(JSON.stringify(ele.form))
      //   //新的ID或者是更新了子零件
      //   if (hisForm.haveSubPart && (initFormId === null || hisForm.categoryNo !== ele.form.categoryNo)) {
      //     ele.form.partsMaintOriginalId = deepValue.partsMaintOriginalId||obj.id
      //     ele.form.partsCategoryOriginalId = deepValue.id
      //     ele.form.id = null
      //   } else {
      //     ele.form.partsMaintOriginalId = hisForm.partsMaintOriginalId||obj.id
      //     // 有原零件取原零件的值，没有则取匹配的值
      //     ele.form.partsCategoryOriginalId = hisForm.partsCategoryOriginalId
      //     ele.form.id = initFormId
      //   }
      //   ele.form.curId =  obj.id//用于当前选择的跳转
      //   ele.form.needNumber = initNeedNumber
      //   ele.form.partsCategoryId = hisForm.partsCategoryId
      //   ele.form.validDate = [ele.form.validStartDate, ele.form.validEndDate]
      // }else if(obj.haveSubPart){
      // }
    },
    async getCategoryName(form, item, index) {
      let obj = this.subMaintList.find((ele) => {
        return ele.partsName === form.categoryName;
      });
      if (obj) {
        let deepObj = JSON.parse(JSON.stringify(obj));
        this.dealFormPart(item, deepObj, index);
      }
    },
    async getCategoryNo(form, item, index) {
      if (!this.haveChildPart) return;
      let obj = this.subMaintList.find((ele) => {
        return ele.partsNo === form.categoryNo;
      });
      if (obj) {
        let deepObj = JSON.parse(JSON.stringify(obj));
        this.dealFormPart(item, deepObj, index);
      }
    },
    handleDeleteBtnCategory(item) {
      this.formList = this.formList.filter((ele) => {
        return ele !== item;
      });
      this.getAllAmount();
    },
    exchangeCategory(item, index) {
      this.addFromItem(item, index);
    },
    getTaxAmount({ currencyKey }, e) {
      this.formList.map((ele) => {
        if (ele.key === currencyKey) {
          let currencyTaxRate =
            e.column.prop === "taxRate" ? e.value : ele.form.taxRate;
          let currencyUnitPriceCny =
            e.column.prop === "unitPriceCny" ? e.value : ele.form.unitPriceCny;
          if (ele.form.unitPriceCny && ele.form.taxRate) {
            ele.form.taxAmount = (
              (Number(currencyUnitPriceCny) * Number(currencyTaxRate)) /
              100
            ).toFixed(2);
          }
        }
      });
      this.getAllAmount();
    },
    getAllAmount() {
      let idsCategory = [];
      this.formAmount.unitPriceCny = null;
      this.formAmount.taxAmount = null;
      this.formList.map((ele) => {
        if (ele.form.status === 1) {
          idsCategory.push(ele.form.partsCategoryId);
        }
      });
      this.formList.map((ele) => {
        if (
          ele.form.status === 1 ||
          !idsCategory.includes(ele.form.partsCategoryId)
        ) {
          this.formAmount.unitPriceCny += Number(ele.form.unitPriceCny) || 0;
          this.formAmount.taxAmount += Number(ele.form.taxAmount) || 0;
        }
      });
      this.formAmount.taxAmount = Number(
        this.formAmount.taxAmount || 0
      ).toFixed(2);
      this.formAmount.unitPriceCny = Number(
        this.formAmount.unitPriceCny
      ).toFixed(2);
      this.formAmount.unitPriceCnyNoTax = (
        Number(this.formAmount.unitPriceCny) + Number(this.formAmount.taxAmount)
      ).toFixed(2);
    },
    // 供应商 变化
    async getSupplierName({ currencyKey }, { value }) {
      if (!this.formList || this.formList.length === 0) return;
      const { form, optionCategory } = this.formList.find(
        (ele) => ele.key === currencyKey
      );
      const {
        data: { data },
      } = await getAllList();
      const item = data.find((item) => item.id == value);
      const columnOriginal = this.findObject(
        optionCategory.column,
        "originalCurrency"
      );
      if (value) {
        let res = await getDetail({ supplierId: value });
        columnOriginal.dicData = res.data.data.supplierSettlementList;
      }
      if (
        (form.isHistory === undefined || !form.isHistory) &&
        !form.isStart &&
        item &&
        item.supplierSettlementList &&
        item.supplierSettlementList.length > 0
      ) {
        this.dealMoney(item.supplierSettlementList[0], form);
      }
      form.isStart = false;
    },
    //原币种 originalCurrency;
    //结算币种 settlementCurrency;
    //汇率方式2.当年1日3.当季1日 exchangeRateMethod;
    async dealMoney(row, form) {
      form.supplierSettlementId = row.id;
      form.originalCurrency = row.originalCurrency;
      form.settlementCurrency = row.settlementCurrency;
      form.exchangeRateMethod = row.exchangeRateMethod;
      form.CNYExchangeRateMethod = form.settlementCurrency === "CNY" ? 1 : 3;
      const { originalCurrency, settlementCurrency, exchangeRateMethod } = form;
      const {
        data: { data: res },
      } = await exchangeRate({
        originalCurrency,
        settlementCurrency,
        exchangeRateMethod,
      });
      //   返回取字段：，本月汇率：middleRate  人民币汇率：rmbRate
      form.middleRate = res.middleRate;
      form.rmbRate = res.rmbRate;
      const { unitPrice, middleRate, rmbRate } = form;
      if (unitPrice) {
        form.settlementAmount = (unitPrice * middleRate).toFixed(2);
        form.unitPriceCny = (form.settlementAmount * rmbRate).toFixed(2);
      }
    },
    getUnitPriceCny({ currencyKey }, { value }) {
      const { form } = this.formList.find((ele) => ele.key === currencyKey);
      const { middleRate, rmbRate } = form;
      if (value && middleRate && rmbRate) {
        form.settlementAmount = (value * middleRate).toFixed(2);
        form.unitPriceCny = (form.settlementAmount * rmbRate).toFixed(2);
      }
    },
    getRate({ currencyKey }, e) {
      let oneItem = this.formList.find((ele) => ele.key === currencyKey);
      let columnCurreny = this.findObject(
        oneItem.optionCategory.column,
        "originalCurrency"
      );
      let row = columnCurreny.dicData.find((ele) => {
        return ele.originalCurrency === e.value;
      });
      if (row) {
        this.dealMoney(row, oneItem.form);
      }
    },
    changeTax({ currencyKey }, e) {
      this.formList.map((ele) => {
        if (ele.key === currencyKey) {
          let taxAmount = this.findObject(
            ele.optionCategory.column,
            "taxAmount"
          );
          let taxRate = this.findObject(ele.optionCategory.column, "taxRate");
          if (e.value === 0) {
            taxAmount.display = true;
            taxRate.display = true;
          } else {
            taxAmount.display = false;
            taxRate.display = false;
            ele.form.taxRate = null;
            ele.form.taxAmount = null;
            this.getAllAmount();
          }
        }
      });
    },
    handleSubmit() {
      // console.log(this.formList);
      let oneIdList = this.formList.filter(
        (item, index, self) =>
          index === self.findIndex((obj) => obj.partsCategoryId === item.partsCategoryId)
      );
      let formVaildList = oneIdList.filter((ele) => {
        return ele.form.status !== 0;
      });
      let partNos = formVaildList.map((ele) => ele.form.categoryNo);
      let arr = findUniqueDuplicates(partNos);
      if (arr.length > 0) {
        this.$message.error(`品类零件号${arr[0]}重复`);
        return;
      }
      this.$emit("testForm");
      let arrForm = this.formList.map((ele) => ele.refForm);
      validateFormArr(this, arrForm, () => {
        this.$emit("handleSubmit", this.formList, this.formAmount);
      });
    },
  },
};
</script>

<style lang="scss">
.btn-submit {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.relative {
  position: relative;
}

.lose {
  position: absolute;
  z-index: 999;
  left: 40%;
  margin-top: 100px;
  // top:50%;
}
</style>