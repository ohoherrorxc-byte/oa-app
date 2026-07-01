import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/licenseSeries/price/page',
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
    url: '/api/oa-portal/licenseSeries/price/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/licenseSeries/price/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/licenseSeries/price/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/licenseSeries/price/update',
    method: 'post',
    data: row
  })
}


  // export const getOwners = ( ) => {
  //   return request({
  //     url: '/api/oa-portal/licenseSeries/internetVehicle/getOwners',
  //     method: 'get'
  //   })
// }

// export const getSeriesNames = ( ) => {
//   return request({
//     url: '/api/oa-portal/licenseSeries/internetVehicle/getSeriesNames',
//     method: 'get'
//   })
// }

