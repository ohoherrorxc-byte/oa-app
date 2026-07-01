import request from '@/router/axios';

export default class substituteOrderManageApi {
    //订单新建
    static insert(data) {
        return request({
            url: '/api/oa-portal/purchasePartsOrder/insert',
            method: 'post',
            data
        })
    }
    //订单保存
    static save(data) {
        return request({
            url: '/api/oa-portal/purchasePartsOrder/save',
            method: 'post',
            data
        })
    }
    //发送邮箱
    static sendEmail = (data) => {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/sendEmail`,
            method: 'post',
            data
        })
    }
    //修改预测库存
    static addOrUpdatePredictStock(data) {
        return request({
            url: '/api/oa-portal/purchasePartsOrder/addOrUpdatePredictStock',
            method: 'post',
            data
        })
    }
    //零件列表
    static selectSaleInnerListByPartsNo(params) {
        return request({
            url: `/api/oa-portal/stockOut/selectSaleInnerListByPartsNo`,
            method: 'get',
            params
        })
    }
    //修改预测库存
    static addOrUpdatePredictStockOne(data) {
        return request({
            url: '/api/oa-portal/purchasePartsOrder/addOrUpdatePredictStockOne',
            method: 'post',
            data
        })
    }
    //订单详情
    static detail(id) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/detail?id=${id}`,
            method: 'get',
        })
    }
    //物料交付
    static saveUpdatePlan(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/saveUpdatePlan`,
            method: 'post',
            data
        })
    }
    //操作日志查询
    static log(id) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/log?id=${id}`,
            method: 'get',
        })
    }
    //订单删除
    static remove(id) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/remove?id=${id}`,
            method: 'get',
        })
    }
    //删除交付入库
    static removeInStorage() {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/removeInStorage?id=${id}`,
            method: 'get',
        })
    }
    //删除交付
    static removePlan() {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/removePlan?id=${id}`,
            method: 'get',
        })
    }
    //提交交付计划
    static savePlan(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/savePlan`,
            method: 'post',
            data
        })
    }
    //供应商订单状态一览表
    static supplierOrderList(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/supplierOrderList`,
            method: 'post',
            data:data
        })
    }
    //订单列表
    static selectPage(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/selectPage`,
            method: 'post',
            data
        })
    }
    //订单列表
    static selectList(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/selectList`,
            method: 'post',
            data
        })
    }
    static selectPageTotalNumber(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/selectPageTotalNumber`,
            method: 'post',
            data
        })
    }
    //订单更新
    static update(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/update`,
            method: 'post',
            data
        })
    }
    //审核交付计划
    static updatePlanStatus(data) {
        return request({
            url: `/api/oa-portal/purchasePartsOrder/updatePlanStatus`,
            method: 'post',
            data
        })
    }
    // 供应商列表
    static getContractSupplier = () => {
        return request({
            url: '/api/oa-portal/contractSupplier/list',
            method: 'get',

        })
    }

    //仓库列表
    static storeList = () => {
        return request({
            url: '/api/oa-portal/store/selectPage?current=1&size=100',
            method: 'get',

        })
    }
    //计划员
    static planUser = () => {
        return request({
            url: '/api/oa-portal/purchasePartsOrder/planUser',
            method: 'get',

        })
    }
    //导入
    static importOrder = () => {
        return request({
            url: '/api/oa-portal/store/importOrder',
            method: 'get',

        })
    }
    //导出

    static exportOrder = () => {
        return request({
            url: '/api/oa-portal/purchasePartsOrder/exportOrder',
            method: 'get',
            responseType: 'blob'
        })
    }

    static updateInStorage = (data) => {
        return request({
            url: '/api/oa-portal/purchasePartsOrder/updateInStorage',
            method: 'post',
            data
        })
    }
    static partsMaintList = (data) => {
        return request({
            url: '/api/oa-portal/partsMaint/selectlist',
            method: 'get',
        })
    }
    static partsMaintListBySupplier = (supplierNo) => {
        return request({
            url: '/api/oa-portal/partsMaint/listBySupplier',
            method: 'get',
            params: { supplierNo }
        })
    }
}