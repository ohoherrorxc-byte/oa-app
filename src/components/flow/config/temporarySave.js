// 不同流程的暂存入口
//
// 关键优化：@/api/myFlow/operate/temporarySave.js 体积很大（60+ 个方法），
// 之前 static import 会让 temporarySave.js 整个塞进 flow chunk。
// 改成 dynamic import 后：flow 启动时 0 加载，点暂存时才拉对应 chunk。
// chunk 拆分靠 vue.config.js 的 flowTempSaveApi cacheGroup（enforce: true 无视 minSize 强制拆分）。
//
// 调用方式：
//   const fn = await TemporarySaveOperate.get(this.componentTag)
//   const res = await fn(data)
//
// componentTag -> TemporarySaveApi 方法名的完整重命名表（其他 tag 跟同名同名）：
//   maintenanceParts                    -> saveParts
//   receiveParts                        -> usingPartSaveDraft
//   returnParts                         -> returnPartSaveDraft
//   scrappingParts                      -> scrapPartSaveDraft
//   storageParts                        -> stockInPartSaveDraft
//   transferParts                       -> transferPartSaveDraft
//   entryWorkshop                       -> saveJoin
//   dimission                           -> saveLeave
//   workOvertime                        -> workOvertimeApply
//   cardReplacement                     -> startAddClockIn
//   askForLeave                         -> leaveApply
//   saleContractApplication             -> saveSaleContractApply
//   saleContractChangeApplication       -> saveSaleContractChangeApply
//   invoiceApplication                  -> saveInvoiceApplication
//   saleOrderApplication                -> saveSaleOrderApply
//   purchaseApplication                 -> savePurchaseApply
//   purchaseCommissionDecisionApplication -> savePurchaseCommissionDecisionApply
//   subscriptionApplication             -> saveSubscriptionApply
//   purchaseContractApplication         -> savePurchaseContractApply
//   licensePurchaseContractApplication  -> saveLicensePurchaseContractApply
//   bomPurchaseContractApplication      -> saveBomPurchaseContractApply
//   bomPurchaseOrderApplication         -> saveBomPurchaseOrderApply
//   purchaseContractPayApplication      -> savePurchaseContractPayApply
//   acceptApply                         -> saveAcceptApply
//   bomPurchaseContractPayApplication   -> saveBomPurchaseContractPay

const TAG_TO_API = {
    maintenanceParts: 'saveParts',
    receiveParts: 'usingPartSaveDraft',
    returnParts: 'returnPartSaveDraft',
    scrappingParts: 'scrapPartSaveDraft',
    storageParts: 'stockInPartSaveDraft',
    transferParts: 'transferPartSaveDraft',
    entryWorkshop: 'saveJoin',
    dimission: 'saveLeave',
    workOvertime: 'workOvertimeApply',
    cardReplacement: 'startAddClockIn',
    askForLeave: 'leaveApply',
    saleContractApplication: 'saveSaleContractApply',
    saleContractChangeApplication: 'saveSaleContractChangeApply',
    invoiceApplication: 'saveInvoiceApplication',
    saleOrderApplication: 'saveSaleOrderApply',
    purchaseApplication: 'savePurchaseApply',
    purchaseCommissionDecisionApplication: 'savePurchaseCommissionDecisionApply',
    subscriptionApplication: 'saveSubscriptionApply',
    purchaseContractApplication: 'savePurchaseContractApply',
    licensePurchaseContractApplication: 'saveLicensePurchaseContractApply',
    bomPurchaseContractApplication: 'saveBomPurchaseContractApply',
    bomPurchaseOrderApplication: 'saveBomPurchaseOrderApply',
    purchaseContractPayApplication: 'savePurchaseContractPayApply',
    acceptApply: 'saveAcceptApply',
    bomPurchaseContractPayApplication: 'saveBomPurchaseContractPay',
}

export default {
    async get(tag) {
        const { default: TemporarySaveApi } = await import(
            /* webpackChunkName: "flow-temp-save-api" */ '@/api/myFlow/operate/temporarySave.js'
        )
        const apiName = TAG_TO_API[tag] || tag
        const handler = TemporarySaveApi[apiName]
        if (typeof handler !== 'function') {
            throw new Error(`TemporarySaveOperate: 未找到 componentTag="${tag}" 对应的 temporarySave 接口（已尝试 api="${apiName}"）`)
        }
        return handler
    },
}