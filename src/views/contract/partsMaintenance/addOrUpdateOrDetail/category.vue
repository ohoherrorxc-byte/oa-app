<template>
  <div>
    <basic-container>
      <el-button
        class="mb10"
        type="success"
        icon="el-icon-plus"
        size="mini"
        v-if="!isDetail && !isProcurement"
        @click="onAddItemCategory"
        >添加</el-button
      >
      <el-col :span="24" v-for="(item, index) in formList" :key="item.key">
        <basic-container>
          <!-- status 0:失效，1： -->
          <div class="relative">
            <img
              src="@/assets/svg/lose.svg"
              class="lose"
              v-if="item.form.status === 0"
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
            <el-button
              v-if="
                !isDetail && !!item.form.isHistory && item.form.status === 1
              "
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
            <!-- <template slot="purchaseContractNo">
              <el-select
                :disabled="isDetail || item.form.isHistory"
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
            </template> -->
            <template slot="purchaseContractNo">
              <el-select
                :disabled="isDetail || item.form.isHistory"
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
              <div
                class="red font12"
                v-if="item.form['purchaseContractNo'] === '-1'"
              >
                采购合同未完成，请尽快签署采购合同，并修改此项信息，方可发起BOM采购订单
              </div>
            </template>
            <template slot="isProduct">
              <el-radio-group
                :disabled="isDetail || item.form.isHistory"
                v-model="item.form['isProduct']"
                @change="getAllAmount(item.form, item)"
              >
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <div class="red font12">
                生产属性将生成BOM采购结算订单
              </div>
            </template>
          </avue-form>
        </basic-container>
      </el-col>
    </basic-container>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <avue-form
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
import {
  getAllList,
  exchangeRate,
  getSubMaintList,
  getSubMaintDetail,
} from "@/api/contract/partsMaint";
import { getDetail } from "@/api/contract/contractSupplier";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isProcurement: false,
      subMaintList: [],
      haveChildPart: 0,
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
    isUpdateFlow: {
      type: Boolean,
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
          if (this.categoryForm.createUser) {
            this.dealFormData();
          }
        } else {
          //新建页面初始化
          this.addFromItem();
        }
      },
      immediate: true,
      // 开启深度监听 deep
      deep: true,
    },
    keyOperate: {
      handler() {
        if (this.keyOperate === "detail") {
          this.isDetailDeal();
          // this.isDetail = true;
          // //控制页面是否可编辑
          // this.formItem.optionCategory.disabled = true;
          // this.formList.map((ele) => {
          //   ele.optionCategory.disabled = true;
          // });
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
    if (this.isUpdateFlow) {
      this.isDetailDeal();
    }
    //this.isProcurementFlow ||
    this.isProcurement = this.userInfo.account === "shenyanxia";
    this.havePriceInfo();
  },
  // 失焦事件和change时间在formConfig目录下，通过bind修改this指向和传递不同的参数
  methods: {
    isDetailDeal() {
      this.isDetail = true;
      //控制页面是否可编辑
      this.formItem.optionCategory.disabled = true;
      this.formList.map((ele) => {
        ele.optionCategory.disabled = true;
      });
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
    havePriceInfo() {
      this.formList.map(async (ele) => {
        let column = ele.optionCategory.column;
        column.map((item) => {
          if (item.disabledKeys) {
            item.disabled =
              item.disabledKeys.includes("isProcurement") && this.isProcurement;
          }
          if (item.displayKeys) {
            if (this.isProcurement) {
              item.display =
                item.displayKeys.includes("isProcurement") &&
                this.isProcurement;
            } else if (this.isSystemGroup()&&!this.isDetail) {
              item.display = !item.displayKeys.includes("isProcurement");
              if (
                ele.form.supplierId &&
                item.label === "供应商" &&
                this.isDetail
              ) {
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
    isSystemGroup() {
      return (
        this.userInfo.account === "jizhonghua" ||
        this.userInfo.account === "zhouxiangyu" ||
        this.userInfo.account === "niuyinuo"||this.userInfo.account === "liyazhao"
      );
    },
    async getSubList() {
      let res = await getSubMaintList();
      if (res.data.code === 200 || res.data.code === 0) {
        this.subMaintList = res.data.data;
      }
    },
    subFormStyle(column, haveChildPart, includeTax) {
      let columnCategoryNo = this.findObject(column, "categoryNo");
      let columnCategoryName = this.findObject(column, "categoryName");
      // let columnCategoryType = this.findObject(column, 'categoryType')
      let columnPurchaseType = this.findObject(column, "purchaseType");
      let columnUnitPrice = this.findObject(column, "unitPrice");
      let columnSupplierId = this.findObject(column, "supplierId");
      let columnOriginalCurrency = this.findObject(column, "originalCurrency");
      let columnCostPriceType = this.findObject(column, "costPriceType");
      let columnNeedUseNumber = this.findObject(column, "needUseNumber");
      let columnStockInPrice = this.findObject(column, "stockInPrice");
      let columnIncludeTax = this.findObject(column, "includeTax");
      let columnTaxRate = this.findObject(column, "taxRate");
      let columnTaxAmount = this.findObject(column, "taxAmount");
      let columnRemark = this.findObject(column, "remark");
      let columnPurchaseContractNo = this.findObject(
        column,
        "purchaseContractNo"
      );
      let columnCreateTime = this.findObject(column, "createTime");
      let columnSettlementCurrency = this.findObject(
        column,
        "settlementCurrency"
      );
      let columnMiddleRate = this.findObject(column, "middleRate");
      let columnEmbRate = this.findObject(column, "rmbRate");
      let columnCNY = this.findObject(column, "CNYExchangeRateMethod");
      let columnSettlementAmount = this.findObject(column, "settlementAmount");
      let columnExchangeRateMethod = this.findObject(
        column,
        "exchangeRateMethod"
      );
      let columnValidDate = this.findObject(column, "validDate");
      let columnIsProduct = this.findObject(column, "isProduct");
      if (haveChildPart === 1) {
        columnCategoryName.type = "select";
        if (columnCategoryName.rules && columnCategoryName.rules.length > 0) {
          columnCategoryName.rules[0].trigger = "change";
        }
        columnIsProduct.display = true;
        if (columnCategoryNo.rules && columnCategoryNo.rules.length > 0) {
          columnCategoryNo.rules[0].trigger = "change";
        }
        columnCategoryNo.type = "select";
        columnPurchaseType.display = false;
        columnSupplierId.display = false;
        columnOriginalCurrency.disabled = true;
        columnUnitPrice.disabled = true;
        columnCostPriceType.display = false;
        columnNeedUseNumber.display = true;
        columnStockInPrice.display = false;
        columnValidDate.display = false;
        columnIncludeTax.disabled = true;
        columnTaxAmount.display = !includeTax ? false : true;
        columnTaxRate.display = !includeTax ? false : true;
        columnRemark.display = false;
        columnPurchaseContractNo.display = false;
        columnCreateTime.display = false;
        columnSettlementCurrency.display = false;
        columnMiddleRate.display = false;
        columnEmbRate.display = false;
        columnCNY.display = false;
        columnSettlementAmount.display = false;
        columnExchangeRateMethod.display = false;
      } else {
        columnCategoryName.type = "input";
        columnCategoryNo.type = "input";
        columnIsProduct.display = false;
        if (columnCategoryName.rules && columnCategoryName.rules.length > 0) {
          columnCategoryName.rules[0].trigger = "blur";
        }
        if (columnCategoryNo.rules && columnCategoryNo.rules.length > 0) {
          columnCategoryNo.rules[0].trigger = "blur";
        }
        columnPurchaseType.display = true;
        columnSupplierId.display = true;
        columnValidDate.display = true;
        columnOriginalCurrency.disabled = false;
        columnUnitPrice.disabled = false;
        columnCostPriceType.display = true;
        columnNeedUseNumber.display = true;
        columnStockInPrice.display = true;
        columnIncludeTax.disabled = false;
        // columnIncludeTax.display = !includeTax ? false : true
        columnTaxAmount.display = !includeTax ? false : true;
        columnTaxRate.display = !includeTax ? false : true;
        columnRemark.display = true;
        columnPurchaseContractNo.display = true;
        columnCreateTime.display = true;
        columnSettlementCurrency.display = true;
        columnMiddleRate.display = true;
        columnEmbRate.display = true;
        columnCNY.display = true;
        columnSettlementAmount.display = true;
        columnExchangeRateMethod.display = true;
      }
      return column;
    },
    toChildDetail(item) {
      let id = item.form.partsMaintOriginalId || item.form.partsMaintId;
      let url = `/partsMaintSubAdd?id=${id}&key=detail`;
      window.open(this.$router.resolve({ path: url }).href, "_blank");
    },
    async commonGetCategory(currencyKey, e, valueKey) {
      if (!currencyKey) return;
      let oldCategoryFormList = JSON.parse(
        JSON.stringify(this.categoryForm.tbPartsCategoryList)
      );
      if (this.subMaintList.length === 0) {
        await this.getSubList();
      }
      this.formList.map(async (ele, index) => {
        if (ele.key === currencyKey) {
          let obj = this.subMaintList.find((ele) => {
            return ele[valueKey] === e.value;
          });
          if (obj) {
            let initFormId =
              ele.form && ele.form.id
                ? JSON.parse(JSON.stringify(ele.form.id))
                : null;
            let initStatus =
              ele.form && ele.form.id
                ? JSON.parse(JSON.stringify(ele.form.status))
                : null;
            let initFormCategoryId =
              ele.form && ele.form.partsCategoryId
                ? JSON.parse(JSON.stringify(ele.form.partsCategoryId))
                : null;
            let isProductValue =
              ele.form && ele.form.isProduct
                ? JSON.parse(JSON.stringify(ele.form.isProduct))
                : null;
            let res = await getSubMaintDetail(obj.id);
            if (res.data.code === 200 || res.data.code === 0) {
              ele.form = res.data.data;
              ele.form.id = initFormId;
              ele.form.partsCategoryId = initFormCategoryId;
              ele.form.categoryName = obj.partsName;
              ele.form.categoryNo = obj.partsNo;
              ele.form.status = initStatus;
              ele.form.isProduct = isProductValue;
              ele.form.needUseNumber =
                oldCategoryFormList.length > 0
                  ? oldCategoryFormList[index].needUseNumber
                  : null;
            }
          }
        }
      });
    },
    async getCategoryName({ currencyKey }, e) {

      if (!this.haveChildPart) return;
      this.commonGetCategory(currencyKey, e, "partsName");
    },

    getCategoryNo({ currencyKey }, e) {
      if (!this.haveChildPart) return;
      this.commonGetCategory(currencyKey, e, "partsNo");
    },
    changeForm(form, key) {
      this.haveChildPart = form.haveSubPart;
      this.formList.map(async (ele) => {
        this.subFormStyle(
          ele.optionCategory.column,
          form.haveSubPart,
          ele.form.includeTax
        );
      });
      this.havePriceInfo();
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
      this.formList = [];
      await this.categoryForm.tbPartsCategoryList.map((ele, index) => {
        ele.isHistory = true;
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
          columnCurreny.dicData = res.data.data.supplierSettlementList;
        }
      });
      this.changeForm(this.categoryForm);
      if (this.isDetail) {
        await this.formList.map((ele) => {
          ele.optionCategory.disabled = true;
        });
      }
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
    async addFromItem(item, index,copy) {
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
      if (index !== undefined || item) {
        dealItem.form = deepClone(item.form);
        dealItem.form.id = null;
        dealItem.form.isStart = true;
        dealItem.form.createTime = getCurrentDateTime()
        dealItem.form.isHistory = false;
        if (dealItem.form.supplierId) {
          let res = await getDetail({ supplierId: dealItem.form.supplierId });
          let columnCurreny = this.findObject(
            dealItem.optionCategory.column,
            "originalCurrency"
          );
          columnCurreny.dicData = res.data.data.supplierSettlementList;
        }
        let deepList = deepClone(this.formList);
        dealItem.optionCategory.column = this.subFormStyle(
          dealItem.optionCategory.column,
          this.haveChildPart,
          item.form.includeTax
        );
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
      if (!currencyKey) return;
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
    handleDeleteBtnCategory(item) {
      this.formList = this.formList.filter((ele) => {
        return ele !== item;
      });
      this.getAllAmount();
    },
    exchangeCategory(item, index) {
      this.addFromItem(item, index,"copy");
    },
    getTaxAmount({ currencyKey }, e) {
      if (!currencyKey) return;
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
    //1.如果有子零件，只计算生产属性的价格，其他情况，同一零件只计算一次
    getAllAmount() {
      this.formAmount.unitPriceCny = null;
      this.formAmount.taxAmount = null;
      let idsCategory = [];
      this.formList.map((ele) => {
        if (ele.form.status === 1) {
          idsCategory.push(ele.form.partsCategoryId);
        }
      });
      this.formList.map((ele) => {
        if (this.haveChildPart) {
          this.formList.map((ele) => {
            if (ele.form.isProduct) {
              this.formAmount.unitPriceCny = ele.form.unitPriceCny;
              this.formAmount.taxAmount = ele.form.taxAmount;
            }
          });
        } else {
          //如果失效并且之前计算过的品类就不要计算了
          if (
            ele.form.status === 1 ||
            !idsCategory.includes(ele.form.partsCategoryId)
          ) {
            this.formAmount.unitPriceCny += Number(ele.form.unitPriceCny) || 0;
            this.formAmount.taxAmount += Number(ele.form.taxAmount) || 0;
          }
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
      let row = this.formList.find((ele) => ele.key === currencyKey);
      if (!row) {
        return;
      }
      const { form, optionCategory } = row;
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
      if (!form) return;
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
      if (!currencyKey) return;
      const { form } = this.formList.find((ele) => ele.key === currencyKey);
      const { middleRate, rmbRate } = form;
      if (value && middleRate && rmbRate) {
        form.settlementAmount = (value * middleRate).toFixed(2);
        form.unitPriceCny = (form.settlementAmount * rmbRate).toFixed(2);
      }
    },
    getRate({ currencyKey }, e) {
      if (!currencyKey) return;
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
      if (!currencyKey) return;
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
      let oneIdList = this.formList.filter(
        (item, index, self) =>
          index ===
          self.findIndex((obj) => obj.partsCategoryId === item.partsCategoryId)
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