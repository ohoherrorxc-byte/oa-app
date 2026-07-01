import request from '@/router/axios';

export const getList = (current, size,params) => {
  return request({
    url: '/api/oa-portal/license/map/list',
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
    url: '/api/oa-portal/license/map/exportmaplist',
    method: 'post',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}

export const getSupplier = (licenseSupplier) => {
  return request({
    url: '/api/oa-portal/voice/getSupplier',
    method: 'get',
    params: {
      licenseSupplier,
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/license/map/submit',
    method: 'post',
    data: row
  })
}


