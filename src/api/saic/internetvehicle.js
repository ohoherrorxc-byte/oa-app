import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/licenseSeries/internetVehicle/list',
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
    url: '/api/oa-portal/licenseSeries/internetVehicle/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/licenseSeries/internetVehicle/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/licenseSeries/internetVehicle/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/licenseSeries/internetVehicle/update',
    method: 'post',
    data: row
  })
}


  export const getOwners = ( ) => {
    return request({
      url: '/api/oa-portal/licenseSeries/internetVehicle/getOwners',
      method: 'get'
    })
}

export const getSeriesNames = ( ) => {
  return request({
    url: '/api/oa-portal/licenseSeries/internetVehicle/getSeriesNames',
    method: 'get'
  })
}

