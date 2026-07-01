import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/license/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/oa-portal/license/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/license/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/license/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/license/submit',
    method: 'post',
    data: row
  })
}

export const updateBatch = (vinList, status, orderId, updateType, supplierName) => {
  return request({
    url: '/api/oa-portal/license/update-batch',
    method: 'post',
    params: {
      vinList,
      status,
      orderId,
      updateType,
      supplierName
    }
  })
}

export const getTree = (params) => {
  return request({
    url: '/api/oa-portal/license/series-model-tree',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const exportExcelAll = (params) => {
  return request({
    url: '/api/oa-portal/license/export-all',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}
