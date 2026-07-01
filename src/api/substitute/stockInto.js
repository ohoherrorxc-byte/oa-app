import request from '@/router/axios';

// 新增编辑库存
export const saveOrUpdate = (data) => {
  return request({
    url: '/api/oa-portal/stockIn/saveOrUpdate',
    method: 'post',
    data
  })
}
// 保存备注
export const updateStockInRemarkOrFile = (data) => {
  return request({
    url: '/api/oa-portal/stockIn/updateStockInRemarkOrFile',
    method: 'post',
    data
  })
}

// 保存备注
export const updateStockOutRemark = (data) => {
  return request({
    url: '/api/oa-portal/stockIn/updateStockOutRemark',
    method: 'post',
    data
  })
}
// 更新绑定发票状态
export const updateStockInvoice = (data) => {
  return request({
    url: '/api/oa-portal/stockIn/updateStockInvoice',
    method: 'post',
    data
  })
}

// 保存附件
export const updateStockOutFile = (data) => {
  return request({
    url: '/api/oa-portal/stockIn/updateStockOutFile',
    method: 'post',
    data
  })
}
// 提交
export const submit = (params) => {
  return request({
    url: '/api/oa-portal/stockIn/submit',
    method: 'get',
    params
  })
}
// 库存详情
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/stockIn/detail',
    method: 'get',
    params
  })
}
// 仓库列表
export const select = (params) => {
  return request({
    url: '/api/oa-portal/store/select',
    method: 'get',
    params
  })
}
// 仓库删除
export const stockDelete = (params) => {
  return request({
    url: '/api/oa-portal/stockIn/delete',
    method: 'get',
    params
  })
}

// 根据零件号查询物流订单
export const getOrderInfoByPartsNumber = (params) => {
  return request({
    url: '/api/oa-portal/purchasePartsOrder/getOrderInfoByPartsNumber',
    method: 'get',
    params
  })
}
