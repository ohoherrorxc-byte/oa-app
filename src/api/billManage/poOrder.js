import request from '@/router/axios';

// PO订单生成规则保存
export const saveOrUpdate = (data) => {
  return request({
    url: '/api/oa-portal/licenseOrderRule/saveOrUpdate',
    method: 'post',
    data
  })
}
// 订单规则列表
export const selectList = (params) => {
  return request({
    url: '/api/oa-portal/licenseOrderRule/selectList',
    method: 'get',
    params: {
      ...params,
    }
  })
}
// 车系
export const getSeriesName = (params) => {
  return request({
    url: '/api/oa-portal/contractLicenseSeries/getSeriesName',
    method: 'post',
    params: {
      ...params,
    }
  })
}
// 销售订单收款状态确认口
export const collectionConfirm = (params) => {
  return request({
    url: '/api/oa-portal/saleOrder/collectionConfirm',
    method: 'post',
    params: {
      ...params,
    }
  })
}
// 销售订单收款状态确认口
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/saleOrder/detail',
    method: 'get',
    params
  })
}
// 汇总接口
export const getTotalAmount = (params) => {
  return request({
    url: '/api/oa-portal/saleOrder/getTotalAmount',
    method: 'get',
    params
  })
}
// 发票详情
export const invoiceDetail = (params) => {
  return request({
    url: '/api/oa-portal/invoice/detail',
    method: 'get',
    params
  })
}
//验证出库数量
export const testStockOutNum = (data) => {
  return request({
    url: '/api/oa-portal/invoice/testStockOutNum',
    method: 'post',
    data
  })
}
// 发票详情
export const invoiceUpdateDetail = (params) => {
  return request({
    url: '/api/oa-portal/invoiceUpdate/detail',
    method: 'get',
    params
  })
}
// 发票新增或修改
export const invoiceSaveOrUpdate = (data) => {
  return request({
    url: '/api/oa-portal/invoice/saveOrUpdate',
    method: 'post',
    data
  })
}
// 发票流程开启
export const invoiceStartProcess = (data) => {
  return request({
    url: '/api/oa-portal/invoice/startProcess',
    method: 'post',
    data
  })
}
// 发票流程开启
export const getSalesOrderList = (params) => {
  return request({
    url: '/api/oa-portal/saleOrder/selectList',
    method: 'get',
    params
  })
}
// 根据url获取图片
export const getImageByUrl = (params) => {
  return request({
    url: '/api/oa-portal/file/getImageByUrl',
    responseType: 'blob',
    method: 'get',
    params
  })
}
export const mergeSalesOrder = (params) => {
  return request({
    url: '/api/oa-portal/saleOrder/mergeSalesOrder',
    method: 'post',
    params
  })
}

// 获取联系人列表
export const getCustContactList = (params) => {
  return request({
    url: '/api/oa-portal/contractCustomer/getCustContactList',
    method: 'get',
    params
  })
}
// 获取发票审核历史
export const getTaskHis = (params) => {
  return request({
    url: '/api/oa-flow/process/history-flow-list',
    method: 'get',
    params
  })
}

//发票保存
export const saveInvoice = (data) => {
  return request({
    url: '/api/oa-portal/invoice/saveOrUpdate',
    method: 'post',
    data
  })
}
