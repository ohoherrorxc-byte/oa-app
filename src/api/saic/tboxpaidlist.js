import request from '@/router/axios';

export const getList = (current, size,params) => {
  return request({
    url: '/api/oa-portal/license/tbox/getpaidlist',
    method: 'post',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const exportList = (params) => {
  return request({
    url: '/api/oa-portal/license/tbox/getpaidlist/export',
    method: 'post',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}


