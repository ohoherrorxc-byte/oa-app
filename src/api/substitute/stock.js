import request from '@/router/axios';

// 库存列表
export const selectPage = (params) => {
  return request({
    url: '/api/oa-portal/stock/selectPage',
   method: 'get',
    params
  })
}

// 库存列表
export const selectPageSummary = (params) => {
  return request({
    url: '/api/oa-portal/stock/selectPageSummary',
   method: 'get',
    params
  })
}
//库存导出
export const exportPage = (params) => {
  return request({
    url: '/api/oa-portal/stock/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}
export const exportAll = (params) => {
  return request({
    url: '/api/oa-portal/stock/exportAll',
    method: 'get',
    responseType: 'blob',
    params
  })
}


// 库存数量
export const stockTotalNum = (params) => {
  return request({
    url: '/api/oa-portal/stock/stockTotalNum',
    method: 'get',
    params
  })
}
// 预出库
export const save= (data) => {
  return request({
    url: '/api/oa-portal/stockOut/save',
    method: 'post',
    data
  })
}
// 库存详情
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/stock/detail',
    method: 'get',
    params
  })
}

