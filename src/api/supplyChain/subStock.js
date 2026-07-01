import request from '@/router/axios';

// 库存列表
export const selectPage = (params) => {
  return request({
    url: '/api/oa-portal/financeCategoryStock/selectPage',
   method: 'get',
    params
  })
}
// 预出库
export const save= (data) => {
  return request({
    url: '/api/oa-portal/financeCategoryStockOut/save',
    method: 'post',
    data
  })
}
// 库存详情
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/financeCategoryStock/detail',
    method: 'get',
    params
  })
}

