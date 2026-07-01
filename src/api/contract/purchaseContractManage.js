import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseContract/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getListAllP = (current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseContract/selectList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getMyList = (userId, current, size, params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseContract/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId
    }
  })
}

