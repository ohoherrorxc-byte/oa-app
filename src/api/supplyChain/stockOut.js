import request from '@/router/axios';

// 提单
export const submitLadingNo = (data) => {
  return request({
    url: '/api/oa-portal/financeStockOut/submitLadingNo',
    method: 'post',
    data
  })
}
// 出库
export const submit = (data) => {
  return request({
    url: '/api/oa-portal/financeStockOut/submit',
    method: 'post',
    data
  })
}
// 删除
export const stockOutDelete = (params) => {
  return request({
    url: '/api/oa-portal/financeStockOut/delete',
    method: 'get',
    params
  })
}
// 库存详情
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/financeStock/out/detail',
    method: 'get',
    params
  })
}
// 出库列表
export const selectPage = (params) => {
  return request({
    url: '/api/oa-portal/financeStockOut/selectPage',
    method: 'get',
    params
  })
}
