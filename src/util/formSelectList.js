/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-06-28 09:43:28
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-11-17 18:04:36
 * @FilePath: \icarx-ui\src\util\formSelectList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  getStore,
} from '@/util/store'
import constData from "@/config/constData";
import i18n from '@/lang/index';
const tenantId = getStore({ name: 'tenantId' })
const globalList = {
  type: "select",
  filterable: true
}
export const countryReginCode = {
  ...globalList,
  label: i18n.t("poOrder.countryOrRegion"),
  prop: "countryReginCode",
  placeholder: '请选择',
  dicUrl: "/api/oa-system/dict/dictionary?code=COUNTRY_REGIN",
  props: {
    label: "dictValue",
    value: "dictKey",
  }
}
// 已弃用 ，不再维护
export const area = {
  ...globalList,
  label: i18n.t("poOrder.countryOrRegion"),
  prop: "countryReginCode",
  placeholder: '请选择',
  dicUrl: "/api/oa-system/dict/dictionary?code=COUNTRY_REGIN",
  props: {
    label: "dictValue",
    value: "dictKey",
  }
}
export const modelId = {
  ...globalList,
  label: i18n.t("commonContent.modelName"),
  prop: "modelId",
  dicUrl: "/api/oa-portal/vehicleModelManage/selectList",
  props: {
    label: "modelName",
    value: "modelId",
  },
}
export const bomId = {
  ...globalList,
  label: i18n.t("commonContent.relatedBom"),
  prop: "bomId",
  dicUrl: "/api/oa-portal/bomMaint/selectList",
  props: {
    label: "bomName",
    value: "id",
  },
}
export const bomType = {
  ...globalList,
  label: i18n.t("commonContent.bomType"),
  prop: "bomType",
  dicData: constData.bomType,
}
export const applyPerson = {
  ...globalList,
  label: i18n.t("commonContent.applyPerson"),
  prop: "applyPerson",
  dicUrl: "/api/oa-user/user-list",
  props: {
    label: "name",
    value: "id",
  }
}
export const contractType = {
  ...globalList,
  label: i18n.t("commonContent.contractType"),
  dicUrl: "/api/oa-system/dict/dictionary?code=CONTRACT_CATEGORY",
  props: {
    label: "dictValue",
    value: "dictKey",
  },
  prop: "contractType",
}
export const partType = {
  ...globalList,
  label: i18n.t("commonContent.partType"),
  dicUrl: "/api/oa-portal/partsFunction/getListByParentId?parentId=0",
  props: {
    label: "functionName",
    value: "id",
  },
  prop: "parentFunctionId",
}
export const partsNo = {
  ...globalList,
  label: i18n.t("commonContent.partsNo"),
  dicUrl: "/api/oa-portal/partsMaint/selectlist",
  props: {
    label: "partsNo",
    value: "partsNo",
  },
  prop: "partsNo",
}

export const partsSubNo = {
  ...globalList,
  label: i18n.t("commonContent.partsNo"),
  dicUrl: "/api/oa-portal/partsMaint/subList",
  props: {
    label: "partsNo",
    value: "partsNo",
  },
  prop: "partsNo",
}

export const partsSubName = {
  ...globalList,
  label: i18n.t("commonContent.partsName"),
  dicUrl: "/api/oa-portal/partsMaint/subList",
  props: {
    label: "partsName",
    value: "id",
  },
  prop: "partsId",
}
export const partsName = {
  ...globalList,
  label: i18n.t("commonContent.partsName"),
  dicUrl: "/api/oa-portal/partsMaint/selectlist",
  props: {
    label: "partsName",
    value: "id",
  },
  prop: "partsId",
}

export const createUserName = {
  ...globalList,
  label: i18n.t("commonContent.createUserName"),
  dicUrl: `/api/oa-user/user-list?tenantId=${tenantId}`,
  props: {
    label: "realName",
    value: "id",
  },
  prop: "createUserName",
}
export const supplierId = {
  ...globalList,
  label: i18n.t("commonContent.supplierName"),
  dicUrl: `/api/oa-portal/contractSupplier/list`,
  props: {
    label: "supplierName",
    value: "id",
  },
  prop: "supplierId",
}
export const custId = {
  ...globalList,
  label: i18n.t("commonContent.customerName"),
  dicUrl: `/api/oa-portal/contractCustomer/selectList`,
  props: {
    label: "custName",
    value: "id",
  },
  prop: "custId",
}

export const supplierType = {
  ...globalList,
  label: i18n.t("commonContent.supplierType"),
  prop: "supplierType",
  dicData: constData.supplierType,
}
export const projectType = {
  ...globalList,
  label: i18n.t("commonContent.projectType"),
  prop: "projectType",
  dicData: constData.projectType,
}
export const collectionStatus = {
  ...globalList,
  label: i18n.t("commonContent.collectionStatus"),
  prop: "collectionStatus",
  dicData: constData.collectionStatus,
}
// [仓库状态]字典配置
export const storeStatus = {
  ...globalList,
  label: i18n.t("commonContent.storeStatus"),
  dicUrl: "/api/oa-system/dict/dictionary?code=store_status",
  props: {
    label: "dictValue",
    value: "dictKey",
  },
  prop: "storeStatus",
}
// 仓库列表
export const storeId = {
  ...globalList,
  label: i18n.t("commonContent.storeName"),
  dicUrl: "/api/oa-portal/store/select",
  props: {
    label: "storeName",
    value: "id",
  },
  prop: "storeId",
}
// [仓库属性]字典配置
export const storeProperties = {
  ...globalList,
  label: i18n.t("commonContent.storeProperties"),
  dicUrl: "/api/oa-system/dict/dictionary?code=store_properties",
  props: {
    label: "dictValue",
    value: "dictKey",
  },
  prop: "storeProperties",
}


