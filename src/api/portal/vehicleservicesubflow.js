import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/vehicleservicesubflow/page',
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
    url: '/api/oa-portal/vehicleservicesubflow/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/vehicleservicesubflow/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/vehicleservicesubflow/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/vehicleservicesubflow/submit',
    method: 'post',
    data: row
  })
}

export const exportExcel = (ids) => {
  const formData = new FormData();
  formData.append('ids', ids);
  return request({
    url: '/api/oa-portal/vehicleservicesubflow/export',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}

