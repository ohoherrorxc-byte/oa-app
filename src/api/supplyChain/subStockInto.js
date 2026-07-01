import request from '@/router/axios';

// 新增编辑库存
export const saveOrUpdate = (data) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockIn/saveOrUpdate',
    method: 'post',
    data
  })
}
// 保存备注
export const updateStockInRemark = (data) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockIn/updateStockInRemark',
    method: 'post',
    data
  })
}

// 保存备注
export const updateStockOutRemark = (data) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockIn/updateStockOutRemark',
    method: 'post',
    data
  })
}
// 提交
export const submit = (params) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockIn/submit',
    method: 'get',
    params
  })
}
// 库存详情
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockIn/detail',
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
    url: '/api/oa-portal/financeCategoryStockIn/delete',
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
