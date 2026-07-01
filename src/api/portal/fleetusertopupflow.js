import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    //url: '/api/oa-portal/fleetusertopupflow/list',
    url: '/api/oa-portal/fleetusertopupflow/page',
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
    url: '/api/oa-portal/fleetusertopupflow/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/fleetusertopupflow/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/fleetusertopupflow/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/fleetusertopupflow/submit',
    method: 'post',
    data: row
  })
}

export const exportExcel = (ids) => {
  const formData = new FormData();
  formData.append('ids', ids);
  return request({
    url: '/api/oa-portal/fleetusertopupflow/export',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}

export const exportExcelAll = (params) => {
  return request({
    url: '/api/oa-portal/fleetusertopupflow/export-all',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}
