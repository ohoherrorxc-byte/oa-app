// 不同流程的保存（提交）入口
//
// 关键优化：@/api/myFlow/operate/save.js 体积很大（60+ 个方法），
// 之前 static import 会让 save.js 整个塞进 flow chunk。
// 改成 dynamic import 后：flow 启动时 0 加载，点保存时才拉对应 chunk。
// chunk 拆分靠 vue.config.js 的 flowSaveApi cacheGroup（enforce: true 无视 minSize 强制拆分）。
//
// 调用方式：
//   const fn = await SaveOperate.get(this.componentTag)
//   const res = await fn(data)
//
// componentTag -> SaveApi 方法名的完整重命名表（其他 tag 跟同名同名）：
//   entryWorkshop                       -> startJoin
//   dimission                           -> startLeave
//   workOvertime                        -> workOvertimeApply
//   cardReplacement                     -> startAddClockIn
//   askForLeave                         -> leaveApply
//   saleContractApplication             -> saleContractStartProcess
//   saleContractChangeApplication       -> saleContractChangeStartProcess
//   invoiceApplication                  -> invoiceStartProcess
//   purchaseApplication                 -> purchaseStartProcess
//   purchaseCommissionDecisionApplication -> purchaseCommissionDecisionStartProcess
//   subscriptionApplication             -> subscriptionStartProcess
//   purchaseContractApplication         -> purchaseContractStartProcess
//   licensePurchaseContractApplication  -> licensePurchaseContractStartProcess
//   bomPurchaseContractApplication      -> bomPurchaseContractStartProcess
//   bomPurchaseOrderApplication         -> bomPurchaseOrderStartProcess
//   purchaseContractPayApplication      -> purchaseContractPayStartProcess
//   acceptApply                         -> acceptApplyStartProcess
//   bomPurchaseContractPayApplication   -> bomPurchaseContractPayStartProcess

const TAG_TO_API = {
    entryWorkshop: 'startJoin',
    dimission: 'startLeave',
    workOvertime: 'workOvertimeApply',
    cardReplacement: 'startAddClockIn',
    askForLeave: 'leaveApply',
    saleContractApplication: 'saleContractStartProcess',
    saleContractChangeApplication: 'saleContractChangeStartProcess',
    invoiceApplication: 'invoiceStartProcess',
    purchaseApplication: 'purchaseStartProcess',
    purchaseCommissionDecisionApplication: 'purchaseCommissionDecisionStartProcess',
    subscriptionApplication: 'subscriptionStartProcess',
    purchaseContractApplication: 'purchaseContractStartProcess',
    licensePurchaseContractApplication: 'licensePurchaseContractStartProcess',
    bomPurchaseContractApplication: 'bomPurchaseContractStartProcess',
    bomPurchaseOrderApplication: 'bomPurchaseOrderStartProcess',
    purchaseContractPayApplication: 'purchaseContractPayStartProcess',
    acceptApply: 'acceptApplyStartProcess',
    bomPurchaseContractPayApplication: 'bomPurchaseContractPayStartProcess',
}

export default {
    async get(tag) {
        const { default: SaveApi } = await import(
            /* webpackChunkName: "flow-save-api" */ '@/api/myFlow/operate/save.js'
        )
        const apiName = TAG_TO_API[tag] || tag
        const handler = SaveApi[apiName]
        if (typeof handler !== 'function') {
            throw new Error(`SaveOperate: 未找到 componentTag="${tag}" 对应的 save 接口（已尝试 api="${apiName}"）`)
        }
        return handler
    },
}