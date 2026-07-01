import request from '@/router/axios';

// 提单
export const submitLadingNo = (data) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockOut/submitLadingNo',
    method: 'post',
    data
  })
}
// 出库
export const submit = (data) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockOut/submit',
    method: 'post',
    data
  })
}
// 删除
export const stockOutDelete = (params) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockOut/delete',
    method: 'get',
    params
  })
}
// 库存详情
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/stock/out/detail',
    method: 'get',
    params
  })
}
// 出库列表
export const selectPage = (params) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockOut/selectPage',
    method: 'get',
    params
  })
}
